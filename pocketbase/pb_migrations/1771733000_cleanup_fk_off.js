/// <reference path="../pb_data/types.d.ts" />

// One-time cleanup: Disable FK checks, delete all records, re-enable FK checks

migrate((app) => {
  console.log("[Cleanup] Disabling foreign key checks...");

  try {
    app.db().newQuery("PRAGMA foreign_keys = OFF").execute();
  } catch (err) {
    console.log("[Cleanup] PRAGMA failed:", err.message);
  }

  const tables = [
    "inbound_check_details",
    "inbound_request_details",
    "outbound_requests",
    "inbound_requests",
    "log_book_details",
    "harvesting_logs",
    "farm_log_books",
    "farmer_log_books",
  ];

  for (const table of tables) {
    try {
      app.db().newQuery("DELETE FROM " + table).execute();
      console.log("[Cleanup] Deleted all from " + table);
    } catch (err) {
      console.log("[Cleanup] Error " + table + ": " + err.message);
    }
  }

  try {
    app.db().newQuery("PRAGMA foreign_keys = ON").execute();
  } catch (err) {
    console.log("[Cleanup] Re-enable FK failed:", err.message);
  }

  console.log("[Cleanup] Done!");
});
