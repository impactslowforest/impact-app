import { useTranslation } from 'react-i18next';
import {
  Users, Building2, Warehouse, ShieldCheck,
  Bean, MapPin, FileCheck, Factory, Map,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function IndonesiaHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('farm_management', 'Farm management'),
      icon: Building2,
      color: 'text-green-700',
      cards: [
        { label: t('farmer_manager', 'Farmer Manager'), icon: Users, iconBg: 'bg-green-100', path: ROUTES.ID_COOPERATIVE },
        { label: t('staff_info', 'Staff info'), icon: Users, iconBg: 'bg-blue-100', path: ROUTES.ID_STAFF },
      ],
    },
    {
      title: t('supply_chain', 'Supply chain'),
      icon: Warehouse,
      color: 'text-blue-700',
      cards: [
        { label: t('warehouse', 'Warehouse'), icon: Warehouse, iconBg: 'bg-blue-100', path: ROUTES.ID_WAREHOUSE },
        { label: t('cacao_raw_material_price', 'Cacao raw material price'), icon: Bean, iconBg: 'bg-amber-100', path: ROUTES.ID_CACAO_PRICE },
      ],
    },
    {
      title: t('compliance_quality', 'Compliance & Quality'),
      icon: ShieldCheck,
      color: 'text-purple-700',
      cards: [
        { label: t('eudr', 'EUDR'), icon: ShieldCheck, iconBg: 'bg-blue-100', path: ROUTES.ID_EUDR },
        { label: t('certification', 'Certification'), icon: FileCheck, iconBg: 'bg-teal-100', path: ROUTES.ID_CERTIFICATION },
      ],
    },
    {
      title: t('facilities', 'Facilities'),
      icon: MapPin,
      color: 'text-gray-700',
      cards: [
        { label: t('slow_facilities', 'Slow facilities'), icon: Factory, iconBg: 'bg-slate-100', path: ROUTES.ID_FACILITIES },
        { label: t('slow_offices', 'Slow offices'), icon: MapPin, iconBg: 'bg-gray-100', path: ROUTES.ID_OFFICES },
        { label: t('farm_map', 'Farm map'), icon: Map, iconBg: 'bg-indigo-100', path: ROUTES.MAP },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('indo', 'Indonesia')}
      sections={sections}
    />
  );
}
