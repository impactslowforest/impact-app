/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Auto-aggregate data from child to parent logbooks
 *
 * Cascading aggregation flow:
 *   log_book_details → farm_log_books  (weight, bags)
 *   farm_log_books   → farmer_log_books (weight, bags, cert breakdown)
 *
 * Triggers on create, update, and delete of child records.
 */

console.log("[Hook Loaded] logbook-aggregation.pb.js — cascading aggregation for logbooks");

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Aggregate all lot details into their parent farm_log_book,
 * then cascade up to farmer_log_book.
 */
function aggregateLotsToFarmLog(app, farmLogBookId) {
  try {
    var farmLogBook = app.findRecordById("farm_log_books", farmLogBookId);

    // Get all lot details for this farm log book
    var lots = app.findRecordsByFilter(
      "log_book_details",
      'farm_log_book = "' + farmLogBookId + '"',
      "",
      0,
      0
    );

    var totalWeight = 0;
    var totalBags = 0;

    for (var i = 0; i < lots.length; i++) {
      totalWeight += lots[i].getFloat("weight_total_kg") || 0;
      totalBags += lots[i].getInt("number_of_bags") || 0;
    }

    farmLogBook.set("weight_total_kg", totalWeight);
    farmLogBook.set("number_of_bags", totalBags);
    app.save(farmLogBook);

    console.log(
      "[Aggregation] farm_log_book " + farmLogBookId +
      ": " + totalWeight + "kg, " + totalBags + " bags (from " + lots.length + " lots)"
    );

    // Cascade up to farmer_log_book
    var farmerLogBookId = farmLogBook.getString("farmer_log_book");
    if (farmerLogBookId) {
      aggregateFarmLogsToFarmerLog(app, farmerLogBookId);
    }
  } catch (err) {
    console.error("[Aggregation] Error aggregating lots → farm_log " + farmLogBookId + ":", err);
  }
}

/**
 * Aggregate all farm_log_books into their parent farmer_log_book.
 */
function aggregateFarmLogsToFarmerLog(app, farmerLogBookId) {
  try {
    var farmerLogBook = app.findRecordById("farmer_log_books", farmerLogBookId);

    // Get all farm log books for this farmer log book
    var farmLogs = app.findRecordsByFilter(
      "farm_log_books",
      'farmer_log_book = "' + farmerLogBookId + '"',
      "",
      0,
      0
    );

    var totalWeight = 0;
    var totalBags = 0;
    var euOrganicKg = 0;
    var fairtradeKg = 0;
    var nonCertKg = 0;

    for (var i = 0; i < farmLogs.length; i++) {
      var w = farmLogs[i].getFloat("weight_total_kg") || 0;
      totalWeight += w;
      totalBags += farmLogs[i].getInt("number_of_bags") || 0;

      // Distribute weight by certificate type
      var cert = (farmLogs[i].getString("certificate") || "").toLowerCase();
      if (cert.indexOf("organic") >= 0 || cert.indexOf("eu") >= 0) {
        euOrganicKg += w;
      } else if (cert.indexOf("fairtrade") >= 0 || cert.indexOf("fair") >= 0) {
        fairtradeKg += w;
      } else {
        nonCertKg += w;
      }
    }

    farmerLogBook.set("weight_total_kg", totalWeight);
    farmerLogBook.set("number_of_bags", totalBags);
    farmerLogBook.set("eu_organic_kg", euOrganicKg);
    farmerLogBook.set("fairtrade_kg", fairtradeKg);
    farmerLogBook.set("non_certificate_kg", nonCertKg);
    app.save(farmerLogBook);

    console.log(
      "[Aggregation] farmer_log_book " + farmerLogBookId +
      ": " + totalWeight + "kg, " + totalBags + " bags (from " + farmLogs.length + " farm logs)"
    );
  } catch (err) {
    console.error("[Aggregation] Error aggregating farm_logs → farmer_log " + farmerLogBookId + ":", err);
  }
}


// ═══════════════════════════════════════════════════════════════════════
// log_book_details → farm_log_books
// ═══════════════════════════════════════════════════════════════════════

onRecordAfterCreateSuccess((e) => {
  var parentId = e.record.getString("farm_log_book");
  if (parentId) {
    aggregateLotsToFarmLog(e.app, parentId);
  }
}, "log_book_details");

onRecordAfterUpdateSuccess((e) => {
  var parentId = e.record.getString("farm_log_book");
  var oldParentId = e.record.original().getString("farm_log_book");

  // Update current parent
  if (parentId) {
    aggregateLotsToFarmLog(e.app, parentId);
  }
  // If parent changed, also update old parent
  if (oldParentId && oldParentId !== parentId) {
    aggregateLotsToFarmLog(e.app, oldParentId);
  }
}, "log_book_details");

onRecordAfterDeleteSuccess((e) => {
  var parentId = e.record.getString("farm_log_book");
  if (parentId) {
    aggregateLotsToFarmLog(e.app, parentId);
  }
}, "log_book_details");


// ═══════════════════════════════════════════════════════════════════════
// farm_log_books → farmer_log_books
// ═══════════════════════════════════════════════════════════════════════

onRecordAfterCreateSuccess((e) => {
  var parentId = e.record.getString("farmer_log_book");
  if (parentId) {
    aggregateFarmLogsToFarmerLog(e.app, parentId);
  }
}, "farm_log_books");

onRecordAfterUpdateSuccess((e) => {
  var parentId = e.record.getString("farmer_log_book");
  var oldParentId = e.record.original().getString("farmer_log_book");

  if (parentId) {
    aggregateFarmLogsToFarmerLog(e.app, parentId);
  }
  if (oldParentId && oldParentId !== parentId) {
    aggregateFarmLogsToFarmerLog(e.app, oldParentId);
  }
}, "farm_log_books");

onRecordAfterDeleteSuccess((e) => {
  var parentId = e.record.getString("farmer_log_book");
  if (parentId) {
    aggregateFarmLogsToFarmerLog(e.app, parentId);
  }
}, "farm_log_books");
