import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'batch_detail_id', label: 'Batch Detail ID' },
  { key: 'batchlog_id', label: 'Batch Log ID' },
  { key: 'detail_date', label: 'Detail Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farm_id_text', label: 'Farm Code' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'cocoa_clone', label: 'Cocoa Clone' },
  { key: 'certificate_detail', label: 'Certificate Detail' },
  { key: 'wet_beans_kg', label: 'Wet Beans (kg)' },
  { key: 'bean_price_per_kg', label: 'Bean Price/kg' },
  { key: 'premium_price', label: 'Premium Price' },
  { key: 'total_wet_bean_amount', label: 'Total Wet Bean Amount' },
  { key: 'total_premium_amount', label: 'Total Premium Amount' },
];

export default function IdCocoaBatchDetailList() {
  return (
    <PbCollectionTable
      title="Cocoa Batch Details"
      collection="id_cocoa_batch_details"
      columns={columns}
      expand="farm"
    />
  );
}
