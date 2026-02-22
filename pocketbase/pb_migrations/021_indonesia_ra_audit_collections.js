/// <reference path="../pb_data/types.d.ts" />

// Migration 021: Indonesia RA Internal Audit collections
//
// New collections:
//   1. ra_farmer_inspections  - Farmer-level audit data (84 rows)
//   2. ra_farm_inspections    - Farm-level audit data (122 rows)
//   3. ra_species_index       - Agroforestry species inventory (143 rows)
//   4. ra_stations            - Observation station data (28 rows)
//   5. ra_tree_index          - Individual tree audit data (86 rows)
//   6. ra_agroforestry_fert   - Agroforestry chemical fertilizer (11 rows)
//   7. ra_compost             - Compost application records (3 rows)
//   8. ra_pesticides          - Pesticide use records (4 rows)
//   9. ra_species_names       - Species reference list (19 rows)
//  10. ra_family_data         - Farmer family members (54 rows)
//  11. ra_certificates        - RA certificate inspections (12 rows)
//  12. ra_farmer_contracts    - Farmer supply contracts (173 rows) [re-uses id_farmer_contracts if exists]

migrate(
  (app) => {
    const authRule = '@request.auth.id != ""';

    function createBaseCollection(name) {
      const col = new Collection({ name, type: "base" });
      app.save(col);
      const c = app.findCollectionByNameOrId(name);
      c.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
      c.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
      c.listRule = authRule;
      c.viewRule = authRule;
      c.createRule = authRule;
      c.updateRule = authRule;
      c.deleteRule = authRule;
      return c;
    }

    // 1. RA_FARMER_INSPECTIONS
    const rfi = createBaseCollection("ra_farmer_inspections");
    rfi.fields.add(new TextField({ name: "farmer_id_text", required: true, max: 50 }));
    rfi.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rfi.fields.add(new DateField({ name: "inspection_date" }));
    rfi.fields.add(new TextField({ name: "province", max: 100 }));
    rfi.fields.add(new TextField({ name: "district", max: 100 }));
    rfi.fields.add(new TextField({ name: "commune", max: 100 }));
    rfi.fields.add(new TextField({ name: "village", max: 100 }));
    rfi.fields.add(new TextField({ name: "village_id", max: 50 }));
    rfi.fields.add(new TextField({ name: "farmer_code", max: 50 }));
    rfi.fields.add(new TextField({ name: "farmer_name", max: 200 }));
    rfi.fields.add(new NumberField({ name: "farm_area_ha" }));
    rfi.fields.add(new NumberField({ name: "observation_stations" }));
    rfi.fields.add(new NumberField({ name: "est_production_2024" }));
    rfi.fields.add(new NumberField({ name: "est_production_2025" }));
    rfi.fields.add(new TextField({ name: "location" }));
    rfi.fields.add(new TextField({ name: "farmer_address" }));
    rfi.fields.add(new TextField({ name: "arrival_time", max: 20 }));
    rfi.fields.add(new TextField({ name: "departure_time", max: 20 }));
    rfi.fields.add(new TextField({ name: "inspector_name", max: 200 }));
    rfi.indexes = [
      'CREATE UNIQUE INDEX idx_rfi_farmer ON ra_farmer_inspections (farmer_id_text)',
    ];
    app.save(rfi);
    console.log("[021] Created ra_farmer_inspections");

    // 2. RA_FARM_INSPECTIONS
    const rfai = createBaseCollection("ra_farm_inspections");
    rfai.fields.add(new TextField({ name: "farm_audit_id", required: true, max: 60 }));
    rfai.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rfai.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rfai.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rfai.fields.add(new DateField({ name: "inspection_date" }));
    rfai.fields.add(new TextField({ name: "location" }));
    rfai.fields.add(new NumberField({ name: "farm_area_ha" }));
    rfai.fields.add(new TextField({ name: "land_certificate", max: 50 }));
    rfai.fields.add(new TextField({ name: "land_comments" }));
    rfai.fields.add(new TextField({ name: "land_ownership_cert", max: 100 }));
    rfai.fields.add(new NumberField({ name: "num_stations" }));
    rfai.fields.add(new NumberField({ name: "num_species" }));
    rfai.fields.add(new NumberField({ name: "est_production_2024" }));
    rfai.fields.add(new NumberField({ name: "est_production_2025" }));
    rfai.fields.add(new TextField({ name: "inspector_name", max: 200 }));
    rfai.indexes = [
      'CREATE UNIQUE INDEX idx_rfai_id ON ra_farm_inspections (farm_audit_id)',
      'CREATE INDEX idx_rfai_farmer ON ra_farm_inspections (farmer_id_text)',
    ];
    app.save(rfai);
    console.log("[021] Created ra_farm_inspections");

    // 3. RA_SPECIES_INDEX
    const rsi = createBaseCollection("ra_species_index");
    rsi.fields.add(new TextField({ name: "species_id", required: true, max: 60 }));
    rsi.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rsi.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rsi.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rsi.fields.add(new DateField({ name: "record_date" }));
    rsi.fields.add(new TextField({ name: "location" }));
    rsi.fields.add(new TextField({ name: "species_name", max: 200 }));
    rsi.fields.add(new NumberField({ name: "num_timber_trees" }));
    rsi.fields.add(new NumberField({ name: "year_planted_timber" }));
    rsi.fields.add(new NumberField({ name: "num_fruit_trees_producing" }));
    rsi.fields.add(new NumberField({ name: "year_planted_fruit" }));
    rsi.fields.add(new TextField({ name: "unit_of_sales", max: 50 }));
    rsi.fields.add(new NumberField({ name: "total_unit_sales_2024" }));
    rsi.fields.add(new NumberField({ name: "production_est_2025" }));
    rsi.fields.add(new TextField({ name: "harvest_type", max: 50 }));
    rsi.fields.add(new TextField({ name: "first_harvest_2025", max: 50 }));
    rsi.fields.add(new TextField({ name: "second_harvest_2025", max: 50 }));
    rsi.fields.add(new NumberField({ name: "num_trees_not_producing" }));
    rsi.indexes = [
      'CREATE UNIQUE INDEX idx_rsi_id ON ra_species_index (species_id)',
    ];
    app.save(rsi);
    console.log("[021] Created ra_species_index");

    // 4. RA_STATIONS
    const rst = createBaseCollection("ra_stations");
    rst.fields.add(new TextField({ name: "station_id", required: true, max: 60 }));
    rst.fields.add(new TextField({ name: "village_id", max: 50 }));
    rst.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rst.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rst.fields.add(new TextField({ name: "station_name", max: 100 }));
    rst.fields.add(new NumberField({ name: "ph_level" }));
    rst.fields.add(new TextField({ name: "latlong" }));
    rst.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rst.fields.add(new DateField({ name: "record_date" }));
    rst.indexes = [
      'CREATE UNIQUE INDEX idx_rst_id ON ra_stations (station_id)',
    ];
    app.save(rst);
    console.log("[021] Created ra_stations");

    // 5. RA_TREE_INDEX
    const rti = createBaseCollection("ra_tree_index");
    rti.fields.add(new TextField({ name: "tree_id", required: true, max: 60 }));
    rti.fields.add(new TextField({ name: "village_id", max: 50 }));
    rti.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rti.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rti.fields.add(new TextField({ name: "station_id", max: 60 }));
    rti.fields.add(new TextField({ name: "tree_number", max: 20 }));
    rti.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rti.fields.add(new DateField({ name: "record_date" }));
    rti.fields.add(new TextField({ name: "location" }));
    rti.fields.add(new TextField({ name: "ao1_clone_input", max: 50 }));
    rti.fields.add(new NumberField({ name: "ao1_clone_rating" }));
    rti.fields.add(new TextField({ name: "ao1_comments" }));
    rti.fields.add(new NumberField({ name: "ao2_age_input" }));
    rti.fields.add(new NumberField({ name: "ao2_age_rating" }));
    rti.fields.add(new TextField({ name: "ao2_comments" }));
    rti.fields.add(new NumberField({ name: "ao4_health_rating" }));
    rti.fields.add(new TextField({ name: "ao4_comments" }));
    rti.fields.add(new NumberField({ name: "ao5_disease_rating" }));
    rti.fields.add(new TextField({ name: "ao5_comments" }));
    rti.fields.add(new NumberField({ name: "ao6_pruning_rating" }));
    rti.indexes = [
      'CREATE UNIQUE INDEX idx_rti_id ON ra_tree_index (tree_id)',
    ];
    app.save(rti);
    console.log("[021] Created ra_tree_index");

    // 6. RA_AGROFORESTRY_FERT
    const raf = createBaseCollection("ra_agroforestry_fert");
    raf.fields.add(new TextField({ name: "chemical_id", required: true, max: 60 }));
    raf.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    raf.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    raf.fields.add(new TextField({ name: "species_id", max: 60 }));
    raf.fields.add(new TextField({ name: "staff_id", max: 30 }));
    raf.fields.add(new DateField({ name: "record_date" }));
    raf.fields.add(new TextField({ name: "location" }));
    raf.fields.add(new TextField({ name: "fertilizer_name", max: 200 }));
    raf.fields.add(new TextField({ name: "af_tree_species", max: 200 }));
    raf.fields.add(new TextField({ name: "dosage_per_application", max: 100 }));
    raf.fields.add(new TextField({ name: "application_frequency", max: 50 }));
    raf.fields.add(new TextField({ name: "young_old_trees", max: 20 }));
    raf.fields.add(new TextField({ name: "nutrient_content", max: 100 }));
    raf.fields.add(new NumberField({ name: "n_percent" }));
    raf.fields.add(new NumberField({ name: "p_percent" }));
    raf.indexes = [
      'CREATE UNIQUE INDEX idx_raf_id ON ra_agroforestry_fert (chemical_id)',
    ];
    app.save(raf);
    console.log("[021] Created ra_agroforestry_fert");

    // 7. RA_COMPOST
    const rc = createBaseCollection("ra_compost");
    rc.fields.add(new TextField({ name: "compost_id", required: true, max: 60 }));
    rc.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rc.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rc.fields.add(new TextField({ name: "species_id", max: 60 }));
    rc.fields.add(new TextField({ name: "species_name", max: 100 }));
    rc.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rc.fields.add(new DateField({ name: "record_date" }));
    rc.fields.add(new TextField({ name: "location" }));
    rc.fields.add(new TextField({ name: "make_or_buy", max: 20 }));
    rc.fields.add(new TextField({ name: "compost_brand", max: 200 }));
    rc.fields.add(new TextField({ name: "dosage_per_tree", max: 100 }));
    rc.fields.add(new TextField({ name: "frequency_per_year", max: 50 }));
    rc.fields.add(new TextField({ name: "application_date", max: 50 }));
    rc.indexes = [
      'CREATE UNIQUE INDEX idx_rc_id ON ra_compost (compost_id)',
    ];
    app.save(rc);
    console.log("[021] Created ra_compost");

    // 8. RA_PESTICIDES
    const rp = createBaseCollection("ra_pesticides");
    rp.fields.add(new TextField({ name: "pesticide_id", required: true, max: 60 }));
    rp.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rp.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rp.fields.add(new TextField({ name: "species_id", max: 60 }));
    rp.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rp.fields.add(new DateField({ name: "record_date" }));
    rp.fields.add(new TextField({ name: "location" }));
    rp.fields.add(new TextField({ name: "chemical_pesticide", max: 200 }));
    rp.fields.add(new TextField({ name: "active_ingredient", max: 200 }));
    rp.fields.add(new TextField({ name: "target_pest_disease", max: 200 }));
    rp.fields.add(new BoolField({ name: "has_registration_number" }));
    rp.fields.add(new TextField({ name: "comments" }));
    rp.fields.add(new NumberField({ name: "num_tanks" }));
    rp.fields.add(new TextField({ name: "dosage_per_tank", max: 50 }));
    rp.fields.add(new TextField({ name: "dosage_unit", max: 30 }));
    rp.fields.add(new NumberField({ name: "applications_per_year" }));
    rp.indexes = [
      'CREATE UNIQUE INDEX idx_rp_id ON ra_pesticides (pesticide_id)',
    ];
    app.save(rp);
    console.log("[021] Created ra_pesticides");

    // 9. RA_SPECIES_NAMES
    const rsn = createBaseCollection("ra_species_names");
    rsn.fields.add(new TextField({ name: "species_ref_id", required: true, max: 30 }));
    rsn.fields.add(new TextField({ name: "species_name", max: 200 }));
    rsn.fields.add(new TextField({ name: "species_type", max: 50 }));
    rsn.fields.add(new NumberField({ name: "num_trees" }));
    rsn.fields.add(new DateField({ name: "date_buy" }));
    rsn.fields.add(new TextField({ name: "nursery_name", max: 200 }));
    rsn.indexes = [
      'CREATE UNIQUE INDEX idx_rsn_id ON ra_species_names (species_ref_id)',
    ];
    app.save(rsn);
    console.log("[021] Created ra_species_names");

    // 10. RA_FAMILY_DATA
    const rfd = createBaseCollection("ra_family_data");
    rfd.fields.add(new TextField({ name: "position_id", required: true, max: 60 }));
    rfd.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rfd.fields.add(new TextField({ name: "family_id", max: 50 }));
    rfd.fields.add(new TextField({ name: "member_name", max: 200 }));
    rfd.fields.add(new TextField({ name: "family_position", max: 50 }));
    rfd.fields.add(new NumberField({ name: "birth_year" }));
    rfd.fields.add(new BoolField({ name: "cocoa_training" }));
    rfd.fields.add(new BoolField({ name: "under_school" }));
    rfd.fields.add(new TextField({ name: "working_areas", max: 200 }));
    rfd.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rfd.fields.add(new DateField({ name: "record_date" }));
    rfd.indexes = [
      'CREATE UNIQUE INDEX idx_rfd_id ON ra_family_data (position_id)',
      'CREATE INDEX idx_rfd_farmer ON ra_family_data (farmer_id_text)',
    ];
    app.save(rfd);
    console.log("[021] Created ra_family_data");

    // 11. RA_CERTIFICATES
    const rce = createBaseCollection("ra_certificates");
    rce.fields.add(new TextField({ name: "certificate_id", required: true, max: 60 }));
    rce.fields.add(new TextField({ name: "farmer_id_text", max: 50 }));
    rce.fields.add(new TextField({ name: "farm_id_text", max: 50 }));
    rce.fields.add(new TextField({ name: "staff_id", max: 30 }));
    rce.fields.add(new DateField({ name: "inspection_date" }));
    rce.fields.add(new TextField({ name: "location" }));
    rce.fields.add(new JSONField({ name: "checklist_answers" }));
    rce.indexes = [
      'CREATE UNIQUE INDEX idx_rce_id ON ra_certificates (certificate_id)',
      'CREATE INDEX idx_rce_farmer ON ra_certificates (farmer_id_text)',
    ];
    app.save(rce);
    console.log("[021] Created ra_certificates");

    console.log("\n[Migration 021] ✓ All 11 RA audit collections created");
  },

  (app) => {
    const collections = [
      "ra_certificates", "ra_family_data", "ra_species_names",
      "ra_pesticides", "ra_compost", "ra_agroforestry_fert",
      "ra_tree_index", "ra_stations", "ra_species_index",
      "ra_farm_inspections", "ra_farmer_inspections",
    ];
    for (const name of collections) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
        console.log(`[021 DOWN] Deleted ${name}`);
      } catch (e) {
        console.log(`[021 DOWN] ${name} not found`);
      }
    }
  }
);
