// EU Organic Certification Internal Audit Checklist
// Based on EU Regulation 2018/848 on Organic Production
// Covers: Farm management, conversion, inputs, processing, labeling, record-keeping

import type { ChecklistItem, ChecklistSection } from './ra-checklist';

export const EU_ORGANIC_SECTIONS: ChecklistSection[] = [
  {
    key: 'conversion',
    labelKey: 'euo_sec_conversion',
    icon: 'RefreshCw',
    color: 'text-amber-700',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100/60',
  },
  {
    key: 'soil_crop',
    labelKey: 'euo_sec_soil_crop',
    icon: 'Sprout',
    color: 'text-green-700',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50',
    headerBg: 'bg-green-100/60',
  },
  {
    key: 'inputs',
    labelKey: 'euo_sec_inputs',
    icon: 'Droplets',
    color: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100/60',
  },
  {
    key: 'biodiversity',
    labelKey: 'euo_sec_biodiversity',
    icon: 'TreePine',
    color: 'text-emerald-700',
    borderColor: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    headerBg: 'bg-emerald-100/60',
  },
  {
    key: 'harvest_post',
    labelKey: 'euo_sec_harvest',
    icon: 'Warehouse',
    color: 'text-orange-700',
    borderColor: 'border-l-orange-500',
    bg: 'bg-orange-50',
    headerBg: 'bg-orange-100/60',
  },
  {
    key: 'labor_social',
    labelKey: 'euo_sec_labor',
    icon: 'Users',
    color: 'text-purple-700',
    borderColor: 'border-l-purple-500',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100/60',
  },
  {
    key: 'documentation',
    labelKey: 'euo_sec_documentation',
    icon: 'FileText',
    color: 'text-indigo-700',
    borderColor: 'border-l-indigo-500',
    bg: 'bg-indigo-50',
    headerBg: 'bg-indigo-100/60',
  },
  {
    key: 'labeling',
    labelKey: 'euo_sec_labeling',
    icon: 'Tag',
    color: 'text-pink-700',
    borderColor: 'border-l-pink-500',
    bg: 'bg-pink-50',
    headerBg: 'bg-pink-100/60',
  },
];

export const EU_ORGANIC_CHECKLIST: ChecklistItem[] = [
  // Section 1: Conversion Period
  { id: 'euo_conversion_period', labelKey: 'euo_chk_conversion_period', section: 'conversion' },
  { id: 'euo_conversion_documented', labelKey: 'euo_chk_conversion_documented', section: 'conversion' },
  { id: 'euo_parallel_production', labelKey: 'euo_chk_parallel_production', section: 'conversion' },
  { id: 'euo_previous_land_use', labelKey: 'euo_chk_previous_land_use', section: 'conversion' },

  // Section 2: Soil & Crop Management
  { id: 'euo_soil_fertility', labelKey: 'euo_chk_soil_fertility', section: 'soil_crop' },
  { id: 'euo_crop_rotation', labelKey: 'euo_chk_crop_rotation', section: 'soil_crop' },
  { id: 'euo_organic_seeds', labelKey: 'euo_chk_organic_seeds', section: 'soil_crop' },
  { id: 'euo_no_gmo', labelKey: 'euo_chk_no_gmo', section: 'soil_crop' },
  { id: 'euo_soil_erosion', labelKey: 'euo_chk_soil_erosion', section: 'soil_crop' },
  { id: 'euo_intercropping', labelKey: 'euo_chk_intercropping', section: 'soil_crop' },

  // Section 3: Inputs & Substances
  { id: 'euo_no_synthetic_fertilizer', labelKey: 'euo_chk_no_synthetic_fertilizer', section: 'inputs' },
  { id: 'euo_no_synthetic_pesticide', labelKey: 'euo_chk_no_synthetic_pesticide', section: 'inputs' },
  { id: 'euo_approved_inputs', labelKey: 'euo_chk_approved_inputs', section: 'inputs' },
  { id: 'euo_input_records', labelKey: 'euo_chk_input_records', section: 'inputs' },
  { id: 'euo_composting', labelKey: 'euo_chk_composting', section: 'inputs' },
  { id: 'euo_water_management', labelKey: 'euo_chk_water_management', section: 'inputs' },

  // Section 4: Biodiversity & Ecosystem
  { id: 'euo_biodiversity_plan', labelKey: 'euo_chk_biodiversity_plan', section: 'biodiversity' },
  { id: 'euo_shade_trees', labelKey: 'euo_chk_shade_trees', section: 'biodiversity' },
  { id: 'euo_buffer_zones', labelKey: 'euo_chk_buffer_zones', section: 'biodiversity' },
  { id: 'euo_no_deforestation', labelKey: 'euo_chk_no_deforestation', section: 'biodiversity' },
  { id: 'euo_water_protection', labelKey: 'euo_chk_water_protection', section: 'biodiversity' },
  { id: 'euo_wildlife_habitat', labelKey: 'euo_chk_wildlife_habitat', section: 'biodiversity' },

  // Section 5: Harvest & Post-Harvest
  { id: 'euo_harvest_segregation', labelKey: 'euo_chk_harvest_segregation', section: 'harvest_post' },
  { id: 'euo_storage_clean', labelKey: 'euo_chk_storage_clean', section: 'harvest_post' },
  { id: 'euo_no_contamination', labelKey: 'euo_chk_no_contamination', section: 'harvest_post' },
  { id: 'euo_transport_separation', labelKey: 'euo_chk_transport_separation', section: 'harvest_post' },
  { id: 'euo_processing_organic', labelKey: 'euo_chk_processing_organic', section: 'harvest_post' },

  // Section 6: Labor & Social
  { id: 'euo_fair_wages', labelKey: 'euo_chk_fair_wages', section: 'labor_social' },
  { id: 'euo_no_child_labor', labelKey: 'euo_chk_no_child_labor', section: 'labor_social' },
  { id: 'euo_worker_safety', labelKey: 'euo_chk_worker_safety', section: 'labor_social' },
  { id: 'euo_training_provided', labelKey: 'euo_chk_training_provided', section: 'labor_social' },

  // Section 7: Documentation & Traceability
  { id: 'euo_farm_records', labelKey: 'euo_chk_farm_records', section: 'documentation' },
  { id: 'euo_purchase_records', labelKey: 'euo_chk_purchase_records', section: 'documentation' },
  { id: 'euo_sales_records', labelKey: 'euo_chk_sales_records', section: 'documentation' },
  { id: 'euo_traceability', labelKey: 'euo_chk_traceability', section: 'documentation' },
  { id: 'euo_complaint_system', labelKey: 'euo_chk_complaint_system', section: 'documentation' },

  // Section 8: Labeling & Marketing
  { id: 'euo_label_correct', labelKey: 'euo_chk_label_correct', section: 'labeling' },
  { id: 'euo_logo_usage', labelKey: 'euo_chk_logo_usage', section: 'labeling' },
  { id: 'euo_certificate_valid', labelKey: 'euo_chk_certificate_valid', section: 'labeling' },
  { id: 'euo_operator_registered', labelKey: 'euo_chk_operator_registered', section: 'labeling' },
];
