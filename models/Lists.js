"use strict";

// var uuid = require("node-uuid");

module.exports = {
	tableName: "li_lists",

	attributes: {
		li_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		li_activate: {
			type: "boolean",
			defaultsTo: 0,
			index: true
		},
		li_name: {
			type: "string",
			defaultsTo: "",
			index: true
		},
		li_options: {
			type: "text"
		},
		li_group: {
			type: "string",
			defaultsTo: "",
			index: true
		},
		li_position: {
			type: "integer"
		}
	}
};
