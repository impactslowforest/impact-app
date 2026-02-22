import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

interface ProcessingTabProps {
  country: string;
  farmerId?: string | null;
  farmerName?: string | null;
}

/* ─── Column definitions ─── */

const farmerLogColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'eu_organic_kg', label: 'EU Organic (kg)' },
  { key: 'fairtrade_kg', label: 'Fairtrade (kg)' },
  { key: 'non_certificate_kg', label: 'Non-Cert (kg)' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'number_of_bags', label: 'Bags' },
  { key: 'weight_total_kg', label: 'Total (kg)' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'season', label: 'Season' },
];

const farmLogColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'certificate', label: 'Certificate' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'number_of_bags', label: 'Bags' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)' },
  { key: 'weight_total_kg', label: 'Total (kg)' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'season', label: 'Season' },
];

const harvestingLogColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'variety', label: 'Variety' },
  { key: 'species', label: 'Species' },
  { key: 'picking_date', label: 'Picking Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'cherry_picked_kg', label: 'Cherry (kg)' },
  { key: 'eu_organic_kg', label: 'EU Organic (kg)' },
  { key: 'fairtrade_kg', label: 'Fairtrade (kg)' },
  { key: 'non_certificate_kg', label: 'Non-Cert (kg)' },
  { key: 'ripe_pulped_kg', label: 'Ripe Pulped (kg)' },
  { key: 'wet_parchment_kg', label: 'Wet Parch (kg)' },
  { key: 'dry_parchment_kg', label: 'Dry Parch (kg)' },
  { key: 'drying_days', label: 'Drying Days' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'status', label: 'Status' },
  { key: 'season', label: 'Season' },
];

const lotDetailColumns: ColumnDef[] = [
  { key: 'lot_code', label: 'Lot Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'certificate', label: 'Certificate' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'aw_level', label: 'AW Level' },
  { key: 'number_of_bags', label: 'Bags' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)' },
  { key: 'weight_total_kg', label: 'Total (kg)' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'sale_status', label: 'Sale Status' },
  { key: 'season', label: 'Season' },
];

type DrillLevel = 'farmer_log' | 'farm_log' | 'harvesting_log' | 'lot_detail';

interface DrillState {
  level: DrillLevel;
  farmerLogId?: string;
  farmerLogCode?: string;
  farmLogId?: string;
  farmLogCode?: string;
  farmId?: string;
  farmName?: string;
  harvestingLogId?: string;
  harvestingLogCode?: string;
}

export function ProcessingTab({ country, farmerId, farmerName }: ProcessingTabProps) {
  const { t } = useTranslation('common');

  const [drill, setDrill] = useState<DrillState>({ level: 'farmer_log' });

  // Build base filter: country + optional farmer context from management tab
  let baseCountryFilter = country ? `country = "${country}"` : '';
  if (farmerId && drill.level === 'farmer_log') {
    const farmerFilter = `farmer = "${farmerId}"`;
    baseCountryFilter = baseCountryFilter ? `${baseCountryFilter} && ${farmerFilter}` : farmerFilter;
  }
  const countryFilter = baseCountryFilter;

  // Drill-down handlers
  const handleSelectFarmerLog = (id: string, record: Record<string, unknown>) => {
    setDrill({
      level: 'farm_log',
      farmerLogId: id,
      farmerLogCode: String(record.log_code || (record.expand as any)?.farmer?.full_name || id),
    });
  };

  const handleSelectFarmLog = (id: string, record: Record<string, unknown>) => {
    setDrill(prev => ({
      ...prev,
      level: 'harvesting_log',
      farmLogId: id,
      farmLogCode: String(record.log_code || id),
      farmId: String(record.farm || ''),
      farmName: String((record.expand as any)?.farm?.farm_name || record.log_code || id),
    }));
  };

  const handleSelectHarvestingLog = (id: string, record: Record<string, unknown>) => {
    setDrill(prev => ({
      ...prev,
      level: 'lot_detail',
      harvestingLogId: id,
      harvestingLogCode: String(record.log_code || id),
    }));
  };

  const handleBack = () => {
    if (drill.level === 'lot_detail') {
      setDrill(prev => ({
        level: 'harvesting_log',
        farmerLogId: prev.farmerLogId,
        farmerLogCode: prev.farmerLogCode,
        farmLogId: prev.farmLogId,
        farmLogCode: prev.farmLogCode,
        farmId: prev.farmId,
        farmName: prev.farmName,
      }));
    } else if (drill.level === 'harvesting_log') {
      setDrill(prev => ({
        level: 'farm_log',
        farmerLogId: prev.farmerLogId,
        farmerLogCode: prev.farmerLogCode,
      }));
    } else if (drill.level === 'farm_log') {
      setDrill({ level: 'farmer_log' });
    }
  };

  // Build breadcrumb
  const isNotTop = drill.level !== 'farmer_log';
  const isFarmOrDeeper = drill.level === 'farm_log' || drill.level === 'harvesting_log' || drill.level === 'lot_detail';
  const isHarvestOrDeeper = drill.level === 'harvesting_log' || drill.level === 'lot_detail';

  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    {
      label: t('farmer_logbooks', 'Farmer Logbooks'),
      onClick: isNotTop ? () => setDrill({ level: 'farmer_log' }) : undefined,
    },
  ];

  if (isFarmOrDeeper) {
    breadcrumbs.push({
      label: drill.farmerLogCode || t('farm_logbooks', 'Farm Logbooks'),
      onClick: isHarvestOrDeeper ? () => setDrill({
        level: 'farm_log',
        farmerLogId: drill.farmerLogId,
        farmerLogCode: drill.farmerLogCode,
      }) : undefined,
    });
  }

  if (isHarvestOrDeeper) {
    breadcrumbs.push({
      label: drill.farmName || t('harvesting_logs', 'Harvesting Logs'),
      onClick: drill.level === 'lot_detail' ? () => setDrill({
        level: 'harvesting_log',
        farmerLogId: drill.farmerLogId,
        farmerLogCode: drill.farmerLogCode,
        farmLogId: drill.farmLogId,
        farmLogCode: drill.farmLogCode,
        farmId: drill.farmId,
        farmName: drill.farmName,
      }) : undefined,
    });
  }

  if (drill.level === 'lot_detail') {
    breadcrumbs.push({
      label: drill.harvestingLogCode || t('lot_details', 'Lot Details'),
    });
  }

  // Season options for filter
  const seasonOptions = [
    { value: '2023/2024', label: '2023/2024' },
    { value: '2024/2025', label: '2024/2025' },
    { value: '2025/2026', label: '2025/2026' },
  ];

  // Filter definitions per drill level
  const farmerLogFilters: FilterDef[] = [
    { key: 'farmer_name', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer.full_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const farmLogFilters: FilterDef[] = [
    { key: 'farm_name', label: t('farm', 'Farm'), type: 'text', field: 'farm.farm_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const harvestingFilters: FilterDef[] = [
    { key: 'farmer_name', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer.full_name' },
    { key: 'farm_name', label: t('farm', 'Farm'), type: 'text', field: 'farm.farm_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
    { key: 'date', label: t('picking_date', 'Picking Date'), type: 'date_range', field: 'picking_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const lotDetailFilters: FilterDef[] = [
    { key: 'farm_name', label: t('farm', 'Farm'), type: 'text', field: 'farm.farm_name' },
    { key: 'certificate', label: t('certificate', 'Certificate'), type: 'text', field: 'certificate' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  // Build filter for current level
  let currentFilter = countryFilter;
  let currentTitle = t('farmer_logbooks', 'Farmer Logbooks');
  let currentCollection = 'farmer_log_books';
  let currentColumns = farmerLogColumns;
  let currentFilterDefs: FilterDef[] = farmerLogFilters;
  let onRowClick: ((id: string, record: Record<string, unknown>) => void) | undefined = handleSelectFarmerLog;

  if (drill.level === 'farm_log') {
    currentCollection = 'farm_log_books';
    currentColumns = farmLogColumns;
    currentTitle = t('farm_logbooks', 'Farm Logbooks');
    currentFilterDefs = farmLogFilters;
    onRowClick = handleSelectFarmLog;
    if (drill.farmerLogId) {
      const farmerLogFilter = `farmer_log_book = "${drill.farmerLogId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${farmerLogFilter}` : farmerLogFilter;
    }
  } else if (drill.level === 'harvesting_log') {
    currentCollection = 'harvesting_logs';
    currentColumns = harvestingLogColumns;
    currentTitle = t('harvesting_logs', 'Harvesting Logs');
    currentFilterDefs = harvestingFilters;
    onRowClick = handleSelectHarvestingLog;
    if (drill.farmId) {
      const farmFilter = `farm = "${drill.farmId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${farmFilter}` : farmFilter;
    }
  } else if (drill.level === 'lot_detail') {
    currentCollection = 'log_book_details';
    currentColumns = lotDetailColumns;
    currentTitle = t('lot_details', 'Lot Details');
    currentFilterDefs = lotDetailFilters;
    onRowClick = undefined;
    if (drill.farmLogId) {
      const farmLogFilter = `farm_log_book = "${drill.farmLogId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${farmLogFilter}` : farmLogFilter;
    }
  }

  // Determine expand based on current collection
  let currentExpand: string | undefined;
  if (drill.level === 'farmer_log') currentExpand = 'farmer';
  else if (drill.level === 'farm_log') currentExpand = 'farm';
  else if (drill.level === 'harvesting_log') currentExpand = 'farmer,farm';
  else if (drill.level === 'lot_detail') currentExpand = 'farm';

  return (
    <div className="space-y-3">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-1.5 text-sm">
        {drill.level !== 'farmer_log' && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 px-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                className="text-primary hover:underline font-medium"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="font-semibold text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Active filter badges */}
      {(drill.level !== 'farmer_log' || (farmerId && farmerName)) && (
        <div className="flex items-center gap-2 flex-wrap">
          {farmerId && farmerName && drill.level === 'farmer_log' && (
            <Badge variant="secondary" className="text-xs">
              {t('farmer', 'Farmer')}: {farmerName}
            </Badge>
          )}
          {drill.farmerLogCode && (
            <Badge variant="secondary" className="text-xs">
              {t('farmer_log', 'Farmer Log')}: {drill.farmerLogCode}
            </Badge>
          )}
          {isHarvestOrDeeper && drill.farmName && (
            <Badge variant="secondary" className="text-xs">
              {t('farm', 'Farm')}: {drill.farmName}
            </Badge>
          )}
          {drill.level === 'lot_detail' && drill.harvestingLogCode && (
            <Badge variant="secondary" className="text-xs">
              {t('harvesting_log', 'Harvest')}: {drill.harvestingLogCode}
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <PbCollectionTable
        key={`${currentCollection}-${farmerId || ''}-${drill.farmerLogId || ''}-${drill.farmId || ''}-${drill.harvestingLogId || ''}`}
        title={currentTitle}
        collection={currentCollection}
        columns={currentColumns}
        baseFilter={currentFilter}
        sort="-created"
        expand={currentExpand}
        onRowClick={onRowClick}
        filterDefs={currentFilterDefs}
      />
    </div>
  );
}

export default ProcessingTab;
