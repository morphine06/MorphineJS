"use strict";

// var uuid = require("node-uuid");

module.exports = {
	tableName: "lg_logs",

	attributes: {
		lg_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		co_id_user: {
			model: "Contacts"
		},
		op_id: {
			model: "Opportunities"
		},
		in_id: {
			model: "Invoices"
		},
		va_id: {
			model: "Vacations"
		},
		co_id: {
			model: "Contacts"
		},
		ca_id: {
			model: "Campaigns"
		},
		do_id: {
			model: "Documents"
		},
		pr_id: {
			model: "Products"
		},
		lg_type: {
			type: "varchar",
			length: 36,
			index: true
		}
	}
};
