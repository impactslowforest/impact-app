import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'contract_id', label: 'Contract ID' },
  { key: 'farmer_id_text', label: 'Farmer ID' },
  { key: 'contract_date', label: 'Contract Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'province', label: 'Province' },
  { key: 'district', label: 'District' },
  { key: 'village', label: 'Village' },
  { key: 'farmer_name', label: 'Farmer Name' },
  { key: 'gender', label: 'Gender' },
  { key: 'group_name', label: 'Group Name' },
];

export default function IdFarmerContractList() {
  return (
    <PbCollectionTable
      title="Farmer Contracts"
      collection="id_farmer_contracts"
      columns={columns}
    />
  );
}
