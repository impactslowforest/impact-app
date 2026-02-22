/**
 * Import Farmer + Farm data from Main data.xlsx into PocketBase.
 *
 * Usage:
 *   node scripts/import-excel-data.mjs <admin-email> <admin-password>
 *
 * Example:
 *   node scripts/import-excel-data.mjs trung@slowforest.com yourpassword
 *
 * Prerequisites:
 *   - PocketBase running at http://127.0.0.1:8091
 *   - Admin credentials
 *   - npm packages: xlsx, pocketbase (already installed)
 */

import XLSX from 'xlsx';
import PocketBase from 'pocketbase';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──
const PB_URL = 'http://127.0.0.1:8091';
const EXCEL_PATH = path.resolve(__dirname, '../../Main data.xlsx');

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/import-excel-data.mjs <admin-email> <admin-password>');
  process.exit(1);
}

// ── Helpers ──

/** Convert Excel serial date to ISO string (YYYY-MM-DD) */
function excelDateToISO(serial) {
  if (!serial) return '';
  if (typeof serial === 'string') return serial;
  const date = new Date((serial - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

/** Normalize country name */
function normalizeCountry(raw) {
  if (!raw) return 'laos';
  const lower = String(raw).toLowerCase().trim();
  if (lower.includes('viet') || lower.includes('vietnam')) return 'vietnam';
  if (lower.includes('lao')) return 'laos';
  if (lower.includes('indo')) return 'indonesia';
  return 'laos';
}

/** Normalize gender */
function normalizeGender(raw) {
  if (!raw) return 'male';
  const lower = String(raw).toLowerCase().trim();
  if (lower === 'mrs' || lower === 'ms' || lower === 'female' || lower === 'f') return 'female';
  return 'male';
}

/** Normalize status to is_active boolean */
function normalizeStatus(raw) {
  if (!raw) return true;
  const lower = String(raw).toLowerCase().trim();
  return lower !== 'resign';
}

/** Normalize certification/type area */
function normalizeTypeArea(raw) {
  if (!raw) return 'none';
  const lower = String(raw).toLowerCase().trim();
  if (lower === 'org' || lower === 'organic') return 'organic';
  if (lower === 'inc' || lower === 'icn' || lower === 'in conversion') return 'transitional';
  if (lower === 'conv' || lower === 'conventional') return 'conventional';
  return 'none';
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

/** Commodity based on country */
function commodityForCountry(country) {
  return country === 'indonesia' ? 'cacao' : 'coffee';
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Impact App — Excel Data Import');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Excel: ${EXCEL_PATH}`);
  console.log(`  PocketBase: ${PB_URL}`);
  console.log('');

  // 1. Connect to PocketBase
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  // Try superuser auth FIRST (bypasses API Rules)
  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    console.log(`✓ Authenticated as superuser: ${adminEmail}`);
  } catch (err) {
    // Fall back to regular user auth
    try {
      await pb.collection('users').authWithPassword(adminEmail, adminPassword);
      console.log(`✓ Authenticated as user: ${pb.authStore.record?.email}`);
      console.log('  ⚠ Warning: Regular user auth — API Rules may block some operations');
    } catch (err2) {
      console.error('✗ Authentication failed. Check credentials.');
      console.error(err2.message);
      process.exit(1);
    }
  }

  // 2. Read Excel
  console.log('\n── Reading Excel file ──');
  const workbook = XLSX.readFile(EXCEL_PATH);

  const farmerSheet = workbook.Sheets['Farmer data'];
  const farmSheet = workbook.Sheets['Farm data'];

  if (!farmerSheet) { console.error('✗ Sheet "Farmer data" not found'); process.exit(1); }
  if (!farmSheet) { console.error('✗ Sheet "Farm data" not found'); process.exit(1); }

  const farmerRows = XLSX.utils.sheet_to_json(farmerSheet, { defval: '' });
  const farmRows = XLSX.utils.sheet_to_json(farmSheet, { defval: '' });

  console.log(`  Farmer data: ${farmerRows.length} rows`);
  console.log(`  Farm data:   ${farmRows.length} rows`);

  // 3. Check for existing data (avoid duplicates)
  console.log('\n── Checking existing records ──');
  let existingFarmers = [];
  let existingFarms = [];
  try {
    existingFarmers = await pb.collection('farmers').getFullList({ fields: 'id,farmer_code' });
    existingFarms = await pb.collection('farms').getFullList({ fields: 'id,farm_code' });
  } catch (err) {
    console.log('  (Could not check existing records — collections may not exist yet)');
  }

  const existingFarmerCodes = new Set(existingFarmers.map(f => f.farmer_code));
  const existingFarmCodes = new Set(existingFarms.map(f => f.farm_code));

  console.log(`  Existing farmers: ${existingFarmerCodes.size}`);
  console.log(`  Existing farms:   ${existingFarmCodes.size}`);

  // 3b. Resolve cooperatives per country (required relation field)
  console.log('\n── Resolving cooperatives ──');
  const coopByCountry = new Map(); // country → cooperative record ID

  try {
    const existingCoops = await pb.collection('cooperatives').getFullList({ fields: 'id,country,name' });
    for (const coop of existingCoops) {
      if (!coopByCountry.has(coop.country)) {
        coopByCountry.set(coop.country, coop.id);
      }
    }
    console.log(`  Found cooperatives for: ${[...coopByCountry.keys()].join(', ') || 'none'}`);
  } catch (err) {
    console.log('  (Could not fetch cooperatives)');
  }

  // Create default cooperatives for countries that don't have one
  const defaultCoops = [
    { country: 'laos', code: 'COOP-LA-DEFAULT', commodity: 'coffee' },
    { country: 'vietnam', code: 'COOP-VN-DEFAULT', commodity: 'coffee' },
    { country: 'indonesia', code: 'COOP-ID-DEFAULT', commodity: 'cacao' },
  ];

  for (const { country, code, commodity } of defaultCoops) {
    if (!coopByCountry.has(country)) {
      try {
        const coop = await pb.collection('cooperatives').create({
          coop_code: code,
          name: `${country.charAt(0).toUpperCase() + country.slice(1)} Cooperative (Default)`,
          country,
          commodity,
          is_active: true,
        });
        coopByCountry.set(country, coop.id);
        console.log(`  ✓ Created default cooperative for ${country}: ${coop.id}`);
      } catch (err) {
        const detail = err.response?.data || err.data || err.message;
        console.error(`  ✗ Failed to create cooperative for ${country}: ${JSON.stringify(detail)}`);
      }
    }
  }

  // 4. Import Farmers
  console.log('\n── Importing Farmers ──');
  const farmerIdMap = new Map(); // farmer_code → PocketBase record ID
  let farmerCreated = 0;
  let farmerSkipped = 0;
  let farmerErrors = 0;

  // First, populate map with existing records
  for (const ef of existingFarmers) {
    farmerIdMap.set(ef.farmer_code, ef.id);
  }

  for (let i = 0; i < farmerRows.length; i++) {
    const row = farmerRows[i];
    const farmerCode = str(row['Farmer ID']);

    if (!farmerCode) {
      console.log(`  [${i + 1}] SKIP — empty Farmer ID`);
      farmerSkipped++;
      continue;
    }

    // Skip if already exists
    if (existingFarmerCodes.has(farmerCode)) {
      farmerSkipped++;
      // Map the existing ID
      const existing = existingFarmers.find(f => f.farmer_code === farmerCode);
      if (existing) farmerIdMap.set(farmerCode, existing.id);
      continue;
    }

    const country = normalizeCountry(row['Country']);
    const yearOfBirth = row['Year of birth'];
    let dob = '';
    if (yearOfBirth) {
      if (typeof yearOfBirth === 'number' && yearOfBirth > 1900 && yearOfBirth < 2100) {
        dob = `${yearOfBirth}-01-01`;
      } else if (typeof yearOfBirth === 'number') {
        dob = excelDateToISO(yearOfBirth);
      }
    }

    const coopId = coopByCountry.get(country);
    if (!coopId) {
      console.error(`  ✗ [${farmerCode}] No cooperative for country "${country}"`);
      farmerErrors++;
      continue;
    }

    const data = {
      farmer_code: farmerCode,
      cooperative: coopId,
      country,
      full_name: str(row['Farmer name']),
      gender: normalizeGender(row['Gender']),
      date_of_birth: dob,
      phone: str(row['Phone']),
      id_card_number: str(row['ID card']),
      province: str(row['Province']),
      district: str(row['District']),
      village: str(row['Village name']),
      address: str(row['Commune']) || str(row['Location']),
      farm_size_ha: num(row['Area']),
      qr_code: str(row['QR']),
      certification_status: 'none',
      is_active: normalizeStatus(row['Status']),
      registration_date: excelDateToISO(row['Date']) || new Date().toISOString().split('T')[0],
      household_size: 0,
      education_level: 'none',
      latitude: 0,
      longitude: 0,
      polygon_geojson: '',
    };

    try {
      const record = await pb.collection('farmers').create(data);
      farmerIdMap.set(farmerCode, record.id);
      farmerCreated++;
      if (farmerCreated % 20 === 0) {
        process.stdout.write(`  ✓ ${farmerCreated} farmers created...\r`);
      }
    } catch (err) {
      farmerErrors++;
      if (farmerErrors <= 5) {
        const detail = err.response?.data || err.data || err.message;
        console.error(`  ✗ [${farmerCode}] ${JSON.stringify(detail)}`);
      }
    }
  }

  console.log(`\n  ✓ Farmers: ${farmerCreated} created, ${farmerSkipped} skipped, ${farmerErrors} errors`);

  // 5. Import Farms
  console.log('\n── Importing Farms ──');
  let farmCreated = 0;
  let farmSkipped = 0;
  let farmErrors = 0;

  for (let i = 0; i < farmRows.length; i++) {
    const row = farmRows[i];
    const farmCode = str(row['Farm ID']);
    const farmerCode = str(row['Farmer ID']);

    if (!farmCode) {
      console.log(`  [${i + 1}] SKIP — empty Farm ID`);
      farmSkipped++;
      continue;
    }

    // Skip if already exists
    if (existingFarmCodes.has(farmCode)) {
      farmSkipped++;
      continue;
    }

    // Resolve farmer relation
    const farmerId = farmerIdMap.get(farmerCode);
    if (!farmerId) {
      console.error(`  ✗ [${farmCode}] Farmer "${farmerCode}" not found in PocketBase`);
      farmErrors++;
      continue;
    }

    // Determine country from farmer data
    const farmerRow = farmerRows.find(f => str(f['Farmer ID']) === farmerCode);
    const country = farmerRow ? normalizeCountry(farmerRow['Country']) : 'laos';

    const { lat, lng } = parseLatLng(row['Latlong']);

    const data = {
      farm_code: farmCode,
      farmer: farmerId,
      country,
      farm_name: str(row['Farm name']) || `Farm ${farmCode}`,
      area_ha: num(row['Farm area (ha)']),
      latitude: lat,
      longitude: lng,
      elevation_m: 0,
      polygon_geojson: '',
      commodity: commodityForCountry(country),
      production_system: 'agroforestry',
      certification_status: normalizeTypeArea(row['Type area']),
      coffee_trees_count: 0,
      shade_trees_count: 0,
      soil_type: '',
      village: str(row['Village name']),
      district: farmerRow ? str(farmerRow['District']) : '',
      province: farmerRow ? str(farmerRow['Province']) : '',
      notes: [
        row['Distance to drymill (km)'] ? `Distance to drymill: ${row['Distance to drymill (km)']} km` : '',
        row['Distance to home/offcice (km)'] ? `Distance to home: ${row['Distance to home/offcice (km)']} km` : '',
        row['Land use certificate status'] ? `Land cert: ${row['Land use certificate status']}` : '',
        row['A product estimation (Cherry)'] ? `Cherry est: ${row['A product estimation (Cherry)']} kg` : '',
        row['Product estimation (Parchment)'] ? `Parchment est: ${row['Product estimation (Parchment)']} kg` : '',
      ].filter(Boolean).join(' | '),
      is_active: normalizeStatus(row['Status']),
      qr_code: str(row['QR code']),
    };

    try {
      await pb.collection('farms').create(data);
      farmCreated++;
      if (farmCreated % 20 === 0) {
        process.stdout.write(`  ✓ ${farmCreated} farms created...\r`);
      }
    } catch (err) {
      farmErrors++;
      if (farmErrors <= 5) {
        const detail = err.response?.data || err.data || err.message;
        console.error(`  ✗ [${farmCode}] ${JSON.stringify(detail)}`);
      }
    }
  }

  console.log(`\n  ✓ Farms: ${farmCreated} created, ${farmSkipped} skipped, ${farmErrors} errors`);

  // 6. Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Import Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Farmers: ${farmerCreated} created / ${farmerSkipped} skipped / ${farmerErrors} errors`);
  console.log(`  Farms:   ${farmCreated} created / ${farmSkipped} skipped / ${farmErrors} errors`);
  console.log(`  Total farmer ID mappings: ${farmerIdMap.size}`);
  console.log('═══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
