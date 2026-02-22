/// <reference path="../pb_data/types.d.ts" />

// Migration: Create EUDR module collections
// - eudr_documents: Reference documents (PDFs, guides)
// - eudr_plots: Plot/farm registration for EUDR assessment
// - eudr_assessments: EUDR compliance assessment per plot

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // === 1. EUDR Documents ===
    const docCol = new Collection({ name: "eudr_documents", type: "base" });
    app.save(docCol);

    const docs = app.findCollectionByNameOrId("eudr_documents");
    docs.fields.add(new TextField({ name: "title", required: true, max: 500 }));
    docs.fields.add(new TextField({ name: "description" }));
    docs.fields.add(new SelectField({
      name: "category",
      required: true,
      values: ["regulation", "guidance", "training", "faq", "checklist", "report", "other"],
    }));
    docs.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["global", "indonesia", "vietnam", "laos"],
    }));
    docs.fields.add(new SelectField({
      name: "language",
      values: ["en", "vi", "lo", "id"],
    }));
    docs.fields.add(new FileField({
      name: "file",
      maxSelect: 1,
      maxSize: 52428800,
      mimeTypes: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
    }));
    docs.fields.add(new TextField({ name: "external_url" }));
    docs.fields.add(new RelationField({ name: "uploaded_by", collectionId: users.id, maxSelect: 1 }));
    docs.fields.add(new BoolField({ name: "is_active" }));
    docs.listRule = '@request.auth.id != ""';
    docs.viewRule = '@request.auth.id != ""';
    docs.createRule = '@request.auth.id != ""';
    docs.updateRule = '@request.auth.id != ""';
    docs.deleteRule = '@request.auth.id != ""';
    app.save(docs);

    // === 2. EUDR Plots ===
    const plotCol = new Collection({ name: "eudr_plots", type: "base" });
    app.save(plotCol);

    const plots = app.findCollectionByNameOrId("eudr_plots");
    plots.fields.add(new TextField({ name: "plot_code", required: true, max: 100 }));
    plots.fields.add(new TextField({ name: "plot_name", required: true, max: 300 }));
    plots.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    plots.fields.add(new TextField({ name: "province" }));
    plots.fields.add(new TextField({ name: "district" }));
    plots.fields.add(new TextField({ name: "village" }));
    plots.fields.add(new TextField({ name: "farmer_name" }));
    plots.fields.add(new TextField({ name: "farmer_id" }));
    plots.fields.add(new SelectField({
      name: "commodity",
      required: true,
      values: ["coffee", "cacao", "other"],
    }));
    plots.fields.add(new NumberField({ name: "area_hectares", min: 0 }));
    plots.fields.add(new NumberField({ name: "latitude" }));
    plots.fields.add(new NumberField({ name: "longitude" }));
    plots.fields.add(new TextField({ name: "polygon_geojson" }));
    plots.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["registered", "assessed", "compliant", "non_compliant", "pending_review"],
    }));
    plots.fields.add(new DateField({ name: "registration_date" }));
    plots.fields.add(new RelationField({ name: "registered_by", collectionId: users.id, maxSelect: 1 }));
    plots.fields.add(new BoolField({ name: "is_active" }));
    plots.indexes = [
      "CREATE UNIQUE INDEX idx_plot_code ON eudr_plots (plot_code)",
      "CREATE INDEX idx_plot_country ON eudr_plots (country)",
      "CREATE INDEX idx_plot_status ON eudr_plots (status)",
    ];
    plots.listRule = '@request.auth.id != ""';
    plots.viewRule = '@request.auth.id != ""';
    plots.createRule = '@request.auth.id != ""';
    plots.updateRule = '@request.auth.id != ""';
    plots.deleteRule = '@request.auth.id != ""';
    app.save(plots);

    // === 3. EUDR Assessments ===
    const assessCol = new Collection({ name: "eudr_assessments", type: "base" });
    app.save(assessCol);

    const assess = app.findCollectionByNameOrId("eudr_assessments");
    assess.fields.add(new RelationField({ name: "plot", required: true, collectionId: plots.id, maxSelect: 1 }));
    assess.fields.add(new DateField({ name: "assessment_date", required: true }));
    assess.fields.add(new RelationField({ name: "assessor", required: true, collectionId: users.id, maxSelect: 1 }));

    // Deforestation criteria
    assess.fields.add(new SelectField({
      name: "deforestation_risk",
      required: true,
      values: ["none", "low", "medium", "high"],
    }));
    assess.fields.add(new BoolField({ name: "no_deforestation_after_dec2020" }));
    assess.fields.add(new BoolField({ name: "no_forest_degradation" }));
    assess.fields.add(new BoolField({ name: "legal_land_use" }));

    // Traceability
    assess.fields.add(new BoolField({ name: "gps_coordinates_available" }));
    assess.fields.add(new BoolField({ name: "polygon_mapping_done" }));
    assess.fields.add(new BoolField({ name: "supply_chain_documented" }));

    // Human rights
    assess.fields.add(new BoolField({ name: "no_forced_labor" }));
    assess.fields.add(new BoolField({ name: "no_child_labor" }));
    assess.fields.add(new BoolField({ name: "indigenous_rights_respected" }));
    assess.fields.add(new BoolField({ name: "land_tenure_documented" }));

    // Environmental
    assess.fields.add(new BoolField({ name: "biodiversity_assessed" }));
    assess.fields.add(new BoolField({ name: "water_protection" }));
    assess.fields.add(new BoolField({ name: "soil_conservation" }));

    // Due diligence
    assess.fields.add(new SelectField({
      name: "overall_compliance",
      required: true,
      values: ["compliant", "non_compliant", "needs_improvement", "pending"],
    }));
    assess.fields.add(new TextField({ name: "notes" }));
    assess.fields.add(new TextField({ name: "corrective_actions" }));
    assess.fields.add(new DateField({ name: "next_review_date" }));
    assess.fields.add(new FileField({
      name: "evidence_photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    assess.fields.add(new FileField({
      name: "supporting_docs",
      maxSelect: 5,
      maxSize: 52428800,
      mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    }));
    assess.indexes = [
      "CREATE INDEX idx_assess_plot ON eudr_assessments (plot)",
      "CREATE INDEX idx_assess_date ON eudr_assessments (assessment_date)",
    ];
    assess.listRule = '@request.auth.id != ""';
    assess.viewRule = '@request.auth.id != ""';
    assess.createRule = '@request.auth.id != ""';
    assess.updateRule = '@request.auth.id != ""';
    assess.deleteRule = '@request.auth.id != ""';
    app.save(assess);
  },
  (app) => {
    try { app.delete(app.findCollectionByNameOrId("eudr_assessments")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eudr_plots")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("eudr_documents")); } catch(e) {}
  }
);
