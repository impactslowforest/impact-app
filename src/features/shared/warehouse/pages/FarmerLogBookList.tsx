import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
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
  { key: 'aw_level', label: 'AW Level' },
  { key: 'number_of_bags', label: 'Bags' },
  { key: 'weight_total_kg', label: 'Total (kg)' },
  { key: 'delivery_date', label: 'Delivery Date', render: (v) => v ? String(v).split(' ')[0] : '' },
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
  { key: 'farmer', label: 'Farmer', type: 'text', field: 'farmer.full_name' },
  { key: 'village', label: 'Village', type: 'text', field: 'village_code' },
  { key: 'date', label: 'Log Date', type: 'date_range', field: 'log_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
];

interface Props { country?: string; }

export default function FarmerLogBookList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('farmer_log_books', 'Farmer log books')}
      collection="farmer_log_books"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
      expand="farmer"
    />
  );
}
