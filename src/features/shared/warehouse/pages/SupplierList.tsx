import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'supplier_code', label: 'Supplier Code' },
  { key: 'source', label: 'Source' },
  { key: 'company_name', label: 'Company' },
  { key: 'representative_name', label: 'Representative' },
  { key: 'province', label: 'Province' },
  { key: 'district', label: 'District' },
  { key: 'village', label: 'Village' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'main_products', label: 'Products' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'processing_methods', label: 'Processing' },
  { key: 'packaging_options', label: 'Packaging' },
  { key: 'shipping_methods', label: 'Shipping' },
  { key: 'min_order_quantity_kg', label: 'Min Order (kg)' },
  { key: 'payment_terms', label: 'Payment Terms' },
  { key: 'country', label: 'Country' },
  { key: 'is_active', label: 'Active', render: (v) => v ? 'Yes' : 'No' },
];

export default function SupplierList() {
  const { t } = useTranslation('nav');

  return (
    <PbCollectionTable
      title={t('suppliers_list', 'Suppliers')}
      collection="suppliers"
      columns={columns}
    />
  );
}
