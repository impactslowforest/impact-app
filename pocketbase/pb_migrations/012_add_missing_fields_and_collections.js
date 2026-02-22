/// <reference path="../pb_data/types.d.ts" />

// Migration 012: Add missing data-point fields + new collections
//
// Based on: "Datapoint structure by datatable category (21Jan2026)"
//
// 1. Enrich farmers (LA fields: debt, distance, livestock, deforestation)
// 2. Enrich farms (Farm_LAO fields: main crop, replanting, sprayer)
// 3. Enrich farm_environment_assessments (ecosystem: wildlife, beekeeping)
// 4. NEW: ghg_emissions (LA GHG Emissions Inventory)
// 5. NEW: ecosystem_assessments (Ecosystem & Biodiversity per farm)
// 6. NEW: compliance_records (Compliance & Certification per farmer/farm)

migrate(
    (app) => {
        const users = app.findCollectionByNameOrId("users");
        const farmersCol = app.findCollectionByNameOrId("farmers");
        const farmsCol = app.findCollectionByNameOrId("farms");

        // ================================================================
        // 1. ENRICH FARMERS — Missing Lao fields
        // ================================================================
        farmersCol.fields.add(new NumberField({ name: "input_debt", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "interest_rate_per_month", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "distance_to_home_km", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "buffalo_count", min: 0 }));
        farmersCol.fields.add(new DateField({ name: "deforestation_conversion_date" }));
        farmersCol.fields.add(new TextField({ name: "land_legal_origin_docs" }));
        farmersCol.fields.add(new BoolField({ name: "shared_sprayer_used" }));
        farmersCol.fields.add(new TextField({ name: "seed_source", max: 200 }));
        farmersCol.fields.add(new NumberField({ name: "seed_quantity_kg", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "organic_fertilizer_kg", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "chemical_fertilizer_kg", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "microbial_fertilizer_kg", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "biological_pesticide_kg", min: 0 }));
        farmersCol.fields.add(new NumberField({ name: "chemical_pesticide_kg", min: 0 }));
        app.save(farmersCol);

        // ================================================================
        // 2. ENRICH FARMS — Missing Farm_LAO fields
        // ================================================================
        farmsCol.fields.add(new TextField({ name: "main_crop_species" }));
        farmsCol.fields.add(new DateField({ name: "entry_date" }));
        farmsCol.fields.add(new DateField({ name: "replanting_date" }));
        farmsCol.fields.add(new TextField({ name: "seedling_quality_note" }));
        farmsCol.fields.add(new TextField({ name: "fertilizer_mix" }));
        farmsCol.fields.add(new TextField({ name: "fertilizer_source" }));
        farmsCol.fields.add(new DateField({ name: "fertilizer_apply_date" }));
        farmsCol.fields.add(new TextField({ name: "herbal_agent_used" }));
        farmsCol.fields.add(new TextField({ name: "banned_chem_name" }));
        farmsCol.fields.add(new BoolField({ name: "shared_sprayer_use" }));
        farmsCol.fields.add(new TextField({ name: "sprayer_cleaning_log" }));
        farmsCol.fields.add(new TextField({ name: "high_risk_detail" }));
        farmsCol.fields.add(new TextField({ name: "past_issue_desc" }));
        app.save(farmsCol);

        // ================================================================
        // 3. ENRICH FARM_ENVIRONMENT_ASSESSMENTS — Ecosystem fields
        // ================================================================
        const feaCol = app.findCollectionByNameOrId("farm_environment_assessments");
        feaCol.fields.add(new TextField({ name: "wildlife_observed" }));
        feaCol.fields.add(new BoolField({ name: "wild_beekeeping" }));
        feaCol.fields.add(new BoolField({ name: "managed_beekeeping" }));
        feaCol.fields.add(new TextField({ name: "tree_species_list" }));
        feaCol.fields.add(new NumberField({ name: "vegetation_cover_pct", min: 0, max: 100 }));
        feaCol.fields.add(new NumberField({ name: "species_count", min: 0 }));
        feaCol.fields.add(new BoolField({ name: "riparian_buffer_check" }));
        feaCol.fields.add(new BoolField({ name: "fire_usage" }));
        feaCol.fields.add(new TextField({ name: "waste_management_notes" }));
        feaCol.fields.add(new NumberField({ name: "soil_ph_value", min: 0, max: 14 }));
        app.save(feaCol);

        // ================================================================
        // 4. NEW COLLECTION: ghg_emissions
        // ================================================================
        const ghgCol = new Collection({ name: "ghg_emissions", type: "base" });
        app.save(ghgCol);

        const ghg = app.findCollectionByNameOrId("ghg_emissions");
        ghg.fields.add(new RelationField({
            name: "farmer",
            required: true,
            collectionId: farmersCol.id,
            maxSelect: 1,
        }));
        ghg.fields.add(new SelectField({
            name: "country",
            required: true,
            values: ["indonesia", "vietnam", "laos"],
        }));
        ghg.fields.add(new NumberField({ name: "year", required: true, min: 2020, max: 2100 }));
        ghg.fields.add(new NumberField({ name: "electricity_emissions_tco2e", min: 0 }));
        ghg.fields.add(new NumberField({ name: "fuel_combustion_emissions_tco2e", min: 0 }));
        ghg.fields.add(new NumberField({ name: "n_fert_emissions_tco2e", min: 0 }));
        ghg.fields.add(new NumberField({ name: "waste_emissions_tco2e", min: 0 }));
        ghg.fields.add(new NumberField({ name: "total_emissions_tco2e", min: 0 }));
        ghg.fields.add(new TextField({ name: "notes" }));
        ghg.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
        ghg.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
        ghg.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
        ghg.indexes = [
            "CREATE UNIQUE INDEX idx_ghg_farmer_year ON ghg_emissions (farmer, year)",
            "CREATE INDEX idx_ghg_country ON ghg_emissions (country)",
            "CREATE INDEX idx_ghg_year ON ghg_emissions (year)",
        ];
        ghg.listRule = '@request.auth.id != ""';
        ghg.viewRule = '@request.auth.id != ""';
        ghg.createRule = '@request.auth.id != ""';
        ghg.updateRule = '@request.auth.id != ""';
        ghg.deleteRule = '@request.auth.id != ""';
        app.save(ghg);

        // ================================================================
        // 5. NEW COLLECTION: ecosystem_assessments
        // ================================================================
        const ecoCol = new Collection({ name: "ecosystem_assessments", type: "base" });
        app.save(ecoCol);

        const eco = app.findCollectionByNameOrId("ecosystem_assessments");
        eco.fields.add(new RelationField({
            name: "farm",
            required: true,
            collectionId: farmsCol.id,
            maxSelect: 1,
        }));
        eco.fields.add(new SelectField({
            name: "country",
            required: true,
            values: ["indonesia", "vietnam", "laos"],
        }));
        eco.fields.add(new DateField({ name: "assessment_date", required: true }));
        eco.fields.add(new NumberField({ name: "species_count", min: 0 }));
        eco.fields.add(new TextField({ name: "tree_species_list" }));
        eco.fields.add(new NumberField({ name: "vegetation_cover_pct", min: 0, max: 100 }));
        eco.fields.add(new TextField({ name: "wildlife_observed" }));
        eco.fields.add(new BoolField({ name: "wild_beekeeping" }));
        eco.fields.add(new BoolField({ name: "managed_beekeeping" }));
        eco.fields.add(new TextField({ name: "buffer_zone_details" }));
        eco.fields.add(new BoolField({ name: "riparian_buffer_check" }));
        eco.fields.add(new BoolField({ name: "fire_usage" }));
        eco.fields.add(new TextField({ name: "waste_management_notes" }));
        eco.fields.add(new SelectField({
            name: "biodiversity_rating",
            values: ["excellent", "good", "fair", "poor"],
        }));
        eco.fields.add(new FileField({
            name: "photos",
            maxSelect: 10,
            maxSize: 10485760,
            mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        }));
        eco.fields.add(new TextField({ name: "notes" }));
        eco.fields.add(new RelationField({ name: "assessed_by", collectionId: users.id, maxSelect: 1 }));
        eco.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
        eco.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
        eco.indexes = [
            "CREATE INDEX idx_eco_farm ON ecosystem_assessments (farm)",
            "CREATE INDEX idx_eco_date ON ecosystem_assessments (assessment_date)",
            "CREATE INDEX idx_eco_country ON ecosystem_assessments (country)",
        ];
        eco.listRule = '@request.auth.id != ""';
        eco.viewRule = '@request.auth.id != ""';
        eco.createRule = '@request.auth.id != ""';
        eco.updateRule = '@request.auth.id != ""';
        eco.deleteRule = '@request.auth.id != ""';
        app.save(eco);

        // ================================================================
        // 6. NEW COLLECTION: compliance_records
        // ================================================================
        const compCol = new Collection({ name: "compliance_records", type: "base" });
        app.save(compCol);

        const comp = app.findCollectionByNameOrId("compliance_records");
        comp.fields.add(new RelationField({
            name: "farmer",
            required: true,
            collectionId: farmersCol.id,
            maxSelect: 1,
        }));
        comp.fields.add(new RelationField({
            name: "farm",
            collectionId: farmsCol.id,
            maxSelect: 1,
        }));
        comp.fields.add(new SelectField({
            name: "country",
            required: true,
            values: ["indonesia", "vietnam", "laos"],
        }));
        comp.fields.add(new NumberField({ name: "year", required: true, min: 2020, max: 2100 }));
        comp.fields.add(new BoolField({ name: "production_plan_recorded" }));
        comp.fields.add(new SelectField({
            name: "contamination_risk_level",
            values: ["none", "low", "moderate", "high"],
        }));
        comp.fields.add(new TextField({ name: "protective_measures" }));
        comp.fields.add(new TextField({ name: "non_compliance_record" }));
        comp.fields.add(new SelectField({
            name: "corrective_action_status",
            values: ["pending", "in_progress", "resolved", "na"],
        }));
        comp.fields.add(new BoolField({ name: "seed_purchase_notes" }));
        comp.fields.add(new BoolField({ name: "worker_ppe_available" }));
        comp.fields.add(new BoolField({ name: "child_labor_check" }));
        comp.fields.add(new BoolField({ name: "access_drinking_water" }));
        comp.fields.add(new BoolField({ name: "hazardous_work_ppe" }));
        comp.fields.add(new BoolField({ name: "land_conversion_check" }));
        comp.fields.add(new BoolField({ name: "wildlife_protection" }));
        comp.fields.add(new BoolField({ name: "fire_usage_policy" }));
        comp.fields.add(new TextField({ name: "waste_management" }));
        comp.fields.add(new BoolField({ name: "compost_production" }));
        comp.fields.add(new BoolField({ name: "compost_storage_distance" }));
        comp.fields.add(new TextField({ name: "residue_management" }));
        comp.fields.add(new TextField({ name: "work_accident_records" }));
        comp.fields.add(new TextField({ name: "first_aid_availability" }));
        comp.fields.add(new TextField({ name: "notes" }));
        comp.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
        comp.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
        comp.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
        comp.indexes = [
            "CREATE UNIQUE INDEX idx_comp_farmer_farm_year ON compliance_records (farmer, farm, year)",
            "CREATE INDEX idx_comp_country ON compliance_records (country)",
            "CREATE INDEX idx_comp_year ON compliance_records (year)",
            "CREATE INDEX idx_comp_farmer ON compliance_records (farmer)",
        ];
        comp.listRule = '@request.auth.id != ""';
        comp.viewRule = '@request.auth.id != ""';
        comp.createRule = '@request.auth.id != ""';
        comp.updateRule = '@request.auth.id != ""';
        comp.deleteRule = '@request.auth.id != ""';
        app.save(comp);
    },
    (app) => {
        // Rollback: delete new collections
        try { app.delete(app.findCollectionByNameOrId("compliance_records")); } catch (e) { }
        try { app.delete(app.findCollectionByNameOrId("ecosystem_assessments")); } catch (e) { }
        try { app.delete(app.findCollectionByNameOrId("ghg_emissions")); } catch (e) { }
    }
);
