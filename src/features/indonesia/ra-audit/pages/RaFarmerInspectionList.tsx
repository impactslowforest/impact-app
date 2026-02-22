import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'farmer_id_text', label: 'Farmer Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'province', label: 'Province' },
  { key: 'district', label: 'District' },
  { key: 'village', label: 'Village' },
  { key: 'inspection_date', label: 'Inspection Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farm_area_ha', label: 'Farm Area (ha)' },
  { key: 'observation_stations', label: 'Observation Stations' },
  { key: 'est_production_2024', label: 'Est. Production 2024' },
  { key: 'est_production_2025', label: 'Est. Production 2025' },
];

export default function RaFarmerInspectionList() {
  return (
    <PbCollectionTable
      title="RA Farmer Inspections"
      collection="ra_farmer_inspections"
      columns={columns}
      expand="farmer"
    />
  );
}
