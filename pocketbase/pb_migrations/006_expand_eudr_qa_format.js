/// <reference path="../pb_data/types.d.ts" />

// Migration: Expand EUDR assessments with Q&A format fields
// Based on: EUDR Site Inspection Report PDF (40 questions)
// and "EUDR data" sheet from Main data.xlsx (A1-A58 answer fields)
//
// The existing boolean checklist approach is kept for compatibility,
// but new text fields are added for the actual Q&A report format.

migrate(
  (app) => {
    const assess = app.findCollectionByNameOrId("eudr_assessments");

    // === Header info (some already exist on eudr_plots) ===
    assess.fields.add(new TextField({ name: "staff_input" }));
    assess.fields.add(new TextField({ name: "province" }));
    assess.fields.add(new TextField({ name: "district" }));
    assess.fields.add(new TextField({ name: "commune" }));
    assess.fields.add(new TextField({ name: "address_detail" }));
    assess.fields.add(new TextField({ name: "interview_location" }));
    assess.fields.add(new TextField({ name: "full_name" }));
    assess.fields.add(new TextField({ name: "id_card" }));
    assess.fields.add(new TextField({ name: "phone_number" }));
    assess.fields.add(new TextField({ name: "plot_code_ref" }));

    // === Section I: General Information on Ownership and Management ===
    // a. Ownership (Q1-Q4)
    assess.fields.add(new TextField({ name: "a1_owner_type" }));        // Q1: Who owns this plot?
    assess.fields.add(new TextField({ name: "a2_owner_before2020" }));   // Q2: Before Dec 2020
    assess.fields.add(new TextField({ name: "a3_owner_after2020" }));    // Q3: After Dec 2020
    assess.fields.add(new TextField({ name: "a4_ownership_change" }));   // Q4: Changes
    assess.fields.add(new TextField({ name: "a5_ownership_docs" }));     // Q4 attachment list
    assess.fields.add(new TextField({ name: "a6_proof_attachment" }));   // Q4 doc file path

    // b. Management (Q5-Q8)
    assess.fields.add(new TextField({ name: "a7_mgmt_responsibility" }));
    assess.fields.add(new TextField({ name: "a8_mgmt_changes" }));
    assess.fields.add(new TextField({ name: "a9_mgmt_structure" }));
    assess.fields.add(new TextField({ name: "a10_mgmt_disputes" }));
    assess.fields.add(new TextField({ name: "a11_agreements" }));

    // c. Certification (Q9-Q12)
    assess.fields.add(new TextField({ name: "a12_certification_status" }));
    assess.fields.add(new TextField({ name: "a13_commitments" }));

    // === Section II: Area and Farm Plot Map (Q13-Q19) ===
    assess.fields.add(new TextField({ name: "a14_map_gps_before" }));
    assess.fields.add(new TextField({ name: "a15_map_gps_after" }));
    assess.fields.add(new TextField({ name: "a16_area_before2020" }));
    assess.fields.add(new TextField({ name: "a17_area_after2020" }));
    assess.fields.add(new TextField({ name: "a18_crop_changes" }));
    assess.fields.add(new TextField({ name: "a19_conversion" }));
    assess.fields.add(new TextField({ name: "a20_milestone_check" }));
    assess.fields.add(new TextField({ name: "a21_new_purposes" }));
    assess.fields.add(new TextField({ name: "a22_non_farming" }));

    // === Section III: Silvicultural Activities (Q20-Q29) ===
    assess.fields.add(new TextField({ name: "a23_history_cacao" }));
    assess.fields.add(new TextField({ name: "a24_legacy_land" }));
    assess.fields.add(new TextField({ name: "a25_buffer_greenbelts" }));
    assess.fields.add(new TextField({ name: "a26_forest_disturbance" }));
    assess.fields.add(new TextField({ name: "a27_illegal_activities" }));
    assess.fields.add(new TextField({ name: "a28_biodiversity_soil" }));
    assess.fields.add(new TextField({ name: "a29_restoration" }));
    assess.fields.add(new TextField({ name: "a30_certifications" }));

    // Photo evidence for section III
    assess.fields.add(new FileField({
      name: "section3_photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));

    // === Section IV: Utilization and Exploitation (Q30-Q34) ===
    assess.fields.add(new TextField({ name: "a31_silvicultural" }));
    assess.fields.add(new TextField({ name: "a32_harvesting" }));
    assess.fields.add(new TextField({ name: "a33_exploitation" }));
    assess.fields.add(new TextField({ name: "a34_zoning" }));

    // === Section V: Comparison Between Two Periods (Q35-Q37) ===
    assess.fields.add(new TextField({ name: "a35_significant_changes" }));
    assess.fields.add(new TextField({ name: "a36_comparison" }));
    assess.fields.add(new TextField({ name: "a37_challenges" }));

    // Photo evidence for section V
    assess.fields.add(new FileField({
      name: "section5_photos",
      maxSelect: 10,
      maxSize: 10485760,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));

    // === Section VI: Open-Ended Questions (Q38-Q40) ===
    assess.fields.add(new TextField({ name: "a38_suggestions" }));
    assess.fields.add(new TextField({ name: "a39_missing_info" }));
    assess.fields.add(new TextField({ name: "a40_additional" }));

    // === Declaration ===
    assess.fields.add(new TextField({ name: "declaration_address" }));
    assess.fields.add(new FileField({
      name: "signature_image",
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }));

    app.save(assess);
  },
  (app) => {
    const assess = app.findCollectionByNameOrId("eudr_assessments");

    const fieldsToRemove = [
      "staff_input", "province", "district", "commune", "address_detail",
      "interview_location", "full_name", "id_card", "phone_number", "plot_code_ref",
      "a1_owner_type", "a2_owner_before2020", "a3_owner_after2020",
      "a4_ownership_change", "a5_ownership_docs", "a6_proof_attachment",
      "a7_mgmt_responsibility", "a8_mgmt_changes", "a9_mgmt_structure",
      "a10_mgmt_disputes", "a11_agreements",
      "a12_certification_status", "a13_commitments",
      "a14_map_gps_before", "a15_map_gps_after",
      "a16_area_before2020", "a17_area_after2020",
      "a18_crop_changes", "a19_conversion",
      "a20_milestone_check", "a21_new_purposes", "a22_non_farming",
      "a23_history_cacao", "a24_legacy_land",
      "a25_buffer_greenbelts", "a26_forest_disturbance",
      "a27_illegal_activities", "a28_biodiversity_soil",
      "a29_restoration", "a30_certifications", "section3_photos",
      "a31_silvicultural", "a32_harvesting", "a33_exploitation", "a34_zoning",
      "a35_significant_changes", "a36_comparison", "a37_challenges", "section5_photos",
      "a38_suggestions", "a39_missing_info", "a40_additional",
      "declaration_address", "signature_image",
    ];

    fieldsToRemove.forEach(name => {
      const field = assess.fields.getByName(name);
      if (field) assess.fields.removeById(field.id);
    });

    app.save(assess);
  }
);
