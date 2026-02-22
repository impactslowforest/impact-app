/// <reference path="../pb_data/types.d.ts" />

// Migration 026: Add farm_log_book relation to harvesting_logs
//
// Completes the hierarchy chain:
//   farmer_log_books → farm_log_books → harvesting_logs → log_book_details
//
// The harvesting_logs collection was missing a link back to farm_log_books.
// This field is optional to preserve existing 3625 records.

migrate(
  (app) => {
    const hl = app.findCollectionByNameOrId("harvesting_logs");
    const fmlb = app.findCollectionByNameOrId("farm_log_books");

    // Add farm_log_book relation (optional, single)
    hl.fields.add(new RelationField({
      name: "farm_log_book",
      collectionId: fmlb.id,
      maxSelect: 1,
    }));

    // Add index for efficient lookups
    hl.indexes = [
      ...hl.indexes,
      "CREATE INDEX idx_hl_farm_log ON harvesting_logs (farm_log_book)",
    ];

    app.save(hl);
    console.log("[Migration 026] Added farm_log_book relation to harvesting_logs");
  },

  // DOWN (rollback)
  (app) => {
    const hl = app.findCollectionByNameOrId("harvesting_logs");

    // Remove the field
    hl.fields.removeById("farm_log_book");

    // Remove the index
    hl.indexes = hl.indexes.filter(
      (idx) => !idx.includes("idx_hl_farm_log")
    );

    app.save(hl);
    console.log("[Migration 026 DOWN] Removed farm_log_book from harvesting_logs");
  }
);
