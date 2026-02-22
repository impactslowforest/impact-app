import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'lot_code', label: 'Lot Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'farm_name', label: 'Farm' },
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
  { key: 'staff_input', label: 'Staff' },
  { key: 'season', label: 'Season' },
  { key: 'remark', label: 'Remark', searchable: false },
];

const seasonOpts = [
  { value: '2023/2024', label: '2023/2024' },
  { value: '2024/2025', label: '2024/2025' },
  { value: '2025/2026', label: '2025/2026' },
];

const filters: FilterDef[] = [
  { key: 'farm', label: 'Farm', type: 'text', field: 'farm_name' },
  { key: 'date', label: 'Log Date', type: 'date_range', field: 'log_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
];

interface Props { country?: string; }

export default function LogBookDetailList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('log_book_details', 'Log book details')}
      collection="log_book_details"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
    />
  );
}
