import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'kid_id', label: 'Kid ID' },
  { key: 'farm_id_text', label: 'Farm' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'birthday', label: 'Birthday', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'gender', label: 'Gender' },
  { key: 'on_farm', label: 'On Farm' },
  { key: 'family_id_text', label: 'Family' },
];

export default function DcKidList() {
  return (
    <PbCollectionTable
      title="Daycare Kids"
      collection="dc_kids"
      columns={columns}
    />
  );
}
