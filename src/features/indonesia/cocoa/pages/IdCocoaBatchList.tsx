import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'batch_id', label: 'Batch ID' },
  { key: 'batch_date', label: 'Batch Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farmer_group_id', label: 'Farmer Group ID' },
  { key: 'coordinator_id', label: 'Coordinator ID' },
  { key: 'total_wet_beans_kg', label: 'Total Wet Beans (kg)' },
  { key: 'total_wet_bean_price', label: 'Total Wet Bean Price' },
  { key: 'product_type', label: 'Product Type' },
];

export default function IdCocoaBatchList() {
  return (
    <PbCollectionTable
      title="Cocoa Batches"
      collection="id_cocoa_batches"
      columns={columns}
    />
  );
}
