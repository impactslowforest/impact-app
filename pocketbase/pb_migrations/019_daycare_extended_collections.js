/// <reference path="../pb_data/types.d.ts" />

// Migration 019: Daycare center extended collections
//
// New collections:
//   1. dc_families         - Parent/guardian family data (968 rows)
//   2. dc_kids             - Child registration data (991 rows)
//   3. dc_kid_studies      - Learning assessment records (1,433 rows)
//   4. dc_attendance       - Daily attendance records (34,741 rows)
//   5. dc_health_checks    - Health measurement records (997 rows)
//   6. dc_farm_health_checks - Farm-level health check summary (19 rows)
//   7. dc_attendance_checks - Attendance session master (894 rows)
//   8. dc_menu_details     - Daily meal menu items (131 rows)
//   9. dc_materials        - Kitchen materials/ingredients (95 rows)

migrate(
  (app) => {
    const authRule = '@request.auth.id != ""';

    function createBaseCollection(name) {
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

    // 1. DC_FAMILIES
    const dcf = createBaseCollection("dc_families");
    dcf.fields.add(new TextField({ name: "family_id", required: true, max: 50 }));
    dcf.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dcf.fields.add(new TextField({ name: "worker1_name_en", max: 200 }));
    dcf.fields.add(new TextField({ name: "worker1_name_lo", max: 200 }));
    dcf.fields.add(new TextField({ name: "worker1_id", max: 30 }));
    dcf.fields.add(new TextField({ name: "relation1", max: 50 }));
    dcf.fields.add(new TextField({ name: "worker2_name_en", max: 200 }));
    dcf.fields.add(new TextField({ name: "worker2_name_lo", max: 200 }));
    dcf.fields.add(new TextField({ name: "worker2_id", max: 30 }));
    dcf.fields.add(new TextField({ name: "relation2", max: 50 }));
    dcf.fields.add(new TextField({ name: "siblings" }));
    dcf.indexes = [
      "CREATE UNIQUE INDEX idx_dcf_id ON dc_families (family_id)",
      "CREATE INDEX idx_dcf_farm ON dc_families (farm_id_text)",
    ];
    app.save(dcf);
    console.log("[019] Created dc_families");

    // 2. DC_KIDS
    const dck = createBaseCollection("dc_kids");
    dck.fields.add(new TextField({ name: "kid_id", required: true, max: 30 }));
    dck.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dck.fields.add(new TextField({ name: "family_id_text", max: 50 }));
    dck.fields.add(new TextField({ name: "first_name", max: 100 }));
    dck.fields.add(new TextField({ name: "last_name", max: 100 }));
    dck.fields.add(new TextField({ name: "nickname", max: 100 }));
    dck.fields.add(new TextField({ name: "lao_first_name", max: 200 }));
    dck.fields.add(new TextField({ name: "lao_last_name", max: 200 }));
    dck.fields.add(new DateField({ name: "birthday" }));
    dck.fields.add(new TextField({ name: "gender", max: 20 }));
    dck.fields.add(new BoolField({ name: "on_farm" }));
    dck.fields.add(new BoolField({ name: "uses_lao_primary" }));
    dck.fields.add(new TextField({ name: "other_languages", max: 200 }));
    dck.fields.add(new DateField({ name: "arrived_date" }));
    dck.fields.add(new DateField({ name: "left_date" }));
    dck.fields.add(new BoolField({ name: "attended_school_before" }));
    dck.fields.add(new TextField({ name: "official_school_level", max: 20 }));
    dck.fields.add(new TextField({ name: "real_estimated_level", max: 20 }));
    dck.fields.add(new TextField({ name: "notes" }));
    dck.fields.add(new TextField({ name: "image_path" }));
    dck.indexes = [
      "CREATE UNIQUE INDEX idx_dck_id ON dc_kids (kid_id)",
      "CREATE INDEX idx_dck_farm ON dc_kids (farm_id_text)",
      "CREATE INDEX idx_dck_family ON dc_kids (family_id_text)",
    ];
    app.save(dck);
    console.log("[019] Created dc_kids");

    // 3. DC_KID_STUDIES
    const dks = createBaseCollection("dc_kid_studies");
    dks.fields.add(new TextField({ name: "study_id", required: true, max: 60 }));
    dks.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dks.fields.add(new TextField({ name: "kid_id_text", max: 30 }));
    dks.fields.add(new TextField({ name: "kid_name", max: 200 }));
    dks.fields.add(new TextField({ name: "family_id_text", max: 50 }));
    dks.fields.add(new TextField({ name: "subject", max: 50 }));
    dks.fields.add(new DateField({ name: "study_date" }));
    dks.fields.add(new NumberField({ name: "score" }));
    dks.fields.add(new TextField({ name: "level", max: 20 }));
    dks.indexes = [
      "CREATE UNIQUE INDEX idx_dks_id ON dc_kid_studies (study_id)",
      "CREATE INDEX idx_dks_kid ON dc_kid_studies (kid_id_text)",
    ];
    app.save(dks);
    console.log("[019] Created dc_kid_studies");

    // 4. DC_ATTENDANCE — Daily attendance (~35K rows)
    const dca = createBaseCollection("dc_attendance");
    dca.fields.add(new TextField({ name: "attendance_id", required: true, max: 60 }));
    dca.fields.add(new TextField({ name: "family_id_text", max: 50 }));
    dca.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dca.fields.add(new TextField({ name: "class_id", max: 20 }));
    dca.fields.add(new TextField({ name: "kid_id_text", max: 30 }));
    dca.fields.add(new TextField({ name: "check_id_text", max: 50 }));
    dca.fields.add(new DateField({ name: "attendance_date" }));
    dca.fields.add(new TextField({ name: "attendance_status", max: 10 }));
    dca.fields.add(new NumberField({ name: "meal_count", min: 0 }));
    dca.fields.add(new TextField({ name: "time_slot", max: 10 }));
    dca.indexes = [
      "CREATE INDEX idx_dca_kid ON dc_attendance (kid_id_text)",
      "CREATE INDEX idx_dca_date ON dc_attendance (attendance_date)",
      "CREATE INDEX idx_dca_farm ON dc_attendance (farm_id_text)",
    ];
    app.save(dca);
    console.log("[019] Created dc_attendance");

    // 5. DC_HEALTH_CHECKS
    const dch = createBaseCollection("dc_health_checks");
    dch.fields.add(new TextField({ name: "check_record_id", required: true, max: 60 }));
    dch.fields.add(new TextField({ name: "farm_check_id", max: 30 }));
    dch.fields.add(new TextField({ name: "check_id_text", max: 50 }));
    dch.fields.add(new TextField({ name: "kid_id_text", max: 30 }));
    dch.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dch.fields.add(new TextField({ name: "kid_name", max: 200 }));
    dch.fields.add(new TextField({ name: "gender", max: 10 }));
    dch.fields.add(new DateField({ name: "birthday" }));
    dch.fields.add(new DateField({ name: "measure_date" }));
    dch.fields.add(new NumberField({ name: "weight_kg" }));
    dch.fields.add(new NumberField({ name: "height_cm" }));
    dch.fields.add(new NumberField({ name: "muac_cm" }));
    dch.fields.add(new NumberField({ name: "bmi_index" }));
    dch.fields.add(new NumberField({ name: "age_months" }));
    dch.fields.add(new NumberField({ name: "waz_score" }));
    dch.fields.add(new NumberField({ name: "haz_score" }));
    dch.fields.add(new NumberField({ name: "whz_score" }));
    dch.fields.add(new NumberField({ name: "baz_score" }));
    dch.fields.add(new TextField({ name: "waz_assessment", max: 50 }));
    dch.fields.add(new TextField({ name: "haz_assessment", max: 50 }));
    dch.fields.add(new TextField({ name: "whz_assessment", max: 50 }));
    dch.fields.add(new TextField({ name: "baz_assessment", max: 50 }));
    dch.indexes = [
      "CREATE UNIQUE INDEX idx_dch_id ON dc_health_checks (check_record_id)",
      "CREATE INDEX idx_dch_kid ON dc_health_checks (kid_id_text)",
      "CREATE INDEX idx_dch_date ON dc_health_checks (measure_date)",
    ];
    app.save(dch);
    console.log("[019] Created dc_health_checks");

    // 6. DC_FARM_HEALTH_CHECKS
    const dcfh = createBaseCollection("dc_farm_health_checks");
    dcfh.fields.add(new TextField({ name: "check_id", required: true, max: 30 }));
    dcfh.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dcfh.fields.add(new DateField({ name: "check_date" }));
    dcfh.fields.add(new TextField({ name: "doctor1", max: 200 }));
    dcfh.fields.add(new TextField({ name: "doctor2", max: 200 }));
    dcfh.fields.add(new TextField({ name: "doctor3", max: 200 }));
    dcfh.fields.add(new TextField({ name: "doctor4", max: 200 }));
    dcfh.fields.add(new NumberField({ name: "num_kids", min: 0 }));
    dcfh.fields.add(new NumberField({ name: "num_male", min: 0 }));
    dcfh.fields.add(new NumberField({ name: "num_female", min: 0 }));
    dcfh.fields.add(new NumberField({ name: "under_60_months", min: 0 }));
    dcfh.fields.add(new NumberField({ name: "over_60_months", min: 0 }));
    dcfh.fields.add(new TextField({ name: "file_path" }));
    dcfh.indexes = [
      "CREATE UNIQUE INDEX idx_dcfh_id ON dc_farm_health_checks (check_id)",
    ];
    app.save(dcfh);
    console.log("[019] Created dc_farm_health_checks");

    // 7. DC_ATTENDANCE_CHECKS — Session master
    const dcac = createBaseCollection("dc_attendance_checks");
    dcac.fields.add(new TextField({ name: "check_id", required: true, max: 50 }));
    dcac.fields.add(new DateField({ name: "check_date" }));
    dcac.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dcac.fields.add(new TextField({ name: "class_id", max: 20 }));
    dcac.fields.add(new TextField({ name: "slot_time", max: 10 }));
    dcac.fields.add(new TextField({ name: "attendance_list" }));
    dcac.indexes = [
      "CREATE UNIQUE INDEX idx_dcac_id ON dc_attendance_checks (check_id)",
    ];
    app.save(dcac);
    console.log("[019] Created dc_attendance_checks");

    // 8. DC_MENU_DETAILS
    const dcm = createBaseCollection("dc_menu_details");
    dcm.fields.add(new TextField({ name: "menu_detail_id", required: true, max: 60 }));
    dcm.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    dcm.fields.add(new TextField({ name: "staff_id", max: 20 }));
    dcm.fields.add(new TextField({ name: "daily_menu_id", max: 50 }));
    dcm.fields.add(new TextField({ name: "material_name", max: 200 }));
    dcm.fields.add(new DateField({ name: "menu_date" }));
    dcm.fields.add(new NumberField({ name: "quantity", min: 0 }));
    dcm.fields.add(new TextField({ name: "unit", max: 20 }));
    dcm.fields.add(new NumberField({ name: "unit_price", min: 0 }));
    dcm.fields.add(new NumberField({ name: "total_price", min: 0 }));
    dcm.indexes = [
      "CREATE UNIQUE INDEX idx_dcm_id ON dc_menu_details (menu_detail_id)",
    ];
    app.save(dcm);
    console.log("[019] Created dc_menu_details");

    // 9. DC_MATERIALS
    const dcmat = createBaseCollection("dc_materials");
    dcmat.fields.add(new TextField({ name: "material_id", required: true, max: 30 }));
    dcmat.fields.add(new TextField({ name: "material_name", max: 200 }));
    dcmat.fields.add(new TextField({ name: "category", max: 100 }));
    dcmat.fields.add(new TextField({ name: "unit", max: 20 }));
    dcmat.fields.add(new NumberField({ name: "unit_price", min: 0 }));
    dcmat.fields.add(new TextField({ name: "supplier_id", max: 30 }));
    dcmat.fields.add(new TextField({ name: "details" }));
    dcmat.indexes = [
      "CREATE UNIQUE INDEX idx_dcmat_id ON dc_materials (material_id)",
    ];
    app.save(dcmat);
    console.log("[019] Created dc_materials");

    console.log("\n[Migration 019] ✓ All 9 daycare collections created");
  },

  (app) => {
    const collections = [
      "dc_materials", "dc_menu_details", "dc_attendance_checks",
      "dc_farm_health_checks", "dc_health_checks", "dc_attendance",
      "dc_kid_studies", "dc_kids", "dc_families",
    ];
    for (const name of collections) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
        console.log(`[019 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[019 DOWN] ${name} not found`);
      }
    }
  }
);
