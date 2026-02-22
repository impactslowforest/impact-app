/// <reference path="../pb_data/types.d.ts" />

// Migration 017: Extended collections from Main data.xlsx
//
// New collections:
//   1.  act_impacts            - Activity impact budgets (68 rows)
//   2.  act_impact_details     - Activity impact detail items (998 rows)
//   3.  impact_plans           - Implementation plans (133 rows)
//   4.  impact_plan_details    - Plan detail items (263 rows)
//   5.  impact_activities      - Activity reference list (75 rows)
//   6.  farm_blocks            - Farm plot blocks (153 rows)
//   7.  tree_inventory         - Individual tree records (5325 rows)
//   8.  ghg_fmu                - GHG farm management units (985 rows)
//   9.  ghg_organic_fertilizer - GHG organic fertilizer data (976 rows)
//  10.  ghg_chemical_fertilizer- GHG chemical fertilizer data (997 rows)
//  11.  ghg_wetmill            - GHG wet mill energy data (908 rows)
//  12.  ghg_drymill            - GHG dry mill data (979 rows)
//  13-15 SKIPPED (already exist in migration 005)
//  16.  admin_locations        - Location hierarchy (977 rows)
//  17.  coffee_prices          - Daily coffee price records (995 rows)
//  18.  contractors            - External contractor records
//  19.  factories              - Processing facilities (999 rows)
//  20.  farmer_profiles        - Detailed farmer profile surveys (972 rows)
//  21.  farmer_profile_details - Per-farm profile details (974 rows)
//  22.  sf_daily_checks        - SLOW Farm daily checks (7+ rows)
//  23.  sf_weekly_checks       - SLOW Farm weekly checks (41+ rows)

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    const authRule = '@request.auth.id != ""';

    // Helper to create a base collection with standard autodate + API rules
    // Idempotent: skips if collection already exists
    function createBaseCollection(name) {
      try {
        const existing = app.findCollectionByNameOrId(name);
        console.log(`[017] Collection ${name} already exists, skipping creation`);
        return existing;
      } catch (e) {
        // Collection doesn't exist, create it
      }
      const col = new Collection({ name, type: "base" });
      app.save(col);
      const c = app.findCollectionByNameOrId(name);
      c.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
      c.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
      c.listRule = authRule;
      c.viewRule = authRule;
      c.createRule = authRule;
      c.updateRule = authRule;
      c.deleteRule = authRule;
      return c;
    }

    // ================================================================
    // 1. ACT_IMPACTS — Activity impact budgets
    // ================================================================
    const ai = createBaseCollection("act_impacts");
    ai.fields.add(new TextField({ name: "impact_id", required: true, max: 50 }));
    ai.fields.add(new TextField({ name: "entity", max: 20 }));
    ai.fields.add(new TextField({ name: "category", max: 50 }));
    ai.fields.add(new NumberField({ name: "planned_budget", min: 0 }));
    ai.fields.add(new NumberField({ name: "actual_spending", min: 0 }));
    ai.fields.add(new NumberField({ name: "annual_budget", min: 0 }));
    ai.fields.add(new NumberField({ name: "balance" }));
    ai.fields.add(new TextField({ name: "staff", max: 50 }));
    ai.fields.add(new DateField({ name: "record_date" }));
    ai.fields.add(new TextField({ name: "file_path" }));
    ai.indexes = ["CREATE UNIQUE INDEX idx_ai_impact_id ON act_impacts (impact_id)"];
    app.save(ai);
    console.log("[017] Created act_impacts");

    // ================================================================
    // 2. ACT_IMPACT_DETAILS
    // ================================================================
    const aid = createBaseCollection("act_impact_details");
    aid.fields.add(new TextField({ name: "detail_id", required: true, max: 60 }));
    aid.fields.add(new RelationField({ name: "act_impact", collectionId: ai.id, maxSelect: 1 }));
    aid.fields.add(new TextField({ name: "impact_id_text", max: 50 }));
    aid.fields.add(new TextField({ name: "entity", max: 20 }));
    aid.fields.add(new TextField({ name: "activity_id", max: 60 }));
    aid.fields.add(new DateField({ name: "activity_date" }));
    aid.fields.add(new TextField({ name: "activity_name", max: 500 }));
    aid.fields.add(new TextField({ name: "description" }));
    aid.fields.add(new NumberField({ name: "budget", min: 0 }));
    aid.fields.add(new TextField({ name: "budget_type", max: 50 }));
    aid.fields.add(new TextField({ name: "category", max: 50 }));
    aid.fields.add(new TextField({ name: "note" }));
    aid.fields.add(new TextField({ name: "staff", max: 50 }));
    aid.indexes = [
      "CREATE UNIQUE INDEX idx_aid_detail_id ON act_impact_details (detail_id)",
      "CREATE INDEX idx_aid_act_impact ON act_impact_details (act_impact)",
    ];
    app.save(aid);
    console.log("[017] Created act_impact_details");

    // ================================================================
    // 3. IMPACT_PLANS
    // ================================================================
    const ip = createBaseCollection("impact_plans");
    ip.fields.add(new TextField({ name: "plan_id", required: true, max: 50 }));
    ip.fields.add(new TextField({ name: "entity_id", max: 20 }));
    ip.fields.add(new TextField({ name: "category_id", max: 20 }));
    ip.fields.add(new NumberField({ name: "budget_plan", min: 0 }));
    ip.fields.add(new NumberField({ name: "budget_total", min: 0 }));
    ip.fields.add(new NumberField({ name: "budget_plan_balance" }));
    ip.fields.add(new DateField({ name: "planned_date" }));
    ip.fields.add(new TextField({ name: "staff", max: 50 }));
    ip.fields.add(new DateField({ name: "record_date" }));
    ip.fields.add(new TextField({ name: "file_path" }));
    ip.indexes = ["CREATE UNIQUE INDEX idx_ip_plan_id ON impact_plans (plan_id)"];
    app.save(ip);
    console.log("[017] Created impact_plans");

    // ================================================================
    // 4. IMPACT_PLAN_DETAILS
    // ================================================================
    const ipd = createBaseCollection("impact_plan_details");
    ipd.fields.add(new TextField({ name: "detail_id", required: true, max: 60 }));
    ipd.fields.add(new RelationField({ name: "impact_plan", collectionId: ip.id, maxSelect: 1 }));
    ipd.fields.add(new TextField({ name: "plan_id_text", max: 50 }));
    ipd.fields.add(new TextField({ name: "activity_code", max: 50 }));
    ipd.fields.add(new NumberField({ name: "budget", min: 0 }));
    ipd.fields.add(new TextField({ name: "account_id", max: 50 }));
    ipd.fields.add(new TextField({ name: "expense_id", max: 50 }));
    ipd.fields.add(new DateField({ name: "time_implemented" }));
    ipd.fields.add(new TextField({ name: "staff", max: 50 }));
    ipd.fields.add(new DateField({ name: "record_date" }));
    ipd.fields.add(new TextField({ name: "file_path" }));
    ipd.indexes = [
      "CREATE UNIQUE INDEX idx_ipd_detail_id ON impact_plan_details (detail_id)",
      "CREATE INDEX idx_ipd_plan ON impact_plan_details (impact_plan)",
    ];
    app.save(ipd);
    console.log("[017] Created impact_plan_details");

    // ================================================================
    // 5. IMPACT_ACTIVITIES
    // ================================================================
    const ia = createBaseCollection("impact_activities");
    ia.fields.add(new TextField({ name: "activity_code", required: true, max: 50 }));
    ia.fields.add(new TextField({ name: "category", max: 50 }));
    ia.fields.add(new TextField({ name: "country_code", max: 10 }));
    ia.fields.add(new TextField({ name: "detail_name", max: 500 }));
    ia.fields.add(new TextField({ name: "notes" }));
    ia.indexes = ["CREATE UNIQUE INDEX idx_ia_code ON impact_activities (activity_code)"];
    app.save(ia);
    console.log("[017] Created impact_activities");

    // ================================================================
    // 6. FARM_BLOCKS — Plot sub-divisions
    // ================================================================
    const fb = createBaseCollection("farm_blocks");
    fb.fields.add(new TextField({ name: "block_id", required: true, max: 50 }));
    fb.fields.add(new TextField({ name: "block_name", max: 100 }));
    fb.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    fb.fields.add(new TextField({ name: "coffee_type", max: 100 }));
    fb.fields.add(new TextField({ name: "cultivation_type", max: 100 }));
    fb.fields.add(new NumberField({ name: "area_ha", min: 0 }));
    fb.fields.add(new NumberField({ name: "row_by_row" }));
    fb.fields.add(new NumberField({ name: "tree_by_tree" }));
    fb.fields.add(new NumberField({ name: "density_per_ha" }));
    fb.fields.add(new NumberField({ name: "total_cherry_ton", min: 0 }));
    fb.fields.add(new NumberField({ name: "volume_expected_ton_ha" }));
    fb.fields.add(new NumberField({ name: "bean_per_kg" }));
    fb.fields.add(new NumberField({ name: "number_of_rows", min: 0 }));
    fb.fields.add(new TextField({ name: "inventory_status", max: 50 }));
    fb.fields.add(new TextField({ name: "notes" }));
    fb.fields.add(new DateField({ name: "record_date" }));
    fb.fields.add(new TextField({ name: "staff", max: 50 }));
    fb.indexes = ["CREATE UNIQUE INDEX idx_fb_block_id ON farm_blocks (block_id)"];
    app.save(fb);
    console.log("[017] Created farm_blocks");

    // ================================================================
    // 7. TREE_INVENTORY — Individual tree assessment records
    // ================================================================
    const ti = createBaseCollection("tree_inventory");
    ti.fields.add(new TextField({ name: "tree_id", required: true, max: 60 }));
    ti.fields.add(new TextField({ name: "block_id_text", max: 50 }));
    ti.fields.add(new DateField({ name: "assessment_date" }));
    ti.fields.add(new NumberField({ name: "row_number", min: 0 }));
    ti.fields.add(new TextField({ name: "location", max: 100 }));
    ti.fields.add(new NumberField({ name: "branch_count", min: 0 }));
    ti.fields.add(new NumberField({ name: "cluster_l1", min: 0 }));
    ti.fields.add(new NumberField({ name: "cluster_l2", min: 0 }));
    ti.fields.add(new NumberField({ name: "cluster_l3", min: 0 }));
    ti.fields.add(new NumberField({ name: "cluster_l4", min: 0 }));
    ti.fields.add(new NumberField({ name: "cluster_l5", min: 0 }));
    ti.fields.add(new NumberField({ name: "cherry_l1", min: 0 }));
    ti.fields.add(new NumberField({ name: "cherry_l2", min: 0 }));
    ti.fields.add(new NumberField({ name: "cherry_l3", min: 0 }));
    ti.fields.add(new NumberField({ name: "cherry_l4", min: 0 }));
    ti.fields.add(new NumberField({ name: "cherry_l5", min: 0 }));
    ti.fields.add(new NumberField({ name: "bean_per_kg" }));
    ti.fields.add(new TextField({ name: "notes" }));
    ti.fields.add(new TextField({ name: "photo_path" }));
    ti.fields.add(new TextField({ name: "coffee_type", max: 50 }));
    ti.fields.add(new TextField({ name: "ripeness_level", max: 50 }));
    ti.fields.add(new TextField({ name: "defect_rate", max: 50 }));
    ti.indexes = [
      "CREATE UNIQUE INDEX idx_ti_tree_id ON tree_inventory (tree_id)",
      "CREATE INDEX idx_ti_block ON tree_inventory (block_id_text)",
    ];
    app.save(ti);
    console.log("[017] Created tree_inventory");

    // ================================================================
    // 8. GHG_FMU — Farm management units for GHG
    // ================================================================
    const gfmu = createBaseCollection("ghg_fmu");
    gfmu.fields.add(new TextField({ name: "record_id", required: true, max: 60 }));
    gfmu.fields.add(new TextField({ name: "supplier_id", max: 20 }));
    gfmu.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    gfmu.fields.add(new TextField({ name: "farm_id_text", max: 30 }));
    gfmu.fields.add(new NumberField({ name: "cherry_harvested", min: 0 }));
    gfmu.fields.add(new NumberField({ name: "parchment_sold", min: 0 }));
    gfmu.fields.add(new NumberField({ name: "area_ha", min: 0 }));
    gfmu.fields.add(new NumberField({ name: "mature_area_ha", min: 0 }));
    gfmu.fields.add(new TextField({ name: "polygon", max: 10 }));
    gfmu.fields.add(new BoolField({ name: "organic_fertilizer_used" }));
    gfmu.fields.add(new BoolField({ name: "chemical_fertilizer_used" }));
    gfmu.fields.add(new TextField({ name: "fuel_type", max: 100 }));
    gfmu.fields.add(new NumberField({ name: "fuel_volume" }));
    gfmu.fields.add(new TextField({ name: "fuel_unit", max: 20 }));
    gfmu.fields.add(new TextField({ name: "vehicle_type_to_wetmill", max: 200 }));
    gfmu.fields.add(new TextField({ name: "fuel_type_to_wetmill", max: 100 }));
    gfmu.fields.add(new TextField({ name: "latlong", max: 100 }));
    gfmu.indexes = [
      "CREATE UNIQUE INDEX idx_gfmu_record ON ghg_fmu (record_id)",
      "CREATE INDEX idx_gfmu_supplier ON ghg_fmu (supplier_id)",
    ];
    app.save(gfmu);
    console.log("[017] Created ghg_fmu");

    // ================================================================
    // 9. GHG_ORGANIC_FERTILIZER
    // ================================================================
    const gof = createBaseCollection("ghg_organic_fertilizer");
    gof.fields.add(new TextField({ name: "record_id", required: true, max: 60 }));
    gof.fields.add(new TextField({ name: "supplier_id", max: 20 }));
    gof.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    gof.fields.add(new TextField({ name: "farm_id_text", max: 30 }));
    gof.fields.add(new NumberField({ name: "mature_area_ha", min: 0 }));
    gof.fields.add(new TextField({ name: "fertilizer_type", max: 300 }));
    gof.fields.add(new NumberField({ name: "volume_kg", min: 0 }));
    gof.fields.add(new NumberField({ name: "cattle_manure_kg", min: 0 }));
    gof.fields.add(new NumberField({ name: "goat_manure_kg", min: 0 }));
    gof.fields.add(new NumberField({ name: "organic_fertilizer_kg", min: 0 }));
    gof.fields.add(new NumberField({ name: "coffee_compost_kg", min: 0 }));
    gof.fields.add(new TextField({ name: "notes" }));
    gof.indexes = [
      "CREATE UNIQUE INDEX idx_gof_record ON ghg_organic_fertilizer (record_id)",
    ];
    app.save(gof);
    console.log("[017] Created ghg_organic_fertilizer");

    // ================================================================
    // 10. GHG_CHEMICAL_FERTILIZER
    // ================================================================
    const gcf = createBaseCollection("ghg_chemical_fertilizer");
    gcf.fields.add(new TextField({ name: "record_id", required: true, max: 60 }));
    gcf.fields.add(new TextField({ name: "supplier_id", max: 20 }));
    gcf.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    gcf.fields.add(new TextField({ name: "farm_id_text", max: 30 }));
    gcf.fields.add(new NumberField({ name: "mature_area_ha", min: 0 }));
    gcf.fields.add(new TextField({ name: "fertilizer_name", max: 200 }));
    gcf.fields.add(new TextField({ name: "composition", max: 300 }));
    gcf.fields.add(new NumberField({ name: "n_pct" }));
    gcf.fields.add(new NumberField({ name: "p_pct" }));
    gcf.fields.add(new NumberField({ name: "k_pct" }));
    gcf.fields.add(new TextField({ name: "dosage", max: 100 }));
    gcf.fields.add(new TextField({ name: "notes" }));
    gcf.indexes = [
      "CREATE UNIQUE INDEX idx_gcf_record ON ghg_chemical_fertilizer (record_id)",
    ];
    app.save(gcf);
    console.log("[017] Created ghg_chemical_fertilizer");

    // ================================================================
    // 11. GHG_WETMILL
    // ================================================================
    const gwm = createBaseCollection("ghg_wetmill");
    gwm.fields.add(new TextField({ name: "record_id", required: true, max: 60 }));
    gwm.fields.add(new TextField({ name: "supplier_id", max: 20 }));
    gwm.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    gwm.fields.add(new NumberField({ name: "electricity_kwh", min: 0 }));
    gwm.fields.add(new TextField({ name: "fuel_type", max: 100 }));
    gwm.fields.add(new NumberField({ name: "fuel_volume" }));
    gwm.fields.add(new TextField({ name: "fuel_unit", max: 20 }));
    gwm.fields.add(new NumberField({ name: "cherry_input_kg", min: 0 }));
    gwm.fields.add(new NumberField({ name: "parchment_output_kg", min: 0 }));
    gwm.fields.add(new NumberField({ name: "ratio_cherry_parchment" }));
    gwm.fields.add(new TextField({ name: "coordinate", max: 100 }));
    gwm.fields.add(new NumberField({ name: "solid_waste_kg", min: 0 }));
    gwm.fields.add(new TextField({ name: "solid_waste_treatment", max: 200 }));
    gwm.fields.add(new TextField({ name: "water_source", max: 100 }));
    gwm.fields.add(new NumberField({ name: "water_volume_liters", min: 0 }));
    gwm.fields.add(new TextField({ name: "wastewater_treatment", max: 200 }));
    gwm.fields.add(new TextField({ name: "vehicle_owner", max: 100 }));
    gwm.fields.add(new TextField({ name: "vehicle_type", max: 100 }));
    gwm.fields.add(new TextField({ name: "fuel_type_transport", max: 100 }));
    gwm.indexes = [
      "CREATE UNIQUE INDEX idx_gwm_record ON ghg_wetmill (record_id)",
    ];
    app.save(gwm);
    console.log("[017] Created ghg_wetmill");

    // ================================================================
    // 12. GHG_DRYMILL
    // ================================================================
    const gdm = createBaseCollection("ghg_drymill");
    gdm.fields.add(new TextField({ name: "record_id", required: true, max: 60 }));
    gdm.fields.add(new TextField({ name: "supplier_id", max: 20 }));
    gdm.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    gdm.fields.add(new NumberField({ name: "parchment_input_kg", min: 0 }));
    gdm.fields.add(new NumberField({ name: "green_bean_output_kg", min: 0 }));
    gdm.fields.add(new NumberField({ name: "ratio_parchment_gb" }));
    gdm.fields.add(new NumberField({ name: "energy_kwh", min: 0 }));
    gdm.fields.add(new TextField({ name: "coordinate", max: 100 }));
    gdm.fields.add(new TextField({ name: "vehicle_owner", max: 100 }));
    gdm.fields.add(new TextField({ name: "vehicle_type", max: 100 }));
    gdm.fields.add(new TextField({ name: "fuel_type_transport", max: 100 }));
    gdm.indexes = [
      "CREATE UNIQUE INDEX idx_gdm_record ON ghg_drymill (record_id)",
    ];
    app.save(gdm);
    console.log("[017] Created ghg_drymill");

    // 13-15 SKIPPED: eu_organic_inspections, eu_organic_farm_inspections,
    // farm_crop_estimations already exist from migration 005.
    console.log("[017] Skipped eu_organic_inspections (exists in 005)");
    console.log("[017] Skipped eu_organic_farm_inspections (exists in 005)");
    console.log("[017] Skipped farm_crop_estimations (exists in 005)");

    // ================================================================
    // 16. ADMIN_LOCATIONS — Location hierarchy reference
    // ================================================================
    const al = createBaseCollection("admin_locations");
    al.fields.add(new TextField({ name: "country_code", max: 10 }));
    al.fields.add(new TextField({ name: "country_label", max: 100 }));
    al.fields.add(new TextField({ name: "province", max: 200 }));
    al.fields.add(new TextField({ name: "province_code", max: 20 }));
    al.fields.add(new TextField({ name: "district", max: 200 }));
    al.fields.add(new TextField({ name: "district_code", max: 20 }));
    al.fields.add(new TextField({ name: "village_id", max: 30 }));
    al.fields.add(new TextField({ name: "commune", max: 200 }));
    al.fields.add(new TextField({ name: "commune_code", max: 20 }));
    al.fields.add(new TextField({ name: "village", max: 200 }));
    al.fields.add(new TextField({ name: "village_code", max: 20 }));
    al.indexes = [
      "CREATE INDEX idx_al_country ON admin_locations (country_code)",
      "CREATE INDEX idx_al_village_id ON admin_locations (village_id)",
    ];
    app.save(al);
    console.log("[017] Created admin_locations");

    // ================================================================
    // 17. COFFEE_PRICES
    // ================================================================
    const cp = createBaseCollection("coffee_prices");
    cp.fields.add(new TextField({ name: "price_id", required: true, max: 50 }));
    cp.fields.add(new DateField({ name: "price_date" }));
    cp.fields.add(new TextField({ name: "staff_id", max: 20 }));
    cp.fields.add(new NumberField({ name: "local_high_quality_price" }));
    cp.fields.add(new NumberField({ name: "local_price" }));
    cp.fields.add(new NumberField({ name: "economic_price" }));
    cp.fields.add(new NumberField({ name: "slow_price" }));
    cp.fields.add(new NumberField({ name: "newspaper_price" }));
    cp.fields.add(new TextField({ name: "time_slot", max: 50 }));
    cp.fields.add(new TextField({ name: "compare_note", max: 200 }));
    cp.fields.add(new TextField({ name: "notes" }));
    cp.indexes = [
      "CREATE UNIQUE INDEX idx_cp_id ON coffee_prices (price_id)",
      "CREATE INDEX idx_cp_date ON coffee_prices (price_date)",
    ];
    app.save(cp);
    console.log("[017] Created coffee_prices");

    // ================================================================
    // 18. CONTRACTORS
    // ================================================================
    const cont = createBaseCollection("contractors");
    cont.fields.add(new TextField({ name: "contractor_id", required: true, max: 50 }));
    cont.fields.add(new TextField({ name: "name", max: 200 }));
    cont.fields.add(new DateField({ name: "start_date" }));
    cont.fields.add(new DateField({ name: "end_date" }));
    cont.fields.add(new NumberField({ name: "workers_count", min: 0 }));
    cont.fields.add(new NumberField({ name: "working_days", min: 0 }));
    cont.indexes = [
      "CREATE UNIQUE INDEX idx_cont_id ON contractors (contractor_id)",
    ];
    app.save(cont);
    console.log("[017] Created contractors");

    // ================================================================
    // 19. FACTORIES
    // ================================================================
    const fac = createBaseCollection("factories");
    fac.fields.add(new TextField({ name: "factory_id", required: true, max: 50 }));
    fac.fields.add(new TextField({ name: "country_code", max: 10 }));
    fac.fields.add(new TextField({ name: "factory_name", max: 200 }));
    fac.fields.add(new TextField({ name: "factory_type", max: 100 }));
    fac.fields.add(new TextField({ name: "head", max: 200 }));
    fac.fields.add(new TextField({ name: "contract_id", max: 50 }));
    fac.fields.add(new NumberField({ name: "weight_to_contract", min: 0 }));
    fac.fields.add(new TextField({ name: "phone", max: 50 }));
    fac.fields.add(new TextField({ name: "email", max: 200 }));
    fac.fields.add(new TextField({ name: "province", max: 200 }));
    fac.fields.add(new TextField({ name: "district", max: 200 }));
    fac.fields.add(new TextField({ name: "commune", max: 200 }));
    fac.fields.add(new TextField({ name: "village", max: 200 }));
    fac.fields.add(new TextField({ name: "address", max: 500 }));
    fac.indexes = [
      "CREATE UNIQUE INDEX idx_fac_id ON factories (factory_id)",
    ];
    app.save(fac);
    console.log("[017] Created factories");

    // ================================================================
    // 20. FARMER_PROFILES — Detailed farmer profile surveys
    // ================================================================
    const fp = createBaseCollection("farmer_profiles");
    fp.fields.add(new TextField({ name: "profile_id", required: true, max: 60 }));
    fp.fields.add(new TextField({ name: "country_code", max: 10 }));
    fp.fields.add(new TextField({ name: "village_id", max: 20 }));
    fp.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    fp.fields.add(new DateField({ name: "survey_date" }));
    fp.fields.add(new TextField({ name: "staff", max: 50 }));
    fp.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    fp.fields.add(new TextField({ name: "gender", max: 20 }));
    fp.fields.add(new TextField({ name: "ethnicity", max: 100 }));
    fp.fields.add(new NumberField({ name: "year_of_birth" }));
    fp.fields.add(new TextField({ name: "household_type", max: 100 }));
    fp.fields.add(new NumberField({ name: "total_family_members", min: 0 }));
    fp.fields.add(new NumberField({ name: "female_members", min: 0 }));
    fp.fields.add(new NumberField({ name: "income_earners", min: 0 }));
    fp.fields.add(new NumberField({ name: "members_under_16", min: 0 }));
    fp.fields.add(new TextField({ name: "income_sources" }));
    fp.fields.add(new NumberField({ name: "total_cash_income" }));
    fp.fields.add(new NumberField({ name: "avg_cherry_price" }));
    fp.fields.add(new NumberField({ name: "total_cherry_volume" }));
    fp.fields.add(new NumberField({ name: "production_cost" }));
    fp.fields.add(new NumberField({ name: "other_income" }));
    fp.fields.add(new NumberField({ name: "total_coffee_area_ha" }));
    fp.fields.add(new NumberField({ name: "mature_coffee_area_ha" }));
    fp.fields.add(new NumberField({ name: "immature_coffee_area_ha" }));
    fp.fields.add(new NumberField({ name: "num_coffee_plots", min: 0 }));
    fp.fields.add(new JSONField({ name: "fertilizer_data" }));
    fp.fields.add(new JSONField({ name: "pesticide_data" }));
    fp.fields.add(new JSONField({ name: "biodiversity_data" }));
    fp.fields.add(new JSONField({ name: "energy_data" }));
    fp.fields.add(new JSONField({ name: "child_labor_data" }));
    fp.fields.add(new JSONField({ name: "financial_data" }));
    fp.indexes = [
      "CREATE UNIQUE INDEX idx_fp_id ON farmer_profiles (profile_id)",
      "CREATE INDEX idx_fp_farmer ON farmer_profiles (farmer_id_text)",
    ];
    app.save(fp);
    console.log("[017] Created farmer_profiles");

    // ================================================================
    // 21. FARMER_PROFILE_DETAILS — Per-farm plot details
    // ================================================================
    const fpd = createBaseCollection("farmer_profile_details");
    fpd.fields.add(new TextField({ name: "detail_id", required: true, max: 60 }));
    fpd.fields.add(new TextField({ name: "country_code", max: 10 }));
    fpd.fields.add(new TextField({ name: "village_id", max: 20 }));
    fpd.fields.add(new TextField({ name: "farmer_id_text", max: 20 }));
    fpd.fields.add(new TextField({ name: "farm_id_text", max: 30 }));
    fpd.fields.add(new TextField({ name: "farm_name", max: 200 }));
    fpd.fields.add(new TextField({ name: "registered_agroforestry", max: 100 }));
    fpd.fields.add(new TextField({ name: "polygon", max: 10 }));
    fpd.fields.add(new TextField({ name: "land_tenure_status", max: 200 }));
    fpd.fields.add(new TextField({ name: "slope", max: 100 }));
    fpd.fields.add(new NumberField({ name: "plot_area_ha", min: 0 }));
    fpd.fields.add(new NumberField({ name: "coffee_tree_count", min: 0 }));
    fpd.fields.add(new NumberField({ name: "planting_year" }));
    fpd.fields.add(new NumberField({ name: "annual_cherry_yield_kg", min: 0 }));
    fpd.fields.add(new NumberField({ name: "volume_to_slow_kg", min: 0 }));
    fpd.fields.add(new NumberField({ name: "shade_trees_past", min: 0 }));
    fpd.fields.add(new TextField({ name: "shade_tree_species" }));
    fpd.fields.add(new NumberField({ name: "pffp_shade_trees", min: 0 }));
    fpd.fields.add(new NumberField({ name: "surviving_pffp_trees", min: 0 }));
    fpd.indexes = [
      "CREATE UNIQUE INDEX idx_fpd_id ON farmer_profile_details (detail_id)",
      "CREATE INDEX idx_fpd_farmer ON farmer_profile_details (farmer_id_text)",
    ];
    app.save(fpd);
    console.log("[017] Created farmer_profile_details");

    // ================================================================
    // 22. SF_DAILY_CHECKS — SLOW Farm daily operational checks
    // ================================================================
    const sdc = createBaseCollection("sf_daily_checks");
    sdc.fields.add(new TextField({ name: "check_id", required: true, max: 60 }));
    sdc.fields.add(new DateField({ name: "check_date" }));
    sdc.fields.add(new TextField({ name: "staff_input", max: 100 }));
    sdc.fields.add(new TextField({ name: "country", max: 20 }));
    sdc.fields.add(new TextField({ name: "province", max: 200 }));
    sdc.fields.add(new TextField({ name: "district", max: 200 }));
    sdc.fields.add(new TextField({ name: "location", max: 200 }));
    sdc.fields.add(new TextField({ name: "farm_name", max: 200 }));
    sdc.fields.add(new JSONField({ name: "checklist_answers" }));
    sdc.indexes = [
      "CREATE UNIQUE INDEX idx_sdc_id ON sf_daily_checks (check_id)",
      "CREATE INDEX idx_sdc_date ON sf_daily_checks (check_date)",
    ];
    app.save(sdc);
    console.log("[017] Created sf_daily_checks");

    // ================================================================
    // 23. SF_WEEKLY_CHECKS — SLOW Farm weekly operational checks
    // ================================================================
    const swc = createBaseCollection("sf_weekly_checks");
    swc.fields.add(new TextField({ name: "check_id", required: true, max: 60 }));
    swc.fields.add(new DateField({ name: "check_date" }));
    swc.fields.add(new TextField({ name: "staff_input", max: 100 }));
    swc.fields.add(new TextField({ name: "location", max: 200 }));
    swc.fields.add(new TextField({ name: "farm_name", max: 200 }));
    swc.fields.add(new JSONField({ name: "housing_checklist" }));
    swc.fields.add(new JSONField({ name: "office_checklist" }));
    swc.indexes = [
      "CREATE UNIQUE INDEX idx_swc_id ON sf_weekly_checks (check_id)",
      "CREATE INDEX idx_swc_date ON sf_weekly_checks (check_date)",
    ];
    app.save(swc);
    console.log("[017] Created sf_weekly_checks");

    console.log("\n[Migration 017] ✓ All 23 new collections created");
  },

  // DOWN (rollback)
  (app) => {
    const collections = [
      "sf_weekly_checks", "sf_daily_checks",
      "farmer_profile_details", "farmer_profiles",
      "factories", "contractors", "coffee_prices",
      "admin_locations",
      // eu_organic_inspections, eu_organic_farm_inspections, farm_crop_estimations
      // are NOT deleted here — they belong to migration 005
      "ghg_drymill", "ghg_wetmill", "ghg_chemical_fertilizer",
      "ghg_organic_fertilizer", "ghg_fmu",
      "tree_inventory", "farm_blocks",
      "impact_activities", "impact_plan_details", "impact_plans",
      "act_impact_details", "act_impacts",
    ];
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name);
        app.delete(col);
        console.log(`[017 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[017 DOWN] ${name} not found, skipping`);
      }
    }
  }
);
