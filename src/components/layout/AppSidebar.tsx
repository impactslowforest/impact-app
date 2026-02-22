import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Globe, Building2, TreePine, Users, ShieldCheck,
  BarChart3, FileCheck, Settings, Warehouse, MapPin,
  ClipboardList, Coffee, Bean, Map, Baby,
  Factory, UserCog, Languages, BookOpen,
  ChevronDown, Layers, Heart, DollarSign,
  ClipboardCheck,
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ROUTES } from '@/config/routes';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore } from '@/stores/ui-store';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
  badge?: number;
  permission?: string;
}

interface NavSection {
  key: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
  permission?: string;
  country?: string;
  /** Hub page path — clicking section label navigates here */
  hubPath?: string;
}

export function AppSidebar() {
  const { t } = useTranslation('nav');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, hasRole } = useAuth();
  useTheme(); // apply theme side-effects
  const shortcuts = useUIStore((s) => s.shortcuts);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Fetch pending user count for badge
  const { data: pendingUserCount } = useQuery({
    queryKey: ['pending-user-count'],
    queryFn: async () => {
      if (!hasPermission('manage_users')) return 0;
      const result = await pb.collection('users').getList(1, 1, {
        filter: 'status = "pending"',
      });
      return result.totalItems;
    },
    refetchInterval: 30000,
    enabled: !!user && hasPermission('manage_users'),
  });

  const sections: NavSection[] = [
    // 1. Region (Global)
    {
      key: 'region',
      label: t('region'),
      icon: Globe,
      hubPath: ROUTES.REGION_HUB,
      items: [
        { label: t('ghg_sbti'), icon: BarChart3, path: ROUTES.IMPACT_GHG, permission: 'view_ghg' },
        { label: t('eudr_compliance'), icon: ShieldCheck, path: ROUTES.IMPACT_EUDR, permission: 'view_eudr' },
        { label: t('client_carbon'), icon: BarChart3, path: ROUTES.IMPACT_CLIENT_CARBON, permission: 'view_client_carbon' },
        {
          label: t('certification'),
          icon: FileCheck,
          path: ROUTES.IMPACT_CERTIFICATION,
          children: [
            { label: t('dashboard', 'Dashboard'), icon: BarChart3, path: ROUTES.IMPACT_CERTIFICATION, permission: 'view_certification' },
            { label: t('records', 'Records'), icon: ClipboardList, path: ROUTES.CERT_RECORDS, permission: 'view_certification' },
            { label: t('library', 'Library'), icon: FileCheck, path: ROUTES.CERT_LIBRARY, permission: 'view_certification' },
          ]
        },
        {
          label: t('impact_implementation'), icon: ClipboardList, path: ROUTES.IMPACT_IMPL, children: [
            { label: t('act_impacts', 'Activity Budget'), icon: DollarSign, path: ROUTES.IMPACT_ACT, permission: 'view_budget' },
            { label: t('act_impact_details', 'Activity Details'), icon: ClipboardList, path: ROUTES.IMPACT_ACT_DETAIL, permission: 'view_budget' },
            { label: t('impact_plans', 'Plans'), icon: ClipboardCheck, path: ROUTES.IMPACT_PLAN, permission: 'view_goals' },
            { label: t('impact_plan_details', 'Plan Details'), icon: ClipboardList, path: ROUTES.IMPACT_PLAN_DETAIL, permission: 'view_goals' },
            { label: t('impact_activities', 'Activities'), icon: BookOpen, path: ROUTES.IMPACT_ACTIVITY_REF, permission: 'view_kpis' },
          ]
        },
      ],
    },
    // 2. Indonesia — Cocoa
    {
      key: 'indonesia',
      label: t('slow_indonesia'),
      icon: Bean,
      country: 'indonesia',
      hubPath: ROUTES.INDONESIA_HUB,
      items: [
        { label: t('staff_info'), icon: Users, path: ROUTES.ID_STAFF, permission: 'view_staff' },
        { label: t('farmer_manager', 'Farmer Manager'), icon: Users, path: `${ROUTES.ID_COOPERATIVE}/data`, permission: 'view_cooperative' },
        { label: t('eudr'), icon: ShieldCheck, path: ROUTES.ID_EUDR, permission: 'view_eudr' },
        { label: t('cacao_raw_material_price'), icon: Bean, path: ROUTES.ID_CACAO_PRICE, permission: 'view_prices' },
        { label: t('slow_facilities'), icon: Factory, path: ROUTES.ID_FACILITIES, permission: 'view_facilities' },
        { label: t('slow_offices'), icon: MapPin, path: ROUTES.ID_OFFICES, permission: 'view_offices' },
        { label: t('warehouse'), icon: Warehouse, path: ROUTES.ID_WAREHOUSE, permission: 'view_warehouse' },
        { label: t('certification'), icon: FileCheck, path: ROUTES.ID_CERTIFICATION, permission: 'view_certification' },
        {
          label: t('cocoa_purchase', 'Cocoa purchase'),
          icon: DollarSign,
          path: ROUTES.ID_COCOA,
          children: [
            { label: t('farmer_groups', 'Farmer groups'), icon: Building2, path: ROUTES.ID_COCOA_GROUPS },
            { label: t('batches', 'Batches'), icon: ClipboardList, path: ROUTES.ID_COCOA_BATCHES },
            { label: t('batch_logs', 'Batch logs'), icon: ClipboardList, path: ROUTES.ID_COCOA_BATCH_LOGS },
            { label: t('batch_details', 'Batch details'), icon: ClipboardList, path: ROUTES.ID_COCOA_BATCH_DETAILS },
            { label: t('prices', 'Prices'), icon: DollarSign, path: ROUTES.ID_COCOA_PRICES },
            { label: t('recaps', 'Recaps'), icon: BarChart3, path: ROUTES.ID_COCOA_RECAPS },
            { label: t('contracts', 'Contracts'), icon: FileCheck, path: ROUTES.ID_COCOA_CONTRACTS },
          ],
        },
        {
          label: t('ra_audit', 'RA internal audit'),
          icon: ClipboardCheck,
          path: ROUTES.ID_RA_AUDIT,
          children: [
            { label: t('farmer_inspections', 'Farmer inspections'), icon: Users, path: ROUTES.ID_RA_FARMERS },
            { label: t('farm_inspections', 'Farm inspections'), icon: TreePine, path: ROUTES.ID_RA_FARMS },
            { label: t('species_index', 'Species index'), icon: TreePine, path: ROUTES.ID_RA_SPECIES },
            { label: t('family_data', 'Family data'), icon: Users, path: ROUTES.ID_RA_FAMILY },
          ],
        },
      ],
    },
    // 3. Laos — Coffee
    {
      key: 'laos',
      label: t('slow_laos'),
      icon: Coffee,
      country: 'laos',
      hubPath: ROUTES.LAOS_HUB,
      items: [
        { label: t('staff_info'), icon: Users, path: ROUTES.LA_STAFF, permission: 'view_staff' },
        { label: t('cooperative_management'), icon: Building2, path: `${ROUTES.LA_COOPERATIVE}/data`, permission: 'view_cooperative' },
        { label: t('slow_farm'), icon: TreePine, path: ROUTES.LA_SLOW_FARM, permission: 'view_farm_op' },
        { label: t('eudr'), icon: ShieldCheck, path: ROUTES.LA_EUDR, permission: 'view_eudr' },
        { label: t('coffee_raw_material_price'), icon: Coffee, path: ROUTES.LA_COFFEE_PRICE, permission: 'view_prices' },
        { label: t('slow_offices'), icon: MapPin, path: ROUTES.LA_OFFICES, permission: 'view_offices' },
        { label: t('ghg_data_collection'), icon: BarChart3, path: ROUTES.LA_GHG, permission: 'view_ghg' },
        { label: t('warehouse_drymill'), icon: Warehouse, path: ROUTES.LA_WAREHOUSE, permission: 'view_warehouse' },
        { label: t('certification'), icon: FileCheck, path: ROUTES.LA_CERTIFICATION, permission: 'view_certification' },
        {
          label: t('daycare_center', 'Daycare center'),
          icon: Baby,
          path: ROUTES.LA_DAYCARE,
          children: [
            { label: t('families', 'Families'), icon: Users, path: ROUTES.LA_DC_FAMILIES },
            { label: t('kids', 'Kids'), icon: Baby, path: ROUTES.LA_DC_KIDS },
            { label: t('studies', 'Studies'), icon: ClipboardList, path: ROUTES.LA_DC_STUDIES },
            { label: t('attendance', 'Attendance'), icon: ClipboardCheck, path: ROUTES.LA_DC_ATTENDANCE },
            { label: t('health_checks', 'Health checks'), icon: Heart, path: ROUTES.LA_DC_HEALTH },
            { label: t('farm_health', 'Farm health'), icon: Heart, path: ROUTES.LA_DC_FARM_HEALTH },
            { label: t('menu_materials', 'Menu & materials'), icon: ClipboardList, path: ROUTES.LA_DC_MENU },
          ],
        },
      ],
    },
    // 4. Vietnam — Coffee
    {
      key: 'vietnam',
      label: t('slow_vietnam'),
      icon: Coffee,
      country: 'vietnam',
      hubPath: ROUTES.VIETNAM_HUB,
      items: [
        { label: t('staff_info'), icon: Users, path: ROUTES.VN_STAFF, permission: 'view_staff' },
        { label: t('cooperative_management'), icon: Building2, path: `${ROUTES.VN_COOPERATIVE}/data`, permission: 'view_cooperative' },
        { label: t('eudr'), icon: ShieldCheck, path: ROUTES.VN_EUDR, permission: 'view_eudr' },
        { label: t('coffee_raw_material_price'), icon: Coffee, path: ROUTES.VN_COFFEE_PRICE, permission: 'view_prices' },
        { label: t('slow_facilities'), icon: Factory, path: ROUTES.VN_FACILITIES, permission: 'view_facilities' },
        { label: t('slow_offices'), icon: MapPin, path: ROUTES.VN_OFFICES, permission: 'view_offices' },
        { label: t('warehouse'), icon: Warehouse, path: ROUTES.VN_WAREHOUSE, permission: 'view_warehouse' },
        { label: t('certification'), icon: FileCheck, path: ROUTES.VN_CERTIFICATION, permission: 'view_certification' },
      ],
    },
    // 5. Daycare Center (Laos only — standalone section for teachers)
    {
      key: 'daycare',
      label: t('daycare_center', 'Daycare center'),
      icon: Baby,
      country: 'laos',
      hubPath: ROUTES.LA_DAYCARE,
      items: [
        { label: t('families', 'Families'), icon: Users, path: ROUTES.LA_DC_FAMILIES },
        { label: t('kids', 'Kids'), icon: Baby, path: ROUTES.LA_DC_KIDS },
        { label: t('studies', 'Studies'), icon: ClipboardList, path: ROUTES.LA_DC_STUDIES },
        { label: t('attendance', 'Attendance'), icon: ClipboardCheck, path: ROUTES.LA_DC_ATTENDANCE },
        { label: t('health_checks', 'Health checks'), icon: Heart, path: ROUTES.LA_DC_HEALTH },
        { label: t('farm_health', 'Farm health'), icon: Heart, path: ROUTES.LA_DC_FARM_HEALTH },
        { label: t('attendance_checks', 'Attendance checks'), icon: ClipboardCheck, path: ROUTES.LA_DC_ATT_CHECKS },
        { label: t('menu_materials', 'Menu & materials'), icon: ClipboardList, path: ROUTES.LA_DC_MENU },
        { label: t('materials', 'Materials'), icon: ClipboardList, path: ROUTES.LA_DC_MATERIALS },
        { label: t('kpi_dashboard', 'KPI Dashboard'), icon: BarChart3, path: ROUTES.LA_DC_KPI },
      ],
    },
    // 6. Modules (dynamic shortcuts — user-configurable in Settings)
    {
      key: 'modules',
      label: t('modules', 'Modules'),
      icon: Layers,
      hubPath: ROUTES.MODULES_HUB,
      items: ([
        { key: 'farm_map', label: t('farm_map', 'Farm map'), icon: Map, path: ROUTES.MAP },
        { key: 'warehouse', label: t('warehouse', 'Warehouse'), icon: Warehouse, path: ROUTES.MOD_WAREHOUSE },
        { key: 'certification', label: t('certification', 'Certification'), icon: FileCheck, path: ROUTES.MOD_CERTIFICATE },
        { key: 'cooperative', label: t('cooperative', 'Cooperative'), icon: Building2, path: ROUTES.MOD_COOPERATIVE },
        { key: 'slow_farm', label: t('slow_farm', 'Slow farm'), icon: TreePine, path: ROUTES.MOD_SLOW_FARM },
        { key: 'daycare', label: t('daycare_center', 'Daycare center'), icon: Baby, path: ROUTES.MOD_DAYCARE },
        { key: 'eudr', label: t('eudr_compliance', 'EUDR Compliance'), icon: ShieldCheck, path: ROUTES.IMPACT_EUDR },
        { key: 'ghg', label: t('ghg_sbti', 'GHG / SBTi'), icon: BarChart3, path: ROUTES.IMPACT_GHG },
        { key: 'documents', label: t('documents', 'Documents'), icon: BookOpen, path: ROUTES.CERT_LIBRARY },
        { key: 'coffee_price', label: t('coffee_raw_material_price', 'Coffee price'), icon: Coffee, path: ROUTES.LA_COFFEE_PRICE },
        { key: 'cocoa_price', label: t('cacao_raw_material_price', 'Cocoa price'), icon: Bean, path: ROUTES.ID_CACAO_PRICE },
      ] as (NavItem & { key: string })[]).filter((item) => {
        const uc = user?.country;
        // Indonesia: no daycare, slow_farm, coffee_price (uses cocoa)
        if (uc === 'indonesia' && ['daycare', 'slow_farm', 'coffee_price'].includes(item.key)) return false;
        // Vietnam: no daycare, slow_farm, cocoa_price
        if (uc === 'vietnam' && ['daycare', 'slow_farm', 'cocoa_price'].includes(item.key)) return false;
        // Laos: no cocoa_price
        if (uc === 'laos' && item.key === 'cocoa_price') return false;
        // Global: show all
        return shortcuts.includes(item.key);
      }),
    },
  ];

  const isActive = (path?: string) => path ? location.pathname.startsWith(path) : false;

  // Determine which section "owns" a given path
  const findSectionForPath = useCallback((path: string): NavSection | undefined => {
    return sections.find(section => {
      if (section.hubPath && path.startsWith(section.hubPath)) return true;
      return section.items.some(item => {
        if (item.path && path.startsWith(item.path)) return true;
        if (item.children) return item.children.some(c => c.path && path.startsWith(c.path));
        return false;
      });
    });
  }, [sections]);

  // Check if current path is inside a section
  const isSectionActive = useCallback((section: NavSection): boolean => {
    if (section.hubPath && location.pathname.startsWith(section.hubPath)) return true;
    return section.items.some(item => {
      if (item.path && location.pathname.startsWith(item.path)) return true;
      if (item.children) return item.children.some(c => c.path && location.pathname.startsWith(c.path));
      return false;
    });
  }, [location.pathname]);

  // Auto-expand section when navigating to a page within it
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;

    const activeSection = findSectionForPath(location.pathname);
    if (activeSection) {
      setOpenSections(prev => {
        if (prev.has(activeSection.key)) return prev;
        const next = new Set(prev);
        next.add(activeSection.key);
        return next;
      });
      // Also auto-open matching sub-menus
      activeSection.items.forEach(item => {
        if (item.children) {
          const childActive = item.children.some(c => c.path && location.pathname.startsWith(c.path));
          if (childActive) {
            setOpenSubmenus(prev => {
              if (prev.has(item.label)) return prev;
              const next = new Set(prev);
              next.add(item.label);
              return next;
            });
          }
        }
      });
    }
  }, [location.pathname, findSectionForPath]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Open a section exclusively (collapse others) + expand all sub-menus + navigate to hub
  const openSectionFull = (section: NavSection) => {
    // Collapse all other sections, open this one
    setOpenSections(new Set([section.key]));
    // Open all child sub-menus
    const childrenWithSubs = section.items.filter(i => i.children);
    if (childrenWithSubs.length > 0) {
      setOpenSubmenus(prev => {
        const next = new Set(prev);
        childrenWithSubs.forEach(i => next.add(i.label));
        return next;
      });
    }
    // Navigate to hub
    if (section.hubPath) {
      navigate(section.hubPath);
    }
  };

  // Theme-aware icon colors
  const iconActive = 'text-primary-700';
  const iconDefault = 'text-primary-600';

  const renderNavItem = (item: NavItem, depth = 0) => {
    if (item.permission && !hasPermission(item.permission)) return null;

    const active = isActive(item.path);
    const hasChildren = !!item.children;
    const isSubmenuOpen = openSubmenus.has(item.label);
    const Icon = item.icon;

    const pl = depth === 0 ? 'pl-4' : depth === 1 ? 'pl-9' : 'pl-14';
    const fontWeight = depth === 0 ? 'font-semibold' : depth === 1 ? 'font-medium' : 'font-normal';
    const textColor = active ? 'text-primary-800' : depth === 0 ? 'text-gray-900' : 'text-gray-600';
    const textSize = depth === 0 ? 'text-[14px]' : 'text-[13px]';
    const bgClass = active ? 'bg-primary-50/50' : 'hover:bg-primary-50/30';

    if (hasChildren) {
      const visibleChildren = item.children!.filter(c => !c.permission || hasPermission(c.permission));
      if (visibleChildren.length === 0) return null;

      const handleParentClick = () => {
        // Toggle submenu open/close
        toggleSubmenu(item.label);
        // If parent has its own path, also navigate to show content on right
        if (item.path) {
          navigate(item.path);
        }
      };

      return (
        <div key={item.label} className="mb-0.5">
          <button
            type="button"
            onClick={handleParentClick}
            className={`flex w-full items-center gap-2.5 ${pl} pr-3 py-2 ${textSize} ${fontWeight} ${textColor} ${bgClass} transition-all rounded-lg`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? iconActive : iconDefault}`} />
            <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSubmenuOpen && (
            <div className="bg-gray-50/40 mt-0.5 pb-1">
              {visibleChildren.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        onClick={() => item.path && navigate(item.path)}
        className={`flex w-full items-center gap-2.5 ${pl} pr-3 py-2 ${textSize} ${fontWeight} transition-all rounded-lg ${active
          ? 'bg-primary-50 text-primary-800 font-bold border-l-3 border-l-primary-500 shadow-sm'
          : `${textColor} hover:bg-gray-50/80 hover:text-gray-900`
          }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${active ? iconActive : 'text-gray-400'}`} />
        <span className="truncate">{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const isTeacher = hasRole('teacher');

  // Filter sections based on country, permissions, and role
  const visibleSections = sections.filter(section => {
    // Teachers only see daycare + a staff list section
    if (isTeacher) {
      if (section.key === 'daycare') return true;
      // Show user's country section (for staff list access)
      if (section.country && section.country === user?.country) return true;
      return false;
    }

    if (section.country && user?.country !== 'global' && user?.country !== section.country) {
      return false;
    }
    if (section.permission && !hasPermission(section.permission)) {
      return false;
    }
    const visibleItems = section.items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.children) {
        const visibleChildren = item.children.filter(child => !child.permission || hasPermission(child.permission));
        return visibleChildren.length > 0;
      }
      return true;
    });
    const isPermissionsLoading = !!user && !user.expand?.role;
    return isPermissionsLoading ? true : visibleItems.length > 0;
  }).map(section => {
    // For teachers, only show staff item in country sections
    if (isTeacher && section.country) {
      return {
        ...section,
        items: section.items.filter(item => {
          const path = item.path || '';
          return path.includes('/staff');
        }),
      };
    }
    return section;
  });

  const isCountryAccount = !!user?.country && user.country !== 'global';

  return (
    <Sidebar variant="sidebar" collapsible={isCountryAccount ? 'none' : 'icon'} className="border-r-0 bg-transparent">
      {/* Logo — click to go Home */}
      <SidebarHeader className="border-b border-gray-200/50 bg-white/70 backdrop-blur-md p-0">
        <button
          type="button"
          onClick={() => {
            navigate(ROUTES.DASHBOARD);
            setOpenSections(new Set());
            setOpenSubmenus(new Set());
          }}
          className="flex flex-col items-center w-full px-4 py-3.5 hover:bg-primary-50/40 transition-colors group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2"
          title="Home"
        >
          <img
            src="/logo.png"
            alt="Slow Forest"
            className="h-12 w-12 rounded-xl shadow-md ring-1 ring-gray-200/50 object-contain group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all duration-300"
          />
          {user?.country === 'global' && (
            <span className="mt-1.5 text-[11px] font-bold text-primary-700 tracking-wide group-data-[collapsible=icon]:hidden">
              Slow Forest Impact
            </span>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="glass-panel overflow-y-auto border-none">
        {visibleSections.map((section) => {
          const isOpen = openSections.has(section.key);
          const SectionIcon = section.icon;
          const active = isSectionActive(section);

          return (
            <div key={section.key} className={`border-b border-gray-200/40 last:border-0 ${active && !isOpen ? 'bg-primary-50/30' : ''}`}>
              {/* Section Header */}
              <div className={`flex w-full items-center transition-colors group ${active ? 'hover:bg-primary-100/40' : 'hover:bg-primary-50/40'}`}>
                <button
                  type="button"
                  onClick={() => openSectionFull(section)}
                  className={`flex flex-1 items-center gap-2.5 pl-3.5 py-3 ${active ? 'bg-primary-50/50' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-700 text-white'
                  }`}>
                    <SectionIcon className="h-4.5 w-4.5" />
                  </div>
                  <span className={`flex-1 text-left text-[14px] font-bold tracking-tight ${active ? 'text-primary-800' : 'text-gray-800'}`}>
                    {section.label}
                  </span>
                  {active && !isOpen && (
                    <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mr-1" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(section.key);
                  }}
                  className="px-3 py-3 hover:bg-primary-100/50 rounded-r-md transition-colors"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Section Items — animated expand */}
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-2 px-2 pt-0.5">
                  <div className="space-y-0.5">
                    {section.items.map(item => renderNavItem(item, 0))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </SidebarContent>

      {/* Footer: User info + System */}
      {user && (
        <SidebarFooter className="border-t border-gray-200/60 bg-white/70 backdrop-blur-md p-2.5 space-y-2">
          {/* System shortcuts — vertical stack */}
          <div className="space-y-0.5 group-data-[collapsible=icon]:space-y-1">
            <button type="button" onClick={() => navigate(ROUTES.IMPACT_SETTINGS)}
              className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[13px] text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
              title={t('settings')}>
              <Settings className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="group-data-[collapsible=icon]:hidden">{t('settings')}</span>
            </button>
            {hasPermission('manage_users') && (
              <button type="button" onClick={() => navigate(ROUTES.IMPACT_USERS)}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[13px] text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                title={t('user_management')}>
                <UserCog className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="group-data-[collapsible=icon]:hidden flex-1 text-left">{t('user_management')}</span>
                {!!pendingUserCount && pendingUserCount > 0 && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                    {pendingUserCount}
                  </span>
                )}
              </button>
            )}
            {hasPermission('manage_system') && (
              <button type="button" onClick={() => navigate(ROUTES.IMPACT_LANGUAGE)}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[13px] text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                title={t('language')}>
                <Languages className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="group-data-[collapsible=icon]:hidden">{t('language')}</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/50 group-data-[collapsible=icon]:hidden" />

          {/* User info */}
          <button
            type="button"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar className="h-9 w-9 border-2 border-primary-200 shadow-sm shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-[11px] font-bold">
                {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
              <div className="text-[13px] font-semibold text-gray-800 truncate">{user.name}</div>
              <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
            </div>
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
