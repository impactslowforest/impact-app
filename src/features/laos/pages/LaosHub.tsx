import { useTranslation } from 'react-i18next';
import {
  Users, Building2, TreePine, Warehouse, ShieldCheck,
  Coffee, MapPin, BarChart3, FileCheck, Map,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function LaosHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('farm_management', 'Farm management'),
      icon: Building2,
      color: 'text-green-700',
      cards: [
        { label: t('cooperative_management', 'Cooperative management'), icon: Building2, iconBg: 'bg-green-100', path: ROUTES.LA_COOPERATIVE },
        { label: t('slow_farm', 'Slow farm'), icon: TreePine, iconBg: 'bg-emerald-100', path: ROUTES.LA_SLOW_FARM },
        { label: t('staff_info', 'Staff info'), icon: Users, iconBg: 'bg-blue-100', path: ROUTES.LA_STAFF },
      ],
    },
    {
      title: t('supply_chain', 'Supply chain'),
      icon: Warehouse,
      color: 'text-blue-700',
      cards: [
        { label: t('warehouse_drymill', 'Warehouse / Dry mill'), icon: Warehouse, iconBg: 'bg-blue-100', path: ROUTES.LA_WAREHOUSE },
        { label: t('coffee_raw_material_price', 'Coffee raw material price'), icon: Coffee, iconBg: 'bg-amber-100', path: ROUTES.LA_COFFEE_PRICE },
      ],
    },
    {
      title: t('compliance_quality', 'Compliance & Quality'),
      icon: ShieldCheck,
      color: 'text-purple-700',
      cards: [
        { label: t('eudr', 'EUDR'), icon: ShieldCheck, iconBg: 'bg-blue-100', path: ROUTES.LA_EUDR },
        { label: t('ghg_data_collection', 'GHG data collection'), icon: BarChart3, iconBg: 'bg-green-100', path: ROUTES.LA_GHG },
        { label: t('certification', 'Certification'), icon: FileCheck, iconBg: 'bg-teal-100', path: ROUTES.LA_CERTIFICATION },
      ],
    },
    {
      title: t('facilities', 'Facilities'),
      icon: MapPin,
      color: 'text-gray-700',
      cards: [
        { label: t('slow_offices', 'Slow offices'), icon: MapPin, iconBg: 'bg-gray-100', path: ROUTES.LA_OFFICES },
        { label: t('farm_map', 'Farm map'), icon: Map, iconBg: 'bg-indigo-100', path: ROUTES.MAP },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('lao', 'Laos')}
      sections={sections}
    />
  );
}
