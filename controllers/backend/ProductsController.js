"use strict";

var BaseController = require("../BaseController");

var fs = require("fs-extra"),
	path = require("path");

module.exports = class extends BaseController {
	file_1_0(req, res) {
		Products.findOne({ pr_id: req.params.pr_id }).exec((errsql, row_pr) => {
			if (!row_pr) return Services.sendWebservices(res, { err: Services.err(404, req.headers["x-accept-language"]) });

			let ext = path.extname(row_pr["pr_media" + req.params.num]);
			let dirDocs = morphineserver.rootDir + "/uploads";
			let dest = dirDocs + "/" + req.params.pr_id + "_" + req.params.num + ext;
			fs.ensureDirSync(dirDocs);

			if (!fs.existsSync(dest)) return Services.sendWebservices(res, { err: Services.err(404, req.headers["x-accept-language"]) });

			let mt = "image/" + ext.substring(1, ext.length);
			if (req.params.num == 3) {
				// dest = morphineserver.rootDir + "/assets/images/iconePdf.png";
				mt = "application/pdf";
			}

			var stat = fs.statSync(dest);
			res.writeHead(200, {
				"Cache-Control": "max-age=" + 3600 * 24 * 360,
				"Last-Modified": new Date(),
				"Content-Type": mt,
				"Content-Length": stat.size
			});
			var readStream = fs.createReadStream(dest);
			readStream.pipe(res);
		});
	}
	savefile_1_0(req, res) {
		// console.log("savefile");
		// var im = require("imagemagick");
		let row_pr;
		req.file("pr_media" + req.params.num + "_send").upload(
			{
				maxBytes: 100000000
			},
			(err, uploadedFiles) => {
				// console.log("err", err);
				if (err || uploadedFiles.length === 0) return Services.sendWebservices(res, { err: "erreurrrr" });

				// console.log("uploadedFiles[0]",uploadedFiles[0]);
				// let fn = path.basename(uploadedFiles[0].fd);
				let ext = path.extname(uploadedFiles[0].fd);
				let dirDocs = morphineserver.rootDir + "/uploads";
				let dest = dirDocs + "/" + req.params.pr_id + "_" + req.params.num + ext;
				// let destthumbnail = dirDocs + "/" + req.params.do_id + "_thumb.png";
				fs.ensureDirSync(dirDocs);

				async.series(
					[
						// nextAllow => {
						// 	Documents.findOne({ do_id: req.params.do_id }).exec((errsql, row_do) => {
						// 		if (!row_do) return nextAllow(Services.err(404, req.headers["x-accept-language"]));
						// 		nextAllow();
						// 	});
						// },
						nextAllow => {
							Services.renameSyncPatch(uploadedFiles[0].fd, dest);
							let dataTemp = {};
							dataTemp["pr_media" + req.params.num] = uploadedFiles[0].filename;
							Products.update({ pr_id: req.params.pr_id }, dataTemp).exec((errsql, rows_pr) => {
								row_pr = rows_pr[0];
								nextAllow();
							}, true);
						}
					],
					err => {
						if (err) return Services.sendWebservices(res, { err: err });
						Services.sendWebservices(res, { err: null, data: row_pr });
					}
				);
			}
		);
	}
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.deleted == "true") where += "";
		else where += " && pr_deleted=0";
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && (pr_id like ? || t2.ga_name like ?)";
			whereData.push("%" + req.query.contains + "%", "%" + req.query.contains + "%");
		}
		if (req.query.ga_id) {
			where += " && t1.ga_id like ?";
			whereData.push("" + req.query.ga_id + "");
		}
		// console.log("where,whereData", where, whereData);
		Products.find(where + " order by pr_id", whereData)
			// .populate("ga_id")
			// .populate('pr_createdCo')
			.exec((errsql, rows_pr) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: rows_pr, meta: { total: rows_pr.length } });
			});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.pr_id == "-1") {
			let row = Products.createEmpty();
			row.pr_id = "";
			row.pr_type = "";
			Services.sendWebservices(res, { err: null, data: row });
		} else {
			Products.findOne({ pr_id: req.params.pr_id })
				// .populate('co_id_provider')
				.exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					row.pr_ref = row.pr_id;
					// Services.smoothContact(row.co_id_provider, req.user, () => {
					Services.sendWebservices(res, { err: null, data: row });
					// }) ;
				});
		}
	}
	create_1_0(req, res) {
		let row_pr;
		req.body.createdCo = req.user.co_id;
		req.body.updatedCo = req.user.co_id;
		async.series(
			[
				// nextAllow => {
				// 	if (!Policies.allowProductCreate(req.user)) return nextAllow(Services.err(403));
				// 	nextAllow();
				// },
				nextAllow => {
					// req.body.pr_id = req.body.pr_ref;
					// req.body.pr_updatedCo = req.user.co_id;
					// req.body.pr_createdCo = req.user.co_id ;
					// console.log("req.body", req.body);
					if (req.body.pr_media1_del) req.body.pr_media1 = "";
					if (req.body.pr_media2_del) req.body.pr_media2 = "";
					if (req.body.pr_media3_del) req.body.pr_media3 = "";
					Products.create(req.body).exec((errsql, _row_pr) => {
						row_pr = _row_pr;
						nextAllow();
					}, true);
				},
				nextAllow => {
					Logs.create({ co_id_user: req.user.co_id, pr_id: row_pr.pr_id, lg_type: "product_created" }).exec((errsql, _row_hi) => {
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, data: row_pr });
			}
		);
	}
	update_1_0(req, res) {
		// let row_pr;

		delete req.body.ga_id;
		req.body.updatedCo = req.user.co_id;
		async.series(
			[
				nextAllow => {
					Products.findOne({ pr_id: req.params.pr_id }).exec((errsql, _row_pr) => {
						if (!_row_pr) return nextAllow(Services.err(404));
						// row_pr = _row_pr;
						nextAllow();
					});
				},
				nextAllow => {
					Logs.create({ co_id_user: req.user.co_id, pr_id: req.params.pr_id, lg_type: "product_updated" }).exec((errsql, _row_hi) => {
						nextAllow();
					});
				}

				// nextAllow => {
				// 	if (!Policies.allowProductUpdate(req.user, row_pr)) return nextAllow(Services.err(403));
				// 	nextAllow();
				// }
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.pr_updatedCo = req.user.co_id;
				if (req.body.pr_media1_del) req.body.pr_media1 = "";
				if (req.body.pr_media2_del) req.body.pr_media2 = "";
				if (req.body.pr_media3_del) req.body.pr_media3 = "";
				Products.update({ pr_id: req.params.pr_id }, req.body).exec((errsql, rows) => {
					if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					Services.sendWebservices(res, { err: null, data: rows[0] });
				}, true);
			}
		);
	}
	destroy_1_0(req, res) {
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Products.findOne({ pr_id: req.params.pr_id }).exec((errsql, _row_pr) => {
						if (!_row_pr) return nextAllow(Services.err(404));
						// row_pr = _row_pr;
						nextAllow();
					});
				},
				// nextAllow => {
				// 	if (!Policies.allowProductDestroy(req.user, row_pr)) return nextAllow(Services.err(403));
				// 	nextAllow();
				// }
				nextAllow => {
					Products.update({ pr_id: req.params.pr_id }, { pr_deleted: deleted }).exec((errsql, row) => {
						nextAllow();
					});
				},
				nextAllow => {
					Logs.create({ co_id_user: req.user.co_id, pr_id: req.params.pr_id, lg_type: "product_deleted" }).exec((errsql, _row_hi) => {
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, success: true });
			}
		);
	}
};
