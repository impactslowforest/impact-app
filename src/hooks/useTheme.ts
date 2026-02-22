import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type CommodityTheme = 'coffee' | 'cacao';

interface ThemeConfig {
  theme: CommodityTheme;
  /** Commodity label for display */
  commodity: string;
  /** Header gradient CSS classes */
  headerGradient: string;
  /** Sidebar section icon bg class (hover) */
  sectionIconBg: string;
  sectionIconHoverBg: string;
  /** Active item text color class */
  activeText: string;
  /** Mesh blob color classes for AppLayout background */
  meshPrimary: string;
  meshAccent: string;
  /** Body background for SidebarInset */
  bodyBg: string;
}

const COFFEE_CONFIG: ThemeConfig = {
  theme: 'coffee',
  commodity: 'Coffee',
  headerGradient: 'from-primary-800 via-primary-700 to-primary-800',
  sectionIconBg: 'bg-primary-100/50',
  sectionIconHoverBg: 'group-hover:bg-primary-500',
  activeText: 'text-primary-800',
  meshPrimary: 'bg-primary-500/5',
  meshAccent: 'bg-accent-500/5',
  bodyBg: 'bg-slate-50/50',
};

const CACAO_CONFIG: ThemeConfig = {
  theme: 'cacao',
  commodity: 'Cacao',
  headerGradient: 'from-[#3D1C02] via-[#5D3A1A] to-[#3D1C02]',
  sectionIconBg: 'bg-amber-100/50',
  sectionIconHoverBg: 'group-hover:bg-amber-700',
  activeText: 'text-amber-900',
  meshPrimary: 'bg-amber-500/5',
  meshAccent: 'bg-yellow-500/5',
  bodyBg: 'bg-amber-50/30',
};

/**
 * Determines commodity theme based on user's country.
 * - Indonesia → Cacao (Chocolate, Gold, Red)
 * - Vietnam, Laos, Global → Coffee (White, Green, Brown)
 *
 * Applies `data-theme` attribute to <html> for CSS variable switching.
 */
export function useTheme(): ThemeConfig {
  const { user } = useAuth();

  const config = useMemo(() => {
    if (user?.country === 'indonesia') return CACAO_CONFIG;
    return COFFEE_CONFIG;
  }, [user?.country]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', config.theme);

    return () => {
      root.removeAttribute('data-theme');
    };
  }, [config.theme]);

  return config;
}
