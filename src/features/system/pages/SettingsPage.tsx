import { useTranslation } from 'react-i18next';
import {
  Settings, Type, Hash, Ruler, Layers, LayoutGrid,
  Map, Warehouse, FileCheck, Building2, TreePine, Baby,
  ShieldCheck, BarChart3, BookOpen, Coffee, Bean,
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
  filterByCountry, type DashboardItem,
} from '@/config/dashboard-items';

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

/** Reusable toggle row */
function ToggleRow({ icon: Icon, label, enabled, onToggle }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
      enabled ? 'bg-primary-50/50 border-primary-200' : 'bg-gray-50/50 border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
          enabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-sm font-medium ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}

/** Reusable toggle list card for dashboard items */
function ToggleListCard<K extends string>({
  title, icon: Icon, hint, items, enabledKeys, onToggle, t,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
  items: DashboardItem<K>[];
  enabledKeys: string[];
  onToggle: (key: string) => void;
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">{hint}</p>
        <div className="space-y-2">
          {items.map((item) => (
            <ToggleRow
              key={item.key}
              icon={item.icon}
              label={t(`common:${item.labelKey}`, item.fallback)}
              enabled={enabledKeys.includes(item.key)}
              onToggle={() => {
                onToggle(item.key);
                toast.success(t('common:saved'));
              }}
            />
          ))}
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
    shortcuts, toggleShortcut,
    dashboardMenus, toggleDashboardMenu,
    dashboardKpis, toggleDashboardKpi,
    dashboardCharts, toggleDashboardChart,
  } = useUIStore();
  const { user } = useAuth();
  const country = user?.country || '';
  const excluded = EXCLUDED_BY_COUNTRY[country] || [];
  const visibleShortcuts = AVAILABLE_SHORTCUTS.filter((sc) => !excluded.includes(sc.key));

  // Filter dashboard items by user's country
  const visibleMenus = filterByCountry(DASHBOARD_MENUS, country);
  const visibleKpis = filterByCountry(DASHBOARD_KPIS, country);
  const visibleCharts = filterByCountry(DASHBOARD_CHARTS, country);

  return (
    <div className="space-y-6 max-w-2xl">
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
          {/* Sidebar Shortcuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary-600" />
                {t('common:quick_shortcuts', 'Sidebar Shortcuts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {t('common:shortcuts_hint', 'Choose which modules appear in your sidebar Modules section for quick access.')}
              </p>
              <div className="space-y-2">
                {visibleShortcuts.map((sc) => (
                  <ToggleRow
                    key={sc.key}
                    icon={sc.icon}
                    label={t(`nav:${sc.labelKey}`, sc.fallback)}
                    enabled={shortcuts.includes(sc.key)}
                    onToggle={() => {
                      toggleShortcut(sc.key);
                      toast.success(t('common:saved'));
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation (Dashboard Row 1) */}
          <ToggleListCard
            title={t('common:quick_navigation', 'Quick Navigation')}
            icon={LayoutGrid}
            hint={t('common:quick_nav_hint', 'Toggle which quick access buttons appear on the Dashboard home screen (Row 1).')}
            items={visibleMenus}
            enabledKeys={dashboardMenus}
            onToggle={toggleDashboardMenu}
            t={t}
          />

          {/* KPI Cards (Dashboard Row 2) */}
          <ToggleListCard
            title={t('common:kpi_cards', 'KPI Cards')}
            icon={BarChart3}
            hint={t('common:kpi_hint', 'Toggle which KPI metric cards appear on the Dashboard home screen (Row 2).')}
            items={visibleKpis}
            enabledKeys={dashboardKpis}
            onToggle={toggleDashboardKpi}
            t={t}
          />

          {/* Charts & Tables (Dashboard Row 3) */}
          <ToggleListCard
            title={t('common:charts_tables', 'Charts & Tables')}
            icon={BarChart3}
            hint={t('common:charts_hint', 'Toggle which charts and tables appear on the Dashboard home screen (Row 3).')}
            items={visibleCharts}
            enabledKeys={dashboardCharts}
            onToggle={toggleDashboardChart}
            t={t}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
