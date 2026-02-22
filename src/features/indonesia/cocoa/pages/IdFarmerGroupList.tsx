import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'group_id', label: 'Group ID' },
  { key: 'group_name', label: 'Group Name' },
  { key: 'coordinator_id', label: 'Coordinator ID' },
  { key: 'total_area_ha', label: 'Total Area (ha)' },
  { key: 'num_farmers', label: 'No. Farmers' },
  { key: 'num_farms', label: 'No. Farms' },
  { key: 'address', label: 'Address' },
];

export default function IdFarmerGroupList() {
  return (
    <PbCollectionTable
      title="Farmer Groups"
      collection="id_farmer_groups"
      columns={columns}
    />
  );
}
