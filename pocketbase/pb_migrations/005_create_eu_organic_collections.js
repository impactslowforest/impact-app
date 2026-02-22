/// <reference path="../pb_data/types.d.ts" />

// Migration: Create EU Organic certification collections
// Based on: Main data.xlsx sheets: EU organic farmer, EU Organic farm,
//           10IndexEUorganic, Farm crop estimation, Intro_EU Organic
//
// Collections:
//   1. eu_organic_standards  - EU Organic standard rules/intro (reference)
//   2. eu_organic_inspections - Farmer-level inspection (ICS internal audit)
//   3. eu_organic_farm_inspections - Farm/plot-level inspection details
//   4. eu_organic_processing_qa - 10-index Q&A (32 questions on post-harvest)
//   5. farm_crop_estimations - Seasonal crop yield estimation per farm

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // ================================================================
    // 1. EU Organic Standards (reference table - rules intro)
    // ================================================================
    const stdCol = new Collection({ name: "eu_organic_standards", type: "base" });
    app.save(stdCol);

    const standards = app.findCollectionByNameOrId("eu_organic_standards");
    standards.fields.add(new TextField({ name: "title", required: true, max: 300 }));
    standards.fields.add(new TextField({ name: "content", required: true }));
    standards.fields.add(new NumberField({ name: "sort_order", min: 0 }));
    standards.fields.add(new FileField({
      name: "images",
      maxSelect: 5,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    standards.fields.add(new BoolField({ name: "is_active" }));
    standards.listRule = '@request.auth.id != ""';
    standards.viewRule = '@request.auth.id != ""';
    standards.createRule = '@request.auth.id != ""';
    standards.updateRule = '@request.auth.id != ""';
    standards.deleteRule = '@request.auth.id != ""';
    app.save(standards);

    // ================================================================
    // 2. EU Organic Inspections (farmer-level ICS internal audit)
    // Maps to "EU organic farmer" sheet
    // ================================================================
    const inspCol = new Collection({ name: "eu_organic_inspections", type: "base" });
    app.save(inspCol);

    const insp = app.findCollectionByNameOrId("eu_organic_inspections");

    // Identity & linking
    insp.fields.add(new TextField({ name: "inspection_id", required: true, max: 50 }));
    insp.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["laos", "indonesia", "vietnam"],
    }));
    insp.fields.add(new TextField({ name: "village_id", max: 20 }));
    insp.fields.add(new TextField({ name: "farmer_id", required: true, max: 50 }));
    insp.fields.add(new TextField({ name: "farmer_name", required: true, max: 200 }));
    insp.fields.add(new RelationField({ name: "inspector", collectionId: users.id, maxSelect: 1 }));
    insp.fields.add(new TextField({ name: "inspector_name", max: 200 }));
    insp.fields.add(new DateField({ name: "inspection_date", required: true }));
    insp.fields.add(new TextField({ name: "location" }));  // GPS coordinates

    // 1. General Information
    insp.fields.add(new SelectField({
      name: "informant",
      values: ["member", "family", "representative", "other"],
    }));
    insp.fields.add(new TextField({ name: "informant_detail" }));
    insp.fields.add(new TextField({ name: "uninspected_chemical_reason" }));
    insp.fields.add(new TextField({ name: "uninspected_organic_reason" }));

    // 2. Farm Documents
    insp.fields.add(new SelectField({
      name: "doc_application_form",
      values: ["RC", "NC", "NA"],  // Received Confirmed / Not Confirmed / Not Applicable
    }));
    insp.fields.add(new SelectField({
      name: "doc_farm_history",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_production_plan",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_drawing",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_production_factors",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_previous_report",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_other",
      values: ["RC", "NC", "NA"],
    }));
    insp.fields.add(new SelectField({
      name: "doc_organic_standard",
      values: ["RC", "NC", "NA"],
    }));

    // 3. Basic Production Information
    insp.fields.add(new BoolField({ name: "production_same_as_annual" }));
    insp.fields.add(new BoolField({ name: "production_changed" }));
    insp.fields.add(new TextField({ name: "production_change_reason" }));
    insp.fields.add(new BoolField({ name: "receives_farm_rent" }));
    insp.fields.add(new TextField({ name: "farm_rent_detail" }));

    // 4. Animals
    insp.fields.add(new NumberField({ name: "num_poultry", min: 0 }));
    insp.fields.add(new NumberField({ name: "num_pig", min: 0 }));
    insp.fields.add(new NumberField({ name: "num_cow", min: 0 }));
    insp.fields.add(new NumberField({ name: "num_buffalo", min: 0 }));

    // Inspection type
    insp.fields.add(new SelectField({
      name: "inspection_type",
      values: ["initial", "annual", "unannounced", "follow_up"],
    }));

    // Comments on last year
    insp.fields.add(new TextField({ name: "last_year_comments" }));

    // 11. Inspector summary
    insp.fields.add(new TextField({ name: "inspector_summary" }));

    // Review committee
    insp.fields.add(new TextField({ name: "review_member_name" }));
    insp.fields.add(new TextField({ name: "review_member_id" }));
    insp.fields.add(new DateField({ name: "review_meeting_date" }));
    insp.fields.add(new SelectField({
      name: "review_result",
      values: ["C1", "C2", "C3", "NC", "suspended", "pending"],
    }));
    insp.fields.add(new TextField({ name: "postponed_reason" }));
    insp.fields.add(new TextField({ name: "certified_conditions" }));
    insp.fields.add(new TextField({ name: "certified_area_crops" }));

    // File attachments
    insp.fields.add(new FileField({
      name: "report_file",
      maxSelect: 5,
      maxSize: 52428800,
      mimeTypes: [
        "application/pdf", "image/jpeg", "image/png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    }));

    // Status
    insp.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["draft", "submitted", "reviewed", "approved", "rejected"],
    }));

    insp.indexes = [
      "CREATE UNIQUE INDEX idx_eu_insp_id ON eu_organic_inspections (inspection_id)",
      "CREATE INDEX idx_eu_insp_farmer ON eu_organic_inspections (farmer_id)",
      "CREATE INDEX idx_eu_insp_country ON eu_organic_inspections (country)",
      "CREATE INDEX idx_eu_insp_date ON eu_organic_inspections (inspection_date)",
    ];
    insp.listRule = '@request.auth.id != ""';
    insp.viewRule = '@request.auth.id != ""';
    insp.createRule = '@request.auth.id != ""';
    insp.updateRule = '@request.auth.id != ""';
    insp.deleteRule = '@request.auth.id != ""';
    app.save(insp);

    // ================================================================
    // 3. EU Organic Farm Inspections (per-farm/plot inspection)
    // Maps to "EU Organic farm" sheet
    // ================================================================
    const farmInspCol = new Collection({ name: "eu_organic_farm_inspections", type: "base" });
    app.save(farmInspCol);

    const farmInsp = app.findCollectionByNameOrId("eu_organic_farm_inspections");

    // Linking
    farmInsp.fields.add(new TextField({ name: "inspection_farm_id", required: true, max: 50 }));
    farmInsp.fields.add(new RelationField({
      name: "inspection",
      required: true,
      collectionId: insp.id,
      maxSelect: 1,
    }));
    farmInsp.fields.add(new TextField({ name: "farmer_id", required: true, max: 50 }));
    farmInsp.fields.add(new TextField({ name: "farm_id", required: true, max: 50 }));
    farmInsp.fields.add(new TextField({ name: "farm_name", max: 200 }));
    farmInsp.fields.add(new BoolField({ name: "land_certificate" }));
    farmInsp.fields.add(new DateField({ name: "inspection_date" }));
    farmInsp.fields.add(new RelationField({ name: "inspector", collectionId: users.id, maxSelect: 1 }));
    farmInsp.fields.add(new TextField({ name: "location" }));  // GPS

    // 3. Production Plan
    farmInsp.fields.add(new NumberField({ name: "total_area_ha", min: 0 }));
    farmInsp.fields.add(new SelectField({
      name: "production_system",
      values: ["monoculture", "intercropping", "agroforestry", "mixed"],
    }));
    farmInsp.fields.add(new DateField({ name: "entry_date" }));
    farmInsp.fields.add(new DateField({ name: "organic_conversion_date" }));
    farmInsp.fields.add(new TextField({ name: "plant_species" }));
    farmInsp.fields.add(new NumberField({ name: "a_expected_produce_kg", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "r_expected_produce_kg", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "organic_area_ha", min: 0 }));

    // 4. Seed
    farmInsp.fields.add(new TextField({ name: "seed_source" }));
    farmInsp.fields.add(new NumberField({ name: "seed_quantity_kg", min: 0 }));
    farmInsp.fields.add(new DateField({ name: "replanting_date" }));
    farmInsp.fields.add(new TextField({ name: "fertilizer_combined" }));
    farmInsp.fields.add(new TextField({ name: "seedling_remark" }));

    // 5. Fertilizer
    farmInsp.fields.add(new TextField({ name: "fertilizer_source" }));
    farmInsp.fields.add(new DateField({ name: "fertilizer_apply_date" }));
    farmInsp.fields.add(new NumberField({ name: "fert_qty_1", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "fert_qty_2", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "fert_qty_3", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "fert_qty_4", min: 0 }));
    farmInsp.fields.add(new NumberField({ name: "fert_qty_5", min: 0 }));
    farmInsp.fields.add(new TextField({ name: "fert_qty_5_comment" }));

    // 6. Growing Condition
    farmInsp.fields.add(new TextField({ name: "growing_condition_notes" }));

    // 7. Pest Management
    farmInsp.fields.add(new BoolField({ name: "has_disease" }));
    farmInsp.fields.add(new TextField({ name: "disease_description" }));
    farmInsp.fields.add(new SelectField({
      name: "pest_management_method",
      values: ["none", "manual", "biological", "herbal", "other"],
    }));
    farmInsp.fields.add(new TextField({ name: "management_method_other" }));
    farmInsp.fields.add(new TextField({ name: "herbal_agents" }));
    farmInsp.fields.add(new BoolField({ name: "forbidden_chemical_used" }));
    farmInsp.fields.add(new TextField({ name: "forbidden_chemical_desc" }));
    farmInsp.fields.add(new BoolField({ name: "shared_sprayer_used" }));
    farmInsp.fields.add(new TextField({ name: "shared_sprayer_cleaning" }));

    // 8. External Contamination Risk
    farmInsp.fields.add(new TextField({ name: "protective_measure" }));
    farmInsp.fields.add(new TextField({ name: "protective_north" }));
    farmInsp.fields.add(new TextField({ name: "protective_west" }));
    farmInsp.fields.add(new TextField({ name: "protective_east" }));
    farmInsp.fields.add(new TextField({ name: "protective_south" }));
    farmInsp.fields.add(new TextField({ name: "distance_chemical_farm" }));
    farmInsp.fields.add(new TextField({ name: "distance_north" }));
    farmInsp.fields.add(new TextField({ name: "distance_west" }));
    farmInsp.fields.add(new TextField({ name: "distance_east" }));
    farmInsp.fields.add(new TextField({ name: "distance_south" }));

    // 9. Contamination Assessment Summary
    farmInsp.fields.add(new SelectField({
      name: "water_pollution_risk",
      values: ["none", "little", "moderate", "high"],
    }));
    farmInsp.fields.add(new SelectField({
      name: "air_pollution_risk",
      values: ["none", "little", "moderate", "high"],
    }));
    farmInsp.fields.add(new SelectField({
      name: "tools_risk",
      values: ["none", "little", "moderate", "high"],
    }));
    farmInsp.fields.add(new TextField({ name: "high_risk_detail" }));

    // Previous year tracking
    farmInsp.fields.add(new TextField({ name: "inconsistency_description" }));
    farmInsp.fields.add(new BoolField({ name: "has_been_improved" }));
    farmInsp.fields.add(new TextField({ name: "improvement_solution" }));

    farmInsp.indexes = [
      "CREATE UNIQUE INDEX idx_eu_farm_insp_id ON eu_organic_farm_inspections (inspection_farm_id)",
      "CREATE INDEX idx_eu_farm_insp_parent ON eu_organic_farm_inspections (inspection)",
      "CREATE INDEX idx_eu_farm_insp_farmer ON eu_organic_farm_inspections (farmer_id)",
    ];
    farmInsp.listRule = '@request.auth.id != ""';
    farmInsp.viewRule = '@request.auth.id != ""';
    farmInsp.createRule = '@request.auth.id != ""';
    farmInsp.updateRule = '@request.auth.id != ""';
    farmInsp.deleteRule = '@request.auth.id != ""';
    app.save(farmInsp);

    // ================================================================
    // 4. EU Organic Processing Q&A (10-Index / Post-harvest questions)
    // Maps to "10IndexEUorganic" sheet - 32 questions (Q1-Q32 + Add notes)
    // ================================================================
    const qaCol = new Collection({ name: "eu_organic_processing_qa", type: "base" });
    app.save(qaCol);

    const qa = app.findCollectionByNameOrId("eu_organic_processing_qa");

    qa.fields.add(new RelationField({
      name: "inspection",
      required: true,
      collectionId: insp.id,
      maxSelect: 1,
    }));

    // Section 10: Report on the Inspection of the Transformation to Parchment
    // Q1-Q19: Picking, Processing, Drying, Storage (current year)
    qa.fields.add(new TextField({ name: "q1_picking_separation" }));
    qa.fields.add(new TextField({ name: "q1_notes" }));
    qa.fields.add(new TextField({ name: "q2_pre_picking_prep" }));
    qa.fields.add(new TextField({ name: "q2_notes" }));
    qa.fields.add(new TextField({ name: "q3_storage_containers" }));
    qa.fields.add(new TextField({ name: "q3_notes" }));
    qa.fields.add(new TextField({ name: "q4_container_type_source" }));
    qa.fields.add(new TextField({ name: "q4_notes" }));
    qa.fields.add(new TextField({ name: "q5_lay_down_process" }));
    qa.fields.add(new TextField({ name: "q5_notes" }));
    qa.fields.add(new TextField({ name: "q6_transport_vehicle" }));
    qa.fields.add(new TextField({ name: "q6_notes" }));
    qa.fields.add(new TextField({ name: "q7_milling_timing" }));
    qa.fields.add(new TextField({ name: "q7_notes" }));
    qa.fields.add(new TextField({ name: "q8_pre_milling_method" }));
    qa.fields.add(new TextField({ name: "q8_notes" }));
    qa.fields.add(new TextField({ name: "q9_post_milling_wash" }));
    qa.fields.add(new TextField({ name: "q9_notes" }));
    qa.fields.add(new TextField({ name: "q10_fermentation_process" }));
    qa.fields.add(new TextField({ name: "q10_notes" }));
    qa.fields.add(new TextField({ name: "q11_drying_location_tools" }));
    qa.fields.add(new TextField({ name: "q11_notes" }));
    qa.fields.add(new TextField({ name: "q12_drying_method_care" }));
    qa.fields.add(new TextField({ name: "q12_notes" }));
    qa.fields.add(new TextField({ name: "q13_drying_location_duration" }));
    qa.fields.add(new TextField({ name: "q13_notes" }));
    qa.fields.add(new TextField({ name: "q14_animal_insect_access" }));
    qa.fields.add(new TextField({ name: "q14_notes" }));
    qa.fields.add(new TextField({ name: "q15_stirring_scooping_tools" }));
    qa.fields.add(new TextField({ name: "q15_notes" }));
    qa.fields.add(new TextField({ name: "q16_shared_drying_place" }));
    qa.fields.add(new TextField({ name: "q16_notes" }));
    qa.fields.add(new TextField({ name: "q17_collection_location" }));
    qa.fields.add(new TextField({ name: "q17_notes" }));
    qa.fields.add(new TextField({ name: "q18_humidity_level" }));
    qa.fields.add(new TextField({ name: "q18_notes" }));
    qa.fields.add(new TextField({ name: "q19_contamination_barrier" }));
    qa.fields.add(new TextField({ name: "q19_notes" }));

    // Q20-Q32: Previous year tracking + compliance follow-up
    qa.fields.add(new TextField({ name: "q20_previous_year_tracking" }));
    qa.fields.add(new TextField({ name: "q20_notes" }));
    qa.fields.add(new TextField({ name: "q21_transferred_land_production" }));
    qa.fields.add(new TextField({ name: "q21_notes" }));
    qa.fields.add(new TextField({ name: "q22_fence_boundary_repair" }));
    qa.fields.add(new TextField({ name: "q22_notes" }));
    qa.fields.add(new TextField({ name: "q23_farm_cleaning" }));
    qa.fields.add(new TextField({ name: "q23_notes" }));
    qa.fields.add(new TextField({ name: "q24_chemical_border_records" }));
    qa.fields.add(new TextField({ name: "q24_notes" }));
    qa.fields.add(new TextField({ name: "q25_vegetable_control" }));
    qa.fields.add(new TextField({ name: "q25_notes" }));
    qa.fields.add(new TextField({ name: "q26_chemical_coffee_list" }));
    qa.fields.add(new TextField({ name: "q26_notes" }));
    qa.fields.add(new TextField({ name: "q27_animal_dung_usage" }));
    qa.fields.add(new TextField({ name: "q27_notes" }));
    qa.fields.add(new TextField({ name: "q28_produce_separation" }));
    qa.fields.add(new TextField({ name: "q28_notes" }));
    qa.fields.add(new TextField({ name: "q29_produce_management" }));
    qa.fields.add(new TextField({ name: "q29_notes" }));
    qa.fields.add(new TextField({ name: "q30_conventional_organic_mgmt" }));
    qa.fields.add(new TextField({ name: "q30_notes" }));
    qa.fields.add(new TextField({ name: "q31_storage_management" }));
    qa.fields.add(new TextField({ name: "q31_notes" }));
    qa.fields.add(new TextField({ name: "q32_sales_location_volume" }));
    qa.fields.add(new TextField({ name: "q32_notes" }));

    // Compliance per question (COM = Compliant, NC = Non-Compliant, NA = Not Applicable)
    qa.fields.add(new JSONField({ name: "compliance_map" }));  // {"q1":"COM","q2":"NC",...}

    qa.indexes = [
      "CREATE INDEX idx_eu_qa_insp ON eu_organic_processing_qa (inspection)",
    ];
    qa.listRule = '@request.auth.id != ""';
    qa.viewRule = '@request.auth.id != ""';
    qa.createRule = '@request.auth.id != ""';
    qa.updateRule = '@request.auth.id != ""';
    qa.deleteRule = '@request.auth.id != ""';
    app.save(qa);

    // ================================================================
    // 5. Farm Crop Estimations (seasonal yield estimation)
    // Maps to "Farm crop estimation" sheet
    // ================================================================
    const estCol = new Collection({ name: "farm_crop_estimations", type: "base" });
    app.save(estCol);

    const est = app.findCollectionByNameOrId("farm_crop_estimations");

    est.fields.add(new TextField({ name: "estimate_id", required: true, max: 50 }));
    est.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["laos", "indonesia", "vietnam"],
    }));
    est.fields.add(new TextField({ name: "village_id", max: 20 }));
    est.fields.add(new TextField({ name: "farmer_id", required: true, max: 50 }));
    est.fields.add(new TextField({ name: "farm_id", required: true, max: 50 }));
    est.fields.add(new TextField({ name: "inspection_farm_id", max: 50 }));
    est.fields.add(new DateField({ name: "estimation_date" }));
    est.fields.add(new NumberField({ name: "yield_per_ha", min: 0 }));
    est.fields.add(new RelationField({ name: "staff", collectionId: users.id, maxSelect: 1 }));
    est.fields.add(new NumberField({ name: "num_species", min: 0 }));
    est.fields.add(new NumberField({ name: "a_area_ha", min: 0 }));
    est.fields.add(new NumberField({ name: "r_area_ha", min: 0 }));
    est.fields.add(new NumberField({ name: "total_area_ha", min: 0 }));
    est.fields.add(new NumberField({ name: "farm_area_ha", min: 0 }));
    est.fields.add(new SelectField({
      name: "area_type",
      values: ["organic", "conventional", "transitional"],
    }));
    est.fields.add(new NumberField({ name: "a_cherry_kg", min: 0 }));
    est.fields.add(new NumberField({ name: "r_cherry_kg", min: 0 }));
    est.fields.add(new SelectField({
      name: "cherry_type",
      values: ["organic_parchment", "organic_cherry", "conventional", "transitional"],
    }));
    est.fields.add(new NumberField({ name: "a_parchment_kg", min: 0 }));
    est.fields.add(new NumberField({ name: "r_parchment_kg", min: 0 }));
    est.fields.add(new SelectField({
      name: "parchment_type",
      values: ["organic_parchment", "organic_cherry", "conventional", "transitional"],
    }));
    est.fields.add(new FileField({
      name: "verification_photo",
      maxSelect: 5,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));

    est.indexes = [
      "CREATE UNIQUE INDEX idx_est_id ON farm_crop_estimations (estimate_id)",
      "CREATE INDEX idx_est_farmer ON farm_crop_estimations (farmer_id)",
      "CREATE INDEX idx_est_farm ON farm_crop_estimations (farm_id)",
    ];
    est.listRule = '@request.auth.id != ""';
    est.viewRule = '@request.auth.id != ""';
    est.createRule = '@request.auth.id != ""';
    est.updateRule = '@request.auth.id != ""';
    est.deleteRule = '@request.auth.id != ""';
    app.save(est);
  },
  (app) => {
    // Rollback
    try { app.delete(app.findCollectionByNameOrId("farm_crop_estimations")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eu_organic_processing_qa")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eu_organic_farm_inspections")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eu_organic_inspections")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eu_organic_standards")); } catch(e) {}
  }
);
