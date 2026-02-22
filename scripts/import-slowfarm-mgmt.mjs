/**
 * Import Slow Farm management.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-slowfarm-mgmt.mjs <admin-email> <admin-password>
 *
 * Sheets:
 *   - Check roll → sf_check_rolls (25,970 rows)
 *   - Check roll detail → sf_check_roll_details (25,948 rows)
 *   - Payroll → sf_payroll
 *   - Payroll detail → sf_payroll_details
 *   - Worker info → workers (update/create)
 *   - Worker task detail → sf_worker_tasks
 *   - FarmRates → sf_farm_rates
 *   - Drop check roll → sf_lookups
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Slow Farm management.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-slowfarm-mgmt.mjs <email> <password>');
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
  const n = parseFloat(val);
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
    const key = uniqueField ? rec[uniqueField] : null;
    if (!key && uniqueField) { skipped++; continue; }

    try {
      if (existingMap.has(key)) {
        await pb.collection(collection).update(existingMap.get(key), rec);
        updated++;
      } else {
        const created_rec = await pb.collection(collection).create(rec);
        if (uniqueField) existingMap.set(key, created_rec.id);
        created++;
      }
    } catch (e) {
      errors++;
      if (errors <= 5) console.log(`  ✗ Error row ${i}: ${e.message?.substring(0, 200)}`);
    }

    if ((i + 1) % 500 === 0) process.stdout.write(`  ${i + 1}/${records.length}\r`);
  }

  console.log(`  ✓ ${label}: created=${created}, updated=${updated}, skipped=${skipped}, errors=${errors}`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Impact App — Slow Farm Management Import');
  console.log('═══════════════════════════════════════════════════');

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    console.log(`✓ Authenticated as superuser`);
  } catch {
    try {
      await pb.collection('users').authWithPassword(adminEmail, adminPassword);
      console.log(`✓ Authenticated as user`);
    } catch (e) {
      console.error('✗ Auth failed:', e.message);
      process.exit(1);
    }
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = (name) => {
    const ws = wb.Sheets[name];
    if (!ws) { console.log(`  ⚠ Sheet "${name}" not found`); return []; }
    return XLSX.utils.sheet_to_json(ws, { defval: '' });
  };

  // Pre-load slow_farm IDs
  const sfMap = new Map();
  try {
    const sfs = await pb.collection('slow_farms').getFullList({ fields: 'id,farm_code' });
    sfs.forEach(s => sfMap.set(s.farm_code, s.id));
  } catch {}

  // ========================================================
  // 1. Drop check roll → sf_lookups
  // ========================================================
  const dropRows = sheet('Drop check roll');
  const dropRecs = dropRows.filter(r => str(r['ID'])).map(r => ({
    lookup_id: str(r['ID']),
    category: str(r['Categeory']),
    label: str(r['Label']),
    value: num(r['Value']),
    calculation_method: str(r['CalculationMethod']),
    default_unit: str(r['DefaultUnit']),
    unit_id: str(r['Unit ID']),
  }));
  if (dropRecs.length) await batchImport(pb, 'sf_lookups', dropRecs, 'lookup_id', 'SF Lookups');

  // ========================================================
  // 2. FarmRates → sf_farm_rates
  // ========================================================
  const rateRows = sheet('FarmRates');
  const rateRecs = rateRows.filter(r => str(r['FarmRate ID'])).map(r => ({
    rate_id: str(r['FarmRate ID']),
    farm_id_text: str(r['Farm ID']),
    task_id: str(r['Task ID']),
    rate_value: num(r['RateValue']),
    unit: str(r['Unit']),
    is_active: str(r['IsActive']) === 'AC',
    active_date: excelDateToISO(r['Date']),
    apply_to: str(r['Apply to']),
  }));
  if (rateRecs.length) await batchImport(pb, 'sf_farm_rates', rateRecs, 'rate_id', 'SF Farm Rates');

  // ========================================================
  // 3. Worker info → workers (upsert)
  // ========================================================
  const wiRows = sheet('Worker info');
  const workerRecs = wiRows.filter(r => str(r['Worker ID'])).map(r => {
    const farmCode = str(r['Farm ID']);
    const sfId = sfMap.get(farmCode) || '';
    return {
      worker_code: str(r['Worker ID']),
      full_name: str(r['Name']),
      slow_farm: sfId,
      worker_type: 'inside',
      status: 'active',
      is_active: true,
    };
  });
  if (workerRecs.length) await batchImport(pb, 'workers', workerRecs, 'worker_code', 'Workers');

  // ========================================================
  // 4. Worker task detail → sf_worker_tasks
  // ========================================================
  const wtRows = sheet('Worker task detail');
  const wtRecs = wtRows.filter(r => str(r['Worker info task ID'])).map(r => ({
    task_detail_id: str(r['Worker info task ID']),
    farm_rate_id: str(r['FarmRate ID']),
    worker_id_text: str(r['Worker ID']),
    task_id: str(r['Task ID']),
    rate: num(r['Rates']),
    active_date: excelDateToISO(r['Active date']),
  }));
  if (wtRecs.length) await batchImport(pb, 'sf_worker_tasks', wtRecs, 'task_detail_id', 'SF Worker Tasks');

  // ========================================================
  // 5. Payroll → sf_payroll
  // ========================================================
  const prRows = sheet('Payroll');
  const prRecs = prRows.filter(r => str(r['Payroll ID'])).map(r => ({
    payroll_id: str(r['Payroll ID']),
    start_date: excelDateToISO(r['Start date']),
    end_date: excelDateToISO(r['End date']),
    farm_name: str(r['Farm name']),
    worker_ids: str(r['Workers ID']),
    file_path: str(r['Path file']),
  }));
  if (prRecs.length) await batchImport(pb, 'sf_payroll', prRecs, 'payroll_id', 'SF Payroll');

  // ========================================================
  // 6. Payroll detail → sf_payroll_details
  // ========================================================
  const pdRows = sheet('Payroll detail');
  const pdRecs = pdRows.filter(r => str(r['Payroll detail ID'])).map(r => ({
    detail_id: str(r['Payroll detail ID']),
    payroll_id_text: str(r['Payroll ID']),
    start_date: excelDateToISO(r['Start date']),
    end_date: excelDateToISO(r['End date']),
    farm_name: str(r['Farm name']),
    worker_id_text: str(r['Worker ID']),
    task: str(r['Task']),
    rate: num(r['Rate']),
    amount: num(r['Amount']),
  }));
  if (pdRecs.length) await batchImport(pb, 'sf_payroll_details', pdRecs, 'detail_id', 'SF Payroll Details');

  // ========================================================
  // 7. Check roll → sf_check_rolls (LARGE: ~26K rows)
  // ========================================================
  const crRows = sheet('Check roll');
  const crRecs = crRows.filter(r => str(r['Check ID'])).map(r => ({
    check_id: str(r['Check ID']),
    farm_id_text: str(r['Farm ID']),
    check_date: excelDateToISO(r['Created Date']),
    check_by: str(r['Check by']),
    attendance_check: str(r['Attendance check']),
    notes: str(r['Notes']),
    status: str(r['Status']),
    file_path: str(r['File path']),
  }));
  if (crRecs.length) await batchImport(pb, 'sf_check_rolls', crRecs, 'check_id', 'SF Check Rolls');

  // ========================================================
  // 8. Check roll detail → sf_check_roll_details (LARGE: ~26K rows)
  // ========================================================
  const crdRows = sheet('Check roll detail');
  const crdRecs = crdRows.filter(r => str(r['Roll ID'])).map(r => ({
    roll_id: str(r['Roll ID']),
    check_id_text: str(r['Check ID']),
    timestamp: excelDateToISO(r['Timestamp']),
    worker_id_text: str(r['Worker ID']),
    attendance: str(r['Attendance']),
    task_id: str(r['Task ID']),
    rate_day: num(r['Rate_day']),
    salary_day: num(r['Salary_day']),
    notes: str(r['Notes']),
    check_by: str(r['Check by']),
  }));
  if (crdRecs.length) await batchImport(pb, 'sf_check_roll_details', crdRecs, 'roll_id', 'SF Check Roll Details');

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✓ Slow Farm management import complete!');
  console.log('═══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
