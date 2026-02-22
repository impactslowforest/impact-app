import { useTranslation } from 'react-i18next';
import {
  FileCheck, TreePine, Coffee, Bean,
  BarChart3, ClipboardList, BookOpen,
  Printer, ScanLine,
} from 'lucide-react';
import ModuleHub, { type HubSection } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';

export default function CertificateModuleHub() {
  const { t } = useTranslation('nav');

  const sections: HubSection[] = [
    {
      title: t('by_country', 'By country'),
      icon: FileCheck,
      color: 'text-green-700',
      cards: [
        { label: 'Laos — Certification', icon: TreePine, iconBg: 'bg-green-100', path: ROUTES.LA_CERTIFICATION },
        { label: 'Indonesia — Certification', icon: Bean, iconBg: 'bg-amber-100', path: ROUTES.ID_CERTIFICATION },
        { label: 'Vietnam — Certification', icon: Coffee, iconBg: 'bg-red-100', path: ROUTES.VN_CERTIFICATION },
      ],
    },
    {
      title: t('global_tools', 'Global tools'),
      icon: BarChart3,
      color: 'text-blue-700',
      cards: [
        { label: t('cert_dashboard', 'Global dashboard'), icon: BarChart3, iconBg: 'bg-blue-100', path: ROUTES.IMPACT_CERTIFICATION },
        { label: t('cert_records', 'Audit records'), icon: ClipboardList, iconBg: 'bg-purple-100', path: ROUTES.CERT_RECORDS },
        { label: t('cert_library', 'Library'), icon: BookOpen, iconBg: 'bg-teal-100', path: ROUTES.CERT_LIBRARY },
        { label: t('qr_print', 'QR Print'), icon: Printer, iconBg: 'bg-orange-100', path: ROUTES.CERT_QR_PRINT },
        { label: t('qr_scan', 'QR Scan'), icon: ScanLine, iconBg: 'bg-cyan-100', path: ROUTES.CERT_QR_SCAN },
      ],
    },
  ];

  return (
    <ModuleHub
      title={t('certification', 'Certification')}
      sections={sections}
    />
  );
}
