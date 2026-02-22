import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'material_id', label: 'ID' },
  { key: 'material_name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'unit', label: 'Unit' },
  { key: 'unit_price', label: 'Price' },
  { key: 'supplier_id', label: 'Supplier' },
  { key: 'details', label: 'Details' },
];

export default function DcMaterialList() {
  return (
    <PbCollectionTable
      title="Materials"
      collection="dc_materials"
      columns={columns}
    />
  );
}
