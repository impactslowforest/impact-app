/**
 * Create collections via PocketBase Admin API
 */
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8091');
pb.autoCancellation(false);
await pb.collection('_superusers').authWithPassword('trung@slowforest.com', '1a111111');

// Get farmers and farms collection IDs
const farmersCol = await pb.collections.getOne('farmers');
const farmsCol = await pb.collections.getOne('farms');
let suppliersCol;
try { suppliersCol = await pb.collections.getOne('suppliers'); } catch(e) { console.log('suppliers not found'); process.exit(1); }

const farmersId = farmersCol.id;
const farmsId = farmsCol.id;
const suppliersId = suppliersCol.id;

console.log(`farmers: ${farmersId}, farms: ${farmsId}, suppliers: ${suppliersId}`);

const authRule = '@request.auth.id != ""';

async function createCol(name, fields, indexes) {
  try {
    // Check if exists
    const existing = await pb.collections.getOne(name);
    console.log(`  ${name} already exists (${existing.id})`);
    return existing;
  } catch(e) {
    // Create new
  }

  const col = await pb.collections.create({
    name,
    type: 'base',
    fields,
    indexes: indexes || [],
    listRule: authRule,
    viewRule: authRule,
    createRule: authRule,
    updateRule: authRule,
    deleteRule: authRule,
  });
  console.log(`  Created ${name} (${col.id})`);
  return col;
}

// 1. farmer_log_books
const flb = await createCol('farmer_log_books', [
  { type: 'text', name: 'log_code', required: true, max: 50 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'text', name: 'village_code', max: 20 },
  { type: 'text', name: 'farmer_name', max: 200 },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'process', max: 100 },
  { type: 'number', name: 'eu_organic_kg', min: 0 },
  { type: 'number', name: 'fairtrade_kg', min: 0 },
  { type: 'number', name: 'non_certificate_kg', min: 0 },
  { type: 'date', name: 'log_date' },
  { type: 'number', name: 'latitude' },
  { type: 'number', name: 'longitude' },
  { type: 'text', name: 'dry_mill_name', max: 200 },
  { type: 'number', name: 'moisture_pct' },
  { type: 'number', name: 'aw_level' },
  { type: 'number', name: 'number_of_bags', min: 0 },
  { type: 'number', name: 'weight_total_kg', min: 0 },
  { type: 'date', name: 'delivery_date' },
  { type: 'text', name: 'remark' },
  { type: 'text', name: 'staff_input', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_flb_log_code ON farmer_log_books (log_code)']);

// 2. farm_log_books
const fmlb = await createCol('farm_log_books', [
  { type: 'text', name: 'log_code', required: true, max: 50 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'relation', name: 'farmer_log_book', collectionId: flb.id, maxSelect: 1 },
  { type: 'text', name: 'village_code', max: 20 },
  { type: 'text', name: 'farm_name', max: 200 },
  { type: 'text', name: 'certificate', max: 300 },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'process', max: 100 },
  { type: 'date', name: 'log_date' },
  { type: 'number', name: 'latitude' },
  { type: 'number', name: 'longitude' },
  { type: 'text', name: 'dry_mill_name', max: 200 },
  { type: 'number', name: 'moisture_pct' },
  { type: 'number', name: 'aw_level' },
  { type: 'number', name: 'number_of_bags', min: 0 },
  { type: 'number', name: 'weight_per_bag_kg', min: 0 },
  { type: 'number', name: 'weight_total_kg', min: 0 },
  { type: 'date', name: 'delivery_date' },
  { type: 'text', name: 'remark' },
  { type: 'text', name: 'staff_input', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_fmlb_log_code ON farm_log_books (log_code)']);

// 3. harvesting_logs
const hl = await createCol('harvesting_logs', [
  { type: 'text', name: 'log_code', required: true, max: 50 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'text', name: 'village_code', max: 20 },
  { type: 'text', name: 'village_name', max: 200 },
  { type: 'text', name: 'farmer_name', max: 200 },
  { type: 'text', name: 'farm_name', max: 200 },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'species', max: 200 },
  { type: 'date', name: 'picking_date' },
  { type: 'number', name: 'latitude' },
  { type: 'number', name: 'longitude' },
  { type: 'text', name: 'staff_input', max: 50 },
  { type: 'date', name: 'date_report' },
  { type: 'number', name: 'eu_organic_kg', min: 0 },
  { type: 'number', name: 'fairtrade_kg', min: 0 },
  { type: 'number', name: 'non_certificate_kg', min: 0 },
  { type: 'number', name: 'cherry_picked_kg', min: 0 },
  { type: 'number', name: 'ripe_pulped_kg', min: 0 },
  { type: 'number', name: 'float_rate_kg', min: 0 },
  { type: 'number', name: 'fermentation_hours' },
  { type: 'date', name: 'fermentation_date' },
  { type: 'number', name: 'wet_parchment_kg', min: 0 },
  { type: 'number', name: 'rate_parchment' },
  { type: 'number', name: 'dry_parchment_kg', min: 0 },
  { type: 'number', name: 'drying_days', min: 0 },
  { type: 'date', name: 'drying_start_date' },
  { type: 'date', name: 'drying_end_date' },
  { type: 'number', name: 'moisture_pct' },
  { type: 'text', name: 'stored_at', max: 200 },
  { type: 'date', name: 'transport_date' },
  { type: 'text', name: 'remark' },
  { type: 'text', name: 'status', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
  { type: 'relation', name: 'farm_log_book', collectionId: fmlb.id, maxSelect: 1 },
], ['CREATE UNIQUE INDEX idx_hl_log_code ON harvesting_logs (log_code)']);

// 4. log_book_details
const lbd = await createCol('log_book_details', [
  { type: 'text', name: 'lot_code', required: true, max: 50 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'relation', name: 'farmer_log_book', collectionId: flb.id, maxSelect: 1 },
  { type: 'relation', name: 'farm_log_book', collectionId: fmlb.id, maxSelect: 1 },
  { type: 'text', name: 'village_code', max: 20 },
  { type: 'text', name: 'farm_name', max: 200 },
  { type: 'text', name: 'certificate', max: 300 },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'process', max: 100 },
  { type: 'date', name: 'log_date' },
  { type: 'text', name: 'dry_mill_name', max: 200 },
  { type: 'number', name: 'moisture_pct' },
  { type: 'number', name: 'aw_level' },
  { type: 'number', name: 'number_of_bags', min: 0 },
  { type: 'number', name: 'weight_total_kg', min: 0 },
  { type: 'number', name: 'weight_per_bag_kg', min: 0 },
  { type: 'date', name: 'delivery_date' },
  { type: 'text', name: 'sale_status', max: 50 },
  { type: 'text', name: 'remark' },
  { type: 'text', name: 'staff_input', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_lbd_lot_code ON log_book_details (lot_code)']);

// 5. inbound_requests
const ir = await createCol('inbound_requests', [
  { type: 'text', name: 'inbound_code', max: 50 },
  { type: 'text', name: 'source', max: 100 },
  { type: 'text', name: 'input_type', max: 100 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'relation', name: 'supplier', collectionId: suppliersId, maxSelect: 1 },
  { type: 'text', name: 'village_code', max: 20 },
  { type: 'text', name: 'village_name', max: 200 },
  { type: 'text', name: 'farmer_name', max: 200 },
  { type: 'text', name: 'farmer_code', max: 50 },
  { type: 'text', name: 'farm_code', max: 50 },
  { type: 'text', name: 'company_name', max: 300 },
  { type: 'text', name: 'staff', max: 50 },
  { type: 'date', name: 'request_date' },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'process', max: 100 },
  { type: 'number', name: 'total_bags', min: 0 },
  { type: 'number', name: 'moisture_pct' },
  { type: 'number', name: 'weight_total_kg', min: 0 },
  { type: 'number', name: 'check_bags', min: 0 },
  { type: 'number', name: 'check_moisture_pct' },
  { type: 'number', name: 'check_weight_kg', min: 0 },
  { type: 'text', name: 'requestor_info', max: 500 },
  { type: 'text', name: 'status', max: 50 },
  { type: 'text', name: 'vehicle_number', max: 50 },
  { type: 'text', name: 'approval_status', max: 50 },
  { type: 'text', name: 'outbound_status', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_ir_inbound_code ON inbound_requests (inbound_code)']);

// 6. outbound_requests
await createCol('outbound_requests', [
  { type: 'text', name: 'outbound_code', required: true, max: 50 },
  { type: 'text', name: 'source', max: 100 },
  { type: 'relation', name: 'owner', collectionId: suppliersId, maxSelect: 1 },
  { type: 'relation', name: 'inbound_request', collectionId: ir.id, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'text', name: 'bean_type', max: 100 },
  { type: 'text', name: 'variety', max: 200 },
  { type: 'text', name: 'process', max: 100 },
  { type: 'text', name: 'certificate_type', max: 200 },
  { type: 'number', name: 'inbound_bags', min: 0 },
  { type: 'number', name: 'inbound_quantity_kg', min: 0 },
  { type: 'text', name: 'season', max: 20 },
  { type: 'number', name: 'inbound_moisture_pct' },
  { type: 'number', name: 'active_water_level' },
  { type: 'text', name: 'request_by', max: 200 },
  { type: 'text', name: 'outbound_zone', max: 200 },
  { type: 'date', name: 'outbound_date' },
  { type: 'text', name: 'outbound_type', max: 100 },
  { type: 'text', name: 'outbound_reason' },
  { type: 'number', name: 'outbound_bags', min: 0 },
  { type: 'number', name: 'outbound_quantity_kg', min: 0 },
  { type: 'number', name: 'outbound_moisture_pct' },
  { type: 'number', name: 'outbound_aw_level' },
  { type: 'number', name: 'dry_parchment_hulled_kg', min: 0 },
  { type: 'number', name: 'green_bean_kg', min: 0 },
  { type: 'text', name: 'staff', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_or_outbound_code ON outbound_requests (outbound_code)']);

// 7. inbound_request_details
const ird = await createCol('inbound_request_details', [
  { type: 'text', name: 'detail_code', required: true, max: 60 },
  { type: 'relation', name: 'inbound_request', collectionId: ir.id, maxSelect: 1 },
  { type: 'relation', name: 'farmer', collectionId: farmersId, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'text', name: 'lot_code', max: 50 },
  { type: 'text', name: 'lot_detail_code', max: 60 },
  { type: 'text', name: 'staff', max: 50 },
  { type: 'date', name: 'detail_date' },
  { type: 'text', name: 'check_result', max: 50 },
  { type: 'text', name: 're_type', max: 100 },
  { type: 'text', name: 're_organic', max: 10 },
  { type: 'text', name: 're_fairtrade', max: 10 },
  { type: 'number', name: 're_bags', min: 0 },
  { type: 'number', name: 're_qty_per_bag' },
  { type: 'number', name: 're_total_qty' },
  { type: 'text', name: 're_uom', max: 10 },
  { type: 'number', name: 're_moisture_pct' },
  { type: 'text', name: 're_aw_level', max: 20 },
  { type: 'text', name: 'wh_type', max: 100 },
  { type: 'text', name: 'wh_organic', max: 10 },
  { type: 'text', name: 'wh_fairtrade', max: 10 },
  { type: 'number', name: 'wh_bags', min: 0 },
  { type: 'number', name: 'wh_qty_per_bag' },
  { type: 'number', name: 'wh_total_qty' },
  { type: 'text', name: 'wh_uom', max: 10 },
  { type: 'number', name: 'wh_moisture_pct' },
  { type: 'text', name: 'wh_aw_level', max: 20 },
  { type: 'text', name: 'quality_assessment', max: 100 },
  { type: 'text', name: 'status', max: 50 },
  { type: 'text', name: 'approval_status', max: 50 },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_ird_detail_code ON inbound_request_details (detail_code)']);

// 8. inbound_check_details
await createCol('inbound_check_details', [
  { type: 'text', name: 'check_code', required: true, max: 80 },
  { type: 'relation', name: 'inbound_request', collectionId: ir.id, maxSelect: 1 },
  { type: 'relation', name: 'inbound_detail', collectionId: ird.id, maxSelect: 1 },
  { type: 'relation', name: 'farm', collectionId: farmsId, maxSelect: 1 },
  { type: 'text', name: 'lot_detail_code', max: 60 },
  { type: 'text', name: 'staff', max: 50 },
  { type: 'date', name: 'check_date' },
  { type: 'number', name: 'moisture_pct' },
  { type: 'number', name: 'total_bag_weight_kg' },
  { type: 'number', name: 'number_of_bags', min: 0 },
  { type: 'number', name: 'weight_per_bag_kg' },
  { type: 'text', name: 'remark' },
  { type: 'select', name: 'country', values: ['indonesia', 'vietnam', 'laos'] },
  { type: 'text', name: 'season', max: 20 },
  { type: 'autodate', name: 'created', onCreate: true, onUpdate: false },
  { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
], ['CREATE UNIQUE INDEX idx_icd_check_code ON inbound_check_details (check_code)']);

console.log('\nAll 8 collections created! Ready for import.');
