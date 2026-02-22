import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'certificate_id', label: 'Certificate ID' },
  { key: 'farmer_id_text', label: 'Farmer ID' },
  { key: 'farm_id_text', label: 'Farm ID' },
  { key: 'inspection_date', label: 'Inspection Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'location', label: 'Location' },
];

export default function RaCertificateList() {
  return (
    <PbCollectionTable
      title="RA Certificates"
      collection="ra_certificates"
      columns={columns}
    />
  );
}
