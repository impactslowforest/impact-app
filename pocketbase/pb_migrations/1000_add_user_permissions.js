migrate((app) => {
    const collection = app.findCollectionByNameOrId("users");

    collection.fields.add(new JSONField({
        name: "permissions",
        required: false,
        system: false,
    }));

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("users");
    collection.fields.removeByName("permissions");
    app.save(collection);
});
