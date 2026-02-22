/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 027: Normalize redundant text fields
 *
 * Removes denormalized text copies that can be obtained via PocketBase `expand`:
 *
 *   farmer_log_books:  farmer_name       → expand farmer → farmers.full_name
 *   farm_log_books:    farm_name         → expand farm   → farms.farm_name
 *   harvesting_logs:   farmer_name       → expand farmer → farmers.full_name
 *   harvesting_logs:   farm_name         → expand farm   → farms.farm_name
 *   harvesting_logs:   village_name      → expand farm   → farms.village
 *   log_book_details:  farm_name         → expand farm   → farms.farm_name
 *   inbound_requests:  farmer_name       → expand farmer → farmers.full_name
 *   inbound_requests:  farmer_code       → expand farmer → farmers.farmer_code
 *   inbound_requests:  farm_code         → expand farm   → farms.farm_code
 *   inbound_requests:  village_name      → expand farm   → farms.village
 *
 * Fields KEPT (still needed):
 *   - village_code (no master villages table yet)
 *   - company_name (supplier relation TBD)
 *   - staff / staff_input (text→relation conversion TBD)
 *   - country, season (filtering / indexing)
 *   - All aggregated fields (maintained by hooks)
 */

migrate(
  (app) => {
    // 1. farmer_log_books: remove farmer_name
    const flb = app.findCollectionByNameOrId("farmer_log_books");
    flb.fields.removeByName("farmer_name");
    app.save(flb);
    console.log("[027] farmer_log_books: removed farmer_name");

    // 2. farm_log_books: remove farm_name
    const fmlb = app.findCollectionByNameOrId("farm_log_books");
    fmlb.fields.removeByName("farm_name");
    app.save(fmlb);
    console.log("[027] farm_log_books: removed farm_name");

    // 3. harvesting_logs: remove farmer_name, farm_name, village_name
    const hl = app.findCollectionByNameOrId("harvesting_logs");
    hl.fields.removeByName("farmer_name");
    hl.fields.removeByName("farm_name");
    hl.fields.removeByName("village_name");
    app.save(hl);
    console.log("[027] harvesting_logs: removed farmer_name, farm_name, village_name");

    // 4. log_book_details: remove farm_name
    const lbd = app.findCollectionByNameOrId("log_book_details");
    lbd.fields.removeByName("farm_name");
    app.save(lbd);
    console.log("[027] log_book_details: removed farm_name");

    // 5. inbound_requests: remove farmer_name, farmer_code, farm_code, village_name
    const ir = app.findCollectionByNameOrId("inbound_requests");
    ir.fields.removeByName("farmer_name");
    ir.fields.removeByName("farmer_code");
    ir.fields.removeByName("farm_code");
    ir.fields.removeByName("village_name");
    app.save(ir);
    console.log("[027] inbound_requests: removed farmer_name, farmer_code, farm_code, village_name");

    console.log("[027] Normalization complete — 10 redundant fields removed");
  },

  // ROLLBACK: re-add the removed fields
  (app) => {
    const flb = app.findCollectionByNameOrId("farmer_log_books");
    flb.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    app.save(flb);

    const fmlb = app.findCollectionByNameOrId("farm_log_books");
    fmlb.fields.add(new TextField({ name: "farm_name", max: 200 }));
    app.save(fmlb);

    const hl = app.findCollectionByNameOrId("harvesting_logs");
    hl.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    hl.fields.add(new TextField({ name: "farm_name", max: 200 }));
    hl.fields.add(new TextField({ name: "village_name", max: 200 }));
    app.save(hl);

    const lbd = app.findCollectionByNameOrId("log_book_details");
    lbd.fields.add(new TextField({ name: "farm_name", max: 200 }));
    app.save(lbd);

    const ir = app.findCollectionByNameOrId("inbound_requests");
    ir.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    ir.fields.add(new TextField({ name: "farmer_code", max: 50 }));
    ir.fields.add(new TextField({ name: "farm_code", max: 50 }));
    ir.fields.add(new TextField({ name: "village_name", max: 200 }));
    app.save(ir);

    console.log("[027 DOWN] Rollback — re-added 10 fields (data lost)");
  }
);
