import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'plan_id', label: 'Plan ID' },
  { key: 'entity_id', label: 'Entity' },
  { key: 'category_id', label: 'Category' },
  { key: 'budget_plan', label: 'Budget Plan' },
  { key: 'budget_total', label: 'Budget Total' },
  { key: 'budget_plan_balance', label: 'Balance' },
  { key: 'planned_date', label: 'Planned Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'staff', label: 'Staff' },
  { key: 'record_date', label: 'Record Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'file_path', label: 'File Path', searchable: false },
];

export default function ImpactPlanList() {
  return (
    <PbCollectionTable
      title="Impact Plans"
      collection="impact_plans"
      columns={columns}
      sort="-planned_date"
    />
  );
}
