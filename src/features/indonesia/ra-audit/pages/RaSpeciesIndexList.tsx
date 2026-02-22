import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'species_id', label: 'Species ID' },
  { key: 'farmer_id_text', label: 'Farmer ID' },
  { key: 'farm_id_text', label: 'Farm ID' },
  { key: 'species_name', label: 'Species Name' },
  { key: 'num_timber_trees', label: 'No. Timber Trees' },
  { key: 'num_fruit_trees_producing', label: 'No. Fruit Trees Producing' },
  { key: 'harvest_type', label: 'Harvest Type' },
  { key: 'production_est_2025', label: 'Production Est. 2025' },
];

export default function RaSpeciesIndexList() {
  return (
    <PbCollectionTable
      title="RA Species Index"
      collection="ra_species_index"
      columns={columns}
    />
  );
}
