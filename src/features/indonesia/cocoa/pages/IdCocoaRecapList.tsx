import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'farm_id_text', label: 'Farm' },
  { key: 'sold_to_krakakoa', label: 'Sold to Krakakoa' },
  { key: 'sold_to_others', label: 'Sold to Others' },
  { key: 'quota', label: 'Quota' },
  { key: 'remaining', label: 'Remaining' },
  { key: 'historical_total_premium', label: 'Historical Total Premium' },
  { key: 'remarks', label: 'Remarks' },
];

export default function IdCocoaRecapList() {
  return (
    <PbCollectionTable
      title="Cocoa Recaps"
      collection="id_cocoa_recaps"
      columns={columns}
    />
  );
}
