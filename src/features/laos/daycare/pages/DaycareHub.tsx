import { useTranslation } from 'react-i18next';
import {
  Users, Baby, ClipboardList, Heart,
  BarChart3, UtensilsCrossed, Package,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function DaycareHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('children_families', 'Children & Families'),
      icon: Baby,
      color: 'text-pink-700',
      cards: [
        { label: t('families', 'Families'), icon: Users, iconBg: 'bg-pink-100', path: ROUTES.LA_DC_FAMILIES },
        { label: t('kids', 'Kids'), icon: Baby, iconBg: 'bg-purple-100', path: ROUTES.LA_DC_KIDS },
        { label: t('studies', 'Learning studies'), icon: ClipboardList, iconBg: 'bg-blue-100', path: ROUTES.LA_DC_STUDIES },
      ],
    },
    {
      title: t('attendance_health', 'Attendance & Health'),
      icon: Heart,
      color: 'text-red-700',
      cards: [
        { label: t('attendance', 'Attendance'), icon: BarChart3, iconBg: 'bg-green-100', path: ROUTES.LA_DC_ATTENDANCE },
        { label: t('attendance_checks', 'Attendance checks'), icon: ClipboardList, iconBg: 'bg-teal-100', path: ROUTES.LA_DC_ATT_CHECKS },
        { label: t('health_checks', 'Health checks'), icon: Heart, iconBg: 'bg-red-100', path: ROUTES.LA_DC_HEALTH },
        { label: t('farm_health', 'Farm health checks'), icon: Heart, iconBg: 'bg-orange-100', path: ROUTES.LA_DC_FARM_HEALTH },
      ],
    },
    {
      title: t('kitchen', 'Kitchen & Materials'),
      icon: UtensilsCrossed,
      color: 'text-amber-700',
      cards: [
        { label: t('menu_details', 'Menu details'), icon: UtensilsCrossed, iconBg: 'bg-amber-100', path: ROUTES.LA_DC_MENU },
        { label: t('materials', 'Materials'), icon: Package, iconBg: 'bg-cyan-100', path: ROUTES.LA_DC_MATERIALS },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('daycare_center', 'Daycare Center')}
      sections={sections}
    />
  );
}
