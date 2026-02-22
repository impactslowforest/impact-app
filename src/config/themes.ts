/**
 * Theme color presets for the entire application.
 * Each theme overrides CSS custom properties on :root to change
 * the Tailwind primary-* scale and shadcn primary/ring colors.
 */

export interface ThemePreset {
  key: string;
  label: string;
  preview: string; // primary-600 hex for swatch display
  cssVars: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    key: 'green',
    label: 'Forest Green',
    preview: '#1C873A',
    cssVars: {
      '--color-primary-50': '#f0faf3',
      '--color-primary-100': '#dbf2e1',
      '--color-primary-200': '#b9e5c5',
      '--color-primary-300': '#87d19c',
      '--color-primary-400': '#52b56e',
      '--color-primary-500': '#2f9d51',
      '--color-primary-600': '#1C873A',
      '--color-primary-700': '#186d30',
      '--color-primary-800': '#165728',
      '--color-primary-900': '#134722',
      '--color-primary-950': '#092713',
      '--color-header-from': '#165728',
      '--color-header-via': '#186d30',
      '--color-header-to': '#165728',
      '--primary': '137 66% 32%',
      '--ring': '137 66% 32%',
      '--sidebar-primary': '137 66% 32%',
      '--sidebar-ring': '137 66% 32%',
      '--chart-1': '137 66% 32%',
    },
  },
  {
    key: 'coffee',
    label: 'Coffee Brown',
    preview: '#9a6328',
    cssVars: {
      '--color-primary-50': '#faf6f1',
      '--color-primary-100': '#f0e4d1',
      '--color-primary-200': '#e0c7a1',
      '--color-primary-300': '#cea56b',
      '--color-primary-400': '#c18c45',
      '--color-primary-500': '#b47930',
      '--color-primary-600': '#9a6328',
      '--color-primary-700': '#7d4e23',
      '--color-primary-800': '#674123',
      '--color-primary-900': '#573821',
      '--color-primary-950': '#301c0f',
      '--color-header-from': '#674123',
      '--color-header-via': '#7d4e23',
      '--color-header-to': '#674123',
      '--primary': '31 59% 38%',
      '--ring': '31 59% 38%',
      '--sidebar-primary': '31 59% 38%',
      '--sidebar-ring': '31 59% 38%',
      '--chart-1': '31 59% 38%',
    },
  },
  {
    key: 'blue',
    label: 'Ocean Blue',
    preview: '#2563eb',
    cssVars: {
      '--color-primary-50': '#eff6ff',
      '--color-primary-100': '#dbeafe',
      '--color-primary-200': '#bfdbfe',
      '--color-primary-300': '#93c5fd',
      '--color-primary-400': '#60a5fa',
      '--color-primary-500': '#3b82f6',
      '--color-primary-600': '#2563eb',
      '--color-primary-700': '#1d4ed8',
      '--color-primary-800': '#1e40af',
      '--color-primary-900': '#1e3a8a',
      '--color-primary-950': '#172554',
      '--color-header-from': '#1e40af',
      '--color-header-via': '#1d4ed8',
      '--color-header-to': '#1e40af',
      '--primary': '221 83% 53%',
      '--ring': '221 83% 53%',
      '--sidebar-primary': '221 83% 53%',
      '--sidebar-ring': '221 83% 53%',
      '--chart-1': '221 83% 53%',
    },
  },
  {
    key: 'purple',
    label: 'Royal Purple',
    preview: '#7c3aed',
    cssVars: {
      '--color-primary-50': '#f5f3ff',
      '--color-primary-100': '#ede9fe',
      '--color-primary-200': '#ddd6fe',
      '--color-primary-300': '#c4b5fd',
      '--color-primary-400': '#a78bfa',
      '--color-primary-500': '#8b5cf6',
      '--color-primary-600': '#7c3aed',
      '--color-primary-700': '#6d28d9',
      '--color-primary-800': '#5b21b6',
      '--color-primary-900': '#4c1d95',
      '--color-primary-950': '#2e1065',
      '--color-header-from': '#5b21b6',
      '--color-header-via': '#6d28d9',
      '--color-header-to': '#5b21b6',
      '--primary': '262 83% 58%',
      '--ring': '262 83% 58%',
      '--sidebar-primary': '262 83% 58%',
      '--sidebar-ring': '262 83% 58%',
      '--chart-1': '262 83% 58%',
    },
  },
  {
    key: 'orange',
    label: 'Sunset Orange',
    preview: '#ea580c',
    cssVars: {
      '--color-primary-50': '#fff7ed',
      '--color-primary-100': '#ffedd5',
      '--color-primary-200': '#fed7aa',
      '--color-primary-300': '#fdba74',
      '--color-primary-400': '#fb923c',
      '--color-primary-500': '#f97316',
      '--color-primary-600': '#ea580c',
      '--color-primary-700': '#c2410c',
      '--color-primary-800': '#9a3412',
      '--color-primary-900': '#7c2d12',
      '--color-primary-950': '#431407',
      '--color-header-from': '#9a3412',
      '--color-header-via': '#c2410c',
      '--color-header-to': '#9a3412',
      '--primary': '21 90% 48%',
      '--ring': '21 90% 48%',
      '--sidebar-primary': '21 90% 48%',
      '--sidebar-ring': '21 90% 48%',
      '--chart-1': '21 90% 48%',
    },
  },
  {
    key: 'teal',
    label: 'Slate Teal',
    preview: '#0d9488',
    cssVars: {
      '--color-primary-50': '#f0fdfa',
      '--color-primary-100': '#ccfbf1',
      '--color-primary-200': '#99f6e4',
      '--color-primary-300': '#5eead4',
      '--color-primary-400': '#2dd4bf',
      '--color-primary-500': '#14b8a6',
      '--color-primary-600': '#0d9488',
      '--color-primary-700': '#0f766e',
      '--color-primary-800': '#115e59',
      '--color-primary-900': '#134e4a',
      '--color-primary-950': '#042f2e',
      '--color-header-from': '#115e59',
      '--color-header-via': '#0f766e',
      '--color-header-to': '#115e59',
      '--primary': '175 84% 32%',
      '--ring': '175 84% 32%',
      '--sidebar-primary': '175 84% 32%',
      '--sidebar-ring': '175 84% 32%',
      '--chart-1': '175 84% 32%',
    },
  },
  {
    key: 'red',
    label: 'Crimson Red',
    preview: '#dc2626',
    cssVars: {
      '--color-primary-50': '#fef2f2',
      '--color-primary-100': '#fee2e2',
      '--color-primary-200': '#fecaca',
      '--color-primary-300': '#fca5a5',
      '--color-primary-400': '#f87171',
      '--color-primary-500': '#ef4444',
      '--color-primary-600': '#dc2626',
      '--color-primary-700': '#b91c1c',
      '--color-primary-800': '#991b1b',
      '--color-primary-900': '#7f1d1d',
      '--color-primary-950': '#450a0a',
      '--color-header-from': '#991b1b',
      '--color-header-via': '#b91c1c',
      '--color-header-to': '#991b1b',
      '--primary': '0 72% 51%',
      '--ring': '0 72% 51%',
      '--sidebar-primary': '0 72% 51%',
      '--sidebar-ring': '0 72% 51%',
      '--chart-1': '0 72% 51%',
    },
  },
];

export function getThemeByKey(key: string): ThemePreset {
  return THEME_PRESETS.find((t) => t.key === key) || THEME_PRESETS[0];
}

/** Apply a theme by setting CSS custom properties on :root */
export function applyTheme(themeKey: string): void {
  const theme = getThemeByKey(themeKey);
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(theme.cssVars)) {
    root.style.setProperty(prop, value);
  }
}
