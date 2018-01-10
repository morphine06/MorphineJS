"use strict";

// var uuid = require("node-uuid");

module.exports = {
	tableName: "ac_opportunities",

	attributes: {
		ac_id: {
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
		op_id: {
			model: "Opportunities"
		},
		in_id: {
			model: "Invoices"
		},
		ac_type: {
			type: "varchar",
			length: 36,
			index: true
		},
		ac_call_date: {
			type: "datetime",
			index: true
		},
		ac_call_result: {
			type: "integer",
			defaultsTo: 0
		},
		ac_call_co_id: {
			model: "Contacts"
		},
		ac_call_recalldate: {
			type: "datetime",
			index: true
		},
		ac_call_text: {
			type: "text"
		},
		ac_mail_subject: {
			type: "varchar",
			length: 255
		},
		ac_mail_text: {
			type: "text"
		},

		ac_deleted: {
			type: "boolean",
			defaultsTo: 0
		},
		ac_share: {
			type: "boolean",
			defaultsTo: 1
		}
	}
};
