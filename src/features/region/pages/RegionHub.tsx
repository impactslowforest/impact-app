import { useTranslation } from 'react-i18next';
import {
  Globe, BarChart3, ShieldCheck, FileCheck,
  ClipboardList, Target, TrendingUp,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function RegionHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('analytics_reporting', 'Analytics & Reporting'),
      icon: BarChart3,
      color: 'text-blue-700',
      cards: [
        { label: t('ghg_sbti', 'GHG / SBTi'), icon: BarChart3, iconBg: 'bg-green-100', path: ROUTES.IMPACT_GHG },
        { label: t('eudr_compliance', 'EUDR Compliance'), icon: ShieldCheck, iconBg: 'bg-blue-100', path: ROUTES.IMPACT_EUDR },
        { label: t('client_carbon', 'Client Carbon'), icon: TrendingUp, iconBg: 'bg-teal-100', path: ROUTES.IMPACT_CLIENT_CARBON },
      ],
    },
    {
      title: t('certification', 'Certification'),
      icon: FileCheck,
      color: 'text-green-700',
      cards: [
        { label: t('cert_dashboard', 'Dashboard'), icon: BarChart3, iconBg: 'bg-green-100', path: ROUTES.IMPACT_CERTIFICATION },
        { label: t('cert_records', 'Records'), icon: ClipboardList, iconBg: 'bg-amber-100', path: ROUTES.CERT_RECORDS },
        { label: t('cert_library', 'Library'), icon: FileCheck, iconBg: 'bg-blue-100', path: ROUTES.CERT_LIBRARY },
      ],
    },
    {
      title: t('impact_implementation', 'Impact Implementation'),
      icon: Target,
      color: 'text-purple-700',
      cards: [
        { label: t('budget', 'Budget'), icon: ClipboardList, iconBg: 'bg-purple-100', path: ROUTES.IMPACT_BUDGET },
        { label: t('goals', 'Goals'), icon: Target, iconBg: 'bg-indigo-100', path: ROUTES.IMPACT_GOALS },
        { label: t('kpis', 'KPIs'), icon: TrendingUp, iconBg: 'bg-cyan-100', path: ROUTES.IMPACT_KPIS },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('region', 'Region')}
      sections={sections}
    />
  );
}
