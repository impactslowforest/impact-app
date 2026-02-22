/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Auto-generate hierarchical log codes (v2)
 *
 * Generates IDs for 4 logbook collections following naming conventions:
 *   1. farmer_log_books  → {farmer_code}-{MMYY}-{seq}     e.g. NL09-0225-1
 *   2. farm_log_books    → {farm_code}-{seq}               e.g. NL09-5-1
 *   3. harvesting_logs   → {farm_code}-{seq}               e.g. NL09-5-1
 *   4. log_book_details  → {farm_code}-{harvest}{lot_seq}  e.g. NL09-5-111 (harvest=1, lot=11)
 *
 * Skips generation if the code field is already populated (preserves imported data).
 * NOTE: Helper functions defined INLINE within each callback
 * due to PocketBase JSVM module-scope limitation.
 */

console.log("[Hook Loaded] logbook-auto-id.pb.js v2");


// ═══════════════════════════════════════════════════════════════════════
// 1. FARMER LOG BOOKS — {farmer_code}-{MMYY}-{seq}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  if (e.record.getString("log_code")) {
    e.next();
    return;
  }

  function fmtMMYY(dateStr) {
    var date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) date = new Date();
    var mm = String(date.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var yy = String(date.getFullYear()).slice(-2);
    return mm + yy;
  }

  function maxSeq(app, collection, codeField, prefix) {
    try {
      var records = app.findRecordsByFilter(collection, codeField + ' ~ "' + prefix + '"', "", 0, 0);
      var max = 0;
      for (var i = 0; i < records.length; i++) {
        var code = records[i].getString(codeField);
        var num = parseInt(code.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
      return max;
    } catch (err) { return 0; }
  }

  var farmerId = e.record.getString("farmer");
  if (!farmerId) {
    throw new BadRequestError("Farmer relation is required to generate log_code");
  }

  var farmer = e.app.findRecordById("farmers", farmerId);
  var farmerCode = farmer.getString("farmer_code");
  if (!farmerCode) {
    throw new BadRequestError("Farmer must have a farmer_code to generate log_code");
  }

  var logDate = e.record.getString("log_date");
  var mmyy = fmtMMYY(logDate);

  var prefix = farmerCode + "-" + mmyy + "-";
  var seq = maxSeq(e.app, "farmer_log_books", "log_code", prefix) + 1;

  var logCode = prefix + seq;
  e.record.set("log_code", logCode);

  if (!e.record.getString("farmer_name")) {
    e.record.set("farmer_name", farmer.getString("full_name") || "");
  }

  console.log("[AutoID] farmer_log_books: " + logCode);
  e.next();
}, "farmer_log_books");


// ═══════════════════════════════════════════════════════════════════════
// 2. FARM LOG BOOKS — {farm_code}-{seq}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  if (e.record.getString("log_code")) {
    e.next();
    return;
  }

  function maxSeq(app, collection, codeField, prefix) {
    try {
      var records = app.findRecordsByFilter(collection, codeField + ' ~ "' + prefix + '"', "", 0, 0);
      var max = 0;
      for (var i = 0; i < records.length; i++) {
        var code = records[i].getString(codeField);
        var num = parseInt(code.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
      return max;
    } catch (err) { return 0; }
  }

  var farmId = e.record.getString("farm");
  if (!farmId) {
    throw new BadRequestError("Farm relation is required to generate log_code");
  }

  var farm = e.app.findRecordById("farms", farmId);
  var farmCode = farm.getString("farm_code");
  if (!farmCode) {
    throw new BadRequestError("Farm must have a farm_code to generate log_code");
  }

  var prefix = farmCode + "-";
  var seq = maxSeq(e.app, "farm_log_books", "log_code", prefix) + 1;

  var logCode = prefix + seq;
  e.record.set("log_code", logCode);

  if (!e.record.getString("farm_name")) {
    e.record.set("farm_name", farm.getString("farm_name") || "");
  }

  // Auto-link farmer_log_book if not provided
  if (!e.record.getString("farmer_log_book")) {
    var farmerId = e.record.getString("farmer") || farm.getString("farmer");
    if (farmerId) {
      try {
        var farmerLogs = e.app.findRecordsByFilter(
          "farmer_log_books",
          'farmer = "' + farmerId + '"',
          "-created", 1, 0
        );
        if (farmerLogs.length > 0) {
          e.record.set("farmer_log_book", farmerLogs[0].id);
        }
      } catch (err) { /* skip */ }
    }
  }

  if (!e.record.getString("farmer")) {
    var farmerFromFarm = farm.getString("farmer");
    if (farmerFromFarm) e.record.set("farmer", farmerFromFarm);
  }

  console.log("[AutoID] farm_log_books: " + logCode);
  e.next();
}, "farm_log_books");


// ═══════════════════════════════════════════════════════════════════════
// 3. HARVESTING LOGS — {farm_code}-{seq}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  if (e.record.getString("log_code")) {
    e.next();
    return;
  }

  function maxSeq(app, collection, codeField, prefix) {
    try {
      var records = app.findRecordsByFilter(collection, codeField + ' ~ "' + prefix + '"', "", 0, 0);
      var max = 0;
      for (var i = 0; i < records.length; i++) {
        var code = records[i].getString(codeField);
        var num = parseInt(code.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
      return max;
    } catch (err) { return 0; }
  }

  var farmId = e.record.getString("farm");
  if (!farmId) {
    throw new BadRequestError("Farm relation is required to generate log_code");
  }

  var farm = e.app.findRecordById("farms", farmId);
  var farmCode = farm.getString("farm_code");
  if (!farmCode) {
    throw new BadRequestError("Farm must have a farm_code to generate log_code");
  }

  var prefix = farmCode + "-";
  var seq = maxSeq(e.app, "harvesting_logs", "log_code", prefix) + 1;

  var logCode = prefix + seq;
  e.record.set("log_code", logCode);

  if (!e.record.getString("farm_name")) {
    e.record.set("farm_name", farm.getString("farm_name") || "");
  }
  if (!e.record.getString("farmer")) {
    var farmerFromFarm = farm.getString("farmer");
    if (farmerFromFarm) e.record.set("farmer", farmerFromFarm);
  }
  if (!e.record.getString("farmer_name") && e.record.getString("farmer")) {
    try {
      var farmerRec = e.app.findRecordById("farmers", e.record.getString("farmer"));
      e.record.set("farmer_name", farmerRec.getString("full_name") || "");
    } catch (err) { /* skip */ }
  }

  // Auto-link farm_log_book if not provided
  if (!e.record.getString("farm_log_book")) {
    try {
      var farmLogs = e.app.findRecordsByFilter(
        "farm_log_books",
        'farm = "' + farmId + '"',
        "-created", 1, 0
      );
      if (farmLogs.length > 0) {
        e.record.set("farm_log_book", farmLogs[0].id);
      }
    } catch (err) { /* skip */ }
  }

  console.log("[AutoID] harvesting_logs: " + logCode);
  e.next();
}, "harvesting_logs");


// ═══════════════════════════════════════════════════════════════════════
// 4. LOG BOOK DETAILS — {farm_code}-{harvest_num}{lot_seq}
// ═══════════════════════════════════════════════════════════════════════

onRecordCreate((e) => {
  if (e.record.getString("lot_code")) {
    e.next();
    return;
  }

  function countMatching(app, collection, filter) {
    try {
      var records = app.findRecordsByFilter(collection, filter, "", 0, 0);
      return records.length;
    } catch (err) { return 0; }
  }

  var farmLogBookId = e.record.getString("farm_log_book");
  if (!farmLogBookId) {
    throw new BadRequestError("farm_log_book relation is required to generate lot_code");
  }

  var farmLogBook = e.app.findRecordById("farm_log_books", farmLogBookId);
  var farmId = farmLogBook.getString("farm");
  if (!farmId) {
    throw new BadRequestError("farm_log_book must have a farm relation");
  }

  var farm = e.app.findRecordById("farms", farmId);
  var farmCode = farm.getString("farm_code");
  if (!farmCode) {
    throw new BadRequestError("Farm must have a farm_code to generate lot_code");
  }

  // Extract harvest number from farm_log_book's log_code
  var farmLogCode = farmLogBook.getString("log_code") || "";
  var parts = farmLogCode.split("-");
  var harvestNum = "1";
  if (parts.length > 0) {
    var lastPart = parts[parts.length - 1];
    var parsed = parseInt(lastPart, 10);
    if (!isNaN(parsed)) harvestNum = String(parsed);
  }

  // Count existing lot details for this farm_log_book
  var existingCount = countMatching(
    e.app, "log_book_details",
    'farm_log_book = "' + farmLogBookId + '"'
  );
  var lotSeq = 11 + existingCount;

  var lotCode = farmCode + "-" + harvestNum + String(lotSeq);
  e.record.set("lot_code", lotCode);

  if (!e.record.getString("farm")) {
    e.record.set("farm", farmId);
  }
  if (!e.record.getString("farmer")) {
    var farmerFromFarmLog = farmLogBook.getString("farmer");
    if (farmerFromFarmLog) e.record.set("farmer", farmerFromFarmLog);
  }
  if (!e.record.getString("farmer_log_book")) {
    var farmerLogFromFarmLog = farmLogBook.getString("farmer_log_book");
    if (farmerLogFromFarmLog) e.record.set("farmer_log_book", farmerLogFromFarmLog);
  }
  if (!e.record.getString("farm_name")) {
    e.record.set("farm_name", farm.getString("farm_name") || "");
  }

  console.log("[AutoID] log_book_details: " + lotCode);
  e.next();
}, "log_book_details");
