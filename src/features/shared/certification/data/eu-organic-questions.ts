// EU Organic Post-Harvest Processing Q&A (10-Index)
// Based on "10IndexEUorganic" sheet from Main data.xlsx
// 32 questions covering picking, processing, drying, storage, and compliance tracking

export interface ProcessingQuestion {
  id: string;
  questionKey: string; // i18n key for the question text
  section: 'picking_processing' | 'drying_storage' | 'compliance_tracking';
  fieldName: string; // PocketBase field name
}

export const PROCESSING_SECTIONS = [
  {
    key: 'picking_processing' as const,
    labelKey: 'euo_pq_sec_picking',
    icon: 'Hand',
    color: 'text-orange-700',
    borderColor: 'border-l-orange-500',
    bg: 'bg-orange-50',
    headerBg: 'bg-orange-100/60',
  },
  {
    key: 'drying_storage' as const,
    labelKey: 'euo_pq_sec_drying',
    icon: 'Sun',
    color: 'text-amber-700',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100/60',
  },
  {
    key: 'compliance_tracking' as const,
    labelKey: 'euo_pq_sec_compliance',
    icon: 'ClipboardCheck',
    color: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100/60',
  },
];

export const PROCESSING_QUESTIONS: ProcessingQuestion[] = [
  // Section 1: Picking & Processing (Q1-Q10)
  { id: 'q1', questionKey: 'euo_pq_q1', section: 'picking_processing', fieldName: 'q1_picking_separation' },
  { id: 'q2', questionKey: 'euo_pq_q2', section: 'picking_processing', fieldName: 'q2_pre_picking_prep' },
  { id: 'q3', questionKey: 'euo_pq_q3', section: 'picking_processing', fieldName: 'q3_storage_containers' },
  { id: 'q4', questionKey: 'euo_pq_q4', section: 'picking_processing', fieldName: 'q4_container_type_source' },
  { id: 'q5', questionKey: 'euo_pq_q5', section: 'picking_processing', fieldName: 'q5_lay_down_process' },
  { id: 'q6', questionKey: 'euo_pq_q6', section: 'picking_processing', fieldName: 'q6_transport_vehicle' },
  { id: 'q7', questionKey: 'euo_pq_q7', section: 'picking_processing', fieldName: 'q7_milling_timing' },
  { id: 'q8', questionKey: 'euo_pq_q8', section: 'picking_processing', fieldName: 'q8_pre_milling_method' },
  { id: 'q9', questionKey: 'euo_pq_q9', section: 'picking_processing', fieldName: 'q9_post_milling_wash' },
  { id: 'q10', questionKey: 'euo_pq_q10', section: 'picking_processing', fieldName: 'q10_fermentation_process' },

  // Section 2: Drying & Storage (Q11-Q19)
  { id: 'q11', questionKey: 'euo_pq_q11', section: 'drying_storage', fieldName: 'q11_drying_location_tools' },
  { id: 'q12', questionKey: 'euo_pq_q12', section: 'drying_storage', fieldName: 'q12_drying_method_care' },
  { id: 'q13', questionKey: 'euo_pq_q13', section: 'drying_storage', fieldName: 'q13_drying_location_duration' },
  { id: 'q14', questionKey: 'euo_pq_q14', section: 'drying_storage', fieldName: 'q14_animal_insect_access' },
  { id: 'q15', questionKey: 'euo_pq_q15', section: 'drying_storage', fieldName: 'q15_stirring_scooping_tools' },
  { id: 'q16', questionKey: 'euo_pq_q16', section: 'drying_storage', fieldName: 'q16_shared_drying_place' },
  { id: 'q17', questionKey: 'euo_pq_q17', section: 'drying_storage', fieldName: 'q17_collection_location' },
  { id: 'q18', questionKey: 'euo_pq_q18', section: 'drying_storage', fieldName: 'q18_humidity_level' },
  { id: 'q19', questionKey: 'euo_pq_q19', section: 'drying_storage', fieldName: 'q19_contamination_barrier' },

  // Section 3: Compliance Tracking (Q20-Q32)
  { id: 'q20', questionKey: 'euo_pq_q20', section: 'compliance_tracking', fieldName: 'q20_previous_year_tracking' },
  { id: 'q21', questionKey: 'euo_pq_q21', section: 'compliance_tracking', fieldName: 'q21_transferred_land_production' },
  { id: 'q22', questionKey: 'euo_pq_q22', section: 'compliance_tracking', fieldName: 'q22_fence_boundary_repair' },
  { id: 'q23', questionKey: 'euo_pq_q23', section: 'compliance_tracking', fieldName: 'q23_farm_cleaning' },
  { id: 'q24', questionKey: 'euo_pq_q24', section: 'compliance_tracking', fieldName: 'q24_chemical_border_records' },
  { id: 'q25', questionKey: 'euo_pq_q25', section: 'compliance_tracking', fieldName: 'q25_vegetable_control' },
  { id: 'q26', questionKey: 'euo_pq_q26', section: 'compliance_tracking', fieldName: 'q26_chemical_coffee_list' },
  { id: 'q27', questionKey: 'euo_pq_q27', section: 'compliance_tracking', fieldName: 'q27_animal_dung_usage' },
  { id: 'q28', questionKey: 'euo_pq_q28', section: 'compliance_tracking', fieldName: 'q28_produce_separation' },
  { id: 'q29', questionKey: 'euo_pq_q29', section: 'compliance_tracking', fieldName: 'q29_produce_management' },
  { id: 'q30', questionKey: 'euo_pq_q30', section: 'compliance_tracking', fieldName: 'q30_conventional_organic_mgmt' },
  { id: 'q31', questionKey: 'euo_pq_q31', section: 'compliance_tracking', fieldName: 'q31_storage_management' },
  { id: 'q32', questionKey: 'euo_pq_q32', section: 'compliance_tracking', fieldName: 'q32_sales_location_volume' },
];

// EU Organic Farm Inspection sections (for per-farm inspection form)
export const FARM_INSPECTION_SECTIONS = [
  {
    key: 'production_plan',
    labelKey: 'euo_fi_sec_production',
    icon: 'ClipboardList',
    color: 'text-green-700',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50',
    headerBg: 'bg-green-100/60',
  },
  {
    key: 'seed_fertilizer',
    labelKey: 'euo_fi_sec_seed',
    icon: 'Sprout',
    color: 'text-emerald-700',
    borderColor: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    headerBg: 'bg-emerald-100/60',
  },
  {
    key: 'pest_management',
    labelKey: 'euo_fi_sec_pest',
    icon: 'Bug',
    color: 'text-red-700',
    borderColor: 'border-l-red-500',
    bg: 'bg-red-50',
    headerBg: 'bg-red-100/60',
  },
  {
    key: 'contamination',
    labelKey: 'euo_fi_sec_contamination',
    icon: 'ShieldAlert',
    color: 'text-yellow-700',
    borderColor: 'border-l-yellow-500',
    bg: 'bg-yellow-50',
    headerBg: 'bg-yellow-100/60',
  },
  {
    key: 'assessment_summary',
    labelKey: 'euo_fi_sec_assessment',
    icon: 'BarChart3',
    color: 'text-purple-700',
    borderColor: 'border-l-purple-500',
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100/60',
  },
];
