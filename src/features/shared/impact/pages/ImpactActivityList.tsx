import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'activity_code', label: 'Activity Code' },
  { key: 'category', label: 'Category' },
  { key: 'country_code', label: 'Country' },
  { key: 'detail_name', label: 'Activity Name' },
  { key: 'notes', label: 'Notes', searchable: false },
];

export default function ImpactActivityList() {
  return (
    <PbCollectionTable
      title="Impact Activities"
      collection="impact_activities"
      columns={columns}
      sort="activity_code"
    />
  );
}
