/**
 * Full Reimport Script
 * Deletes all data from 7 tables and reimports from Excel.
 *
 * Order: Delete (reverse deps) → Import (forward deps)
 *
 * Delete: inbound_check_details → inbound_request_details → inbound_requests
 *         → log_book_details → harvesting_logs → farm_log_books → farmer_log_books
 * Import: farmer_log_books → farm_log_books → harvesting_logs → log_book_details
 *         → inbound_requests → inbound_request_details → inbound_check_details
 */

import PocketBase from 'pocketbase';
import XLSX from 'xlsx';
import path from 'path';

const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve('C:\\Users\\User\\OneDrive - Slow Forest\\Apps\\2026\\Impact_18Feb2026\\Dry Mill _ Harvesting log book.xlsx');

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

// ─── Helpers ─────────────────────────────────────────────────────────

function excelDateToISO(serial) {
  if (!serial && serial !== 0) return '';
  if (typeof serial === 'string') {
    // Already a date string
    const d = new Date(serial);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return '';
  }
  if (typeof serial !== 'number') return '';
  // Excel serial date → JS Date
  const epoch = new Date(Date.UTC(1899, 11, 30));
  const d = new Date(epoch.getTime() + serial * 86400000);
  return d.toISOString().split('T')[0];
}

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function absNum(v) {
  const n = num(v);
  return n !== null ? Math.abs(n) : null;
}

function str(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function readSheet(wb, sheetName) {
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.error(`  ❌ Sheet "${sheetName}" not found!`);
    return [];
  }
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  📄 Sheet "${sheetName}": ${data.length} rows`);
  return data;
}

async function deleteAll(collection) {
  console.log(`  Deleting all from ${collection}...`);
  let deleted = 0;
  let skipped = 0;
  let retries = 0;
  const maxRetries = 3;

  while (retries <= maxRetries) {
    try {
      const page = await pb.collection(collection).getList(1, 200);
      if (page.items.length === 0) break;

      let deletedThisRound = 0;
      for (const item of page.items) {
        try {
          await pb.collection(collection).delete(item.id);
          deleted++;
          deletedThisRound++;
        } catch (err) {
          skipped++;
        }
      }
      process.stdout.write(`\r     Deleted ${deleted} records (${skipped} skipped)...`);

      // If nothing was deleted this round, retry or break
      if (deletedThisRound === 0) {
        retries++;
        if (retries > maxRetries) break;
      } else {
        retries = 0; // Reset retries on progress
      }
    } catch (err) {
      if (err.status === 404) break;
      retries++;
      if (retries > maxRetries) {
        console.log(`\n  Warning: Could not fully delete ${collection}: ${err.message}`);
        break;
      }
    }
  }
  console.log(`\r  Done: Deleted ${deleted} from ${collection}${skipped > 0 ? ` (${skipped} skipped)` : ''}`);
}

async function importBatch(collection, records, label) {
  console.log(`\n  📥 Importing ${records.length} records to ${collection}...`);
  let success = 0, errors = 0;
  const errorLog = [];

  for (let i = 0; i < records.length; i++) {
    try {
      await pb.collection(collection).create(records[i]);
      success++;
    } catch (err) {
      errors++;
      if (errorLog.length < 10) {
        errorLog.push({ row: i + 1, data: records[i], error: err.response?.data || err.message });
      }
    }
    if ((i + 1) % 100 === 0 || i === records.length - 1) {
      process.stdout.write(`\r     Progress: ${i + 1}/${records.length} (✅ ${success} | ❌ ${errors})`);
    }
  }

  console.log(`\n  ✅ ${label}: ${success} imported, ${errors} errors`);
  if (errorLog.length > 0) {
    console.log(`  ⚠️  First errors:`);
    for (const e of errorLog) {
      console.log(`     Row ${e.row}: ${JSON.stringify(e.error)}`);
    }
  }
  return { success, errors };
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FULL REIMPORT - Harvesting & Inbound Tables');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Auth
  await pb.collection('_superusers').authWithPassword('trung@slowforest.com', '1a111111');
  console.log('✅ Authenticated as superuser\n');

  // Read Excel
  console.log('📖 Reading Excel file...');
  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`   Sheets: ${wb.SheetNames.join(', ')}\n`);

  // ═══ PHASE 1: BUILD LOOKUP MAPS ═══════════════════════════════════
  console.log('═══ PHASE 1: Building lookup maps ═══');

  // Farmers: farmer_code → id
  console.log('  Loading farmers...');
  const farmerMap = {};
  let farmerPage = 1;
  while (true) {
    const res = await pb.collection('farmers').getList(farmerPage, 500);
    for (const f of res.items) {
      if (f.farmer_code) farmerMap[f.farmer_code] = f.id;
    }
    if (farmerPage * 500 >= res.totalItems) break;
    farmerPage++;
  }
  console.log(`  ✅ ${Object.keys(farmerMap).length} farmers loaded`);

  // Farms: farm_code → {id, farmer}
  console.log('  Loading farms...');
  const farmMap = {};
  let farmPage = 1;
  while (true) {
    const res = await pb.collection('farms').getList(farmPage, 500);
    for (const f of res.items) {
      if (f.farm_code) farmMap[f.farm_code] = { id: f.id, farmer: f.farmer };
    }
    if (farmPage * 500 >= res.totalItems) break;
    farmPage++;
  }
  console.log(`  ✅ ${Object.keys(farmMap).length} farms loaded`);

  // Suppliers: supplier_code → id
  console.log('  Loading suppliers...');
  const supplierMap = {};
  try {
    const res = await pb.collection('suppliers').getFullList();
    for (const s of res) {
      if (s.supplier_code) supplierMap[s.supplier_code] = s.id;
    }
  } catch (e) { /* no suppliers yet */ }
  console.log(`  ✅ ${Object.keys(supplierMap).length} suppliers loaded\n`);

  // ═══ PHASE 2: DELETE ALL DATA ═════════════════════════════════════
  console.log('═══ PHASE 2: Deleting existing data (reverse dependency order) ═══');
  await deleteAll('outbound_requests');    // references inbound_requests
  await deleteAll('inbound_check_details');
  await deleteAll('inbound_request_details');
  await deleteAll('inbound_requests');
  await deleteAll('log_book_details');
  await deleteAll('harvesting_logs');
  await deleteAll('farm_log_books');
  await deleteAll('farmer_log_books');
  console.log('');

  // ═══ PHASE 3: IMPORT ══════════════════════════════════════════════

  // --- 3.1: Farmer log books ---
  console.log('═══ 3.1: Farmer log books ═══');
  const flbData = readSheet(wb, 'Farmer log book');
  const flbRecords = [];
  for (const row of flbData) {
    const logCode = str(row['Farmer log book ID']);
    if (!logCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmerId = farmerMap[farmerCode] || '';

    flbRecords.push({
      log_code: logCode,
      farmer: farmerId,
      village_code: str(row['Village ID']),
      farmer_name: str(row['Farmer name']),
      variety: str(row['Variety']),
      process: str(row['Process']),
      eu_organic_kg: absNum(row['EU Organic (kg)']),
      fairtrade_kg: absNum(row['FairTrade (kg)']),
      non_certificate_kg: absNum(row['Non-Certificate (kg)']),
      log_date: excelDateToISO(row['Date']),
      dry_mill_name: str(row['Dry mill name']),
      moisture_pct: num(row['Moisture (%)']),
      aw_level: num(row['aW level']),
      number_of_bags: num(row['Number of bag']),
      weight_total_kg: absNum(row['Weight total (kg)']),
      delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
      remark: str(row['Remark']),
      staff_input: str(row['Who input']),
      country: 'laos',
    });
  }
  const flbResult = await importBatch('farmer_log_books', flbRecords, 'Farmer log books');

  // Build farmer_log_book lookup: log_code → PB id
  console.log('  Building farmer_log_book lookup...');
  const flbMap = {};
  let flbPage = 1;
  while (true) {
    const res = await pb.collection('farmer_log_books').getList(flbPage, 500);
    for (const r of res.items) {
      if (r.log_code) flbMap[r.log_code] = r.id;
    }
    if (flbPage * 500 >= res.totalItems) break;
    flbPage++;
  }
  console.log(`  ✅ ${Object.keys(flbMap).length} farmer_log_books mapped\n`);

  // --- 3.2: Farm log books ---
  console.log('═══ 3.2: Farm log books ═══');
  const fmlbData = readSheet(wb, 'Farm log book');
  const fmlbRecords = [];
  for (const row of fmlbData) {
    const logCode = str(row['Farm log book ID']);
    if (!logCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmCode = str(row['Farm ID']);
    const flbCode = str(row['Farmer log book ID']);

    fmlbRecords.push({
      log_code: logCode,
      farmer: farmerMap[farmerCode] || '',
      farm: farmMap[farmCode]?.id || '',
      farmer_log_book: flbMap[flbCode] || '',
      village_code: str(row['Village ID']),
      farm_name: str(row['Farm name']),
      certificate: str(row['Certificate']),
      variety: str(row['Variety']),
      process: str(row['Process']),
      log_date: excelDateToISO(row['Date']),
      dry_mill_name: str(row['Dry mill name']),
      moisture_pct: num(row['Moisture (%)']),
      aw_level: num(row['aW lavel']),
      number_of_bags: num(row['Number of bag']),
      weight_per_bag_kg: absNum(row['Weight per bag (kg)']),
      weight_total_kg: absNum(row['Weight total (kg)']),
      delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
      remark: str(row['Remark']),
      staff_input: str(row['Who input']),
      country: 'laos',
    });
  }
  const fmlbResult = await importBatch('farm_log_books', fmlbRecords, 'Farm log books');

  // Build farm_log_book lookup: log_code → PB id
  console.log('  Building farm_log_book lookup...');
  const fmlbMap = {};
  let fmlbPage = 1;
  while (true) {
    const res = await pb.collection('farm_log_books').getList(fmlbPage, 500);
    for (const r of res.items) {
      if (r.log_code) fmlbMap[r.log_code] = r.id;
    }
    if (fmlbPage * 500 >= res.totalItems) break;
    fmlbPage++;
  }
  console.log(`  ✅ ${Object.keys(fmlbMap).length} farm_log_books mapped\n`);

  // --- 3.3: Harvesting logs ---
  console.log('═══ 3.3: Harvesting logs ═══');
  const hlData = readSheet(wb, 'Harvesting log');
  const hlRecords = [];
  for (const row of hlData) {
    const logCode = str(row['Harvesting log ID']);
    if (!logCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmCode = str(row['Farm ID']);

    // Try to find farm_log_book by matching Farm ID as prefix
    // Farm log book code might be the same as the farm code or close to it
    let farmLogBookId = '';
    if (farmCode && fmlbMap[farmCode]) {
      farmLogBookId = fmlbMap[farmCode];
    }

    hlRecords.push({
      log_code: logCode,
      farmer: farmerMap[farmerCode] || '',
      farm: farmMap[farmCode]?.id || '',
      farm_log_book: farmLogBookId,
      village_code: str(row['Village ID']),
      village_name: str(row['Village']),
      farmer_name: str(row['Farmer name']),
      farm_name: str(row['Farm name']),
      variety: str(row['Variety']),
      species: str(row['Species']),
      picking_date: excelDateToISO(row['Picking date']),
      staff_input: str(row['Staff input']),
      date_report: excelDateToISO(row['Date report']),
      eu_organic_kg: absNum(row['EU Organic (kg)']),
      fairtrade_kg: absNum(row['FairTrade (kg)']),
      non_certificate_kg: absNum(row['Non-Certificate (kg)']),
      cherry_picked_kg: absNum(row['Amount of cherry/Ripe picked (kg)']),
      ripe_pulped_kg: absNum(row['Ripe pulped (kg)']),
      float_rate_kg: absNum(row['Float rate (kg)']),
      fermentation_hours: num(row['Fermentation (Hrs)']),
      fermentation_date: excelDateToISO(row['Fermentation date']),
      wet_parchment_kg: absNum(row['Wet parchment (Kg)']),
      rate_parchment: num(row['Rate parchment']),
      dry_parchment_kg: absNum(row['Dry parchment (Kg)']),
      drying_days: num(row['No of days for drying']),
      drying_start_date: excelDateToISO(row['Date start drying']),
      drying_end_date: excelDateToISO(row['Date finish drying']),
      moisture_pct: num(row['Moisture (%)']),
      stored_at: str(row['Stored at']),
      transport_date: excelDateToISO(row['Transport to Dry mill']),
      remark: str(row['Remark']),
      status: str(row['Status']),
      country: 'laos',
    });
  }
  const hlResult = await importBatch('harvesting_logs', hlRecords, 'Harvesting logs');

  // --- 3.4: Log book details ---
  console.log('\n═══ 3.4: Log book details ═══');
  const lbdData = readSheet(wb, 'Log book detail');
  const lbdRecords = [];
  for (const row of lbdData) {
    const lotCode = str(row['Lot ID']);
    if (!lotCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmCode = str(row['Farm ID']);
    const flbCode = str(row['Farmer log book ID']);
    const fmlbCode = str(row['Farm log book ID']);

    lbdRecords.push({
      lot_code: lotCode,
      farmer: farmerMap[farmerCode] || '',
      farm: farmMap[farmCode]?.id || '',
      farmer_log_book: flbMap[flbCode] || '',
      farm_log_book: fmlbMap[fmlbCode] || '',
      village_code: str(row['Village ID']),
      farm_name: str(row['Farm name']),
      certificate: str(row['Certificate']),
      variety: str(row['Variety']),
      process: str(row['Process']),
      log_date: excelDateToISO(row['Date']),
      dry_mill_name: str(row['Dry mill name']),
      moisture_pct: num(row['Moisture (%)']),
      aw_level: num(row['aW lavel']),
      number_of_bags: num(row['Number of bag']),
      weight_total_kg: absNum(row['Weight total (kg)']),
      weight_per_bag_kg: absNum(row['Weight per bag (kg)']),
      delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
      sale_status: str(row['Sale status']),
      remark: str(row['Remark']),
      staff_input: str(row['Who input']),
      country: 'laos',
    });
  }
  const lbdResult = await importBatch('log_book_details', lbdRecords, 'Log book details');

  // --- 3.5: Inbound requests ---
  console.log('\n═══ 3.5: Inbound requests ═══');
  const irData = readSheet(wb, 'Inbound request');
  const irRecords = [];
  for (const row of irData) {
    const inboundCode = str(row['Inbound ID']);
    if (!inboundCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmCode = str(row['Farm ID']);
    const supplierCode = str(row['Suplier ID']);
    const source = str(row['Sources']);

    // Build requestor_info from 3 fields
    const reqName = str(row['Requestor Name']);
    const reqDept = str(row['Requestor Department']);
    const reqPhone = str(row['Requestor Phone']);
    const requestorInfo = [reqName, reqDept, reqPhone].filter(Boolean).join(' | ');

    irRecords.push({
      inbound_code: inboundCode,
      source: source,
      input_type: str(row['Input type']),
      farmer: farmerMap[farmerCode] || '',
      farm: farmMap[farmCode]?.id || '',
      supplier: supplierMap[supplierCode] || '',
      village_code: str(row['Village ID']),
      village_name: str(row['Village Name']),
      farmer_name: str(row['Farmer name']),
      farmer_code: farmerCode,
      farm_code: farmCode,
      staff: str(row['Staff']),
      request_date: excelDateToISO(row['Inbound Request Date']),
      variety: str(row['Variety']),
      process: str(row['Process']),
      total_bags: num(row['Total No.of Bags']),
      moisture_pct: num(row['Moisture Level %']),
      weight_total_kg: absNum(row['Weight total (kg)']),
      check_bags: num(row['Check No.of Bags']),
      check_moisture_pct: num(row['Check Moisture Level %']),
      check_weight_kg: absNum(row['Check Weight total (kg)']),
      requestor_info: requestorInfo,
      status: str(row['Status']),
      vehicle_number: str(row['Vehicle Number']),
      approval_status: str(row['Approval status']),
      outbound_status: str(row['Outbound_status']),
      country: 'laos',
    });
  }
  const irResult = await importBatch('inbound_requests', irRecords, 'Inbound requests');

  // Build inbound_request lookup: inbound_code → PB id
  console.log('  Building inbound_request lookup...');
  const irMap = {};
  const irAll = await pb.collection('inbound_requests').getFullList();
  for (const r of irAll) {
    if (r.inbound_code) irMap[r.inbound_code] = r.id;
  }
  console.log(`  ✅ ${Object.keys(irMap).length} inbound_requests mapped\n`);

  // --- 3.6: Inbound request details ---
  console.log('═══ 3.6: Inbound request details ═══');
  const irdData = readSheet(wb, 'Inbound request detail');
  const irdRecords = [];
  for (const row of irdData) {
    const detailCode = str(row['Inbound detail ID']);
    if (!detailCode) continue;

    const farmerCode = str(row['Farmer ID']);
    const farmCode = str(row['Farm ID']);
    const inboundCode = str(row['Inbound ID']);

    irdRecords.push({
      detail_code: detailCode,
      inbound_request: irMap[inboundCode] || '',
      farmer: farmerMap[farmerCode] || '',
      farm: farmMap[farmCode]?.id || '',
      lot_code: str(row['Lot ID']),
      lot_detail_code: str(row['Lot ID detail']),
      staff: str(row['Staff']),
      detail_date: excelDateToISO(row['Date']),
      check_result: str(row['Results']),
      re_type: str(row['Re-Type']),
      re_organic: str(row['Re-Organic']),
      re_fairtrade: str(row['Re-Fair Trade']),
      re_bags: num(row['Re-No.of Bags']),
      re_qty_per_bag: num(row['Re-Quantity per Bags']),
      re_total_qty: absNum(row['Re-Total Quantity']),
      re_uom: str(row['Re-UOM']),
      re_moisture_pct: num(row['Re-Moisture Level %']),
      re_aw_level: str(row['Re-Active Water Level']),
      wh_type: str(row['Wh-Type']),
      wh_organic: str(row['Wh-Organic']),
      wh_fairtrade: str(row['Wh-Fair Trade']),
      wh_bags: num(row['Wh-No.of Bags']),
      wh_qty_per_bag: num(row['Wh-Quantity per Bags']),
      wh_total_qty: absNum(row['Wh-Total Quantity']),
      wh_uom: str(row['Wh-UOM']),
      wh_moisture_pct: num(row['Wh-Moisture Level %']),
      wh_aw_level: str(row['Wh-Active Water Level']),
      quality_assessment: str(row['Quality assessment']),
      status: str(row['Status']),
      approval_status: str(row['Approval Status']),
      country: 'laos',
    });
  }
  const irdResult = await importBatch('inbound_request_details', irdRecords, 'Inbound request details');

  // Build inbound_request_detail lookup: detail_code → PB id
  console.log('  Building inbound_request_detail lookup...');
  const irdMap = {};
  const irdAll = await pb.collection('inbound_request_details').getFullList();
  for (const r of irdAll) {
    if (r.detail_code) irdMap[r.detail_code] = r.id;
  }
  console.log(`  ✅ ${Object.keys(irdMap).length} inbound_request_details mapped\n`);

  // --- 3.7: Inbound check details ---
  console.log('═══ 3.7: Inbound check details ═══');
  const icdData = readSheet(wb, 'Inbound check detail');
  const icdRecords = [];
  for (const row of icdData) {
    const checkCode = str(row['Sub Lot ID']);
    if (!checkCode) continue;

    const inboundCode = str(row['Inbound ID']);
    const detailCode = str(row['Inbound detail ID']);
    const farmCode = str(row['Farm ID']);

    icdRecords.push({
      check_code: checkCode,
      inbound_request: irMap[inboundCode] || '',
      inbound_detail: irdMap[detailCode] || '',
      farm: farmMap[farmCode]?.id || '',
      lot_detail_code: str(row['LOT ID detail']),
      staff: str(row['Staff']),
      check_date: excelDateToISO(row['Date']),
      moisture_pct: num(row['Moisture']),
      total_bag_weight_kg: absNum(row['Total bag weight']),
      number_of_bags: num(row['No of Bags']),
      weight_per_bag_kg: absNum(row['Weight per bag']),
      remark: str(row['Remark']),
      country: 'laos',
    });
  }
  const icdResult = await importBatch('inbound_check_details', icdRecords, 'Inbound check details');

  // ═══ SUMMARY ═══════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  IMPORT SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  1. Farmer log books:         ${flbResult.success} ✅  ${flbResult.errors} ❌`);
  console.log(`  2. Farm log books:           ${fmlbResult.success} ✅  ${fmlbResult.errors} ❌`);
  console.log(`  3. Harvesting logs:          ${hlResult.success} ✅  ${hlResult.errors} ❌`);
  console.log(`  4. Log book details:         ${lbdResult.success} ✅  ${lbdResult.errors} ❌`);
  console.log(`  5. Inbound requests:         ${irResult.success} ✅  ${irResult.errors} ❌`);
  console.log(`  6. Inbound request details:  ${irdResult.success} ✅  ${irdResult.errors} ❌`);
  console.log(`  7. Inbound check details:    ${icdResult.success} ✅  ${icdResult.errors} ❌`);
  console.log('═══════════════════════════════════════════════════════════');

  const totalSuccess = flbResult.success + fmlbResult.success + hlResult.success + lbdResult.success + irResult.success + irdResult.success + icdResult.success;
  const totalErrors = flbResult.errors + fmlbResult.errors + hlResult.errors + lbdResult.errors + irResult.errors + irdResult.errors + icdResult.errors;
  console.log(`  TOTAL: ${totalSuccess} imported, ${totalErrors} errors`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('\n💥 FATAL ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
