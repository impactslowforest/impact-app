/// <reference path="../pb_data/types.d.ts" />

// Migration: Create RBAC collections for PocketBase v0.36+
// Pattern: create collection -> find it -> add fields -> save

migrate(
  (app) => {
    // === 1. Permissions Collection ===
    const permCol = new Collection({ name: "permissions", type: "base" });
    app.save(permCol);

    const permissions = app.findCollectionByNameOrId("permissions");
    permissions.fields.add(new TextField({ name: "name", required: true, min: 1, max: 200 }));
    permissions.fields.add(new TextField({ name: "module", required: true }));
    permissions.fields.add(new TextField({ name: "action", required: true }));
    permissions.fields.add(new TextField({ name: "description" }));
    permissions.fields.add(new SelectField({
      name: "country_scope",
      required: true,
      values: ["laos", "indonesia", "vietnam", "global", "all"],
    }));
    permissions.indexes = ["CREATE UNIQUE INDEX idx_perm_name ON permissions (name)"];
    permissions.listRule = '@request.auth.id != ""';
    permissions.viewRule = '@request.auth.id != ""';
    permissions.createRule = '@request.auth.id != ""';
    permissions.updateRule = '@request.auth.id != ""';
    permissions.deleteRule = '@request.auth.id != ""';
    app.save(permissions);

    // === 2. Roles Collection ===
    const roleCol = new Collection({ name: "roles", type: "base" });
    app.save(roleCol);

    const roles = app.findCollectionByNameOrId("roles");
    roles.fields.add(new TextField({ name: "name", required: true, min: 1, max: 100 }));
    roles.fields.add(new JSONField({ name: "display_name", required: true }));
    roles.fields.add(new TextField({ name: "description" }));
    roles.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["laos", "indonesia", "vietnam", "global", "all"],
    }));
    roles.fields.add(new BoolField({ name: "is_system" }));
    roles.fields.add(new RelationField({
      name: "permissions",
      collectionId: permissions.id,
      maxSelect: 999,
    }));
    roles.indexes = ["CREATE UNIQUE INDEX idx_role_name ON roles (name)"];
    roles.listRule = '@request.auth.id != ""';
    roles.viewRule = '@request.auth.id != ""';
    roles.createRule = '@request.auth.id != ""';
    roles.updateRule = '@request.auth.id != ""';
    roles.deleteRule = '@request.auth.id != ""';
    app.save(roles);

    // === 3. Module Registry Collection ===
    const modCol = new Collection({ name: "module_registry", type: "base" });
    app.save(modCol);

    const moduleRegistry = app.findCollectionByNameOrId("module_registry");
    moduleRegistry.fields.add(new TextField({ name: "key", required: true, min: 1, max: 200 }));
    moduleRegistry.fields.add(new JSONField({ name: "name", required: true }));
    moduleRegistry.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["laos", "indonesia", "vietnam", "global"],
    }));
    moduleRegistry.fields.add(new TextField({ name: "parent_key" }));
    moduleRegistry.fields.add(new NumberField({ name: "sort_order", min: 0 }));
    moduleRegistry.fields.add(new TextField({ name: "icon" }));
    moduleRegistry.fields.add(new TextField({ name: "route_path" }));
    moduleRegistry.fields.add(new BoolField({ name: "is_active" }));
    moduleRegistry.indexes = ["CREATE UNIQUE INDEX idx_module_key ON module_registry (key)"];
    moduleRegistry.listRule = '@request.auth.id != ""';
    moduleRegistry.viewRule = '@request.auth.id != ""';
    moduleRegistry.createRule = '@request.auth.id != ""';
    moduleRegistry.updateRule = '@request.auth.id != ""';
    moduleRegistry.deleteRule = '@request.auth.id != ""';
    app.save(moduleRegistry);

    // === 4. Update Users Collection (add custom fields) ===
    const users = app.findCollectionByNameOrId("users");
    users.fields.add(new TextField({ name: "phone" }));
    users.fields.add(new SelectField({
      name: "country",
      required: true,
      values: ["laos", "indonesia", "vietnam", "global"],
    }));
    users.fields.add(new TextField({ name: "department" }));
    users.fields.add(new TextField({ name: "designation" }));
    users.fields.add(new SelectField({
      name: "status",
      required: true,
      values: ["pending", "active", "suspended", "rejected"],
    }));
    users.fields.add(new RelationField({
      name: "approved_by",
      collectionId: users.id,
      maxSelect: 1,
    }));
    users.fields.add(new DateField({ name: "approved_at" }));
    users.fields.add(new RelationField({
      name: "role",
      collectionId: roles.id,
      maxSelect: 1,
    }));
    users.fields.add(new SelectField({
      name: "language_pref",
      values: ["en", "vi", "lo", "id"],
    }));
    users.fields.add(new DateField({ name: "last_login" }));
    app.save(users);

    // === 5. Audit Trail Collection ===
    const auditCol = new Collection({ name: "audit_trail", type: "base" });
    app.save(auditCol);

    const auditTrail = app.findCollectionByNameOrId("audit_trail");
    auditTrail.fields.add(new RelationField({ name: "user", required: true, collectionId: users.id, maxSelect: 1 }));
    auditTrail.fields.add(new TextField({ name: "collection_name", required: true }));
    auditTrail.fields.add(new TextField({ name: "record_id", required: true }));
    auditTrail.fields.add(new SelectField({ name: "action", required: true, values: ["create", "update", "delete"] }));
    auditTrail.fields.add(new JSONField({ name: "old_data" }));
    auditTrail.fields.add(new JSONField({ name: "new_data" }));
    auditTrail.fields.add(new TextField({ name: "ip_address" }));
    auditTrail.fields.add(new TextField({ name: "user_agent" }));
    auditTrail.indexes = [
      "CREATE INDEX idx_audit_user ON audit_trail (user)",
      "CREATE INDEX idx_audit_collection ON audit_trail (collection_name)",
      "CREATE INDEX idx_audit_record ON audit_trail (record_id)",
    ];
    auditTrail.listRule = '@request.auth.id != ""';
    auditTrail.viewRule = '@request.auth.id != ""';
    app.save(auditTrail);

    // === 6. Chatbot Conversations Collection ===
    const chatCol = new Collection({ name: "chatbot_conversations", type: "base" });
    app.save(chatCol);

    const chatbot = app.findCollectionByNameOrId("chatbot_conversations");
    chatbot.fields.add(new RelationField({ name: "user", required: true, collectionId: users.id, maxSelect: 1 }));
    chatbot.fields.add(new JSONField({ name: "messages", required: true }));
    chatbot.fields.add(new TextField({ name: "context" }));
    chatbot.fields.add(new TextField({ name: "title" }));
    chatbot.listRule = '@request.auth.id != ""';
    chatbot.viewRule = '@request.auth.id != ""';
    chatbot.createRule = '@request.auth.id != ""';
    chatbot.updateRule = '@request.auth.id != ""';
    chatbot.deleteRule = '@request.auth.id != ""';
    app.save(chatbot);
  },
  (app) => {
    // Rollback
    try { app.delete(app.findCollectionByNameOrId("chatbot_conversations")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("audit_trail")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("module_registry")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("roles")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("permissions")); } catch(e) {}
  }
);
