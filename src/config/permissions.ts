export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
} as const;

export const MODULES = {
  // Global
  GHG: 'ghg',
  EUDR: 'eudr',
  CLIENT_CARBON: 'client_carbon',
  CERTIFICATION: 'certification',
  IMPLEMENTATION: 'implementation',
  SETTINGS: 'settings',

  // Shared
  STAFF: 'staff',
  COOPERATIVE: 'cooperative',
  FARMERS: 'cooperative.farmers',
  FARM_OPERATION: 'cooperative.farm_op',
  DO_NO_HARM: 'cooperative.do_no_harm',
  WAREHOUSE: 'warehouse',
  OFFICES: 'offices',
  FACILITIES: 'facilities',

  // Indonesia specific
  CACAO_PRICE: 'cacao_price',

  // Vietnam specific
  VN_COFFEE_PRICE: 'coffee_price',

  // Shared activity modules
  TRAINING: 'cooperative.training',
  FARM_INPUTS: 'cooperative.farm_inputs',
  HARVEST: 'cooperative.harvest',

  // Laos specific
  COFFEE_PRICE: 'coffee_price',
  SLOW_FARM: 'slow_farm',
  SLOW_FARM_OP: 'slow_farm.operation',
  SLOW_FARM_TREES: 'slow_farm.trees',
  SLOW_FARM_WORKERS: 'slow_farm.workers',
  SLOW_FARM_DAYCARE: 'slow_farm.daycare',
  SLOW_FARM_WETMILL: 'slow_farm.wetmill',
  SLOW_FARM_SHADE_TREES: 'slow_farm.shade_trees',
  SLOW_FARM_YIELD: 'slow_farm.yield',
  SLOW_FARM_PAYROLL: 'slow_farm.payroll',
  GHG_COLLECTION: 'ghg_collection',
  WAREHOUSE_DRYMILL: 'warehouse_drymill',
} as const;

export function buildPermission(country: string, module: string, action: string): string {
  return `${country}.${module}.${action}`;
}
