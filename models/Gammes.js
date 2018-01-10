"use strict";

module.exports = {
	tableName: "ga_gammes",

	attributes: {
		ga_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		ga_name: {
			type: "varchar",
			length: 255,
			index: true
		},
		ga_description: {
			type: "text"
		},
		createdCo: {
			model: "Contacts"
		},
		updatedCo: {
			model: "Contacts"
		}
	}
};
