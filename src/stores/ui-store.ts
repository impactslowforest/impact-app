import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_MENU_KEYS, ALL_MENU_KEYS, ALL_KPI_KEYS, ALL_CHART_KEYS } from '@/config/dashboard-items';

type NumberFormat = 'dot' | 'comma';
type UnitSystem = 'metric' | 'imperial';

const DEFAULT_SHORTCUTS = ['farm_map', 'warehouse', 'certification', 'cooperative', 'slow_farm'];
const ALL_SHORTCUTS = ['farm_map', 'warehouse', 'certification', 'cooperative', 'slow_farm', 'daycare', 'eudr', 'ghg', 'documents', 'coffee_price', 'cocoa_price'];

interface UIState {
  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  syncPanelOpen: boolean;
  chatbotOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  collapseSidebar: () => void;
  toggleSyncPanel: () => void;
  toggleChatbot: () => void;
  setChatbotOpen: (open: boolean) => void;

  // User preferences (persisted)
  fontSize: number;
  numberFormat: NumberFormat;
  unitSystem: UnitSystem;
  shortcuts: string[];
  setFontSize: (size: number) => void;
  setNumberFormat: (format: NumberFormat) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setShortcuts: (shortcuts: string[]) => void;
  toggleShortcut: (key: string) => void;

  // Dashboard quick menu settings (persisted, per-user)
  dashboardMenus: string[];
  dashboardKpis: string[];
  dashboardCharts: string[];
  toggleDashboardMenu: (key: string) => void;
  toggleDashboardKpi: (key: string) => void;
  toggleDashboardChart: (key: string) => void;

  // Per-country quick menu settings (persisted)
  countryShortcuts: Record<string, string[]>;
  countryDashboardMenus: Record<string, string[]>;
  toggleCountryShortcut: (country: string, key: string) => void;
  toggleCountryDashboardMenu: (country: string, key: string) => void;

  // Global user: active country scope
  activeCountry: 'all' | 'laos' | 'indonesia' | 'vietnam';
  setActiveCountry: (country: 'all' | 'laos' | 'indonesia' | 'vietnam') => void;

  // Theme color (persisted per user)
  themeColor: string;
  setThemeColor: (key: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Layout
      sidebarOpen: true,
      sidebarCollapsed: false,
      syncPanelOpen: false,
      chatbotOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      collapseSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleSyncPanel: () => set((state) => ({ syncPanelOpen: !state.syncPanelOpen })),
      toggleChatbot: () => set((state) => ({ chatbotOpen: !state.chatbotOpen })),
      setChatbotOpen: (open) => set({ chatbotOpen: open }),

      // User preferences
      fontSize: 17,
      numberFormat: 'dot',
      unitSystem: 'metric',
      shortcuts: [...DEFAULT_SHORTCUTS],
      setFontSize: (size) => set({ fontSize: size }),
      setNumberFormat: (format) => set({ numberFormat: format }),
      setUnitSystem: (system) => set({ unitSystem: system }),
      setShortcuts: (shortcuts) => set({ shortcuts }),
      toggleShortcut: (key) => set((state) => {
        const next = state.shortcuts.includes(key)
          ? state.shortcuts.filter((k) => k !== key)
          : [...state.shortcuts, key];
        return { shortcuts: next };
      }),

      // Dashboard quick menu (all enabled by default)
      dashboardMenus: [...DEFAULT_MENU_KEYS],
      dashboardKpis: [...ALL_KPI_KEYS],
      dashboardCharts: [...ALL_CHART_KEYS],
      toggleDashboardMenu: (key) => set((state) => ({
        dashboardMenus: state.dashboardMenus.includes(key)
          ? state.dashboardMenus.filter((k) => k !== key)
          : [...state.dashboardMenus, key],
      })),
      toggleDashboardKpi: (key) => set((state) => ({
        dashboardKpis: state.dashboardKpis.includes(key)
          ? state.dashboardKpis.filter((k) => k !== key)
          : [...state.dashboardKpis, key],
      })),
      toggleDashboardChart: (key) => set((state) => ({
        dashboardCharts: state.dashboardCharts.includes(key)
          ? state.dashboardCharts.filter((k) => k !== key)
          : [...state.dashboardCharts, key],
      })),

      // Per-country quick menu settings
      countryShortcuts: {
        all: [...ALL_SHORTCUTS],
        laos: [...DEFAULT_SHORTCUTS],
        indonesia: ['farm_map', 'warehouse', 'certification', 'cooperative', 'eudr'],
        vietnam: ['farm_map', 'warehouse', 'certification', 'cooperative', 'eudr'],
      },
      countryDashboardMenus: {
        all: [...ALL_MENU_KEYS],
        laos: [...DEFAULT_MENU_KEYS],
        indonesia: [...DEFAULT_MENU_KEYS],
        vietnam: [...DEFAULT_MENU_KEYS],
      },
      toggleCountryShortcut: (country, key) => set((state) => {
        const current = state.countryShortcuts[country] || [...DEFAULT_SHORTCUTS];
        const next = current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key];
        return { countryShortcuts: { ...state.countryShortcuts, [country]: next } };
      }),
      toggleCountryDashboardMenu: (country, key) => set((state) => {
        const current = state.countryDashboardMenus[country] || [...DEFAULT_MENU_KEYS];
        const next = current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key];
        return { countryDashboardMenus: { ...state.countryDashboardMenus, [country]: next } };
      }),

      // Global user: active country scope
      activeCountry: 'all',
      setActiveCountry: (country) => set({ activeCountry: country }),

      // Theme color
      themeColor: 'green',
      setThemeColor: (key) => set({ themeColor: key }),
    }),
    {
      name: 'impact-ui-settings',
      version: 2,
      partialize: (state) => ({
        fontSize: state.fontSize,
        numberFormat: state.numberFormat,
        unitSystem: state.unitSystem,
        shortcuts: state.shortcuts,
        dashboardMenus: state.dashboardMenus,
        dashboardKpis: state.dashboardKpis,
        dashboardCharts: state.dashboardCharts,
        countryShortcuts: state.countryShortcuts,
        countryDashboardMenus: state.countryDashboardMenus,
        activeCountry: state.activeCountry,
        themeColor: state.themeColor,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        // Handle undefined version (pre-versioned data) or version < 2
        if (!version || version < 2) {
          // v2: Global (all) gets ALL shortcuts/menus instead of limited defaults
          const cs = (state.countryShortcuts || {}) as Record<string, string[]>;
          const cdm = (state.countryDashboardMenus || {}) as Record<string, string[]>;
          cs.all = [...ALL_SHORTCUTS];
          cdm.all = [...ALL_MENU_KEYS];
          state.countryShortcuts = cs;
          state.countryDashboardMenus = cdm;
        }
        return state;
      },
    }
  )
);

/** Switch localStorage key to user-specific settings. Call on login / loadUser. */
export function switchUserSettings(userId: string) {
  useUIStore.persist.setOptions({ name: `impact-ui-settings-${userId}` });
  useUIStore.persist.rehydrate();
}

/** Reset to default key on logout. */
export function clearUserSettings() {
  useUIStore.persist.setOptions({ name: 'impact-ui-settings' });
  useUIStore.setState({
    dashboardMenus: [...DEFAULT_MENU_KEYS],
    dashboardKpis: [...ALL_KPI_KEYS],
    dashboardCharts: [...ALL_CHART_KEYS],
    shortcuts: [...DEFAULT_SHORTCUTS],
    countryShortcuts: {
      all: [...ALL_SHORTCUTS],
      laos: [...DEFAULT_SHORTCUTS],
      indonesia: ['farm_map', 'warehouse', 'certification', 'cooperative', 'eudr'],
      vietnam: ['farm_map', 'warehouse', 'certification', 'cooperative', 'eudr'],
    },
    countryDashboardMenus: {
      all: [...ALL_MENU_KEYS],
      laos: [...DEFAULT_MENU_KEYS],
      indonesia: [...DEFAULT_MENU_KEYS],
      vietnam: [...DEFAULT_MENU_KEYS],
    },
  });
}
