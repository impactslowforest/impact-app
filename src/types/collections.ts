import type { RecordModel } from 'pocketbase';

type Country = 'indonesia' | 'vietnam' | 'laos';

// === CORE COLLECTIONS (all 3 countries) ===

export interface Cooperative extends RecordModel {
  coop_code: string;
  name: string;
  country: Country;
  province: string;
  district: string;
  village: string;
  address: string;
  latitude: number;
  longitude: number;
  leader_name: string;
  leader_phone: string;
  member_count: number;
  commodity: 'coffee' | 'cacao' | 'other';
  certification_status: 'none' | 'organic' | 'fair_trade' | 'rainforest' | 'multiple';
  notes: string;
  documents: string[];
  is_active: boolean;
  created_by: string;
}

export interface Farmer extends RecordModel {
  // --- Core identity (migration 007) ---
  farmer_code: string;
  cooperative?: string;
  country: Country;
  full_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  id_card_number: string;
  phone: string;
  village: string;
  district: string;
  province: string;
  address: string;
  household_size: number;
  education_level: 'none' | 'primary' | 'secondary' | 'high_school' | 'vocational' | 'university';
  farm_size_ha: number;
  latitude: number;
  longitude: number;
  polygon_geojson: string;
  certification_status: 'none' | 'organic' | 'transitional' | 'fair_trade' | 'multiple';
  registration_date: string;
  profile_photo: string;
  documents: string[];
  qr_code: string;
  is_active: boolean;
  registered_by: string;
  // --- Demographics & household (migration 011) ---
  ethnicity: string;
  commune: string;
  socioeconomic_status: 'poor' | 'near_poor' | 'average' | 'above_average';
  household_type: 'nuclear' | 'extended' | 'single';
  female_members: number;
  income_earners: number;
  members_under_16: number;
  residence_status: 'permanent' | 'temporary' | 'migrant';
  // --- Coffee area & land (migration 011) ---
  total_coffee_area_ha: number;
  number_of_plots: number;
  land_certificate_status: 'none' | 'applied' | 'received' | 'red_book';
  organic_area_ha: number;
  organic_conversion_date: string;
  // --- Ecosystem & biodiversity (migration 011) ---
  shade_tree_density_per_ha: number;
  shade_tree_species: string;
  vegetation_cover_pct: number;
  soil_conservation: string;
  water_conservation: string;
  waste_management: string;
  converted_after_dec2020: boolean;
  natural_forest_area_ha: number;
  forbidden_chemical_used: boolean;
  poultry_count: number;
  pig_count: number;
  cattle_count: number;
  // --- Inputs & finance (migration 012) ---
  input_debt: number;
  interest_rate_per_month: number;
  distance_to_home_km: number;
  buffalo_count: number;
  deforestation_conversion_date: string;
  land_legal_origin_docs: string;
  shared_sprayer_used: boolean;
  seed_source: string;
  seed_quantity_kg: number;
  organic_fertilizer_kg: number;
  chemical_fertilizer_kg: number;
  microbial_fertilizer_kg: number;
  biological_pesticide_kg: number;
  chemical_pesticide_kg: number;
  // --- Merged from farmer_profiles (migration 022) ---
  income_sources: string;
  avg_cherry_price: number;
  total_cash_income: number;
  production_cost: number;
  other_income: number;
  fertilizer_data: Record<string, unknown>;
  pesticide_data: Record<string, unknown>;
  biodiversity_data: Record<string, unknown>;
  energy_data: Record<string, unknown>;
  child_labor_data: Record<string, unknown>;
  financial_data: Record<string, unknown>;
  // --- VN datapoints (migration 022) ---
  farmer_group_name: string;
  household_circumstances: string;
  supported_by: string;
  existing_certifications_detail: string;
  // --- LA production (migration 022) ---
  mature_coffee_area_ha: number;
  immature_coffee_area_ha: number;
  // --- Indo (migration 022) ---
  observation_stations: string;
  family_data: Record<string, unknown>;
  // --- VN Commercial (migration 022) ---
  cherry_sales_committed_kg: number;
  cherry_sales_actual_kg: number;
  revenue_from_slow: number;
  processor_channel: string;
  // --- VN Project Support (migration 022) ---
  farm_registered_for_support: boolean;
  training_attendance: string;
  op6_activities: string;
  // --- LA/Indo misc (migration 022) ---
  type_of_area: string;
  eudr_compliance_data: Record<string, unknown>;
  herbicide_data: Record<string, unknown>;
}

export interface Farm extends RecordModel {
  // --- Core (migration 007) ---
  farm_code: string;
  farmer: string;
  country: Country;
  farm_name: string;
  area_ha: number;
  latitude: number;
  longitude: number;
  elevation_m: number;
  polygon_geojson: string;
  commodity: 'coffee' | 'cacao' | 'other';
  production_system: 'monoculture' | 'intercropping' | 'agroforestry' | 'mixed';
  certification_status: 'none' | 'organic' | 'transitional' | 'conventional';
  coffee_trees_count: number;
  shade_trees_count: number;
  soil_type: string;
  village: string;
  district: string;
  province: string;
  photos: string[];
  notes: string;
  is_active: boolean;
  qr_code: string;
  // --- Land & production (migration 011) ---
  land_tenure_status: 'owned' | 'leased' | 'communal' | 'disputed';
  management_type: 'household' | 'group' | 'company';
  distance_to_drymill_km: number;
  distance_to_office_km: number;
  organic_conversion_date: string;
  organic_area_ha: number;
  mature_area_ha: number;
  immature_area_ha: number;
  intercropped_species: string;
  tree_health_status: 'excellent' | 'good' | 'fair' | 'poor';
  forecast_yield_arabica_kg: number;
  forecast_yield_robusta_kg: number;
  has_disease: boolean;
  disease_type: string;
  pest_management_method: 'none' | 'manual' | 'biological' | 'herbal' | 'chemical';
  border_natural_forest: boolean;
  buffer_zone_details: string;
  contamination_risk_level: 'none' | 'low' | 'moderate' | 'high';
  // --- Inputs & environment (migration 012) ---
  main_crop_species: string;
  entry_date: string;
  replanting_date: string;
  seedling_quality_note: string;
  fertilizer_mix: string;
  fertilizer_source: string;
  fertilizer_apply_date: string;
  herbal_agent_used: string;
  banned_chem_name: string;
  shared_sprayer_use: boolean;
  sprayer_cleaning_log: string;
  high_risk_detail: string;
  past_issue_desc: string;
  // --- Merged from farmer_profile_details (migration 022) ---
  registered_agroforestry: string;
  slope: string;
  planting_year: number;
  volume_to_slow_kg: number;
  shade_trees_past: number;
  pffp_shade_trees: number;
  surviving_pffp_trees: number;
  // --- Indo farm (migration 022) ---
  land_certificate: string;
  land_ownership_certificate: string;
  number_of_species: number;
  plant_density_spacing: string;
  shade_level_pct: number;
  // --- Indo species/tree data (migration 022, JSON) ---
  species_data: Record<string, unknown>;
  tree_index_data: Record<string, unknown>;
  // --- Indo fertilizer/pesticide data (migration 022, JSON) ---
  agroforestry_fertilizer_data: Record<string, unknown>;
  chemical_fertilizer_data: Record<string, unknown>;
  compost_data: Record<string, unknown>;
  pesticide_detail_data: Record<string, unknown>;
  // --- Indo RA compliance (migration 022, JSON) ---
  ra_compliance_data: Record<string, unknown>;
  // --- VN plot-level (migration 022) ---
  map_sheet: string;
  shade_trees_before: number;
  annual_cherry_yield_kg: number;
  // --- Farm_LAO environment (migration 022) ---
  treatment_method: string;
  forbidden_chem_use: boolean;
  water_pollution_risk: string;
  air_pollution_risk: string;
  farm_tools_inventory: string;
  non_conformity_history: string;
  correction_status: string;
  corrective_action: string;
  protection_method: string;
  dist_to_chemical_farm_km: number;
  // --- EUDR (migration 022) ---
  eudr_status: string;
}

export interface TrainingCourse extends RecordModel {
  course_code: string;
  cooperative: string;
  country: Country;
  title: string;
  description: string;
  category: 'farming_practice' | 'organic_certification' | 'pest_management' | 'post_harvest' | 'safety' | 'eudr' | 'business_skills' | 'other';
  start_date: string;
  end_date: string;
  duration_hours: number;
  location: string;
  trainer_name: string;
  trainer_organization: string;
  conducted_by: string;
  participants: string[];
  participant_count: number;
  male_participants: number;
  female_participants: number;
  topics: string[];
  materials: string[];
  attendance_photo: string[];
  notes: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

export interface FarmInput extends RecordModel {
  farm: string;
  farmer: string;
  country: Country;
  input_type: 'fertilizer' | 'pesticide' | 'herbicide' | 'fungicide' | 'soil_amendment' | 'other';
  product_name: string;
  brand: string;
  is_organic: boolean;
  application_method: 'spray' | 'granular' | 'foliar' | 'soil_drench' | 'manual' | 'other';
  quantity_kg: number;
  quantity_liters: number;
  area_applied_ha: number;
  application_date: string;
  target_pest_or_deficiency: string;
  source_supplier: string;
  cost_local_currency: number;
  notes: string;
  photos: string[];
  recorded_by: string;
}

export interface HarvestRecord extends RecordModel {
  farm: string;
  farmer: string;
  country: Country;
  crop_type: 'coffee_cherry' | 'coffee_parchment' | 'cacao_wet' | 'cacao_dry' | 'other';
  variety: string;
  season: string;
  harvest_date: string;
  quantity_kg: number;
  moisture_pct: number;
  quality_grade: 'A' | 'B' | 'C' | 'reject';
  processing_method: 'wet' | 'dry' | 'honey' | 'natural' | 'washed' | 'semi_washed' | 'other';
  price_per_kg: number;
  currency: string;
  buyer: string;
  lot_number: string;
  photos: string[];
  notes: string;
  recorded_by: string;
}

// === SLOW FARM COLLECTIONS (Laos only) ===

export interface SlowFarm extends RecordModel {
  farm_code: string;
  name: string;
  location: string;
  province: string;
  district: string;
  total_area_ha: number;
  coffee_area_ha: number;
  latitude: number;
  longitude: number;
  polygon_geojson: string;
  elevation_m: number;
  coffee_trees_count: number;
  shade_trees_count: number;
  manager_name: string;
  manager_phone: string;
  manager_user: string;
  has_daycare: boolean;
  has_wetmill: boolean;
  notes: string;
  photos: string[];
  is_active: boolean;
}

export interface DaycareRecord extends RecordModel {
  slow_farm: string;
  record_date: string;
  children_count: number;
  boys_count: number;
  girls_count: number;
  staff_count: number;
  activities: Array<{ name: string; description: string }>;
  meals_provided: string;
  health_observations: string;
  incidents: string;
  parent_feedback: string;
  photos: string[];
  notes: string;
  recorded_by: string;
}

export interface WetmillBatch extends RecordModel {
  batch_code: string;
  slow_farm: string;
  receiving_date: string;
  source_type: 'company_farm' | 'cooperative' | 'direct_farmer';
  source_cooperative: string;
  source_farmer: string;
  source_name: string;
  cherry_received_kg: number;
  cherry_quality: 'A' | 'B' | 'C' | 'mixed';
  moisture_cherry_pct: number;
  processing_method: 'washed' | 'natural' | 'honey' | 'semi_washed';
  processing_start_date: string;
  processing_end_date: string;
  parchment_output_kg: number;
  moisture_parchment_pct: number;
  conversion_ratio: number;
  lot_number: string;
  status: 'receiving' | 'processing' | 'drying' | 'completed' | 'rejected';
  price_per_kg_cherry: number;
  currency: string;
  total_cost: number;
  notes: string;
  photos: string[];
  recorded_by: string;
}

export interface ShadeTreeAssessment extends RecordModel {
  slow_farm: string;
  assessment_date: string;
  plot_section: string;
  tree_species: string;
  trees_planted: number;
  trees_surviving: number;
  survival_rate_pct: number;
  trees_dead: number;
  trees_replaced: number;
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  avg_height_m: number;
  avg_canopy_diameter_m: number;
  pest_disease_notes: string;
  maintenance_notes: string;
  recommendations: string;
  photos: string[];
  assessed_by: string;
}

export interface CoffeeYieldAssessment extends RecordModel {
  slow_farm: string;
  assessment_code: string;
  assessment_date: string;
  season: string;
  plot_section: string;
  area_assessed_ha: number;
  total_trees_assessed: number;
  productive_trees: number;
  non_productive_trees: number;
  avg_cherries_per_tree: number;
  estimated_cherry_kg: number;
  estimated_parchment_kg: number;
  estimated_yield_per_ha_kg: number;
  tree_health: 'excellent' | 'good' | 'fair' | 'poor';
  variety: string;
  avg_tree_age_years: number;
  pest_disease_observations: string;
  weather_conditions: string;
  recommendations: string;
  photos: string[];
  assessed_by: string;
}

export interface Worker extends RecordModel {
  worker_code: string;
  slow_farm: string;
  worker_type: 'inside' | 'outside';
  full_name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  id_card_number: string;
  phone: string;
  address: string;
  village: string;
  district: string;
  province: string;
  position: string;
  department: string;
  contract_type: 'permanent' | 'fixed_term' | 'daily' | 'seasonal';
  hire_date: string;
  contract_end_date: string;
  daily_rate: number;
  monthly_salary: number;
  currency: string;
  bank_account: string;
  bank_name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  profile_photo: string;
  documents: string[];
  status: 'active' | 'on_leave' | 'terminated' | 'seasonal_inactive';
  is_active: boolean;
  registered_by: string;
}

export interface PayrollRecord extends RecordModel {
  worker: string;
  slow_farm: string;
  payroll_period: string;
  year: number;
  month: number;
  days_worked: number;
  overtime_hours: number;
  base_salary: number;
  overtime_pay: number;
  bonus: number;
  deductions: number;
  deduction_details: string;
  net_pay: number;
  currency: string;
  payment_method: 'bank_transfer' | 'cash' | 'mobile_money';
  payment_date: string;
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
  approved_by: string;
  approved_at: string;
  notes: string;
  payslip: string;
  created_by: string;
}

// === RA CERTIFICATION AUDITS ===

export interface RaAudit extends RecordModel {
  country: Country;
  audit_date: string;
  auditor_name: string;
  audit_location: string;
  check_values: Record<string, string>;
  item_notes: Record<string, string>;
  section_notes: Record<string, string>;
  overall_result: 'pass' | 'fail' | 'conditional' | 'pending';
  overall_notes: string;
  corrective_actions: string;
  next_audit_date: string;
  assessed_by: string;
}

// === FARMER ANNUAL DATA ===

export interface FarmerAnnualData extends RecordModel {
  farmer: string;
  country: Country;
  year: number;
  season: string;
  annual_cherry_kg: number;
  high_quality_cherry_kg: number;
  a_cherry_estimation_kg: number;
  r_cherry_estimation_kg: number;
  total_coffee_income: number;
  total_production_cost: number;
  fertilizer_cost: number;
  pesticide_cost: number;
  fuel_cost: number;
  hired_labor_cost: number;
  other_costs: number;
  total_household_income: number;
  current_debt: number;
  remaining_cash: number;
  shade_trees_planted: number;
  shade_trees_survived: number;
  notes: string;
  recorded_by: string;
}

// === FARM ENVIRONMENT ASSESSMENTS ===

export interface FarmEnvironmentAssessment extends RecordModel {
  farm: string;
  country: Country;
  assessment_date: string;
  water_pollution_risk: 'none' | 'little' | 'moderate' | 'high';
  air_pollution_risk: 'none' | 'little' | 'moderate' | 'high';
  distance_to_chemical_farm: string;
  protection_method: string;
  buffer_zone_nwes: string;
  farm_tools_inventory: string;
  non_conformity_history: string;
  corrective_action: string;
  correction_status: 'pending' | 'in_progress' | 'resolved' | 'na';
  soil_ph: number;
  erosion_management: string;
  organic_matter_status: string;
  wildlife_observed: string;
  wild_beekeeping: boolean;
  managed_beekeeping: boolean;
  tree_species_list: string;
  vegetation_cover_pct: number;
  species_count: number;
  riparian_buffer_check: boolean;
  fire_usage: boolean;
  waste_management_notes: string;
  photos: string[];
  assessed_by: string;
}

// === GHG EMISSIONS ===

export interface GHGEmission extends RecordModel {
  farmer: string;
  country: Country;
  year: number;
  electricity_emissions_tco2e: number;
  fuel_combustion_emissions_tco2e: number;
  n_fert_emissions_tco2e: number;
  waste_emissions_tco2e: number;
  total_emissions_tco2e: number;
  notes: string;
  recorded_by: string;
}

// === ECOSYSTEM ASSESSMENTS ===

export interface EcosystemAssessment extends RecordModel {
  farm: string;
  country: Country;
  assessment_date: string;
  species_count: number;
  tree_species_list: string;
  vegetation_cover_pct: number;
  wildlife_observed: string;
  wild_beekeeping: boolean;
  managed_beekeeping: boolean;
  buffer_zone_details: string;
  riparian_buffer_check: boolean;
  fire_usage: boolean;
  waste_management_notes: string;
  biodiversity_rating: 'excellent' | 'good' | 'fair' | 'poor';
  photos: string[];
  notes: string;
  assessed_by: string;
}

// === COMPLIANCE RECORDS ===

export interface ComplianceRecord extends RecordModel {
  farmer: string;
  farm: string;
  country: Country;
  year: number;
  production_plan_recorded: boolean;
  contamination_risk_level: 'none' | 'low' | 'moderate' | 'high';
  protective_measures: string;
  non_compliance_record: string;
  corrective_action_status: 'pending' | 'in_progress' | 'resolved' | 'na';
  seed_purchase_notes: boolean;
  worker_ppe_available: boolean;
  child_labor_check: boolean;
  access_drinking_water: boolean;
  hazardous_work_ppe: boolean;
  land_conversion_check: boolean;
  wildlife_protection: boolean;
  fire_usage_policy: boolean;
  waste_management: string;
  compost_production: boolean;
  compost_storage_distance: boolean;
  residue_management: string;
  work_accident_records: string;
  first_aid_availability: string;
  notes: string;
  recorded_by: string;
}

// === IMPACT IMPLEMENTATION COLLECTIONS ===

export interface ActImpact extends RecordModel {
  impact_id: string;
  entity: string;
  category: string;
  planned_budget: number;
  actual_spending: number;
  annual_budget: number;
  balance: number;
  staff: string;
  record_date: string;
  file_path: string;
}

export interface ActImpactDetail extends RecordModel {
  detail_id: string;
  act_impact: string;
  impact_id_text: string;
  entity: string;
  activity_id: string;
  activity_date: string;
  activity_name: string;
  description: string;
  budget: number;
  budget_type: string;
  category: string;
  note: string;
  staff: string;
}

export interface ImpactPlan extends RecordModel {
  plan_id: string;
  entity_id: string;
  category_id: string;
  budget_plan: number;
  budget_total: number;
  budget_plan_balance: number;
  planned_date: string;
  staff: string;
  record_date: string;
  file_path: string;
}

export interface ImpactPlanDetail extends RecordModel {
  detail_id: string;
  impact_plan: string;
  plan_id_text: string;
  activity_code: string;
  budget: number;
  account_id: string;
  expense_id: string;
  time_implemented: string;
  staff: string;
  record_date: string;
  file_path: string;
}

export interface ImpactActivity extends RecordModel {
  activity_code: string;
  category: string;
  country_code: string;
  detail_name: string;
  notes: string;
}
