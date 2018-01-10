"use strict";

module.exports = {
	// beforeCreate: function(values, next) {
	//     procedePassword(values, next) ;
	// },
	// beforeUpdate: function(values, next) {
	//     procedePassword(values, next) ;
	// },

	tableName: "pr_products",

	attributes: {
		pr_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		ga_id: {
			model: "Gammes"
		},
		pr_code: {
			type: "varchar",
			length: 50,
			index: true
		},
		pr_name: {
			type: "varchar",
			length: 255,
			index: true
		},
		pr_description: {
			type: "text"
		},
		pr_quantitybox: {
			type: "integer",
			defaultsTo: 0
		},
		co_id_provider: {
			type: "varchar",
			index: true
		},
		pr_refprovider: {
			type: "varchar",
			length: 50,
			index: true
		},

		pr_marge: {
			type: "decimal"
			// length: 30,
		},
		pr_pricebuy: {
			type: "decimal",
			defaultsTo: 0
		},
		pr_puht: {
			type: "decimal",
			defaultsTo: 0
		},

		pr_comment: {
			type: "varchar",
			length: 255,
			index: true
		},
		pr_deleted: {
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
