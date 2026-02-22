/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Sync Roles
 *
 * Syncs base role definitions (name, display_name, description, country, is_system).
 * Permissions should be managed via admin UI or migrations (relation field).
 *
 * Usage: POST /api/custom/sync-roles
 */
routerAdd("POST", "/api/custom/sync-roles", (e) => {
    const roles = [
        {
            name: "superadmin",
            display_name: {
                en: "Super Administrator",
                vi: "Quản trị viên cấp cao",
                lo: "ຜູ້ບໍລິຫານລະດັບສູງ",
                id: "Administrator Super",
            },
            description: "Full system access — highest permission level",
            country: "all",
            is_system: true,
        },
        {
            name: "country_admin",
            display_name: {
                en: "Country Admin",
                vi: "Quản lý quốc gia",
                lo: "ຜູ້ຈັດການປະເທດ",
                id: "Admin Negara",
            },
            description: "Access to country-specific data and user management",
            country: "all",
            is_system: true,
        },
        {
            name: "manager",
            display_name: {
                en: "Manager",
                vi: "Quản lý",
                lo: "ຜູ້ຈັດການ",
                id: "Manajer",
            },
            description: "Team lead with data approval capabilities",
            country: "all",
            is_system: false,
        },
        {
            name: "staff",
            display_name: {
                en: "Staff",
                vi: "Nhân viên",
                lo: "ພະນັກງານ",
                id: "Staf",
            },
            description: "Standard data entry and viewing",
            country: "all",
            is_system: false,
        },
        {
            name: "guest",
            display_name: {
                en: "Guest",
                vi: "Khách",
                lo: "ແຂກ",
                id: "Tamu",
            },
            description: "Read-only access to basic dashboard",
            country: "all",
            is_system: false,
        },
    ];

    try {
        const collection = e.app.findCollectionByNameOrId("roles");

        roles.forEach((roleData) => {
            let record;
            try {
                record = e.app.findFirstRecordByData("roles", "name", roleData.name);
            } catch (err) {
                record = new Record(collection);
            }

            record.set("name", roleData.name);
            record.set("display_name", roleData.display_name);
            record.set("description", roleData.description);
            record.set("country", roleData.country);
            record.set("is_system", roleData.is_system);
            // Note: permissions is a relation field — manage via admin UI or migrations
            // Do NOT set it here to avoid overwriting valid relation data

            e.app.save(record);
            console.log(`[Sync] Synced role: ${roleData.name}`);
        });

        return e.json(200, { message: "Roles synced successfully", count: roles.length });
    } catch (err) {
        console.error("[Sync] Error syncing roles:", err.message);
        return e.json(500, { error: err.message });
    }
});
