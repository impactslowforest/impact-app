/// <reference path="../pb_data/types.d.ts" />

// Migration: Create Rainforest Alliance (RA) audit collection
// The UI for RA internal audits exists (InternalAuditForm.tsx) but data
// was not persisted to any database collection. This migration creates
// the `ra_audits` collection to store RA certification audit records.

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // ================================================================
    // RA AUDITS
    // ================================================================
    const col = new Collection({ name: "ra_audits", type: "base" });
    app.save(col);

    const raAudits = app.findCollectionByNameOrId("ra_audits");

    raAudits.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    raAudits.fields.add(new DateField({ name: "audit_date", required: true }));
    raAudits.fields.add(new TextField({ name: "auditor_name", required: true, max: 200 }));
    raAudits.fields.add(new TextField({ name: "audit_location", max: 500 }));
    raAudits.fields.add(new JSONField({ name: "check_values" }));
    raAudits.fields.add(new JSONField({ name: "item_notes" }));
    raAudits.fields.add(new JSONField({ name: "section_notes" }));
    raAudits.fields.add(new SelectField({
      name: "overall_result",
      values: ["pass", "fail", "conditional", "pending"],
    }));
    raAudits.fields.add(new TextField({ name: "overall_notes" }));
    raAudits.fields.add(new TextField({ name: "corrective_actions" }));
    raAudits.fields.add(new DateField({ name: "next_audit_date" }));
    raAudits.fields.add(new RelationField({
      name: "assessed_by",
      collectionId: users.id,
      maxSelect: 1,
    }));
    raAudits.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    raAudits.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));

    raAudits.indexes = [
      "CREATE INDEX idx_ra_audit_country ON ra_audits (country)",
      "CREATE INDEX idx_ra_audit_date ON ra_audits (audit_date)",
    ];
    raAudits.listRule = '@request.auth.id != ""';
    raAudits.viewRule = '@request.auth.id != ""';
    raAudits.createRule = '@request.auth.id != ""';
    raAudits.updateRule = '@request.auth.id != ""';
    raAudits.deleteRule = '@request.auth.id != ""';
    app.save(raAudits);
  },
  (app) => {
    const col = app.findCollectionByNameOrId("ra_audits");
    app.delete(col);
  }
);
