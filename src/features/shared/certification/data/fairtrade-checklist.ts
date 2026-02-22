// Fairtrade Internal Audit Checklist
// Based on: Fairtrade SPO Standard (Small-scale Producer Organizations)

import type { ChecklistItem, ChecklistSection } from './ra-checklist';

export const FT_SECTIONS: ChecklistSection[] = [
  {
    key: 'certification',
    labelKey: 'ft_sec_certification',
    icon: 'ShieldCheck',
    color: 'text-amber-700',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100/60',
  },
  {
    key: 'traceability',
    labelKey: 'ft_sec_traceability',
    icon: 'Route',
    color: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100/60',
  },
  {
    key: 'production',
    labelKey: 'ft_sec_production',
    icon: 'Sprout',
    color: 'text-green-700',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50',
    headerBg: 'bg-green-100/60',
  },
  {
    key: 'pest_chemicals',
    labelKey: 'ft_sec_pest_chemicals',
    icon: 'Droplets',
    color: 'text-orange-700',
    borderColor: 'border-l-orange-500',
    bg: 'bg-orange-50',
    headerBg: 'bg-orange-100/60',
  },
  {
    key: 'environment',
    labelKey: 'ft_sec_environment',
    icon: 'TreePine',
    color: 'text-emerald-700',
    borderColor: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    headerBg: 'bg-emerald-100/60',
  },
  {
    key: 'labor_rights',
    labelKey: 'ft_sec_labor_rights',
    icon: 'Users',
    color: 'text-red-700',
    borderColor: 'border-l-red-500',
    bg: 'bg-red-50',
    headerBg: 'bg-red-100/60',
  },
  {
    key: 'development',
    labelKey: 'ft_sec_development',
    icon: 'TrendingUp',
    color: 'text-purple-700',
    borderColor: 'border-l-purple-500',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100/60',
  },
  {
    key: 'democracy',
    labelKey: 'ft_sec_democracy',
    icon: 'Vote',
    color: 'text-indigo-700',
    borderColor: 'border-l-indigo-500',
    bg: 'bg-indigo-50',
    headerBg: 'bg-indigo-100/60',
  },
];

export const FT_CHECKLIST: ChecklistItem[] = [
  // Section 1: General Certification Requirements
  { id: 'ft_accept_audits', labelKey: 'ft_chk_accept_audits', section: 'certification' },
  { id: 'ft_contact_person', labelKey: 'ft_chk_contact_person', section: 'certification' },
  { id: 'ft_previous_nc', labelKey: 'ft_chk_previous_nc', section: 'certification' },
  { id: 'ft_valid_certificate', labelKey: 'ft_chk_valid_certificate', section: 'certification' },
  { id: 'ft_member_awareness', labelKey: 'ft_chk_member_awareness', section: 'certification' },

  // Section 2: Trade & Traceability
  { id: 'ft_product_separation', labelKey: 'ft_chk_product_separation', section: 'traceability' },
  { id: 'ft_product_flow', labelKey: 'ft_chk_product_flow', section: 'traceability' },
  { id: 'ft_purchase_records', labelKey: 'ft_chk_purchase_records', section: 'traceability' },
  { id: 'ft_sales_identification', labelKey: 'ft_chk_sales_identification', section: 'traceability' },
  { id: 'ft_sales_records', labelKey: 'ft_chk_sales_records', section: 'traceability' },

  // Section 3: Production Management
  { id: 'ft_standards_informed', labelKey: 'ft_chk_standards_informed', section: 'production' },
  { id: 'ft_risk_assessment', labelKey: 'ft_chk_risk_assessment', section: 'production' },
  { id: 'ft_environmental_officer', labelKey: 'ft_chk_environmental_officer', section: 'production' },
  { id: 'ft_climate_plan', labelKey: 'ft_chk_climate_plan', section: 'production' },

  // Section 4: Pest & Chemical Management
  { id: 'ft_pesticide_buffer', labelKey: 'ft_chk_pesticide_buffer', section: 'pest_chemicals' },
  { id: 'ft_storage_safe', labelKey: 'ft_chk_storage_safe', section: 'pest_chemicals' },
  { id: 'ft_no_container_reuse', labelKey: 'ft_chk_no_container_reuse', section: 'pest_chemicals' },
  { id: 'ft_pesticide_list', labelKey: 'ft_chk_pesticide_list', section: 'pest_chemicals' },
  { id: 'ft_no_red_list', labelKey: 'ft_chk_no_red_list', section: 'pest_chemicals' },

  // Section 5: Environmental Protection
  { id: 'ft_protected_areas', labelKey: 'ft_chk_protected_areas', section: 'environment' },
  { id: 'ft_legal_land_use', labelKey: 'ft_chk_legal_land_use', section: 'environment' },
  { id: 'ft_no_deforestation', labelKey: 'ft_chk_no_deforestation', section: 'environment' },
  { id: 'ft_deforestation_procedure', labelKey: 'ft_chk_deforestation_procedure', section: 'environment' },
  { id: 'ft_no_gmo', labelKey: 'ft_chk_no_gmo', section: 'environment' },
  { id: 'ft_waste_free', labelKey: 'ft_chk_waste_free', section: 'environment' },

  // Section 6: Labour Rights
  { id: 'ft_no_discrimination', labelKey: 'ft_chk_no_discrimination', section: 'labor_rights' },
  { id: 'ft_no_forced_labor', labelKey: 'ft_chk_no_forced_labor', section: 'labor_rights' },
  { id: 'ft_no_child_labor', labelKey: 'ft_chk_no_child_labor', section: 'labor_rights' },
  { id: 'ft_no_worst_forms', labelKey: 'ft_chk_no_worst_forms', section: 'labor_rights' },
  { id: 'ft_freedom_association', labelKey: 'ft_chk_freedom_association', section: 'labor_rights' },
  { id: 'ft_fair_wages', labelKey: 'ft_chk_fair_wages', section: 'labor_rights' },
  { id: 'ft_safe_conditions', labelKey: 'ft_chk_safe_conditions', section: 'labor_rights' },

  // Section 7: Business & Development
  { id: 'ft_development_plan', labelKey: 'ft_chk_development_plan', section: 'development' },
  { id: 'ft_premium_accounting', labelKey: 'ft_chk_premium_accounting', section: 'development' },
  { id: 'ft_premium_report', labelKey: 'ft_chk_premium_report', section: 'development' },
  { id: 'ft_premium_invest', labelKey: 'ft_chk_premium_invest', section: 'development' },

  // Section 8: Democracy & Governance
  { id: 'ft_general_assembly', labelKey: 'ft_chk_general_assembly', section: 'democracy' },
  { id: 'ft_member_list', labelKey: 'ft_chk_member_list', section: 'democracy' },
  { id: 'ft_minutes_documented', labelKey: 'ft_chk_minutes_documented', section: 'democracy' },
  { id: 'ft_bank_account', labelKey: 'ft_chk_bank_account', section: 'democracy' },
  { id: 'ft_surveillance_committee', labelKey: 'ft_chk_surveillance_committee', section: 'democracy' },
];
