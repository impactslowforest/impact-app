import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'detail_id', label: 'Detail ID' },
  { key: 'impact_id_text', label: 'Impact ID' },
  { key: 'entity', label: 'Entity' },
  { key: 'activity_id', label: 'Activity ID' },
  { key: 'activity_date', label: 'Activity Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'activity_name', label: 'Activity', field: 'activity.activity_name' },
  { key: 'description', label: 'Description', searchable: false },
  { key: 'budget', label: 'Budget' },
  { key: 'budget_type', label: 'Budget Type' },
  { key: 'category', label: 'Category' },
  { key: 'note', label: 'Note', searchable: false },
  { key: 'staff', label: 'Staff' },
];

export default function ActImpactDetailList() {
  return (
    <PbCollectionTable
      title="Activity Impact Details"
      collection="act_impact_details"
      columns={columns}
      expand="activity"
      sort="-activity_date"
    />
  );
}
