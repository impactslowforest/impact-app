/// <reference path="../pb_data/types.d.ts" />

// Migration: Enrich farmers, farms, harvest_records with datapoint fields
// + Create farmer_annual_data and farm_environment_assessments collections
//
// Source: Datapoint structure by datatable category (21Jan2026)
// Sheets: VN, LA, INDO, Farm_LAO, EUDR

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // ================================================================
    // 1. ENRICH FARMERS (25 new fields)
    // ================================================================
    const farmers = app.findCollectionByNameOrId("farmers");

    // Demographics
    farmers.fields.add(new TextField({ name: "ethnicity", max: 100 }));
    farmers.fields.add(new TextField({ name: "commune", max: 200 }));
    farmers.fields.add(new SelectField({
      name: "socioeconomic_status",
      values: ["poor", "near_poor", "average", "above_average"],
    }));
    farmers.fields.add(new SelectField({
      name: "household_type",
      values: ["nuclear", "extended", "single"],
    }));
    farmers.fields.add(new NumberField({ name: "female_members", min: 0 }));
    farmers.fields.add(new NumberField({ name: "income_earners", min: 0 }));
    farmers.fields.add(new NumberField({ name: "members_under_16", min: 0 }));
    farmers.fields.add(new SelectField({
      name: "residence_status",
      values: ["permanent", "temporary", "migrant"],
    }));

    // Land & Coffee
    farmers.fields.add(new NumberField({ name: "total_coffee_area_ha", min: 0 }));
    farmers.fields.add(new NumberField({ name: "number_of_plots", min: 0 }));
    farmers.fields.add(new SelectField({
      name: "land_certificate_status",
      values: ["none", "applied", "received", "red_book"],
    }));
    farmers.fields.add(new NumberField({ name: "organic_area_ha", min: 0 }));
    farmers.fields.add(new DateField({ name: "organic_conversion_date" }));

    // Environment & Biodiversity
    farmers.fields.add(new NumberField({ name: "shade_tree_density_per_ha", min: 0 }));
    farmers.fields.add(new TextField({ name: "shade_tree_species" }));
    farmers.fields.add(new NumberField({ name: "vegetation_cover_pct", min: 0, max: 100 }));
    farmers.fields.add(new TextField({ name: "soil_conservation" }));
    farmers.fields.add(new TextField({ name: "water_conservation" }));
    farmers.fields.add(new TextField({ name: "waste_management" }));
    farmers.fields.add(new BoolField({ name: "converted_after_dec2020" }));
    farmers.fields.add(new NumberField({ name: "natural_forest_area_ha", min: 0 }));
    farmers.fields.add(new BoolField({ name: "forbidden_chemical_used" }));

    // Livestock (Laos)
    farmers.fields.add(new NumberField({ name: "poultry_count", min: 0 }));
    farmers.fields.add(new NumberField({ name: "pig_count", min: 0 }));
    farmers.fields.add(new NumberField({ name: "cattle_count", min: 0 }));

    app.save(farmers);

    // ================================================================
    // 2. ENRICH FARMS (18 new fields)
    // ================================================================
    const farms = app.findCollectionByNameOrId("farms");

    // Land & Tenure
    farms.fields.add(new SelectField({
      name: "land_tenure_status",
      values: ["owned", "leased", "communal", "disputed"],
    }));
    farms.fields.add(new SelectField({
      name: "management_type",
      values: ["household", "group", "company"],
    }));
    farms.fields.add(new NumberField({ name: "distance_to_drymill_km", min: 0 }));
    farms.fields.add(new NumberField({ name: "distance_to_office_km", min: 0 }));

    // Organic & Production
    farms.fields.add(new DateField({ name: "organic_conversion_date" }));
    farms.fields.add(new NumberField({ name: "organic_area_ha", min: 0 }));
    farms.fields.add(new NumberField({ name: "mature_area_ha", min: 0 }));
    farms.fields.add(new NumberField({ name: "immature_area_ha", min: 0 }));
    farms.fields.add(new TextField({ name: "intercropped_species" }));
    farms.fields.add(new SelectField({
      name: "tree_health_status",
      values: ["excellent", "good", "fair", "poor"],
    }));
    farms.fields.add(new NumberField({ name: "forecast_yield_arabica_kg", min: 0 }));
    farms.fields.add(new NumberField({ name: "forecast_yield_robusta_kg", min: 0 }));

    // Pest Management
    farms.fields.add(new BoolField({ name: "has_disease" }));
    farms.fields.add(new TextField({ name: "disease_type" }));
    farms.fields.add(new SelectField({
      name: "pest_management_method",
      values: ["none", "manual", "biological", "herbal", "chemical"],
    }));

    // Environment
    farms.fields.add(new BoolField({ name: "border_natural_forest" }));
    farms.fields.add(new TextField({ name: "buffer_zone_details" }));
    farms.fields.add(new SelectField({
      name: "contamination_risk_level",
      values: ["none", "low", "moderate", "high"],
    }));

    app.save(farms);

    // ================================================================
    // 3. ENRICH HARVEST_RECORDS (3 new fields)
    // ================================================================
    const harvests = app.findCollectionByNameOrId("harvest_records");
    const coops = app.findCollectionByNameOrId("cooperatives");

    harvests.fields.add(new NumberField({ name: "bags_count", min: 0 }));
    harvests.fields.add(new NumberField({ name: "weight_per_bag_kg", min: 0 }));
    harvests.fields.add(new RelationField({
      name: "cooperative",
      collectionId: coops.id,
      maxSelect: 1,
    }));

    app.save(harvests);

    // ================================================================
    // 4. CREATE farmer_annual_data
    // ================================================================
    const fadCol = new Collection({ name: "farmer_annual_data", type: "base" });
    app.save(fadCol);

    const fad = app.findCollectionByNameOrId("farmer_annual_data");
    fad.fields.add(new RelationField({
      name: "farmer",
      required: true,
      collectionId: farmers.id,
      maxSelect: 1,
    }));
    fad.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    fad.fields.add(new NumberField({ name: "year", required: true, min: 2020, max: 2100 }));
    fad.fields.add(new TextField({ name: "season", max: 50 }));

    // Production
    fad.fields.add(new NumberField({ name: "annual_cherry_kg", min: 0 }));
    fad.fields.add(new NumberField({ name: "high_quality_cherry_kg", min: 0 }));
    fad.fields.add(new NumberField({ name: "a_cherry_estimation_kg", min: 0 }));
    fad.fields.add(new NumberField({ name: "r_cherry_estimation_kg", min: 0 }));

    // Financial
    fad.fields.add(new NumberField({ name: "total_coffee_income", min: 0 }));
    fad.fields.add(new NumberField({ name: "total_production_cost", min: 0 }));
    fad.fields.add(new NumberField({ name: "fertilizer_cost", min: 0 }));
    fad.fields.add(new NumberField({ name: "pesticide_cost", min: 0 }));
    fad.fields.add(new NumberField({ name: "fuel_cost", min: 0 }));
    fad.fields.add(new NumberField({ name: "hired_labor_cost", min: 0 }));
    fad.fields.add(new NumberField({ name: "other_costs", min: 0 }));
    fad.fields.add(new NumberField({ name: "total_household_income", min: 0 }));
    fad.fields.add(new NumberField({ name: "current_debt", min: 0 }));
    fad.fields.add(new NumberField({ name: "remaining_cash", min: 0 }));

    // Shade trees yearly
    fad.fields.add(new NumberField({ name: "shade_trees_planted", min: 0 }));
    fad.fields.add(new NumberField({ name: "shade_trees_survived", min: 0 }));

    fad.fields.add(new TextField({ name: "notes" }));
    fad.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
    fad.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    fad.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));

    fad.indexes = [
      "CREATE UNIQUE INDEX idx_fad_farmer_year ON farmer_annual_data (farmer, year)",
      "CREATE INDEX idx_fad_country ON farmer_annual_data (country)",
      "CREATE INDEX idx_fad_year ON farmer_annual_data (year)",
    ];
    fad.listRule = '@request.auth.id != ""';
    fad.viewRule = '@request.auth.id != ""';
    fad.createRule = '@request.auth.id != ""';
    fad.updateRule = '@request.auth.id != ""';
    fad.deleteRule = '@request.auth.id != ""';
    app.save(fad);

    // ================================================================
    // 5. CREATE farm_environment_assessments
    // ================================================================
    const feaCol = new Collection({ name: "farm_environment_assessments", type: "base" });
    app.save(feaCol);

    const fea = app.findCollectionByNameOrId("farm_environment_assessments");
    fea.fields.add(new RelationField({
      name: "farm",
      required: true,
      collectionId: farms.id,
      maxSelect: 1,
    }));
    fea.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    fea.fields.add(new DateField({ name: "assessment_date", required: true }));

    // Risk Assessment
    fea.fields.add(new SelectField({
      name: "water_pollution_risk",
      values: ["none", "little", "moderate", "high"],
    }));
    fea.fields.add(new SelectField({
      name: "air_pollution_risk",
      values: ["none", "little", "moderate", "high"],
    }));
    fea.fields.add(new TextField({ name: "distance_to_chemical_farm" }));
    fea.fields.add(new TextField({ name: "protection_method" }));
    fea.fields.add(new TextField({ name: "buffer_zone_nwes" }));

    // Farm Tools & Compliance
    fea.fields.add(new TextField({ name: "farm_tools_inventory" }));
    fea.fields.add(new TextField({ name: "non_conformity_history" }));
    fea.fields.add(new TextField({ name: "corrective_action" }));
    fea.fields.add(new SelectField({
      name: "correction_status",
      values: ["pending", "in_progress", "resolved", "na"],
    }));

    // Soil (Indonesia)
    fea.fields.add(new NumberField({ name: "soil_ph", min: 0, max: 14 }));
    fea.fields.add(new TextField({ name: "erosion_management" }));
    fea.fields.add(new TextField({ name: "organic_matter_status" }));

    fea.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    fea.fields.add(new RelationField({ name: "assessed_by", collectionId: users.id, maxSelect: 1 }));
    fea.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    fea.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));

    fea.indexes = [
      "CREATE INDEX idx_fea_farm ON farm_environment_assessments (farm)",
      "CREATE INDEX idx_fea_date ON farm_environment_assessments (assessment_date)",
      "CREATE INDEX idx_fea_country ON farm_environment_assessments (country)",
    ];
    fea.listRule = '@request.auth.id != ""';
    fea.viewRule = '@request.auth.id != ""';
    fea.createRule = '@request.auth.id != ""';
    fea.updateRule = '@request.auth.id != ""';
    fea.deleteRule = '@request.auth.id != ""';
    app.save(fea);
  },
  (app) => {
    // Rollback: delete new collections, fields remain (PB doesn't support field removal easily)
    try { app.delete(app.findCollectionByNameOrId("farm_environment_assessments")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("farmer_annual_data")); } catch(e) {}
  }
);
