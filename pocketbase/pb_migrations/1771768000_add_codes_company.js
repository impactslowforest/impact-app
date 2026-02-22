/// <reference path="../pb_data/types.d.ts" />

// Migration: Add farmer_code, farm_code, and company_name fields to inbound_requests

migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_681052095") // inbound_requests

  // Add farmer_code text field
  collection.fields.add(new TextField({
    name: "farmer_code",
    max: 50,
    required: false
  }))

  // Add farm_code text field
  collection.fields.add(new TextField({
    name: "farm_code",
    max: 50,
    required: false
  }))

  // Add company_name field
  collection.fields.add(new TextField({
    name: "company_name",
    max: 300,
    required: false
  }))

  return app.save(collection)
}, (app) => {
  // Rollback
  const collection = app.findCollectionByNameOrId("pbc_681052095")

  collection.fields.removeByName("farmer_code")
  collection.fields.removeByName("farm_code")
  collection.fields.removeByName("company_name")

  return app.save(collection)
})
