/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Country Validation (Defense-in-depth)
 *
 * Ensures users can only create records for their own country.
 * Superadmin and global users bypass this check.
 * Auto-fills country from user's country if not provided.
 *
 * This is a server-side backup to the API rules in migration 015.
 */

const COUNTRY_ENFORCED = [
  "cooperatives", "farmers", "farms", "training_courses",
  "farm_inputs", "harvest_records", "farmer_annual_data",
  "farm_environment_assessments", "ghg_emissions",
  "ecosystem_assessments", "compliance_records",
  "eudr_documents", "eudr_plots",
  "eu_organic_inspections", "farm_crop_estimations",
  "ra_audits",
];

onRecordCreate((e) => {
  // Skip if not an API request (internal/hook calls)
  if (!e.httpContext) {
    e.next();
    return;
  }

  const authRecord = e.httpContext.get("authRecord");
  if (!authRecord) {
    e.next();
    return;
  }

  const userCountry = authRecord.getString("country");
  const recordCountry = e.record.getString("country");

  // Check if user is superadmin (lookup role name)
  const roleId = authRecord.getString("role");
  let roleName = "";
  if (roleId) {
    try {
      const role = e.app.findRecordById("roles", roleId);
      roleName = role.getString("name");
    } catch (err) {
      // Role not found, proceed with empty name
    }
  }

  // Superadmin and global users can create for any country
  if (roleName === "superadmin" || userCountry === "global") {
    e.next();
    return;
  }

  // Auto-fill country if not provided
  if (!recordCountry) {
    e.record.set("country", userCountry);
    e.next();
    return;
  }

  // Reject if country mismatch
  if (recordCountry !== userCountry) {
    throw new BadRequestError(
      "You can only create records for your own country (" + userCountry + ")"
    );
  }

  e.next();
}, ...COUNTRY_ENFORCED);
