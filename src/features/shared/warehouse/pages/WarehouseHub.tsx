import { useTranslation } from 'react-i18next';
import {
  Warehouse, PackageOpen, PackageCheck, Truck,
  BookOpen, Users, Database,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

interface WarehouseHubProps {
  country?: string;
}

export default function WarehouseHub({ country = 'laos' }: WarehouseHubProps) {
  const { t } = useTranslation('nav');

  const base = country === 'laos' ? ROUTES.LA_WAREHOUSE
    : country === 'indonesia' ? ROUTES.ID_WAREHOUSE
    : ROUTES.VN_WAREHOUSE;

  const sections: HubSection[] = [
    {
      title: t('harvesting', 'Harvesting'),
      icon: Warehouse,
      color: 'text-green-700',
      cards: [
        { label: t('harvesting_logbooks', 'Harvesting & Logbooks'), icon: BookOpen, iconBg: 'bg-green-100', path: `${base}/harvesting` },
      ],
    },
    {
      title: t('inbound', 'Inbound'),
      icon: PackageOpen,
      color: 'text-blue-700',
      cards: [
        { label: t('inbound_requests', 'Inbound requests'), icon: PackageOpen, iconBg: 'bg-blue-100', path: `${base}/inbound` },
      ],
    },
    {
      title: t('outbound', 'Outbound'),
      icon: Truck,
      color: 'text-orange-700',
      cards: [
        { label: t('outbound_requests', 'Outbound requests'), icon: PackageCheck, iconBg: 'bg-orange-100', path: `${base}/outbound` },
      ],
    },
    {
      title: t('reference_data', 'Reference data'),
      icon: Database,
      color: 'text-gray-700',
      cards: [
        { label: t('suppliers', 'Suppliers'), icon: Users, iconBg: 'bg-gray-100', path: `${base}/suppliers` },
        { label: t('warehouse_lookups', 'Warehouse lookups'), icon: Database, iconBg: 'bg-slate-100', path: `${base}/lookups` },
      ],
    },
  ];

  const countryLabel = country === 'indonesia' ? 'Indonesia'
    : country === 'vietnam' ? 'Vietnam' : 'Laos';

  return (
    <ModuleHub
      title={t('warehouse_drymill', 'Warehouse / Dry mill')}
      breadcrumb={[countryLabel]}
      sections={sections}
    />
  );
}
