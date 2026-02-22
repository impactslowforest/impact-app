import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'certificate_id', label: 'Certificate ID' },
  { key: 'farmer_id_text', label: 'Farmer Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'farm_id_text', label: 'Farm Code' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'inspection_date', label: 'Inspection Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'location', label: 'Location' },
];

export default function RaCertificateList() {
  return (
    <PbCollectionTable
      title="RA Certificates"
      collection="ra_certificates"
      columns={columns}
      expand="farmer,farm"
    />
  );
}
