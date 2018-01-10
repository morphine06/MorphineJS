"use strict";

var uuid = require("node-uuid");

module.exports = {
	tableName: "ad_addresses",

	attributes: {
		ad_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		co_id: {
			model: "Contacts"
		},
		ad_label: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_address1: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_address2: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_address3: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_zip: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_city: {
			type: "varchar",
			defaultsTo: ""
		},
		ad_country: {
			type: "varchar",
			defaultsTo: "France"
		},
		ad_deleted: {
			type: "boolean"
		}
	}
};
