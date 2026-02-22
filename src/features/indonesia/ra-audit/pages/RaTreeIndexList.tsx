import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'tree_id', label: 'Tree ID' },
  { key: 'farmer_id_text', label: 'Farmer Code' },
  { key: 'farmer_name', label: 'Farmer', field: 'farmer.full_name' },
  { key: 'farm_id_text', label: 'Farm Code' },
  { key: 'farm_name', label: 'Farm', field: 'farm.farm_name' },
  { key: 'station_id', label: 'Station ID' },
  { key: 'tree_number', label: 'Tree Number' },
  { key: 'ao1_clone_input', label: 'AO1 Clone Input' },
  { key: 'ao1_clone_rating', label: 'AO1 Clone Rating' },
  { key: 'ao2_age_rating', label: 'AO2 Age Rating' },
  { key: 'ao4_health_rating', label: 'AO4 Health Rating' },
  { key: 'ao5_disease_rating', label: 'AO5 Disease Rating' },
  { key: 'ao6_pruning_rating', label: 'AO6 Pruning Rating' },
];

export default function RaTreeIndexList() {
  return (
    <PbCollectionTable
      title="RA Tree Index"
      collection="ra_tree_index"
      columns={columns}
      expand="farmer,farm"
    />
  );
}
