/// <reference path="../pb_data/types.d.ts" />

// Migration 020: Indonesia Cocoa purchase collections
//
// New collections:
//   1. id_farmer_groups     - Farmer cooperatives/groups (5 rows)
//   2. id_cocoa_batches     - Purchase batches (8 rows)
//   3. id_cocoa_batch_logs  - Batch log entries (18 rows)
//   4. id_cocoa_batch_details - Batch detail per farm (27 rows)
//   5. id_cocoa_prices      - Price history (13 rows)
//   6. id_cocoa_recaps      - Annual recap per farm (317 rows)
//   7. id_cocoa_lookups     - Dropdown/reference data (29 rows)
//   8. id_farmer_contracts  - Farmer supply contracts (173 rows)
//
// Also imports into existing: farmers (275 rows), farms (319 rows)

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

    // 1. ID_FARMER_GROUPS
    const fg = createBaseCollection("id_farmer_groups");
    fg.fields.add(new TextField({ name: "group_id", required: true, max: 30 }));
    fg.fields.add(new TextField({ name: "group_name", max: 200 }));
    fg.fields.add(new TextField({ name: "staff_id", max: 20 }));
    fg.fields.add(new TextField({ name: "coordinator_id", max: 20 }));
    fg.fields.add(new NumberField({ name: "total_area_ha" }));
    fg.fields.add(new NumberField({ name: "total_value_kg" }));
    fg.fields.add(new NumberField({ name: "num_farmers", min: 0 }));
    fg.fields.add(new NumberField({ name: "num_farms", min: 0 }));
    fg.fields.add(new TextField({ name: "address" }));
    fg.indexes = [
      'CREATE UNIQUE INDEX idx_idfg_id ON id_farmer_groups (group_id)',
    ];
    app.save(fg);
    console.log("[020] Created id_farmer_groups");

    // 2. ID_COCOA_BATCHES
    const cb = createBaseCollection("id_cocoa_batches");
    cb.fields.add(new TextField({ name: "batch_id", required: true, max: 50 }));
    cb.fields.add(new TextField({ name: "staff_id", max: 20 }));
    cb.fields.add(new DateField({ name: "batch_date" }));
    cb.fields.add(new TextField({ name: "farmer_group_id", max: 30 }));
    cb.fields.add(new TextField({ name: "coordinator_id", max: 20 }));
    cb.fields.add(new NumberField({ name: "total_wet_beans_kg" }));
    cb.fields.add(new NumberField({ name: "total_wet_bean_price" }));
    cb.fields.add(new TextField({ name: "product_type", max: 20 }));
    cb.indexes = [
      'CREATE UNIQUE INDEX idx_idcb_id ON id_cocoa_batches (batch_id)',
    ];
    app.save(cb);
    console.log("[020] Created id_cocoa_batches");

    // 3. ID_COCOA_BATCH_LOGS
    const bl = createBaseCollection("id_cocoa_batch_logs");
    bl.fields.add(new TextField({ name: "batchlog_id", required: true, max: 60 }));
    bl.fields.add(new TextField({ name: "batch_id", max: 50 }));
    bl.fields.add(new TextField({ name: "staff_id", max: 20 }));
    bl.fields.add(new DateField({ name: "log_date" }));
    bl.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    bl.fields.add(new NumberField({ name: "total_wet_beans_kg" }));
    bl.fields.add(new NumberField({ name: "estimated_dry_beans_kg" }));
    bl.fields.add(new NumberField({ name: "total_wet_bean_price" }));
    bl.fields.add(new NumberField({ name: "debit_idr" }));
    bl.fields.add(new TextField({ name: "item_description" }));
    bl.fields.add(new TextField({ name: "payment_due", max: 50 }));
    bl.fields.add(new NumberField({ name: "fermentation_days" }));
    bl.fields.add(new NumberField({ name: "drying_days" }));
    bl.fields.add(new NumberField({ name: "packing_days" }));
    bl.fields.add(new NumberField({ name: "shipping_days" }));
    bl.fields.add(new NumberField({ name: "other_days" }));
    bl.fields.add(new NumberField({ name: "total_days" }));
    bl.fields.add(new NumberField({ name: "dry_beans_kg" }));
    bl.indexes = [
      'CREATE UNIQUE INDEX idx_idbl_id ON id_cocoa_batch_logs (batchlog_id)',
      'CREATE INDEX idx_idbl_batch ON id_cocoa_batch_logs (batch_id)',
    ];
    app.save(bl);
    console.log("[020] Created id_cocoa_batch_logs");

    // 4. ID_COCOA_BATCH_DETAILS
    const bd = createBaseCollection("id_cocoa_batch_details");
    bd.fields.add(new TextField({ name: "batch_detail_id", required: true, max: 60 }));
    bd.fields.add(new TextField({ name: "batchlog_id", max: 60 }));
    bd.fields.add(new TextField({ name: "staff_id", max: 20 }));
    bd.fields.add(new DateField({ name: "detail_date" }));
    bd.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    bd.fields.add(new TextField({ name: "cocoa_clone", max: 50 }));
    bd.fields.add(new TextField({ name: "certificate_detail", max: 50 }));
    bd.fields.add(new NumberField({ name: "wet_beans_kg" }));
    bd.fields.add(new NumberField({ name: "bean_price_per_kg" }));
    bd.fields.add(new NumberField({ name: "premium_price" }));
    bd.fields.add(new NumberField({ name: "total_wet_bean_amount" }));
    bd.fields.add(new NumberField({ name: "total_premium_amount" }));
    bd.fields.add(new TextField({ name: "price_id", max: 50 }));
    bd.indexes = [
      'CREATE UNIQUE INDEX idx_idbd_id ON id_cocoa_batch_details (batch_detail_id)',
      'CREATE INDEX idx_idbd_log ON id_cocoa_batch_details (batchlog_id)',
    ];
    app.save(bd);
    console.log("[020] Created id_cocoa_batch_details");

    // 5. ID_COCOA_PRICES
    const cp = createBaseCollection("id_cocoa_prices");
    cp.fields.add(new TextField({ name: "price_id", required: true, max: 50 }));
    cp.fields.add(new TextField({ name: "coordinator_id", max: 20 }));
    cp.fields.add(new DateField({ name: "price_date" }));
    cp.fields.add(new NumberField({ name: "wb_price_clonal" }));
    cp.fields.add(new NumberField({ name: "wb_price_local" }));
    cp.fields.add(new NumberField({ name: "wb_price_mix" }));
    cp.fields.add(new NumberField({ name: "local_db_price_clonal" }));
    cp.fields.add(new NumberField({ name: "local_db_price_local" }));
    cp.fields.add(new NumberField({ name: "local_db_price_mix" }));
    cp.fields.add(new NumberField({ name: "est_db_price_clonal" }));
    cp.fields.add(new NumberField({ name: "est_db_price_local" }));
    cp.fields.add(new NumberField({ name: "est_db_price_mix" }));
    cp.fields.add(new NumberField({ name: "est_premium_clonal" }));
    cp.fields.add(new NumberField({ name: "est_premium_local" }));
    cp.fields.add(new NumberField({ name: "est_premium_mix" }));
    cp.indexes = [
      'CREATE UNIQUE INDEX idx_idcp_id ON id_cocoa_prices (price_id)',
    ];
    app.save(cp);
    console.log("[020] Created id_cocoa_prices");

    // 6. ID_COCOA_RECAPS
    const cr = createBaseCollection("id_cocoa_recaps");
    cr.fields.add(new TextField({ name: "farm_id_text", required: true, max: 50 }));
    cr.fields.add(new NumberField({ name: "sold_to_krakakoa" }));
    cr.fields.add(new NumberField({ name: "sold_to_others" }));
    cr.fields.add(new NumberField({ name: "quota" }));
    cr.fields.add(new NumberField({ name: "remaining" }));
    cr.fields.add(new NumberField({ name: "historical_total_premium" }));
    cr.fields.add(new TextField({ name: "remarks" }));
    cr.indexes = [
      'CREATE UNIQUE INDEX idx_idcr_farm ON id_cocoa_recaps (farm_id_text)',
    ];
    app.save(cr);
    console.log("[020] Created id_cocoa_recaps");

    // 7. ID_COCOA_LOOKUPS
    const cl = createBaseCollection("id_cocoa_lookups");
    cl.fields.add(new TextField({ name: "drop_id", required: true, max: 30 }));
    cl.fields.add(new TextField({ name: "drop_condition", max: 100 }));
    cl.fields.add(new TextField({ name: "drop_label", max: 200 }));
    cl.fields.add(new TextField({ name: "notes" }));
    cl.indexes = [
      'CREATE UNIQUE INDEX idx_idcl_id ON id_cocoa_lookups (drop_id)',
    ];
    app.save(cl);
    console.log("[020] Created id_cocoa_lookups");

    // 8. ID_FARMER_CONTRACTS
    const fc = createBaseCollection("id_farmer_contracts");
    fc.fields.add(new TextField({ name: "contract_id", required: true, max: 80 }));
    fc.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    fc.fields.add(new TextField({ name: "staff_id", max: 20 }));
    fc.fields.add(new DateField({ name: "contract_date" }));
    fc.fields.add(new TextField({ name: "province", max: 100 }));
    fc.fields.add(new TextField({ name: "district", max: 100 }));
    fc.fields.add(new TextField({ name: "commune", max: 100 }));
    fc.fields.add(new TextField({ name: "village", max: 100 }));
    fc.fields.add(new TextField({ name: "village_id", max: 50 }));
    fc.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    fc.fields.add(new TextField({ name: "gender", max: 20 }));
    fc.fields.add(new TextField({ name: "id_number", max: 30 }));
    fc.fields.add(new TextField({ name: "farmer_address" }));
    fc.fields.add(new TextField({ name: "contact_number", max: 30 }));
    fc.fields.add(new TextField({ name: "group_name", max: 100 }));
    fc.indexes = [
      'CREATE UNIQUE INDEX idx_idfc_id ON id_farmer_contracts (contract_id)',
      'CREATE INDEX idx_idfc_farmer ON id_farmer_contracts (farmer_id_text)',
    ];
    app.save(fc);
    console.log("[020] Created id_farmer_contracts");

    console.log("\n[Migration 020] ✓ All 8 Indonesia cocoa collections created");
  },

  (app) => {
    const collections = [
      "id_farmer_contracts", "id_cocoa_lookups", "id_cocoa_recaps",
      "id_cocoa_prices", "id_cocoa_batch_details", "id_cocoa_batch_logs",
      "id_cocoa_batches", "id_farmer_groups",
    ];
    for (const name of collections) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
        console.log(`[020 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[020 DOWN] ${name} not found`);
      }
    }
  }
);
