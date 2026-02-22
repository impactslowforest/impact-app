/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 023: Delete redundant farmer_profiles & farmer_profile_details
 *
 * Run ONLY AFTER import_merge_profiles.js has successfully copied all data
 * from these collections into the unified farmers/farms tables.
 */
migrate(
  (app) => {
    try {
      const farmerProfiles = app.findCollectionByNameOrId('farmer_profiles');
      app.delete(farmerProfiles);
      console.log('🗑️ Deleted farmer_profiles collection');
    } catch (e) {
      console.log('⚠️ farmer_profiles collection not found, skipping');
    }

    try {
      const farmerProfileDetails = app.findCollectionByNameOrId('farmer_profile_details');
      app.delete(farmerProfileDetails);
      console.log('🗑️ Deleted farmer_profile_details collection');
    } catch (e) {
      console.log('⚠️ farmer_profile_details collection not found, skipping');
    }

    console.log('✅ Migration 023 complete — redundant collections removed');
  },
  (app) => {
    // Cannot automatically restore deleted collections.
    // If rollback is needed, re-run migration 017 manually.
    console.log('⬅️ Migration 023 reverted (collections must be recreated manually)');
  }
);
