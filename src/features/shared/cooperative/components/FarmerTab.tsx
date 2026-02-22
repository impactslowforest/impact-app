import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Sprout, X, ChevronRight, Eye, ChevronLeft, BookOpen } from 'lucide-react';
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
import { useFarmers, useDeleteFarmer, useCooperativesList } from '../hooks/useCooperativeData';

interface FarmerTabProps {
  country: string;
  cooperativeFilter?: string | null;
  cooperativeName?: string | null;
  onSelectFarmer: (farmerId: string, farmerName: string) => void;
  onViewProcessing?: (farmerId: string, farmerName: string) => void;
  onClearCooperativeFilter?: () => void;
}

const genderBadgeColors: Record<string, string> = {
  male: 'bg-blue-100 text-blue-700',
  female: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-600',
};

const certBadgeColors: Record<string, string> = {
  none: 'bg-gray-100 text-gray-600',
  organic: 'bg-green-100 text-green-700',
  transitional: 'bg-yellow-100 text-yellow-700',
  fair_trade: 'bg-blue-100 text-blue-700',
  multiple: 'bg-purple-100 text-purple-700',
};

// Group definitions for detail dialog
const FARMER_DETAIL_GROUPS = [
  {
    title: 'Identity & Contact',
    fields: [
      'farmer_code', 'full_name', 'gender', 'date_of_birth', 'id_card_number',
      'phone', 'village', 'commune', 'district', 'province', 'address',
      'farmer_group_name', 'country',
    ],
  },
  {
    title: 'Household & Demographics',
    fields: [
      'ethnicity', 'household_size', 'household_type', 'female_members',
      'income_earners', 'members_under_16', 'residence_status',
      'socioeconomic_status', 'household_circumstances', 'education_level',
    ],
  },
  {
    title: 'Coffee Area & Land',
    fields: [
      'farm_size_ha', 'total_coffee_area_ha', 'number_of_plots',
      'mature_coffee_area_ha', 'immature_coffee_area_ha', 'organic_area_ha',
      'organic_conversion_date', 'land_certificate_status', 'type_of_area',
    ],
  },
  {
    title: 'Certification & Compliance',
    fields: [
      'certification_status', 'existing_certifications_detail',
      'converted_after_dec2020', 'deforestation_conversion_date',
      'land_legal_origin_docs', 'forbidden_chemical_used',
    ],
  },
  {
    title: 'Production & Financial',
    fields: [
      'avg_cherry_price', 'total_cash_income', 'production_cost', 'other_income',
      'income_sources', 'total_household_income',
      'input_debt', 'interest_rate_per_month', 'current_debt', 'remaining_cash',
    ],
  },
  {
    title: 'Inputs & Inventory',
    fields: [
      'seed_source', 'seed_quantity_kg', 'organic_fertilizer_kg',
      'chemical_fertilizer_kg', 'microbial_fertilizer_kg',
      'biological_pesticide_kg', 'chemical_pesticide_kg',
      'shared_sprayer_used',
    ],
  },
  {
    title: 'Ecosystem & Biodiversity',
    fields: [
      'shade_tree_density_per_ha', 'shade_tree_species', 'vegetation_cover_pct',
      'natural_forest_area_ha', 'soil_conservation', 'water_conservation',
      'waste_management', 'poultry_count', 'pig_count', 'cattle_count', 'buffalo_count',
    ],
  },
  {
    title: 'Commercial (Slow Forest)',
    fields: [
      'cherry_sales_committed_kg', 'cherry_sales_actual_kg',
      'revenue_from_slow', 'processor_channel',
    ],
  },
  {
    title: 'Project Support',
    fields: [
      'supported_by', 'farm_registered_for_support',
      'training_attendance', 'op6_activities',
    ],
  },
  {
    title: 'Location & GPS',
    fields: [
      'latitude', 'longitude', 'distance_to_home_km', 'observation_stations',
    ],
  },
  {
    title: 'System',
    fields: [
      'id', 'registration_date', 'is_active', 'qr_code', 'registered_by',
      'created', 'updated',
    ],
  },
];

export function FarmerTab({
  country,
  cooperativeFilter,
  cooperativeName,
  onSelectFarmer,
  onViewProcessing,
  onClearCooperativeFilter,
}: FarmerTabProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({
    cooperative: cooperativeFilter || 'all',
    gender: 'all',
    certification_status: 'all',
    province: 'all',
    district: 'all',
    village: 'all',
  });
  const [detailRecord, setDetailRecord] = useState<Record<string, unknown> | null>(null);

  const activeFilters = {
    ...filters,
    cooperative: cooperativeFilter || filters.cooperative,
  };

  const { data, isLoading, error } = useFarmers(country, search, activeFilters, page);
  const deleteFarmer = useDeleteFarmer();
  const { data: cooperatives } = useCooperativesList(country);

  const exportColumns = useMemo(() => FARMER_DETAIL_GROUPS.flatMap(g =>
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleEdit = (item: Record<string, unknown>) => {
    navigate(`${ROUTES.FARMER_FORM}?country=${country}&id=${item.id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      deleteFarmer.mutate(id);
    }
  };

  const handleAdd = () => {
    const params = new URLSearchParams({ country });
    if (cooperativeFilter) params.set('cooperative', cooperativeFilter);
    navigate(`${ROUTES.FARMER_FORM}?${params.toString()}`);
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
        {/* Header: cooperative filter badge */}
        {cooperativeFilter && cooperativeName && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <Sprout className="h-3.5 w-3.5" />
              {cooperativeName}
              {onClearCooperativeFilter && (
                <button type="button" onClick={onClearCooperativeFilter}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5 transition-colors">
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
              placeholder={t('search_farmers')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          {country === 'laos' && !cooperativeFilter && (
            <Select value={filters.cooperative} onValueChange={(v) => handleFilterChange('cooperative', v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('cooperative')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {cooperatives?.map((coop) => (
                  <SelectItem key={coop.id} value={coop.id}>{coop.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.gender} onValueChange={(v) => handleFilterChange('gender', v)}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder={t('gender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="male">{t('male')}</SelectItem>
              <SelectItem value="female">{t('female')}</SelectItem>
              <SelectItem value="other">{t('other')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.certification_status} onValueChange={(v) => handleFilterChange('certification_status', v)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t('certification')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="none">{t('none')}</SelectItem>
              <SelectItem value="organic">{t('organic')}</SelectItem>
              <SelectItem value="transitional">{t('transitional')}</SelectItem>
              <SelectItem value="fair_trade">{t('fair_trade')}</SelectItem>
              <SelectItem value="multiple">{t('multiple')}</SelectItem>
            </SelectContent>
          </Select>

          <LocationFilter
            country={country}
            onFilterChange={({ province, district, village }) => {
              setFilters(prev => ({ ...prev, province, district, village }));
              setPage(1);
            }}
          />
          <Button size="sm" className="bg-primary-700 hover:bg-primary-800 text-white" onClick={handleAdd}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t('add_farmer')}
          </Button>
          <DataExportBar
            data={exportData}
            columns={exportColumns}
            filename={`farmers_${country}`}
            sheetName="Farmers"
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
            <p>{t('no_farmers')}</p>
            <Button size="sm" className="mt-3 bg-primary-700 text-white" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />{t('add_first_farmer')}
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">Code</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">{t('full_name')}</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">{t('gender')}</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">{t('phone')}</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">{t('village')}</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">Ha</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5">{t('certification')}</TableHead>
                    <TableHead className="font-bold text-white text-[10px] uppercase tracking-widest whitespace-nowrap bg-primary-700 px-4 py-2.5 w-[140px]">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((farmer) => (
                    <TableRow
                      key={farmer.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                      onClick={() => setDetailRecord(farmer as unknown as Record<string, unknown>)}
                    >
                      <TableCell className="text-[13px] font-mono font-bold text-primary-700 whitespace-nowrap px-4 py-3">
                        {farmer.farmer_code}
                      </TableCell>
                      <TableCell className="text-[13px] font-medium text-gray-800 whitespace-nowrap px-4 py-3">
                        {farmer.full_name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {farmer.gender && (
                          <Badge className={`text-xs ${genderBadgeColors[farmer.gender] || 'bg-gray-100 text-gray-600'}`}>
                            {t(farmer.gender)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] text-gray-600 whitespace-nowrap px-4 py-3">
                        {farmer.phone || '—'}
                      </TableCell>
                      <TableCell className="text-[13px] text-gray-600 whitespace-nowrap max-w-[150px] truncate px-4 py-3">
                        {farmer.village || '—'}
                      </TableCell>
                      <TableCell className="text-[13px] text-gray-600 whitespace-nowrap px-4 py-3">
                        {farmer.farm_size_ha > 0 ? farmer.farm_size_ha : '—'}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {farmer.certification_status && farmer.certification_status !== 'none' && (
                          <Badge className={`text-xs ${certBadgeColors[farmer.certification_status] || ''}`}>
                            {t(farmer.certification_status)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button type="button" title={t('view_farms')}
                            onClick={() => onSelectFarmer(farmer.id, farmer.full_name)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title={t('edit')}
                            onClick={() => handleEdit(farmer as unknown as Record<string, unknown>)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" title={t('delete')}
                            onClick={() => handleDelete(farmer.id)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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

      {/* Farmer Detail Dialog (ALL fields, grouped) */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => { if (!open) setDetailRecord(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-[#F9F5EF]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base text-primary-800">
              <Eye className="h-5 w-5 text-primary-600" />
              {(detailRecord?.full_name as string) || 'Farmer Detail'}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-primary-600/70">
              {detailRecord?.farmer_code as string} — {country}
            </DialogDescription>
          </DialogHeader>

          {/* Action buttons — top of dialog */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-primary-100/50">
            <Button variant="ghost" size="sm" onClick={() => {
              if (detailRecord) {
                const rec = detailRecord;
                setDetailRecord(null);
                onSelectFarmer(rec.id as string, rec.full_name as string);
              }
            }} className="h-7 gap-1 text-[11px] text-primary-700 hover:bg-primary-50 rounded-md px-2">
              <Sprout className="h-3 w-3" />
              {t('view_farms')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              if (detailRecord) {
                const rec = detailRecord;
                setDetailRecord(null);
                onViewProcessing?.(rec.id as string, rec.full_name as string);
              }
            }} className="h-7 gap-1 text-[11px] text-primary-700 hover:bg-primary-50 rounded-md px-2">
              <BookOpen className="h-3 w-3" />
              {t('view_logbooks', 'Logbooks')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              if (detailRecord) {
                setDetailRecord(null);
                navigate(`${ROUTES.FARMER_FORM}?country=${country}&id=${detailRecord.id}`);
              }
            }} className="h-7 gap-1 text-[11px] text-primary-700 hover:bg-primary-50 rounded-md px-2">
              <Pencil className="h-3 w-3" />
              {t('edit')}
            </Button>
          </div>

          {detailRecord && (
            <div className="space-y-4">
              {FARMER_DETAIL_GROUPS.map(group => (
                <div key={group.title} className="rounded-lg overflow-hidden border border-primary-100/50">
                  {/* Section header */}
                  <div className="bg-primary-700 px-3 py-2">
                    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{group.title}</h3>
                  </div>
                  {/* Rows */}
                  <div className="divide-y divide-primary-50/80">
                    {group.fields.map((field, idx) => {
                      const val = detailRecord[field];
                      const hasValue = val !== null && val !== undefined && val !== '' && val !== 0 && val !== false;
                      return (
                        <div key={field} className={`flex items-baseline gap-3 px-3 py-2.5 ${idx % 2 === 0 ? 'bg-white/60' : 'bg-[#F9F5EF]/60'}`}>
                          <span className="text-[12px] font-semibold text-primary-600 w-2/5 shrink-0">{formatLabel(field)}</span>
                          <span className={`text-[13px] font-medium break-words flex-1 ${hasValue ? 'text-[#1a3a3a]' : 'text-gray-300'}`}>
                            {typeof val === 'object' && val !== null ? (
                              <pre className="text-[11px] bg-white/80 rounded p-1.5 max-h-24 overflow-auto font-mono">
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
