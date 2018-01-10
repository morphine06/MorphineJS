"use strict";

module.exports = {
	tableName: "cc_contactscontacts",

	attributes: {
		cc_id: {
			type: "integer",
			autoincrement: true,
			primary: true
			// unique: true
		},
		co_id1: {
			model: "Contacts"
		},
		co_id2: {
			model: "Contacts"
		}
	}
};
