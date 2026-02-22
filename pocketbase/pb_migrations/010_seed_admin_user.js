/// <reference path="../pb_data/types.d.ts" />

// Migration: Seed admin user for initial setup
// Admin: Lộc Vũ Trung (trung@slowforest.com)

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // Check if user already exists
    try {
      app.findFirstRecordByFilter(users, 'email = "trung@slowforest.com"');
      return; // Already exists, skip
    } catch {
      // Not found, create it
    }

    // Find super_admin role if it exists
    let adminRole;
    try {
      adminRole = app.findFirstRecordByFilter(
        app.findCollectionByNameOrId("roles"),
        'name = "super_admin"'
      );
    } catch {
      adminRole = null;
    }

    const record = new Record(users);
    record.set("name", "Lộc Vũ Trung");
    record.set("email", "trung@slowforest.com");
    record.setPassword("slowforest2026");
    record.set("status", "active");
    record.set("country", "global");
    record.set("emailVisibility", true);
    if (adminRole) {
      record.set("role", adminRole.id);
    }
    app.save(record);
  },
  (app) => {
    // Rollback: delete the seeded user
    try {
      const users = app.findCollectionByNameOrId("users");
      const record = app.findFirstRecordByFilter(users, 'email = "trung@slowforest.com"');
      app.delete(record);
    } catch {
      // Ignore if not found
    }
  }
);
