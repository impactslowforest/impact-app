import { useTranslation } from 'react-i18next';
import {
  Settings, Type, Hash, Ruler, Layers, LayoutGrid,
  Map, Warehouse, FileCheck, Building2, TreePine, Baby,
  ShieldCheck, BarChart3, BookOpen, Coffee, Bean, Globe,
  Palette, Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUIStore } from '@/stores/ui-store';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DASHBOARD_MENUS, DASHBOARD_KPIS, DASHBOARD_CHARTS,
} from '@/config/dashboard-items';
import { THEME_PRESETS, applyTheme } from '@/config/themes';

/** Shortcuts excluded per country */
const EXCLUDED_BY_COUNTRY: Record<string, string[]> = {
  indonesia: ['daycare', 'slow_farm', 'coffee_price'],
  vietnam: ['daycare', 'slow_farm', 'cocoa_price'],
  laos: ['cocoa_price'],
};

const FONT_SIZES = [
  { value: '14', label: 'Small (14px)' },
  { value: '16', label: 'Medium (16px)' },
  { value: '17', label: 'Large (17px)' },
  { value: '20', label: 'Extra Large (20px)' },
];

/** Available module shortcuts that users can toggle on/off in the sidebar */
const AVAILABLE_SHORTCUTS = [
  { key: 'farm_map', labelKey: 'farm_map', fallback: 'Farm map', icon: Map },
  { key: 'warehouse', labelKey: 'warehouse', fallback: 'Warehouse', icon: Warehouse },
  { key: 'certification', labelKey: 'certification', fallback: 'Certification', icon: FileCheck },
  { key: 'cooperative', labelKey: 'cooperative', fallback: 'Cooperative', icon: Building2 },
  { key: 'slow_farm', labelKey: 'slow_farm', fallback: 'Slow farm', icon: TreePine },
  { key: 'daycare', labelKey: 'daycare_center', fallback: 'Daycare center', icon: Baby },
  { key: 'eudr', labelKey: 'eudr_compliance', fallback: 'EUDR Compliance', icon: ShieldCheck },
  { key: 'ghg', labelKey: 'ghg_sbti', fallback: 'GHG / SBTi', icon: BarChart3 },
  { key: 'documents', labelKey: 'documents', fallback: 'Documents', icon: BookOpen },
  { key: 'coffee_price', labelKey: 'coffee_raw_material_price', fallback: 'Coffee price', icon: Coffee },
  { key: 'cocoa_price', labelKey: 'cacao_raw_material_price', fallback: 'Cocoa price', icon: Bean },
];

/** Country column definitions */
const COUNTRY_COLS: { key: string; label: string; flag?: string }[] = [
  { key: 'all', label: 'Global', flag: '' },
  { key: 'laos', label: 'Laos', flag: 'la' },
  { key: 'indonesia', label: 'Indonesia', flag: 'id' },
  { key: 'vietnam', label: 'Vietnam', flag: 'vn' },
];

/** Matrix toggle cell — a compact colored circle that acts as a checkbox */
function MatrixCell({ enabled, excluded, onToggle }: {
  enabled: boolean;
  excluded: boolean;
  onToggle: () => void;
}) {
  if (excluded) {
    return (
      <div className="flex items-center justify-center" title="Not available for this country">
        <div className="w-6 h-6 rounded-full bg-gray-100 border border-dashed border-gray-300" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
        enabled
          ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
          : 'bg-white border-gray-300 text-transparent hover:border-primary-400'
      }`}
      title={enabled ? 'Enabled — click to disable' : 'Disabled — click to enable'}
    >
      {enabled && <Check className="h-3.5 w-3.5" />}
    </button>
  );
}

/** Matrix table: rows = items, columns = countries */
function MatrixCard<T extends { key: string; labelKey?: string; fallback?: string; icon?: React.ComponentType<{ className?: string }> }>({
  title,
  icon: TitleIcon,
  hint,
  items,
  countries,
  getEnabled,
  getExcluded,
  onToggle,
  t,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  items: T[];
  countries: typeof COUNTRY_COLS;
  getEnabled: (itemKey: string, countryKey: string) => boolean;
  getExcluded: (itemKey: string, countryKey: string) => boolean;
  onToggle: (itemKey: string, countryKey: string) => void;
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TitleIcon className="h-4 w-4 text-primary-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">{hint}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-3 font-medium text-gray-600 text-xs w-[180px]">Module</th>
                {countries.map((c) => (
                  <th key={c.key} className="text-center py-2 px-2 font-medium text-gray-600 text-xs min-w-[60px]">
                    <div className="flex flex-col items-center gap-1">
                      {c.flag ? (
                        <img
                          src={`https://flagcdn.com/w40/${c.flag}.png`}
                          alt={c.label}
                          className="h-4 w-6 rounded-[2px] object-cover shadow-sm"
                        />
                      ) : (
                        <Globe className="h-4 w-4 text-primary-600" />
                      )}
                      <span>{c.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const Icon = item.icon;
                const label = item.labelKey
                  ? t(`nav:${item.labelKey}`, item.fallback || item.key)
                  : (item.fallback || item.key);
                return (
                  <tr key={item.key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        {Icon && (
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <span className="text-[13px] font-medium text-gray-700 truncate">{label}</span>
                      </div>
                    </td>
                    {countries.map((c) => (
                      <td key={c.key} className="py-2.5 px-2 text-center">
                        <div className="flex justify-center">
                          <MatrixCell
                            enabled={getEnabled(item.key, c.key)}
                            excluded={getExcluded(item.key, c.key)}
                            onToggle={() => onToggle(item.key, c.key)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation(['common', 'nav']);
  const {
    fontSize, setFontSize,
    numberFormat, setNumberFormat,
    unitSystem, setUnitSystem,
    dashboardKpis, toggleDashboardKpi,
    dashboardCharts, toggleDashboardChart,
    countryShortcuts, toggleCountryShortcut,
    countryDashboardMenus, toggleCountryDashboardMenu,
    themeColor, setThemeColor,
  } = useUIStore();
  const { user } = useAuth();
  const isGlobalUser = user?.country === 'global';

  // For global users: show all 4 columns. For country users: only their column.
  const visibleCountryCols = isGlobalUser
    ? COUNTRY_COLS
    : COUNTRY_COLS.filter(c => c.key === user?.country);

  // Check if a shortcut is excluded for a given country
  const isShortcutExcluded = (key: string, countryKey: string) => {
    return (EXCLUDED_BY_COUNTRY[countryKey] || []).includes(key);
  };

  // Check if a dashboard menu is excluded for a given country
  const isDashMenuExcluded = (key: string, countryKey: string) => {
    if (countryKey === 'all' || countryKey === 'global') return false;
    const item = DASHBOARD_MENUS.find(m => m.key === key);
    if (!item) return true;
    return item.countries.length > 0 && !item.countries.includes(countryKey);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary-600" />
          {t('nav:settings')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('common:settings_description', 'Configure display preferences for the application')}
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList variant="line">
          <TabsTrigger value="general" className="gap-1.5">
            <Settings className="h-4 w-4" />
            {t('common:general', 'General')}
          </TabsTrigger>
          <TabsTrigger value="quick-menu" className="gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            {t('common:quick_menu', 'Quick Menu')}
          </TabsTrigger>
        </TabsList>

        {/* ── General Tab ──────────────────────────────────── */}
        <TabsContent value="general" className="space-y-6 mt-4">
          {/* Theme Color */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary-600" />
                {t('common:theme_color', 'Theme Color')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  {t('common:theme_color_hint', 'Choose the primary color for the entire application. Changes apply immediately.')}
                </p>
                <div className="flex flex-wrap gap-3">
                  {THEME_PRESETS.map((theme) => {
                    const isSelected = themeColor === theme.key;
                    return (
                      <button
                        key={theme.key}
                        type="button"
                        onClick={() => {
                          setThemeColor(theme.key);
                          applyTheme(theme.key);
                          toast.success(t('common:saved'));
                        }}
                        className={`relative w-12 h-12 rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                            : 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                        }`}
                        style={{ backgroundColor: theme.preview }}
                        title={theme.label}
                      >
                        {isSelected && (
                          <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: THEME_PRESETS.find((t) => t.key === themeColor)?.preview }}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {THEME_PRESETS.find((t) => t.key === themeColor)?.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="h-4 w-4 text-primary-600" />
                {t('common:font_size', 'Font Size')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t('common:select_font_size', 'Select display font size')}</Label>
                <Select
                  value={String(fontSize)}
                  onValueChange={(v) => {
                    setFontSize(Number(v));
                    toast.success(t('common:saved'));
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((fs) => (
                      <SelectItem key={fs.value} value={fs.value}>{fs.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('common:font_size_hint', 'Changes apply immediately across the entire application')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Number Format */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary-600" />
                {t('common:number_format', 'Number Format')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t('common:decimal_separator', 'Decimal separator style')}</Label>
                <Select
                  value={numberFormat}
                  onValueChange={(v) => {
                    setNumberFormat(v as 'dot' | 'comma');
                    toast.success(t('common:saved'));
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dot">1,234.56 (dot decimal)</SelectItem>
                    <SelectItem value="comma">1.234,56 (comma decimal)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('common:number_format_hint', 'How numbers are displayed throughout the application')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Units */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary-600" />
                {t('common:measurement_units', 'Measurement Units')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>{t('common:unit_system', 'Unit system')}</Label>
                <Select
                  value={unitSystem}
                  onValueChange={(v) => {
                    setUnitSystem(v as 'metric' | 'imperial');
                    toast.success(t('common:saved'));
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (ha, km, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (acres, miles, lbs)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('common:units_hint', 'Affects how areas, distances, and weights are displayed')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Quick Menu Tab ────────────────────────────────── */}
        <TabsContent value="quick-menu" className="space-y-6 mt-4">
          {/* Sidebar Shortcuts — matrix */}
          <MatrixCard
            title={t('common:quick_shortcuts', 'Sidebar Shortcuts')}
            icon={Layers}
            hint={t('common:shortcuts_hint', 'Choose which modules appear in your sidebar Modules section for quick access.')}
            items={AVAILABLE_SHORTCUTS}
            countries={visibleCountryCols}
            getEnabled={(itemKey, countryKey) =>
              (countryShortcuts[countryKey] || []).includes(itemKey)
            }
            getExcluded={(itemKey, countryKey) => isShortcutExcluded(itemKey, countryKey)}
            onToggle={(itemKey, countryKey) => {
              toggleCountryShortcut(countryKey, itemKey);
              toast.success(t('common:saved'));
            }}
            t={t}
          />

          {/* Quick Navigation (Dashboard) — matrix */}
          <MatrixCard
            title={t('common:quick_navigation', 'Quick Navigation')}
            icon={LayoutGrid}
            hint={t('common:quick_nav_hint', 'Toggle which quick access buttons appear on the Dashboard home screen.')}
            items={DASHBOARD_MENUS}
            countries={visibleCountryCols}
            getEnabled={(itemKey, countryKey) =>
              (countryDashboardMenus[countryKey] || []).includes(itemKey)
            }
            getExcluded={(itemKey, countryKey) => isDashMenuExcluded(itemKey, countryKey)}
            onToggle={(itemKey, countryKey) => {
              toggleCountryDashboardMenu(countryKey, itemKey);
              toast.success(t('common:saved'));
            }}
            t={t}
          />

          {/* KPI Cards — shared across all countries (no per-country) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary-600" />
                {t('common:kpi_cards', 'KPI Cards')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {t('common:kpi_hint', 'Toggle which KPI metric cards appear on the Dashboard home screen.')}
              </p>
              <div className="space-y-2">
                {DASHBOARD_KPIS.map((item) => {
                  const Icon = item.icon;
                  const enabled = dashboardKpis.includes(item.key);
                  return (
                    <div key={item.key} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 transition-colors ${
                      enabled ? 'bg-primary-50/50 border-primary-200' : 'bg-gray-50/50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                          enabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className={`text-[13px] font-medium ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {t(`common:${item.labelKey}`, item.fallback)}
                        </span>
                      </div>
                      <Switch checked={enabled} onCheckedChange={() => { toggleDashboardKpi(item.key); toast.success(t('common:saved')); }} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Charts & Tables — shared */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary-600" />
                {t('common:charts_tables', 'Charts & Tables')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {t('common:charts_hint', 'Toggle which charts and tables appear on the Dashboard home screen.')}
              </p>
              <div className="space-y-2">
                {DASHBOARD_CHARTS.map((item) => {
                  const Icon = item.icon;
                  const enabled = dashboardCharts.includes(item.key);
                  return (
                    <div key={item.key} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 transition-colors ${
                      enabled ? 'bg-primary-50/50 border-primary-200' : 'bg-gray-50/50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                          enabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className={`text-[13px] font-medium ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {t(`common:${item.labelKey}`, item.fallback)}
                        </span>
                      </div>
                      <Switch checked={enabled} onCheckedChange={() => { toggleDashboardChart(item.key); toast.success(t('common:saved')); }} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
