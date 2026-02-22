import { useTranslation } from 'react-i18next';
import {
  ClipboardList, DollarSign, FileText, ListChecks, Target, BookOpen,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function ImpactImplementationHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('budget_spending', 'Budget & Spending'),
      icon: DollarSign,
      color: 'text-green-700',
      cards: [
        { label: t('act_impacts', 'Activity Impact Budget'), icon: DollarSign, iconBg: 'bg-green-100', path: ROUTES.IMPACT_ACT },
        { label: t('act_impact_details', 'Activity Impact Details'), icon: FileText, iconBg: 'bg-emerald-100', path: ROUTES.IMPACT_ACT_DETAIL },
      ],
    },
    {
      title: t('implementation_plans', 'Implementation Plans'),
      icon: Target,
      color: 'text-blue-700',
      cards: [
        { label: t('impact_plans', 'Impact Plans'), icon: ClipboardList, iconBg: 'bg-blue-100', path: ROUTES.IMPACT_PLAN },
        { label: t('impact_plan_details', 'Plan Details'), icon: ListChecks, iconBg: 'bg-indigo-100', path: ROUTES.IMPACT_PLAN_DETAIL },
      ],
    },
    {
      title: t('activity_reference', 'Activity Reference'),
      icon: BookOpen,
      color: 'text-purple-700',
      cards: [
        { label: t('impact_activities', 'Activity List'), icon: BookOpen, iconBg: 'bg-purple-100', path: ROUTES.IMPACT_ACTIVITY_REF },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('impact_implementation', 'Impact Implementation')}
      breadcrumb={['Impact']}
      sections={sections}
    />
  );
}
