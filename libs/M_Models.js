"use strict";

var _ = require("lodash");
// var async = require('async');

module.exports = class {
	constructor(knex, def) {
		this.knexobj = knex;
	}
	definition() {
		return {
			name: ""
		};
	}
	knex() {
		var def = this.definition();
		return this.knexobj(def.name);
	}
	populate(rows, tableId) {
		// console.log("morphineserver.models",morphineserver.models);
		var def = morphineserver.models[tableId].definition();
		// console.log("def",def);
		_.each(rows, row => {
			var obj = {};
			_.each(row, (rowDef, rowName) => {
				_.each(def.fields, (fieldDef, fieldName) => {
					if (fieldName == rowName) {
						obj[fieldName] = row[fieldName];
						delete row[fieldName];
					}
				});
			});
			row[def.primary] = obj;
			// console.log("obj",obj);
		});
	}
};
