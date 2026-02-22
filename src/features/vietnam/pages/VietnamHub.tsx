import { useTranslation } from 'react-i18next';
import {
  Users, Building2, Warehouse, ShieldCheck,
  Coffee, MapPin, FileCheck, Factory, Map,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function VietnamHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('farm_management', 'Farm management'),
      icon: Building2,
      color: 'text-green-700',
      cards: [
        { label: t('cooperative_management', 'Cooperative management'), icon: Building2, iconBg: 'bg-green-100', path: ROUTES.VN_COOPERATIVE },
        { label: t('staff_info', 'Staff info'), icon: Users, iconBg: 'bg-blue-100', path: ROUTES.VN_STAFF },
      ],
    },
    {
      title: t('supply_chain', 'Supply chain'),
      icon: Warehouse,
      color: 'text-blue-700',
      cards: [
        { label: t('warehouse', 'Warehouse'), icon: Warehouse, iconBg: 'bg-blue-100', path: ROUTES.VN_WAREHOUSE },
        { label: t('coffee_raw_material_price', 'Coffee raw material price'), icon: Coffee, iconBg: 'bg-amber-100', path: ROUTES.VN_COFFEE_PRICE },
      ],
    },
    {
      title: t('compliance_quality', 'Compliance & Quality'),
      icon: ShieldCheck,
      color: 'text-purple-700',
      cards: [
        { label: t('eudr', 'EUDR'), icon: ShieldCheck, iconBg: 'bg-blue-100', path: ROUTES.VN_EUDR },
        { label: t('certification', 'Certification'), icon: FileCheck, iconBg: 'bg-teal-100', path: ROUTES.VN_CERTIFICATION },
      ],
    },
    {
      title: t('facilities', 'Facilities'),
      icon: MapPin,
      color: 'text-gray-700',
      cards: [
        { label: t('slow_facilities', 'Slow facilities'), icon: Factory, iconBg: 'bg-slate-100', path: ROUTES.VN_FACILITIES },
        { label: t('slow_offices', 'Slow offices'), icon: MapPin, iconBg: 'bg-gray-100', path: ROUTES.VN_OFFICES },
        { label: t('farm_map', 'Farm map'), icon: Map, iconBg: 'bg-indigo-100', path: ROUTES.MAP },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('viet_nam', 'Vietnam')}
      sections={sections}
    />
  );
}
