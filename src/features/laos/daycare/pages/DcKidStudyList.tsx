import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'study_id', label: 'Study ID' },
  { key: 'kid_id_text', label: 'Kid' },
  { key: 'kid_name', label: 'Name' },
  { key: 'subject', label: 'Subject' },
  { key: 'study_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'score', label: 'Score' },
  { key: 'level', label: 'Level' },
  { key: 'farm_id_text', label: 'Farm' },
];

export default function DcKidStudyList() {
  return (
    <PbCollectionTable
      title="Kid Studies"
      collection="dc_kid_studies"
      columns={columns}
    />
  );
}
