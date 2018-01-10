"use strict";

module.exports = {
	tableName: "ca_campaigns",

	attributes: {
		ca_id: {
			type: "integer",
			autoincrement: true,
			primary: true
			// unique: true
		},
		ca_type: {
			type: "string",
			defaultsTo: "mailinglist"
		},
		ca_name: {
			type: "string",
			defaultsTo: ""
		},
		ca_mail_text: {
			type: "text"
		},
		ca_mail_test: {
			type: "string",
			defaultsTo: ""
		},
		ca_mail_template: {
			type: "string",
			defaultsTo: ""
		},
		ca_nbsended: {
			type: "integer",
			defaultsTo: 0
		},
		ca_deleted: {
			type: "boolean",
			defaultsTo: 0
		}
	}
};
