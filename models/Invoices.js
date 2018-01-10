"use strict";

module.exports = {
	tableName: "in_invoices",

	attributes: {
		in_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		co_id_contact: {
			model: "Contacts"
		},
		co_id_contact2: {
			model: "Contacts"
		},
		co_id_user: {
			model: "Contacts"
		},
		ad_id_delivery: {
			model: "Addresses"
		},
		ad_id_invoice: {
			model: "Addresses"
		},
		op_id: {
			model: "Opportunities"
		},
		in_type: {
			type: "string",
			defaultsTo: "estimate",
			index: true
		},
		in_object: {
			type: "string",
			defaultsTo: "",
			index: true
		},
		in_num: {
			type: "string",
			defaultsTo: "",
			index: true
		},
		in_shared: {
			type: "boolean",
			defaultsTo: 1
		},
		in_date: {
			type: "date"
		},
		in_address: {
			type: "text",
			defaultsTo: ""
		},
		in_sumremise: {
			type: "decimal"
		},
		in_minorder: {
			type: "integer",
			defaultsTo: 0
		},
		in_conditions: {
			type: "text"
		},
		in_sumht: {
			type: "decimal"
		},
		in_sumttc: {
			type: "decimal"
		},
		in_tvas: {
			type: "json"
		},
		in_devise: {
			type: "integer",
			defaultsTo: 0
		},
		in_usetva: {
			type: "boolean",
			defaultsTo: 1
		},

		in_deleted: {
			type: "boolean",
			defaultsTo: 0
		},
		createdCo: {
			model: "Contacts"
		},
		updatedCo: {
			model: "Contacts"
		}
	}
};
