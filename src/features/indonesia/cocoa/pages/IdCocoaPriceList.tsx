import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'price_id', label: 'Price ID' },
  { key: 'coordinator_id', label: 'Coordinator ID' },
  { key: 'price_date', label: 'Price Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'wb_price_clonal', label: 'WB Price Clonal' },
  { key: 'wb_price_local', label: 'WB Price Local' },
  { key: 'wb_price_mix', label: 'WB Price Mix' },
  { key: 'local_db_price_clonal', label: 'Local DB Price Clonal' },
  { key: 'local_db_price_local', label: 'Local DB Price Local' },
  { key: 'local_db_price_mix', label: 'Local DB Price Mix' },
];

export default function IdCocoaPriceList() {
  return (
    <PbCollectionTable
      title="Cocoa Prices"
      collection="id_cocoa_prices"
      columns={columns}
    />
  );
}
