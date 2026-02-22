import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'inbound_code', label: 'Inbound Code' },
  { key: 'source', label: 'Source' },
  { key: 'input_type', label: 'Input Type' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'village_name', label: 'Village', field: 'farm.village' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'request_date', label: 'Request Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'total_bags', label: 'Bags' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'weight_total_kg', label: 'Total (kg)' },
  { key: 'check_bags', label: 'Check Bags' },
  { key: 'check_moisture_pct', label: 'Check Moisture %' },
  { key: 'check_weight_kg', label: 'Check Weight (kg)' },
  { key: 'status', label: 'Status' },
  { key: 'approval_status', label: 'Approval' },
  { key: 'vehicle_number', label: 'Vehicle' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

const seasonOpts = [
  { value: '2023/2024', label: '2023/2024' },
  { value: '2024/2025', label: '2024/2025' },
  { value: '2025/2026', label: '2025/2026' },
];

const filters: FilterDef[] = [
  { key: 'farmer', label: 'Farmer', type: 'text', field: 'farmer.full_name' },
  { key: 'village', label: 'Village', type: 'text', field: 'farm.village' },
  { key: 'date', label: 'Request Date', type: 'date_range', field: 'request_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
  { key: 'status', label: 'Status', type: 'select', field: 'status', options: [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
  ]},
];

interface Props { country?: string; }

export default function InboundRequestList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('inbound_requests', 'Inbound requests')}
      collection="inbound_requests"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
      expand="farmer,farm,supplier"
    />
  );
}
