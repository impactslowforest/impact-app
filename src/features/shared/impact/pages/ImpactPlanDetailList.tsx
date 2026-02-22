import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'detail_id', label: 'Detail ID' },
  { key: 'plan_id_text', label: 'Plan ID' },
  { key: 'activity_code', label: 'Activity Code' },
  { key: 'budget', label: 'Budget' },
  { key: 'account_id', label: 'Account ID' },
  { key: 'expense_id', label: 'Expense ID' },
  { key: 'time_implemented', label: 'Time Implemented', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'staff', label: 'Staff' },
  { key: 'record_date', label: 'Record Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'file_path', label: 'File Path', searchable: false },
];

export default function ImpactPlanDetailList() {
  return (
    <PbCollectionTable
      title="Impact Plan Details"
      collection="impact_plan_details"
      columns={columns}
      sort="-record_date"
    />
  );
}
