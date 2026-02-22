/// <reference path="../pb_data/types.d.ts" />

// Migration 025: Bulk activate all users
// - Set status = 'active' for all users
// - Set password = '12345678' for all non-admin users
// - Assign 'guest' role to users without a role

migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId("users");
    const rolesCol = app.findCollectionByNameOrId("roles");

    // Find the 'guest' role (defined in sync_roles.pb.js)
    let guestRole;
    try {
      guestRole = app.findFirstRecordByFilter(rolesCol, 'name = "guest"');
    } catch (e) {
      console.log("[Migration 025] Guest role not found, skipping role assignment");
      guestRole = null;
    }

    // Get all users
    const allUsers = app.findRecordsByFilter(usersCol, "1=1", "", 0, 0);

    let updated = 0;
    allUsers.forEach((user) => {
      const email = user.get("email");

      // Set status to active for all
      user.set("status", "active");

      // Preserve admin password, reset all others to 12345678
      if (email !== "trung@slowforest.com") {
        user.setPassword("12345678");
      }

      // Assign guest role if user has no role
      if (!user.get("role") && guestRole) {
        user.set("role", guestRole.id);
        console.log("[Migration 025] " + email + ": assigned guest role");
      }

      app.save(user);
      updated++;
    });

    console.log("[Migration 025] Bulk activation complete. " + updated + " users updated.");
  },
  (app) => {
    // Rollback: set non-admin users back to pending
    const usersCol = app.findCollectionByNameOrId("users");
    const allUsers = app.findRecordsByFilter(usersCol, "1=1", "", 0, 0);
    allUsers.forEach((user) => {
      if (user.get("email") !== "trung@slowforest.com") {
        user.set("status", "pending");
        app.save(user);
      }
    });
    console.log("[Migration 025 rollback] Users set back to pending.");
  }
);
