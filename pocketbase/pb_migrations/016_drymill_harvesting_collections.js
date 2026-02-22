/// <reference path="../pb_data/types.d.ts" />

// Migration 016: Dry Mill & Harvesting collections (Laos 2024/2025 season)
//
// New collections:
//   1. suppliers              - External supplier master data
//   2. warehouse_lookups      - Reference/dropdown values (Drop WH)
//   3. harvesting_logs        - Per-farm cherry picking + processing records (3,625 rows)
//   4. farmer_log_books       - Aggregated farmer delivery records (78 rows)
//   5. farm_log_books         - Per-farm delivery records (106 rows)
//   6. log_book_details       - Lot-level detail per delivery (140 rows)
//   7. inbound_requests       - Warehouse inbound requests (45 rows)
//   8. outbound_requests      - Warehouse outbound (schema only, no data yet)
//   9. inbound_request_details - Line items per inbound (43 rows)
//  10. inbound_check_details  - 3-bag sampling checks (308 rows)

migrate(
  (app) => {
    const farmers = app.findCollectionByNameOrId("farmers");
    const farms = app.findCollectionByNameOrId("farms");

    const authRule = '@request.auth.id != ""';

    // ================================================================
    // 1. SUPPLIERS
    // ================================================================
    const supplierCol = new Collection({ name: "suppliers", type: "base" });
    app.save(supplierCol);

    const suppliers = app.findCollectionByNameOrId("suppliers");
    suppliers.fields.add(new TextField({ name: "supplier_code", required: true, max: 50 }));
    suppliers.fields.add(new TextField({ name: "source", max: 100 }));
    suppliers.fields.add(new TextField({ name: "company_name", max: 300 }));
    suppliers.fields.add(new TextField({ name: "province", max: 200 }));
    suppliers.fields.add(new TextField({ name: "district", max: 200 }));
    suppliers.fields.add(new TextField({ name: "village", max: 200 }));
    suppliers.fields.add(new TextField({ name: "company_address", max: 500 }));
    suppliers.fields.add(new TextField({ name: "representative_name", max: 200 }));
    suppliers.fields.add(new TextField({ name: "certifications", max: 500 }));
    suppliers.fields.add(new TextField({ name: "main_products", max: 200 }));
    suppliers.fields.add(new TextField({ name: "phone", max: 50 }));
    suppliers.fields.add(new TextField({ name: "email", max: 200 }));
    suppliers.fields.add(new TextField({ name: "website", max: 500 }));
    suppliers.fields.add(new TextField({ name: "processing_methods", max: 300 }));
    suppliers.fields.add(new TextField({ name: "packaging_options", max: 200 }));
    suppliers.fields.add(new TextField({ name: "shipping_methods", max: 100 }));
    suppliers.fields.add(new NumberField({ name: "min_order_quantity_kg", min: 0 }));
    suppliers.fields.add(new TextField({ name: "payment_terms", max: 200 }));
    suppliers.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    suppliers.fields.add(new BoolField({ name: "is_active" }));
    suppliers.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    suppliers.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    suppliers.indexes = [
      "CREATE UNIQUE INDEX idx_supplier_code ON suppliers (supplier_code)",
    ];
    suppliers.listRule = authRule;
    suppliers.viewRule = authRule;
    suppliers.createRule = authRule;
    suppliers.updateRule = authRule;
    suppliers.deleteRule = authRule;
    app.save(suppliers);
    console.log("[Migration 016] Created suppliers collection");

    // ================================================================
    // 2. WAREHOUSE LOOKUPS (Drop WH)
    // ================================================================
    const lookupCol = new Collection({ name: "warehouse_lookups", type: "base" });
    app.save(lookupCol);

    const lookups = app.findCollectionByNameOrId("warehouse_lookups");
    lookups.fields.add(new TextField({ name: "lookup_code", required: true, max: 50 }));
    lookups.fields.add(new TextField({ name: "category", required: true, max: 100 }));
    lookups.fields.add(new TextField({ name: "label", max: 300 }));
    lookups.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    lookups.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    lookups.indexes = [
      "CREATE UNIQUE INDEX idx_lookup_code_cat ON warehouse_lookups (lookup_code, category)",
      "CREATE INDEX idx_lookup_category ON warehouse_lookups (category)",
    ];
    lookups.listRule = authRule;
    lookups.viewRule = authRule;
    lookups.createRule = authRule;
    lookups.updateRule = authRule;
    lookups.deleteRule = authRule;
    app.save(lookups);
    console.log("[Migration 016] Created warehouse_lookups collection");

    // ================================================================
    // 3. HARVESTING LOGS
    // ================================================================
    const hlCol = new Collection({ name: "harvesting_logs", type: "base" });
    app.save(hlCol);

    const hl = app.findCollectionByNameOrId("harvesting_logs");
    hl.fields.add(new TextField({ name: "log_code", required: true, max: 50 }));
    hl.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    hl.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    hl.fields.add(new TextField({ name: "village_code", max: 20 }));
    hl.fields.add(new TextField({ name: "village_name", max: 200 }));
    hl.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    hl.fields.add(new TextField({ name: "farm_name", max: 200 }));
    hl.fields.add(new TextField({ name: "variety", max: 200 }));
    hl.fields.add(new TextField({ name: "species", max: 200 }));
    hl.fields.add(new DateField({ name: "picking_date" }));
    hl.fields.add(new NumberField({ name: "latitude" }));
    hl.fields.add(new NumberField({ name: "longitude" }));
    hl.fields.add(new TextField({ name: "staff_input", max: 50 }));
    hl.fields.add(new DateField({ name: "date_report" }));
    hl.fields.add(new NumberField({ name: "eu_organic_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "fairtrade_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "non_certificate_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "cherry_picked_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "ripe_pulped_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "float_rate_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "fermentation_hours" }));
    hl.fields.add(new DateField({ name: "fermentation_date" }));
    hl.fields.add(new NumberField({ name: "wet_parchment_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "rate_parchment" }));
    hl.fields.add(new NumberField({ name: "dry_parchment_kg", min: 0 }));
    hl.fields.add(new NumberField({ name: "drying_days", min: 0 }));
    hl.fields.add(new DateField({ name: "drying_start_date" }));
    hl.fields.add(new DateField({ name: "drying_end_date" }));
    hl.fields.add(new NumberField({ name: "moisture_pct" }));
    hl.fields.add(new TextField({ name: "stored_at", max: 200 }));
    hl.fields.add(new DateField({ name: "transport_date" }));
    hl.fields.add(new TextField({ name: "remark" }));
    hl.fields.add(new TextField({ name: "status", max: 50 }));
    hl.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    hl.fields.add(new TextField({ name: "season", max: 20 }));
    hl.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    hl.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    hl.indexes = [
      "CREATE UNIQUE INDEX idx_hl_log_code ON harvesting_logs (log_code)",
      "CREATE INDEX idx_hl_farmer ON harvesting_logs (farmer)",
      "CREATE INDEX idx_hl_farm ON harvesting_logs (farm)",
      "CREATE INDEX idx_hl_country ON harvesting_logs (country)",
      "CREATE INDEX idx_hl_season ON harvesting_logs (season)",
    ];
    hl.listRule = authRule;
    hl.viewRule = authRule;
    hl.createRule = authRule;
    hl.updateRule = authRule;
    hl.deleteRule = authRule;
    app.save(hl);
    console.log("[Migration 016] Created harvesting_logs collection");

    // ================================================================
    // 4. FARMER LOG BOOKS
    // ================================================================
    const flbCol = new Collection({ name: "farmer_log_books", type: "base" });
    app.save(flbCol);

    const flb = app.findCollectionByNameOrId("farmer_log_books");
    flb.fields.add(new TextField({ name: "log_code", required: true, max: 50 }));
    flb.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    flb.fields.add(new TextField({ name: "village_code", max: 20 }));
    flb.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    flb.fields.add(new TextField({ name: "variety", max: 200 }));
    flb.fields.add(new TextField({ name: "process", max: 100 }));
    flb.fields.add(new NumberField({ name: "eu_organic_kg", min: 0 }));
    flb.fields.add(new NumberField({ name: "fairtrade_kg", min: 0 }));
    flb.fields.add(new NumberField({ name: "non_certificate_kg", min: 0 }));
    flb.fields.add(new DateField({ name: "log_date" }));
    flb.fields.add(new NumberField({ name: "latitude" }));
    flb.fields.add(new NumberField({ name: "longitude" }));
    flb.fields.add(new TextField({ name: "dry_mill_name", max: 200 }));
    flb.fields.add(new NumberField({ name: "moisture_pct" }));
    flb.fields.add(new NumberField({ name: "aw_level" }));
    flb.fields.add(new NumberField({ name: "number_of_bags", min: 0 }));
    flb.fields.add(new NumberField({ name: "weight_total_kg", min: 0 }));
    flb.fields.add(new DateField({ name: "delivery_date" }));
    flb.fields.add(new TextField({ name: "remark" }));
    flb.fields.add(new TextField({ name: "staff_input", max: 50 }));
    flb.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    flb.fields.add(new TextField({ name: "season", max: 20 }));
    flb.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    flb.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    flb.indexes = [
      "CREATE UNIQUE INDEX idx_flb_log_code ON farmer_log_books (log_code)",
      "CREATE INDEX idx_flb_farmer ON farmer_log_books (farmer)",
      "CREATE INDEX idx_flb_country ON farmer_log_books (country)",
    ];
    flb.listRule = authRule;
    flb.viewRule = authRule;
    flb.createRule = authRule;
    flb.updateRule = authRule;
    flb.deleteRule = authRule;
    app.save(flb);
    console.log("[Migration 016] Created farmer_log_books collection");

    // ================================================================
    // 5. FARM LOG BOOKS
    // ================================================================
    const fmlbCol = new Collection({ name: "farm_log_books", type: "base" });
    app.save(fmlbCol);

    const fmlb = app.findCollectionByNameOrId("farm_log_books");
    fmlb.fields.add(new TextField({ name: "log_code", required: true, max: 50 }));
    fmlb.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    fmlb.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    fmlb.fields.add(new RelationField({ name: "farmer_log_book", collectionId: flb.id, maxSelect: 1 }));
    fmlb.fields.add(new TextField({ name: "village_code", max: 20 }));
    fmlb.fields.add(new TextField({ name: "farm_name", max: 200 }));
    fmlb.fields.add(new TextField({ name: "certificate", max: 300 }));
    fmlb.fields.add(new TextField({ name: "variety", max: 200 }));
    fmlb.fields.add(new TextField({ name: "process", max: 100 }));
    fmlb.fields.add(new DateField({ name: "log_date" }));
    fmlb.fields.add(new NumberField({ name: "latitude" }));
    fmlb.fields.add(new NumberField({ name: "longitude" }));
    fmlb.fields.add(new TextField({ name: "dry_mill_name", max: 200 }));
    fmlb.fields.add(new NumberField({ name: "moisture_pct" }));
    fmlb.fields.add(new NumberField({ name: "aw_level" }));
    fmlb.fields.add(new NumberField({ name: "number_of_bags", min: 0 }));
    fmlb.fields.add(new NumberField({ name: "weight_per_bag_kg", min: 0 }));
    fmlb.fields.add(new NumberField({ name: "weight_total_kg", min: 0 }));
    fmlb.fields.add(new DateField({ name: "delivery_date" }));
    fmlb.fields.add(new TextField({ name: "remark" }));
    fmlb.fields.add(new TextField({ name: "staff_input", max: 50 }));
    fmlb.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    fmlb.fields.add(new TextField({ name: "season", max: 20 }));
    fmlb.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    fmlb.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    fmlb.indexes = [
      "CREATE UNIQUE INDEX idx_fmlb_log_code ON farm_log_books (log_code)",
      "CREATE INDEX idx_fmlb_farm ON farm_log_books (farm)",
      "CREATE INDEX idx_fmlb_farmer ON farm_log_books (farmer)",
    ];
    fmlb.listRule = authRule;
    fmlb.viewRule = authRule;
    fmlb.createRule = authRule;
    fmlb.updateRule = authRule;
    fmlb.deleteRule = authRule;
    app.save(fmlb);
    console.log("[Migration 016] Created farm_log_books collection");

    // ================================================================
    // 6. LOG BOOK DETAILS
    // ================================================================
    const lbdCol = new Collection({ name: "log_book_details", type: "base" });
    app.save(lbdCol);

    const lbd = app.findCollectionByNameOrId("log_book_details");
    lbd.fields.add(new TextField({ name: "lot_code", required: true, max: 50 }));
    lbd.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    lbd.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    lbd.fields.add(new RelationField({ name: "farmer_log_book", collectionId: flb.id, maxSelect: 1 }));
    lbd.fields.add(new RelationField({ name: "farm_log_book", collectionId: fmlb.id, maxSelect: 1 }));
    lbd.fields.add(new TextField({ name: "village_code", max: 20 }));
    lbd.fields.add(new TextField({ name: "farm_name", max: 200 }));
    lbd.fields.add(new TextField({ name: "certificate", max: 300 }));
    lbd.fields.add(new TextField({ name: "variety", max: 200 }));
    lbd.fields.add(new TextField({ name: "process", max: 100 }));
    lbd.fields.add(new DateField({ name: "log_date" }));
    lbd.fields.add(new TextField({ name: "dry_mill_name", max: 200 }));
    lbd.fields.add(new NumberField({ name: "moisture_pct" }));
    lbd.fields.add(new NumberField({ name: "aw_level" }));
    lbd.fields.add(new NumberField({ name: "number_of_bags", min: 0 }));
    lbd.fields.add(new NumberField({ name: "weight_total_kg", min: 0 }));
    lbd.fields.add(new NumberField({ name: "weight_per_bag_kg", min: 0 }));
    lbd.fields.add(new DateField({ name: "delivery_date" }));
    lbd.fields.add(new TextField({ name: "sale_status", max: 50 }));
    lbd.fields.add(new TextField({ name: "remark" }));
    lbd.fields.add(new TextField({ name: "staff_input", max: 50 }));
    lbd.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    lbd.fields.add(new TextField({ name: "season", max: 20 }));
    lbd.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    lbd.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    lbd.indexes = [
      "CREATE UNIQUE INDEX idx_lbd_lot_code ON log_book_details (lot_code)",
      "CREATE INDEX idx_lbd_farm ON log_book_details (farm)",
      "CREATE INDEX idx_lbd_farm_log ON log_book_details (farm_log_book)",
    ];
    lbd.listRule = authRule;
    lbd.viewRule = authRule;
    lbd.createRule = authRule;
    lbd.updateRule = authRule;
    lbd.deleteRule = authRule;
    app.save(lbd);
    console.log("[Migration 016] Created log_book_details collection");

    // ================================================================
    // 7. INBOUND REQUESTS
    // ================================================================
    const irCol = new Collection({ name: "inbound_requests", type: "base" });
    app.save(irCol);

    const ir = app.findCollectionByNameOrId("inbound_requests");
    ir.fields.add(new TextField({ name: "inbound_code", required: true, max: 50 }));
    ir.fields.add(new TextField({ name: "source", max: 100 }));
    ir.fields.add(new TextField({ name: "input_type", max: 100 }));
    ir.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    ir.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    ir.fields.add(new RelationField({ name: "supplier", collectionId: suppliers.id, maxSelect: 1 }));
    ir.fields.add(new TextField({ name: "village_code", max: 20 }));
    ir.fields.add(new TextField({ name: "village_name", max: 200 }));
    ir.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    ir.fields.add(new TextField({ name: "staff", max: 50 }));
    ir.fields.add(new DateField({ name: "request_date" }));
    ir.fields.add(new TextField({ name: "variety", max: 200 }));
    ir.fields.add(new TextField({ name: "process", max: 100 }));
    ir.fields.add(new NumberField({ name: "total_bags", min: 0 }));
    ir.fields.add(new NumberField({ name: "moisture_pct" }));
    ir.fields.add(new NumberField({ name: "weight_total_kg", min: 0 }));
    ir.fields.add(new NumberField({ name: "check_bags", min: 0 }));
    ir.fields.add(new NumberField({ name: "check_moisture_pct" }));
    ir.fields.add(new NumberField({ name: "check_weight_kg", min: 0 }));
    ir.fields.add(new TextField({ name: "requestor_info", max: 500 }));
    ir.fields.add(new TextField({ name: "status", max: 50 }));
    ir.fields.add(new TextField({ name: "vehicle_number", max: 50 }));
    ir.fields.add(new TextField({ name: "approval_status", max: 50 }));
    ir.fields.add(new TextField({ name: "outbound_status", max: 50 }));
    ir.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    ir.fields.add(new TextField({ name: "season", max: 20 }));
    ir.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    ir.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    ir.indexes = [
      "CREATE UNIQUE INDEX idx_ir_inbound_code ON inbound_requests (inbound_code)",
      "CREATE INDEX idx_ir_farm ON inbound_requests (farm)",
      "CREATE INDEX idx_ir_farmer ON inbound_requests (farmer)",
      "CREATE INDEX idx_ir_country ON inbound_requests (country)",
    ];
    ir.listRule = authRule;
    ir.viewRule = authRule;
    ir.createRule = authRule;
    ir.updateRule = authRule;
    ir.deleteRule = authRule;
    app.save(ir);
    console.log("[Migration 016] Created inbound_requests collection");

    // ================================================================
    // 8. OUTBOUND REQUESTS (schema only)
    // ================================================================
    const orCol = new Collection({ name: "outbound_requests", type: "base" });
    app.save(orCol);

    const orr = app.findCollectionByNameOrId("outbound_requests");
    orr.fields.add(new TextField({ name: "outbound_code", required: true, max: 50 }));
    orr.fields.add(new TextField({ name: "source", max: 100 }));
    orr.fields.add(new RelationField({ name: "owner", collectionId: suppliers.id, maxSelect: 1 }));
    orr.fields.add(new RelationField({ name: "inbound_request", collectionId: ir.id, maxSelect: 1 }));
    orr.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    orr.fields.add(new TextField({ name: "bean_type", max: 100 }));
    orr.fields.add(new TextField({ name: "variety", max: 200 }));
    orr.fields.add(new TextField({ name: "process", max: 100 }));
    orr.fields.add(new TextField({ name: "certificate_type", max: 200 }));
    orr.fields.add(new NumberField({ name: "inbound_bags", min: 0 }));
    orr.fields.add(new NumberField({ name: "inbound_quantity_kg", min: 0 }));
    orr.fields.add(new TextField({ name: "season", max: 20 }));
    orr.fields.add(new NumberField({ name: "inbound_moisture_pct" }));
    orr.fields.add(new NumberField({ name: "active_water_level" }));
    orr.fields.add(new TextField({ name: "request_by", max: 200 }));
    orr.fields.add(new TextField({ name: "outbound_zone", max: 200 }));
    orr.fields.add(new DateField({ name: "outbound_date" }));
    orr.fields.add(new TextField({ name: "outbound_type", max: 100 }));
    orr.fields.add(new TextField({ name: "outbound_reason" }));
    orr.fields.add(new NumberField({ name: "outbound_bags", min: 0 }));
    orr.fields.add(new NumberField({ name: "outbound_quantity_kg", min: 0 }));
    orr.fields.add(new NumberField({ name: "outbound_moisture_pct" }));
    orr.fields.add(new NumberField({ name: "outbound_aw_level" }));
    orr.fields.add(new NumberField({ name: "dry_parchment_hulled_kg", min: 0 }));
    orr.fields.add(new NumberField({ name: "green_bean_kg", min: 0 }));
    orr.fields.add(new TextField({ name: "staff", max: 50 }));
    orr.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    orr.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    orr.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    orr.indexes = [
      "CREATE UNIQUE INDEX idx_or_outbound_code ON outbound_requests (outbound_code)",
      "CREATE INDEX idx_or_inbound ON outbound_requests (inbound_request)",
      "CREATE INDEX idx_or_country ON outbound_requests (country)",
    ];
    orr.listRule = authRule;
    orr.viewRule = authRule;
    orr.createRule = authRule;
    orr.updateRule = authRule;
    orr.deleteRule = authRule;
    app.save(orr);
    console.log("[Migration 016] Created outbound_requests collection");

    // ================================================================
    // 9. INBOUND REQUEST DETAILS
    // ================================================================
    const irdCol = new Collection({ name: "inbound_request_details", type: "base" });
    app.save(irdCol);

    const ird = app.findCollectionByNameOrId("inbound_request_details");
    ird.fields.add(new TextField({ name: "detail_code", required: true, max: 60 }));
    ird.fields.add(new RelationField({ name: "inbound_request", collectionId: ir.id, maxSelect: 1 }));
    ird.fields.add(new RelationField({ name: "farmer", collectionId: farmers.id, maxSelect: 1 }));
    ird.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    ird.fields.add(new TextField({ name: "lot_code", max: 50 }));
    ird.fields.add(new TextField({ name: "lot_detail_code", max: 60 }));
    ird.fields.add(new TextField({ name: "staff", max: 50 }));
    ird.fields.add(new DateField({ name: "detail_date" }));
    ird.fields.add(new TextField({ name: "check_result", max: 50 }));
    // Requestor values
    ird.fields.add(new TextField({ name: "re_type", max: 100 }));
    ird.fields.add(new TextField({ name: "re_organic", max: 10 }));
    ird.fields.add(new TextField({ name: "re_fairtrade", max: 10 }));
    ird.fields.add(new NumberField({ name: "re_bags", min: 0 }));
    ird.fields.add(new NumberField({ name: "re_qty_per_bag" }));
    ird.fields.add(new NumberField({ name: "re_total_qty" }));
    ird.fields.add(new TextField({ name: "re_uom", max: 10 }));
    ird.fields.add(new NumberField({ name: "re_moisture_pct" }));
    ird.fields.add(new TextField({ name: "re_aw_level", max: 20 }));
    // Warehouse checked values
    ird.fields.add(new TextField({ name: "wh_type", max: 100 }));
    ird.fields.add(new TextField({ name: "wh_organic", max: 10 }));
    ird.fields.add(new TextField({ name: "wh_fairtrade", max: 10 }));
    ird.fields.add(new NumberField({ name: "wh_bags", min: 0 }));
    ird.fields.add(new NumberField({ name: "wh_qty_per_bag" }));
    ird.fields.add(new NumberField({ name: "wh_total_qty" }));
    ird.fields.add(new TextField({ name: "wh_uom", max: 10 }));
    ird.fields.add(new NumberField({ name: "wh_moisture_pct" }));
    ird.fields.add(new TextField({ name: "wh_aw_level", max: 20 }));
    ird.fields.add(new TextField({ name: "quality_assessment", max: 100 }));
    ird.fields.add(new TextField({ name: "status", max: 50 }));
    ird.fields.add(new TextField({ name: "approval_status", max: 50 }));
    ird.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    ird.fields.add(new TextField({ name: "season", max: 20 }));
    ird.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    ird.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    ird.indexes = [
      "CREATE UNIQUE INDEX idx_ird_detail_code ON inbound_request_details (detail_code)",
      "CREATE INDEX idx_ird_inbound ON inbound_request_details (inbound_request)",
    ];
    ird.listRule = authRule;
    ird.viewRule = authRule;
    ird.createRule = authRule;
    ird.updateRule = authRule;
    ird.deleteRule = authRule;
    app.save(ird);
    console.log("[Migration 016] Created inbound_request_details collection");

    // ================================================================
    // 10. INBOUND CHECK DETAILS (3-bag sampling)
    // ================================================================
    const icdCol = new Collection({ name: "inbound_check_details", type: "base" });
    app.save(icdCol);

    const icd = app.findCollectionByNameOrId("inbound_check_details");
    icd.fields.add(new TextField({ name: "check_code", required: true, max: 80 }));
    icd.fields.add(new RelationField({ name: "inbound_request", collectionId: ir.id, maxSelect: 1 }));
    icd.fields.add(new RelationField({ name: "inbound_detail", collectionId: ird.id, maxSelect: 1 }));
    icd.fields.add(new RelationField({ name: "farm", collectionId: farms.id, maxSelect: 1 }));
    icd.fields.add(new TextField({ name: "lot_detail_code", max: 60 }));
    icd.fields.add(new TextField({ name: "staff", max: 50 }));
    icd.fields.add(new DateField({ name: "check_date" }));
    icd.fields.add(new NumberField({ name: "moisture_pct" }));
    icd.fields.add(new NumberField({ name: "total_bag_weight_kg" }));
    icd.fields.add(new NumberField({ name: "number_of_bags", min: 0 }));
    icd.fields.add(new NumberField({ name: "weight_per_bag_kg" }));
    icd.fields.add(new TextField({ name: "remark" }));
    icd.fields.add(new SelectField({ name: "country", values: ["indonesia", "vietnam", "laos"] }));
    icd.fields.add(new TextField({ name: "season", max: 20 }));
    icd.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    icd.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    icd.indexes = [
      "CREATE UNIQUE INDEX idx_icd_check_code ON inbound_check_details (check_code)",
      "CREATE INDEX idx_icd_inbound ON inbound_check_details (inbound_request)",
      "CREATE INDEX idx_icd_detail ON inbound_check_details (inbound_detail)",
    ];
    icd.listRule = authRule;
    icd.viewRule = authRule;
    icd.createRule = authRule;
    icd.updateRule = authRule;
    icd.deleteRule = authRule;
    app.save(icd);
    console.log("[Migration 016] Created inbound_check_details collection");

    console.log("[Migration 016] ✓ All 10 dry mill / harvesting collections created");
  },

  // DOWN (rollback)
  (app) => {
    const collections = [
      "inbound_check_details",
      "inbound_request_details",
      "outbound_requests",
      "inbound_requests",
      "log_book_details",
      "farm_log_books",
      "farmer_log_books",
      "harvesting_logs",
      "warehouse_lookups",
      "suppliers",
    ];
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name);
        app.delete(col);
        console.log(`[Migration 016 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[Migration 016 DOWN] ${name} not found, skipping`);
      }
    }
  }
);
