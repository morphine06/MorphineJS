"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1",
			whereData = [];
		if (req.query.va_id) {
			where += " && t1.va_id=?";
			whereData.push([req.query.va_id]);
		}
		if (req.query.in_id) {
			where += " && t1.in_id=?";
			whereData.push([req.query.in_id]);
		}
		if (req.query.do_id) {
			where += " && t1.do_id=?";
			whereData.push([req.query.do_id]);
		}
		if (req.query.ca_id) {
			where += " && t1.ca_id=?";
			whereData.push([req.query.ca_id]);
		}
		if (req.query.co_id) {
			where += " && t1.co_id=?";
			whereData.push([req.query.co_id]);
		}
		if (req.query.op_id) {
			where += " && t1.op_id=?";
			whereData.push([req.query.op_id]);
		}
		if (req.query.pr_id) {
			where += " && t1.pr_id=?";
			whereData.push([req.query.pr_id]);
		}
		Logs.find(where, whereData)
			.populate("co_id_user")
			.populate("va_id")
			.populate("in_id")
			.populate("do_id")
			.populate("pr_id")
			.populate("ca_id")
			.populate("co_id")
			.exec((errsql, rows_lg) => {
				Services.sendWebservices(res, { err: null, data: rows_lg });
			});
	}
};
