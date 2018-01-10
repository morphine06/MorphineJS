"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "ad_deleted=0",
			whereData = [];
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && ad_label like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		if (req.query.co_id) {
			where += " && co_id=?";
			whereData.push(req.query.co_id);
		}
		Addresses.find(where + " order by ad_label", whereData).exec((errsql, rows) => {
			if (errsql) console.warn("errsql", errsql);
			Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
		});
	}
	loadtemplate_1_0(req, res) {
		let fs = require("fs");
		let data = fs.readFileSync(morphineserver.rootDir + "/views/backend/mailinglist_template1.html");
		res.send(data);
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.ad_id == "-1") {
			let row = Addresses.createEmpty();
			row.ad_id = "";
			row.co_id = req.query.co_id;
			Services.sendWebservices(res, { err: null, data: row });
		} else {
			Addresses.findOne({ ad_id: req.params.ad_id }).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
				Services.sendWebservices(res, { err: null, data: row });
			});
		}
	}
	create_1_0(req, res) {
		async.series([], err => {
			if (err) return Services.sendWebservices(res, { err: err });
			req.body.ad_updatedCo = req.user.co_id;
			req.body.ad_createdCo = req.user.co_id;
			Addresses.create(req.body).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: row });
			}, true);
		});
	}
	update_1_0(req, res) {
		// let row_ad;

		delete req.body.ga_id;
		async.series(
			[
				nextAllow => {
					Addresses.findOne({ ad_id: req.params.ad_id }).exec((errsql, _row_ad) => {
						if (!_row_ad) return nextAllow(Services.err(404));
						// row_ad = _row_ad;
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.ad_updatedCo = req.user.co_id;
				Addresses.update({ ad_id: req.params.ad_id }, req.body).exec((errsql, rows) => {
					if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					Services.sendWebservices(res, { err: null, data: rows[0] });
				}, true);
			}
		);
	}
	destroy_1_0(req, res) {
		// let row_ad;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Addresses.findOne({ ad_id: req.params.ad_id }).exec((errsql, _row_ad) => {
						if (!_row_ad) return nextAllow(Services.err(404));
						// row_ad = _row_ad;
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Addresses.update({ ad_id: req.params.ad_id }, { ad_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
