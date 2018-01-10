"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.deleted == "true") where += "";
		else where += " && op_deleted=0";
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && op_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		if (req.query.datestart) {
			where += " && op_date>=?";
			whereData.push(req.query.datestart);
		}
		if (req.query.datestop) {
			where += " && op_date<=?";
			whereData.push(req.query.datestop);
		}
		if (req.query.co_id) {
			where += " && co_id_user=?";
			whereData.push(req.query.co_id);
		}

		Opportunities.find(where + " order by op_id", whereData)
			.populate("co_id_user")
			.populate("co_id_contact")
			.exec((errsql, rows) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
			});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.op_id == "-1") {
			let row = Opportunities.createEmpty();
			row.op_id = "";
			row.op_date = new Date();
			// Services.smoothContact(req.user, req.user, row_co => {
			row.co_id_user = req.user;
			Services.sendWebservices(res, { err: null, data: row });
			// });
		} else {
			Opportunities.findOne({ op_id: req.params.op_id })
				.populate("co_id_user")
				.populate("co_id_contact")
				.exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					row.op_ref = row.op_id;
					// Services.smoothContact(row.co_id_provider, req.user, () => {
					Services.sendWebservices(res, { err: null, data: row });
					// }) ;
				});
		}
	}
	create_1_0(req, res) {
		async.series(
			[
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.op_updatedCo = req.user.co_id;
				// req.body.op_createdCo = req.user.co_id ;
				Opportunities.create(req.body).exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					Services.sendWebservices(res, { err: null, data: row });
				}, true);
			}
		);
	}
	update_1_0(req, res) {
		let row_pr;

		delete req.body.ga_id;
		async.series(
			[
				nextAllow => {
					Opportunities.findOne({ op_id: req.params.op_id }).exec((errsql, _row_pr) => {
						if (!_row_pr) return nextAllow(Services.err(404));
						row_pr = _row_pr;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_pr)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.op_updatedCo = req.user.co_id;
				Opportunities.update({ op_id: req.params.op_id }, req.body).exec((errsql, rows) => {
					if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					Services.sendWebservices(res, { err: null, data: rows[0] });
				}, true);
			}
		);
	}
	destroy_1_0(req, res) {
		let row_pr;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Opportunities.findOne({ op_id: req.params.op_id }).exec((errsql, _row_pr) => {
						if (!_row_pr) return nextAllow(Services.err(404));
						row_pr = _row_pr;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_pr)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Opportunities.update({ op_id: req.params.op_id }, { op_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
