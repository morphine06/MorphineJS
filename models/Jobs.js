"use strict";

module.exports = {
	tableName: "jobs",
	deleteCascade: true,
	attributes: {
		jo_id: {
			primary: true,
			type: "int",
			autoincrement: true
		},
		jo_name: {
			type: "varchar"
		},
		jt_id: {
			model: "JobsTypes"
		}
	}
};
