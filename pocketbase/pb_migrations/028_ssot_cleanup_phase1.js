/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 028: SSOT Cleanup Phase 1
 *
 * Remove redundant TEXT name fields from collections that already have
 * proper PocketBase Relation fields. Use `expand` in API queries to
 * resolve names at query time instead of storing duplicate copies.
 *
 * === GROUP A: Warehouse tables (what migration 027 intended) ===
 *
 *   farmer_log_books:
 *     - farmer_name  → expand farmer → farmers.full_name
 *
 *   harvesting_logs:
 *     - farmer_name  → expand farmer → farmers.full_name
 *     - village_name → expand farm   → farms.village
 *
 *   inbound_requests:
 *     - farmer_name  → expand farmer → farmers.full_name
 *     - village_name → expand farm   → farms.village
 *     - company_name → expand supplier → suppliers.company_name
 *
 * === GROUP B: Certification/Audit tables ===
 *
 *   eu_organic_inspections:
 *     - inspector_name  → expand inspector → users.name
 *
 * === GROUP C: Slow Farm / Operations tables ===
 *
 *   slow_farms:
 *     - manager_name → expand manager_user → users.name
 *
 *   wetmill_batches:
 *     - source_name → expand source_cooperative/source_farmer
 *
 *   training_courses:
 *     - trainer_name → expand conducted_by → users.name
 *
 *   ra_audits:
 *     - auditor_name → expand assessed_by → users.name
 *
 * Total: 12 redundant fields removed
 */

migrate(
  (app) => {
    const safeRemove = (collectionName, fieldName) => {
      try {
        const col = app.findCollectionByNameOrId(collectionName);
        const field = col.fields.getByName(fieldName);
        if (field) {
          col.fields.removeByName(fieldName);
          app.save(col);
          console.log(`[028] ${collectionName}: removed ${fieldName}`);
        } else {
          console.log(`[028] ${collectionName}: ${fieldName} already absent, skipping`);
        }
      } catch (e) {
        console.log(`[028] ${collectionName}: error removing ${fieldName} — ${e.message}`);
      }
    };

    // GROUP A: Warehouse
    safeRemove("farmer_log_books", "farmer_name");
    safeRemove("harvesting_logs", "farmer_name");
    safeRemove("harvesting_logs", "village_name");
    safeRemove("inbound_requests", "farmer_name");
    safeRemove("inbound_requests", "village_name");
    safeRemove("inbound_requests", "company_name");

    // GROUP B: Certification
    safeRemove("eu_organic_inspections", "inspector_name");

    // GROUP C: SlowFarm / Operations
    safeRemove("slow_farms", "manager_name");
    safeRemove("wetmill_batches", "source_name");
    safeRemove("training_courses", "trainer_name");
    safeRemove("ra_audits", "auditor_name");

    console.log("[028] SSOT Phase 1 complete — 11 redundant name fields removed");
  },

  // ROLLBACK: re-add removed fields (data will be lost)
  (app) => {
    const safeAdd = (collectionName, fieldName, maxLen) => {
      try {
        const col = app.findCollectionByNameOrId(collectionName);
        col.fields.add(new TextField({ name: fieldName, max: maxLen || 200 }));
        app.save(col);
      } catch (e) {
        console.log(`[028 DOWN] ${collectionName}: error re-adding ${fieldName} — ${e.message}`);
      }
    };

    safeAdd("farmer_log_books", "farmer_name", 200);
    safeAdd("harvesting_logs", "farmer_name", 200);
    safeAdd("harvesting_logs", "village_name", 200);
    safeAdd("inbound_requests", "farmer_name", 200);
    safeAdd("inbound_requests", "village_name", 200);
    safeAdd("inbound_requests", "company_name", 200);
    safeAdd("eu_organic_inspections", "inspector_name", 200);
    safeAdd("slow_farms", "manager_name", 200);
    safeAdd("wetmill_batches", "source_name", 200);
    safeAdd("training_courses", "trainer_name", 200);
    safeAdd("ra_audits", "auditor_name", 200);

    console.log("[028 DOWN] Rollback — re-added 11 fields (data lost)");
  }
);
