/// <reference path="../pb_data/types.d.ts" />

// Migration: Expand EUDR assessments with comprehensive checklist fields
// Based on: Check list_Dec24.xlsx template + EU Regulation 2023/1115
// 6 sections, 36 checklist items total:
//   I.   Ownership & Legal Documentation (7 items)
//   II.  Geolocation & Plot Mapping (6 items)
//   III. Deforestation & Land Use (7 items)
//   IV.  Traceability & Supply Chain (4 items)
//   V.   Human Rights & Labor (6 items)
//   VI.  Environmental Protection (6 items)

migrate(
  (app) => {
    const assess = app.findCollectionByNameOrId("eudr_assessments");

    // === Section 1: Ownership & Legal Documentation ===
    assess.fields.add(new BoolField({ name: "ownership_documented" }));
    assess.fields.add(new BoolField({ name: "ownership_no_disputes" }));
    assess.fields.add(new BoolField({ name: "management_clearly_defined" }));
    assess.fields.add(new BoolField({ name: "management_legal_compliance" }));
    assess.fields.add(new BoolField({ name: "certification_participation" }));
    assess.fields.add(new BoolField({ name: "environmental_commitments" }));
    assess.fields.add(new BoolField({ name: "buffer_zone_maintained" }));

    // === Section 2: Geolocation (some already exist from 002) ===
    // gps_coordinates_available - already exists
    assess.fields.add(new BoolField({ name: "gps_regularly_updated" }));
    // polygon_mapping_done - already exists
    assess.fields.add(new BoolField({ name: "plot_boundary_clear" }));
    assess.fields.add(new BoolField({ name: "area_changes_documented" }));
    assess.fields.add(new BoolField({ name: "no_expansion_post2020" }));

    // === Section 3: Deforestation (some already exist) ===
    // no_deforestation_after_dec2020 - already exists
    // no_forest_degradation - already exists
    assess.fields.add(new BoolField({ name: "no_burning_activities" }));
    assess.fields.add(new BoolField({ name: "no_illegal_logging" }));
    assess.fields.add(new BoolField({ name: "no_land_use_conversion" }));
    // legal_land_use - already exists
    assess.fields.add(new BoolField({ name: "silvicultural_documented" }));

    // === Section 4: Traceability (some already exist) ===
    // supply_chain_documented - already exists
    assess.fields.add(new BoolField({ name: "product_segregation" }));
    assess.fields.add(new BoolField({ name: "due_diligence_completed" }));
    assess.fields.add(new BoolField({ name: "traceability_to_plot" }));

    // === Section 5: Human Rights (some already exist) ===
    // no_forced_labor - already exists
    // no_child_labor - already exists
    assess.fields.add(new BoolField({ name: "fair_compensation" }));
    // indigenous_rights_respected - already exists
    // land_tenure_documented - already exists
    assess.fields.add(new BoolField({ name: "fpic_obtained" }));

    // === Section 6: Environmental (some already exist) ===
    // biodiversity_assessed - already exists
    // water_protection -> water_sources_protected
    assess.fields.add(new BoolField({ name: "water_sources_protected" }));
    // soil_conservation - already exists
    assess.fields.add(new BoolField({ name: "erosion_control" }));
    assess.fields.add(new BoolField({ name: "pesticide_management" }));
    assess.fields.add(new BoolField({ name: "waste_management" }));

    // === Additional fields ===
    assess.fields.add(new TextField({ name: "section_notes" })); // JSON string of per-section notes
    assess.fields.add(new TextField({ name: "declarant_name" }));
    assess.fields.add(new TextField({ name: "declarant_id" }));

    app.save(assess);
  },
  (app) => {
    // Rollback: remove added fields
    const assess = app.findCollectionByNameOrId("eudr_assessments");

    const fieldsToRemove = [
      "ownership_documented", "ownership_no_disputes", "management_clearly_defined",
      "management_legal_compliance", "certification_participation", "environmental_commitments",
      "buffer_zone_maintained", "gps_regularly_updated", "plot_boundary_clear",
      "area_changes_documented", "no_expansion_post2020", "no_burning_activities",
      "no_illegal_logging", "no_land_use_conversion", "silvicultural_documented",
      "product_segregation", "due_diligence_completed", "traceability_to_plot",
      "fair_compensation", "fpic_obtained", "water_sources_protected",
      "erosion_control", "pesticide_management", "waste_management",
      "section_notes", "declarant_name", "declarant_id",
    ];

    fieldsToRemove.forEach(name => {
      const field = assess.fields.getByName(name);
      if (field) assess.fields.removeById(field.id);
    });

    app.save(assess);
  }
);
