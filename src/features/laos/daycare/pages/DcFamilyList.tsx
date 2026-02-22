import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'family_id', label: 'Family ID' },
  { key: 'farm_id_text', label: 'Farm' },
  { key: 'worker1_name_en', label: 'Parent 1' },
  { key: 'relation1', label: 'Relation' },
  { key: 'worker2_name_en', label: 'Parent 2' },
  { key: 'relation2', label: 'Relation 2' },
  { key: 'siblings', label: 'Siblings' },
];

export default function DcFamilyList() {
  return (
    <PbCollectionTable
      title="Daycare Families"
      collection="dc_families"
      columns={columns}
    />
  );
}
