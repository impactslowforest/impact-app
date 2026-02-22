/**
 * Import Dry Mill & Harvesting data from "Dry Mill _ Harvesting log book.xlsx" into PocketBase.
 *
 * Usage:
 *   node scripts/import-drymill-data.mjs <admin-email> <admin-password>
 *
 * Sheets imported (in order):
 *   1. Drop WH             → warehouse_lookups (56 rows)
 *   2. Supplier data        → suppliers (6 rows)
 *   3. Harvesting log       → harvesting_logs (3,625 rows)
 *   4. Farmer log book      → farmer_log_books (78 rows)
 *   5. Farm log book        → farm_log_books (106 rows)
 *   6. Log book detail      → log_book_details (140 rows)
 *   7. Inbound request      → inbound_requests (45 rows)
 *   8. Inbound request detail → inbound_request_details (43 rows)
 *   9. Inbound check detail → inbound_check_details (308 rows)
 *
 * All data is Laos 2024/2025 season.
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Dry Mill _ Harvesting log book.xlsx');
const COUNTRY = 'laos';
const SEASON = '2024/2025';

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-drymill-data.mjs <admin-email> <admin-password>');
  process.exit(1);
}

// ── Helpers ──

/** Convert Excel serial date to ISO string (YYYY-MM-DD) */
function excelDateToISO(serial) {
  if (!serial) return '';
  if (typeof serial === 'string') {
    // Try parsing date strings like "Mon Feb 17 2025..."
    const d = new Date(serial);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return '';
  }
  if (typeof serial !== 'number') return '';
  // Excel serial dates: integer part = date, fractional = time
  const date = new Date((serial - 25569) * 86400 * 1000);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

/** Convert Excel serial to hours (for fermentation) */
function excelFractionToHours(serial) {
  if (!serial || typeof serial !== 'number') return 0;
  // If it looks like hours already (> 1 and < 200)
  if (serial > 1 && serial < 200) return serial;
  // If fraction of a day (e.g. 0.625 = 15 hours)
  if (serial > 0 && serial < 1) return Math.round(serial * 24 * 10) / 10;
  return 0;
}

/** Parse lat,lng string */
function parseLatLng(raw) {
  if (!raw || typeof raw !== 'string') return { lat: 0, lng: 0 };
  const parts = raw.split(',').map(s => parseFloat(s.trim()));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return { lat: 0, lng: 0 };
}

/** Safe number parse */
function num(val) {
  if (val === undefined || val === null || val === '') return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

/** Safe string */
function str(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

/** Format error detail */
function errDetail(err) {
  return JSON.stringify(err.response?.data || err.data || err.message);
}

/** Batch import helper with progress */
async function batchImport(pb, collection, rows, mapFn, label) {
  let created = 0, skipped = 0, errors = 0;
  const codeMap = new Map(); // code → PB record ID

  // Check existing records
  let existingCodes = new Set();
  try {
    const codeField = collection === 'warehouse_lookups' ? 'lookup_code' :
      collection === 'suppliers' ? 'supplier_code' :
      collection === 'harvesting_logs' ? 'log_code' :
      collection === 'farmer_log_books' ? 'log_code' :
      collection === 'farm_log_books' ? 'log_code' :
      collection === 'log_book_details' ? 'lot_code' :
      collection === 'inbound_requests' ? 'inbound_code' :
      collection === 'inbound_request_details' ? 'detail_code' :
      collection === 'inbound_check_details' ? 'check_code' : 'id';

    const existing = await pb.collection(collection).getFullList({ fields: `id,${codeField}` });
    for (const rec of existing) {
      existingCodes.add(rec[codeField]);
      codeMap.set(rec[codeField], rec.id);
    }
  } catch (e) {
    // Collection may be empty
  }

  for (let i = 0; i < rows.length; i++) {
    const result = mapFn(rows[i], i);
    if (!result) { skipped++; continue; }

    const { code, data } = result;

    if (existingCodes.has(code)) {
      codeMap.set(code, codeMap.get(code)); // already mapped
      skipped++;
      continue;
    }

    try {
      const record = await pb.collection(collection).create(data);
      codeMap.set(code, record.id);
      created++;
      if (created % 50 === 0) {
        process.stdout.write(`  ✓ ${created} ${label} created...\r`);
      }
    } catch (err) {
      errors++;
      if (errors <= 5) {
        console.error(`  ✗ [${code}] ${errDetail(err)}`);
      }
    }
  }

  if (created > 0) process.stdout.write('\n');
  console.log(`  ✓ ${label}: ${created} created, ${skipped} skipped, ${errors} errors`);
  return codeMap;
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Impact App — Dry Mill & Harvesting Data Import');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Excel: ${EXCEL_PATH}`);
  console.log(`  PocketBase: ${PB_URL}`);
  console.log(`  Country: ${COUNTRY} | Season: ${SEASON}`);
  console.log('');

  // 1. Connect to PocketBase (superuser first)
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    console.log(`✓ Authenticated as superuser: ${adminEmail}`);
  } catch (err) {
    try {
      await pb.collection('users').authWithPassword(adminEmail, adminPassword);
      console.log(`✓ Authenticated as user: ${pb.authStore.record?.email}`);
      console.log('  ⚠ Warning: Regular user auth — API Rules may block operations');
    } catch (err2) {
      console.error('✗ Authentication failed.');
      console.error(err2.message);
      process.exit(1);
    }
  }

  // 2. Read Excel
  console.log('\n── Reading Excel file ──');
  const workbook = XLSX.readFile(EXCEL_PATH);
  console.log(`  Sheets: ${workbook.SheetNames.join(', ')}`);

  const getRows = (name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet) { console.warn(`  ⚠ Sheet "${name}" not found`); return []; }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`  ${name}: ${rows.length} rows`);
    return rows;
  };

  const dropWhRows = getRows('Drop WH');
  const supplierRows = getRows('Supplier data');
  const harvestRows = getRows('Harvesting log');
  const farmerLogRows = getRows('Farmer log book');
  const farmLogRows = getRows('Farm log book');
  const logDetailRows = getRows('Log book detail');
  const inboundRows = getRows('Inbound request');
  const inboundDetailRows = getRows('Inbound request detail');
  const inboundCheckRows = getRows('Inbound check detail');

  // 3. Build farmer/farm lookup maps (existing PB records)
  console.log('\n── Building reference maps ──');

  const farmerCodeToId = new Map();
  const farmCodeToId = new Map();

  try {
    const allFarmers = await pb.collection('farmers').getFullList({ fields: 'id,farmer_code' });
    for (const f of allFarmers) farmerCodeToId.set(f.farmer_code, f.id);
    console.log(`  Farmers: ${farmerCodeToId.size} records mapped`);
  } catch (e) {
    console.log('  ⚠ Could not fetch farmers');
  }

  try {
    const allFarms = await pb.collection('farms').getFullList({ fields: 'id,farm_code' });
    for (const f of allFarms) farmCodeToId.set(f.farm_code, f.id);
    console.log(`  Farms: ${farmCodeToId.size} records mapped`);
  } catch (e) {
    console.log('  ⚠ Could not fetch farms');
  }

  // ════════════════════════════════════════════════════════════════
  // IMPORT 1: Drop WH → warehouse_lookups
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [1/9] Importing warehouse_lookups (Drop WH) ──');
  await batchImport(pb, 'warehouse_lookups', dropWhRows, (row) => {
    const code = str(row['ID']);
    if (!code) return null;
    return {
      code,
      data: {
        lookup_code: code,
        category: str(row['Category']),
        label: str(row['Label']),
      },
    };
  }, 'lookups');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 2: Supplier data → suppliers
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [2/9] Importing suppliers ──');
  const supplierMap = await batchImport(pb, 'suppliers', supplierRows, (row) => {
    const code = str(row['Supplier ID']);
    if (!code) return null;
    return {
      code,
      data: {
        supplier_code: code,
        source: str(row['Source']),
        company_name: str(row['Company name']),
        province: str(row['Province']),
        district: str(row['District']),
        village: str(row['Village']),
        company_address: str(row['Company address']),
        representative_name: str(row['Representative name']),
        certifications: str(row['Certifications']),
        main_products: str(row['Main Products']),
        phone: str(row['Phone']),
        email: str(row['Email']),
        website: str(row['Website']),
        processing_methods: str(row['Processing Methods']),
        packaging_options: str(row['Packaging Options']),
        shipping_methods: str(row['Shipping Methods']),
        min_order_quantity_kg: num(row['Minimum Order Quantity']),
        payment_terms: str(row['Payment Terms']),
        country: COUNTRY,
        is_active: true,
      },
    };
  }, 'suppliers');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 3: Harvesting log → harvesting_logs (3,625 rows — largest)
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [3/9] Importing harvesting_logs ──');
  await batchImport(pb, 'harvesting_logs', harvestRows, (row) => {
    const code = str(row['Harvesting log ID']);
    if (!code) return null;

    const { lat, lng } = parseLatLng(str(row['Location']));
    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';
    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';

    return {
      code,
      data: {
        log_code: code,
        farmer: farmerId,
        farm: farmId,
        village_code: str(row['Village ID']),
        village_name: str(row['Village']),
        farmer_name: str(row['Farmer name']),
        farm_name: str(row['Farm name']),
        variety: str(row['Variety']),
        species: str(row['Species']),
        picking_date: excelDateToISO(row['Picking date']),
        latitude: lat,
        longitude: lng,
        staff_input: str(row['Staff input']),
        date_report: excelDateToISO(row['Date report']),
        eu_organic_kg: num(row['EU Organic (kg)']),
        fairtrade_kg: num(row['FairTrade (kg)']),
        non_certificate_kg: num(row['Non-Certificate (kg)']),
        cherry_picked_kg: num(row['Amount of cherry/Ripe picked (kg)']),
        ripe_pulped_kg: num(row['Ripe pulped (kg)']),
        float_rate_kg: num(row['Float rate (kg)']),
        fermentation_hours: excelFractionToHours(row['Fermentation (Hrs)']),
        fermentation_date: excelDateToISO(row['Fermentation date']),
        wet_parchment_kg: num(row['Wet parchment (Kg)']),
        rate_parchment: num(row['Rate parchment']),
        dry_parchment_kg: num(row['Dry parchment (Kg)']),
        drying_days: num(row['No of days for drying']),
        drying_start_date: excelDateToISO(row['Date start drying']),
        drying_end_date: excelDateToISO(row['Date finish drying']),
        moisture_pct: num(row['Moisture (%)']),
        stored_at: str(row['Stored at']),
        transport_date: excelDateToISO(row['Transport to Dry mill']),
        remark: str(row['Remark']),
        status: str(row['Status']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'harvesting logs');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 4: Farmer log book → farmer_log_books
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [4/9] Importing farmer_log_books ──');
  const farmerLogMap = await batchImport(pb, 'farmer_log_books', farmerLogRows, (row) => {
    const code = str(row['Farmer log book ID']);
    if (!code) return null;

    const { lat, lng } = parseLatLng(str(row['Location']));
    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';

    return {
      code,
      data: {
        log_code: code,
        farmer: farmerId,
        village_code: str(row['Village ID']),
        farmer_name: str(row['Farmer name']),
        variety: str(row['Variety']),
        process: str(row['Process']),
        eu_organic_kg: num(row['EU Organic (kg)']),
        fairtrade_kg: num(row['FairTrade (kg)']),
        non_certificate_kg: num(row['Non-Certificate (kg)']),
        log_date: excelDateToISO(row['Date']),
        latitude: lat,
        longitude: lng,
        dry_mill_name: str(row['Dry mill name']),
        moisture_pct: num(row['Moisture (%)']),
        aw_level: num(row['aW level']),
        number_of_bags: num(row['Number of bag']),
        weight_total_kg: num(row['Weight total (kg)']),
        delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
        remark: str(row['Remark']),
        staff_input: str(row['Who input']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'farmer log books');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 5: Farm log book → farm_log_books
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [5/9] Importing farm_log_books ──');
  const farmLogMap = await batchImport(pb, 'farm_log_books', farmLogRows, (row) => {
    const code = str(row['Farm log book ID']);
    if (!code) return null;

    const { lat, lng } = parseLatLng(str(row['Location']));
    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';
    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';
    const farmerLogId = farmerLogMap.get(str(row['Farmer log book ID'])) || '';

    return {
      code,
      data: {
        log_code: code,
        farmer: farmerId,
        farm: farmId,
        farmer_log_book: farmerLogId,
        village_code: str(row['Village ID']),
        farm_name: str(row['Farm name']),
        certificate: str(row['Certificate']),
        variety: str(row['Variety']),
        process: str(row['Process']),
        log_date: excelDateToISO(row['Date']),
        latitude: lat,
        longitude: lng,
        dry_mill_name: str(row['Dry mill name']),
        moisture_pct: num(row['Moisture (%)']),
        aw_level: num(row['aW lavel']),
        number_of_bags: num(row['Number of bag']),
        weight_per_bag_kg: num(row['Weight per bag (kg)']),
        weight_total_kg: num(row['Weight total (kg)']),
        delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
        remark: str(row['Remark']),
        staff_input: str(row['Who input']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'farm log books');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 6: Log book detail → log_book_details
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [6/9] Importing log_book_details ──');
  await batchImport(pb, 'log_book_details', logDetailRows, (row) => {
    const code = str(row['Lot ID']);
    if (!code) return null;

    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';
    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';
    const farmerLogId = farmerLogMap.get(str(row['Farmer log book ID'])) || '';
    const farmLogId = farmLogMap.get(str(row['Farm log book ID'])) || '';

    return {
      code,
      data: {
        lot_code: code,
        farmer: farmerId,
        farm: farmId,
        farmer_log_book: farmerLogId,
        farm_log_book: farmLogId,
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
        weight_total_kg: num(row['Weight total (kg)']),
        weight_per_bag_kg: num(row['Weight per bag (kg)']),
        delivery_date: excelDateToISO(row['Delivery Date to dry mill']),
        sale_status: str(row['Sale status']),
        remark: str(row['Remark']),
        staff_input: str(row['Who input']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'log book details');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 7: Inbound request → inbound_requests
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [7/9] Importing inbound_requests ──');
  const inboundMap = await batchImport(pb, 'inbound_requests', inboundRows, (row) => {
    const code = str(row['Inbound ID']);
    if (!code) return null;

    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';
    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';
    const supplierId = supplierMap.get(str(row['Suplier ID'])) || '';

    return {
      code,
      data: {
        inbound_code: code,
        source: str(row['Sources']),
        input_type: str(row['Input type']),
        farmer: farmerId,
        farm: farmId,
        supplier: supplierId,
        village_code: str(row['Village ID']),
        village_name: str(row['Village Name']),
        farmer_name: str(row['Farmer name']),
        staff: str(row['Staff']),
        request_date: excelDateToISO(row['Inbound Request Date']),
        variety: str(row['Variety']),
        process: str(row['Process']),
        total_bags: num(row['Total No.of Bags']),
        moisture_pct: num(row['Moisture Level %']),
        weight_total_kg: num(row['Weight total (kg)']),
        check_bags: num(row['Check No.of Bags']),
        check_moisture_pct: num(row['Check Moisture Level %']),
        check_weight_kg: num(row['Check Weight total (kg)']),
        requestor_info: str(row['Requestor Name/Department/Phone']),
        status: str(row['Status']),
        vehicle_number: str(row['Vehicle Number']),
        approval_status: str(row['Approval status']),
        outbound_status: str(row['Outbound_status']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'inbound requests');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 8: Inbound request detail → inbound_request_details
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [8/9] Importing inbound_request_details ──');
  const inboundDetailMap = await batchImport(pb, 'inbound_request_details', inboundDetailRows, (row) => {
    const code = str(row['Inbound detail ID']);
    if (!code) return null;

    const farmerId = farmerCodeToId.get(str(row['Farmer ID'])) || '';
    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';
    const inboundId = inboundMap.get(str(row['Inbound ID'])) || '';

    return {
      code,
      data: {
        detail_code: code,
        inbound_request: inboundId,
        farmer: farmerId,
        farm: farmId,
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
        re_total_qty: num(row['Re-Total Quantity']),
        re_uom: str(row['Re-UOM']),
        re_moisture_pct: num(row['Re-Moisture Level %']),
        re_aw_level: str(row['Re-Active Water Level']),
        wh_type: str(row['Wh-Type']),
        wh_organic: str(row['Wh-Organic']),
        wh_fairtrade: str(row['Wh-Fair Trade']),
        wh_bags: num(row['Wh-No.of Bags']),
        wh_qty_per_bag: num(row['Wh-Quantity per Bags']),
        wh_total_qty: num(row['Wh-Total Quantity']),
        wh_uom: str(row['Wh-UOM']),
        wh_moisture_pct: num(row['Wh-Moisture Level %']),
        wh_aw_level: str(row['Wh-Active Water Level']),
        quality_assessment: str(row['Quality assessment']),
        status: str(row['Status']),
        approval_status: str(row['Approval Status']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'inbound request details');

  // ════════════════════════════════════════════════════════════════
  // IMPORT 9: Inbound check detail → inbound_check_details
  // ════════════════════════════════════════════════════════════════
  console.log('\n── [9/9] Importing inbound_check_details ──');
  await batchImport(pb, 'inbound_check_details', inboundCheckRows, (row) => {
    const code = str(row['Sub Lot ID']);
    if (!code) return null;

    const farmId = farmCodeToId.get(str(row['Farm ID'])) || '';
    const inboundId = inboundMap.get(str(row['Inbound ID'])) || '';
    const inboundDetailId = inboundDetailMap.get(str(row['Inbound detail ID'])) || '';

    return {
      code,
      data: {
        check_code: code,
        inbound_request: inboundId,
        inbound_detail: inboundDetailId,
        farm: farmId,
        lot_detail_code: str(row['LOT ID detail']),
        staff: str(row['Staff']),
        check_date: excelDateToISO(row['Date']),
        moisture_pct: num(row['Moisture']),
        total_bag_weight_kg: num(row['Total bag weight']),
        number_of_bags: num(row['No of Bags']),
        weight_per_bag_kg: num(row['Weight per bag']),
        remark: str(row['Remark']),
        country: COUNTRY,
        season: SEASON,
      },
    };
  }, 'inbound check details');

  // ════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Import Complete!');
  console.log('═══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
