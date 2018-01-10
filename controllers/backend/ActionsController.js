"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.deleted == "true") where += "";
		else where += " && ac_deleted=0";
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && ac_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		if (req.query.datestart) {
			where += " && ac_call_date>=?";
			whereData.push(req.query.datestart);
		}
		if (req.query.datestop) {
			where += " && ac_call_date<=?";
			whereData.push(req.query.datestop);
		}
		if (req.query.co_id) {
			where += " && co_id_user=?";
			whereData.push(req.query.co_id);
		}
		Actions.find(where + " order by ac_id", whereData)
			.populate("co_id_user")
			.populate("co_id_contact")
			.populate("ac_call_co_id")
			.exec((errsql, rows) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
			});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.ac_id == "-1") {
			let row = Actions.createEmpty();
			row.ac_id = "";
			row.ac_date = new Date();
			Services.smoothContact(req.user, req.user, row_co => {
				row.co_id_user = row_co;
				if (req.query.co_id_contact) {
					Contacts.findOne(req.query.co_id_contact).exec((errsql, row_co_contact) => {
						row.co_id_contact = row_co_contact;
						Services.sendWebservices(res, { err: null, data: row });
					});
				} else Services.sendWebservices(res, { err: null, data: row });
			});
		} else {
			Actions.findOne({ ac_id: req.params.ac_id })
				.populate("co_id_user")
				.populate("co_id_contact")
				.populate("ac_call_co_id")
				.exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					row.ac_ref = row.ac_id;
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
				req.body.ac_updatedCo = req.user.co_id;
				// req.body.ac_createdCo = req.user.co_id ;
				Actions.create(req.body).exec((errsql, row) => {
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
					Actions.findOne({ ac_id: req.params.ac_id }).exec((errsql, _row_pr) => {
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
				req.body.ac_updatedCo = req.user.co_id;
				Actions.update({ ac_id: req.params.ac_id }, req.body).exec((errsql, rows) => {
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
					Actions.findOne({ ac_id: req.params.ac_id }).exec((errsql, _row_pr) => {
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
				Actions.update({ ac_id: req.params.ac_id }, { ac_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
