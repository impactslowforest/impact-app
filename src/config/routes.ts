export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  PENDING_APPROVAL: '/pending-approval',

  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Country & Region Hubs
  REGION_HUB: '/region',
  INDONESIA_HUB: '/indonesia',
  VIETNAM_HUB: '/vietnam',
  LAOS_HUB: '/laos',

  // Standalone Module Shortcuts
  MODULES_HUB: '/modules',
  MAP: '/map',
  MOD_WAREHOUSE: '/modules/warehouse',
  MOD_CERTIFICATE: '/modules/certificate',
  MOD_COOPERATIVE: '/modules/cooperative',
  MOD_SLOW_FARM: '/modules/slow-farm',
  MOD_DAYCARE: '/modules/daycare',

  // Impact Zone (Global)
  IMPACT_GHG: '/impact/ghg',
  IMPACT_EUDR: '/impact/eudr',
  IMPACT_CLIENT_CARBON: '/impact/client-carbon',
  IMPACT_CERTIFICATION: '/impact/certification',
  IMPACT_IMPL: '/impact/implementation',
  IMPACT_ACT: '/impact/implementation/activities',
  IMPACT_ACT_DETAIL: '/impact/implementation/activity-details',
  IMPACT_PLAN: '/impact/implementation/plans',
  IMPACT_PLAN_DETAIL: '/impact/implementation/plan-details',
  IMPACT_ACTIVITY_REF: '/impact/implementation/activity-ref',
  IMPACT_BUDGET: '/impact/implementation/budget',
  IMPACT_GOALS: '/impact/implementation/goals',
  IMPACT_KPIS: '/impact/implementation/kpis',
  IMPACT_SETTINGS: '/system/settings',
  IMPACT_USERS: '/system/users',
  IMPACT_LANGUAGE: '/system/language',
  SYSTEM_ROLES: '/system/roles',

  // Indonesia
  ID_STAFF: '/indonesia/staff',
  ID_COOPERATIVE: '/indonesia/cooperative',
  ID_FARM_OP: '/indonesia/cooperative/farm-op',
  ID_DO_NO_HARM: '/indonesia/cooperative/do-no-harm',
  ID_EUDR: '/indonesia/eudr',
  ID_CACAO_PRICE: '/indonesia/cacao-price',
  ID_FACILITIES: '/indonesia/facilities',
  ID_OFFICES: '/indonesia/offices',
  ID_WAREHOUSE: '/indonesia/warehouse',
  ID_CERTIFICATION: '/indonesia/certification',

  // Vietnam
  VN_STAFF: '/vietnam/staff',
  VN_COOPERATIVE: '/vietnam/cooperative',
  VN_EUDR: '/vietnam/eudr',
  VN_COFFEE_PRICE: '/vietnam/coffee-price',
  VN_FACILITIES: '/vietnam/facilities',
  VN_OFFICES: '/vietnam/offices',
  VN_WAREHOUSE: '/vietnam/warehouse',
  VN_CERTIFICATION: '/vietnam/certification',

  // Laos
  LA_STAFF: '/laos/staff',
  LA_COOPERATIVE: '/laos/cooperative',
  LA_FARM_OP: '/laos/cooperative/farm-op',
  LA_DO_NO_HARM: '/laos/cooperative/do-no-harm',
  LA_SLOW_FARM: '/laos/slow-farm',
  LA_SLOW_FARM_OP: '/laos/slow-farm/operation',
  LA_SLOW_FARM_TREES: '/laos/slow-farm/trees',
  LA_SLOW_FARM_WORKERS: '/laos/slow-farm/workers',
  LA_SLOW_FARM_DNH: '/laos/slow-farm/do-no-harm',
  LA_EUDR: '/laos/eudr',
  LA_COFFEE_PRICE: '/laos/coffee-price',
  LA_OFFICES: '/laos/offices',
  LA_GHG: '/laos/ghg-collection',
  LA_WAREHOUSE: '/laos/warehouse-drymill',
  LA_WH_HARVESTING: '/laos/warehouse-drymill/harvesting',
  LA_WH_FARMER_LOG: '/laos/warehouse-drymill/farmer-log',
  LA_WH_FARM_LOG: '/laos/warehouse-drymill/farm-log',
  LA_WH_LOG_DETAIL: '/laos/warehouse-drymill/log-detail',
  LA_WH_INBOUND: '/laos/warehouse-drymill/inbound',
  LA_WH_INBOUND_DETAIL: '/laos/warehouse-drymill/inbound-detail',
  LA_WH_INBOUND_CHECK: '/laos/warehouse-drymill/inbound-check',
  LA_WH_OUTBOUND: '/laos/warehouse-drymill/outbound',
  LA_WH_SUPPLIERS: '/laos/warehouse-drymill/suppliers',
  LA_WH_LOOKUPS: '/laos/warehouse-drymill/lookups',
  LA_CERTIFICATION: '/laos/certification',

  // Laos Daycare
  LA_DAYCARE: '/laos/daycare',
  LA_DC_FAMILIES: '/laos/daycare/families',
  LA_DC_KIDS: '/laos/daycare/kids',
  LA_DC_STUDIES: '/laos/daycare/studies',
  LA_DC_ATTENDANCE: '/laos/daycare/attendance',
  LA_DC_HEALTH: '/laos/daycare/health-checks',
  LA_DC_FARM_HEALTH: '/laos/daycare/farm-health',
  LA_DC_ATT_CHECKS: '/laos/daycare/attendance-checks',
  LA_DC_MENU: '/laos/daycare/menu',
  LA_DC_MATERIALS: '/laos/daycare/materials',
  LA_DC_KPI: '/laos/daycare/kpi',

  // Indonesia Cocoa Purchase
  ID_COCOA: '/indonesia/cocoa',
  ID_COCOA_GROUPS: '/indonesia/cocoa/groups',
  ID_COCOA_BATCHES: '/indonesia/cocoa/batches',
  ID_COCOA_BATCH_LOGS: '/indonesia/cocoa/batch-logs',
  ID_COCOA_BATCH_DETAILS: '/indonesia/cocoa/batch-details',
  ID_COCOA_PRICES: '/indonesia/cocoa/prices',
  ID_COCOA_RECAPS: '/indonesia/cocoa/recaps',
  ID_COCOA_CONTRACTS: '/indonesia/cocoa/contracts',
  ID_COCOA_KPI: '/indonesia/cocoa/kpi',

  // Indonesia RA Audit
  ID_RA_AUDIT: '/indonesia/ra-audit',
  ID_RA_FARMERS: '/indonesia/ra-audit/farmers',
  ID_RA_FARMS: '/indonesia/ra-audit/farms',
  ID_RA_SPECIES: '/indonesia/ra-audit/species',
  ID_RA_TREES: '/indonesia/ra-audit/trees',
  ID_RA_FAMILY: '/indonesia/ra-audit/family',
  ID_RA_CERTIFICATES: '/indonesia/ra-audit/certificates',
  ID_RA_KPI: '/indonesia/ra-audit/kpi',

  // Farmer & Farm Form Pages
  FARMER_FORM: '/cooperative/farmer-form',
  FARM_FORM: '/cooperative/farm-form',

  // Farmer Profile
  FARMER_PROFILE: '/farmer/:id',

  // EUDR
  EUDR_ASSESSMENT: '/eudr/assessment/:plotId',
  EUDR_LIBRARY: '/eudr/library',
  EUDR_ARTICLE: '/eudr/article/:id',

  // Certification Extensions
  CERT_LIBRARY: '/certification/library',
  CERT_ARTICLE: '/certification/article/:id',
  CERT_QR_PRINT: '/certification/qr-print',
  CERT_QR_SCAN: '/certification/qr-scan',
  CERT_RECORDS: '/certification/records',
} as const;
