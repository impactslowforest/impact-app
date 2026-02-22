import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'lookup_code', label: 'Lookup Code' },
  { key: 'category', label: 'Category' },
  { key: 'label', label: 'Label' },
];

export default function WarehouseLookupList() {
  const { t } = useTranslation('nav');

  return (
    <PbCollectionTable
      title={t('warehouse_lookups', 'Warehouse lookups')}
      collection="warehouse_lookups"
      columns={columns}
    />
  );
}
