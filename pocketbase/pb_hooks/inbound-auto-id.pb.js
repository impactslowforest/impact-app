/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Auto-generate Inbound Process IDs (v3)
 *
 * Generates codes for 3 inbound collections:
 *   1. inbound_requests       → {farm_code}-{DDMMYY}-{HHMMSS}
 *   2. inbound_request_details → {inbound_code}-{seq from 11}
 *   3. inbound_check_details   → {lot_detail_code}-{yymmddhhmmss}
 *
 * Skips generation if the code field is already populated.
 * NOTE: Helper functions must be defined INLINE within each hook
 * callback due to PocketBase JSVM module-scope limitation.
 */

console.log("[Hook Loaded] inbound-auto-id.pb.js v3");


// ═══════════════════════════════════════════════════════════════════════
// 1. INBOUND REQUESTS
//    Slow farm:   SLO-{region}-{DDMMYY}-{HHMMSS}
//    Third party: SPL-{region}-{DDMMYY}-{HHMMSS}
//    Cooperative: {farm_code}-{DDMMYY}-{HHMMSS}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  var existingCode = e.record.getString("inbound_code");
  if (existingCode && existingCode !== "") {
    e.next();
    return;
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function ddmmyy(dateInput) {
    var d = (dateInput && dateInput !== "") ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return pad2(d.getDate()) + pad2(d.getMonth() + 1) + String(d.getFullYear()).slice(-2);
  }

  var source = e.record.getString("source") || "Cooperative";
  var requestDate = e.record.getString("request_date");
  var country = e.record.getString("country") || "";

  var regionCode = "01";
  if (country === "VN") regionCode = "02";
  else if (country === "ID") regionCode = "03";

  var datePart = ddmmyy(requestDate);
  var now = new Date();
  var timePart = pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds());

  var inboundCode = "";
  if (source === "Slow farm") {
    inboundCode = "SLO-" + regionCode + "-" + datePart + "-" + timePart;
  } else if (source === "Third party") {
    inboundCode = "SPL-" + regionCode + "-" + datePart + "-" + timePart;
  } else {
    // Cooperative: needs farm lookup
    var farmId = e.record.getString("farm");
    if (farmId) {
      try {
        var farm = e.app.findRecordById("farms", farmId);
        var farmCode = farm.getString("farm_code") || "COOP";
        inboundCode = farmCode + "-" + datePart + "-" + timePart;

        // Auto-fill from farm
        if (!e.record.getString("farmer")) {
          var farmerFromFarm = farm.getString("farmer");
          if (farmerFromFarm) e.record.set("farmer", farmerFromFarm);
        }
        if (!e.record.getString("village_code")) {
          e.record.set("village_code", farm.getString("village_code") || "");
        }
        // village_name removed (normalization) — use expand farm.village in frontend
        if (!e.record.getString("country")) {
          e.record.set("country", farm.getString("country") || "");
        }
      } catch (err) {
        inboundCode = "COOP-" + regionCode + "-" + datePart + "-" + timePart;
        console.log("[AutoID] Farm lookup failed: " + err.message);
      }
    } else {
      inboundCode = "COOP-" + regionCode + "-" + datePart + "-" + timePart;
    }
  }

  // Uniqueness check
  try {
    e.app.findFirstRecordByFilter("inbound_requests", 'inbound_code = "' + inboundCode + '"');
    // If found, append milliseconds for uniqueness
    inboundCode = inboundCode + "-" + String(Date.now()).slice(-4);
  } catch (err) {
    // Not found = unique, good
  }

  e.record.set("inbound_code", inboundCode);

  // farmer_name removed (normalization) — use expand farmer.full_name in frontend

  console.log("[AutoID] inbound_requests (" + source + "): " + inboundCode);
  e.next();
}, "inbound_requests");


// ═══════════════════════════════════════════════════════════════════════
// 2. INBOUND REQUEST DETAILS — {inbound_code}-{seq from 11}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  var existingCode = e.record.getString("detail_code");
  if (existingCode && existingCode !== "") {
    e.next();
    return;
  }

  var parentId = e.record.getString("inbound_request");
  if (!parentId || parentId === "") {
    throw new BadRequestError("inbound_request relation is required");
  }

  var parent;
  try {
    parent = e.app.findRecordById("inbound_requests", parentId);
  } catch (err) {
    throw new BadRequestError("Parent inbound_request not found");
  }

  var inboundCode = parent.getString("inbound_code") || "";
  if (!inboundCode) {
    throw new BadRequestError("Parent has no inbound_code");
  }

  // Find max existing sequence (inline to avoid module-scope issue)
  var prefix = inboundCode + "-";
  var maxSeq = 0;
  try {
    var records = e.app.findRecordsByFilter(
      "inbound_request_details",
      'detail_code ~ "' + prefix + '"',
      "", 0, 0
    );
    for (var i = 0; i < records.length; i++) {
      var code = records[i].getString("detail_code");
      var suffix = code.substring(prefix.length);
      var num = parseInt(suffix, 10);
      if (!isNaN(num) && num > maxSeq) maxSeq = num;
    }
  } catch (err) {
    // No records found
  }

  var seq = maxSeq < 11 ? 11 : maxSeq + 1;
  var detailCode = prefix + seq;

  e.record.set("detail_code", detailCode);

  // Auto-fill from parent
  if (!e.record.getString("farmer")) {
    var pf = parent.getString("farmer");
    if (pf) e.record.set("farmer", pf);
  }
  if (!e.record.getString("farm")) {
    var pfarm = parent.getString("farm");
    if (pfarm) e.record.set("farm", pfarm);
  }
  if (!e.record.getString("country")) {
    e.record.set("country", parent.getString("country") || "");
  }

  console.log("[AutoID] inbound_request_details: " + detailCode);
  e.next();
}, "inbound_request_details");


// ═══════════════════════════════════════════════════════════════════════
// 3. INBOUND CHECK DETAILS — {lot_detail_code}-{yymmddhhmmss}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  var existingCode = e.record.getString("check_code");
  if (existingCode && existingCode !== "") {
    e.next();
    return;
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function yymmddhhmmss(dateInput) {
    var d = (dateInput && dateInput !== "") ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return String(d.getFullYear()).slice(-2) +
      pad2(d.getMonth() + 1) + pad2(d.getDate()) +
      pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }

  var lotDetailCode = e.record.getString("lot_detail_code") || "";

  // Try to get from related inbound_detail
  if (!lotDetailCode) {
    var detailId = e.record.getString("inbound_detail");
    if (detailId) {
      try {
        var detail = e.app.findRecordById("inbound_request_details", detailId);
        lotDetailCode = detail.getString("lot_detail_code") || detail.getString("lot_code") || "";
      } catch (err) {
        // skip
      }
    }
  }

  if (!lotDetailCode) {
    throw new BadRequestError("lot_detail_code is required to generate check_code");
  }

  var timestamp = yymmddhhmmss(new Date());
  var checkCode = lotDetailCode + "-" + timestamp;
  e.record.set("check_code", checkCode);

  // Auto-link inbound_request from inbound_detail
  if (!e.record.getString("inbound_request") && e.record.getString("inbound_detail")) {
    try {
      var detailRec = e.app.findRecordById("inbound_request_details", e.record.getString("inbound_detail"));
      var parentReqId = detailRec.getString("inbound_request");
      if (parentReqId) e.record.set("inbound_request", parentReqId);
      if (!e.record.getString("farm")) {
        e.record.set("farm", detailRec.getString("farm") || "");
      }
    } catch (err) {
      // skip
    }
  }

  // Auto-fill country
  if (!e.record.getString("country") && e.record.getString("inbound_request")) {
    try {
      var reqRec = e.app.findRecordById("inbound_requests", e.record.getString("inbound_request"));
      e.record.set("country", reqRec.getString("country") || "");
    } catch (err) {
      // skip
    }
  }

  console.log("[AutoID] inbound_check_details: " + checkCode);
  e.next();
}, "inbound_check_details");
