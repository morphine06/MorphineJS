"use strict";

module.exports = {
	tableName: "ev_events",

	attributes: {
		ev_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		co_id: {
			model: "Contacts"
		},
		co_id_user: {
			model: "Contacts"
		},
		ev_allday: {
			type: "boolean",
			defaultsTo: 0
		},
		ev_start: {
			type: "datetime",
			defaultsTo: "0000-00-00 00:00:00"
		},
		ev_stop: {
			type: "datetime",
			defaultsTo: "0000-00-00 00:00:00"
		},
		ev_summary: {
			type: "varchar",
			defaultsTo: ""
		},
		ev_description: {
			type: "text",
			defaultsTo: ""
		},
		ev_deleted: {
			type: "boolean",
			defaultsTo: 0
		}
	}
};
