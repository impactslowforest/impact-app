/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 022: Consolidate farmers & farms schema
 *
 * Adds missing datapoints from ALL country sheets (VN, LA, Farm_LAO, Indo, EUDR)
 * into the unified farmers and farms collections.
 *
 * After this migration, farmer_profiles and farmer_profile_details are deleted
 * (their data should be migrated first via import_merge_profiles.js).
 */
migrate(
  (app) => {
    // ============================================================
    // PART 1: Add new fields to FARMERS collection
    // ============================================================
    const farmers = app.findCollectionByNameOrId('farmers');

    // --- From farmer_profiles (merge) ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'income_sources', maxSize: 500,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'avg_cherry_price', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'total_cash_income', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'production_cost', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'other_income', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'fertilizer_data', maxSize: 10000,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'pesticide_data', maxSize: 10000,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'biodiversity_data', maxSize: 10000,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'energy_data', maxSize: 5000,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'child_labor_data', maxSize: 5000,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'financial_data', maxSize: 10000,
    }));

    // --- From VN datapoints ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'farmer_group_name', maxSize: 200,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'household_circumstances', maxSize: 500,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'supported_by', maxSize: 500,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'existing_certifications_detail', maxSize: 500,
    }));

    // --- From LA production (on base farmer) ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'mature_coffee_area_ha', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'immature_coffee_area_ha', min: 0,
    }));

    // --- From Indo ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'observation_stations', maxSize: 500,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'family_data', maxSize: 20000,
    }));

    // --- From VN Commercial ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'cherry_sales_committed_kg', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'cherry_sales_actual_kg', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'number', name: 'revenue_from_slow', min: 0,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'processor_channel', maxSize: 200,
    }));

    // --- From VN Project Support ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'bool', name: 'farm_registered_for_support',
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'training_attendance', maxSize: 500,
    }));
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'op6_activities', maxSize: 500,
    }));

    // --- From LA datapoints (type_of_area) ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'text', name: 'type_of_area', maxSize: 200,
    }));

    // --- EUDR compliance (consolidated JSON) ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'eudr_compliance_data', maxSize: 10000,
    }));

    // --- Herbicide data (VN) ---
    farmers.fields.addAt(farmers.fields.length, new Field({
      type: 'json', name: 'herbicide_data', maxSize: 10000,
    }));

    app.save(farmers);
    console.log('✅ Added 30 new fields to farmers collection');

    // ============================================================
    // PART 2: Add new fields to FARMS collection
    // ============================================================
    const farms = app.findCollectionByNameOrId('farms');

    // --- From farmer_profile_details (merge) ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'registered_agroforestry', maxSize: 200,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'slope', maxSize: 100,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'planting_year',
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'volume_to_slow_kg', min: 0,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'shade_trees_past', min: 0,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'pffp_shade_trees', min: 0,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'surviving_pffp_trees', min: 0,
    }));

    // --- From Indo Farm ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'land_certificate', maxSize: 200,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'land_ownership_certificate', maxSize: 200,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'number_of_species', min: 0,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'plant_density_spacing', maxSize: 200,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'shade_level_pct', min: 0, max: 100,
    }));

    // --- From Indo Species/Tree data (JSON consolidations) ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'species_data', maxSize: 20000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'tree_index_data', maxSize: 20000,
    }));

    // --- From Indo Fertilizer/Pesticide data (JSON) ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'agroforestry_fertilizer_data', maxSize: 10000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'chemical_fertilizer_data', maxSize: 10000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'compost_data', maxSize: 10000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'pesticide_detail_data', maxSize: 10000,
    }));

    // --- From Indo RA Certificate ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'json', name: 'ra_compliance_data', maxSize: 20000,
    }));

    // --- From VN plot-level ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'map_sheet', maxSize: 100,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'shade_trees_before', min: 0,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'annual_cherry_yield_kg', min: 0,
    }));

    // --- From Farm_LAO (not in farms yet) ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'treatment_method', maxSize: 200,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'bool', name: 'forbidden_chem_use',
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'water_pollution_risk', maxSize: 50,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'air_pollution_risk', maxSize: 50,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'farm_tools_inventory', maxSize: 1000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'non_conformity_history', maxSize: 1000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'correction_status', maxSize: 50,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'corrective_action', maxSize: 1000,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'protection_method', maxSize: 500,
    }));
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'number', name: 'dist_to_chemical_farm_km', min: 0,
    }));

    // --- EUDR status at farm level ---
    farms.fields.addAt(farms.fields.length, new Field({
      type: 'text', name: 'eudr_status', maxSize: 50,
    }));

    app.save(farms);
    console.log('✅ Added 33 new fields to farms collection');

    // NOTE: farmer_profiles and farmer_profile_details are NOT deleted here.
    // Run import_merge_profiles.js first, then migration 023 to delete them.
    console.log('✅ Migration 022 complete — run merge script, then migration 023');
  },
  (app) => {
    // REVERT: Remove added fields from farmers
    const farmers = app.findCollectionByNameOrId('farmers');
    const farmerFieldsToRemove = [
      'income_sources', 'avg_cherry_price', 'total_cash_income', 'production_cost',
      'other_income', 'fertilizer_data', 'pesticide_data', 'biodiversity_data',
      'energy_data', 'child_labor_data', 'financial_data', 'farmer_group_name',
      'household_circumstances', 'supported_by', 'existing_certifications_detail',
      'mature_coffee_area_ha', 'immature_coffee_area_ha', 'observation_stations',
      'family_data', 'cherry_sales_committed_kg', 'cherry_sales_actual_kg',
      'revenue_from_slow', 'processor_channel', 'farm_registered_for_support',
      'training_attendance', 'op6_activities', 'type_of_area',
      'eudr_compliance_data', 'herbicide_data',
    ];
    farmerFieldsToRemove.forEach(name => {
      farmers.fields.removeByName(name);
    });
    app.save(farmers);

    // REVERT: Remove added fields from farms
    const farms = app.findCollectionByNameOrId('farms');
    const farmFieldsToRemove = [
      'registered_agroforestry', 'slope', 'planting_year', 'volume_to_slow_kg',
      'shade_trees_past', 'pffp_shade_trees', 'surviving_pffp_trees',
      'land_certificate', 'land_ownership_certificate', 'number_of_species',
      'plant_density_spacing', 'shade_level_pct', 'species_data', 'tree_index_data',
      'agroforestry_fertilizer_data', 'chemical_fertilizer_data', 'compost_data',
      'pesticide_detail_data', 'ra_compliance_data', 'map_sheet', 'shade_trees_before',
      'annual_cherry_yield_kg', 'treatment_method', 'forbidden_chem_use',
      'water_pollution_risk', 'air_pollution_risk', 'farm_tools_inventory',
      'non_conformity_history', 'correction_status', 'corrective_action',
      'protection_method', 'dist_to_chemical_farm_km', 'eudr_status',
    ];
    farmFieldsToRemove.forEach(name => {
      farms.fields.removeByName(name);
    });
    app.save(farms);

    // NOTE: Cannot restore deleted collections in revert.
    // farmer_profiles and farmer_profile_details would need to be
    // recreated manually if rolling back.
    console.log('⬅️ Migration 022 reverted (except deleted collections)');
  }
);
