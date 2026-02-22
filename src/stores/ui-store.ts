import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_MENU_KEYS, ALL_KPI_KEYS, ALL_CHART_KEYS } from '@/config/dashboard-items';

type NumberFormat = 'dot' | 'comma';
type UnitSystem = 'metric' | 'imperial';

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
      shortcuts: ['farm_map', 'warehouse', 'certification', 'cooperative', 'slow_farm'],
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
    }),
    {
      name: 'impact-ui-settings',
      partialize: (state) => ({
        fontSize: state.fontSize,
        numberFormat: state.numberFormat,
        unitSystem: state.unitSystem,
        shortcuts: state.shortcuts,
        dashboardMenus: state.dashboardMenus,
        dashboardKpis: state.dashboardKpis,
        dashboardCharts: state.dashboardCharts,
      }),
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
    shortcuts: ['farm_map', 'warehouse', 'certification', 'cooperative', 'slow_farm'],
  });
}
