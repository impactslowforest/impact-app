import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wheat, Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import DataExportBar from '@/components/shared/DataExportBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useHarvestRecords, useDeleteHarvest,
} from '../hooks/useCooperativeData';
import { HarvestFormDialog } from './HarvestFormDialog';

interface HarvestTabProps {
  country: string;
  farmFilter?: string | null;
  farmName?: string | null;
  onClearFarmFilter?: () => void;
}

const qualityGradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  reject: 'bg-red-100 text-red-700',
};

const cropTypeColors: Record<string, string> = {
  coffee_cherry: 'bg-red-100 text-red-700',
  coffee_parchment: 'bg-amber-100 text-amber-700',
  cacao_wet: 'bg-orange-100 text-orange-700',
  cacao_dry: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-600',
};

export function HarvestTab({
  country,
  farmFilter,
  farmName,
  onClearFarmFilter,
}: HarvestTabProps) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');
  const [cropTypeFilter, setCropTypeFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

  // Build filters including farmFilter
  const filters: Record<string, string> = {
    crop_type: cropTypeFilter,
    quality_grade: qualityFilter,
  };
  if (farmFilter) filters.farm = farmFilter;

  const { data, isLoading, error } = useHarvestRecords(country, search, filters, page);
  const deleteMutation = useDeleteHarvest();

  const harvestExportFields = [
    'lot_number', 'farm', 'farmer', 'country', 'crop_type', 'variety', 'season',
    'harvest_date', 'quantity_kg', 'moisture_pct', 'quality_grade',
    'processing_method', 'price_per_kg', 'currency', 'buyer', 'notes', 'recorded_by',
  ];

  const exportColumns = useMemo(() =>
    harvestExportFields.map(f => ({ key: f, label: f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })),
  []);

  const exportData = useMemo(() =>
    (data?.items || []).map(item => {
      const rec: Record<string, unknown> = {};
      for (const col of exportColumns) {
        rec[col.key] = (item as unknown as Record<string, unknown>)[col.key] ?? '';
      }
      return rec;
    }),
  [data?.items, exportColumns]);

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Card className="rounded-xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wheat className="h-5 w-5 text-primary-600" />
              {t('harvest_records')}
              {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
            </CardTitle>
            <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
              <Plus className="mr-1.5 h-4 w-4" />{t('add_harvest')}
            </Button>
            <DataExportBar
              data={exportData}
              columns={exportColumns}
              filename={`harvests_${country}`}
              sheetName="Harvests"
              totalLabel={data ? `${data.totalItems} ${t('total')}` : undefined}
            />
          </div>

          {/* Active farm filter badge */}
          {farmFilter && farmName && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                <span className="text-xs">{t('filtered_by_farm')}: <strong>{farmName}</strong></span>
                {onClearFarmFilter && (
                  <button
                    type="button"
                    onClick={onClearFarmFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_harvests')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 rounded-lg"
              />
            </div>
            <Select value={cropTypeFilter} onValueChange={(v) => { setCropTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg">
                <SelectValue placeholder={t('crop_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="coffee_cherry">{t('coffee_cherry')}</SelectItem>
                <SelectItem value="coffee_parchment">{t('coffee_parchment')}</SelectItem>
                <SelectItem value="cacao_wet">{t('cacao_wet')}</SelectItem>
                <SelectItem value="cacao_dry">{t('cacao_dry')}</SelectItem>
                <SelectItem value="other">{t('other')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={(v) => { setQualityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px] rounded-lg">
                <SelectValue placeholder={t('quality_grade')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="reject">{t('reject')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {error ? (
            <div className="text-center py-8 text-red-500">
              <Wheat className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">{t('error_loading')}</p>
              <p className="text-xs mt-1">{(error as Error).message}</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
            </div>
          ) : !data?.items.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wheat className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t('no_harvests')}</p>
              <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />{t('add_first_harvest')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {data.items.map((harvest) => {
                const farmExpand = (harvest.expand as Record<string, Record<string, unknown>> | undefined)?.farm;
                const farmerExpand = (harvest.expand as Record<string, Record<string, unknown>> | undefined)?.farmer;
                const farmNameDisplay = (farmExpand?.farm_name as string) || '';
                const farmerNameDisplay = (farmerExpand?.full_name as string) || '';

                return (
                  <div
                    key={harvest.id}
                    className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {harvest.lot_number && (
                            <span className="font-mono text-sm font-bold text-primary-700">
                              {harvest.lot_number}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            {formatDate(harvest.harvest_date as string)}
                          </span>
                          {harvest.crop_type && (
                            <Badge className={`text-xs border-0 ${cropTypeColors[harvest.crop_type as string] || ''}`}>
                              {harvest.crop_type}
                            </Badge>
                          )}
                          {harvest.quality_grade && (
                            <Badge className={`text-xs border-0 ${qualityGradeColors[harvest.quality_grade as string] || ''}`}>
                              {t('grade')} {harvest.quality_grade}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                          {harvest.variety && (
                            <span>{t('variety')}: {harvest.variety}</span>
                          )}
                          {harvest.quantity_kg > 0 && (
                            <span className="font-medium">{harvest.quantity_kg} kg</span>
                          )}
                          {harvest.moisture_pct > 0 && (
                            <span>{harvest.moisture_pct}%</span>
                          )}
                          {harvest.processing_method && (
                            <span>{harvest.processing_method}</span>
                          )}
                          {harvest.price_per_kg > 0 && (
                            <span>{harvest.price_per_kg} {harvest.currency || 'USD'}/kg</span>
                          )}
                        </div>
                        {(farmNameDisplay || farmerNameDisplay) && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                            {farmNameDisplay && (
                              <span>{t('farm')}: {farmNameDisplay}</span>
                            )}
                            {farmerNameDisplay && (
                              <span>{t('farmer')}: {farmerNameDisplay}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 rounded-lg"
                          onClick={() => handleEdit(harvest as unknown as Record<string, unknown>)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(harvest.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    {t('previous')}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    {t('next')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <HarvestFormDialog
        country={country}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingItem={editingItem}
        preselectedFarm={farmFilter ?? undefined}
      />
    </>
  );
}
