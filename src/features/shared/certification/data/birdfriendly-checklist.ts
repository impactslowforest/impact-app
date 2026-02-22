// Smithsonian Bird Friendly Internal Audit Checklist
// Based on: Smithsonian Bird Friendly Certification Manual (December 2024)

import type { ChecklistItem, ChecklistSection } from './ra-checklist';

export const BF_SECTIONS: ChecklistSection[] = [
  {
    key: 'organic',
    labelKey: 'bf_sec_organic',
    icon: 'Leaf',
    color: 'text-green-700',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50',
    headerBg: 'bg-green-100/60',
  },
  {
    key: 'deforestation',
    labelKey: 'bf_sec_deforestation',
    icon: 'TreePine',
    color: 'text-red-700',
    borderColor: 'border-l-red-500',
    bg: 'bg-red-50',
    headerBg: 'bg-red-100/60',
  },
  {
    key: 'biodiversity',
    labelKey: 'bf_sec_biodiversity',
    icon: 'Bird',
    color: 'text-emerald-700',
    borderColor: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    headerBg: 'bg-emerald-100/60',
  },
  {
    key: 'agroforestry',
    labelKey: 'bf_sec_agroforestry',
    icon: 'Trees',
    color: 'text-amber-700',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100/60',
  },
  {
    key: 'recommended',
    labelKey: 'bf_sec_recommended',
    icon: 'Star',
    color: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100/60',
  },
  {
    key: 'forest_conservation',
    labelKey: 'bf_sec_forest_conservation',
    icon: 'Mountain',
    color: 'text-teal-700',
    borderColor: 'border-l-teal-500',
    bg: 'bg-teal-50',
    headerBg: 'bg-teal-100/60',
  },
  {
    key: 'post_harvest',
    labelKey: 'bf_sec_post_harvest',
    icon: 'Warehouse',
    color: 'text-purple-700',
    borderColor: 'border-l-purple-500',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100/60',
  },
];

export const BF_CHECKLIST: ChecklistItem[] = [
  // Section 1: Organic Certification
  { id: 'bf_organic_certified', labelKey: 'bf_chk_organic_certified', section: 'organic' },
  { id: 'bf_organic_proof', labelKey: 'bf_chk_organic_proof', section: 'organic' },
  { id: 'bf_no_synthetic', labelKey: 'bf_chk_no_synthetic', section: 'organic' },

  // Section 2: Zero Deforestation
  { id: 'bf_no_deforestation_10yr', labelKey: 'bf_chk_no_deforestation_10yr', section: 'deforestation' },
  { id: 'bf_no_forest_conversion', labelKey: 'bf_chk_no_forest_conversion', section: 'deforestation' },
  { id: 'bf_deforestation_check', labelKey: 'bf_chk_deforestation_check', section: 'deforestation' },

  // Section 3: Biodiversity & Wildlife Conservation
  { id: 'bf_wildlife_protection', labelKey: 'bf_chk_wildlife_protection', section: 'biodiversity' },
  { id: 'bf_no_bird_hunting', labelKey: 'bf_chk_no_bird_hunting', section: 'biodiversity' },
  { id: 'bf_no_parrot_capture', labelKey: 'bf_chk_no_parrot_capture', section: 'biodiversity' },
  { id: 'bf_habitat_conservation', labelKey: 'bf_chk_habitat_conservation', section: 'biodiversity' },

  // Section 4: Agroforestry Criteria (Required)
  { id: 'bf_tree_diversity', labelKey: 'bf_chk_tree_diversity', section: 'agroforestry' },
  { id: 'bf_native_trees', labelKey: 'bf_chk_native_trees', section: 'agroforestry' },
  { id: 'bf_shade_cover_40', labelKey: 'bf_chk_shade_cover_40', section: 'agroforestry' },
  { id: 'bf_tree_height_12m', labelKey: 'bf_chk_tree_height_12m', section: 'agroforestry' },
  { id: 'bf_shade_after_prune', labelKey: 'bf_chk_shade_after_prune', section: 'agroforestry' },

  // Section 5: Recommended Practices
  { id: 'bf_tree_layers', labelKey: 'bf_chk_tree_layers', section: 'recommended' },
  { id: 'bf_soil_cover', labelKey: 'bf_chk_soil_cover', section: 'recommended' },
  { id: 'bf_living_fences', labelKey: 'bf_chk_living_fences', section: 'recommended' },
  { id: 'bf_epiphytes', labelKey: 'bf_chk_epiphytes', section: 'recommended' },
  { id: 'bf_riparian_buffers', labelKey: 'bf_chk_riparian_buffers', section: 'recommended' },
  { id: 'bf_shade_management', labelKey: 'bf_chk_shade_management', section: 'recommended' },

  // Section 6: Forest Conservation Pathway
  { id: 'bf_areas_georeferenced', labelKey: 'bf_chk_areas_georeferenced', section: 'forest_conservation' },
  { id: 'bf_forest_ratio', labelKey: 'bf_chk_forest_ratio', section: 'forest_conservation' },
  { id: 'bf_forest_tenure', labelKey: 'bf_chk_forest_tenure', section: 'forest_conservation' },
  { id: 'bf_governance_plan', labelKey: 'bf_chk_governance_plan', section: 'forest_conservation' },
  { id: 'bf_no_extractive', labelKey: 'bf_chk_no_extractive', section: 'forest_conservation' },
  { id: 'bf_forest_structure', labelKey: 'bf_chk_forest_structure', section: 'forest_conservation' },

  // Section 7: Post-Harvest Traceability
  { id: 'bf_separation', labelKey: 'bf_chk_separation', section: 'post_harvest' },
  { id: 'bf_labeling', labelKey: 'bf_chk_labeling', section: 'post_harvest' },
  { id: 'bf_recordkeeping', labelKey: 'bf_chk_recordkeeping', section: 'post_harvest' },
  { id: 'bf_access', labelKey: 'bf_chk_access', section: 'post_harvest' },
  { id: 'bf_internal_control', labelKey: 'bf_chk_internal_control', section: 'post_harvest' },
];
