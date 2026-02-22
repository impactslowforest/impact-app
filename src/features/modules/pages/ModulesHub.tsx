import { useTranslation } from 'react-i18next';
import {
  Map, Warehouse, FileCheck, Building2, TreePine, Baby, Layers,
  ShieldCheck, BarChart3, BookOpen, Coffee, Bean,
} from 'lucide-react';
import ModuleHub, { type HubSection, type HubCardConfig } from '@/components/shared/ModuleHub';
import { ROUTES } from '@/config/routes';
import { useUIStore } from '@/stores/ui-store';
import { useAuth } from '@/contexts/AuthContext';

/** Shortcuts excluded per country */
const EXCLUDED_BY_COUNTRY: Record<string, string[]> = {
  indonesia: ['daycare', 'slow_farm', 'coffee_price'],
  vietnam: ['daycare', 'slow_farm', 'cocoa_price'],
  laos: ['cocoa_price'],
};

/** All possible shortcut cards — keyed to match ui-store shortcuts */
const ALL_CARDS: (HubCardConfig & { key: string })[] = [
  { key: 'farm_map', label: '', icon: Map, iconBg: 'bg-blue-100', path: ROUTES.MAP },
  { key: 'warehouse', label: '', icon: Warehouse, iconBg: 'bg-amber-100', path: ROUTES.MOD_WAREHOUSE },
  { key: 'certification', label: '', icon: FileCheck, iconBg: 'bg-green-100', path: ROUTES.MOD_CERTIFICATE },
  { key: 'cooperative', label: '', icon: Building2, iconBg: 'bg-purple-100', path: ROUTES.MOD_COOPERATIVE },
  { key: 'slow_farm', label: '', icon: TreePine, iconBg: 'bg-emerald-100', path: ROUTES.MOD_SLOW_FARM },
  { key: 'daycare', label: '', icon: Baby, iconBg: 'bg-pink-100', path: ROUTES.MOD_DAYCARE },
  { key: 'eudr', label: '', icon: ShieldCheck, iconBg: 'bg-indigo-100', path: ROUTES.IMPACT_EUDR },
  { key: 'ghg', label: '', icon: BarChart3, iconBg: 'bg-cyan-100', path: ROUTES.IMPACT_GHG },
  { key: 'documents', label: '', icon: BookOpen, iconBg: 'bg-orange-100', path: ROUTES.CERT_LIBRARY },
  { key: 'coffee_price', label: '', icon: Coffee, iconBg: 'bg-yellow-100', path: ROUTES.LA_COFFEE_PRICE },
  { key: 'cocoa_price', label: '', icon: Bean, iconBg: 'bg-amber-100', path: ROUTES.ID_CACAO_PRICE },
];

/** Translate keys for each shortcut */
const LABEL_MAP: Record<string, { key: string; fallback: string }> = {
  farm_map: { key: 'farm_map', fallback: 'Farm map' },
  warehouse: { key: 'warehouse', fallback: 'Warehouse' },
  certification: { key: 'certification', fallback: 'Certification' },
  cooperative: { key: 'cooperative', fallback: 'Cooperative' },
  slow_farm: { key: 'slow_farm', fallback: 'Slow farm' },
  daycare: { key: 'daycare_center', fallback: 'Daycare center' },
  eudr: { key: 'eudr_compliance', fallback: 'EUDR Compliance' },
  ghg: { key: 'ghg_sbti', fallback: 'GHG / SBTi' },
  documents: { key: 'documents', fallback: 'Documents' },
  coffee_price: { key: 'coffee_raw_material_price', fallback: 'Coffee price' },
  cocoa_price: { key: 'cacao_raw_material_price', fallback: 'Cocoa price' },
};

export default function ModulesHub() {
  const { t } = useTranslation('nav');
  const shortcuts = useUIStore((s) => s.shortcuts);
  const { user } = useAuth();
  const excluded = EXCLUDED_BY_COUNTRY[user?.country || ''] || [];

  const cards = ALL_CARDS
    .filter((c) => shortcuts.includes(c.key) && !excluded.includes(c.key))
    .map((c) => {
      const lbl = LABEL_MAP[c.key];
      return { ...c, label: t(lbl?.key ?? c.key, lbl?.fallback ?? c.key) };
    });

  const sections: HubSection[] = [
    {
      title: t('modules', 'Modules'),
      icon: Layers,
      color: 'text-blue-700',
      cards,
    },
  ];

  return (
    <ModuleHub
      title={t('modules', 'Modules')}
      sections={sections}
    />
  );
}
