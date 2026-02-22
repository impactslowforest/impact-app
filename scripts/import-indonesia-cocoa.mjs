/**
 * Import Cocoa purchase_Main data.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-indonesia-cocoa.mjs <admin-email> <admin-password>
 *
 * Sheets imported:
 *   - Drop (29 rows) → id_cocoa_lookups
 *   - Farmer group (5 rows) → id_farmer_groups
 *   - Farmers (275 rows) → farmers (country=indonesia)
 *   - Farms (319 rows) → farms (country=indonesia)
 *   - Batch (8 rows) → id_cocoa_batches
 *   - BatchLogs (18 rows) → id_cocoa_batch_logs
 *   - Batch Logs detail (27 rows) → id_cocoa_batch_details
 *   - Price (13 rows) → id_cocoa_prices
 *   - RecapAll2025 (317 rows) → id_cocoa_recaps
 *   - Farmer Contract (173 rows) → id_farmer_contracts
 *
 * Skipped: Main data stuture, Admin (exists in migration 017),
 *          Company Purchases/Inbound/Inbound detail (empty)
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Cocoa purchase_Main data.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-indonesia-cocoa.mjs <email> <password>');
  process.exit(1);
}

function excelDateToISO(serial) {
  if (!serial) return '';
  if (typeof serial === 'string') return serial;
  const date = new Date((serial - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}
function num(val) {
  if (val === undefined || val === null || val === '') return 0;
  const n = parseFloat(String(val).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}
function str(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

function parseLatLng(loc) {
  if (!loc) return { lat: 0, lng: 0 };
  const parts = String(loc).split(',').map(s => parseFloat(s.trim()));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return { lat: 0, lng: 0 };
}

async function batchImport(pb, collection, records, uniqueField, label) {
  console.log(`\n── Importing ${label} (${records.length} rows) → ${collection} ──`);
  let created = 0, updated = 0, skipped = 0, errors = 0;

  const existingMap = new Map();
  if (uniqueField) {
    try {
      const existing = await pb.collection(collection).getFullList({ fields: `id,${uniqueField}` });
      for (const r of existing) existingMap.set(r[uniqueField], r.id);
    } catch (e) { /* collection may be empty */ }
  }

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    if (!rec) { skipped++; continue; }
    const key = uniqueField ? rec[uniqueField] : null;
    if (uniqueField && !key) { skipped++; continue; }

    try {
      if (key && existingMap.has(key)) {
        await pb.collection(collection).update(existingMap.get(key), rec);
        updated++;
      } else {
        const created_rec = await pb.collection(collection).create(rec);
        if (key) existingMap.set(key, created_rec.id);
        created++;
      }
    } catch (e) {
      errors++;
      if (errors <= 5) console.error(`  Row ${i + 1}: ${e.message}`);
    }

    if ((i + 1) % 200 === 0) console.log(`  Progress: ${i + 1}/${records.length}`);
  }

  console.log(`  ✓ ${label}: ${created} created, ${updated} updated, ${skipped} skipped, ${errors} errors`);
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Indonesia Cocoa Purchase Data Import       ║');
  console.log('╚══════════════════════════════════════════════╝');

  const pb = new PocketBase(PB_URL);
  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  } catch {
    await pb.collection('users').authWithPassword(adminEmail, adminPassword);
  }
  console.log('✓ Authenticated to PocketBase');

  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`✓ Loaded Excel: ${wb.SheetNames.length} sheets`);

  function sheet(name) {
    return XLSX.utils.sheet_to_json(wb.Sheets[name] || {}, { defval: '' });
  }

  // ─── 1. LOOKUPS (Drop) ───
  const lookups = sheet('Drop').map(r => ({
    drop_id:        str(r['Drop ID']),
    drop_condition: str(r['Drop condition']),
    drop_label:     str(r['Drop label']),
    notes:          str(r['Notes']),
  })).filter(r => r.drop_id);
  await batchImport(pb, 'id_cocoa_lookups', lookups, 'drop_id', 'Cocoa Lookups');

  // ─── 2. FARMER GROUPS ───
  const groups = sheet('Farmer group').map(r => ({
    group_id:       str(r['Farmer group ID']),
    group_name:     str(r['Farmer group name']),
    staff_id:       str(r['Staff ID']),
    coordinator_id: str(r['Coordinator ID']),
    total_area_ha:  num(r['Total areas (ha)']),
    total_value_kg: num(r['Total valuve (kg)']),
    num_farmers:    num(r['Number of farmers']),
    num_farms:      num(r['Number of farms']),
    address:        str(r['Address']),
  })).filter(r => r.group_id);
  await batchImport(pb, 'id_farmer_groups', groups, 'group_id', 'Farmer Groups');

  // ─── 3. FARMERS (→ existing farmers collection) ───
  const farmers = sheet('Farmers').map(r => {
    const farmerId = str(r['Farmer ID']);
    if (!farmerId) return null;
    return {
      farmer_code:    farmerId,
      farmer_name:    str(r['Farmer name']),
      phone:          str(r['Phone number']),
      national_id:    str(r['National ID number']),
      year_of_birth:  num(r['Year of Birth']),
      gender:         num(r['Gender']) === 1 ? 'male' : 'female',
      num_farms:      num(r['Number of farm']),
      num_workers:    num(r['Number of permanent workers']),
      total_stock_kg: num(r['Total stock (kg)']),
      total_area_ha:  num(r['Total areas (ha)']),
      country:        'indonesia',
      commodity:      'cacao',
    };
  }).filter(Boolean);
  await batchImport(pb, 'farmers', farmers, 'farmer_code', 'Indonesia Farmers');

  // ─── 4. FARMS (→ existing farms collection) ───
  const farms = sheet('Farms').map(r => {
    const farmId = str(r['Farm ID']);
    if (!farmId) return null;
    const loc = parseLatLng(r['Location']);
    return {
      farm_code:    farmId,
      farmer_code:  str(r['Farmer ID']),
      area_ha:      num(r['Area (ha)']),
      total_value_kg: num(r['Total value (kg)']),
      clone:        str(r['Clone']),
      farm_type:    str(r['Type']),
      latitude:     loc.lat,
      longitude:    loc.lng,
      estimate_kg:  num(r['Estimate (kg)']),
      country:      'indonesia',
      commodity:    'cacao',
    };
  }).filter(Boolean);
  await batchImport(pb, 'farms', farms, 'farm_code', 'Indonesia Farms');

  // ─── 5. BATCHES ───
  const batches = sheet('Batch').map(r => ({
    batch_id:         str(r['Batch ID']),
    staff_id:         str(r['Staff ID']),
    batch_date:       excelDateToISO(r['Date']),
    farmer_group_id:  str(r['Farmer group ID']),
    coordinator_id:   str(r['Coordinator ID']),
    total_wet_beans_kg: num(r['Total Wet Beans (Kg)']),
    total_wet_bean_price: num(r['Total wet bean price (IDR)']),
    product_type:     str(r['Product type']),
  })).filter(r => r.batch_id);
  await batchImport(pb, 'id_cocoa_batches', batches, 'batch_id', 'Cocoa Batches');

  // ─── 6. BATCH LOGS ───
  const batchLogs = sheet('BatchLogs').map(r => ({
    batchlog_id:        str(r['Batchlogs ID']),
    batch_id:           str(r['Batch ID']),
    staff_id:           str(r['Staff ID']),
    log_date:           excelDateToISO(r['Date']),
    farmer_id_text:     str(r['Farmer ID']),
    total_wet_beans_kg: num(r['Total Wet Beans (Kg)']),
    estimated_dry_beans_kg: num(r['Estimated Dry Beans (Kg)']),
    total_wet_bean_price: num(r['Total wet bean price (IDR)']),
    debit_idr:          num(r['Detbit (IDR)']),
    item_description:   str(r['Item Description']),
    payment_due:        str(r['Payment Due']),
    fermentation_days:  num(r['Fermentation (Days)']),
    drying_days:        num(r['Drying (Days)']),
    packing_days:       num(r['Packing (Days)']),
    shipping_days:      num(r['Shipping (Days)']),
    other_days:         num(r['Others (Days)']),
    total_days:         num(r['Total (Days)']),
    dry_beans_kg:       num(r['Dry Beans (Kg)']),
  })).filter(r => r.batchlog_id);
  await batchImport(pb, 'id_cocoa_batch_logs', batchLogs, 'batchlog_id', 'Batch Logs');

  // ─── 7. BATCH LOG DETAILS ───
  const batchDetails = sheet('Batch Logs detail').map(r => ({
    batch_detail_id:    str(r['Batch detail ID ']),
    batchlog_id:        str(r['Batchlogs ID']),
    staff_id:           str(r['Staff ID']),
    detail_date:        excelDateToISO(r['Date']),
    farm_id_text:       str(r['Farm ID']),
    cocoa_clone:        str(r['Cocoa clone']),
    certificate_detail: str(r['Certificate detail']),
    wet_beans_kg:       num(r['Wet Beans (Kg)']),
    bean_price_per_kg:  num(r['Bean Price per kg (IDR)']),
    premium_price:      num(r['Premium price (IDR)']),
    total_wet_bean_amount: num(r['Total wet bean amount (IDR)']),
    total_premium_amount:  num(r['Total premium amount (IDR)']),
    price_id:           str(r['Price ID']),
  })).filter(r => r.batch_detail_id);
  await batchImport(pb, 'id_cocoa_batch_details', batchDetails, 'batch_detail_id', 'Batch Details');

  // ─── 8. PRICES ───
  const prices = sheet('Price').map(r => ({
    price_id:          str(r['Price ID']),
    coordinator_id:    str(r['Coordinator ID']),
    price_date:        excelDateToISO(r['Date']),
    wb_price_clonal:   num(r['Krakakoa wet bean price per kg - clonal']),
    wb_price_local:    num(r['Krakakoa wet bean price per kg - local']),
    wb_price_mix:      num(r['Krakakoa wet bean price per kg - mix']),
    local_db_price_clonal: num(r['Local dry bean price per kg - clonal']),
    local_db_price_local:  num(r['Local dry bean price per kg - local']),
    local_db_price_mix:    num(r['Local dry bean price per kg - mix']),
    est_db_price_clonal:   num(r['Estimate Krakakoa dry bean price per kg - clonal']),
    est_db_price_local:    num(r['Estimate Krakakoa dry bean price per kg - local']),
    est_db_price_mix:      num(r['Estimate Krakakoa dry bean price per kg - mix']),
    est_premium_clonal:    num(r['Estimate Premium dry bean price per kg - clonal']),
    est_premium_local:     num(r['Estimate Premium dry bean price per kg - local']),
    est_premium_mix:       num(r['Estimate Premium dry bean price per kg - mix']),
  })).filter(r => r.price_id);
  await batchImport(pb, 'id_cocoa_prices', prices, 'price_id', 'Cocoa Prices');

  // ─── 9. RECAPS ───
  const recaps = sheet('RecapAll2025').map(r => ({
    farm_id_text:      str(r['Farm ID']),
    sold_to_krakakoa:  num(r['Sold to Krakakoa']),
    sold_to_others:    num(r['Sold to Others']),
    quota:             num(r['Quota']),
    remaining:         num(r['Remaining']),
    historical_total_premium: num(r['Historical Total Premium']),
    remarks:           str(r['Remarks']),
  })).filter(r => r.farm_id_text);
  await batchImport(pb, 'id_cocoa_recaps', recaps, 'farm_id_text', 'Cocoa Recaps');

  // ─── 10. FARMER CONTRACTS ───
  const contracts = sheet('Farmer Contract').map(r => ({
    contract_id:     str(r['Contract ID']),
    farmer_id_text:  str(r['Farmer ID']),
    staff_id:        str(r['Staff ID']),
    contract_date:   excelDateToISO(r['Date']),
    province:        str(r['Province']),
    district:        str(r['District']),
    commune:         str(r['Commune']),
    village:         str(r['Village']),
    village_id:      str(r['Village ID']),
    farmer_name:     str(r["Farmer's name"]),
    gender:          str(r['Gender']),
    id_number:       str(r['ID number']),
    farmer_address:  str(r['Farmer Address']),
    contact_number:  str(r['Contact number']),
    group_name:      str(r['Group name']),
  })).filter(r => r.contract_id);
  await batchImport(pb, 'id_farmer_contracts', contracts, 'contract_id', 'Farmer Contracts');

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  ✓ Indonesia Cocoa import complete!         ║');
  console.log('╚══════════════════════════════════════════════╝');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
