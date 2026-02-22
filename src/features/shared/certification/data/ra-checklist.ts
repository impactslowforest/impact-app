// Rainforest Alliance Internal Audit Checklist
// Based on: RA internal audit.xlsx - 'RA certificate' sheet (30 questions)

export interface ChecklistItem {
  id: string;
  labelKey: string;
  section: string;
}

export interface ChecklistSection {
  key: string;
  labelKey: string;
  icon: string; // lucide icon name reference
  color: string;
  borderColor: string;
  bg: string;
  headerBg: string;
}

export const RA_SECTIONS: ChecklistSection[] = [
  {
    key: 'records',
    labelKey: 'ra_sec_records',
    icon: 'FileText',
    color: 'text-amber-700',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100/60',
  },
  {
    key: 'pest_management',
    labelKey: 'ra_sec_pest',
    icon: 'Bug',
    color: 'text-orange-700',
    borderColor: 'border-l-orange-500',
    bg: 'bg-orange-50',
    headerBg: 'bg-orange-100/60',
  },
  {
    key: 'ppe_safety',
    labelKey: 'ra_sec_ppe',
    icon: 'HardHat',
    color: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100/60',
  },
  {
    key: 'pesticide_mgmt',
    labelKey: 'ra_sec_pesticide',
    icon: 'Droplets',
    color: 'text-purple-700',
    borderColor: 'border-l-purple-500',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100/60',
  },
  {
    key: 'labor_rights',
    labelKey: 'ra_sec_labor',
    icon: 'Users',
    color: 'text-red-700',
    borderColor: 'border-l-red-500',
    bg: 'bg-red-50',
    headerBg: 'bg-red-100/60',
  },
  {
    key: 'environment',
    labelKey: 'ra_sec_environment',
    icon: 'Leaf',
    color: 'text-green-700',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50',
    headerBg: 'bg-green-100/60',
  },
  {
    key: 'waste_compost',
    labelKey: 'ra_sec_waste',
    icon: 'Recycle',
    color: 'text-teal-700',
    borderColor: 'border-l-teal-500',
    bg: 'bg-teal-50',
    headerBg: 'bg-teal-100/60',
  },
  {
    key: 'health_safety',
    labelKey: 'ra_sec_health',
    icon: 'Heart',
    color: 'text-pink-700',
    borderColor: 'border-l-pink-500',
    bg: 'bg-pink-50',
    headerBg: 'bg-pink-100/60',
  },
];

export const RA_CHECKLIST: ChecklistItem[] = [
  // Section 1: Records & Documentation
  { id: 'ra_seed_records', labelKey: 'ra_chk_seed_records', section: 'records' },
  { id: 'ra_sales_notes', labelKey: 'ra_chk_sales_notes', section: 'records' },
  { id: 'ra_garden_sketch', labelKey: 'ra_chk_garden_sketch', section: 'records' },
  { id: 'ra_worker_count', labelKey: 'ra_chk_worker_count', section: 'records' },
  { id: 'ra_worker_activities', labelKey: 'ra_chk_worker_activities', section: 'records' },

  // Section 2: Pest & Disease Management
  { id: 'ra_pest_diseases', labelKey: 'ra_chk_pest_diseases', section: 'pest_management' },
  { id: 'ra_pest_control', labelKey: 'ra_chk_pest_control', section: 'pest_management' },
  { id: 'ra_pest_training', labelKey: 'ra_chk_pest_training', section: 'pest_management' },

  // Section 3: PPE & Safety
  { id: 'ra_ppe_available', labelKey: 'ra_chk_ppe_available', section: 'ppe_safety' },
  { id: 'ra_ppe_condition', labelKey: 'ra_chk_ppe_condition', section: 'ppe_safety' },
  { id: 'ra_ppe_photos', labelKey: 'ra_chk_ppe_photos', section: 'ppe_safety' },
  { id: 'ra_ppe_comments', labelKey: 'ra_chk_ppe_comments', section: 'ppe_safety' },

  // Section 4: Pesticide Management
  { id: 'ra_pesticide_sop', labelKey: 'ra_chk_pesticide_sop', section: 'pesticide_mgmt' },
  { id: 'ra_pesticide_hazardous', labelKey: 'ra_chk_pesticide_hazardous', section: 'pesticide_mgmt' },

  // Section 5: Labor Rights & Fair Treatment
  { id: 'ra_discrimination', labelKey: 'ra_chk_discrimination', section: 'labor_rights' },
  { id: 'ra_daily_wage', labelKey: 'ra_chk_daily_wage', section: 'labor_rights' },
  { id: 'ra_child_labor', labelKey: 'ra_chk_child_labor', section: 'labor_rights' },
  { id: 'ra_emergency_procedures', labelKey: 'ra_chk_emergency_procedures', section: 'labor_rights' },
  { id: 'ra_drinking_water', labelKey: 'ra_chk_drinking_water', section: 'labor_rights' },
  { id: 'ra_ppe_hazardous_env', labelKey: 'ra_chk_ppe_hazardous_env', section: 'labor_rights' },
  { id: 'ra_pregnant_workers', labelKey: 'ra_chk_pregnant_workers', section: 'labor_rights' },

  // Section 6: Environmental Protection
  { id: 'ra_deforestation', labelKey: 'ra_chk_deforestation', section: 'environment' },
  { id: 'ra_riparian_buffer', labelKey: 'ra_chk_riparian_buffer', section: 'environment' },
  { id: 'ra_wildlife', labelKey: 'ra_chk_wildlife', section: 'environment' },
  { id: 'ra_fire', labelKey: 'ra_chk_fire', section: 'environment' },

  // Section 7: Waste & Compost
  { id: 'ra_waste_management', labelKey: 'ra_chk_waste_management', section: 'waste_compost' },
  { id: 'ra_compost', labelKey: 'ra_chk_compost', section: 'waste_compost' },
  { id: 'ra_harvest_residue', labelKey: 'ra_chk_harvest_residue', section: 'waste_compost' },

  // Section 8: Health & Safety
  { id: 'ra_work_accidents', labelKey: 'ra_chk_work_accidents', section: 'health_safety' },
  { id: 'ra_first_aid', labelKey: 'ra_chk_first_aid', section: 'health_safety' },
];
