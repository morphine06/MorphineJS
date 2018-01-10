"use strict";

var uuid = require("node-uuid");

module.exports = {
	tableName: "op_opportunities",

	attributes: {
		op_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		co_id_user: {
			model: "Contacts"
		},
		co_id_contact: {
			model: "Contacts"
		},
		op_name: {
			type: "string",
			limit: 255,
			defaultsTo: ""
		},
		op_price: {
			type: "decimal",
			defaultsTo: 0
		},
		op_state: {
			type: "integer",
			defaultsTo: 0
		},
		op_date: {
			type: "date"
		},
		op_text: {
			type: "text"
		},
		op_deleted: {
			type: "boolean",
			defaultsTo: 0
		},
		op_share: {
			type: "boolean",
			defaultsTo: 1
		}
	}
};
