/// <reference path="../pb_data/types.d.ts" />

// Migration 018: Slow Farm management extended collections
//
// New collections:
//   1. sf_check_rolls         - Daily attendance master records (25,970 rows)
//   2. sf_check_roll_details  - Worker attendance details (25,948 rows)
//   3. sf_payroll             - Payroll batch records
//   4. sf_payroll_details     - Payroll line items per worker
//   5. sf_worker_tasks        - Worker task assignments with rates
//   6. sf_farm_rates          - Farm rate schedule per task
//   7. sf_lookups             - Drop-down values for check rolls

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

    // ================================================================
    // 1. SF_CHECK_ROLLS — Daily attendance master
    // ================================================================
    const cr = createBaseCollection("sf_check_rolls");
    cr.fields.add(new TextField({ name: "check_id", required: true, max: 50 }));
    cr.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    cr.fields.add(new DateField({ name: "check_date" }));
    cr.fields.add(new TextField({ name: "check_by", max: 50 }));
    cr.fields.add(new TextField({ name: "attendance_check", max: 50 }));
    cr.fields.add(new TextField({ name: "notes" }));
    cr.fields.add(new TextField({ name: "status", max: 20 }));
    cr.fields.add(new TextField({ name: "file_path" }));
    cr.indexes = [
      "CREATE UNIQUE INDEX idx_cr_check_id ON sf_check_rolls (check_id)",
      "CREATE INDEX idx_cr_farm ON sf_check_rolls (farm_id_text)",
      "CREATE INDEX idx_cr_date ON sf_check_rolls (check_date)",
    ];
    app.save(cr);
    console.log("[018] Created sf_check_rolls");

    // ================================================================
    // 2. SF_CHECK_ROLL_DETAILS — Per-worker attendance
    // ================================================================
    const crd = createBaseCollection("sf_check_roll_details");
    crd.fields.add(new TextField({ name: "roll_id", required: true, max: 60 }));
    crd.fields.add(new TextField({ name: "check_id_text", max: 50 }));
    crd.fields.add(new DateField({ name: "timestamp" }));
    crd.fields.add(new TextField({ name: "worker_id_text", max: 30 }));
    crd.fields.add(new TextField({ name: "attendance", max: 20 }));
    crd.fields.add(new TextField({ name: "task_id", max: 20 }));
    crd.fields.add(new NumberField({ name: "rate_day", min: 0 }));
    crd.fields.add(new NumberField({ name: "salary_day", min: 0 }));
    crd.fields.add(new TextField({ name: "notes" }));
    crd.fields.add(new TextField({ name: "check_by", max: 50 }));
    crd.indexes = [
      "CREATE UNIQUE INDEX idx_crd_roll_id ON sf_check_roll_details (roll_id)",
      "CREATE INDEX idx_crd_check ON sf_check_roll_details (check_id_text)",
      "CREATE INDEX idx_crd_worker ON sf_check_roll_details (worker_id_text)",
    ];
    app.save(crd);
    console.log("[018] Created sf_check_roll_details");

    // ================================================================
    // 3. SF_PAYROLL — Payroll batch
    // ================================================================
    const sp = createBaseCollection("sf_payroll");
    sp.fields.add(new TextField({ name: "payroll_id", required: true, max: 50 }));
    sp.fields.add(new DateField({ name: "start_date" }));
    sp.fields.add(new DateField({ name: "end_date" }));
    sp.fields.add(new TextField({ name: "farm_name", max: 50 }));
    sp.fields.add(new TextField({ name: "worker_ids" }));
    sp.fields.add(new TextField({ name: "file_path" }));
    sp.indexes = [
      "CREATE UNIQUE INDEX idx_sp_payroll_id ON sf_payroll (payroll_id)",
    ];
    app.save(sp);
    console.log("[018] Created sf_payroll");

    // ================================================================
    // 4. SF_PAYROLL_DETAILS
    // ================================================================
    const spd = createBaseCollection("sf_payroll_details");
    spd.fields.add(new TextField({ name: "detail_id", required: true, max: 60 }));
    spd.fields.add(new TextField({ name: "payroll_id_text", max: 50 }));
    spd.fields.add(new DateField({ name: "start_date" }));
    spd.fields.add(new DateField({ name: "end_date" }));
    spd.fields.add(new TextField({ name: "farm_name", max: 50 }));
    spd.fields.add(new TextField({ name: "worker_id_text", max: 30 }));
    spd.fields.add(new TextField({ name: "task", max: 20 }));
    spd.fields.add(new NumberField({ name: "rate", min: 0 }));
    spd.fields.add(new NumberField({ name: "amount", min: 0 }));
    spd.indexes = [
      "CREATE UNIQUE INDEX idx_spd_detail_id ON sf_payroll_details (detail_id)",
      "CREATE INDEX idx_spd_payroll ON sf_payroll_details (payroll_id_text)",
    ];
    app.save(spd);
    console.log("[018] Created sf_payroll_details");

    // ================================================================
    // 5. SF_WORKER_TASKS — Worker task rate assignments
    // ================================================================
    const wt = createBaseCollection("sf_worker_tasks");
    wt.fields.add(new TextField({ name: "task_detail_id", required: true, max: 60 }));
    wt.fields.add(new TextField({ name: "farm_rate_id", max: 30 }));
    wt.fields.add(new TextField({ name: "worker_id_text", max: 30 }));
    wt.fields.add(new TextField({ name: "task_id", max: 20 }));
    wt.fields.add(new NumberField({ name: "rate", min: 0 }));
    wt.fields.add(new DateField({ name: "active_date" }));
    wt.indexes = [
      "CREATE UNIQUE INDEX idx_wt_id ON sf_worker_tasks (task_detail_id)",
    ];
    app.save(wt);
    console.log("[018] Created sf_worker_tasks");

    // ================================================================
    // 6. SF_FARM_RATES — Rate schedule per task per farm
    // ================================================================
    const fr = createBaseCollection("sf_farm_rates");
    fr.fields.add(new TextField({ name: "rate_id", required: true, max: 30 }));
    fr.fields.add(new TextField({ name: "farm_id_text", max: 20 }));
    fr.fields.add(new TextField({ name: "task_id", max: 20 }));
    fr.fields.add(new NumberField({ name: "rate_value", min: 0 }));
    fr.fields.add(new TextField({ name: "unit", max: 20 }));
    fr.fields.add(new BoolField({ name: "is_active" }));
    fr.fields.add(new DateField({ name: "active_date" }));
    fr.fields.add(new TextField({ name: "apply_to" }));
    fr.indexes = [
      "CREATE UNIQUE INDEX idx_fr_rate_id ON sf_farm_rates (rate_id)",
    ];
    app.save(fr);
    console.log("[018] Created sf_farm_rates");

    // ================================================================
    // 7. SF_LOOKUPS — Reference values
    // ================================================================
    const sl = createBaseCollection("sf_lookups");
    sl.fields.add(new TextField({ name: "lookup_id", required: true, max: 30 }));
    sl.fields.add(new TextField({ name: "category", max: 50 }));
    sl.fields.add(new TextField({ name: "label", max: 200 }));
    sl.fields.add(new NumberField({ name: "value" }));
    sl.fields.add(new TextField({ name: "calculation_method", max: 100 }));
    sl.fields.add(new TextField({ name: "default_unit", max: 50 }));
    sl.fields.add(new TextField({ name: "unit_id", max: 20 }));
    sl.indexes = [
      "CREATE UNIQUE INDEX idx_sl_id ON sf_lookups (lookup_id)",
    ];
    app.save(sl);
    console.log("[018] Created sf_lookups");

    console.log("\n[Migration 018] ✓ All 7 Slow Farm management collections created");
  },

  (app) => {
    const collections = [
      "sf_lookups", "sf_farm_rates", "sf_worker_tasks",
      "sf_payroll_details", "sf_payroll",
      "sf_check_roll_details", "sf_check_rolls",
    ];
    for (const name of collections) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
        console.log(`[018 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[018 DOWN] ${name} not found`);
      }
    }
  }
);
