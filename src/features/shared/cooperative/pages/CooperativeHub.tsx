import { useTranslation } from 'react-i18next';
import {
  Users, Sprout, Heart, BookOpen, Bug, TreePine,
  ClipboardList, Baby, HardHat, BarChart3, UserCheck, Landmark,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

interface CooperativeHubProps {
  country?: string;
}

export default function CooperativeHub({ country = 'laos' }: CooperativeHubProps) {
  const { t } = useTranslation('nav');

  const coopRoute = country === 'indonesia' ? ROUTES.ID_COOPERATIVE
    : country === 'vietnam' ? ROUTES.VN_COOPERATIVE
    : ROUTES.LA_COOPERATIVE;

  const farmOpRoute = country === 'indonesia' ? ROUTES.ID_FARM_OP
    : ROUTES.LA_FARM_OP;

  const dnhRoute = country === 'indonesia' ? ROUTES.ID_DO_NO_HARM
    : ROUTES.LA_DO_NO_HARM;

  const sections: HubSection[] = [
    {
      title: t('farmer_group_management', 'Farmer group management'),
      icon: Users,
      color: 'text-green-700',
      cards: [
        { label: t('cooperative_data', 'Cooperative data'), icon: Users, iconBg: 'bg-green-100', path: `${coopRoute}/data?tab=cooperatives` },
        { label: t('farmer_data', 'Farmer data'), icon: UserCheck, iconBg: 'bg-amber-100', path: `${coopRoute}/data?tab=farmers` },
        { label: t('farm_data', 'Farm data'), icon: Landmark, iconBg: 'bg-blue-100', path: `${coopRoute}/data?tab=farms` },
        { label: t('processing', 'Processing'), icon: BarChart3, iconBg: 'bg-purple-100', path: `${coopRoute}/data?tab=harvest` },
      ],
    },
    {
      title: t('farm_operation', 'Farm operation'),
      icon: Sprout,
      color: 'text-green-700',
      cards: [
        { label: t('training_courses', 'Training courses'), icon: BookOpen, iconBg: 'bg-green-100', path: `${farmOpRoute}/training` },
        { label: t('shade_tree_inventory', 'Shade tree inventory'), icon: TreePine, iconBg: 'bg-emerald-100', path: `${farmOpRoute}/shade-tree` },
        { label: t('tree_inventory', 'Tree inventory'), icon: TreePine, iconBg: 'bg-teal-100', path: `${farmOpRoute}/tree-inventory` },
        { label: t('fertilizers_pesticide', 'Fertilizers/pesticide'), icon: Bug, iconBg: 'bg-orange-100', path: `${farmOpRoute}/fertilizers` },
        { label: t('crop_estimation', 'Crop estimation'), icon: BarChart3, iconBg: 'bg-yellow-100', path: `${farmOpRoute}/crop-estimation` },
      ],
    },
    {
      title: t('do_no_harm_monitoring', 'Do no harm monitoring'),
      icon: Heart,
      color: 'text-red-600',
      cards: [
        { label: t('child_labor_report', 'Child labor report'), icon: Baby, iconBg: 'bg-red-100', path: `${dnhRoute}/child-labor` },
        { label: t('safety_working_report', 'Safety working report'), icon: HardHat, iconBg: 'bg-amber-100', path: `${dnhRoute}/safety` },
        { label: t('accident_incident', 'Accident & incident'), icon: ClipboardList, iconBg: 'bg-orange-100', path: `${dnhRoute}/accident` },
      ],
    },
  ];

  const countryLabel = country === 'indonesia' ? 'Indonesia'
    : country === 'vietnam' ? 'Vietnam' : 'Laos';

  return (
    <ModuleHub
      title={country === 'indonesia' ? t('farmer_manager', 'Farmer Manager') : t('cooperative_management', 'Cooperative management')}
      breadcrumb={[countryLabel]}
      sections={sections}
    />
  );
}
