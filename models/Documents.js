"use strict";

// var uuid = require("node-uuid");

module.exports = {
	tableName: "do_documents",

	attributes: {
		do_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		do_name: {
			type: "string",
			defaultsTo: "",
			index: true
		},
		// do_options: {
		// 	type: "text"
		// },
		// do_group: {
		// 	type: "string",
		// 	defaultsTo: "",
		// 	index: true
		// },
		co_id: {
			model: "Contacts"
		},
		do_createdCo: {
			model: "Contacts"
		},
		do_updatedCo: {
			model: "Contacts"
		},
		do_deleted: {
			type: "boolean",
			defaultsTo: 0,
			index: true
		}
	}
};
