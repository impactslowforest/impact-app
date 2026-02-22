import { useTranslation } from 'react-i18next';
import {
  Sprout, Bug, Calendar, CalendarCheck, Baby,
  TreePine, Coffee, BarChart3,
  HardHat, UserCheck, Users, Heart,
  ClipboardList, FileText,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function SlowFarmHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('farm_operation', 'Farm operation'),
      icon: Sprout,
      color: 'text-green-700',
      cards: [
        { label: t('fertilizers_pesticide', 'Fertilizers/pesticide'), icon: Bug, iconBg: 'bg-orange-100', path: `${ROUTES.LA_SLOW_FARM_OP}/fertilizers` },
        { label: t('daily_check', 'Daily check'), icon: Calendar, iconBg: 'bg-blue-100', path: `${ROUTES.LA_SLOW_FARM_OP}/daily-check` },
        { label: t('weekly_check', 'Weekly check'), icon: CalendarCheck, iconBg: 'bg-indigo-100', path: `${ROUTES.LA_SLOW_FARM_OP}/weekly-check` },
        { label: t('day_care_center', 'Day care center'), icon: Baby, iconBg: 'bg-pink-100', path: `${ROUTES.LA_SLOW_FARM_OP}/daycare` },
      ],
    },
    {
      title: t('tree_inventory', 'Tree inventory'),
      icon: TreePine,
      color: 'text-green-700',
      cards: [
        { label: t('shade_tree_inventory', 'Shade tree inventory'), icon: TreePine, iconBg: 'bg-emerald-100', path: `${ROUTES.LA_SLOW_FARM_TREES}/shade` },
        { label: t('coffee_tree_inventory', 'Coffee tree inventory'), icon: Coffee, iconBg: 'bg-amber-100', path: `${ROUTES.LA_SLOW_FARM_TREES}/coffee` },
        { label: t('crop_inventory', 'Crop inventory'), icon: BarChart3, iconBg: 'bg-yellow-100', path: `${ROUTES.LA_SLOW_FARM_TREES}/crop` },
      ],
    },
    {
      title: t('worker_profile', 'Worker profile'),
      icon: HardHat,
      color: 'text-blue-700',
      cards: [
        { label: t('inside_worker_profile', 'Inside worker profile'), icon: UserCheck, iconBg: 'bg-blue-100', path: `${ROUTES.LA_SLOW_FARM_WORKERS}/inside` },
        { label: t('outside_worker_profile', 'Outside worker profile'), icon: Users, iconBg: 'bg-teal-100', path: `${ROUTES.LA_SLOW_FARM_WORKERS}/outside` },
        { label: t('labor_contract', 'Labor contract'), icon: FileText, iconBg: 'bg-purple-100', path: `${ROUTES.LA_SLOW_FARM_WORKERS}/contract` },
      ],
    },
    {
      title: t('do_no_harm_monitoring', 'Do no harm monitoring'),
      icon: Heart,
      color: 'text-red-600',
      cards: [
        { label: t('child_labor_report', 'Child labor report'), icon: Baby, iconBg: 'bg-red-100', path: `${ROUTES.LA_SLOW_FARM_DNH}/child-labor` },
        { label: t('safety_working_report', 'Safety working report'), icon: HardHat, iconBg: 'bg-amber-100', path: `${ROUTES.LA_SLOW_FARM_DNH}/safety` },
        { label: t('accident_incident', 'Accident & incident'), icon: ClipboardList, iconBg: 'bg-orange-100', path: `${ROUTES.LA_SLOW_FARM_DNH}/accident` },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('slow_farm', 'Slow farm')}
      breadcrumb={['Laos']}
      sections={sections}
    />
  );
}
