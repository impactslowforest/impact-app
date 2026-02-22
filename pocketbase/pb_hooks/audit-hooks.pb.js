/// <reference path="../pb_data/types.d.ts" />

// Collections to audit (add more as needed)
const AUDITED_COLLECTIONS = [
  // RBAC
  "users", "roles", "permissions",
  // Core data
  "cooperatives", "farmers", "farms",
  "training_courses", "farm_inputs", "harvest_records",
  // Slow Farm (Laos)
  "slow_farms", "daycare_records", "wetmill_batches",
  "shade_tree_assessments", "coffee_yield_assessments",
  "workers", "payroll_records",
  // Certification audits
  "ra_audits", "eu_organic_inspections",
  "eu_organic_farm_inspections", "eu_organic_processing_qa",
  // Future (keep for upcoming phases)
  "warehouse_inbound_requests", "warehouse_inventory", "certifications",
];

// === Audit on Create ===
onRecordAfterCreateSuccess((e) => {
  try {
    const authRecord = e.httpContext?.get("authRecord");
    if (!authRecord) return;

    const auditCollection = e.app.findCollectionByNameOrId("audit_trail");
    const record = new Record(auditCollection);
    record.set("user", authRecord.id);
    record.set("collection_name", e.record.collection().name);
    record.set("record_id", e.record.id);
    record.set("action", "create");
    record.set("new_data", e.record.publicExport());
    record.set("ip_address", e.httpContext?.realIP() || "");
    e.app.save(record);
  } catch (err) {
    console.error("[Audit] Error logging create:", err);
  }
}, ...AUDITED_COLLECTIONS);

// === Audit on Update ===
onRecordAfterUpdateSuccess((e) => {
  try {
    const authRecord = e.httpContext?.get("authRecord");
    if (!authRecord) return;

    const auditCollection = e.app.findCollectionByNameOrId("audit_trail");
    const record = new Record(auditCollection);
    record.set("user", authRecord.id);
    record.set("collection_name", e.record.collection().name);
    record.set("record_id", e.record.id);
    record.set("action", "update");
    record.set("old_data", e.record.original().publicExport());
    record.set("new_data", e.record.publicExport());
    record.set("ip_address", e.httpContext?.realIP() || "");
    e.app.save(record);
  } catch (err) {
    console.error("[Audit] Error logging update:", err);
  }
}, ...AUDITED_COLLECTIONS);

// === Audit on Delete ===
onRecordAfterDeleteSuccess((e) => {
  try {
    const authRecord = e.httpContext?.get("authRecord");
    if (!authRecord) return;

    const auditCollection = e.app.findCollectionByNameOrId("audit_trail");
    const record = new Record(auditCollection);
    record.set("user", authRecord.id);
    record.set("collection_name", e.record.collection().name);
    record.set("record_id", e.record.id);
    record.set("action", "delete");
    record.set("old_data", e.record.publicExport());
    record.set("ip_address", e.httpContext?.realIP() || "");
    e.app.save(record);
  } catch (err) {
    console.error("[Audit] Error logging delete:", err);
  }
}, ...AUDITED_COLLECTIONS);
