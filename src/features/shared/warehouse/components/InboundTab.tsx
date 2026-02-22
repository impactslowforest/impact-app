import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft, QrCode } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';
import { renderStatus } from '@/components/shared/StatusBadge';
import InboundQRScanDialog, { type LotVerificationResult } from './InboundQRScanDialog';
import InboundRequestCreateDialog from './InboundRequestCreateDialog';
import pb from '@/config/pocketbase';
import { toast } from 'sonner';

interface InboundTabProps {
  country: string;
}

/* ─── Column definitions ─── */

const requestColumns: ColumnDef[] = [
  { key: 'inbound_code', label: 'Inbound Code', readonly: true },
  { key: 'farm', label: 'Farm (ID)', readonly: true, hideInTable: true },
  { key: 'source', label: 'Source', inputType: 'select', selectOptions: [
    { value: 'Cooperative', label: 'Cooperative' },
    { value: 'Slow farm', label: 'Slow farm' },
    { value: 'Third party', label: 'Third party' },
  ]},
  { key: 'input_type', label: 'Input Type', inputType: 'select', selectOptions: [
    { value: 'QR code', label: 'QR code' },
    { value: 'Manual', label: 'Manual' },
  ]},
  { key: 'farmer_name', label: 'Farmer', readonly: true },
  { key: 'village_name', label: 'Village', readonly: true },
  { key: 'request_date', label: 'Request Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process', inputType: 'select', selectOptions: [
    { value: 'Washed', label: 'Washed' },
  ]},
  { key: 'total_bags', label: 'Bags', readonly: true },
  { key: 'weight_total_kg', label: 'Total (kg)', readonly: true },
  { key: 'check_bags', label: 'Check Bags', readonly: true },
  { key: 'check_weight_kg', label: 'Check (kg)', readonly: true },
  { key: 'status', label: 'Status', render: renderStatus },
  { key: 'approval_status', label: 'Approval', render: renderStatus },
  { key: 'vehicle_number', label: 'Vehicle' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const detailColumns: ColumnDef[] = [
  { key: 'detail_code', label: 'Detail Code', readonly: true },
  { key: 'inbound_request', label: 'Inbound Request (ID)', readonly: true, hideInTable: true },
  { key: 'lot_code', label: 'Lot Code' },
  { key: 'lot_detail_code', label: 'Lot Detail' },
  { key: 'detail_date', label: 'Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'check_result', label: 'Check Result', render: renderStatus },
  { key: 're_bags', label: 'RE Bags', inputType: 'number' },
  { key: 're_total_qty', label: 'RE Total', inputType: 'number' },
  { key: 're_moisture_pct', label: 'RE Moist %', inputType: 'number' },
  { key: 'wh_bags', label: 'WH Bags', inputType: 'number' },
  { key: 'wh_total_qty', label: 'WH Total', inputType: 'number' },
  { key: 'wh_moisture_pct', label: 'WH Moist %', inputType: 'number' },
  { key: 'quality_assessment', label: 'Quality', render: renderStatus },
  { key: 'status', label: 'Status', render: renderStatus },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const checkColumns: ColumnDef[] = [
  { key: 'check_code', label: 'Check Code', readonly: true },
  { key: 'inbound_detail', label: 'Inbound Detail (ID)', readonly: true, hideInTable: true },
  { key: 'lot_detail_code', label: 'Lot Detail' },
  { key: 'check_date', label: 'Check Date', render: (v) => v ? String(v).split(' ')[0] : '', inputType: 'date' },
  { key: 'moisture_pct', label: 'Moisture %', inputType: 'number' },
  { key: 'total_bag_weight_kg', label: 'Total Bag (kg)', inputType: 'number' },
  { key: 'number_of_bags', label: 'Bags', inputType: 'number' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)', inputType: 'number' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
  { key: 'remark', label: 'Remark', searchable: false },
];

type DrillLevel = 'inbound_request' | 'inbound_detail' | 'inbound_check';

interface DrillState {
  level: DrillLevel;
  requestId?: string;
  requestCode?: string;
  detailId?: string;
  detailCode?: string;
}

export function InboundTab({ country }: InboundTabProps) {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();

  const [drill, setDrill] = useState<DrillState>({ level: 'inbound_request' });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Base filter: country
  const countryFilter = country ? `country = "${country}"` : '';

  // Default values for create forms — pre-fill parent relations, date=today, staff=current user
  const today = new Date().toISOString().split('T')[0];
  const currentUserName = pb.authStore.record?.name || '';

  const currentDefaults = useMemo<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = { country };

    if (drill.level === 'inbound_request') {
      return { ...base, request_date: today, staff: currentUserName };
    }
    if (drill.level === 'inbound_detail') {
      return { ...base, inbound_request: drill.requestId, detail_date: today, staff: currentUserName };
    }
    // inbound_check
    return { ...base, inbound_detail: drill.detailId, inbound_request: drill.requestId, check_date: today, staff: currentUserName };
  }, [country, drill, today, currentUserName]);

  // Human-readable display values for readonly fields in form dialog
  const readonlyDisplay = useMemo<Record<string, string>>(() => {
    const display: Record<string, string> = {};

    if (drill.level === 'inbound_detail') {
      // Level 2: show inbound request code
      if (drill.requestCode) display.inbound_request = drill.requestCode;
    } else if (drill.level === 'inbound_check') {
      // Level 3: show inbound request + detail codes
      if (drill.requestCode) display.inbound_request = drill.requestCode;
      if (drill.detailCode) display.inbound_detail = drill.detailCode;
    }

    return display;
  }, [drill]);

  // Drill-down handlers
  const handleSelectRequest = (id: string, record: Record<string, unknown>) => {
    setDrill({
      level: 'inbound_detail',
      requestId: id,
      requestCode: String(record.inbound_code || record.farmer_name || id),
    });
  };

  const handleSelectDetail = (id: string, record: Record<string, unknown>) => {
    setDrill(prev => ({
      ...prev,
      level: 'inbound_check',
      detailId: id,
      detailCode: String(record.detail_code || id),
    }));
  };

  const handleBack = () => {
    if (drill.level === 'inbound_check') {
      setDrill(prev => ({
        level: 'inbound_detail',
        requestId: prev.requestId,
        requestCode: prev.requestCode,
      }));
    } else if (drill.level === 'inbound_detail') {
      setDrill({ level: 'inbound_request' });
    }
  };

  // QR scan: create inbound_request_detail from verified lot
  const handleLotVerified = async (data: LotVerificationResult) => {
    if (!drill.requestId) return;
    try {
      await pb.collection('inbound_request_details').create({
        inbound_request: drill.requestId,
        lot_code: data.lot_code,
        lot_detail_code: data.lot_detail_code,
        farm: data.farm,
        farmer: data.farmer,
        re_type: data.certificate,
        detail_date: new Date().toISOString(),
        country,
        status: 'pending',
      });
      toast.success(t('record_created', 'Record created'));
      // Refresh table
      queryClient.invalidateQueries({ queryKey: ['pb-collection', 'inbound_request_details'] });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create record');
    }
  };

  // Breadcrumbs — only show parent + current (1-level back)
  const isNotTop = drill.level !== 'inbound_request';
  const isCheckLevel = drill.level === 'inbound_check';

  const breadcrumbs: { label: string; onClick?: () => void }[] = [];

  if (drill.level === 'inbound_detail') {
    breadcrumbs.push(
      { label: t('inbound_requests', 'Inbound Requests'), onClick: () => setDrill({ level: 'inbound_request' }) },
      { label: drill.requestCode || t('inbound_details', 'Details') },
    );
  } else if (isCheckLevel) {
    breadcrumbs.push(
      {
        label: drill.requestCode || t('inbound_details', 'Details'),
        onClick: () => setDrill({
          level: 'inbound_detail',
          requestId: drill.requestId,
          requestCode: drill.requestCode,
        }),
      },
      { label: drill.detailCode || t('inbound_checks', 'Checks') },
    );
  }

  // Season options
  const seasonOptions = [
    { value: '2023/2024', label: '2023/2024' },
    { value: '2024/2025', label: '2024/2025' },
    { value: '2025/2026', label: '2025/2026' },
  ];

  // Filter definitions per level
  const requestFilters: FilterDef[] = [
    { key: 'farmer', label: t('farmer', 'Farmer'), type: 'text', field: 'farmer_name' },
    { key: 'village', label: t('village', 'Village'), type: 'text', field: 'village_name' },
    { key: 'date', label: t('request_date', 'Request Date'), type: 'date_range', field: 'request_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
    { key: 'status', label: t('status', 'Status'), type: 'select', field: 'status', options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'completed', label: 'Completed' },
    ]},
  ];

  const detailFilters: FilterDef[] = [
    { key: 'date', label: t('detail_date', 'Date'), type: 'date_range', field: 'detail_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
    { key: 'status', label: t('status', 'Status'), type: 'select', field: 'status', options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'completed', label: 'Completed' },
    ]},
  ];

  const checkFilters: FilterDef[] = [
    { key: 'date', label: t('check_date', 'Check Date'), type: 'date_range', field: 'check_date' },
    { key: 'season', label: t('season', 'Season'), type: 'select', field: 'season', options: seasonOptions },
  ];

  // Build current level config
  let currentFilter = countryFilter;
  let currentTitle = t('inbound_requests', 'Inbound Requests');
  let currentCollection = 'inbound_requests';
  let currentColumns = requestColumns;
  let currentFilterDefs: FilterDef[] = requestFilters;
  let onRowClick: ((id: string, record: Record<string, unknown>) => void) | undefined = handleSelectRequest;

  if (drill.level === 'inbound_detail') {
    currentCollection = 'inbound_request_details';
    currentColumns = detailColumns;
    currentTitle = t('inbound_details', 'Inbound Details');
    currentFilterDefs = detailFilters;
    onRowClick = handleSelectDetail;
    if (drill.requestId) {
      const parentFilter = `inbound_request = "${drill.requestId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${parentFilter}` : parentFilter;
    }
  } else if (drill.level === 'inbound_check') {
    currentCollection = 'inbound_check_details';
    currentColumns = checkColumns;
    currentTitle = t('inbound_checks', 'Inbound Checks');
    currentFilterDefs = checkFilters;
    onRowClick = undefined;
    if (drill.detailId) {
      const detailFilter = `inbound_detail = "${drill.detailId}"`;
      currentFilter = currentFilter ? `${currentFilter} && ${detailFilter}` : detailFilter;
    }
  }

  return (
    <div className="space-y-3">
      {/* Breadcrumb navigation */}
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
          {drill.requestCode && (
            <Badge variant="secondary" className="text-xs">
              {t('inbound_request', 'Request')}: {drill.requestCode}
            </Badge>
          )}
          {isCheckLevel && drill.detailCode && (
            <Badge variant="secondary" className="text-xs">
              {t('inbound_detail', 'Detail')}: {drill.detailCode}
            </Badge>
          )}
        </div>
      )}

      {/* QR Scan button at Level 2 */}
      {drill.level === 'inbound_detail' && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)} className="gap-1.5">
            <QrCode className="h-4 w-4" />
            {t('scan_qr', 'Scan QR')}
          </Button>
        </div>
      )}

      {/* Table */}
      <PbCollectionTable
        key={`${currentCollection}-${drill.requestId || ''}-${drill.detailId || ''}`}
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
        onCreateClick={drill.level === 'inbound_request' ? () => setCreateDialogOpen(true) : undefined}
      />

      {/* QR Scan Dialog */}
      <InboundQRScanDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        onLotVerified={handleLotVerified}
      />

      {/* Custom Inbound Request Create Dialog */}
      <InboundRequestCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        country={country}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['pb-collection', 'inbound_requests'] })}
      />
    </div>
  );
}

export default InboundTab;
