import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'farm_audit_id', label: 'Farm Audit ID' },
  { key: 'farmer_id_text', label: 'Farmer ID' },
  { key: 'farm_id_text', label: 'Farm ID' },
  { key: 'inspection_date', label: 'Inspection Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farm_area_ha', label: 'Farm Area (ha)' },
  { key: 'land_certificate', label: 'Land Certificate' },
  { key: 'num_stations', label: 'No. Stations' },
  { key: 'num_species', label: 'No. Species' },
  { key: 'est_production_2024', label: 'Est. Production 2024' },
  { key: 'inspector_name', label: 'Inspector Name' },
];

export default function RaFarmInspectionList() {
  return (
    <PbCollectionTable
      title="RA Farm Inspections"
      collection="ra_farm_inspections"
      columns={columns}
    />
  );
}
