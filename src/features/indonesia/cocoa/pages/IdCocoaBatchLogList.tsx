import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'batchlog_id', label: 'Batch Log ID' },
  { key: 'batch_id', label: 'Batch ID' },
  { key: 'log_date', label: 'Log Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farmer_id_text', label: 'Farmer ID' },
  { key: 'total_wet_beans_kg', label: 'Total Wet Beans (kg)' },
  { key: 'estimated_dry_beans_kg', label: 'Est. Dry Beans (kg)' },
  { key: 'total_wet_bean_price', label: 'Total Wet Bean Price' },
  { key: 'fermentation_days', label: 'Fermentation Days' },
  { key: 'drying_days', label: 'Drying Days' },
  { key: 'dry_beans_kg', label: 'Dry Beans (kg)' },
];

export default function IdCocoaBatchLogList() {
  return (
    <PbCollectionTable
      title="Cocoa Batch Logs"
      collection="id_cocoa_batch_logs"
      columns={columns}
    />
  );
}
