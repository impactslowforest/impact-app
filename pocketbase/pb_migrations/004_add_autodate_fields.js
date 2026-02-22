/// <reference path="../pb_data/types.d.ts" />

// Migration: Add created/updated autodate fields to EUDR collections
// Fix: sort by -created was failing because these fields were missing

migrate(
  (app) => {
    // Add to eudr_plots
    const plots = app.findCollectionByNameOrId("eudr_plots");
    plots.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    plots.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    app.save(plots);

    // Add to eudr_documents
    const docs = app.findCollectionByNameOrId("eudr_documents");
    docs.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    docs.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    app.save(docs);

    // Add to eudr_assessments
    const assessments = app.findCollectionByNameOrId("eudr_assessments");
    assessments.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    assessments.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    app.save(assessments);
  },
  (app) => {
    // Revert: remove autodate fields
    const names = ["eudr_plots", "eudr_documents", "eudr_assessments"];
    for (const name of names) {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.fields.removeByName("created");
        col.fields.removeByName("updated");
        app.save(col);
      } catch (e) {}
    }
  }
);
