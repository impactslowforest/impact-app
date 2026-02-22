import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'contract_id', label: 'Contract ID' },
  { key: 'farmer_id_text', label: 'Farmer Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'contract_date', label: 'Contract Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'province', label: 'Province' },
  { key: 'district', label: 'District' },
  { key: 'village', label: 'Village' },
  { key: 'gender', label: 'Gender' },
  { key: 'group_name', label: 'Group', field: 'farmer_group.group_name' },
];

export default function IdFarmerContractList() {
  return (
    <PbCollectionTable
      title="Farmer Contracts"
      collection="id_farmer_contracts"
      columns={columns}
      expand="farmer,farmer_group"
    />
  );
}
