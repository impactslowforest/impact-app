import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sprout, Plus, Search, Pencil, Trash2, Eye, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import DataExportBar from '@/components/shared/DataExportBar';
import LocationFilter from '@/components/shared/LocationFilter';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useFarms, useDeleteFarm, useFarmersList } from '../hooks/useCooperativeData';

interface FarmTabProps {
  country: string;
  farmerFilter?: string | null;
  farmerName?: string | null;
  onSelectFarm?: (farmId: string, farmName: string) => void;
  onViewProcessing?: (farmerId: string, farmerName: string) => void;
  onClearFarmerFilter?: () => void;
}

const productionSystemColors: Record<string, string> = {
  monoculture: 'bg-gray-100 text-gray-600',
  intercropping: 'bg-blue-100 text-blue-700',
  agroforestry: 'bg-green-100 text-green-700',
  mixed: 'bg-purple-100 text-purple-700',
};

const certificationColors: Record<string, string> = {
  none: 'bg-gray-100 text-gray-600',
  organic: 'bg-green-100 text-green-700',
  transitional: 'bg-yellow-100 text-yellow-700',
  conventional: 'bg-blue-100 text-blue-700',
};

const commodityColors: Record<string, string> = {
  coffee: 'bg-amber-100 text-amber-700',
  cacao: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
};

// Group definitions for detail dialog
const FARM_DETAIL_GROUPS = [
  {
    title: 'Identity & Location',
    fields: [
      'farm_code', 'farm_name', 'farmer', 'country', 'village', 'district', 'province',
      'latitude', 'longitude', 'elevation_m', 'map_sheet',
    ],
  },
  {
    title: 'Land & Production',
    fields: [
      'area_ha', 'commodity', 'production_system', 'land_tenure_status', 'management_type',
      'main_crop_species', 'planting_year', 'entry_date',
      'mature_area_ha', 'immature_area_ha', 'organic_area_ha', 'organic_conversion_date',
      'registered_agroforestry', 'slope',
    ],
  },
  {
    title: 'Trees & Shade',
    fields: [
      'coffee_trees_count', 'shade_trees_count', 'shade_trees_before', 'shade_trees_past',
      'pffp_shade_trees', 'surviving_pffp_trees', 'number_of_species',
      'shade_level_pct', 'plant_density_spacing', 'intercropped_species',
    ],
  },
  {
    title: 'Certification & Compliance',
    fields: [
      'certification_status', 'tree_health_status', 'eudr_status',
      'forbidden_chem_use', 'contamination_risk_level',
      'non_conformity_history', 'correction_status', 'corrective_action',
    ],
  },
  {
    title: 'Yield & Harvest',
    fields: [
      'forecast_yield_arabica_kg', 'forecast_yield_robusta_kg',
      'annual_cherry_yield_kg', 'volume_to_slow_kg',
    ],
  },
  {
    title: 'Inputs & Disease Management',
    fields: [
      'fertilizer_mix', 'fertilizer_source', 'fertilizer_apply_date',
      'seedling_quality_note', 'replanting_date',
      'has_disease', 'disease_type', 'pest_management_method', 'treatment_method',
      'herbal_agent_used', 'banned_chem_name',
      'shared_sprayer_use', 'sprayer_cleaning_log',
    ],
  },
  {
    title: 'Environment & Risk',
    fields: [
      'soil_type', 'border_natural_forest', 'buffer_zone_details',
      'water_pollution_risk', 'air_pollution_risk',
      'protection_method', 'dist_to_chemical_farm_km',
      'high_risk_detail', 'past_issue_desc',
      'farm_tools_inventory',
    ],
  },
  {
    title: 'Distance & Access',
    fields: [
      'distance_to_drymill_km', 'distance_to_office_km',
    ],
  },
  {
    title: 'Land Certificates (Indo)',
    fields: [
      'land_certificate', 'land_ownership_certificate',
    ],
  },
  {
    title: 'Species & Tree Index Data (JSON)',
    fields: [
      'species_data', 'tree_index_data',
    ],
  },
  {
    title: 'Fertilizer & Pesticide Detail (JSON)',
    fields: [
      'agroforestry_fertilizer_data', 'chemical_fertilizer_data',
      'compost_data', 'pesticide_detail_data', 'ra_compliance_data',
    ],
  },
  {
    title: 'System',
    fields: [
      'id', 'qr_code', 'is_active', 'created', 'updated',
    ],
  },
];

export function FarmTab({
  country,
  farmerFilter,
  farmerName,
  onSelectFarm,
  onViewProcessing,
  onClearFarmerFilter,
}: FarmTabProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('all');
  const [productionFilter, setProductionFilter] = useState('all');
  const [locationFilters, setLocationFilters] = useState({ province: 'all', district: 'all', village: 'all' });
  const [page, setPage] = useState(1);
  const [detailRecord, setDetailRecord] = useState<Record<string, unknown> | null>(null);

  const filters: Record<string, string> = {
    commodity: commodityFilter,
    production_system: productionFilter,
    ...locationFilters,
  };
  if (farmerFilter) filters.farmer = farmerFilter;

  const { data, isLoading, error } = useFarms(country, search, filters, page);
  const deleteMutation = useDeleteFarm();
  const { data: farmers } = useFarmersList(country);

  const exportColumns = useMemo(() => FARM_DETAIL_GROUPS.flatMap(g =>
    g.fields.map(f => ({ key: f, label: f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))
  ), []);

  const exportData = useMemo(() =>
    (data?.items || []).map(item => {
      const rec: Record<string, unknown> = {};
      for (const col of exportColumns) {
        const v = (item as unknown as Record<string, unknown>)[col.key];
        rec[col.key] = typeof v === 'object' && v !== null ? JSON.stringify(v) : v ?? '';
      }
      return rec;
    }),
  [data?.items, exportColumns]);

  const farmerMap = new Map<string, string>();
  farmers?.forEach((f) => { farmerMap.set(f.id, f.full_name); });

  const getFarmerName = (farm: Record<string, unknown>): string => {
    const expanded = (farm.expand as Record<string, Record<string, unknown>> | undefined)?.farmer?.full_name as string;
    return expanded || farmerMap.get(farm.farmer as string) || '—';
  };

  const handleEdit = (item: Record<string, unknown>) => {
    navigate(`${ROUTES.FARM_FORM}?country=${country}&id=${item.id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    const params = new URLSearchParams({ country });
    if (farmerFilter) params.set('farmer', farmerFilter);
    navigate(`${ROUTES.FARM_FORM}?${params.toString()}`);
  };

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  };

  const formatLabel = (field: string): string => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Farmer filter badge */}
        {farmerFilter && farmerName && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <span className="text-xs">{t('filtered_by_farmer')}: <strong>{farmerName}</strong></span>
              {onClearFarmerFilter && (
                <button type="button" onClick={onClearFarmerFilter}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          </div>
        )}

        {/* Search + Filters + Add */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_farms')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={commodityFilter} onValueChange={(v) => { setCommodityFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t('commodity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="coffee">{t('coffee')}</SelectItem>
              <SelectItem value="cacao">{t('cacao')}</SelectItem>
              <SelectItem value="other">{t('other')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={productionFilter} onValueChange={(v) => { setProductionFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('production_system')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="monoculture">{t('monoculture')}</SelectItem>
              <SelectItem value="intercropping">{t('intercropping')}</SelectItem>
              <SelectItem value="agroforestry">{t('agroforestry')}</SelectItem>
              <SelectItem value="mixed">{t('mixed')}</SelectItem>
            </SelectContent>
          </Select>
          <LocationFilter
            country={country}
            onFilterChange={(loc) => { setLocationFilters(loc); setPage(1); }}
          />
          <Button size="sm" className="bg-primary-700 hover:bg-primary-800 text-white" onClick={handleAdd}>
            <Plus className="mr-1.5 h-4 w-4" />{t('add_farm')}
          </Button>
          <DataExportBar
            data={exportData}
            columns={exportColumns}
            filename={`farms_${country}`}
            sheetName="Farms"
            totalLabel={data ? `${data.totalItems} ${t('total')}` : undefined}
          />
        </div>

        {/* Table */}
        {error ? (
          <div className="text-center py-12 text-red-500">
            <p className="font-medium">{t('error_loading')}</p>
            <p className="text-xs mt-1">{(error as Error).message}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <Sprout className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t('no_farms')}</p>
            <Button size="sm" className="mt-3 bg-primary-700 text-white" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />{t('add_first_farm')}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">Code</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('farm_name')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('farmer')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">Ha</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('commodity')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('production_system')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('certification')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('village')}</TableHead>
                    <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5 w-[140px]">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((farm) => {
                    const farmRecord = farm as unknown as Record<string, unknown>;
                    return (
                      <TableRow
                        key={farm.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                        onClick={() => setDetailRecord(farmRecord)}
                      >
                        <TableCell className="text-[13px] font-mono font-bold text-primary-700 whitespace-nowrap px-4 py-3">
                          {farm.farm_code}
                        </TableCell>
                        <TableCell className="text-[13px] font-medium text-gray-800 whitespace-nowrap max-w-[180px] truncate px-4 py-3">
                          {farm.farm_name}
                        </TableCell>
                        <TableCell className="text-[13px] text-gray-600 whitespace-nowrap max-w-[150px] truncate px-4 py-3">
                          {getFarmerName(farmRecord)}
                        </TableCell>
                        <TableCell className="text-[13px] text-gray-600 whitespace-nowrap px-4 py-3">
                          {farm.area_ha > 0 ? farm.area_ha : '—'}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {farm.commodity && (
                            <Badge className={`text-xs border-0 ${commodityColors[farm.commodity as string] || ''}`}>
                              {farm.commodity}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {farm.production_system && (
                            <Badge className={`text-xs border-0 ${productionSystemColors[farm.production_system as string] || ''}`}>
                              {farm.production_system}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {farm.certification_status && farm.certification_status !== 'none' && (
                            <Badge className={`text-xs border-0 ${certificationColors[farm.certification_status as string] || ''}`}>
                              {farm.certification_status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[13px] text-gray-600 whitespace-nowrap max-w-[120px] truncate px-4 py-3">
                          {farm.village || '—'}
                        </TableCell>
                        <TableCell className="px-4 py-2" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button type="button" title={t('view_harvests')}
                              onClick={() => onSelectFarm?.(farm.id, farm.farm_name as string)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" title={t('edit')}
                              onClick={() => handleEdit(farmRecord)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" title={t('delete')}
                              onClick={() => handleDelete(farm.id)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {t('page')} {page} / {data.totalPages} ({data.totalItems} {t('total')})
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Farm Detail Dialog (ALL fields, grouped) */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => { if (!open) setDetailRecord(null); }}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-700" />
              {(detailRecord?.farm_name as string) || 'Farm Detail'}
            </DialogTitle>
            <DialogDescription>
              {detailRecord?.farm_code as string} — {getFarmerName(detailRecord || {})} — {country}
            </DialogDescription>
          </DialogHeader>

          {/* Action buttons — top of dialog */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Button variant="outline" size="sm" onClick={() => {
              if (detailRecord) {
                const rec = detailRecord;
                setDetailRecord(null);
                onSelectFarm?.(rec.id as string, rec.farm_name as string);
              }
            }} className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {t('view_harvests')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              if (detailRecord) {
                const rec = detailRecord;
                setDetailRecord(null);
                const fId = rec.farmer as string;
                const fName = getFarmerName(rec);
                if (fId) onViewProcessing?.(fId, fName);
              }
            }} className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {t('view_logbooks', 'Logbooks')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              if (detailRecord) {
                setDetailRecord(null);
                navigate(`${ROUTES.FARM_FORM}?country=${country}&id=${detailRecord.id}`);
              }
            }} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              {t('edit')}
            </Button>
            <Button size="sm" onClick={() => setDetailRecord(null)} className="ml-auto">
              {t('close')}
            </Button>
          </div>

          {detailRecord && (
            <div className="space-y-6">
              {FARM_DETAIL_GROUPS.map(group => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-primary-800 border-b border-primary-100 pb-1 mb-2">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {group.fields.map(field => {
                      const val = detailRecord[field];
                      return (
                        <div key={field} className="flex py-1 gap-2">
                          <Label className="text-xs text-gray-500 w-2/5 shrink-0">{formatLabel(field)}</Label>
                          <span className={`text-xs break-words ${val && val !== '—' ? 'text-gray-900' : 'text-gray-400'}`}>
                            {typeof val === 'object' && val !== null ? (
                              <pre className="text-[11px] bg-gray-50 rounded p-1 max-h-24 overflow-auto">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            ) : formatValue(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </DialogContent>
      </Dialog>

    </>
  );
}
