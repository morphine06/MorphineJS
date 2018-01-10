"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	load_1_0(req, res) {
		var fs = require("fs-extra"),
			path = require("path"),
			uploadPathDir = morphineserver.rootDir + path.sep + "uploads" + path.sep + "documents";
		Documents.findOne({ do_id: req.params.do_id, "t1.do_deleted": false }).exec((errsql, row_do) => {
			if (!row_do) return Services.sendWebservices(res, { err: Services.err(404, req) });

			let ext = path.extname(row_do.do_name);
			let dest = uploadPathDir + "/" + req.params.do_id + ext;
			fs.ensureDirSync(uploadPathDir);
			// console.log("dest", dest);

			if (!fs.existsSync(dest)) return res.send(404);

			var stat = fs.statSync(dest);
			res.writeHead(200, {
				"Cache-Control": "max-age=" + 3600 * 24 * 360,
				"Last-Modified": new Date(),
				// "Content-Type": row_do.do_filetype,
				"Content-Length": stat.size
			});
			var readStream = fs.createReadStream(dest);
			readStream.pipe(res);
		});
	}
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && do_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		Documents.find(where + " order by do_group, do_position, do_name", whereData).exec((errsql, rows) => {
			if (errsql) console.warn("errsql", errsql);
			Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
		});
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.do_id == "-1") {
			let row = Documents.createEmpty();
			row.do_id = "";
			row.do_date = new Date();
			Services.smoothContact(req.user, req.user, row_co => {
				Services.sendWebservices(res, { err: null, data: row });
			});
		} else {
			Documents.findOne({ do_id: req.params.do_id }).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
				Services.sendWebservices(res, { err: null, data: row });
			});
		}
	}
	create_1_0(req, res) {
		var fs = require("fs-extra"),
			path = require("path"),
			uploadPathDir = morphineserver.rootDir + path.sep + "uploads" + path.sep + "documents",
			row_do;
		req.file("do_file").upload(
			{
				maxBytes: 10000000
			},
			(err, uploadedFiles) => {
				if (err) return Services.sendWebservices(res, { err: err });
				// let fn = path.basename(uploadedFiles[0].fd);
				let ext = path.extname(uploadedFiles[0].fd);
				// console.log("uploadedFiles[0].fd,next", uploadedFiles[0].fd);

				async.series(
					[
						nextAllow => {
							req.body.do_updatedCo = req.user.co_id;
							req.body.do_createdCo = req.user.co_id;
							Documents.create({
								co_id: req.body.co_id,
								do_name: path.basename(uploadedFiles[0].fd)
							}).exec((errsql, _row) => {
								row_do = _row;
								if (errsql) console.warn("errsql", errsql);
								nextAllow();
							}, true);
						},
						nextAllow => {
							if (!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
							fs.renameSync(uploadedFiles[0].fd, uploadPathDir + path.sep + row_do.do_id + ext);
							// console.log("uploadPathDir + row_do.do_id + ext", uploadPathDir + path.sep + row_do.do_id + ext);
							nextAllow();
						}
					],
					err => {
						if (err) return Services.sendWebservices(res, { err: err });
						Services.sendWebservices(res, { err: null, data: row_do });
					}
				);
			}
		);
	}
	// update_1_0(req, res) {
	// 	let row_li;

	// 	delete req.body.ga_id;
	// 	async.series(
	// 		[
	// 			nextAllow => {
	// 				Documents.findOne({ do_id: req.params.do_id }).exec((errsql, _row_li) => {
	// 					if (!_row_li) return nextAllow(Services.err(404));
	// 					row_li = _row_li;
	// 					nextAllow();
	// 				});
	// 			},
	// 			nextAllow => {
	// 				if (!Policies.allowAlreadyTrue(req.user, row_li)) return nextAllow(Services.err(403));
	// 				nextAllow();
	// 			}
	// 		],
	// 		err => {
	// 			if (err) return Services.sendWebservices(res, { err: err });
	// 			req.body.do_updatedCo = req.user.co_id;
	// 			Documents.update({ do_id: req.params.do_id }, req.body).exec((errsql, rows) => {
	// 				if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
	// 				Services.sendWebservices(res, { err: null, data: rows[0] });
	// 			}, true);
	// 		}
	// 	);
	// }
	destroy_1_0(req, res) {
		let row_li;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Documents.findOne({ do_id: req.params.do_id }).exec((errsql, _row_li) => {
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
				Documents.update({ do_id: req.params.do_id }, { do_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
};
