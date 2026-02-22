import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'check_id', label: 'Check ID' },
  { key: 'farm_name', label: 'Farm', field: 'slow_farm.name' },
  { key: 'check_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'doctor1', label: 'Doctor 1' },
  { key: 'doctor2', label: 'Doctor 2' },
  { key: 'num_kids', label: 'Kids' },
  { key: 'num_male', label: 'Male' },
  { key: 'num_female', label: 'Female' },
  { key: 'under_60_months', label: 'Under 60m' },
  { key: 'over_60_months', label: 'Over 60m' },
];

export default function DcFarmHealthCheckList() {
  return (
    <PbCollectionTable
      title="Farm Health Checks"
      collection="dc_farm_health_checks"
      columns={columns}
      expand="slow_farm"
    />
  );
}
