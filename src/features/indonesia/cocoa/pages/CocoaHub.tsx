import { useTranslation } from 'react-i18next';
import {
  Building2, ClipboardList, DollarSign,
  BarChart3, FileCheck, Bean,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function CocoaHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('purchase_data', 'Purchase Data'),
      icon: Bean,
      color: 'text-amber-700',
      cards: [
        { label: t('farmer_groups', 'Farmer groups'), icon: Building2, iconBg: 'bg-green-100', path: ROUTES.ID_COCOA_GROUPS },
        { label: t('batches', 'Batches'), icon: ClipboardList, iconBg: 'bg-amber-100', path: ROUTES.ID_COCOA_BATCHES },
        { label: t('batch_logs', 'Batch logs'), icon: ClipboardList, iconBg: 'bg-orange-100', path: ROUTES.ID_COCOA_BATCH_LOGS },
        { label: t('batch_details', 'Batch details'), icon: ClipboardList, iconBg: 'bg-yellow-100', path: ROUTES.ID_COCOA_BATCH_DETAILS },
      ],
    },
    {
      title: t('pricing_contracts', 'Pricing & Contracts'),
      icon: DollarSign,
      color: 'text-blue-700',
      cards: [
        { label: t('prices', 'Prices'), icon: DollarSign, iconBg: 'bg-blue-100', path: ROUTES.ID_COCOA_PRICES },
        { label: t('recaps', 'Annual recaps'), icon: BarChart3, iconBg: 'bg-purple-100', path: ROUTES.ID_COCOA_RECAPS },
        { label: t('contracts', 'Farmer contracts'), icon: FileCheck, iconBg: 'bg-teal-100', path: ROUTES.ID_COCOA_CONTRACTS },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('cocoa_purchase', 'Cocoa Purchase')}
      sections={sections}
    />
  );
}
