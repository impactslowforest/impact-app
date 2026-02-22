import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft, BookOpen, Leaf, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';
import { renderStatus } from '@/components/shared/StatusBadge';
import pb from '@/config/pocketbase';

interface LogbookTabProps {
  country: string;
}

/* ─── Column definitions ─── */

const farmerLogColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code', readonly: true },
  { key: 'farmer', label: 'Farmer (ID)', readonly: true, hideInTable: true },
  { key: 'village_code', label: 'Village Code', readonly: true },
  { key: 'farmer_name', label: 'Farmer', readonly: true },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'eu_organic_kg', label: 'EU Organic (kg)', readonly: true },
  { key: 'fairtrade_kg', label: 'Fairtrade (kg)', readonly: true },
  { key: 'non_certificate_kg', label: 'Non-Cert (kg)', readonly: true },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %', inputType: 'number' },
  { key: 'aw_level', label: 'AW Level', inputType: 'number' },
  { key: 'number_of_bags', label: 'Bags', readonly: true },
  { key: 'weight_total_kg', label: 'Total (kg)', readonly: true },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'staff_input', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const farmLogColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code', readonly: true },
  { key: 'farm', label: 'Farm (ID)', readonly: true, hideInTable: true },
  { key: 'village_code', label: 'Village Code', readonly: true },
  { key: 'farm_name', label: 'Farm', readonly: true },
  { key: 'certificate', label: 'Certificate' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %', inputType: 'number' },
  { key: 'aw_level', label: 'AW Level', inputType: 'number' },
  { key: 'number_of_bags', label: 'Bags', inputType: 'number' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)', inputType: 'number' },
  { key: 'weight_total_kg', label: 'Total (kg)', inputType: 'number' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'staff_input', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const logDetailColumns: ColumnDef[] = [
  { key: 'lot_code', label: 'Lot Code', readonly: true },
  { key: 'farm_log_book', label: 'Farm Log Book (ID)', readonly: true, hideInTable: true },
  { key: 'village_code', label: 'Village Code', readonly: true },
  { key: 'farm_name', label: 'Farm', readonly: true },
  { key: 'certificate', label: 'Certificate' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'dry_mill_name', label: 'Dry Mill' },
  { key: 'moisture_pct', label: 'Moisture %', inputType: 'number' },
  { key: 'aw_level', label: 'AW Level', inputType: 'number' },
  { key: 'number_of_bags', label: 'Bags', inputType: 'number' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)', inputType: 'number' },
  { key: 'weight_total_kg', label: 'Total (kg)', inputType: 'number' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'sale_status', label: 'Sale Status', render: renderStatus },
  { key: 'staff_input', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const harvestingColumns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code', readonly: true },
  { key: 'farm', label: 'Farm (ID)', readonly: true, hideInTable: true },
  { key: 'village_code', label: 'Village Code', readonly: true },
  { key: 'village_name', label: 'Village', readonly: true },
  { key: 'farmer_name', label: 'Farmer', readonly: true },
  { key: 'farm_name', label: 'Farm', readonly: true },
  { key: 'variety', label: 'Variety' },
  { key: 'species', label: 'Species' },
  { key: 'picking_date', label: 'Picking Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'cherry_picked_kg', label: 'Cherry (kg)', inputType: 'number' },
  { key: 'eu_organic_kg', label: 'EU Organic (kg)', inputType: 'number' },
  { key: 'fairtrade_kg', label: 'Fairtrade (kg)', inputType: 'number' },
  { key: 'non_certificate_kg', label: 'Non-Cert (kg)', inputType: 'number' },
  { key: 'ripe_pulped_kg', label: 'Ripe Pulped (kg)', inputType: 'number' },
  { key: 'float_rate_kg', label: 'Float Rate (kg)', inputType: 'number' },
  { key: 'fermentation_hours', label: 'Ferment (hrs)', inputType: 'number' },
  { key: 'wet_parchment_kg', label: 'Wet Parch (kg)', inputType: 'number' },
  { key: 'dry_parchment_kg', label: 'Dry Parch (kg)', inputType: 'number' },
  { key: 'drying_days', label: 'Drying Days', inputType: 'number' },
  { key: 'moisture_pct', label: 'Moisture %', inputType: 'number' },
  { key: 'stored_at', label: 'Stored At' },
  { key: 'status', label: 'Status', render: renderStatus },
  { key: 'staff_input', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

type TopView = 'logbooks' | 'harvesting_all';
type DrillLevel = 'farmer_logbook' | 'farm_logbook' | 'farm_detail';
type DetailView = 'log_detail' | 'harvesting';

interface DrillState {
  level: DrillLevel;
  farmerLogId?: string;
  farmerLogCode?: string;
  farmerId?: string;
  farmLogId?: string;
  farmLogCode?: string;
  farmId?: string;
}

export function LogbookTab({ country }: LogbookTabProps) {
  const { t } = useTranslation('common');

  const [topView, setTopView] = useState<TopView>('logbooks');
  const [drill, setDrill] = useState<DrillState>({ level: 'farmer_logbook' });
  const [detailView, setDetailView] = useState<DetailView>('log_detail');

  // Base filter: country
  const countryFilter = country ? `country = "${country}"` : '';

  // Season options (reused across filters)
  const seasonOptions = [
    { value: '2023/2024', label: '2023/2024' },
    { value: '2024/2025', label: '2024/2025' },
    { value: '2025/2026', label: '2025/2026' },
  ];

  // Default values for create forms — pre-fill parent relations, date=today, staff=current user
  const today = new Date().toISOString().split('T')[0];
  const currentUserName = pb.authStore.record?.name || '';

  const currentDefaults = useMemo<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = { country };

    if (drill.level === 'farmer_logbook') {
      // Level 1: farmer_log_books
      return { ...base, log_date: today, staff_input: currentUserName };
    }
    if (drill.level === 'farm_logbook') {
      // Level 2: farm_log_books — pre-fill farmer_log_book + farmer
      return { ...base, farmer_log_book: drill.farmerLogId, farmer: drill.farmerId, log_date: today, staff_input: currentUserName };
    }
    // Level 3: log_book_details or harvesting_logs
    if (detailView === 'log_detail') {
      return { ...base, farm_log_book: drill.farmLogId, farm: drill.farmId, farmer: drill.farmerId, log_date: today, staff_input: currentUserName };
    }
    return { ...base, farm: drill.farmId, farmer: drill.farmerId, picking_date: today, staff_input: currentUserName };
  }, [country, drill, detailView, today, currentUserName]);

  // Human-readable display values for readonly fields in form dialog
  const readonlyDisplay = useMemo<Record<string, string>>(() => {
    const display: Record<string, string> = {};

    if (drill.level === 'farm_logbook') {
      // Level 2: show farmer logbook code
      if (drill.farmerLogCode) display.farmer_log_book = drill.farmerLogCode;
      if (drill.farmerId) display.farmer = drill.farmerLogCode || drill.farmerId;
    } else if (drill.level === 'farm_detail') {
      // Level 3: show farm logbook code + farmer code
      if (drill.farmLogCode) display.farm_log_book = drill.farmLogCode;
      if (drill.farmId) display.farm = drill.farmLogCode || drill.farmId;
      if (drill.farmerId) display.farmer = drill.farmerLogCode || drill.farmerId;
    }

    return display;
  }, [drill]);

  // ─── Top-level: "All Harvesting Logs" view ───
  if (topView === 'harvesting_all') {
    const harvestAllFilters: FilterDef[] = [
      { key: 'farmer', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer_name' },
      { key: 'farm', label: t('farm', 'Farm'), type: 'text', field: 'farm_name' },
      { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
      { key: 'date', label: t('picking_date', 'Picking Date'), type: 'date_range', field: 'picking_date' },
      { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
    ];

    return (
      <div className="space-y-3">
        {/* Top-level view toggle */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTopView('logbooks')}
            className="gap-1.5"
          >
            <ClipboardList className="h-4 w-4" />
            {t('farmer_log_books', 'Farmer Logbooks')}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
          >
            <Leaf className="h-4 w-4" />
            {t('harvesting_logs', 'Harvesting Logs')}
          </Button>
        </div>

        <PbCollectionTable
          key="harvesting_logs_all"
          title={t('harvesting_logs', 'Harvesting Logs')}
          collection="harvesting_logs"
          columns={harvestingColumns}
          baseFilter={countryFilter}
          sort="-created"
          filterDefs={harvestAllFilters}
          showBack={false}
          defaultValues={{ country, picking_date: today, staff_input: currentUserName }}
        />
      </div>
    );
  }

  // ─── Drill-down view: Farmer Logbooks → Farm Logbooks → Details ───

  // Drill-down handlers
  const handleSelectFarmerLog = (id: string, record: Record<string, unknown>) => {
    setDrill({
      level: 'farm_logbook',
      farmerLogId: id,
      farmerLogCode: String(record.log_code || record.farmer_name || id),
      farmerId: String(record.farmer || ''),
    });
  };

  const handleSelectFarmLog = (id: string, record: Record<string, unknown>) => {
    setDrill(prev => ({
      ...prev,
      level: 'farm_detail',
      farmLogId: id,
      farmLogCode: String(record.log_code || record.farm_name || id),
      farmId: String(record.farm || ''),
    }));
    setDetailView('log_detail');
  };

  const handleBack = () => {
    if (drill.level === 'farm_detail') {
      setDrill(prev => ({
        level: 'farm_logbook',
        farmerLogId: prev.farmerLogId,
        farmerLogCode: prev.farmerLogCode,
        farmerId: prev.farmerId,
      }));
    } else if (drill.level === 'farm_logbook') {
      setDrill({ level: 'farmer_logbook' });
    }
  };

  // Breadcrumbs — only show current + parent (1-level back)
  const isNotTop = drill.level !== 'farmer_logbook';
  const isDetailLevel = drill.level === 'farm_detail';

  const breadcrumbs: { label: string; onClick?: () => void }[] = [];

  if (drill.level === 'farm_logbook') {
    breadcrumbs.push(
      { label: t('farmer_log_books', 'Farmer Logbooks'), onClick: () => setDrill({ level: 'farmer_logbook' }) },
      { label: drill.farmerLogCode || t('farm_log_books', 'Farm Logbooks') },
    );
  } else if (isDetailLevel) {
    breadcrumbs.push(
      {
        label: drill.farmerLogCode || t('farm_log_books', 'Farm Logbooks'),
        onClick: () => setDrill({
          level: 'farm_logbook',
          farmerLogId: drill.farmerLogId,
          farmerLogCode: drill.farmerLogCode,
          farmerId: drill.farmerId,
        }),
      },
      { label: drill.farmLogCode || t('log_book_details', 'Details') },
    );
  }

  // Filter definitions per level
  const farmerLogFilters: FilterDef[] = [
    { key: 'farmer', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const farmLogFilters: FilterDef[] = [
    { key: 'farm', label: t('farm', 'Farm'), type: 'text', field: 'farm_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_code' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const logDetailFilters: FilterDef[] = [
    { key: 'farm', label: t('farm', 'Farm'), type: 'text', field: 'farm_name' },
    { key: 'date', label: t('log_date', 'Log Date'), type: 'date_range', field: 'log_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  const harvestingFilters: FilterDef[] = [
    { key: 'farmer', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer_name' },
    { key: 'farm', label: t('farm', 'Farm'), type: 'text', field: 'farm_name' },
    { key: 'date', label: t('picking_date', 'Picking Date'), type: 'date_range', field: 'picking_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  // Build current level config
  let currentFilter = countryFilter;
  let currentTitle = t('farmer_log_books', 'Farmer Logbooks');
  let currentCollection = 'farmer_log_books';
  let currentColumns = farmerLogColumns;
  let currentFilterDefs: FilterDef[] = farmerLogFilters;
  let onRowClick: ((id: string, record: Record<string, unknown>) => void) | undefined = handleSelectFarmerLog;

  if (drill.level === 'farm_logbook') {
    currentCollection = 'farm_log_books';
    currentColumns = farmLogColumns;
    currentTitle = t('farm_log_books', 'Farm Logbooks');
    currentFilterDefs = farmLogFilters;
    onRowClick = handleSelectFarmLog;

    // Filter by parent relation OR farmer relation (handles imported data without parent FK)
    if (drill.farmerLogId) {
      const parentFilter = drill.farmerId
        ? `(farmer_log_book = "${drill.farmerLogId}" || farmer = "${drill.farmerId}")`
        : `farmer_log_book = "${drill.farmerLogId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${parentFilter}` : parentFilter;
    }
  } else if (drill.level === 'farm_detail') {
    if (detailView === 'log_detail') {
      currentCollection = 'log_book_details';
      currentColumns = logDetailColumns;
      currentTitle = t('log_book_details', 'Log Book Details');
      currentFilterDefs = logDetailFilters;
      onRowClick = undefined;

      // Filter by farm_log_book OR farm (handles imported data without parent FK)
      if (drill.farmLogId) {
        const detailFilter = drill.farmId
          ? `(farm_log_book = "${drill.farmLogId}" || farm = "${drill.farmId}")`
          : `farm_log_book = "${drill.farmLogId}"`;
        currentFilter = currentFilter ? `${currentFilter} && ${detailFilter}` : detailFilter;
      }
    } else {
      currentCollection = 'harvesting_logs';
      currentColumns = harvestingColumns;
      currentTitle = t('harvesting_logs', 'Harvesting Logs');
      currentFilterDefs = harvestingFilters;
      onRowClick = undefined;

      // Harvesting logs: use farm relation (more reliable for imported data
      // since farm_log_book relation was added later in migration 026)
      if (drill.farmId) {
        const farmFilter = `farm = "${drill.farmId}"`;
        currentFilter = currentFilter ? `${currentFilter} && ${farmFilter}` : farmFilter;
      } else if (drill.farmLogId) {
        const farmFilter = `farm_log_book = "${drill.farmLogId}"`;
        currentFilter = currentFilter ? `${currentFilter} && ${farmFilter}` : farmFilter;
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Top-level view toggle (only at Level 1) */}
      {drill.level === 'farmer_logbook' && (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
          >
            <ClipboardList className="h-4 w-4" />
            {t('farmer_log_books', 'Farmer Logbooks')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTopView('harvesting_all')}
            className="gap-1.5"
          >
            <Leaf className="h-4 w-4" />
            {t('harvesting_logs', 'Harvesting Logs')}
          </Button>
        </div>
      )}

      {/* Breadcrumb navigation (only when drilled down) */}
      {isNotTop && (
        <div className="flex items-center gap-1.5 text-sm">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 px-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
      )}

      {/* Context badges */}
      {isNotTop && (
        <div className="flex items-center gap-2 flex-wrap">
          {drill.farmerLogCode && (
            <Badge variant="secondary" className="text-xs">
              {t('farmer_logbook', 'Farmer Logbook')}: {drill.farmerLogCode}
            </Badge>
          )}
          {isDetailLevel && drill.farmLogCode && (
            <Badge variant="secondary" className="text-xs">
              {t('farm_logbook', 'Farm Logbook')}: {drill.farmLogCode}
            </Badge>
          )}
        </div>
      )}

      {/* Detail view toggle at Level 3 */}
      {isDetailLevel && (
        <div className="flex gap-2">
          <Button
            variant={detailView === 'log_detail' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDetailView('log_detail')}
            className="gap-1.5"
          >
            <BookOpen className="h-4 w-4" />
            {t('log_book_details', 'Log Book Details')}
          </Button>
          <Button
            variant={detailView === 'harvesting' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDetailView('harvesting')}
            className="gap-1.5"
          >
            <Leaf className="h-4 w-4" />
            {t('harvesting_logs', 'Harvesting Logs')}
          </Button>
        </div>
      )}

      {/* Table */}
      <PbCollectionTable
        key={`${currentCollection}-${drill.farmerLogId || ''}-${drill.farmLogId || ''}-${detailView}`}
        title={currentTitle}
        collection={currentCollection}
        columns={currentColumns}
        baseFilter={currentFilter}
        sort="-created"
        onRowClick={onRowClick}
        filterDefs={currentFilterDefs}
        showBack={false}
        defaultValues={currentDefaults}
        readonlyDisplay={readonlyDisplay}
      />
    </div>
  );
}

export default LogbookTab;
