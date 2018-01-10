"use strict";

module.exports = {
	tableName: "in_invoiceslines",

	attributes: {
		il_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		in_id: {
			model: "Invoices"
		},
		pr_id: {
			model: "Products"
		},
		pr_name: {
			type: "string",
			index: true
		},
		il_sumttc: {
			type: "decimal",
			defaultsTo: 0
		},
		il_sumht: {
			type: "decimal",
			defaultsTo: 0
		},
		il_puht: {
			type: "decimal",
			defaultsTo: 0
		},
		il_paht: {
			type: "decimal",
			defaultsTo: 0
		},
		il_remise: {
			type: "decimal",
			defaultsTo: 0
		},
		il_remisepurcent: {
			type: "boolean",
			defaultsTo: 0
		},
		il_tva: {
			type: "decimal",
			defaultsTo: 0
		},
		il_qte: {
			type: "decimal",
			defaultsTo: 0
		},
		il_description: {
			type: "text"
		}
	}
};
