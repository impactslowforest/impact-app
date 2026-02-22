import { useTranslation } from 'react-i18next';
import { Warehouse, TreePine, Coffee, Bean } from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function WarehouseModuleHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('select_country', 'Select country'),
      icon: Warehouse,
      color: 'text-blue-700',
      cards: [
        { label: 'Laos — Warehouse / Dry mill', icon: TreePine, iconBg: 'bg-green-100', path: ROUTES.LA_WAREHOUSE },
        { label: 'Indonesia — Warehouse', icon: Bean, iconBg: 'bg-amber-100', path: ROUTES.ID_WAREHOUSE },
        { label: 'Vietnam — Warehouse', icon: Coffee, iconBg: 'bg-red-100', path: ROUTES.VN_WAREHOUSE },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('warehouse', 'Warehouse')}
      sections={sections}
    />
  );
}
