"use strict";

module.exports = {
	tableName: "va_vacations",

	attributes: {
		va_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		va_start: {
			type: "date",
			index: true
		},
		va_start2: {
			type: "boolean",
			defaultsTo: 0
		},
		va_end: {
			type: "date",
			index: true
		},
		va_end2: {
			type: "boolean",
			defaultsTo: 0
		},
		va_comment: {
			type: "text",
			defaultsTo: ""
		},
		va_comment2: {
			type: "text",
			defaultsTo: ""
		},
		co_id_user: {
			model: "Contacts",
			index: true
		},
		// ag_id: {
		// 	model: "agencies",
		// 	index: true
		// },
		va_type: {
			model: "Lists",
			index: true
		},
		va_status: {
			type: "varchar",
			length: 36,
			defaultsTo: ""
		},

		createdCo: {
			model: "Contacts",
			index: true
		},
		updatedCo: {
			model: "Contacts",
			index: true
		}
	}
};
