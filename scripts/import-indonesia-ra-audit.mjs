/**
 * Import RA internal audit.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-indonesia-ra-audit.mjs <admin-email> <admin-password>
 *
 * Sheets imported:
 *   - Farmer data (84 rows) → ra_farmer_inspections
 *   - Farm data (122 rows) → ra_farm_inspections
 *   - Species Index (143 rows) → ra_species_index
 *   - Station data (28 rows) → ra_stations
 *   - Tree index (86 rows) → ra_tree_index
 *   - Agroforestry fertilizer (11 rows) → ra_agroforestry_fert
 *   - Compost application (3 rows) → ra_compost
 *   - Pesticides (4 rows) → ra_pesticides
 *   - Species name (19 rows) → ra_species_names
 *   - Family data (54 rows) → ra_family_data
 *   - RA certificate (12 rows) → ra_certificates
 *
 * Skipped: Data_Structure, Drop, Traslation, User (update separately),
 *          Farm list, Farmer list (reference), Kedondong_Del (deleted),
 *          Chemical fertilizer, Corrective Action Plan (empty),
 *          Menu, Data_point_RA, Backup_Farmer Contract, Sheet20
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../RA internal audit.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-indonesia-ra-audit.mjs <email> <password>');
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

    if ((i + 1) % 100 === 0) console.log(`  Progress: ${i + 1}/${records.length}`);
  }

  console.log(`  ✓ ${label}: ${created} created, ${updated} updated, ${skipped} skipped, ${errors} errors`);
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Indonesia RA Internal Audit Data Import    ║');
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

  // ─── 1. SPECIES NAMES (reference table, import first) ───
  const speciesNames = sheet('Species name').map(r => ({
    species_ref_id: str(r['Species ID']),
    species_name:   str(r['Species']),
    species_type:   str(r['Type']),
    num_trees:      num(r['Number of trees']),
    date_buy:       excelDateToISO(r['Date buy']),
    nursery_name:   str(r['Name of nursery']),
  })).filter(r => r.species_ref_id);
  await batchImport(pb, 'ra_species_names', speciesNames, 'species_ref_id', 'Species Names');

  // ─── 2. FARMER INSPECTIONS ───
  const farmerInspections = sheet('Farmer data').map(r => ({
    farmer_id_text:     str(r['Farmer ID']),
    staff_id:           str(r['Staff ID']),
    inspection_date:    excelDateToISO(r['Date']),
    province:           str(r['Province']),
    district:           str(r['District']),
    commune:            str(r['Commune']),
    village:            str(r['Village']),
    village_id:         str(r['Village ID']),
    farmer_code:        str(r['Farmer code']),
    farmer_name:        str(r['Farmer Name']),
    farm_area_ha:       num(r['Farm Area (ha)']),
    observation_stations: num(r['Observation Stations']),
    est_production_2024:  num(r['Estimated Production 2024 (kilogram)']),
    est_production_2025:  num(r['Estimated Production 2025 (kilogram)']),
    location:           str(r['Location']),
    farmer_address:     str(r['Farmer House Address']),
    arrival_time:       str(r['Arrival Time']),
    departure_time:     str(r['Departure Time']),
    inspector_name:     str(r['Internal Inspector']),
  })).filter(r => r.farmer_id_text);
  await batchImport(pb, 'ra_farmer_inspections', farmerInspections, 'farmer_id_text', 'Farmer Inspections');

  // ─── 3. FARM INSPECTIONS ───
  const farmInspections = sheet('Farm data').map(r => ({
    farm_audit_id:     str(r['FarmAudit ID']),
    farmer_id_text:    str(r['Farmer ID']),
    farm_id_text:      str(r['Farm ID']),
    staff_id:          str(r['Staff ID']),
    inspection_date:   excelDateToISO(r['Date']),
    location:          str(r['Location']),
    farm_area_ha:      num(r['Farm area (ha)']),
    land_certificate:  str(r['Land certificate']),
    land_comments:     str(r['Land comments']),
    land_ownership_cert: str(r['Land Ownership Certificate']),
    num_stations:      num(r['Number of station']),
    num_species:       num(r['Number of species']),
    est_production_2024: num(r['Estimated Production 2024 (kilogram)']),
    est_production_2025: num(r['Estimated Production 2025 (kilogram)']),
    inspector_name:    str(r['Inspector Name']),
  })).filter(r => r.farm_audit_id);
  await batchImport(pb, 'ra_farm_inspections', farmInspections, 'farm_audit_id', 'Farm Inspections');

  // ─── 4. SPECIES INDEX ───
  const speciesIndex = sheet('Species Index').map(r => ({
    species_id:           str(r['Species ID']),
    farmer_id_text:       str(r['Farmer ID']),
    farm_id_text:         str(r['Farm ID']),
    staff_id:             str(r['Staff ID']),
    record_date:          excelDateToISO(r['Date']),
    location:             str(r['Location']),
    species_name:         str(r['Species name']),
    num_timber_trees:     num(r['Number of timber trees']),
    year_planted_timber:  num(r['Year plated of timber tree']),
    num_fruit_trees_producing: num(r['Number of fruit trees producing']),
    year_planted_fruit:   num(r['Year planted of fruit tree producing']),
    unit_of_sales:        str(r['Unit of sales (kg/gandeng/liter)']),
    total_unit_sales_2024: num(r['Total unit of sales 2024']),
    production_est_2025:  num(r['Production estimate for 2025']),
    harvest_type:         str(r['Harvest type']),
    first_harvest_2025:   str(r['First harvest 2025']),
    second_harvest_2025:  str(r['Second harvest 2025']),
    num_trees_not_producing: num(r['Number of trees not yet producing']),
  })).filter(r => r.species_id);
  await batchImport(pb, 'ra_species_index', speciesIndex, 'species_id', 'Species Index');

  // ─── 5. STATIONS ───
  const stations = sheet('Station data').map(r => ({
    station_id:     str(r['Station ID']),
    village_id:     str(r['Village ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text:   str(r['Farm ID']),
    station_name:   str(r['Station name']),
    ph_level:       num(r['pH']),
    latlong:        str(r['Latlong']),
    staff_id:       str(r['Staff ID']),
    record_date:    excelDateToISO(r['Date']),
  })).filter(r => r.station_id);
  await batchImport(pb, 'ra_stations', stations, 'station_id', 'Stations');

  // ─── 6. TREE INDEX ───
  const treeIndex = sheet('Tree index').map(r => ({
    tree_id:         str(r['tree ID']),
    village_id:      str(r['Village ID']),
    farmer_id_text:  str(r['Farmer ID']),
    farm_id_text:    str(r['Farm ID']),
    station_id:      str(r['Station ID']),
    tree_number:     str(r['No of tree']),
    staff_id:        str(r['Staff ID']),
    record_date:     excelDateToISO(r['Date']),
    location:        str(r['Location']),
    ao1_clone_input: str(r['AO#1 Planting material: genetics of cocoa and agroforestry trees - Clone input']),
    ao1_clone_rating: num(r['AO#1 Planting material: genetics of cocoa and agroforestry trees - Each tree clone rating']),
    ao1_comments:    str(r['AO#1 comments']),
    ao2_age_input:   num(r['AO#2 Plant age - Age input']),
    ao2_age_rating:  num(r['AO#2 Plant age - Age Rating']),
    ao2_comments:    str(r['AO#2 comments']),
    ao4_health_rating: num(r['AO#4 tree health - Rating']),
    ao4_comments:    str(r['AO#4 comments']),
    ao5_disease_rating: num(r['AO#5 Debilitating Diseases - Rating']),
    ao5_comments:    str(r['AO#5 comments']),
    ao6_pruning_rating: num(r['AO#6 Pruning - Rating']),
  })).filter(r => r.tree_id);
  await batchImport(pb, 'ra_tree_index', treeIndex, 'tree_id', 'Tree Index');

  // ─── 7. AGROFORESTRY FERTILIZER ───
  const agroFert = sheet('Agroforestry fertilizer').map(r => ({
    chemical_id:         str(r['Agroforestry Chemical ID']),
    farmer_id_text:      str(r['Farmer ID']),
    farm_id_text:        str(r['Farm ID']),
    species_id:          str(r['Species ID']),
    staff_id:            str(r['Staff ID']),
    record_date:         excelDateToISO(r['Date']),
    location:            str(r['Location']),
    fertilizer_name:     str(r['Agroforestry tree Chemical Fertilizer']),
    af_tree_species:     str(r['AF tree Species']),
    dosage_per_application: str(r['Dosage per Application']),
    application_frequency:  str(r['Application Frequency (times per year)']),
    young_old_trees:     str(r['Young/Old trees']),
    nutrient_content:    str(r['Nutrient Content']),
    n_percent:           num(r['N%']),
    p_percent:           num(r['P%']),
  })).filter(r => r.chemical_id);
  await batchImport(pb, 'ra_agroforestry_fert', agroFert, 'chemical_id', 'Agroforestry Fertilizer');

  // ─── 8. COMPOST ───
  const compost = sheet('Compost application').map(r => ({
    compost_id:       str(r['Compost ID']),
    farmer_id_text:   str(r['Farmer ID']),
    farm_id_text:     str(r['Farm ID']),
    species_id:       str(r['Species ID']),
    species_name:     str(r['Species']),
    staff_id:         str(r['Staff ID']),
    record_date:      excelDateToISO(r['Date']),
    location:         str(r['Location']),
    make_or_buy:      str(r['Make own or Buy']),
    compost_brand:    str(r['Compost Brand']),
    dosage_per_tree:  str(r['Dosage per tree per application']),
    frequency_per_year: str(r['Frequency of Application per Year']),
    application_date: str(r['Application Date']),
  })).filter(r => r.compost_id);
  await batchImport(pb, 'ra_compost', compost, 'compost_id', 'Compost Application');

  // ─── 9. PESTICIDES ───
  const pesticides = sheet('Pesticides').map(r => ({
    pesticide_id:     str(r['Pesticide ID']),
    farmer_id_text:   str(r['Farmer ID']),
    farm_id_text:     str(r['Farm ID']),
    species_id:       str(r['Species ID']),
    staff_id:         str(r['Staff ID']),
    record_date:      excelDateToISO(r['Date']),
    location:         str(r['Location']),
    chemical_pesticide: str(r['Chemical Pesticide']),
    active_ingredient: str(r['Active ingredient']),
    target_pest_disease: str(r['Target Pest / Disease']),
    has_registration_number: str(r['Is there a registration number?']).toLowerCase() === 'yes',
    comments:         str(r['Comments']),
    num_tanks:        num(r['How many tanks are used to spray the farm for one time application?']),
    dosage_per_tank:  str(r['What is the dosage of the pesticide for one tank?']),
    dosage_unit:      str(r['What is the unit of the dosage?']),
    applications_per_year: num(r['How many applications per year?']),
  })).filter(r => r.pesticide_id);
  await batchImport(pb, 'ra_pesticides', pesticides, 'pesticide_id', 'Pesticides');

  // ─── 10. FAMILY DATA ───
  const familyData = sheet('Family data').map(r => ({
    position_id:     str(r['Porsition ID']),
    farmer_id_text:  str(r['Farmer ID']),
    family_id:       str(r['Family ID']),
    member_name:     str(r['Name']),
    family_position: str(r['Family position']),
    birth_year:      num(r['Birth year']),
    cocoa_training:  str(r['training on cacoa technical']).toLowerCase() !== 'tidak',
    under_school:    str(r['Under school?']).toLowerCase() !== 'tidak',
    working_areas:   str(r['Working areas']),
    staff_id:        str(r['Staff ID']),
    record_date:     excelDateToISO(r['Date']),
  })).filter(r => r.position_id);
  await batchImport(pb, 'ra_family_data', familyData, 'position_id', 'Family Data');

  // ─── 11. RA CERTIFICATES ───
  const certificates = sheet('RA certificate').map(r => {
    const certId = str(r['Certificate ID']);
    if (!certId) return null;

    // Collect all Q&A columns into a JSON object
    const answers = {};
    const keys = Object.keys(r);
    for (const k of keys) {
      if (/^\d+\./.test(k) || k.startsWith('Comments Q') || k.startsWith('Take picture')) {
        answers[k] = str(r[k]);
      }
    }

    return {
      certificate_id:  certId,
      farmer_id_text:  str(r['Farmer ID']),
      farm_id_text:    str(r['Farm ID']),
      staff_id:        str(r['Staff ID']),
      inspection_date: excelDateToISO(r['Date']),
      location:        str(r['Location']),
      checklist_answers: answers,
    };
  }).filter(Boolean);
  await batchImport(pb, 'ra_certificates', certificates, 'certificate_id', 'RA Certificates');

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  ✓ Indonesia RA Audit import complete!      ║');
  console.log('╚══════════════════════════════════════════════╝');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
