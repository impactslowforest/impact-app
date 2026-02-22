import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef, type FilterDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'log_code', label: 'Log Code' },
  { key: 'village_code', label: 'Village Code' },
  { key: 'village_name', label: 'Village', field: 'farm.village' },
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
  { key: 'float_rate_kg', label: 'Float Rate (kg)' },
  { key: 'fermentation_hours', label: 'Ferment (hrs)' },
  { key: 'wet_parchment_kg', label: 'Wet Parch (kg)' },
  { key: 'dry_parchment_kg', label: 'Dry Parch (kg)' },
  { key: 'drying_days', label: 'Drying Days' },
  { key: 'moisture_pct', label: 'Moisture %' },
  { key: 'stored_at', label: 'Stored At' },
  { key: 'status', label: 'Status' },
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
  { key: 'farm', label: 'Farm', type: 'text', field: 'farm.farm_name' },
  { key: 'village', label: 'Village', type: 'text', field: 'village_code' },
  { key: 'date', label: 'Picking Date', type: 'date_range', field: 'picking_date' },
  { key: 'season', label: 'Season', type: 'select', field: 'season', options: seasonOpts },
];

interface Props { country?: string; }

export default function HarvestingLogList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('harvesting_logs', 'Harvesting logs')}
      collection="harvesting_logs"
      columns={columns}
      filterDefs={filters}
      baseFilter={baseFilter}
      expand="farmer,farm"
    />
  );
}
