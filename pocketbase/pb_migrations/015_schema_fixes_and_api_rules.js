/// <reference path="../pb_data/types.d.ts" />

// Migration 015: Schema fixes + API rules for RBAC enforcement
// 1. Add qr_code field to farms
// 2. Apply country-scoped API rules to ALL data collections
// 3. Lock down RBAC management collections
// 4. Lock down audit_trail (hooks-only writes)
// 5. Chatbot: own records only

migrate(
  (app) => {
    // ============================================================
    // 1. SCHEMA FIX: Add qr_code to farms
    // ============================================================
    const farms = app.findCollectionByNameOrId("farms");
    farms.fields.add(new TextField({ name: "qr_code", max: 200 }));
    app.save(farms);
    console.log("[Migration 015] Added qr_code field to farms");

    // ============================================================
    // 2. COUNTRY-SCOPED RULES
    //    Collections with a "country" field:
    //    - Users see only their own country's data
    //    - Global users and superadmin see everything
    // ============================================================
    const COUNTRY_SCOPED = [
      "cooperatives", "farmers", "farms", "training_courses",
      "farm_inputs", "harvest_records", "farmer_annual_data",
      "farm_environment_assessments", "ghg_emissions",
      "ecosystem_assessments", "compliance_records",
      "eudr_documents", "eudr_plots",
      "eu_organic_inspections", "farm_crop_estimations",
      "ra_audits",
    ];

    const countryListView =
      '@request.auth.id != "" && (' +
        'country = @request.auth.country || ' +
        '@request.auth.country = "global" || ' +
        '@request.auth.role.name = "superadmin"' +
      ')';

    const countryCreate =
      '@request.auth.id != "" && (' +
        '@request.body.country = @request.auth.country || ' +
        '@request.auth.country = "global" || ' +
        '@request.auth.role.name = "superadmin"' +
      ')';

    const countryDelete =
      '@request.auth.id != "" && (' +
        '@request.auth.country = "global" || ' +
        '@request.auth.role.name = "superadmin"' +
      ')';

    COUNTRY_SCOPED.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule = countryListView;
        col.viewRule = countryListView;
        col.createRule = countryCreate;
        col.updateRule = countryListView;
        col.deleteRule = countryDelete;
        app.save(col);
        console.log(`[Migration 015] Applied country-scoped rules to: ${name}`);
      } catch (e) {
        console.warn(`[Migration 015] Collection "${name}" not found, skipping.`);
      }
    });

    // ============================================================
    // 3. LAOS-ONLY COLLECTIONS (Slow Farm ecosystem)
    // ============================================================
    const LAOS_ONLY = [
      "slow_farms", "daycare_records", "wetmill_batches",
      "shade_tree_assessments", "coffee_yield_assessments",
      "workers", "payroll_records",
    ];

    const laosAccess =
      '@request.auth.id != "" && (' +
        '@request.auth.country = "laos" || ' +
        '@request.auth.country = "global" || ' +
        '@request.auth.role.name = "superadmin"' +
      ')';

    const laosDelete =
      '@request.auth.id != "" && (' +
        '@request.auth.country = "global" || ' +
        '@request.auth.role.name = "superadmin"' +
      ')';

    LAOS_ONLY.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule = laosAccess;
        col.viewRule = laosAccess;
        col.createRule = laosAccess;
        col.updateRule = laosAccess;
        col.deleteRule = laosDelete;
        app.save(col);
        console.log(`[Migration 015] Applied Laos-only rules to: ${name}`);
      } catch (e) {
        console.warn(`[Migration 015] Collection "${name}" not found, skipping.`);
      }
    });

    // ============================================================
    // 4. CHILD COLLECTIONS (no country field, linked to parent)
    // ============================================================
    const CHILD_COLLECTIONS = [
      "eudr_assessments",
      "eu_organic_farm_inspections",
      "eu_organic_processing_qa",
    ];

    const authOnly = '@request.auth.id != ""';

    CHILD_COLLECTIONS.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule = authOnly;
        col.viewRule = authOnly;
        col.createRule = authOnly;
        col.updateRule = authOnly;
        col.deleteRule = countryDelete;
        app.save(col);
        console.log(`[Migration 015] Applied child rules to: ${name}`);
      } catch (e) {
        console.warn(`[Migration 015] Collection "${name}" not found, skipping.`);
      }
    });

    // ============================================================
    // 5. RBAC MANAGEMENT COLLECTIONS (read for all, write for admin)
    // ============================================================
    const ADMIN_MANAGED = ["roles", "permissions", "module_registry"];
    const adminWrite = '@request.auth.role.name = "superadmin"';

    ADMIN_MANAGED.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule = authOnly;
        col.viewRule = authOnly;
        col.createRule = adminWrite;
        col.updateRule = adminWrite;
        col.deleteRule = adminWrite;
        app.save(col);
        console.log(`[Migration 015] Applied admin-only write rules to: ${name}`);
      } catch (e) {
        console.warn(`[Migration 015] Collection "${name}" not found, skipping.`);
      }
    });

    // ============================================================
    // 6. REFERENCE COLLECTION (EU Organic Standards)
    // ============================================================
    try {
      const euStandards = app.findCollectionByNameOrId("eu_organic_standards");
      euStandards.listRule = authOnly;
      euStandards.viewRule = authOnly;
      euStandards.createRule = adminWrite;
      euStandards.updateRule = adminWrite;
      euStandards.deleteRule = adminWrite;
      app.save(euStandards);
      console.log("[Migration 015] Applied reference rules to: eu_organic_standards");
    } catch (e) {
      console.warn("[Migration 015] eu_organic_standards not found, skipping.");
    }

    // ============================================================
    // 7. AUDIT TRAIL (system-only writes via hooks)
    // ============================================================
    try {
      const audit = app.findCollectionByNameOrId("audit_trail");
      audit.listRule = authOnly;
      audit.viewRule = authOnly;
      audit.createRule = null;  // Only hooks can create (bypasses API rules)
      audit.updateRule = null;  // Never update
      audit.deleteRule = null;  // Never delete
      app.save(audit);
      console.log("[Migration 015] Applied audit-trail rules (hooks-only writes)");
    } catch (e) {
      console.warn("[Migration 015] audit_trail not found, skipping.");
    }

    // ============================================================
    // 8. CHATBOT CONVERSATIONS (own records only)
    // ============================================================
    try {
      const chat = app.findCollectionByNameOrId("chatbot_conversations");
      chat.listRule = '@request.auth.id != "" && user = @request.auth.id';
      chat.viewRule = '@request.auth.id != "" && user = @request.auth.id';
      chat.createRule = authOnly;
      chat.updateRule = '@request.auth.id != "" && user = @request.auth.id';
      chat.deleteRule = '@request.auth.id != "" && user = @request.auth.id';
      app.save(chat);
      console.log("[Migration 015] Applied own-record rules to: chatbot_conversations");
    } catch (e) {
      console.warn("[Migration 015] chatbot_conversations not found, skipping.");
    }

    // ============================================================
    // 9. USERS COLLECTION (special auth collection)
    // ============================================================
    const users = app.findCollectionByNameOrId("users");
    users.listRule = authOnly;
    users.viewRule = authOnly;
    users.createRule = '';  // Empty string = allow unauthenticated (self-registration)
    users.updateRule = 'id = @request.auth.id || @request.auth.role.name = "superadmin"';
    users.deleteRule = '@request.auth.role.name = "superadmin"';
    app.save(users);
    console.log("[Migration 015] Applied user rules to: users");

    console.log("[Migration 015] All schema fixes and API rules applied successfully.");
  },
  (app) => {
    // ============================================================
    // ROLLBACK: Revert all rules to permissive (any authenticated)
    // ============================================================
    const permissive = '@request.auth.id != ""';

    const allCollections = [
      "cooperatives", "farmers", "farms", "training_courses",
      "farm_inputs", "harvest_records", "farmer_annual_data",
      "farm_environment_assessments", "ghg_emissions",
      "ecosystem_assessments", "compliance_records",
      "eudr_documents", "eudr_plots", "eudr_assessments",
      "eu_organic_inspections", "eu_organic_farm_inspections",
      "eu_organic_processing_qa", "farm_crop_estimations",
      "ra_audits", "slow_farms", "daycare_records",
      "wetmill_batches", "shade_tree_assessments",
      "coffee_yield_assessments", "workers", "payroll_records",
      "roles", "permissions", "module_registry",
      "eu_organic_standards", "chatbot_conversations",
    ];

    allCollections.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule = permissive;
        col.viewRule = permissive;
        col.createRule = permissive;
        col.updateRule = permissive;
        col.deleteRule = permissive;
        app.save(col);
      } catch (e) {}
    });

    // Revert audit_trail
    try {
      const audit = app.findCollectionByNameOrId("audit_trail");
      audit.listRule = permissive;
      audit.viewRule = permissive;
      audit.createRule = permissive;
      audit.updateRule = permissive;
      audit.deleteRule = permissive;
      app.save(audit);
    } catch (e) {}

    // Revert users
    try {
      const users = app.findCollectionByNameOrId("users");
      users.listRule = permissive;
      users.viewRule = permissive;
      users.createRule = permissive;
      users.updateRule = permissive;
      users.deleteRule = permissive;
      app.save(users);
    } catch (e) {}

    // Remove qr_code from farms
    try {
      const farms = app.findCollectionByNameOrId("farms");
      const qrField = farms.fields.getByName("qr_code");
      if (qrField) {
        farms.fields.removeById(qrField.id);
        app.save(farms);
      }
    } catch (e) {}

    console.log("[Migration 015] Rollback complete: all rules reverted to permissive.");
  }
);
