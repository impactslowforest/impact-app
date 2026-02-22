import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'menu_detail_id', label: 'ID' },
  { key: 'farm_name', label: 'Farm', field: 'slow_farm.name' },
  { key: 'staff_id', label: 'Staff' },
  { key: 'daily_menu_id', label: 'Menu' },
  { key: 'material_name', label: 'Material' },
  { key: 'menu_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'quantity', label: 'Qty' },
  { key: 'unit', label: 'Unit' },
  { key: 'unit_price', label: 'Unit Price' },
  { key: 'total_price', label: 'Total' },
];

export default function DcMenuDetailList() {
  return (
    <PbCollectionTable
      title="Menu Details"
      collection="dc_menu_details"
      columns={columns}
      expand="slow_farm"
    />
  );
}
