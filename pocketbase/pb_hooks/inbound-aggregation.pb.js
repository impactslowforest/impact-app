/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Inbound Aggregation (v2 - non-blocking)
 *
 * Cascades totals from child collections up to inbound_requests.
 * Uses $app.runInBackground() to avoid blocking the response.
 */

console.log("[Hook Loaded] inbound-aggregation.pb.js v2");

function aggregateToInboundRequest(app, inboundRequestId) {
  if (!inboundRequestId || inboundRequestId === "") return;

  try {
    var parent = app.findRecordById("inbound_requests", inboundRequestId);

    // Aggregate from inbound_request_details
    var details = [];
    try {
      details = app.findRecordsByFilter(
        "inbound_request_details",
        'inbound_request = "' + inboundRequestId + '"',
        "", 0, 0
      );
    } catch (err) { /* no details */ }

    var totalBags = 0, weightTotal = 0, moistureSum = 0, moistureCount = 0;
    for (var i = 0; i < details.length; i++) {
      totalBags += details[i].getInt("re_bags") || 0;
      weightTotal += details[i].getFloat("re_total_qty") || 0;
      var m = details[i].getFloat("re_moisture_pct");
      if (m > 0) { moistureSum += m; moistureCount++; }
    }

    parent.set("total_bags", totalBags);
    parent.set("weight_total_kg", weightTotal);
    parent.set("moisture_pct", moistureCount > 0 ? Math.round((moistureSum / moistureCount) * 100) / 100 : 0);

    // Aggregate from inbound_check_details
    var checks = [];
    try {
      checks = app.findRecordsByFilter(
        "inbound_check_details",
        'inbound_request = "' + inboundRequestId + '"',
        "", 0, 0
      );
    } catch (err) { /* no checks */ }

    var checkBags = 0, checkWeight = 0, checkMoistSum = 0, checkMoistCount = 0;
    for (var j = 0; j < checks.length; j++) {
      checkBags += checks[j].getInt("number_of_bags") || 0;
      checkWeight += checks[j].getFloat("total_bag_weight_kg") || 0;
      var cm = checks[j].getFloat("moisture_pct");
      if (cm > 0) { checkMoistSum += cm; checkMoistCount++; }
    }

    parent.set("check_bags", checkBags);
    parent.set("check_weight_kg", checkWeight);
    parent.set("check_moisture_pct", checkMoistCount > 0 ? Math.round((checkMoistSum / checkMoistCount) * 100) / 100 : 0);

    app.save(parent);
    console.log("[Aggregation] Updated inbound_request: " + inboundRequestId);
  } catch (err) {
    console.error("[Aggregation] Error: " + err.message);
  }
}


// ═══ INBOUND REQUEST DETAILS → INBOUND REQUESTS ═══

onRecordAfterCreateSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
  } catch (err) {
    console.error("[Aggregation] afterCreate error: " + err.message);
  }
}, "inbound_request_details");

onRecordAfterUpdateSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
    var oldParentId = e.record.original().getString("inbound_request");
    if (oldParentId && oldParentId !== parentId) {
      aggregateToInboundRequest(e.app, oldParentId);
    }
  } catch (err) {
    console.error("[Aggregation] afterUpdate error: " + err.message);
  }
}, "inbound_request_details");

onRecordAfterDeleteSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
  } catch (err) {
    console.error("[Aggregation] afterDelete error: " + err.message);
  }
}, "inbound_request_details");


// ═══ INBOUND CHECK DETAILS → INBOUND REQUESTS ═══

onRecordAfterCreateSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
  } catch (err) {
    console.error("[Aggregation] afterCreate error: " + err.message);
  }
}, "inbound_check_details");

onRecordAfterUpdateSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
    var oldParentId = e.record.original().getString("inbound_request");
    if (oldParentId && oldParentId !== parentId) {
      aggregateToInboundRequest(e.app, oldParentId);
    }
  } catch (err) {
    console.error("[Aggregation] afterUpdate error: " + err.message);
  }
}, "inbound_check_details");

onRecordAfterDeleteSuccess((e) => {
  try {
    var parentId = e.record.getString("inbound_request");
    if (parentId) aggregateToInboundRequest(e.app, parentId);
  } catch (err) {
    console.error("[Aggregation] afterDelete error: " + err.message);
  }
}, "inbound_check_details");
