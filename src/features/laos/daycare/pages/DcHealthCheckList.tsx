import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'check_record_id', label: 'Record ID' },
  { key: 'kid_name', label: 'Kid', field: 'kid.first_name' },
  { key: 'farm_name', label: 'Farm', field: 'slow_farm.name' },
  { key: 'measure_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'weight_kg', label: 'Weight kg' },
  { key: 'height_cm', label: 'Height cm' },
  { key: 'muac_cm', label: 'MUAC cm' },
  { key: 'bmi_index', label: 'BMI' },
  { key: 'waz_assessment', label: 'WAZ' },
  { key: 'haz_assessment', label: 'HAZ' },
  { key: 'whz_assessment', label: 'WHZ' },
  { key: 'baz_assessment', label: 'BAZ' },
];

export default function DcHealthCheckList() {
  return (
    <PbCollectionTable
      title="Health Checks"
      collection="dc_health_checks"
      columns={columns}
      expand="kid,slow_farm"
    />
  );
}
