"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1",
			whereData = [];
		if (req.query.va_id) {
			where += " && va_id=?";
			whereData.push([req.query.va_id]);
		}
		if (req.query.in_id) {
			where += " && in_id=?";
			whereData.push([req.query.in_id]);
		}
		if (req.query.do_id) {
			where += " && do_id=?";
			whereData.push([req.query.do_id]);
		}
		if (req.query.ca_id) {
			where += " && ca_id=?";
			whereData.push([req.query.ca_id]);
		}
		if (req.query.co_id) {
			where += " && co_id=?";
			whereData.push([req.query.co_id]);
		}
		if (req.query.op_id) {
			where += " && op_id=?";
			whereData.push([req.query.op_id]);
		}
		if (req.query.pr_id) {
			where += " && pr_id=?";
			whereData.push([req.query.pr_id]);
		}
		Logs.find(where, whereData).exec((errsql, rows_lg) => {
			Services.sendWebservices(res, { err: null, data: rows_lg });
		});
	}
};
