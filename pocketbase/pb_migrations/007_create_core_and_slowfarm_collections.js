/// <reference path="../pb_data/types.d.ts" />

// Migration: Create core data collections + Slow Farm (Laos) collections
//
// Core (all 3 countries):
//   1. cooperatives      - Farmer cooperatives/groups
//   2. farmers           - Individual farmers (→ cooperative, required)
//   3. farms             - Farm plots (→ farmer, required)
//   4. training_courses  - Training activities (→ cooperative, optional)
//   5. farm_inputs       - Fertilizer/pesticide records (→ farm, → farmer)
//   6. harvest_records   - Harvest data (→ farm, → farmer)
//
// Slow Farm (Laos only):
//   7.  slow_farms                - 4 company-owned farms
//   8.  daycare_records           - Daycare center daily records
//   9.  wetmill_batches           - Cherry receiving + processing
//   10. shade_tree_assessments    - Shade tree survival rate
//   11. coffee_yield_assessments  - Coffee yield estimates
//   12. workers                   - Inside/outside worker profiles
//   13. payroll_records           - Monthly payroll

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // ================================================================
    // 1. COOPERATIVES
    // ================================================================
    const coopCol = new Collection({ name: "cooperatives", type: "base" });
    app.save(coopCol);

    const coops = app.findCollectionByNameOrId("cooperatives");
    coops.fields.add(new TextField({ name: "coop_code", required: true, max: 50 }));
    coops.fields.add(new TextField({ name: "name", required: true, max: 300 }));
    coops.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    coops.fields.add(new TextField({ name: "province", max: 200 }));
    coops.fields.add(new TextField({ name: "district", max: 200 }));
    coops.fields.add(new TextField({ name: "village", max: 200 }));
    coops.fields.add(new TextField({ name: "address", max: 500 }));
    coops.fields.add(new NumberField({ name: "latitude" }));
    coops.fields.add(new NumberField({ name: "longitude" }));
    coops.fields.add(new TextField({ name: "leader_name", max: 200 }));
    coops.fields.add(new TextField({ name: "leader_phone", max: 50 }));
    coops.fields.add(new NumberField({ name: "member_count", min: 0 }));
    coops.fields.add(new SelectField({
      name: "commodity",
      required: true,
      values: ["coffee", "cacao", "other"],
    }));
    coops.fields.add(new SelectField({
      name: "certification_status",
      values: ["none", "organic", "fair_trade", "rainforest", "multiple"],
    }));
    coops.fields.add(new TextField({ name: "notes" }));
    coops.fields.add(new FileField({
      name: "documents",
      maxSelect: 10,
      maxSize: 52428800,
      mimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    }));
    coops.fields.add(new BoolField({ name: "is_active" }));
    coops.fields.add(new RelationField({ name: "created_by", collectionId: users.id, maxSelect: 1 }));
    coops.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    coops.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    coops.indexes = [
      "CREATE UNIQUE INDEX idx_coop_code_country ON cooperatives (coop_code, country)",
      "CREATE INDEX idx_coop_country ON cooperatives (country)",
      "CREATE INDEX idx_coop_name ON cooperatives (name)",
    ];
    coops.listRule = '@request.auth.id != ""';
    coops.viewRule = '@request.auth.id != ""';
    coops.createRule = '@request.auth.id != ""';
    coops.updateRule = '@request.auth.id != ""';
    coops.deleteRule = '@request.auth.id != ""';
    app.save(coops);

    // ================================================================
    // 2. FARMERS
    // ================================================================
    const farmerCol = new Collection({ name: "farmers", type: "base" });
    app.save(farmerCol);

    const farmers = app.findCollectionByNameOrId("farmers");
    farmers.fields.add(new TextField({ name: "farmer_code", required: true, max: 50 }));
    farmers.fields.add(new RelationField({
      name: "cooperative",
      required: true,
      collectionId: coops.id,
      maxSelect: 1,
    }));
    farmers.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    farmers.fields.add(new TextField({ name: "full_name", required: true, max: 200 }));
    farmers.fields.add(new SelectField({
      name: "gender",
      values: ["male", "female", "other"],
    }));
    farmers.fields.add(new DateField({ name: "date_of_birth" }));
    farmers.fields.add(new TextField({ name: "id_card_number", max: 50 }));
    farmers.fields.add(new TextField({ name: "phone", max: 50 }));
    farmers.fields.add(new TextField({ name: "village", max: 200 }));
    farmers.fields.add(new TextField({ name: "district", max: 200 }));
    farmers.fields.add(new TextField({ name: "province", max: 200 }));
    farmers.fields.add(new TextField({ name: "address", max: 500 }));
    farmers.fields.add(new NumberField({ name: "household_size", min: 0 }));
    farmers.fields.add(new SelectField({
      name: "education_level",
      values: ["none", "primary", "secondary", "high_school", "vocational", "university"],
    }));
    farmers.fields.add(new NumberField({ name: "farm_size_ha", min: 0 }));
    farmers.fields.add(new NumberField({ name: "latitude" }));
    farmers.fields.add(new NumberField({ name: "longitude" }));
    farmers.fields.add(new TextField({ name: "polygon_geojson" }));
    farmers.fields.add(new SelectField({
      name: "certification_status",
      values: ["none", "organic", "transitional", "fair_trade", "multiple"],
    }));
    farmers.fields.add(new DateField({ name: "registration_date" }));
    farmers.fields.add(new FileField({
      name: "profile_photo",
      maxSelect: 1,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    farmers.fields.add(new FileField({
      name: "documents",
      maxSelect: 10,
      maxSize: 52428800,
      mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    }));
    farmers.fields.add(new TextField({ name: "qr_code", max: 200 }));
    farmers.fields.add(new BoolField({ name: "is_active" }));
    farmers.fields.add(new RelationField({ name: "registered_by", collectionId: users.id, maxSelect: 1 }));
    farmers.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    farmers.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    farmers.indexes = [
      "CREATE UNIQUE INDEX idx_farmer_code_country ON farmers (farmer_code, country)",
      "CREATE INDEX idx_farmer_cooperative ON farmers (cooperative)",
      "CREATE INDEX idx_farmer_country ON farmers (country)",
      "CREATE INDEX idx_farmer_name ON farmers (full_name)",
    ];
    farmers.listRule = '@request.auth.id != ""';
    farmers.viewRule = '@request.auth.id != ""';
    farmers.createRule = '@request.auth.id != ""';
    farmers.updateRule = '@request.auth.id != ""';
    farmers.deleteRule = '@request.auth.id != ""';
    app.save(farmers);

    // ================================================================
    // 3. FARMS
    // ================================================================
    const farmCol = new Collection({ name: "farms", type: "base" });
    app.save(farmCol);

    const farms = app.findCollectionByNameOrId("farms");
    farms.fields.add(new TextField({ name: "farm_code", required: true, max: 50 }));
    farms.fields.add(new RelationField({
      name: "farmer",
      required: true,
      collectionId: farmers.id,
      maxSelect: 1,
    }));
    farms.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    farms.fields.add(new TextField({ name: "farm_name", max: 200 }));
    farms.fields.add(new NumberField({ name: "area_ha", required: true, min: 0 }));
    farms.fields.add(new NumberField({ name: "latitude" }));
    farms.fields.add(new NumberField({ name: "longitude" }));
    farms.fields.add(new NumberField({ name: "elevation_m", min: 0 }));
    farms.fields.add(new TextField({ name: "polygon_geojson" }));
    farms.fields.add(new SelectField({
      name: "commodity",
      required: true,
      values: ["coffee", "cacao", "other"],
    }));
    farms.fields.add(new SelectField({
      name: "production_system",
      values: ["monoculture", "intercropping", "agroforestry", "mixed"],
    }));
    farms.fields.add(new SelectField({
      name: "certification_status",
      values: ["none", "organic", "transitional", "conventional"],
    }));
    farms.fields.add(new NumberField({ name: "coffee_trees_count", min: 0 }));
    farms.fields.add(new NumberField({ name: "shade_trees_count", min: 0 }));
    farms.fields.add(new TextField({ name: "soil_type", max: 100 }));
    farms.fields.add(new TextField({ name: "village", max: 200 }));
    farms.fields.add(new TextField({ name: "district", max: 200 }));
    farms.fields.add(new TextField({ name: "province", max: 200 }));
    farms.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    farms.fields.add(new TextField({ name: "notes" }));
    farms.fields.add(new BoolField({ name: "is_active" }));
    farms.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    farms.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    farms.indexes = [
      "CREATE UNIQUE INDEX idx_farm_code_country ON farms (farm_code, country)",
      "CREATE INDEX idx_farm_farmer ON farms (farmer)",
      "CREATE INDEX idx_farm_country ON farms (country)",
    ];
    farms.listRule = '@request.auth.id != ""';
    farms.viewRule = '@request.auth.id != ""';
    farms.createRule = '@request.auth.id != ""';
    farms.updateRule = '@request.auth.id != ""';
    farms.deleteRule = '@request.auth.id != ""';
    app.save(farms);

    // ================================================================
    // 4. TRAINING COURSES
    // ================================================================
    const trainCol = new Collection({ name: "training_courses", type: "base" });
    app.save(trainCol);

    const training = app.findCollectionByNameOrId("training_courses");
    training.fields.add(new TextField({ name: "course_code", required: true, max: 50 }));
    training.fields.add(new RelationField({
      name: "cooperative",
      collectionId: coops.id,
      maxSelect: 1,
    }));
    training.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    training.fields.add(new TextField({ name: "title", required: true, max: 300 }));
    training.fields.add(new TextField({ name: "description" }));
    training.fields.add(new SelectField({
      name: "category",
      required: true,
      values: ["farming_practice", "organic_certification", "pest_management", "post_harvest", "safety", "eudr", "business_skills", "other"],
    }));
    training.fields.add(new DateField({ name: "start_date", required: true }));
    training.fields.add(new DateField({ name: "end_date" }));
    training.fields.add(new NumberField({ name: "duration_hours", min: 0 }));
    training.fields.add(new TextField({ name: "location", max: 300 }));
    training.fields.add(new TextField({ name: "trainer_name", max: 200 }));
    training.fields.add(new TextField({ name: "trainer_organization", max: 200 }));
    training.fields.add(new RelationField({ name: "conducted_by", collectionId: users.id, maxSelect: 1 }));
    training.fields.add(new RelationField({
      name: "participants",
      collectionId: farmers.id,
      maxSelect: 999,
    }));
    training.fields.add(new NumberField({ name: "participant_count", min: 0 }));
    training.fields.add(new NumberField({ name: "male_participants", min: 0 }));
    training.fields.add(new NumberField({ name: "female_participants", min: 0 }));
    training.fields.add(new JSONField({ name: "topics" }));
    training.fields.add(new FileField({
      name: "materials",
      maxSelect: 10,
      maxSize: 52428800,
      mimeTypes: [
        "application/pdf", "image/jpeg", "image/png", "image/webp",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
    }));
    training.fields.add(new FileField({
      name: "attendance_photo",
      maxSelect: 5,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    training.fields.add(new TextField({ name: "notes" }));
    training.fields.add(new SelectField({
      name: "status",
      values: ["planned", "ongoing", "completed", "cancelled"],
    }));
    training.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    training.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    training.indexes = [
      "CREATE UNIQUE INDEX idx_training_code ON training_courses (course_code)",
      "CREATE INDEX idx_training_country ON training_courses (country)",
      "CREATE INDEX idx_training_coop ON training_courses (cooperative)",
      "CREATE INDEX idx_training_date ON training_courses (start_date)",
    ];
    training.listRule = '@request.auth.id != ""';
    training.viewRule = '@request.auth.id != ""';
    training.createRule = '@request.auth.id != ""';
    training.updateRule = '@request.auth.id != ""';
    training.deleteRule = '@request.auth.id != ""';
    app.save(training);

    // ================================================================
    // 5. FARM INPUTS (fertilizer/pesticide)
    // ================================================================
    const inputCol = new Collection({ name: "farm_inputs", type: "base" });
    app.save(inputCol);

    const inputs = app.findCollectionByNameOrId("farm_inputs");
    inputs.fields.add(new RelationField({
      name: "farm",
      required: true,
      collectionId: farms.id,
      maxSelect: 1,
    }));
    inputs.fields.add(new RelationField({
      name: "farmer",
      required: true,
      collectionId: farmers.id,
      maxSelect: 1,
    }));
    inputs.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    inputs.fields.add(new SelectField({
      name: "input_type",
      required: true,
      values: ["fertilizer", "pesticide", "herbicide", "fungicide", "soil_amendment", "other"],
    }));
    inputs.fields.add(new TextField({ name: "product_name", required: true, max: 200 }));
    inputs.fields.add(new TextField({ name: "brand", max: 200 }));
    inputs.fields.add(new BoolField({ name: "is_organic" }));
    inputs.fields.add(new SelectField({
      name: "application_method",
      values: ["spray", "granular", "foliar", "soil_drench", "manual", "other"],
    }));
    inputs.fields.add(new NumberField({ name: "quantity_kg", min: 0 }));
    inputs.fields.add(new NumberField({ name: "quantity_liters", min: 0 }));
    inputs.fields.add(new NumberField({ name: "area_applied_ha", min: 0 }));
    inputs.fields.add(new DateField({ name: "application_date", required: true }));
    inputs.fields.add(new TextField({ name: "target_pest_or_deficiency", max: 300 }));
    inputs.fields.add(new TextField({ name: "source_supplier", max: 200 }));
    inputs.fields.add(new NumberField({ name: "cost_local_currency", min: 0 }));
    inputs.fields.add(new TextField({ name: "notes" }));
    inputs.fields.add(new FileField({
      name: "photos",
      maxSelect: 5,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    inputs.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
    inputs.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    inputs.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    inputs.indexes = [
      "CREATE INDEX idx_farminput_farm ON farm_inputs (farm)",
      "CREATE INDEX idx_farminput_farmer ON farm_inputs (farmer)",
      "CREATE INDEX idx_farminput_country ON farm_inputs (country)",
      "CREATE INDEX idx_farminput_date ON farm_inputs (application_date)",
      "CREATE INDEX idx_farminput_type ON farm_inputs (input_type)",
    ];
    inputs.listRule = '@request.auth.id != ""';
    inputs.viewRule = '@request.auth.id != ""';
    inputs.createRule = '@request.auth.id != ""';
    inputs.updateRule = '@request.auth.id != ""';
    inputs.deleteRule = '@request.auth.id != ""';
    app.save(inputs);

    // ================================================================
    // 6. HARVEST RECORDS
    // ================================================================
    const harvestCol = new Collection({ name: "harvest_records", type: "base" });
    app.save(harvestCol);

    const harvests = app.findCollectionByNameOrId("harvest_records");
    harvests.fields.add(new RelationField({
      name: "farm",
      required: true,
      collectionId: farms.id,
      maxSelect: 1,
    }));
    harvests.fields.add(new RelationField({
      name: "farmer",
      required: true,
      collectionId: farmers.id,
      maxSelect: 1,
    }));
    harvests.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["indonesia", "vietnam", "laos"],
    }));
    harvests.fields.add(new SelectField({
      name: "crop_type",
      required: true,
      values: ["coffee_cherry", "coffee_parchment", "cacao_wet", "cacao_dry", "other"],
    }));
    harvests.fields.add(new TextField({ name: "variety", max: 100 }));
    harvests.fields.add(new TextField({ name: "season", max: 50 }));
    harvests.fields.add(new DateField({ name: "harvest_date", required: true }));
    harvests.fields.add(new NumberField({ name: "quantity_kg", required: true, min: 0 }));
    harvests.fields.add(new NumberField({ name: "moisture_pct", min: 0, max: 100 }));
    harvests.fields.add(new SelectField({
      name: "quality_grade",
      values: ["A", "B", "C", "reject"],
    }));
    harvests.fields.add(new SelectField({
      name: "processing_method",
      values: ["wet", "dry", "honey", "natural", "washed", "semi_washed", "other"],
    }));
    harvests.fields.add(new NumberField({ name: "price_per_kg", min: 0 }));
    harvests.fields.add(new TextField({ name: "currency", max: 10 }));
    harvests.fields.add(new TextField({ name: "buyer", max: 200 }));
    harvests.fields.add(new TextField({ name: "lot_number", max: 100 }));
    harvests.fields.add(new FileField({
      name: "photos",
      maxSelect: 5,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    harvests.fields.add(new TextField({ name: "notes" }));
    harvests.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
    harvests.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    harvests.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    harvests.indexes = [
      "CREATE INDEX idx_harvest_farm ON harvest_records (farm)",
      "CREATE INDEX idx_harvest_farmer ON harvest_records (farmer)",
      "CREATE INDEX idx_harvest_country ON harvest_records (country)",
      "CREATE INDEX idx_harvest_date ON harvest_records (harvest_date)",
      "CREATE INDEX idx_harvest_season ON harvest_records (season)",
    ];
    harvests.listRule = '@request.auth.id != ""';
    harvests.viewRule = '@request.auth.id != ""';
    harvests.createRule = '@request.auth.id != ""';
    harvests.updateRule = '@request.auth.id != ""';
    harvests.deleteRule = '@request.auth.id != ""';
    app.save(harvests);

    // ================================================================
    // 7. SLOW FARMS (Laos only - 4 company-owned farms)
    // ================================================================
    const sfCol = new Collection({ name: "slow_farms", type: "base" });
    app.save(sfCol);

    const slowFarms = app.findCollectionByNameOrId("slow_farms");
    slowFarms.fields.add(new TextField({ name: "farm_code", required: true, max: 50 }));
    slowFarms.fields.add(new TextField({ name: "name", required: true, max: 300 }));
    slowFarms.fields.add(new TextField({ name: "location", max: 300 }));
    slowFarms.fields.add(new TextField({ name: "province", max: 200 }));
    slowFarms.fields.add(new TextField({ name: "district", max: 200 }));
    slowFarms.fields.add(new NumberField({ name: "total_area_ha", min: 0 }));
    slowFarms.fields.add(new NumberField({ name: "coffee_area_ha", min: 0 }));
    slowFarms.fields.add(new NumberField({ name: "latitude" }));
    slowFarms.fields.add(new NumberField({ name: "longitude" }));
    slowFarms.fields.add(new TextField({ name: "polygon_geojson" }));
    slowFarms.fields.add(new NumberField({ name: "elevation_m", min: 0 }));
    slowFarms.fields.add(new NumberField({ name: "coffee_trees_count", min: 0 }));
    slowFarms.fields.add(new NumberField({ name: "shade_trees_count", min: 0 }));
    slowFarms.fields.add(new TextField({ name: "manager_name", max: 200 }));
    slowFarms.fields.add(new TextField({ name: "manager_phone", max: 50 }));
    slowFarms.fields.add(new RelationField({ name: "manager_user", collectionId: users.id, maxSelect: 1 }));
    slowFarms.fields.add(new BoolField({ name: "has_daycare" }));
    slowFarms.fields.add(new BoolField({ name: "has_wetmill" }));
    slowFarms.fields.add(new TextField({ name: "notes" }));
    slowFarms.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    slowFarms.fields.add(new BoolField({ name: "is_active" }));
    slowFarms.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    slowFarms.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    slowFarms.indexes = [
      "CREATE UNIQUE INDEX idx_slowfarm_code ON slow_farms (farm_code)",
      "CREATE INDEX idx_slowfarm_name ON slow_farms (name)",
    ];
    slowFarms.listRule = '@request.auth.id != ""';
    slowFarms.viewRule = '@request.auth.id != ""';
    slowFarms.createRule = '@request.auth.id != ""';
    slowFarms.updateRule = '@request.auth.id != ""';
    slowFarms.deleteRule = '@request.auth.id != ""';
    app.save(slowFarms);

    // ================================================================
    // 8. DAYCARE RECORDS
    // ================================================================
    const dcCol = new Collection({ name: "daycare_records", type: "base" });
    app.save(dcCol);

    const daycare = app.findCollectionByNameOrId("daycare_records");
    daycare.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    daycare.fields.add(new DateField({ name: "record_date", required: true }));
    daycare.fields.add(new NumberField({ name: "children_count", required: true, min: 0 }));
    daycare.fields.add(new NumberField({ name: "boys_count", min: 0 }));
    daycare.fields.add(new NumberField({ name: "girls_count", min: 0 }));
    daycare.fields.add(new NumberField({ name: "staff_count", min: 0 }));
    daycare.fields.add(new JSONField({ name: "activities" }));
    daycare.fields.add(new TextField({ name: "meals_provided" }));
    daycare.fields.add(new TextField({ name: "health_observations" }));
    daycare.fields.add(new TextField({ name: "incidents" }));
    daycare.fields.add(new TextField({ name: "parent_feedback" }));
    daycare.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    daycare.fields.add(new TextField({ name: "notes" }));
    daycare.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
    daycare.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    daycare.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    daycare.indexes = [
      "CREATE UNIQUE INDEX idx_daycare_farm_date ON daycare_records (slow_farm, record_date)",
      "CREATE INDEX idx_daycare_date ON daycare_records (record_date)",
    ];
    daycare.listRule = '@request.auth.id != ""';
    daycare.viewRule = '@request.auth.id != ""';
    daycare.createRule = '@request.auth.id != ""';
    daycare.updateRule = '@request.auth.id != ""';
    daycare.deleteRule = '@request.auth.id != ""';
    app.save(daycare);

    // ================================================================
    // 9. WETMILL BATCHES
    // ================================================================
    const wmCol = new Collection({ name: "wetmill_batches", type: "base" });
    app.save(wmCol);

    const wetmill = app.findCollectionByNameOrId("wetmill_batches");
    wetmill.fields.add(new TextField({ name: "batch_code", required: true, max: 50 }));
    wetmill.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    wetmill.fields.add(new DateField({ name: "receiving_date", required: true }));
    wetmill.fields.add(new SelectField({
      name: "source_type",
      required: true,
      values: ["company_farm", "cooperative", "direct_farmer"],
    }));
    wetmill.fields.add(new RelationField({
      name: "source_cooperative",
      collectionId: coops.id,
      maxSelect: 1,
    }));
    wetmill.fields.add(new RelationField({
      name: "source_farmer",
      collectionId: farmers.id,
      maxSelect: 1,
    }));
    wetmill.fields.add(new TextField({ name: "source_name", max: 200 }));
    wetmill.fields.add(new NumberField({ name: "cherry_received_kg", required: true, min: 0 }));
    wetmill.fields.add(new SelectField({
      name: "cherry_quality",
      values: ["A", "B", "C", "mixed"],
    }));
    wetmill.fields.add(new NumberField({ name: "moisture_cherry_pct", min: 0, max: 100 }));
    wetmill.fields.add(new SelectField({
      name: "processing_method",
      required: true,
      values: ["washed", "natural", "honey", "semi_washed"],
    }));
    wetmill.fields.add(new DateField({ name: "processing_start_date" }));
    wetmill.fields.add(new DateField({ name: "processing_end_date" }));
    wetmill.fields.add(new NumberField({ name: "parchment_output_kg", min: 0 }));
    wetmill.fields.add(new NumberField({ name: "moisture_parchment_pct", min: 0, max: 100 }));
    wetmill.fields.add(new NumberField({ name: "conversion_ratio" }));
    wetmill.fields.add(new TextField({ name: "lot_number", max: 100 }));
    wetmill.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["receiving", "processing", "drying", "completed", "rejected"],
    }));
    wetmill.fields.add(new NumberField({ name: "price_per_kg_cherry", min: 0 }));
    wetmill.fields.add(new TextField({ name: "currency", max: 10 }));
    wetmill.fields.add(new NumberField({ name: "total_cost", min: 0 }));
    wetmill.fields.add(new TextField({ name: "notes" }));
    wetmill.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    wetmill.fields.add(new RelationField({ name: "recorded_by", collectionId: users.id, maxSelect: 1 }));
    wetmill.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    wetmill.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    wetmill.indexes = [
      "CREATE UNIQUE INDEX idx_wetmill_batch ON wetmill_batches (batch_code)",
      "CREATE INDEX idx_wetmill_farm ON wetmill_batches (slow_farm)",
      "CREATE INDEX idx_wetmill_date ON wetmill_batches (receiving_date)",
      "CREATE INDEX idx_wetmill_status ON wetmill_batches (status)",
      "CREATE INDEX idx_wetmill_source_coop ON wetmill_batches (source_cooperative)",
    ];
    wetmill.listRule = '@request.auth.id != ""';
    wetmill.viewRule = '@request.auth.id != ""';
    wetmill.createRule = '@request.auth.id != ""';
    wetmill.updateRule = '@request.auth.id != ""';
    wetmill.deleteRule = '@request.auth.id != ""';
    app.save(wetmill);

    // ================================================================
    // 10. SHADE TREE ASSESSMENTS
    // ================================================================
    const stCol = new Collection({ name: "shade_tree_assessments", type: "base" });
    app.save(stCol);

    const shadeTrees = app.findCollectionByNameOrId("shade_tree_assessments");
    shadeTrees.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    shadeTrees.fields.add(new DateField({ name: "assessment_date", required: true }));
    shadeTrees.fields.add(new TextField({ name: "plot_section", max: 100 }));
    shadeTrees.fields.add(new TextField({ name: "tree_species", max: 200 }));
    shadeTrees.fields.add(new NumberField({ name: "trees_planted", required: true, min: 0 }));
    shadeTrees.fields.add(new NumberField({ name: "trees_surviving", required: true, min: 0 }));
    shadeTrees.fields.add(new NumberField({ name: "survival_rate_pct", min: 0, max: 100 }));
    shadeTrees.fields.add(new NumberField({ name: "trees_dead", min: 0 }));
    shadeTrees.fields.add(new NumberField({ name: "trees_replaced", min: 0 }));
    shadeTrees.fields.add(new SelectField({
      name: "health_status",
      values: ["excellent", "good", "fair", "poor", "critical"],
    }));
    shadeTrees.fields.add(new NumberField({ name: "avg_height_m", min: 0 }));
    shadeTrees.fields.add(new NumberField({ name: "avg_canopy_diameter_m", min: 0 }));
    shadeTrees.fields.add(new TextField({ name: "pest_disease_notes" }));
    shadeTrees.fields.add(new TextField({ name: "maintenance_notes" }));
    shadeTrees.fields.add(new TextField({ name: "recommendations" }));
    shadeTrees.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    shadeTrees.fields.add(new RelationField({ name: "assessed_by", collectionId: users.id, maxSelect: 1 }));
    shadeTrees.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    shadeTrees.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    shadeTrees.indexes = [
      "CREATE INDEX idx_shadetree_farm ON shade_tree_assessments (slow_farm)",
      "CREATE INDEX idx_shadetree_date ON shade_tree_assessments (assessment_date)",
    ];
    shadeTrees.listRule = '@request.auth.id != ""';
    shadeTrees.viewRule = '@request.auth.id != ""';
    shadeTrees.createRule = '@request.auth.id != ""';
    shadeTrees.updateRule = '@request.auth.id != ""';
    shadeTrees.deleteRule = '@request.auth.id != ""';
    app.save(shadeTrees);

    // ================================================================
    // 11. COFFEE YIELD ASSESSMENTS
    // ================================================================
    const cyCol = new Collection({ name: "coffee_yield_assessments", type: "base" });
    app.save(cyCol);

    const coffeeYield = app.findCollectionByNameOrId("coffee_yield_assessments");
    coffeeYield.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    coffeeYield.fields.add(new TextField({ name: "assessment_code", required: true, max: 50 }));
    coffeeYield.fields.add(new DateField({ name: "assessment_date", required: true }));
    coffeeYield.fields.add(new TextField({ name: "season", max: 50 }));
    coffeeYield.fields.add(new TextField({ name: "plot_section", max: 100 }));
    coffeeYield.fields.add(new NumberField({ name: "area_assessed_ha", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "total_trees_assessed", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "productive_trees", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "non_productive_trees", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "avg_cherries_per_tree", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "estimated_cherry_kg", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "estimated_parchment_kg", min: 0 }));
    coffeeYield.fields.add(new NumberField({ name: "estimated_yield_per_ha_kg", min: 0 }));
    coffeeYield.fields.add(new SelectField({
      name: "tree_health",
      values: ["excellent", "good", "fair", "poor"],
    }));
    coffeeYield.fields.add(new TextField({ name: "variety", max: 100 }));
    coffeeYield.fields.add(new NumberField({ name: "avg_tree_age_years", min: 0 }));
    coffeeYield.fields.add(new TextField({ name: "pest_disease_observations" }));
    coffeeYield.fields.add(new TextField({ name: "weather_conditions" }));
    coffeeYield.fields.add(new TextField({ name: "recommendations" }));
    coffeeYield.fields.add(new FileField({
      name: "photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    coffeeYield.fields.add(new RelationField({ name: "assessed_by", collectionId: users.id, maxSelect: 1 }));
    coffeeYield.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    coffeeYield.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    coffeeYield.indexes = [
      "CREATE UNIQUE INDEX idx_coffeeyield_code ON coffee_yield_assessments (assessment_code)",
      "CREATE INDEX idx_coffeeyield_farm ON coffee_yield_assessments (slow_farm)",
      "CREATE INDEX idx_coffeeyield_date ON coffee_yield_assessments (assessment_date)",
      "CREATE INDEX idx_coffeeyield_season ON coffee_yield_assessments (season)",
    ];
    coffeeYield.listRule = '@request.auth.id != ""';
    coffeeYield.viewRule = '@request.auth.id != ""';
    coffeeYield.createRule = '@request.auth.id != ""';
    coffeeYield.updateRule = '@request.auth.id != ""';
    coffeeYield.deleteRule = '@request.auth.id != ""';
    app.save(coffeeYield);

    // ================================================================
    // 12. WORKERS (inside/outside)
    // ================================================================
    const wkCol = new Collection({ name: "workers", type: "base" });
    app.save(wkCol);

    const workers = app.findCollectionByNameOrId("workers");
    workers.fields.add(new TextField({ name: "worker_code", required: true, max: 50 }));
    workers.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    workers.fields.add(new SelectField({
      name: "worker_type",
      required: true,
      values: ["inside", "outside"],
    }));
    workers.fields.add(new TextField({ name: "full_name", required: true, max: 200 }));
    workers.fields.add(new SelectField({
      name: "gender",
      values: ["male", "female", "other"],
    }));
    workers.fields.add(new DateField({ name: "date_of_birth" }));
    workers.fields.add(new TextField({ name: "id_card_number", max: 50 }));
    workers.fields.add(new TextField({ name: "phone", max: 50 }));
    workers.fields.add(new TextField({ name: "address", max: 500 }));
    workers.fields.add(new TextField({ name: "village", max: 200 }));
    workers.fields.add(new TextField({ name: "district", max: 200 }));
    workers.fields.add(new TextField({ name: "province", max: 200 }));
    workers.fields.add(new TextField({ name: "position", max: 100 }));
    workers.fields.add(new TextField({ name: "department", max: 100 }));
    workers.fields.add(new SelectField({
      name: "contract_type",
      values: ["permanent", "fixed_term", "daily", "seasonal"],
    }));
    workers.fields.add(new DateField({ name: "hire_date" }));
    workers.fields.add(new DateField({ name: "contract_end_date" }));
    workers.fields.add(new NumberField({ name: "daily_rate", min: 0 }));
    workers.fields.add(new NumberField({ name: "monthly_salary", min: 0 }));
    workers.fields.add(new TextField({ name: "currency", max: 10 }));
    workers.fields.add(new TextField({ name: "bank_account", max: 100 }));
    workers.fields.add(new TextField({ name: "bank_name", max: 100 }));
    workers.fields.add(new TextField({ name: "emergency_contact_name", max: 200 }));
    workers.fields.add(new TextField({ name: "emergency_contact_phone", max: 50 }));
    workers.fields.add(new FileField({
      name: "profile_photo",
      maxSelect: 1,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));
    workers.fields.add(new FileField({
      name: "documents",
      maxSelect: 10,
      maxSize: 52428800,
      mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    }));
    workers.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["active", "on_leave", "terminated", "seasonal_inactive"],
    }));
    workers.fields.add(new BoolField({ name: "is_active" }));
    workers.fields.add(new RelationField({ name: "registered_by", collectionId: users.id, maxSelect: 1 }));
    workers.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    workers.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    workers.indexes = [
      "CREATE UNIQUE INDEX idx_worker_code ON workers (worker_code)",
      "CREATE INDEX idx_worker_farm ON workers (slow_farm)",
      "CREATE INDEX idx_worker_type ON workers (worker_type)",
      "CREATE INDEX idx_worker_status ON workers (status)",
      "CREATE INDEX idx_worker_name ON workers (full_name)",
    ];
    workers.listRule = '@request.auth.id != ""';
    workers.viewRule = '@request.auth.id != ""';
    workers.createRule = '@request.auth.id != ""';
    workers.updateRule = '@request.auth.id != ""';
    workers.deleteRule = '@request.auth.id != ""';
    app.save(workers);

    // ================================================================
    // 13. PAYROLL RECORDS
    // ================================================================
    const prCol = new Collection({ name: "payroll_records", type: "base" });
    app.save(prCol);

    const payroll = app.findCollectionByNameOrId("payroll_records");
    payroll.fields.add(new RelationField({
      name: "worker",
      required: true,
      collectionId: workers.id,
      maxSelect: 1,
    }));
    payroll.fields.add(new RelationField({
      name: "slow_farm",
      required: true,
      collectionId: slowFarms.id,
      maxSelect: 1,
    }));
    payroll.fields.add(new TextField({ name: "payroll_period", required: true, max: 20 }));
    payroll.fields.add(new NumberField({ name: "year", required: true, min: 2020, max: 2100 }));
    payroll.fields.add(new NumberField({ name: "month", required: true, min: 1, max: 12 }));
    payroll.fields.add(new NumberField({ name: "days_worked", min: 0 }));
    payroll.fields.add(new NumberField({ name: "overtime_hours", min: 0 }));
    payroll.fields.add(new NumberField({ name: "base_salary", min: 0 }));
    payroll.fields.add(new NumberField({ name: "overtime_pay", min: 0 }));
    payroll.fields.add(new NumberField({ name: "bonus", min: 0 }));
    payroll.fields.add(new NumberField({ name: "deductions", min: 0 }));
    payroll.fields.add(new TextField({ name: "deduction_details" }));
    payroll.fields.add(new NumberField({ name: "net_pay", required: true, min: 0 }));
    payroll.fields.add(new TextField({ name: "currency", max: 10 }));
    payroll.fields.add(new SelectField({
      name: "payment_method",
      values: ["bank_transfer", "cash", "mobile_money"],
    }));
    payroll.fields.add(new DateField({ name: "payment_date" }));
    payroll.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["draft", "calculated", "approved", "paid", "cancelled"],
    }));
    payroll.fields.add(new RelationField({ name: "approved_by", collectionId: users.id, maxSelect: 1 }));
    payroll.fields.add(new DateField({ name: "approved_at" }));
    payroll.fields.add(new TextField({ name: "notes" }));
    payroll.fields.add(new FileField({
      name: "payslip",
      maxSelect: 1,
      maxSize: 10485760,
      mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    }));
    payroll.fields.add(new RelationField({ name: "created_by", collectionId: users.id, maxSelect: 1 }));
    payroll.fields.add(new AutodateField({ name: "created", onCreate: true, onUpdate: false }));
    payroll.fields.add(new AutodateField({ name: "updated", onCreate: true, onUpdate: true }));
    payroll.indexes = [
      "CREATE UNIQUE INDEX idx_payroll_worker_period ON payroll_records (worker, payroll_period)",
      "CREATE INDEX idx_payroll_farm ON payroll_records (slow_farm)",
      "CREATE INDEX idx_payroll_period ON payroll_records (payroll_period)",
      "CREATE INDEX idx_payroll_status ON payroll_records (status)",
      "CREATE INDEX idx_payroll_year_month ON payroll_records (year, month)",
    ];
    payroll.listRule = '@request.auth.id != ""';
    payroll.viewRule = '@request.auth.id != ""';
    payroll.createRule = '@request.auth.id != ""';
    payroll.updateRule = '@request.auth.id != ""';
    payroll.deleteRule = '@request.auth.id != ""';
    app.save(payroll);
  },
  (app) => {
    // Rollback: delete in reverse dependency order
    try { app.delete(app.findCollectionByNameOrId("payroll_records")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("workers")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("coffee_yield_assessments")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("shade_tree_assessments")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("wetmill_batches")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("daycare_records")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("slow_farms")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("harvest_records")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("farm_inputs")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("training_courses")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("farms")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("farmers")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("cooperatives")); } catch(e) {}
  }
);
