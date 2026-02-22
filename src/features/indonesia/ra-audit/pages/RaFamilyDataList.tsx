import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'position_id', label: 'Position ID' },
  { key: 'farmer_id_text', label: 'Farmer Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'member_name', label: 'Member Name' },
  { key: 'family_position', label: 'Family Position' },
  { key: 'birth_year', label: 'Birth Year' },
  { key: 'cocoa_training', label: 'Cocoa Training', render: (v) => v ? 'Yes' : 'No' },
  { key: 'under_school', label: 'Under School', render: (v) => v ? 'Yes' : 'No' },
  { key: 'working_areas', label: 'Working Areas' },
];

export default function RaFamilyDataList() {
  return (
    <PbCollectionTable
      title="RA Family Data"
      collection="ra_family_data"
      columns={columns}
      expand="farmer"
    />
  );
}
