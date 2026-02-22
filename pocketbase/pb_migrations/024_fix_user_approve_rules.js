/// <reference path="../pb_data/types.d.ts" />

// Migration 024: Fix user approval — allow country_admin to update users
// Also clean up duplicate super_admin/superadmin roles

migrate(
    (app) => {
        // 1. Fix users updateRule: allow country_admin to approve/update users
        const users = app.findCollectionByNameOrId("users");
        users.updateRule =
            'id = @request.auth.id || ' +
            '@request.auth.role.name = "superadmin" || ' +
            '@request.auth.role.name = "country_admin"';
        app.save(users);
        console.log("[Migration 024] Updated users.updateRule to include country_admin");

        // 2. Clean up duplicate super_admin role (keep only superadmin)
        const roles = app.findCollectionByNameOrId("roles");
        try {
            const duplicateRole = app.findFirstRecordByFilter(roles, 'name = "super_admin"');
            // Check if any users reference this old role
            const usersCol = app.findCollectionByNameOrId("users");
            const usersWithOldRole = app.findRecordsByFilter(
                usersCol,
                `role = "${duplicateRole.id}"`,
                "", // sort
                0,  // limit (0 = all)
                0   // offset
            );

            if (usersWithOldRole && usersWithOldRole.length > 0) {
                // Find the correct superadmin role
                const correctRole = app.findFirstRecordByFilter(roles, 'name = "superadmin"');
                // Migrate users to correct role
                usersWithOldRole.forEach((u) => {
                    u.set("role", correctRole.id);
                    app.save(u);
                    console.log(`[Migration 024] Migrated user ${u.get("email")} from super_admin to superadmin role`);
                });
            }

            // Delete the duplicate role
            app.delete(duplicateRole);
            console.log("[Migration 024] Deleted duplicate 'super_admin' role");
        } catch (e) {
            console.log("[Migration 024] No duplicate 'super_admin' role found — OK");
        }

        console.log("[Migration 024] User approval fixes applied successfully.");
    },
    (app) => {
        // Rollback: revert updateRule to previous
        const users = app.findCollectionByNameOrId("users");
        users.updateRule = 'id = @request.auth.id || @request.auth.role.name = "superadmin"';
        app.save(users);
    }
);
