import type { LucideIcon } from 'lucide-react';
import {
  Globe, Users, Eye, Warehouse, ShieldCheck, FileCheck,
  Building2, TreePine, MapPin, Home, Map, UserCog,
  BarChart3, Leaf, Baby, Bean, Coffee, ClipboardCheck,
  Briefcase,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────
export type DashboardMenuKey =
  | 'region' | 'cooperative' | 'monitoring' | 'warehouse' | 'certification' | 'documents'
  | 'eudr' | 'ghg' | 'farm_map' | 'staff' | 'offices'
  | 'slow_farm' | 'daycare' | 'cocoa_purchase' | 'ra_audit'
  | 'coffee_price' | 'cocoa_price' | 'implementation' | 'client_carbon';

export type DashboardKpiKey = 'cooperatives' | 'farmers' | 'farms' | 'total_area' | 'avg_area' | 'eudr_plots';
export type DashboardChartKey = 'farmers_farms_chart' | 'area_chart' | 'summary_table';

export interface DashboardItem<K extends string> {
  key: K;
  labelKey: string;
  fallback: string;
  icon: LucideIcon;
  /** Empty = available to all countries. Non-empty = only these countries. */
  countries: string[];
}

// ── Quick Navigation Items (Dashboard Row 1) ───────────
export const DASHBOARD_MENUS: DashboardItem<DashboardMenuKey>[] = [
  // Core modules (all countries)
  { key: 'region', labelKey: 'region', fallback: 'Region', icon: Globe, countries: [] },
  { key: 'cooperative', labelKey: 'cooperative', fallback: 'Cooperative', icon: Users, countries: [] },
  { key: 'monitoring', labelKey: 'monitoring', fallback: 'Monitoring', icon: Eye, countries: [] },
  { key: 'warehouse', labelKey: 'warehouse', fallback: 'Warehouse', icon: Warehouse, countries: [] },
  { key: 'certification', labelKey: 'certification', fallback: 'Certification', icon: ShieldCheck, countries: [] },
  { key: 'documents', labelKey: 'documents', fallback: 'Documents', icon: FileCheck, countries: [] },
  { key: 'eudr', labelKey: 'eudr_compliance', fallback: 'EUDR', icon: ShieldCheck, countries: [] },
  { key: 'ghg', labelKey: 'ghg_sbti', fallback: 'GHG / SBTi', icon: BarChart3, countries: [] },
  { key: 'farm_map', labelKey: 'farm_map', fallback: 'Farm Map', icon: Map, countries: [] },
  { key: 'staff', labelKey: 'staff_info', fallback: 'Staff Info', icon: UserCog, countries: [] },
  { key: 'offices', labelKey: 'offices', fallback: 'Offices', icon: Building2, countries: [] },
  { key: 'implementation', labelKey: 'implementation', fallback: 'Implementation', icon: Briefcase, countries: [] },
  { key: 'client_carbon', labelKey: 'client_carbon', fallback: 'Client Carbon', icon: Leaf, countries: [] },
  // Country-specific modules
  { key: 'slow_farm', labelKey: 'slow_farm', fallback: 'Slow Farm', icon: TreePine, countries: ['laos'] },
  { key: 'daycare', labelKey: 'daycare_center', fallback: 'Daycare Center', icon: Baby, countries: ['laos'] },
  { key: 'cocoa_purchase', labelKey: 'cocoa_purchase', fallback: 'Cocoa Purchase', icon: Bean, countries: ['indonesia'] },
  { key: 'ra_audit', labelKey: 'ra_audit', fallback: 'RA Internal Audit', icon: ClipboardCheck, countries: ['indonesia'] },
  { key: 'coffee_price', labelKey: 'coffee_raw_material_price', fallback: 'Coffee Price', icon: Coffee, countries: ['laos', 'vietnam'] },
  { key: 'cocoa_price', labelKey: 'cacao_raw_material_price', fallback: 'Cocoa Price', icon: Bean, countries: ['indonesia'] },
];

// ── KPI Cards (Dashboard Row 2) ────────────────────────
export const DASHBOARD_KPIS: DashboardItem<DashboardKpiKey>[] = [
  { key: 'cooperatives', labelKey: 'cooperatives', fallback: 'Cooperatives', icon: Building2, countries: [] },
  { key: 'farmers', labelKey: 'farmers', fallback: 'Farmers', icon: Users, countries: [] },
  { key: 'farms', labelKey: 'total_plots', fallback: 'Farms', icon: TreePine, countries: [] },
  { key: 'total_area', labelKey: 'total_area', fallback: 'Total Area', icon: MapPin, countries: [] },
  { key: 'avg_area', labelKey: 'avg_area', fallback: 'Avg / Farmer', icon: Home, countries: [] },
  { key: 'eudr_plots', labelKey: 'eudr_plots', fallback: 'EUDR Plots', icon: ShieldCheck, countries: [] },
];

// ── Charts & Tables (Dashboard Row 3) ──────────────────
export const DASHBOARD_CHARTS: DashboardItem<DashboardChartKey>[] = [
  { key: 'farmers_farms_chart', labelKey: 'farmers_farms_chart', fallback: 'Farmers & Farms', icon: BarChart3, countries: [] },
  { key: 'area_chart', labelKey: 'area_chart', fallback: 'Area Distribution', icon: MapPin, countries: [] },
  { key: 'summary_table', labelKey: 'summary_table', fallback: 'Summary by Country', icon: Globe, countries: [] },
];

// ── Default key arrays ─────────────────────────────────
export const ALL_MENU_KEYS: DashboardMenuKey[] = DASHBOARD_MENUS.map(m => m.key);
/** Default menus shown for new users (core 5 — Region is opt-in for country accounts) */
export const DEFAULT_MENU_KEYS: DashboardMenuKey[] = ['cooperative', 'monitoring', 'warehouse', 'certification', 'documents'];
export const ALL_KPI_KEYS: DashboardKpiKey[] = DASHBOARD_KPIS.map(k => k.key);
export const ALL_CHART_KEYS: DashboardChartKey[] = DASHBOARD_CHARTS.map(c => c.key);

// ── Helpers ────────────────────────────────────────────
export function filterByCountry<K extends string>(items: DashboardItem<K>[], country?: string): DashboardItem<K>[] {
  if (!country || country === 'global') return items;
  return items.filter(item => item.countries.length === 0 || item.countries.includes(country));
}
