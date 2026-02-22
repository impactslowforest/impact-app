import { useTranslation } from 'react-i18next';
import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'outbound_code', label: 'Outbound Code' },
  { key: 'source', label: 'Source' },
  { key: 'bean_type', label: 'Bean Type' },
  { key: 'variety', label: 'Variety' },
  { key: 'process', label: 'Process' },
  { key: 'certificate_type', label: 'Certificate' },
  { key: 'inbound_bags', label: 'Inbound Bags' },
  { key: 'inbound_quantity_kg', label: 'Inbound Qty (kg)' },
  { key: 'inbound_moisture_pct', label: 'Inbound Moisture %' },
  { key: 'active_water_level', label: 'AW Level' },
  { key: 'request_by', label: 'Requested By' },
  { key: 'outbound_zone', label: 'Outbound Zone' },
  { key: 'outbound_date', label: 'Outbound Date', render: (v) => v ? String(v).split(' ')[0] : '' },
  { key: 'outbound_type', label: 'Outbound Type' },
  { key: 'outbound_reason', label: 'Reason' },
  { key: 'outbound_bags', label: 'Outbound Bags' },
  { key: 'outbound_quantity_kg', label: 'Outbound Qty (kg)' },
  { key: 'outbound_moisture_pct', label: 'Outbound Moisture %' },
  { key: 'dry_parchment_hulled_kg', label: 'Dry Parch Hulled (kg)' },
  { key: 'green_bean_kg', label: 'Green Bean (kg)' },
  { key: 'staff', label: 'Staff' },
  { key: 'season', label: 'Season' },
];

interface Props { country?: string; }

export default function OutboundRequestList({ country }: Props) {
  const { t } = useTranslation('nav');
  const baseFilter = country ? `country = "${country}"` : '';

  return (
    <PbCollectionTable
      title={t('outbound_requests', 'Outbound requests')}
      collection="outbound_requests"
      columns={columns}
      baseFilter={baseFilter}
    />
  );
}
