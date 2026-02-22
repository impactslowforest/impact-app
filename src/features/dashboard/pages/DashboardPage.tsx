import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users, TreePine, Warehouse, FileCheck,
  Globe, Building2, ShieldCheck, Eye, Map, UserCog,
  MapPin, Home, ArrowRight, Leaf, Baby, Bean, Coffee,
  ClipboardCheck, Briefcase,
  BarChart3, PieChart as PieChartIcon, TrendingUp, Layers,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
  AreaChart, Area,
} from 'recharts';

type ChartType = 'bar' | 'pie' | 'line' | 'area';

const CHART_TYPES: { type: ChartType; icon: typeof BarChart3; label: string }[] = [
  { type: 'bar', icon: BarChart3, label: 'Bar' },
  { type: 'pie', icon: PieChartIcon, label: 'Pie' },
  { type: 'line', icon: TrendingUp, label: 'Line' },
  { type: 'area', icon: Layers, label: 'Area' },
];

function ChartTypeToggle({ value, onChange }: { value: ChartType; onChange: (t: ChartType) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {CHART_TYPES.map(({ type, icon: Icon, label }) => (
        <button key={type} type="button" onClick={() => onChange(type)} title={label}
          className={`p-1.5 rounded-md transition-all ${value === type ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useUIStore } from '@/stores/ui-store';
import { DASHBOARD_MENUS, filterByCountry } from '@/config/dashboard-items';
import pb from '@/config/pocketbase';

// Country colors — softer, professional palette
const COUNTRY_COLORS: Record<string, string> = {
  Laos: '#16a34a',
  Indonesia: '#d97706',
  Vietnam: '#2563eb',
};

const COUNTRY_KEYS: Record<string, string> = {
  laos: 'Laos',
  indonesia: 'Indonesia',
  vietnam: 'Vietnam',
};

function countryRoute(country: string | undefined, routes: Record<string, string>, fallback: string): string {
  if (!country || country === 'global') return fallback;
  return routes[country] || fallback;
}

export default function DashboardPage() {
  const { t } = useTranslation(['nav', 'common']);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [barChartType, setBarChartType] = useState<ChartType>('bar');
  const [pieChartType, setPieChartType] = useState<ChartType>('pie');
  const { dashboardMenus, dashboardKpis, dashboardCharts } = useUIStore();

  const c = user?.country;
  const isGlobal = !c || c === 'global';
  const countries = isGlobal ? ['laos', 'indonesia', 'vietnam'] : [c!];

  // ── Fetch KPI data ──────────────────────────────────
  const { data: coopCount = 0 } = useQuery({
    queryKey: ['kpi-cooperatives', c],
    queryFn: async () => {
      const filter = isGlobal ? '' : `country = "${c}"`;
      const r = await pb.collection('cooperatives').getList(1, 1, { filter: filter || undefined });
      return r.totalItems;
    },
  });

  const { data: farmerCount = 0 } = useQuery({
    queryKey: ['kpi-farmers', c],
    queryFn: async () => {
      const filter = isGlobal ? '' : `country = "${c}"`;
      const r = await pb.collection('farmers').getList(1, 1, { filter: filter || undefined });
      return r.totalItems;
    },
  });

  const { data: farmCount = 0 } = useQuery({
    queryKey: ['kpi-farms', c],
    queryFn: async () => {
      const filter = isGlobal ? '' : `country = "${c}"`;
      const r = await pb.collection('farms').getList(1, 1, { filter: filter || undefined });
      return r.totalItems;
    },
  });

  const { data: totalAreaHa = 0 } = useQuery({
    queryKey: ['kpi-area', c],
    queryFn: async () => {
      const filter = isGlobal ? '' : `country = "${c}"`;
      const farms = await pb.collection('farms').getFullList({ filter: filter || undefined, fields: 'area_ha' });
      return Math.round(farms.reduce((sum, f) => sum + (Number(f.area_ha) || 0), 0) * 100) / 100;
    },
  });

  const { data: countryStats = [] } = useQuery({
    queryKey: ['kpi-country-breakdown', c],
    queryFn: async () => {
      const results = [];
      for (const country of countries) {
        const filter = `country = "${country}"`;
        const [farmersR, farmsR, coopsR] = await Promise.all([
          pb.collection('farmers').getList(1, 1, { filter, fields: 'id' }),
          pb.collection('farms').getList(1, 1, { filter, fields: 'id' }),
          pb.collection('cooperatives').getList(1, 1, { filter, fields: 'id' }).catch(() => ({ totalItems: 0 })),
        ]);
        let area = 0;
        try {
          const allFarms = await pb.collection('farms').getFullList({ filter, fields: 'area_ha' });
          area = Math.round(allFarms.reduce((sum, f) => sum + (Number(f.area_ha) || 0), 0) * 100) / 100;
        } catch { /* empty */ }
        results.push({
          name: COUNTRY_KEYS[country] ?? country,
          key: country,
          farmers: farmersR.totalItems,
          farms: farmsR.totalItems,
          cooperatives: coopsR.totalItems,
          area,
        });
      }
      return results;
    },
    staleTime: 60000,
  });

  const avgArea = farmerCount > 0 ? (totalAreaHa / farmerCount).toFixed(1) : '0';

  const moduleCards = useMemo(() => [
    // Core modules (all countries)
    { key: 'region', icon: Globe, route: ROUTES.REGION_HUB, gradient: 'from-emerald-600 to-green-700' },
    { key: 'cooperative', icon: Users, route: countryRoute(c, { laos: `${ROUTES.LA_COOPERATIVE}/data`, indonesia: `${ROUTES.ID_COOPERATIVE}/data`, vietnam: `${ROUTES.VN_COOPERATIVE}/data` }, `${ROUTES.LA_COOPERATIVE}/data`), gradient: 'from-emerald-600 to-green-700' },
    { key: 'monitoring', icon: Eye, route: countryRoute(c, { laos: ROUTES.LA_GHG, indonesia: ROUTES.ID_EUDR, vietnam: ROUTES.VN_EUDR }, ROUTES.IMPACT_GHG), gradient: 'from-emerald-600 to-green-700' },
    { key: 'warehouse', icon: Warehouse, route: countryRoute(c, { laos: ROUTES.LA_WAREHOUSE, indonesia: ROUTES.ID_WAREHOUSE, vietnam: ROUTES.VN_WAREHOUSE }, ROUTES.MOD_WAREHOUSE), gradient: 'from-emerald-600 to-green-700' },
    { key: 'certification', icon: ShieldCheck, route: ROUTES.IMPACT_CERTIFICATION, gradient: 'from-emerald-600 to-green-700' },
    { key: 'documents', icon: FileCheck, route: ROUTES.CERT_LIBRARY, gradient: 'from-emerald-600 to-green-700' },
    { key: 'eudr', icon: ShieldCheck, route: countryRoute(c, { laos: ROUTES.LA_EUDR, indonesia: ROUTES.ID_EUDR, vietnam: ROUTES.VN_EUDR }, ROUTES.IMPACT_EUDR), gradient: 'from-red-500 to-rose-600' },
    { key: 'ghg', icon: BarChart3, route: countryRoute(c, { laos: ROUTES.LA_GHG }, ROUTES.IMPACT_GHG), gradient: 'from-teal-500 to-cyan-600' },
    { key: 'farm_map', icon: Map, route: ROUTES.MAP, gradient: 'from-blue-500 to-indigo-600' },
    { key: 'staff', icon: UserCog, route: countryRoute(c, { laos: ROUTES.LA_STAFF, indonesia: ROUTES.ID_STAFF, vietnam: ROUTES.VN_STAFF }, ROUTES.DASHBOARD), gradient: 'from-gray-500 to-slate-600' },
    { key: 'offices', icon: Building2, route: countryRoute(c, { laos: ROUTES.LA_OFFICES, indonesia: ROUTES.ID_OFFICES, vietnam: ROUTES.VN_OFFICES }, ROUTES.DASHBOARD), gradient: 'from-amber-500 to-orange-600' },
    { key: 'implementation', icon: Briefcase, route: ROUTES.IMPACT_IMPL, gradient: 'from-violet-500 to-purple-600' },
    { key: 'client_carbon', icon: Leaf, route: ROUTES.IMPACT_CLIENT_CARBON, gradient: 'from-lime-500 to-green-600' },
    // Country-specific modules
    { key: 'slow_farm', icon: TreePine, route: ROUTES.LA_SLOW_FARM, gradient: 'from-green-500 to-emerald-600' },
    { key: 'daycare', icon: Baby, route: ROUTES.LA_DAYCARE, gradient: 'from-pink-500 to-rose-600' },
    { key: 'cocoa_purchase', icon: Bean, route: ROUTES.ID_COCOA, gradient: 'from-yellow-600 to-amber-700' },
    { key: 'ra_audit', icon: ClipboardCheck, route: ROUTES.ID_RA_AUDIT, gradient: 'from-sky-500 to-blue-600' },
    { key: 'coffee_price', icon: Coffee, route: countryRoute(c, { laos: ROUTES.LA_COFFEE_PRICE, vietnam: ROUTES.VN_COFFEE_PRICE }, ROUTES.DASHBOARD), gradient: 'from-amber-600 to-yellow-700' },
    { key: 'cocoa_price', icon: Bean, route: ROUTES.ID_CACAO_PRICE, gradient: 'from-orange-600 to-red-700' },
  ], [c]);

  // Country-aware valid menu keys
  const validMenuKeys = useMemo(
    () => new Set(filterByCountry(DASHBOARD_MENUS, c).map(m => m.key)),
    [c]
  );

  const areaPieData = countryStats.filter(s => s.area > 0).map(s => ({ name: s.name, value: s.area }));

  // Navigation helpers
  const navToFarmers = (country: string) => {
    const routes: Record<string, string> = { laos: `${ROUTES.LA_COOPERATIVE}/data?tab=farmers`, indonesia: `${ROUTES.ID_COOPERATIVE}/data?tab=farmers`, vietnam: `${ROUTES.VN_COOPERATIVE}/data?tab=farmers` };
    navigate(routes[country] ?? ROUTES.DASHBOARD);
  };
  const navToFarms = (country: string) => {
    const routes: Record<string, string> = { laos: `${ROUTES.LA_COOPERATIVE}/data?tab=farms`, indonesia: `${ROUTES.ID_COOPERATIVE}/data?tab=farms`, vietnam: `${ROUTES.VN_COOPERATIVE}/data?tab=farms` };
    navigate(routes[country] ?? ROUTES.DASHBOARD);
  };

  // KPI cards
  const kpis = [
    { key: 'cooperatives', label: t('common:cooperatives', 'Cooperatives'), value: coopCount, icon: Building2, gradient: 'from-green-500 to-emerald-600', route: countryRoute(c, { laos: ROUTES.LA_COOPERATIVE, indonesia: ROUTES.ID_COOPERATIVE, vietnam: ROUTES.VN_COOPERATIVE }, ROUTES.DASHBOARD) },
    { key: 'farmers', label: t('common:farmers', 'Farmers'), value: farmerCount, icon: Users, gradient: 'from-amber-500 to-orange-600', route: countryRoute(c, { laos: `${ROUTES.LA_COOPERATIVE}/data?tab=farmers`, indonesia: `${ROUTES.ID_COOPERATIVE}/data?tab=farmers`, vietnam: `${ROUTES.VN_COOPERATIVE}/data?tab=farmers` }, ROUTES.DASHBOARD) },
    { key: 'farms', label: t('common:total_plots', 'Farms'), value: farmCount, icon: TreePine, gradient: 'from-emerald-500 to-teal-600', route: countryRoute(c, { laos: `${ROUTES.LA_COOPERATIVE}/data?tab=farms`, indonesia: `${ROUTES.ID_COOPERATIVE}/data?tab=farms`, vietnam: `${ROUTES.VN_COOPERATIVE}/data?tab=farms` }, ROUTES.DASHBOARD) },
    { key: 'total_area', label: t('common:total_area', 'Total Area'), value: `${totalAreaHa.toLocaleString()} ha`, icon: MapPin, gradient: 'from-blue-500 to-indigo-600', route: countryRoute(c, { laos: ROUTES.LA_EUDR, indonesia: ROUTES.ID_EUDR, vietnam: ROUTES.VN_EUDR }, ROUTES.IMPACT_EUDR) },
    { key: 'avg_area', label: t('common:avg_area', 'Avg / Farmer'), value: `${avgArea} ha`, icon: Home, gradient: 'from-purple-500 to-violet-600', route: ROUTES.IMPACT_EUDR },
    { key: 'eudr_plots', label: 'EUDR Plots', value: farmCount, icon: ShieldCheck, gradient: 'from-red-500 to-rose-600', route: countryRoute(c, { laos: ROUTES.LA_EUDR, indonesia: ROUTES.ID_EUDR, vietnam: ROUTES.VN_EUDR }, ROUTES.IMPACT_EUDR) },
  ];
  const visibleKpis = kpis.filter(k => dashboardKpis.includes(k.key));

  return (
    <div className="flex flex-col gap-6 page-enter min-h-full">
      {/* ── Row 1: Quick Navigation ─────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {moduleCards.filter(mod => validMenuKeys.has(mod.key) && dashboardMenus.includes(mod.key)).map((mod) => {
          const Icon = mod.icon;
          return (
            <button key={mod.key} type="button" onClick={() => navigate(mod.route)}
              className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm">
              <div className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${mod.gradient} text-white shrink-0 shadow group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-semibold text-gray-700 truncate block">
                  {t(`nav:${mod.key}`, { defaultValue: mod.key.replace(/_/g, ' ') })}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

      {/* ── Row 2: KPI Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button key={kpi.key} type="button" onClick={() => navigate(kpi.route)}
              className="rounded-xl bg-white border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left shadow-sm group relative overflow-hidden">
              {/* Subtle gradient background accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${kpi.gradient} opacity-[0.06] rounded-bl-full`} />
              <div className="flex items-center justify-between relative">
                <div className={`flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${kpi.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="relative">
                <div className="text-2xl font-extrabold text-gray-800 leading-none tracking-tight">
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{kpi.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Row 3: Charts + Summary ──────────────────────── */}
      {(dashboardCharts.includes('farmers_farms_chart') || dashboardCharts.includes('area_chart') || dashboardCharts.includes('summary_table')) && (
      <div className={`grid grid-cols-1 gap-4 flex-1 ${
        [dashboardCharts.includes('farmers_farms_chart'), dashboardCharts.includes('area_chart'), dashboardCharts.includes('summary_table')].filter(Boolean).length === 3 ? 'lg:grid-cols-3' :
        [dashboardCharts.includes('farmers_farms_chart'), dashboardCharts.includes('area_chart'), dashboardCharts.includes('summary_table')].filter(Boolean).length === 2 ? 'lg:grid-cols-2' : ''
      }`}>
        {/* Farmers & Farms Chart */}
        {dashboardCharts.includes('farmers_farms_chart') && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500 to-green-500 flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-white" />
              </div>
              {t('common:farmers', 'Farmers')} & {t('common:total_plots', 'Farms')}
            </h3>
            <ChartTypeToggle value={barChartType} onChange={setBarChartType} />
          </div>
          <div className="flex-1 min-h-[220px]">
            {countryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {barChartType === 'pie' ? (
                  <PieChart>
                    <Pie data={countryStats.map(s => ({ name: s.name, value: s.farmers }))} cx="50%" cy="50%" outerRadius="70%" dataKey="value" label>
                      {countryStats.map((s) => <Cell key={s.name} fill={COUNTRY_COLORS[s.name] || '#8b5cf6'} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : barChartType === 'line' ? (
                  <LineChart data={countryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} width={40} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="farmers" name="Farmers" stroke="#d97706" strokeWidth={2} dot={{ r: 5, fill: '#d97706' }} />
                    <Line type="monotone" dataKey="farms" name="Farms" stroke="#16a34a" strokeWidth={2} dot={{ r: 5, fill: '#16a34a' }} />
                  </LineChart>
                ) : barChartType === 'area' ? (
                  <AreaChart data={countryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} width={40} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="farmers" name="Farmers" stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="farms" name="Farms" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
                  </AreaChart>
                ) : (
                  <BarChart data={countryStats} barCategoryGap="25%"
                    onClick={(data) => {
                      if (data?.activePayload?.[0]?.payload?.key) {
                        navToFarmers(data.activePayload[0].payload.key);
                      }
                    }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(value: number, name: string) => [value.toLocaleString(), name === 'farmers' ? 'Farmers' : 'Farms']}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="farmers" name="Farmers" fill="#d97706" radius={[6, 6, 0, 0]} cursor="pointer" />
                    <Bar dataKey="farms" name="Farms" fill="#16a34a" radius={[6, 6, 0, 0]} cursor="pointer" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">{t('common:loading', 'Loading...')}</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Area Chart */}
        {dashboardCharts.includes('area_chart') && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              {t('common:total_area', 'Area')} (ha)
            </h3>
            <ChartTypeToggle value={pieChartType} onChange={setPieChartType} />
          </div>
          <div className="flex-1 min-h-[220px] flex items-center">
            {areaPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {pieChartType === 'bar' ? (
                  <BarChart data={areaPieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ha`]} />
                    <Bar dataKey="value" name="Area (ha)" radius={[4, 4, 0, 0]}>
                      {areaPieData.map((entry) => <Cell key={entry.name} fill={COUNTRY_COLORS[entry.name] || '#8b5cf6'} />)}
                    </Bar>
                  </BarChart>
                ) : pieChartType === 'line' ? (
                  <LineChart data={areaPieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ha`]} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 5, fill: '#2563eb' }} />
                  </LineChart>
                ) : pieChartType === 'area' ? (
                  <AreaChart data={areaPieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ha`]} />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Pie data={areaPieData} cx="50%" cy="50%" outerRadius="75%" innerRadius="45%"
                      dataKey="value" paddingAngle={3} cursor="pointer" strokeWidth={2} stroke="#fff"
                      onClick={(entry) => {
                        const key = Object.entries(COUNTRY_KEYS).find(([, v]) => v === entry.name)?.[0];
                        if (key) navToFarms(key);
                      }}
                      label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                      labelLine={false}>
                      {areaPieData.map((entry) => (
                        <Cell key={entry.name} fill={COUNTRY_COLORS[entry.name] || '#8b5cf6'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ha`]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="w-full flex items-center justify-center">
                <p className="text-sm text-gray-400">{t('common:loading', 'Loading...')}</p>
              </div>
            )}
          </div>
          {/* Legend below pie */}
          {areaPieData.length > 0 && (
            <div className="flex justify-center gap-4 mt-1">
              {areaPieData.map((entry) => (
                <button key={entry.name} type="button"
                  onClick={() => { const k = Object.entries(COUNTRY_KEYS).find(([, v]) => v === entry.name)?.[0]; if (k) navToFarms(k); }}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COUNTRY_COLORS[entry.name] }} />
                  {entry.name}
                </button>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Summary Table */}
        {dashboardCharts.includes('summary_table') && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Globe className="h-3.5 w-3.5 text-white" />
            </div>
            {t('common:summary_by_country', 'Summary by Country')}
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-2 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t('common:country', 'Country')}</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Coops</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t('common:farmers', 'Farmers')}</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t('common:total_plots', 'Farms')}</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">ha</th>
                </tr>
              </thead>
              <tbody>
                {countryStats.map((s) => (
                  <tr key={s.name} className="border-b border-gray-50 hover:bg-primary-50/30 cursor-pointer transition-colors"
                    onClick={() => navToFarmers(s.key)}>
                    <td className="py-2.5 px-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COUNTRY_COLORS[s.name] }} />
                        {s.name}
                      </div>
                    </td>
                    <td className="text-right py-2.5 px-2 text-gray-600">{s.cooperatives}</td>
                    <td className="text-right py-2.5 px-2 font-bold text-gray-800">{s.farmers.toLocaleString()}</td>
                    <td className="text-right py-2.5 px-2 text-gray-600">{s.farms.toLocaleString()}</td>
                    <td className="text-right py-2.5 px-2 text-gray-600">{s.area.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              {countryStats.length > 1 && (
                <tfoot>
                  <tr className="font-bold text-primary-800 border-t-2 border-gray-200 bg-gray-50/50">
                    <td className="py-2.5 px-2">{t('common:total', 'Total')}</td>
                    <td className="text-right py-2.5 px-2">{coopCount}</td>
                    <td className="text-right py-2.5 px-2">{farmerCount.toLocaleString()}</td>
                    <td className="text-right py-2.5 px-2">{farmCount.toLocaleString()}</td>
                    <td className="text-right py-2.5 px-2">{totalAreaHa.toLocaleString()}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {/* Progress bars */}
          {countryStats.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              {countryStats.map((s) => {
                const pct = farmerCount > 0 ? (s.farmers / farmerCount) * 100 : 0;
                return (
                  <button key={s.name} type="button" onClick={() => navToFarmers(s.key)}
                    className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-xs text-gray-500 w-16 text-right shrink-0">{s.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: COUNTRY_COLORS[s.name] }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-10">{Math.round(pct)}%</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        )}
      </div>
      )}
    </div>
  );
}
