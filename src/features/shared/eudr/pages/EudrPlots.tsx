import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Search, FileCheck, AlertTriangle, Pencil, Map, List, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FEATURE_FLAGS } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default marker icon issue
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colored markers
const createColoredIcon = (color: string) => new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    background: ${color};
    width: 28px;
    height: 28px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      transform: rotate(45deg);
    "></div>
  </div>`,
  iconSize: [28, 34],
  iconAnchor: [14, 34],
  popupAnchor: [0, -34],
});

const markerColors: Record<string, string> = {
  registered: '#3b82f6',
  assessed: '#eab308',
  compliant: '#22c55e',
  non_compliant: '#ef4444',
  pending_review: '#f97316',
};

interface EudrPlotsProps {
  country?: string;
}

const statusColors: Record<string, string> = {
  registered: 'bg-blue-100 text-blue-700 border-blue-200',
  assessed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  compliant: 'bg-green-100 text-green-700 border-green-200',
  non_compliant: 'bg-red-100 text-red-700 border-red-200',
  pending_review: 'bg-orange-100 text-orange-700 border-orange-200',
};

const statusIcons: Record<string, React.ElementType> = {
  compliant: FileCheck,
  non_compliant: AlertTriangle,
};

type ViewMode = 'list' | 'map' | 'split';

export function EudrPlots({ country }: EudrPlotsProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const initialStatus = searchParams.get('status') || 'all';
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(FEATURE_FLAGS.SHOW_MAP ? 'split' : 'list');

  // Sync state with URL params if they change
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) setStatusFilter(status);
  }, [searchParams]);

  const canEdit = !!country;

  const goToAssessment = (plotId: string) => {
    navigate(ROUTES.EUDR_ASSESSMENT.replace(':plotId', plotId));
  };

  const buildFilter = () => {
    const parts: string[] = [];
    if (country) parts.push(`country = "${country}"`);
    if (search) parts.push(`(plot_code ~ "${search}" || plot_name ~ "${search}" || farmer.full_name ~ "${search}")`);
    if (statusFilter && statusFilter !== 'all') parts.push(`status = "${statusFilter}"`);
    return parts.length > 0 ? parts.join(' && ') : undefined;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['eudr-plots', country, search, statusFilter, page],
    queryFn: () => pb.collection('eudr_plots').getList(page, 50, {
      filter: buildFilter(),
      sort: '-created',
      expand: 'farmer',
    }),
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const createPlotMutation = useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      return pb.collection('eudr_plots').create({
        ...formData,
        registered_by: user?.id,
        registration_date: new Date().toISOString(),
        status: 'registered',
        is_active: true,
        country: formData.country || country,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['eudr-plots'] });
      await queryClient.invalidateQueries({ queryKey: ['eudr-stats'] });
      toast.success(t('saved'));
      setAddDialogOpen(false);
    },
    onError: (err) => {
      console.error('Create plot error:', err);
      toast.error(t('error'));
    },
  });

  const handleAddPlot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formDataObj: Record<string, unknown> = {};
    form.forEach((val, key) => { formDataObj[key] = val; });
    if (formDataObj.area_hectares) formDataObj.area_hectares = parseFloat(formDataObj.area_hectares as string);
    if (formDataObj.latitude) formDataObj.latitude = parseFloat(formDataObj.latitude as string);
    if (formDataObj.longitude) formDataObj.longitude = parseFloat(formDataObj.longitude as string);
    createPlotMutation.mutate(formDataObj);
  };

  // Plots with coordinates for the map
  const mappablePlots = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(
      (p) => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );
  }, [data]);

  // Map center: average of all plot coordinates, or default per country
  const mapCenter = useMemo<[number, number]>(() => {
    if (mappablePlots.length > 0) {
      const avgLat = mappablePlots.reduce((sum, p) => sum + p.latitude, 0) / mappablePlots.length;
      const avgLng = mappablePlots.reduce((sum, p) => sum + p.longitude, 0) / mappablePlots.length;
      return [avgLat, avgLng];
    }
    // Default centers by country
    const defaults: Record<string, [number, number]> = {
      vietnam: [14.0583, 108.2772],
      indonesia: [-2.5489, 118.0149],
      laos: [19.8563, 102.4955],
    };
    return country && defaults[country] ? defaults[country] : [10.0, 106.0];
  }, [mappablePlots, country]);

  const showMap = FEATURE_FLAGS.SHOW_MAP && (viewMode === 'map' || viewMode === 'split');
  const showList = viewMode === 'list' || viewMode === 'split' || !FEATURE_FLAGS.SHOW_MAP;

  return (
    <>
      <Card className="rounded-xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              {t('eudr_plots')}
              {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle - hidden when map feature is disabled */}
              {FEATURE_FLAGS.SHOW_MAP && (
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    {t('list')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={`px-2.5 py-1.5 text-xs flex items-center gap-1 border-x border-gray-200 transition-colors ${viewMode === 'split' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    {t('split')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors ${viewMode === 'map' ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <Map className="h-3.5 w-3.5" />
                    {t('map')}
                  </button>
                </div>
              )}

              {canEdit && <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-3d-primary text-white rounded-lg">
                    <Plus className="mr-1.5 h-4 w-4" />{t('add_plot')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t('register_plot')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPlot} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>{t('plot_code')} *</Label>
                        <Input name="plot_code" required placeholder="e.g. VN-001" className="rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('commodity')} *</Label>
                        <select name="commodity" required className="w-full rounded-lg border px-3 py-2 text-sm">
                          <option value="coffee">Coffee</option>
                          <option value="cacao">Cacao</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('plot_name')} *</Label>
                      <Input name="plot_name" required className="rounded-lg" />
                    </div>
                    {!country && (
                      <div className="space-y-1.5">
                        <Label>{t('country')} *</Label>
                        <select name="country" required className="w-full rounded-lg border px-3 py-2 text-sm">
                          <option value="indonesia">Indonesia</option>
                          <option value="vietnam">Vietnam</option>
                          <option value="laos">Laos</option>
                        </select>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label>{t('farmer_id')}</Label>
                      <Input name="farmer_id" className="rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>{t('province')}</Label>
                        <Input name="province" className="rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('district')}</Label>
                        <Input name="district" className="rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('village')}</Label>
                        <Input name="village" className="rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>{t('area_ha')}</Label>
                        <Input name="area_hectares" type="number" step="0.01" className="rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('latitude')}</Label>
                        <Input name="latitude" type="number" step="0.000001" className="rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('longitude')}</Label>
                        <Input name="longitude" type="number" step="0.000001" className="rounded-lg" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createPlotMutation.isPending}>
                      {t('register_plot')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_plots')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg">
                <SelectValue placeholder={t('all_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="assessed">Assessed</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {error ? (
            <div className="text-center py-8 text-red-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Error loading plots</p>
              <p className="text-xs mt-1">{(error as Error).message}</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
            </div>
          ) : !data?.items.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t('no_plots')}</p>
              {canEdit && (
                <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />{t('add_first_plot')}
                </Button>
              )}
            </div>
          ) : (
            <div className={`${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
              {/* Map View */}
              {showMap && (
                <div className={`rounded-xl overflow-hidden border border-gray-200 ${viewMode === 'map' ? '' : ''}`}>
                  <div className="bg-gray-50 px-3 py-2 border-b flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('plot_map')}</span>
                    {mappablePlots.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] ml-auto">{mappablePlots.length} {t('on_map')}</Badge>
                    )}
                  </div>
                  <div style={{ height: viewMode === 'map' ? '500px' : '380px' }}>
                    {mappablePlots.length > 0 ? (
                      <MapContainer
                        center={mapCenter}
                        zoom={mappablePlots.length === 1 ? 13 : 8}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {mappablePlots.map((plot) => (
                          <Marker
                            key={plot.id}
                            position={[plot.latitude, plot.longitude]}
                            icon={createColoredIcon(markerColors[plot.status] || '#6b7280')}
                          >
                            <Popup>
                              <div className="text-sm min-w-[180px]">
                                <div className="font-bold text-primary-800">{plot.plot_code}</div>
                                <div className="text-gray-700 mt-0.5">{plot.plot_name}</div>
                                {(plot.expand as any)?.farmer?.full_name && (
                                  <div className="text-xs text-gray-500 mt-0.5">Farmer: {(plot.expand as any).farmer.full_name}</div>
                                )}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[plot.status] || ''}`}>
                                    {plot.status?.replace('_', ' ')}
                                  </span>
                                  {plot.area_hectares > 0 && (
                                    <span className="text-xs text-gray-500">{plot.area_hectares} ha</span>
                                  )}
                                </div>
                                {canEdit && (
                                  <button
                                    className="text-xs text-primary-600 font-medium mt-2 hover:underline"
                                    onClick={() => goToAssessment(plot.id)}
                                  >
                                    {t('assess')} &rarr;
                                  </button>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-gray-50">
                        <MapPin className="h-10 w-10 opacity-20 mb-2" />
                        <p className="text-sm">{t('no_coordinates')}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{t('add_coordinates_hint')}</p>
                      </div>
                    )}
                  </div>
                  {/* Map Legend */}
                  {mappablePlots.length > 0 && (
                    <div className="bg-white px-3 py-2 border-t flex flex-wrap gap-3 text-[10px]">
                      {Object.entries(markerColors).map(([status, color]) => (
                        <span key={status} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="capitalize text-gray-600">{status.replace('_', ' ')}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {showList && (
                <div className="space-y-2">
                  {data.items.map((plot) => {
                    const StatusIcon = statusIcons[plot.status] || MapPin;
                    return (
                      <div key={plot.id} className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-primary-700">{plot.plot_code}</span>
                              <Badge className={`text-xs border ${statusColors[plot.status] || ''}`}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {plot.status?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm mt-0.5 truncate text-gray-700">{plot.plot_name}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                              {(plot.expand as any)?.farmer?.full_name && <span>Farmer: {(plot.expand as any).farmer.full_name}</span>}
                              {plot.area_hectares > 0 && <span>{plot.area_hectares} ha</span>}
                              {plot.province && <span>{plot.province}</span>}
                              {plot.latitude && plot.longitude && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="h-3 w-3" />
                                  {Number(plot.latitude).toFixed(4)}, {Number(plot.longitude).toFixed(4)}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs capitalize">{plot.commodity}</Badge>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="outline" size="sm" className="h-8 gap-1 rounded-lg"
                                onClick={() => goToAssessment(plot.id)}
                              >
                                <Pencil className="h-3 w-3" />
                                <span className="hidden sm:inline">{t('assess')}</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        {t('previous')}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {page} / {data.totalPages}
                      </span>
                      <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
                        {t('next')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
}
