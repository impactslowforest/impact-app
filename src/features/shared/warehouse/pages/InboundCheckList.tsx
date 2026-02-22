import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'check_code', label: 'Check Code' },
  { key: 'lot_detail_code', label: 'Lot Detail Code' },
  { key: 'check_date', label: 'Check Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'total_bag_weight_kg', label: 'Total Bag Weight (kg)' },
  { key: 'number_of_bags', label: 'Bags' },
  { key: 'weight_per_bag_kg', label: 'Per Bag (kg)' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
  { key: 'remark', label: 'Remark', searchable: false },
];

const seasonOpts = [
  { value: '2023/2024', label: '2023/2024' },
  { value: '2024/2025', label: '2024/2025' },
  { value: '2025/2026', label: '2025/2026' },
];

const filters: FilterDef[] = [
  { key: 'date', label: 'Check Date', type: 'date_range', field: 'check_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
];

interface Props { country?: string; }

export default function InboundCheckList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('inbound_check_details', 'Inbound check details')}
      collection="inbound_check_details"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
    />
  );
}
