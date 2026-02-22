import { useTranslation } from 'react-i18next';
import {
  Users, TreePine, FileCheck,
  ClipboardCheck,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function RaAuditHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('inspections', 'Inspections'),
      icon: ClipboardCheck,
      color: 'text-green-700',
      cards: [
        { label: t('farmer_inspections', 'Farmer inspections'), icon: Users, iconBg: 'bg-green-100', path: ROUTES.ID_RA_FARMERS },
        { label: t('farm_inspections', 'Farm inspections'), icon: TreePine, iconBg: 'bg-lime-100', path: ROUTES.ID_RA_FARMS },
        { label: t('certificates', 'RA certificates'), icon: FileCheck, iconBg: 'bg-teal-100', path: ROUTES.ID_RA_CERTIFICATES },
      ],
    },
    {
      title: t('biodiversity', 'Biodiversity & Agroforestry'),
      icon: TreePine,
      color: 'text-emerald-700',
      cards: [
        { label: t('species_index', 'Species index'), icon: TreePine, iconBg: 'bg-emerald-100', path: ROUTES.ID_RA_SPECIES },
        { label: t('tree_index', 'Tree index'), icon: TreePine, iconBg: 'bg-green-100', path: ROUTES.ID_RA_TREES },
        { label: t('family_data', 'Family data'), icon: Users, iconBg: 'bg-blue-100', path: ROUTES.ID_RA_FAMILY },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('ra_audit', 'RA Internal Audit')}
      sections={sections}
    />
  );
}
