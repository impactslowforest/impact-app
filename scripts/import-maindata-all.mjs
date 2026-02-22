/**
 * Import ALL sheets from Main data.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-maindata-all.mjs <admin-email> <admin-password>
 *
 * Covers:
 *   - User → users (update)
 *   - Cooperative data → cooperatives (upsert)
 *   - Farmer data → farmers (upsert)
 *   - Farm data → farms (upsert)
 *   - SLOWFarm → slow_farms (upsert)
 *   - ActImpact → act_impacts
 *   - ActImpact detail → act_impact_details
 *   - Impact_plan → impact_plans
 *   - Impact_plan_detail → impact_plan_details
 *   - Impact_activity_list → impact_activities
 *   - GHG Supplier info → suppliers (upsert)
 *   - GHG farmer → ghg data (enriches farmers)
 *   - GHG FMU → ghg_fmu
 *   - GHG Organic fertilizer → ghg_organic_fertilizer
 *   - GHG Chemical fertilizer → ghg_chemical_fertilizer
 *   - GHG Wetmill → ghg_wetmill
 *   - GHG Drymill → ghg_drymill
 *   - Blocks → farm_blocks
 *   - Trees → tree_inventory
 *   - EU organic farmer → eu_organic_inspections
 *   - EU Organic farm → eu_organic_farm_inspections
 *   - Farm crop estimation → farm_crop_estimations
 *   - Farmer profile → farmer_profiles
 *   - Farmer profile detail → farmer_profile_details
 *   - Admin → admin_locations
 *   - Coffee price → coffee_prices
 *   - Contractor → contractors
 *   - Factory → factories
 *   - SLOW Farm daily check → sf_daily_checks
 *   - SLOW Farm weekly check → sf_weekly_checks
 *   - Inside worker → workers (worker_type=inside)
 *   - Outside worker → workers (worker_type=outside)
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Main data.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-maindata-all.mjs <email> <password>');
  process.exit(1);
}

// ── Helpers ──
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
function normalizeCountry(raw) {
  if (!raw) return 'laos';
  const lower = String(raw).toLowerCase().trim();
  if (lower.includes('viet') || lower === 'vn') return 'vietnam';
  if (lower.includes('indo') || lower === 'in') return 'indonesia';
  return 'laos';
}
function normalizeGender(raw) {
  if (!raw) return 'male';
  const lower = String(raw).toLowerCase().trim();
  if (lower === 'mrs' || lower === 'ms' || lower === 'female' || lower === 'f' || lower === 'mrs.' || lower === 'ms.') return 'female';
  return 'male';
}
function parseLatLng(raw) {
  if (!raw || typeof raw !== 'string') return { lat: 0, lng: 0 };
  const parts = raw.split(',').map(s => parseFloat(s.trim()));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return { lat: parts[0], lng: parts[1] };
  return { lat: 0, lng: 0 };
}

/** Batch import with retry and progress */
async function batchImport(pb, collection, records, uniqueField, label) {
  console.log(`\n── Importing ${label} (${records.length} rows) → ${collection} ──`);
  let created = 0, updated = 0, skipped = 0, errors = 0;

  // Build existing record map
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
      if (errors <= 3) console.log(`  ✗ Error row ${i}: ${e.message?.substring(0, 200)}`);
    }

    if ((i + 1) % 100 === 0) process.stdout.write(`  ${i + 1}/${records.length}\r`);
  }

  console.log(`  ✓ ${label}: created=${created}, updated=${updated}, skipped=${skipped}, errors=${errors}`);
  return { created, updated, skipped, errors };
}

// ── Main ──
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Impact App — Main data.xlsx Full Import');
  console.log('═══════════════════════════════════════════════════');

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    console.log(`✓ Authenticated as superuser`);
  } catch {
    try {
      await pb.collection('users').authWithPassword(adminEmail, adminPassword);
      console.log(`✓ Authenticated as user (API rules may block some ops)`);
    } catch (e) {
      console.error('✗ Auth failed:', e.message);
      process.exit(1);
    }
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = (name) => {
    const ws = wb.Sheets[name];
    if (!ws) { console.log(`  ⚠ Sheet "${name}" not found, skipping`); return []; }
    return XLSX.utils.sheet_to_json(ws, { defval: '' });
  };

  // Pre-load cooperative IDs
  const coopMap = new Map();
  try {
    const coops = await pb.collection('cooperatives').getFullList({ fields: 'id,coop_code' });
    coops.forEach(c => coopMap.set(c.coop_code, c.id));
  } catch {}

  // Pre-load slow_farm IDs
  const sfMap = new Map();
  try {
    const sfs = await pb.collection('slow_farms').getFullList({ fields: 'id,farm_code' });
    sfs.forEach(s => sfMap.set(s.farm_code, s.id));
  } catch {}

  // ========================================================
  // 1. Admin locations
  // ========================================================
  const adminRows = sheet('Admin');
  const adminRecs = adminRows.filter(r => str(r['Code'])).map((r, i) => ({
    country_code: str(r['Code']),
    country_label: str(r['Label']),
    province: str(r['Province']),
    province_code: str(r['Code1']),
    district: str(r['District']),
    district_code: str(r['Code2']),
    village_id: str(r['VillageID']),
    commune: str(r['Commune']),
    commune_code: str(r['code3']),
    village: str(r['Village']),
    village_code: str(r['Code4']),
  }));
  if (adminRecs.length) await batchImport(pb, 'admin_locations', adminRecs, 'village_id', 'Admin Locations');

  // ========================================================
  // 2. Cooperative data
  // ========================================================
  const coopRows = sheet('Cooperative data');
  const coopRecs = coopRows.filter(r => str(r['Village ID'])).map(r => {
    const ll = parseLatLng(str(r['Latlong']));
    return {
      coop_code: str(r['Village IDa']) || `${str(r['Country code'])}-${str(r['Village ID'])}`,
      name: str(r['Village name']),
      country: normalizeCountry(r['Country code']),
      province: str(r['Province']),
      district: str(r['District']),
      village: str(r['Village name']),
      leader_name: str(r['Header name']),
      latitude: ll.lat,
      longitude: ll.lng,
      commodity: normalizeCountry(r['Country code']) === 'indonesia' ? 'cacao' : 'coffee',
      is_active: true,
    };
  });
  if (coopRecs.length) {
    await batchImport(pb, 'cooperatives', coopRecs, 'coop_code', 'Cooperatives');
    // Refresh coop map
    const coops = await pb.collection('cooperatives').getFullList({ fields: 'id,coop_code' });
    coops.forEach(c => coopMap.set(c.coop_code, c.id));
  }

  // ========================================================
  // 3. Farmer data
  // ========================================================
  const farmerRows = sheet('Farmer data');
  const farmerMap = new Map();
  try {
    const existing = await pb.collection('farmers').getFullList({ fields: 'id,farmer_code' });
    existing.forEach(f => farmerMap.set(f.farmer_code, f.id));
  } catch {}

  const farmerRecs = farmerRows.filter(r => str(r['Farmer ID'])).map(r => {
    const country = normalizeCountry(r['Country code'] || r['Country']);
    // Find cooperative by village ID
    const villageId = str(r['Village ID']);
    const coopCode = `${str(r['Country code'])}-${villageId}`;
    const cooperative = coopMap.get(coopCode) || coopMap.get(villageId) || '';

    return {
      farmer_code: str(r['Farmer ID']),
      full_name: str(r['Farmer name']),
      country,
      gender: normalizeGender(r['Gender']),
      phone: str(r['Phone']),
      id_card_number: str(r['ID card']),
      village: str(r['Village name']),
      district: str(r['District']),
      province: str(r['Province']),
      farm_size_ha: num(r['Area']),
      cooperative,
      commodity: country === 'indonesia' ? 'cacao' : 'coffee',
      is_active: str(r['Status']) !== 'resign',
      registration_date: excelDateToISO(r['Date']),
    };
  });
  if (farmerRecs.length) {
    await batchImport(pb, 'farmers', farmerRecs, 'farmer_code', 'Farmers');
    const farmers = await pb.collection('farmers').getFullList({ fields: 'id,farmer_code' });
    farmers.forEach(f => farmerMap.set(f.farmer_code, f.id));
  }

  // ========================================================
  // 4. Farm data
  // ========================================================
  const farmRows = sheet('Farm data');
  const farmMap = new Map();
  try {
    const existing = await pb.collection('farms').getFullList({ fields: 'id,farm_code' });
    existing.forEach(f => farmMap.set(f.farm_code, f.id));
  } catch {}

  const farmRecs = farmRows.filter(r => str(r['Farm ID'])).map(r => {
    const farmerId = str(r['Farmer ID']);
    const farmer = farmerMap.get(farmerId) || '';
    const ll = parseLatLng(str(r['Latlong']));
    const country = farmer ? 'laos' : 'laos'; // default; will match from farmer
    return {
      farm_code: str(r['Farm ID']),
      farmer,
      country,
      farm_name: str(r['Farm name']),
      area_ha: num(r['Farm area (ha)']),
      latitude: ll.lat,
      longitude: ll.lng,
      certification_status: str(r['Type area']).toLowerCase().includes('org') ? 'organic' : 'none',
      commodity: 'coffee',
      is_active: str(r['Status']) !== 'resign',
    };
  });
  if (farmRecs.length) {
    await batchImport(pb, 'farms', farmRecs, 'farm_code', 'Farms');
    const farms = await pb.collection('farms').getFullList({ fields: 'id,farm_code' });
    farms.forEach(f => farmMap.set(f.farm_code, f.id));
  }

  // ========================================================
  // 5. SLOW Farm
  // ========================================================
  const sfRows = sheet('SLOWFarm');
  const sfRecs = sfRows.filter(r => str(r['Farm ID'])).map(r => ({
    farm_code: str(r['Farm ID']),
    name: str(r['Name']),
    total_area_ha: num(r['Areas']),
    notes: str(r['Notes']),
    is_active: true,
  }));
  if (sfRecs.length) {
    await batchImport(pb, 'slow_farms', sfRecs, 'farm_code', 'SLOW Farms');
    const sfs = await pb.collection('slow_farms').getFullList({ fields: 'id,farm_code' });
    sfs.forEach(s => sfMap.set(s.farm_code, s.id));
  }

  // ========================================================
  // 6. ActImpact + Details
  // ========================================================
  const aiRows = sheet('ActImpact');
  const aiRecs = aiRows.filter(r => str(r['ActImpact ID'])).map(r => ({
    impact_id: str(r['ActImpact ID']),
    entity: str(r['Entity']),
    category: str(r['Categeory']),
    planned_budget: num(r['Planned Budget']),
    actual_spending: num(r['Actual Spending']),
    annual_budget: num(r['Annual Budget']),
    balance: num(r['Balance']),
    staff: str(r['Staff']),
    record_date: excelDateToISO(r['Date']),
    file_path: str(r['File path']),
  }));
  if (aiRecs.length) await batchImport(pb, 'act_impacts', aiRecs, 'impact_id', 'Act Impacts');

  const aidRows = sheet('ActImpact detail');
  const aidRecs = aidRows.filter(r => str(r['Activity ID'])).map(r => ({
    detail_id: str(r['Activity ID']),
    impact_id_text: str(r['ActImpact ID']),
    entity: str(r['Entity']),
    activity_id: str(r['Activity ID']),
    activity_date: excelDateToISO(r['Date']),
    activity_name: str(r['Activity name']),
    description: str(r['Description of activity']),
    budget: num(r['Budget']),
    budget_type: str(r['Budget type']),
    category: str(r['Categeory']),
    note: str(r['Note']),
    staff: str(r['Staff']),
  }));
  if (aidRecs.length) await batchImport(pb, 'act_impact_details', aidRecs, 'detail_id', 'Act Impact Details');

  // ========================================================
  // 7. Impact Plans + Details + Activities
  // ========================================================
  const ipRows = sheet('Impact_plan');
  const ipRecs = ipRows.filter(r => str(r['Impact_plan_ID'])).map(r => ({
    plan_id: str(r['Impact_plan_ID']),
    entity_id: str(r['Entity_ID']),
    category_id: str(r['Category_ID']),
    budget_plan: num(r['Budget plan']),
    budget_total: num(r['Budget total']),
    budget_plan_balance: num(r['Budget plan balance']),
    planned_date: excelDateToISO(r['Planned date']),
    staff: str(r['Staff']),
    record_date: excelDateToISO(r['Date']),
    file_path: str(r['File path']),
  }));
  if (ipRecs.length) await batchImport(pb, 'impact_plans', ipRecs, 'plan_id', 'Impact Plans');

  const ipdRows = sheet('Impact_plan_detail');
  const ipdRecs = ipdRows.filter(r => str(r['Impact_plan_detail_ID'])).map(r => ({
    detail_id: str(r['Impact_plan_detail_ID']),
    plan_id_text: str(r['Impact_plan_ID']),
    activity_code: str(r['Activity_code']),
    budget: num(r['Budget']),
    account_id: str(r['Account_ID']),
    expense_id: str(r['Expense_ID']),
    time_implemented: excelDateToISO(r['time_implemented']),
    staff: str(r['Staff']),
    record_date: excelDateToISO(r['Date']),
    file_path: str(r['File path']),
  }));
  if (ipdRecs.length) await batchImport(pb, 'impact_plan_details', ipdRecs, 'detail_id', 'Impact Plan Details');

  const iaRows = sheet('Impact_activity_list');
  const iaRecs = iaRows.filter(r => str(r['Activity_code'])).map(r => ({
    activity_code: str(r['Activity_code']),
    category: str(r['Category']),
    country_code: str(r['Country code']),
    detail_name: str(r['Detail of name']),
    notes: str(r['Notes']),
  }));
  if (iaRecs.length) await batchImport(pb, 'impact_activities', iaRecs, 'activity_code', 'Impact Activities');

  // ========================================================
  // 8. GHG Supplier info → suppliers
  // ========================================================
  const supplierRows = sheet('GHG Supplier info');
  const supplierRecs = supplierRows.filter(r => str(r['Supplier ID'])).map(r => ({
    supplier_code: str(r['Supplier ID']),
    company_name: str(r['Supplier name']),
    province: str(r['Province']),
    district: str(r['District']),
    village: str(r['Village']),
    company_address: str(r['Company address']),
    representative_name: str(r['Representative name']),
    certifications: str(r['Certifications']),
    main_products: str(r['Main Products']),
    phone: str(r['Phone']),
    email: str(r['Email']),
    website: str(r['Website']),
    processing_methods: str(r['Processing Methods']),
    packaging_options: str(r['Packaging Options']),
    country: 'laos',
    is_active: true,
  }));
  if (supplierRecs.length) await batchImport(pb, 'suppliers', supplierRecs, 'supplier_code', 'GHG Suppliers');

  // ========================================================
  // 9. GHG FMU, Organic fert, Chemical fert, Wetmill, Drymill
  // ========================================================
  const fmuRows = sheet('GHG FMU');
  const fmuRecs = fmuRows.filter(r => str(r['Farm ID'] || r['Famrer ID'])).map((r, i) => ({
    record_id: `GHG-FMU-${str(r['Supplier ID'])}-${str(r['Famrer ID'] || r['Farmer ID'])}-${str(r['Farm ID'])}-${i}`,
    supplier_id: str(r['Supplier ID']),
    farmer_id_text: str(r['Famrer ID'] || r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    cherry_harvested: num(r['Cherry harvested']),
    parchment_sold: num(r['Parchment sold to SLOW 2024']),
    area_ha: num(r['Areas']),
    mature_area_ha: num(r['Mature areas']),
    polygon: str(r['Polygon']),
    organic_fertilizer_used: str(r['Did this farm use organic fertilizer in 2023?']) === 'Y',
    chemical_fertilizer_used: str(r['Did this farm used chemical fertilizer in 2023?']) === 'Y',
    fuel_type: str(r['Type of Fuel']),
    fuel_volume: num(r['Fuel Volume used']),
    fuel_unit: str(r['Unit fuel used']),
    vehicle_type_to_wetmill: str(r['Type of vehicle used to bring cherry from farm to wet mill']),
    fuel_type_to_wetmill: str(r['Type of fuel used to bring cherry from farm to wet mill']),
    latlong: str(r['Latlong']),
  }));
  if (fmuRecs.length) await batchImport(pb, 'ghg_fmu', fmuRecs, 'record_id', 'GHG FMU');

  const gofRows = sheet('GHG Organic fertilizer');
  const gofRecs = gofRows.filter(r => str(r['Organic fertilizer ID'])).map(r => ({
    record_id: str(r['Organic fertilizer ID']),
    supplier_id: str(r['Supplier ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    mature_area_ha: num(r['Mature areas']),
    fertilizer_type: str(r['Type of organic fertilizer? ']),
    volume_kg: num(r['Volume of each in Kg?']),
    cattle_manure_kg: num(r['Cattle manure (kg)']),
    goat_manure_kg: num(r['Goat manure (kg)']),
    organic_fertilizer_kg: num(r['Organic fertilizer (kg)']),
    coffee_compost_kg: num(r['Coffee compost (kg)']),
    notes: str(r['Notes or comments']),
  }));
  if (gofRecs.length) await batchImport(pb, 'ghg_organic_fertilizer', gofRecs, 'record_id', 'GHG Organic Fertilizer');

  const gcfRows = sheet('GHG Chemical fertilizer');
  const gcfRecs = gcfRows.filter(r => str(r['Chemical fertilizer ID'])).map(r => ({
    record_id: str(r['Chemical fertilizer ID']),
    supplier_id: str(r['Supplier ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    mature_area_ha: num(r['Mature areas']),
    fertilizer_name: str(r['Name of chemical fertilizer ']),
    composition: str(r['Composition of chemical fertilizer type used']),
    n_pct: num(r['% N']),
    p_pct: num(r['% P']),
    k_pct: num(r['% K']),
    dosage: str(r['Dosage']),
    notes: str(r['Notes or comments']),
  }));
  if (gcfRecs.length) await batchImport(pb, 'ghg_chemical_fertilizer', gcfRecs, 'record_id', 'GHG Chemical Fertilizer');

  const gwmRows = sheet('GHG Wetmill');
  const gwmRecs = gwmRows.filter(r => str(r['Supplier ID'])).map((r, i) => ({
    record_id: `GHG-WM-${str(r['Supplier ID'])}-${str(r['Farmer ID'])}-${i}`,
    supplier_id: str(r['Supplier ID']),
    farmer_id_text: str(r['Farmer ID']),
    electricity_kwh: num(r['Electricity (KWh)']),
    fuel_type: str(r['Fuel type']),
    fuel_volume: num(r['Fuel volume used in wet mill']),
    fuel_unit: str(r['Fuel unit type?']),
    cherry_input_kg: num(r['Cherry input to wet mill from 2023 harvest']),
    parchment_output_kg: num(r['Dried Parchment output from 2023 harvest']),
    ratio_cherry_parchment: num(r['Average Ratio from Cherry to Dried Parchment']),
    coordinate: str(r['Coordinate location of wet mill']),
    solid_waste_kg: num(r['Solid waste from wet mill']),
    solid_waste_treatment: str(r['Solid waste treatment']),
    water_source: str(r['Water source for wet mill']),
    water_volume_liters: num(r['Volume of water use for wet mill']),
    wastewater_treatment: str(r['Waste water treatment from wet mill']),
    vehicle_owner: str(r['Whose vehicle used to transfer Parchment to Slow Warehouse']),
    vehicle_type: str(r['Type of vehicle used to bring parchment to SLOW Warehouse']),
    fuel_type_transport: str(r['Type of fuel used to bring parchment to SLOW Warehouuse']),
  }));
  if (gwmRecs.length) await batchImport(pb, 'ghg_wetmill', gwmRecs, 'record_id', 'GHG Wetmill');

  const gdmRows = sheet('GHG Drymill');
  const gdmRecs = gdmRows.filter(r => str(r['Supplier ID'])).map((r, i) => ({
    record_id: `GHG-DM-${str(r['Supplier ID'])}-${str(r['Farmer ID'])}-${i}`,
    supplier_id: str(r['Supplier ID']),
    farmer_id_text: str(r['Farmer ID']),
    parchment_input_kg: num(r['Dried parchment input to dry mill from 2023 Harvest']),
    green_bean_output_kg: num(r['Green bean output to dry mill']),
    ratio_parchment_gb: num(r['Average Ratio from Parchment to Green bean']),
    energy_kwh: num(r['Energy used to proceed all dried parchment to Green bean from 2023 harvest (KWh)']),
    coordinate: str(r['Coordinate location of dry mill facility']),
    vehicle_owner: str(r['Whose vehicle used to transfer green bean to Slow Warehouse']),
    vehicle_type: str(r['Type of vehicle use to bring Green bean to SLOW Warehouuse']),
    fuel_type_transport: str(r['Type of fuel used to bring Green bean to SLOW Warehouuse']),
  }));
  if (gdmRecs.length) await batchImport(pb, 'ghg_drymill', gdmRecs, 'record_id', 'GHG Drymill');

  // ========================================================
  // 10. Farm Blocks + Tree Inventory
  // ========================================================
  const blockRows = sheet('Blocks');
  const blockRecs = blockRows.filter(r => str(r['BlockID'])).map(r => ({
    block_id: str(r['BlockID']),
    block_name: str(r['Block Name'] || r['BlockName']),
    farm_id_text: str(r['Farm ID']),
    coffee_type: str(r['Coffee Type']),
    cultivation_type: str(r['Cultivation Type']),
    area_ha: num(r['Area (ha)']),
    row_by_row: num(r['Row by row']),
    tree_by_tree: num(r['Tree by tree']),
    density_per_ha: num(r['Density (tree/ha)']),
    total_cherry_ton: num(r['Total cherry bean/Block(Ton)']),
    volume_expected_ton_ha: num(r['Volume expected (Ton/ha)']),
    bean_per_kg: num(r['Bean per kg']),
    number_of_rows: num(r['Number of rows']),
    inventory_status: str(r['Inventory status']),
    notes: str(r['Notes']),
    record_date: excelDateToISO(r['Date']),
    staff: str(r['Staff']),
  }));
  if (blockRecs.length) await batchImport(pb, 'farm_blocks', blockRecs, 'block_id', 'Farm Blocks');

  const treeRows = sheet('Trees');
  const treeRecs = treeRows.filter(r => str(r['TreeID'])).map(r => ({
    tree_id: str(r['TreeID']),
    block_id_text: str(r['BlockID']),
    assessment_date: excelDateToISO(r['Date']),
    row_number: num(r['Row number']),
    location: str(r['Location']),
    branch_count: num(r['Branch Count']),
    cluster_l1: num(r['Cluster Count per branch L1']),
    cluster_l2: num(r['Cluster Count per branch L2']),
    cluster_l3: num(r['Cluster Count per branch L3']),
    cluster_l4: num(r['Cluster Count per branch L4']),
    cluster_l5: num(r['Cluster Count per branch L5']),
    cherry_l1: num(r['Cherry Count per cluster L1']),
    cherry_l2: num(r['Cherry Count per cluster L2']),
    cherry_l3: num(r['Cherry Count per cluster L3']),
    cherry_l4: num(r['Cherry Count per cluster L4']),
    cherry_l5: num(r['Cherry Count per cluster L5']),
    bean_per_kg: num(r['Bean per kg']),
    notes: str(r['Notes']),
    photo_path: str(r['Photo']),
    coffee_type: str(r['CoffeeType']),
    ripeness_level: str(r['Ripeness Level']),
    defect_rate: str(r['Defect Rate']),
  }));
  if (treeRecs.length) await batchImport(pb, 'tree_inventory', treeRecs, 'tree_id', 'Tree Inventory');

  // ========================================================
  // 11. EU Organic Inspections + Farm Inspections
  // ========================================================
  const eoiRows = sheet('EU organic farmer');
  const eoiRecs = eoiRows.filter(r => str(r['Inspection ID'])).map(r => {
    // Collect all Q/A pairs into JSON
    const checklist = {};
    for (let i = 1; i <= 32; i++) {
      const q = r[`Q${i}`]; const a = r[`Add${i}`];
      if (q !== undefined && q !== '') checklist[`Q${i}`] = { answer: str(q), comment: str(a) };
    }
    return {
      inspection_id: str(r['Inspection ID']),
      country_code: str(r['Country code']),
      village_id: str(r['Village ID']),
      farmer_id_text: str(r['Farmer ID']),
      farmer_name: str(r['Farmer name']),
      staff_input: str(r['Staff input']),
      inspection_date: excelDateToISO(r['Date']),
      location: str(r['Location']),
      informant: str(r['Informant during the Farm Inspection']),
      type_of_inspection: str(r['Type of Inspection']),
      poultry_count: num(r['No. of Poultry:']),
      pig_count: num(r['No. of Pig:']),
      cow_count: num(r['No. of Cow:']),
      buffalo_count: num(r['No. of Buffaloes']),
      checklist_answers: JSON.stringify(checklist),
      summary: str(r['Summary of inspection']),
      review_result: str(r['Review_Result']),
      review_date: excelDateToISO(r['ReviewCommittee_MeetingDate']),
      reviewer_name: str(r['Member_FullName']),
      reviewer_id: str(r['Member_ID']),
      file_path: str(r['Path file']),
    };
  });
  if (eoiRecs.length) await batchImport(pb, 'eu_organic_inspections', eoiRecs, 'inspection_id', 'EU Organic Inspections');

  const eofiRows = sheet('EU Organic farm');
  const eofiRecs = eofiRows.filter(r => str(r['Inspection Farm ID'])).map(r => ({
    inspection_farm_id: str(r['Inspection Farm ID']),
    inspection_id_text: str(r['Inspection ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    farm_name: str(r['Farm name']),
    land_certificate: str(r['Land certificate']),
    inspection_date: excelDateToISO(r['Date']),
    staff: str(r['Staff']),
    location: str(r['Location']),
    total_area_ha: num(r['Total  Number of Area (ha)']),
    production_system: str(r['Production System']),
    species: str(r['Species of Plant for Organic Agriculture Planting (Species )']),
    a_expected_kg: num(r['A expected produce (kg)']),
    r_expected_kg: num(r['R expected produce (kg)']),
    organic_area_ha: num(r['A total number of area for organic agriculture (ha)']),
    growing_condition_notes: str(r['6. Growing Condition of Coffee Trees (Problem Found and The Solution) While Inspecting Farm']),
    pest_management_notes: str(r['Any Disease']) ? `Disease: ${str(r['Any Disease'])} - ${str(r['Disease description'])} - Mgmt: ${str(r['How to Manage '])}` : '',
    contamination_notes: str(r['Explain the Protective Measure around Organic Farm']),
    file_path: '',
  }));
  if (eofiRecs.length) await batchImport(pb, 'eu_organic_farm_inspections', eofiRecs, 'inspection_farm_id', 'EU Organic Farm Inspections');

  // ========================================================
  // 12. Farm Crop Estimations
  // ========================================================
  const fceRows = sheet('Farm crop estimation');
  const fceRecs = fceRows.filter(r => str(r['Estimate ID'])).map(r => ({
    estimate_id: str(r['Estimate ID']),
    country_code: str(r['Country code']),
    village_id: str(r['Village ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    inspection_farm_id: str(r['Inspection Farm ID']),
    estimate_date: excelDateToISO(r['Date']),
    yield_per_ha: num(r['YieldPerHa']),
    staff: str(r['Staff']),
    species_count: num(r['Number of species of this farm?']),
    a_area_ha: num(r['A area']),
    r_area_ha: num(r['R area']),
    total_area_ha: num(r['TotalArea']),
    farm_area_ha: num(r['Farm area (ha)']),
    type_area: str(r['Type area']),
    a_cherry_kg: num(r['A product estimation (Cherry kg)']),
    r_cherry_kg: num(r['R product estimation (Cherry kg)']),
    cherry_type: str(r['Cherry type product estimation']),
    a_parchment_kg: num(r['A estimation (Parchment kg)']),
    r_parchment_kg: num(r['R estimation (Parchment kg)']),
    parchment_type: str(r['Parchment type product estimation']),
  }));
  if (fceRecs.length) await batchImport(pb, 'farm_crop_estimations', fceRecs, 'estimate_id', 'Farm Crop Estimations');

  // ========================================================
  // 13. Coffee Prices
  // ========================================================
  const cpRows = sheet('Coffee price');
  const cpRecs = cpRows.filter(r => str(r['ID'])).map(r => ({
    price_id: str(r['ID']),
    price_date: excelDateToISO(r['Date']),
    staff_id: str(r['Staff ID']),
    local_high_quality_price: num(r['Local high quality price']),
    local_price: num(r['Local price']),
    economic_price: num(r['Economic price']),
    slow_price: num(r['Slow price']),
    newspaper_price: num(r['Price published by I&C Newspaper']),
    time_slot: str(r['Time slot']),
    notes: str(r['Note']),
  }));
  if (cpRecs.length) await batchImport(pb, 'coffee_prices', cpRecs, 'price_id', 'Coffee Prices');

  // ========================================================
  // 14. Factories
  // ========================================================
  const facRows = sheet('Factory');
  const facRecs = facRows.filter(r => str(r['Factory ID'])).map(r => ({
    factory_id: str(r['Factory ID']),
    country_code: str(r['Country code']),
    factory_name: str(r['Factory name']),
    factory_type: str(r['Factory type']),
    head: str(r['Head']),
    contract_id: str(r['Contract ID']),
    weight_to_contract: num(r['Weight to contract']),
    phone: str(r['Phone']),
    email: str(r['Email']),
    province: str(r['Province']),
    district: str(r['District']),
    commune: str(r['Commnue']),
    village: str(r['Village']),
    address: str(r['Address']),
  }));
  if (facRecs.length) await batchImport(pb, 'factories', facRecs, 'factory_id', 'Factories');

  // ========================================================
  // 15. Farmer Profiles + Details
  // ========================================================
  const fpRows = sheet('Farmer profile');
  const fpRecs = fpRows.filter(r => str(r['Farmer ID'])).map(r => ({
    profile_id: `FP-${str(r['Country code'])}-${str(r['Farmer ID'])}`,
    country_code: str(r['Country code']),
    village_id: str(r['Village ID']),
    farmer_id_text: str(r['Farmer ID']),
    survey_date: excelDateToISO(r['Date']),
    staff: str(r['Staff']),
    farmer_name: str(r['Farmer name']),
    gender: str(r['Gender']),
    ethnicity: str(r['Ethnicity ']),
    year_of_birth: num(r['Year of birth']),
    household_type: str(r['Type of  household ']),
    total_family_members: num(r['Total family members']),
    female_members: num(r['Number of female members']),
    income_earners: num(r['Number of income earner']),
    members_under_16: num(r['Number of member under 16 - year old']),
    income_sources: str(r['Name of main income sources of family']),
    total_cash_income: num(r['Total cash income/year of family in last year']),
    avg_cherry_price: num(r['Average A cherry price of the last crop']),
    total_cherry_volume: num(r['Total volume of A cherry of the last crop']),
    production_cost: num(r['Total cost of A production (fertilizer, hired labor cost,…) of last year crop']),
    other_income: num(r['Other income from fruit trees and other crops (ginger, liberica, ...) that mixed in the coffee plantation in last year']),
    total_coffee_area_ha: num(r['Total area of A coffee, in which']),
    mature_coffee_area_ha: num(r['Total area of mature A coffee (harvesting)']),
    immature_coffee_area_ha: num(r['Total area of inmature A coffee (not yet harvesting)']),
    num_coffee_plots: num(r['Number of plot of A coffee or mixed A with other crops']),
  }));
  if (fpRecs.length) await batchImport(pb, 'farmer_profiles', fpRecs, 'profile_id', 'Farmer Profiles');

  const fpdRows = sheet('Farmer profile detail');
  const fpdRecs = fpdRows.filter(r => str(r['Farm ID'])).map(r => ({
    detail_id: `FPD-${str(r['Country code'])}-${str(r['Farm ID'])}`,
    country_code: str(r['Country code']),
    village_id: str(r['Village ID']),
    farmer_id_text: str(r['Farmer ID']),
    farm_id_text: str(r['Farm ID']),
    farm_name: str(r['Farm name']),
    registered_agroforestry: str(r['Registered for A agroforestry conversion']),
    polygon: str(r['Plot polygon']),
    land_tenure_status: str(r['Land tenure certificate status ']),
    slope: str(r['Slope of the plot']),
    plot_area_ha: num(r['Total area of plot ']),
    coffee_tree_count: num(r['Number of planted coffee tree (as main cash crop)']),
    planting_year: num(r['Planting year of majority coffee']),
    annual_cherry_yield_kg: num(r['Annual yield of cherries in the plot']),
    volume_to_slow_kg: num(r['Volume of cherry coffee that supplied to Slow']),
    shade_trees_past: num(r['Number of  shade trees planted in the plot 1 in the past']),
    shade_tree_species: str(r['Name of share trees (multiple choice option)']),
    pffp_shade_trees: num(r['Number of  shade trees planted by PFFP support']),
    surviving_pffp_trees: num(r['Number of  survival shade trees from PFFP support']),
  }));
  if (fpdRecs.length) await batchImport(pb, 'farmer_profile_details', fpdRecs, 'detail_id', 'Farmer Profile Details');

  // ========================================================
  // 16. SLOW Farm Daily + Weekly Checks
  // ========================================================
  const sdcRows = sheet('SLOW Farm daily check');
  const sdcRecs = sdcRows.filter(r => str(r['ID'])).map(r => {
    const keys = Object.keys(r);
    const checklist = {};
    keys.forEach(k => {
      if (k !== 'ID' && k !== 'Date' && k !== 'Staff input' && k !== 'Country' &&
          k !== 'Province' && k !== 'District' && k !== 'Commune' &&
          k !== 'More detail address' && k !== 'Interview Location' && k !== 'Farm name') {
        if (r[k] !== '') checklist[k] = str(r[k]);
      }
    });
    return {
      check_id: str(r['ID']),
      check_date: excelDateToISO(r['Date']),
      staff_input: str(r['Staff input']),
      country: str(r['Country']),
      province: str(r['Province']),
      district: str(r['District']),
      location: str(r['Interview Location']),
      farm_name: str(r['Farm name']),
      checklist_answers: JSON.stringify(checklist),
    };
  });
  if (sdcRecs.length) await batchImport(pb, 'sf_daily_checks', sdcRecs, 'check_id', 'SF Daily Checks');

  const swcRows = sheet('SLOW Farm weekly check');
  const swcRecs = swcRows.filter(r => str(r['ID'])).map(r => {
    const housingChecklist = {};
    const officeChecklist = {};
    const keys = Object.keys(r);
    let section = 'housing';
    keys.forEach(k => {
      if (k.includes('FIELD OFFICE')) section = 'office';
      if (k !== 'ID' && k !== 'Date' && k !== 'Staff input' && k !== 'Interview Location' && k !== 'Farm name') {
        if (r[k] !== '') {
          if (section === 'housing') housingChecklist[k] = str(r[k]);
          else officeChecklist[k] = str(r[k]);
        }
      }
    });
    return {
      check_id: str(r['ID']),
      check_date: excelDateToISO(r['Date']),
      staff_input: str(r['Staff input']),
      location: str(r['Interview Location']),
      farm_name: str(r['Farm name']),
      housing_checklist: JSON.stringify(housingChecklist),
      office_checklist: JSON.stringify(officeChecklist),
    };
  });
  if (swcRecs.length) await batchImport(pb, 'sf_weekly_checks', swcRecs, 'check_id', 'SF Weekly Checks');

  // ========================================================
  // DONE
  // ========================================================
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✓ Main data.xlsx import complete!');
  console.log('═══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
