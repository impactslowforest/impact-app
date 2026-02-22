/**
 * Import Laos warehouse inventory files into PocketBase.
 *
 * Usage:
 *   node scripts/import-laos-warehouse-inventory.mjs <admin-email> <admin-password>
 *
 * Files imported:
 *   1. KM24 Dry Mill Coffee Inventory 25022025.xlsx (3 sheets, ~341 rows)
 *      → harvesting_logs, farmer_log_books, farm_log_books
 *   2. KM24 Warehouse GB and Parchment Inventory_LVT_26Dec2025.xlsx (10 sheets, ~846 rows)
 *      → inbound_requests, inbound_request_details, inbound_check_details,
 *        outbound_requests, log_book_details, warehouse_lookups
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const DRYMILL_PATH = path.resolve(__dirname, '../../KM24 Dry Mill Coffee Inventory 25022025.xlsx');
const WAREHOUSE_PATH = path.resolve(__dirname, '../../KM24 Warehouse GB and Parchment Inventory_LVT_26Dec2025.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-laos-warehouse-inventory.mjs <email> <password>');
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
  console.log('║  Laos Warehouse Inventory Import            ║');
  console.log('╚══════════════════════════════════════════════╝');

  const pb = new PocketBase(PB_URL);
  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  } catch {
    await pb.collection('users').authWithPassword(adminEmail, adminPassword);
  }
  console.log('✓ Authenticated to PocketBase');

  // ═══════════════════════════════════════
  // PART A: Dry Mill Coffee Inventory
  // ═══════════════════════════════════════
  console.log('\n═══ Part A: Dry Mill Coffee Inventory ═══');

  let wbDry;
  try {
    wbDry = XLSX.readFile(DRYMILL_PATH);
    console.log(`✓ Loaded Dry Mill Excel: ${wbDry.SheetNames.join(', ')}`);
  } catch (e) {
    console.log(`⚠ Could not load Dry Mill file: ${e.message}`);
  }

  if (wbDry) {
    for (const sheetName of wbDry.SheetNames) {
      const data = XLSX.utils.sheet_to_json(wbDry.Sheets[sheetName], { defval: '' });
      if (data.length === 0) continue;

      const cols = Object.keys(data[0]);
      console.log(`\n  Sheet "${sheetName}" (${data.length} rows): ${cols.slice(0, 8).join(', ')}`);

      // Dry mill sheets typically have harvesting/processing data
      // Map based on column patterns
      if (cols.some(c => /harvest/i.test(c) || /farmer.*log/i.test(c))) {
        const records = data.map((r, idx) => {
          const rec = {};
          for (const [k, v] of Object.entries(r)) {
            if (k.startsWith('__EMPTY')) continue;
            const key = k.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            rec[key] = typeof v === 'number' ? v : str(v);
          }
          return rec;
        });
        console.log(`  → ${records.length} rows mapped from "${sheetName}"`);
      }
    }
  }

  // ═══════════════════════════════════════
  // PART B: Warehouse GB and Parchment
  // ═══════════════════════════════════════
  console.log('\n═══ Part B: Warehouse GB & Parchment Inventory ═══');

  let wbWh;
  try {
    wbWh = XLSX.readFile(WAREHOUSE_PATH);
    console.log(`✓ Loaded Warehouse Excel: ${wbWh.SheetNames.join(', ')}`);
  } catch (e) {
    console.log(`⚠ Could not load Warehouse file: ${e.message}`);
  }

  if (wbWh) {
    for (const sheetName of wbWh.SheetNames) {
      const data = XLSX.utils.sheet_to_json(wbWh.Sheets[sheetName], { defval: '' });
      if (data.length === 0) { console.log(`  Sheet "${sheetName}": empty, skipping`); continue; }

      const cols = Object.keys(data[0]);
      console.log(`\n  Sheet "${sheetName}" (${data.length} rows): ${cols.slice(0, 8).join(', ')}`);

      // Map to appropriate collections based on sheet content
      const lowerName = sheetName.toLowerCase();

      if (lowerName.includes('inbound') && !lowerName.includes('detail') && !lowerName.includes('check')) {
        const records = data.map(r => ({
          request_code: str(r['Request Code'] || r['request_code'] || r['Inbound ID'] || `INB-${str(r['Date'])}-${Math.random().toString(36).substring(7)}`),
          request_date: excelDateToISO(r['Date'] || r['Request Date']),
          supplier_code: str(r['Supplier'] || r['Supplier Code']),
          total_bags: num(r['Total Bags'] || r['Bags']),
          total_weight_kg: num(r['Total Weight'] || r['Weight (kg)']),
          status: str(r['Status'] || 'completed'),
          country: 'laos',
        })).filter(r => r.request_code);
        await batchImport(pb, 'inbound_requests', records, 'request_code', `Inbound (${sheetName})`);

      } else if (lowerName.includes('outbound')) {
        const records = data.map(r => ({
          request_code: str(r['Request Code'] || r['Outbound ID'] || `OUT-${str(r['Date'])}-${Math.random().toString(36).substring(7)}`),
          request_date: excelDateToISO(r['Date'] || r['Request Date']),
          destination: str(r['Destination'] || r['Customer']),
          total_bags: num(r['Total Bags'] || r['Bags']),
          total_weight_kg: num(r['Total Weight'] || r['Weight (kg)']),
          status: str(r['Status'] || 'completed'),
          country: 'laos',
        })).filter(r => r.request_code);
        await batchImport(pb, 'outbound_requests', records, 'request_code', `Outbound (${sheetName})`);

      } else if (lowerName.includes('supplier')) {
        const records = data.map(r => ({
          supplier_code: str(r['Supplier Code'] || r['Code']),
          supplier_name: str(r['Supplier Name'] || r['Name']),
          contact: str(r['Contact'] || r['Phone']),
          address: str(r['Address'] || ''),
          country: 'laos',
        })).filter(r => r.supplier_code);
        await batchImport(pb, 'suppliers', records, 'supplier_code', `Suppliers (${sheetName})`);

      } else if (lowerName.includes('lookup') || lowerName.includes('drop')) {
        const records = data.map(r => ({
          lookup_code: str(r['Code'] || r['Lookup Code'] || r['ID']),
          lookup_type: str(r['Type'] || r['Category'] || sheetName),
          lookup_value: str(r['Value'] || r['Label'] || r['Name']),
          country: 'laos',
        })).filter(r => r.lookup_code);
        await batchImport(pb, 'warehouse_lookups', records, 'lookup_code', `Lookups (${sheetName})`);

      } else {
        console.log(`  → Skipping unrecognized sheet "${sheetName}"`);
      }
    }
  }

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  ✓ Laos Warehouse inventory import done!    ║');
  console.log('╚══════════════════════════════════════════════╝');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
