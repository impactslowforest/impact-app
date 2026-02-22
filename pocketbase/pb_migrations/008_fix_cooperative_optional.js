/// <reference path="../pb_data/types.d.ts" />

// Migration: Make cooperative field optional on farmers collection
// Reason: Only Laos has cooperatives. Indonesia and Vietnam farmers
// are not organized into cooperatives.

migrate(
  (app) => {
    const farmers = app.findCollectionByNameOrId("farmers");
    const fields = farmers.fields;

    // Find the cooperative relation field and make it optional
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === "cooperative") {
        fields[i].required = false;
        break;
      }
    }

    app.save(farmers);
  },
  (app) => {
    const farmers = app.findCollectionByNameOrId("farmers");
    const fields = farmers.fields;

    // Rollback: make cooperative required again
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === "cooperative") {
        fields[i].required = true;
        break;
      }
    }

    app.save(farmers);
  }
);
