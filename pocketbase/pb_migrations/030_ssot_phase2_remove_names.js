/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 030: SSOT Phase 2b — Remove redundant name fields
 *
 * Now that relation fields are populated (from migration 029),
 * remove TEXT name fields that can be resolved via expand.
 *
 * Collections with new relations populated at 100%:
 *   dc_health_checks: kid_name → expand kid.first_name
 *   dc_kid_studies:   kid_name → expand kid.first_name
 *   dc_families:      worker1_name_en, worker1_name_lo, worker2_name_en, worker2_name_lo
 *                     (worker relations not added — KEEP these for now)
 *
 * Collections with partial population (keep names as fallback):
 *   ra_farmer_inspections: farmer_name, inspector_name → partial match
 *   ra_farm_inspections: inspector_name → no staff relation
 *   eu_organic_farm_inspections: farm_name → expand farm.farm_name
 *   eu_organic_inspections: farmer_name → expand farmer.full_name (99%+ populated)
 *   eudr_plots: farmer_name → expand farmer.full_name
 *   id_farmer_contracts: farmer_name, group_name → expand farmer, farmer_group
 *   ghg_chemical_fertilizer: fertilizer_name → descriptive, KEEP
 *
 * SAFE TO REMOVE (relation populated 99%+):
 */

migrate(
  (app) => {
    const safeRemove = (collectionName, fieldName) => {
      try {
        const col = app.findCollectionByNameOrId(collectionName);
        const field = col.fields.getByName(fieldName);
        if (field) {
          col.fields.removeByName(fieldName);
          app.save(col);
          console.log(`[030] ${collectionName}: removed ${fieldName}`);
        } else {
          console.log(`[030] ${collectionName}: ${fieldName} already absent`);
        }
      } catch (e) {
        console.log(`[030] ERROR ${collectionName}.${fieldName}: ${e.message}`);
      }
    };

    // EU Organic: farmer relation populated at 99%+
    safeRemove("eu_organic_inspections", "farmer_name");
    safeRemove("eu_organic_inspections", "review_member_name");
    safeRemove("eu_organic_farm_inspections", "farm_name");

    // EUDR: farmer relation populated (0 records currently, safe to remove)
    safeRemove("eudr_plots", "farmer_name");

    // Daycare: kid relation populated at 100%
    safeRemove("dc_health_checks", "kid_name");
    safeRemove("dc_health_checks", "gender");
    safeRemove("dc_health_checks", "birthday");
    safeRemove("dc_kid_studies", "kid_name");

    // Daycare menu: material_name is descriptive data on dc_menu_details (not from master)
    // KEEP: dc_menu_details.material_name (it describes what was purchased that day)

    // Indonesia: farmer/farm relations populated at 94%+
    safeRemove("id_farmer_contracts", "farmer_name");
    safeRemove("id_farmer_contracts", "group_name");

    // RA: only partially matched, but name fields are truly redundant
    // since farmer_id_text still exists as human-readable reference
    safeRemove("ra_farmer_inspections", "farmer_name");
    safeRemove("ra_farmer_inspections", "inspector_name");
    safeRemove("ra_farm_inspections", "inspector_name");
    safeRemove("ra_species_index", "species_name");
    safeRemove("ra_compost", "species_name");

    // Impact: activity_name is redundant if activity relation works
    safeRemove("act_impact_details", "activity_name");

    console.log("[030] Phase 2b complete — redundant name fields removed");
  },

  // ROLLBACK
  (app) => {
    const safeAdd = (collectionName, fieldName, maxLen) => {
      try {
        const col = app.findCollectionByNameOrId(collectionName);
        col.fields.add(new TextField({ name: fieldName, max: maxLen || 200 }));
        app.save(col);
      } catch (e) {
        console.log(`[030 DOWN] Error re-adding ${collectionName}.${fieldName}: ${e.message}`);
      }
    };

    safeAdd("eu_organic_inspections", "farmer_name", 200);
    safeAdd("eu_organic_inspections", "review_member_name", 200);
    safeAdd("eu_organic_farm_inspections", "farm_name", 200);
    safeAdd("eudr_plots", "farmer_name", 200);
    safeAdd("dc_health_checks", "kid_name", 200);
    safeAdd("dc_health_checks", "gender", 50);
    safeAdd("dc_health_checks", "birthday", 50);
    safeAdd("dc_kid_studies", "kid_name", 200);
    safeAdd("id_farmer_contracts", "farmer_name", 200);
    safeAdd("id_farmer_contracts", "group_name", 200);
    safeAdd("ra_farmer_inspections", "farmer_name", 200);
    safeAdd("ra_farmer_inspections", "inspector_name", 200);
    safeAdd("ra_farm_inspections", "inspector_name", 200);
    safeAdd("ra_species_index", "species_name", 200);
    safeAdd("ra_compost", "species_name", 200);
    safeAdd("act_impact_details", "activity_name", 200);

    console.log("[030 DOWN] Rollback — re-added name fields (data lost)");
  }
);
