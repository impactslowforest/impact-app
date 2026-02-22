/**
 * Import Day care center.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-daycare.mjs <admin-email> <admin-password>
 *
 * Sheets imported:
 *   - Family (47 rows) → dc_families
 *   - Kid data (267 rows) → dc_kids
 *   - Kid study detail (1,433 rows) → dc_kid_studies
 *   - Attendance detail (34,523 rows) → dc_attendance
 *   - Health check (211 rows) → dc_health_checks
 *   - Farm health check (18 rows) → dc_farm_health_checks
 *   - Attendance check (893 rows) → dc_attendance_checks
 *   - Menu details (25 rows) → dc_menu_details
 *   - Material name (95 rows) → dc_materials
 *
 * Skipped sheets: WHO drop (reference), Chart (derived), Kitchen drop (dropdowns), User (handled separately)
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Day care center.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-daycare.mjs <email> <password>');
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

    if ((i + 1) % 500 === 0) console.log(`  Progress: ${i + 1}/${records.length}`);
  }

  console.log(`  ✓ ${label}: ${created} created, ${updated} updated, ${skipped} skipped, ${errors} errors`);
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Day Care Center Data Import                ║');
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

  // ─── 1. DC_MATERIALS ───
  const materials = sheet('Material name').map(r => ({
    material_id:    str(r['Material ID']),
    material_name:  str(r['Material name']),
    category:       str(r['Category']),
    unit:           str(r['Unit']),
    unit_price:     num(r['Unit Price']),
    supplier_id:    str(r['Supplier ID']),
    details:        str(r['Details']),
  })).filter(r => r.material_id);
  await batchImport(pb, 'dc_materials', materials, 'material_id', 'Materials');

  // ─── 2. DC_FAMILIES ───
  const families = sheet('Family').map(r => ({
    family_id:      str(r['Family ID']),
    farm_id_text:   str(r['Farm ID']),
    worker1_name_en: str(r['Worker name in English (1)']),
    worker1_name_lo: str(r['Worker name in Lao (1)']),
    worker1_id:     str(r['WK1 ID']),
    relation1:      str(r['Relation1 to the child']),
    worker2_name_en: str(r['Worker name in English (2)']),
    worker2_name_lo: str(r['Worker name in Lao (2)']),
    worker2_id:     str(r['WK2 ID']),
    relation2:      str(r['Relation2 to the child']),
    siblings:       str(r['NAMES OF SIBLINGS']),
  })).filter(r => r.family_id);
  await batchImport(pb, 'dc_families', families, 'family_id', 'Families');

  // ─── 3. DC_KIDS ───
  const kids = sheet('Kid data').map(r => ({
    kid_id:           str(r['Kid ID']),
    farm_id_text:     str(r['FARM ID']),
    family_id_text:   str(r['Family ID']),
    first_name:       str(r['First name']),
    last_name:        str(r['Last name']),
    nickname:         str(r['Nickname']),
    lao_first_name:   str(r['Lao first name']),
    lao_last_name:    str(r['Lao last name']),
    birthday:         excelDateToISO(r['Birthday']),
    gender:           str(r['Gender']),
    on_farm:          str(r['On farm']).toUpperCase() === 'YES',
    uses_lao_primary: str(r['Uses Lao as primary language']).toUpperCase() === 'YES',
    other_languages:  str(r['Other languages spoken']),
    arrived_date:     excelDateToISO(r['Arrived to farm ']),
    left_date:        excelDateToISO(r['Left the farm']),
    attended_school_before: str(r['Attended school before']).toUpperCase() === 'YES',
    official_school_level:  str(r['Official school level ']),
    real_estimated_level:   str(r['Real estimated level ']),
    notes:            str(r['Notes']),
    image_path:       str(r['Image']),
  })).filter(r => r.kid_id);
  await batchImport(pb, 'dc_kids', kids, 'kid_id', 'Kids');

  // ─── 4. DC_KID_STUDIES ───
  const studies = sheet('Kid study detail').map(r => ({
    study_id:       str(r['Study ID']),
    farm_id_text:   str(r['Farm ID']),
    kid_id_text:    str(r['Kid ID']),
    kid_name:       str(r['Kid name']),
    family_id_text: str(r['Family ID']),
    subject:        str(r['Subject']),
    study_date:     excelDateToISO(r['Date']),
    score:          num(r['Score']),
    level:          str(r['Level']),
  })).filter(r => r.study_id);
  await batchImport(pb, 'dc_kid_studies', studies, 'study_id', 'Kid Studies');

  // ─── 5. DC_FARM_HEALTH_CHECKS ───
  const farmHealthChecks = sheet('Farm health check').map(r => ({
    check_id:       str(r['Farm health check ID']),
    farm_id_text:   str(r['Farm ID']),
    check_date:     excelDateToISO(r['Date']),
    doctor1:        str(r['Doctor 1']),
    doctor2:        str(r['Doctor 2']),
    doctor3:        str(r['Doctor 3']),
    doctor4:        str(r['Doctor 4']),
    num_kids:       num(r['Number of kids']),
    num_male:       num(r['No Male']),
    num_female:     num(r['No Femal']),
    under_60_months: num(r['Num of kid less than 60 months']),
    over_60_months:  num(r['Num of kid greater than 60 months']),
    file_path:      str(r['File path']),
  })).filter(r => r.check_id);
  await batchImport(pb, 'dc_farm_health_checks', farmHealthChecks, 'check_id', 'Farm Health Checks');

  // ─── 6. DC_HEALTH_CHECKS ───
  const healthChecks = sheet('Health check').map((r, idx) => ({
    check_record_id: str(r['Check ID']) ? `${str(r['Check ID'])}-${str(r['Kid ID'])}` : `HC-${idx}`,
    farm_check_id:   str(r['Farm health check ID']),
    check_id_text:   str(r['Check ID']),
    kid_id_text:     str(r['Kid ID']),
    farm_id_text:    str(r['Farm ID']),
    kid_name:        str(r['Kid name']),
    gender:          str(r['Gender']),
    birthday:        excelDateToISO(r['Birthday']),
    measure_date:    excelDateToISO(r['Measure date']),
    weight_kg:       num(r['Weight (kg)']),
    height_cm:       num(r['Height (cm)']),
    muac_cm:         num(r['MUAC (cm)']),
    bmi_index:       num(r['BMI index']),
    age_months:      num(r['Age (in months)']),
    waz_score:       num(r['Weight-for-age (WAZ)']),
    haz_score:       num(r['Height-for-age (HAZ)']),
    whz_score:       num(r['Weight-for-height (WHZ)']),
    baz_score:       num(r['BMI-for-age (BAZ)']),
    waz_assessment:  str(r['Weight-for-age assessment']),
    haz_assessment:  str(r['Height-for-age assessment']),
    whz_assessment:  str(r['Weight-for-height assessment']),
    baz_assessment:  str(r['BMI-for-age assessment']),
  })).filter(r => r.kid_id_text);
  await batchImport(pb, 'dc_health_checks', healthChecks, 'check_record_id', 'Health Checks');

  // ─── 7. DC_ATTENDANCE_CHECKS ───
  const attendanceChecks = sheet('Attendance check').map(r => ({
    check_id:       str(r['Check ID']),
    check_date:     excelDateToISO(r['Date']),
    farm_id_text:   str(r['Farm ID']),
    class_id:       str(r['Class ID']),
    slot_time:      str(r['Slot Time']),
    attendance_list: str(r['Attendance List']),
  })).filter(r => r.check_id);
  await batchImport(pb, 'dc_attendance_checks', attendanceChecks, 'check_id', 'Attendance Checks');

  // ─── 8. DC_MENU_DETAILS ───
  const menuDetails = sheet('Menu details').map(r => ({
    menu_detail_id: str(r['Menu detail ID']),
    farm_id_text:   str(r['Farm ID']),
    staff_id:       str(r['Staff ID']),
    daily_menu_id:  str(r['Daily Menu ID']),
    material_name:  str(r['Material name']),
    menu_date:      excelDateToISO(r['Date']),
    quantity:       num(r['Quantity']),
    unit:           str(r['Unit']),
    unit_price:     num(r['Unit price']),
    total_price:    num(r['Total Price']),
  })).filter(r => r.menu_detail_id);
  await batchImport(pb, 'dc_menu_details', menuDetails, 'menu_detail_id', 'Menu Details');

  // ─── 9. DC_ATTENDANCE (large: ~34K rows) ───
  const attendance = sheet('Attendance detail').map(r => ({
    attendance_id:    str(r['Attendance ID']),
    family_id_text:   str(r['Family ID']),
    farm_id_text:     str(r['Farm ID']),
    class_id:         str(r['Class ID']),
    kid_id_text:      str(r['Kid ID']),
    check_id_text:    str(r['Check ID']),
    attendance_date:  excelDateToISO(r['Date']),
    attendance_status: str(r['Attendance']),
    meal_count:       num(r['Meal Count']),
    time_slot:        str(r['Time Slot']),
  })).filter(r => r.attendance_id);
  await batchImport(pb, 'dc_attendance', attendance, 'attendance_id', 'Attendance Records');

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  ✓ Day Care Center import complete!         ║');
  console.log('╚══════════════════════════════════════════════╝');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
