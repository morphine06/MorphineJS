"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && li_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		Lists.find(where + " order by li_group, li_position, li_name", whereData).exec((errsql, rows) => {
			if (errsql) console.warn("errsql", errsql);
			Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
		});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.li_id == "-1") {
			let row = Lists.createEmpty();
			row.li_id = "";
			row.li_date = new Date();
			Services.smoothContact(req.user, req.user, row_co => {
				Services.sendWebservices(res, { err: null, data: row });
			});
		} else {
			Lists.findOne({ li_id: req.params.li_id }).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
				Services.sendWebservices(res, { err: null, data: row });
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
				req.body.li_updatedCo = req.user.co_id;
				req.body.li_createdCo = req.user.co_id;
				Lists.create(req.body).exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					Services.sendWebservices(res, { err: null, data: row });
				}, true);
			}
		);
	}
	update_1_0(req, res) {
		let row_li;

		delete req.body.ga_id;
		async.series(
			[
				nextAllow => {
					Lists.findOne({ li_id: req.params.li_id }).exec((errsql, _row_li) => {
						if (!_row_li) return nextAllow(Services.err(404));
						row_li = _row_li;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_li)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.li_updatedCo = req.user.co_id;
				Lists.update({ li_id: req.params.li_id }, req.body).exec((errsql, rows) => {
					if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					Services.sendWebservices(res, { err: null, data: rows[0] });
				}, true);
			}
		);
	}
	destroy_1_0(req, res) {
		let row_li;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Lists.findOne({ li_id: req.params.li_id }).exec((errsql, _row_li) => {
						if (!_row_li) return nextAllow(Services.err(404));
						row_li = _row_li;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_li)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Lists.update({ li_id: req.params.li_id }, { li_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
