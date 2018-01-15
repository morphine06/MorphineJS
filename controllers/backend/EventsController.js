"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.deleted == "true") where += "";
		else where += " && ev_deleted=0";
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && ev_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		if (req.query.datestart) {
			where += " && ev_stop>=?";
			whereData.push(req.query.datestart);
		}
		if (req.query.datestop) {
			where += " && ev_start<=?";
			whereData.push(req.query.datestop);
		}
		if (req.query.co_id_user) {
			where += " && co_id_user=?";
			whereData.push(req.query.co_id_user);
		}
		// console.log("where,whereData", where, whereData);
		Events.find(where + " order by ev_id", whereData)
			.populate("co_id_user")
			.populate("co_id_contact")
			.exec((errsql, rows) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
			});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.ev_id == "-1") {
			let row = Events.createEmpty();
			row.ev_id = "";
			row.ev_date = new Date();
			// Services.smoothContact(req.user, req.user, row_co => {
			row.co_id_user = req.user;
			Services.sendWebservices(res, { err: null, data: row });
			// });
		} else {
			Events.findOne({ ev_id: req.params.ev_id })
				.populate("co_id_user")
				.populate("co_id_contact")
				.exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					row.ev_ref = row.ev_id;
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
				req.body.co_id_user = req.user.co_id;
				Events.create(req.body).exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					Services.sendWebservices(res, { err: null, data: row });
				}, true);
			}
		);
	}
	update_1_0(req, res) {
		let row_ev;

		delete req.body.co_id_user;
		async.series(
			[
				nextAllow => {
					Events.findOne({ ev_id: req.params.ev_id }).exec((errsql, _row_ev) => {
						if (!_row_ev) return nextAllow(Services.err(404));
						row_ev = _row_ev;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_ev)) return nextAllow(Services.err(403));
					nextAllow();
				},
				nextAllow => {
					req.body.ev_updatedCo = req.user.co_id;
					Events.update({ ev_id: req.params.ev_id }, req.body).exec((errsql, rows) => {
						row_ev = rows[0];
						nextAllow();
					}, true);
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, data: row_ev });
			}
		);
	}
	destroy_1_0(req, res) {
		let row_ev;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Events.findOne({ ev_id: req.params.ev_id }).exec((errsql, _row_ev) => {
						if (!_row_ev) return nextAllow(Services.err(404));
						row_ev = _row_ev;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_ev)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Events.update({ ev_id: req.params.ev_id }, { ev_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
