import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'detail_code', label: 'Detail Code' },
  { key: 'lot_code', label: 'Lot Code' },
  { key: 'lot_detail_code', label: 'Lot Detail Code' },
  { key: 'detail_date', label: 'Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'check_result', label: 'Check Result' },
  { key: 're_type', label: 'RE Type' },
  { key: 're_organic', label: 'RE Organic' },
  { key: 're_fairtrade', label: 'RE Fairtrade' },
  { key: 're_bags', label: 'RE Bags' },
  { key: 're_qty_per_bag', label: 'RE Qty/Bag' },
  { key: 're_total_qty', label: 'RE Total' },
  { key: 're_moisture_pct', label: 'RE Moisture %' },
  { key: 'wh_type', label: 'WH Type' },
  { key: 'wh_organic', label: 'WH Organic' },
  { key: 'wh_fairtrade', label: 'WH Fairtrade' },
  { key: 'wh_bags', label: 'WH Bags' },
  { key: 'wh_qty_per_bag', label: 'WH Qty/Bag' },
  { key: 'wh_total_qty', label: 'WH Total' },
  { key: 'wh_moisture_pct', label: 'WH Moisture %' },
  { key: 'quality_assessment', label: 'Quality' },
  { key: 'status', label: 'Status' },
  { key: 'approval_status', label: 'Approval' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const seasonOpts = [
  { value: '2023/2024', label: '2023/2024' },
  { value: '2024/2025', label: '2024/2025' },
  { value: '2025/2026', label: '2025/2026' },
];

const filters: FilterDef[] = [
  { key: 'date', label: 'Date', type: 'date_range', field: 'detail_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
  { key: 'status', label: 'Status', type: 'select', field: 'status', options: [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
  ]},
];

interface Props { country?: string; }

export default function InboundDetailList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('inbound_request_details', 'Inbound request details')}
      collection="inbound_request_details"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
    />
  );
}
