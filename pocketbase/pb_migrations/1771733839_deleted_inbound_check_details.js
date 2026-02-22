/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3093224700");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2459255833",
        "max": 80,
        "min": 0,
        "name": "check_code",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_681052095",
        "hidden": false,
        "id": "relation4221156607",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "inbound_request",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2469894242",
        "hidden": false,
        "id": "relation2589569772",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "inbound_detail",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3601257007",
        "hidden": false,
        "id": "relation1477890117",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "farm",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3576983211",
        "max": 60,
        "min": 0,
        "name": "lot_detail_code",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1114567570",
        "max": 50,
        "min": 0,
        "name": "staff",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "date1327383547",
        "max": "",
        "min": "",
        "name": "check_date",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "number3045971753",
        "max": null,
        "min": null,
        "name": "moisture_pct",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number944073731",
        "max": null,
        "min": null,
        "name": "total_bag_weight_kg",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number3362005187",
        "max": null,
        "min": 0,
        "name": "number_of_bags",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number629317863",
        "max": null,
        "min": null,
        "name": "weight_per_bag_kg",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3788167225",
        "max": 0,
        "min": 0,
        "name": "remark",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select1400097126",
        "maxSelect": 0,
        "name": "country",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "indonesia",
          "vietnam",
          "laos"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4041497513",
        "max": 20,
        "min": 0,
        "name": "season",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3093224700",
    "indexes": [
      "CREATE UNIQUE INDEX idx_icd_check_code ON inbound_check_details (check_code)"
    ],
    "listRule": "@request.auth.id != \"\"",
    "name": "inbound_check_details",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
})
