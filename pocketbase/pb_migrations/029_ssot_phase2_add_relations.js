/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 029: SSOT Phase 2 — Add Relation fields to AppSheet legacy collections
 *
 * These collections use text ID codes (e.g. "NP", "SWB-MS-150") instead of
 * PocketBase Relation fields. This migration:
 *   1. Adds a new Relation field alongside each text ID field
 *   2. Populates the relation by looking up the text code in the master table
 *   3. Keeps the old text ID field as reference (will be removed in Phase 3)
 *
 * MAPPING:
 *   farm_id_text  → slow_farms.farm_code  (dc_*, sf_*, farm_blocks)
 *   farm_id_text  → farms.farm_code       (ghg_*, ra_*, id_cocoa_*)
 *   farmer_id_text → farmers.farmer_code  (ghg_*, ra_*, id_cocoa_*)
 *   worker_id_text → workers.worker_code  (sf_*)
 *   kid_id_text   → dc_kids.kid_id        (dc_attendance, dc_health_checks, dc_kid_studies)
 *   family_id_text → dc_families.family_id (dc_kids, dc_kid_studies, dc_attendance)
 *   check_id_text → dc_attendance_checks.check_id / dc_farm_health_checks.check_id
 *   supplier_id   → suppliers.supplier_code (ghg_*)
 *   farmer_group_id → id_farmer_groups.group_id (id_cocoa_*)
 *   batch_id      → id_cocoa_batches.batch_id → self-ref (id_cocoa_batch_logs)
 *   batchlog_id   → id_cocoa_batch_logs.batchlog_id (id_cocoa_batch_details)
 */

migrate(
  (app) => {
    // Helper: add a relation field if it doesn't already exist
    const addRelation = (collName, fieldName, targetCollName, isMultiple) => {
      try {
        const coll = app.findCollectionByNameOrId(collName);
        if (coll.fields.getByName(fieldName)) {
          console.log(`[029] ${collName}.${fieldName} already exists, skipping`);
          return;
        }
        const target = app.findCollectionByNameOrId(targetCollName);
        coll.fields.add(new RelationField({
          name: fieldName,
          collectionId: target.id,
          cascadeDelete: false,
          minSelect: 0,
          maxSelect: isMultiple ? 999 : 1,
        }));
        app.save(coll);
        console.log(`[029] ${collName}: added relation ${fieldName} → ${targetCollName}`);
      } catch (e) {
        console.log(`[029] ERROR adding ${collName}.${fieldName}: ${e.message}`);
      }
    };

    // Helper: populate relation field by looking up text code
    const populateRelation = (collName, textField, relField, targetCollName, targetCodeField) => {
      try {
        // Build lookup map: code → PB record ID
        const lookupMap = {};
        let offset = 0;
        const batchSize = 500;
        while (true) {
          const targets = app.findRecordsByFilter(targetCollName, "", "", batchSize, offset);
          if (!targets || targets.length === 0) break;
          for (const t of targets) {
            const code = t.get(targetCodeField);
            if (code) lookupMap[String(code).trim()] = t.id;
          }
          offset += targets.length;
          if (targets.length < batchSize) break;
        }

        const lookupSize = Object.keys(lookupMap).length;
        console.log(`[029] ${targetCollName}: built lookup map with ${lookupSize} entries`);
        if (lookupSize === 0) return;

        // Iterate source records and populate relation
        let updated = 0;
        let notFound = 0;
        let alreadySet = 0;
        offset = 0;
        while (true) {
          const records = app.findRecordsByFilter(collName, "", "", batchSize, offset);
          if (!records || records.length === 0) break;
          for (const rec of records) {
            // Skip if relation already populated
            const existingRel = rec.get(relField);
            if (existingRel) {
              alreadySet++;
              continue;
            }
            const textVal = String(rec.get(textField) || "").trim();
            if (!textVal) continue;
            const pbId = lookupMap[textVal];
            if (pbId) {
              rec.set(relField, pbId);
              app.save(rec);
              updated++;
            } else {
              notFound++;
            }
          }
          offset += records.length;
          if (records.length < batchSize) break;
        }
        console.log(`[029] ${collName}.${relField}: updated=${updated}, not_found=${notFound}, already_set=${alreadySet}`);
      } catch (e) {
        console.log(`[029] ERROR populating ${collName}.${relField}: ${e.message}`);
      }
    };

    // ═══════════════════════════════════════════════════════════════
    // GROUP 1: Daycare (dc_*) — farm_id_text → slow_farms
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 1: Daycare collections ===");

    const dcCollsWithFarm = [
      "dc_families", "dc_kids", "dc_health_checks", "dc_attendance",
      "dc_attendance_checks", "dc_farm_health_checks", "dc_menu_details",
      "dc_kid_studies",
    ];
    for (const coll of dcCollsWithFarm) {
      addRelation(coll, "slow_farm", "slow_farms", false);
    }

    // dc_kids, dc_kid_studies, dc_attendance: kid_id_text → dc_kids
    addRelation("dc_attendance", "kid", "dc_kids", false);
    addRelation("dc_health_checks", "kid", "dc_kids", false);
    addRelation("dc_kid_studies", "kid", "dc_kids", false);

    // dc_kids, dc_kid_studies, dc_attendance: family_id_text → dc_families
    addRelation("dc_kids", "family", "dc_families", false);
    addRelation("dc_kid_studies", "family", "dc_families", false);
    addRelation("dc_attendance", "family", "dc_families", false);

    // dc_attendance, dc_health_checks: check_id_text → check collections
    addRelation("dc_attendance", "attendance_check", "dc_attendance_checks", false);
    addRelation("dc_health_checks", "health_check", "dc_farm_health_checks", false);

    // dc_menu_details: daily_menu_id is text → skip (no master table found)

    // Populate dc_* farm relations
    for (const coll of dcCollsWithFarm) {
      populateRelation(coll, "farm_id_text", "slow_farm", "slow_farms", "farm_code");
    }

    // Populate kid relations
    populateRelation("dc_attendance", "kid_id_text", "kid", "dc_kids", "kid_id");
    populateRelation("dc_health_checks", "kid_id_text", "kid", "dc_kids", "kid_id");
    populateRelation("dc_kid_studies", "kid_id_text", "kid", "dc_kids", "kid_id");

    // Populate family relations
    populateRelation("dc_kids", "family_id_text", "family", "dc_families", "family_id");
    populateRelation("dc_kid_studies", "family_id_text", "family", "dc_families", "family_id");
    populateRelation("dc_attendance", "family_id_text", "family", "dc_families", "family_id");

    // Populate check relations
    populateRelation("dc_attendance", "check_id_text", "attendance_check", "dc_attendance_checks", "check_id");
    populateRelation("dc_health_checks", "check_id_text", "health_check", "dc_farm_health_checks", "check_id");

    // ═══════════════════════════════════════════════════════════════
    // GROUP 2: Slow Farm (sf_*) — farm_id_text → slow_farms, worker_id_text → workers
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 2: Slow Farm collections ===");

    const sfCollsWithFarm = ["sf_check_rolls", "sf_farm_rates", "sf_check_roll_details"];
    for (const coll of sfCollsWithFarm) {
      addRelation(coll, "slow_farm", "slow_farms", false);
    }

    const sfCollsWithWorker = [
      "sf_check_roll_details", "sf_payroll_details", "sf_worker_tasks",
    ];
    for (const coll of sfCollsWithWorker) {
      addRelation(coll, "worker", "workers", false);
    }

    // farm_blocks: farm_id_text could be slow_farms OR farms
    addRelation("farm_blocks", "slow_farm", "slow_farms", false);

    // Populate sf_* farm relations
    for (const coll of sfCollsWithFarm) {
      populateRelation(coll, "farm_id_text", "slow_farm", "slow_farms", "farm_code");
    }
    populateRelation("farm_blocks", "farm_id_text", "slow_farm", "slow_farms", "farm_code");

    // Populate sf_* worker relations
    for (const coll of sfCollsWithWorker) {
      populateRelation(coll, "worker_id_text", "worker", "workers", "worker_code");
    }

    // ═══════════════════════════════════════════════════════════════
    // GROUP 3: GHG — farmer_id_text → farmers, farm_id_text → farms
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 3: GHG collections ===");

    const ghgColls = [
      "ghg_fmu", "ghg_chemical_fertilizer", "ghg_organic_fertilizer",
      "ghg_wetmill", "ghg_drymill",
    ];

    for (const coll of ghgColls) {
      addRelation(coll, "farmer", "farmers", false);
    }
    // Only collections with farm_id_text
    const ghgWithFarm = ["ghg_fmu", "ghg_chemical_fertilizer", "ghg_organic_fertilizer"];
    for (const coll of ghgWithFarm) {
      addRelation(coll, "farm", "farms", false);
    }

    // Populate GHG relations
    for (const coll of ghgColls) {
      populateRelation(coll, "farmer_id_text", "farmer", "farmers", "farmer_code");
    }
    for (const coll of ghgWithFarm) {
      populateRelation(coll, "farm_id_text", "farm", "farms", "farm_code");
    }

    // ═══════════════════════════════════════════════════════════════
    // GROUP 4: Indonesia Cocoa — farmer_id_text → farmers, farm_id_text → farms
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 4: Indonesia Cocoa collections ===");

    addRelation("id_cocoa_batch_logs", "farmer", "farmers", false);
    addRelation("id_cocoa_batch_details", "farm", "farms", false);
    addRelation("id_cocoa_batches", "farmer_group", "id_farmer_groups", false);

    populateRelation("id_cocoa_batch_logs", "farmer_id_text", "farmer", "farmers", "farmer_code");
    populateRelation("id_cocoa_batch_details", "farm_id_text", "farm", "farms", "farm_code");
    populateRelation("id_cocoa_batches", "farmer_group_id", "farmer_group", "id_farmer_groups", "group_id");

    // id_farmer_contracts
    addRelation("id_farmer_contracts", "farmer", "farmers", false);
    populateRelation("id_farmer_contracts", "farmer_id_text", "farmer", "farmers", "farmer_code");

    // ═══════════════════════════════════════════════════════════════
    // GROUP 5: RA Audit — farmer_id_text → farmers, farm_id_text → farms
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 5: RA Audit collections ===");

    const raColls = [
      "ra_farmer_inspections", "ra_farm_inspections", "ra_certificates",
      "ra_species_index", "ra_tree_index", "ra_agroforestry_fert",
      "ra_compost", "ra_pesticides", "ra_family_data",
    ];

    for (const coll of raColls) {
      addRelation(coll, "farmer", "farmers", false);
    }
    const raWithFarm = [
      "ra_farm_inspections", "ra_certificates", "ra_species_index",
      "ra_tree_index", "ra_agroforestry_fert", "ra_compost", "ra_pesticides",
    ];
    for (const coll of raWithFarm) {
      addRelation(coll, "farm", "farms", false);
    }

    // Populate RA relations
    for (const coll of raColls) {
      populateRelation(coll, "farmer_id_text", "farmer", "farmers", "farmer_code");
    }
    for (const coll of raWithFarm) {
      populateRelation(coll, "farm_id_text", "farm", "farms", "farm_code");
    }

    // ═══════════════════════════════════════════════════════════════
    // GROUP 6: Impact — relations to parent tables
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 6: Impact collections ===");

    // act_impact_details.activity_id → impact_activities (if code matches)
    // impact_plan_details.plan_id_text → impact_plans (if code matches)
    // These use custom IDs, try to match
    addRelation("act_impact_details", "activity", "impact_activities", false);
    addRelation("impact_plan_details", "plan", "impact_plans", false);

    // Try to populate (may not match since these are custom codes)
    // act_impacts and impact_plans might use custom IDs too
    // Skip data population for now — these need manual investigation

    // ═══════════════════════════════════════════════════════════════
    // GROUP 7: EU Organic — farmer_id → farmers, farm_id → farms
    // ═══════════════════════════════════════════════════════════════
    console.log("\n[029] === GROUP 7: EU Organic & EUDR ===");

    addRelation("eu_organic_inspections", "farmer", "farmers", false);
    addRelation("eu_organic_farm_inspections", "farmer", "farmers", false);
    addRelation("eu_organic_farm_inspections", "farm", "farms", false);
    addRelation("eudr_plots", "farmer", "farmers", false);

    // eu_organic uses farmer_id which is farmer_code format
    populateRelation("eu_organic_inspections", "farmer_id", "farmer", "farmers", "farmer_code");
    populateRelation("eu_organic_farm_inspections", "farmer_id", "farmer", "farmers", "farmer_code");
    populateRelation("eu_organic_farm_inspections", "farm_id", "farm", "farms", "farm_code");
    populateRelation("eudr_plots", "farmer_id", "farmer", "farmers", "farmer_code");

    console.log("\n[029] SSOT Phase 2 complete — relation fields added and populated");
  },

  // ROLLBACK: remove added relation fields
  (app) => {
    const safeRemoveField = (collName, fieldName) => {
      try {
        const coll = app.findCollectionByNameOrId(collName);
        const f = coll.fields.getByName(fieldName);
        if (f) {
          coll.fields.removeByName(fieldName);
          app.save(coll);
        }
      } catch (e) {
        console.log(`[029 DOWN] Error removing ${collName}.${fieldName}: ${e.message}`);
      }
    };

    // Remove all relation fields added in this migration
    const removals = [
      // DC
      ["dc_families", "slow_farm"], ["dc_kids", "slow_farm"], ["dc_kids", "family"],
      ["dc_health_checks", "slow_farm"], ["dc_health_checks", "kid"], ["dc_health_checks", "health_check"],
      ["dc_attendance", "slow_farm"], ["dc_attendance", "kid"], ["dc_attendance", "family"], ["dc_attendance", "attendance_check"],
      ["dc_attendance_checks", "slow_farm"], ["dc_farm_health_checks", "slow_farm"],
      ["dc_menu_details", "slow_farm"], ["dc_kid_studies", "slow_farm"], ["dc_kid_studies", "kid"], ["dc_kid_studies", "family"],
      // SF
      ["sf_check_rolls", "slow_farm"], ["sf_farm_rates", "slow_farm"], ["sf_check_roll_details", "slow_farm"],
      ["sf_check_roll_details", "worker"], ["sf_payroll_details", "worker"], ["sf_worker_tasks", "worker"],
      ["farm_blocks", "slow_farm"],
      // GHG
      ["ghg_fmu", "farmer"], ["ghg_fmu", "farm"],
      ["ghg_chemical_fertilizer", "farmer"], ["ghg_chemical_fertilizer", "farm"],
      ["ghg_organic_fertilizer", "farmer"], ["ghg_organic_fertilizer", "farm"],
      ["ghg_wetmill", "farmer"], ["ghg_drymill", "farmer"],
      // ID Cocoa
      ["id_cocoa_batch_logs", "farmer"], ["id_cocoa_batch_details", "farm"],
      ["id_cocoa_batches", "farmer_group"], ["id_farmer_contracts", "farmer"],
      // RA
      ["ra_farmer_inspections", "farmer"], ["ra_farm_inspections", "farmer"], ["ra_farm_inspections", "farm"],
      ["ra_certificates", "farmer"], ["ra_certificates", "farm"],
      ["ra_species_index", "farmer"], ["ra_species_index", "farm"],
      ["ra_tree_index", "farmer"], ["ra_tree_index", "farm"],
      ["ra_agroforestry_fert", "farmer"], ["ra_agroforestry_fert", "farm"],
      ["ra_compost", "farmer"], ["ra_compost", "farm"],
      ["ra_pesticides", "farmer"], ["ra_pesticides", "farm"],
      ["ra_family_data", "farmer"],
      // Impact
      ["act_impact_details", "activity"], ["impact_plan_details", "plan"],
      // EU
      ["eu_organic_inspections", "farmer"], ["eu_organic_farm_inspections", "farmer"],
      ["eu_organic_farm_inspections", "farm"], ["eudr_plots", "farmer"],
    ];

    for (const [coll, field] of removals) {
      safeRemoveField(coll, field);
    }
    console.log("[029 DOWN] Rollback complete — relation fields removed");
  }
);
