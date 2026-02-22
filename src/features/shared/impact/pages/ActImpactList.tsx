import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'impact_id', label: 'Impact ID' },
  { key: 'entity', label: 'Entity' },
  { key: 'category', label: 'Category' },
  { key: 'planned_budget', label: 'Planned Budget' },
  { key: 'actual_spending', label: 'Actual Spending' },
  { key: 'annual_budget', label: 'Annual Budget' },
  { key: 'balance', label: 'Balance' },
  { key: 'staff', label: 'Staff' },
  { key: 'record_date', label: 'Record Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'file_path', label: 'File Path', searchable: false },
];

export default function ActImpactList() {
  return (
    <PbCollectionTable
      title="Activity Impact Budget"
      collection="act_impacts"
      columns={columns}
      sort="-record_date"
    />
  );
}
