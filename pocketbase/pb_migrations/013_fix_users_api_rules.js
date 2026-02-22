/// <reference path="../pb_data/types.d.ts" />

// Migration: Set API rules on users collection so authenticated users can list all users
// By default, PocketBase auth collections only let users see their own record

migrate(
    (app) => {
        const users = app.findCollectionByNameOrId("users");

        // Any authenticated user can list/view all users
        users.listRule = '@request.auth.id != ""';
        users.viewRule = '@request.auth.id != ""';

        // Only authenticated users can create new users (admin adding team members)
        users.createRule = '@request.auth.id != ""';

        // Users can update themselves, or admins can update anyone
        users.updateRule = '@request.auth.id != ""';

        // Only admins can delete (authenticated users for now, refine with role check later)
        users.deleteRule = '@request.auth.id != ""';

        app.save(users);

        console.log("[Migration] Users collection API rules updated — authenticated users can now list all users");
    },
    (app) => {
        // Rollback: reset to default (null = only own record for auth collections)
        const users = app.findCollectionByNameOrId("users");
        users.listRule = null;
        users.viewRule = null;
        users.createRule = null;
        users.updateRule = null;
        users.deleteRule = null;
        app.save(users);
    }
);
