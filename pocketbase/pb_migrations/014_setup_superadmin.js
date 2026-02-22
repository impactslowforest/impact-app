/// <reference path="../pb_data/types.d.ts" />

// Migration: Setup superadmin user and role
// Ensures trung@slowforest.com has absolute highest permissions

migrate((app) => {
    const roles = app.findCollectionByNameOrId("roles");
    const users = app.findCollectionByNameOrId("users");

    // 1. Ensure "superadmin" role exists (matching AuthContext check)
    let superadminRole;
    try {
        superadminRole = app.findFirstRecordByFilter(roles, 'name = "superadmin"');
    } catch (err) {
        // Try finding super_admin and rename if necessary, or just create new
        try {
            superadminRole = app.findFirstRecordByFilter(roles, 'name = "super_admin"');
            superadminRole.set("name", "superadmin");
            app.save(superadminRole);
        } catch {
            // Create new superadmin role
            superadminRole = new Record(roles);
            superadminRole.set("name", "superadmin");
            superadminRole.set("display_name", {
                "en": "Super Administrator",
                "vi": "Quản trị viên cấp cao",
                "lo": "ຜູ້ບໍລິຫານລະດັບສູງ",
                "id": "Administrator Super"
            });
            superadminRole.set("description", "Highest permission level. Can manage everything.");
            superadminRole.set("country", "all");
            superadminRole.set("is_system", true);
            app.save(superadminRole);
        }
    }

    // 2. Find or create the user
    let user;
    try {
        user = app.findFirstRecordByFilter(users, 'email = "trung@slowforest.com"');
    } catch {
        user = new Record(users);
        user.set("email", "trung@slowforest.com");
    }

    // 3. Update user details
    user.set("name", "Lộc Vũ Trung");
    user.setPassword("1a111111");
    user.set("status", "active");
    user.set("country", "global");
    user.set("role", superadminRole.id);
    user.set("emailVisibility", true);

    // Set some metadata
    user.set("designation", "Super Admin");
    user.set("department", "Management");

    app.save(user);

    console.log("[Migration] Successfully updated superadmin user: trung@slowforest.com with role: superadmin");
}, (app) => {
    // No rollback: maintenance migration
});
