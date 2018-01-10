"use strict";

var BaseController = require("../BaseController");

function filterContacts(req, cb) {
	var where = "";
	var whereData = [];
	var tabFieldsOr = [
		"co_name",
		"co_firstname",
		"co_function",
		"co_society",
		"co_code",
		"co_login",
		"co_email1",
		"co_email2",
		"co_email3",
		"co_tel1",
		"co_tel2",
		"co_tel3",
		"co_fax1",
		"co_fax2",
		"co_fax3",
		"co_mobile1",
		"co_mobile2",
		"co_mobile3",
		"co_web1",
		"co_web2",
		"co_web3"
	];
	if (req.query.query && req.query.query !== "") {
		where += " && (";
		_.each(tabFieldsOr, field => {
			where += field + " like ? || ";
			whereData.push("%" + req.query.query + "%");
		});
		where += " 0)";
	}
	_.each(tabFieldsOr, field => {
		if (req.query[field] && req.query[field] !== "") {
			if (field == "co_email1" || field == "co_tel1" || field == "co_fax1" || field == "co_mobile1" || field == "co_web1") {
				if (field == "co_email1") where += " && (co_email1 like ? || co_email2 like ? || co_email3 like ?)";
				if (field == "co_tel1") where += " && (co_tel1 like ? || co_tel2 like ? || co_tel3 like ?)";
				if (field == "co_fax1") where += " && (co_fax1 like ? || co_fax2 like ? || co_fax3 like ?)";
				if (field == "co_mobile1") where += " && (co_mobile1 like ? || co_mobile2 like ? || co_mobile3 like ?)";
				if (field == "co_web1") where += " && (co_web1 like ? || co_web2 like ? || co_web3 like ?)";
				whereData.push("%" + req.query[field] + "%", "%" + req.query[field] + "%", "%" + req.query[field] + "%");
			} else {
				where += " && " + field + " like ?";
				whereData.push("%" + req.query[field] + "%");
			}
		}
	});

	if (req.query.types && _.isArray(req.query.types)) {
		where += " && (0";
		_.each(req.query.types, mytype => {
			where += " || co_type=?";
			whereData.push(mytype);
		});
		where += ")";
	}

	if (req.query.gr_id == "-2") {
		where += " && co_type!='contact' && co_type!='society'";
	}
	if (req.query.gr_id == "-4") {
		where += " && co_type='contact'";
	}
	if (req.query.gr_id == "-7") {
		where += " && co_type='society'";
	}
	if (req.query.co_type && req.query.co_type !== "") {
		where += " && co_type=?";
		whereData.push(req.query.co_type);
	}
	if (req.query.onlymine && req.query.onlymine == "true") {
		where += " && t1.co_id=?";
		whereData.push(req.user.co_id);
	}
	if (req.query.gr_id == "lastimport") {
		where += " && co_import=?";
		whereData.push(1);
	}
	if (req.query.ag_id) {
		where += " && t2.ag_id=?";
		whereData.push(req.query.ag_id);
	}
	if (req.query.gr_id == "-6") {
		where += " && deleted=1";
	} else {
		where += " && deleted=0";
	}

	var rows = [];
	// var whereMore = "";
	// var whereMore2 = "";
	// var okDRH = false;
	var total = 0;
	if (!req.user.co_rights) req.user.co_rights = {};
	async.series(
		[
			next => {
				if (req.query.contactfromcontact) {
					ContactsContacts.find("co_id1=? || co_id2=?", [req.query.contactfromcontact, req.query.contactfromcontact]).exec(
						(errsql, rows_cc) => {
							where += " && (0";
							_.each(rows_cc, row_cc => {
								if (row_cc.co_id1 == req.query.contactfromcontact) {
									where += " || co_id=?";
									whereData.push(row_cc.co_id2);
								} else {
									where += " || co_id=?";
									whereData.push(row_cc.co_id1);
								}
							});
							where += ")";
							next();
						}
					);
				} else next();
			},
			next => {
				var query = "";
				if (
					req.query.gr_id &&
					req.query.gr_id != "-1" &&
					req.query.gr_id != "-2" &&
					req.query.gr_id != "-3" &&
					req.query.gr_id != "-4" &&
					req.query.gr_id != "-5" &&
					req.query.gr_id != "-6" &&
					req.query.gr_id != "-7" &&
					req.query.gr_id != "lastimport" &&
					req.query.gr_id != "allagencies"
				) {
					where += " && t1.gr_id=?";
					whereData.push(req.query.gr_id);
					query =
						"select * from cogr_contactsgroups t1 left join co_contacts t2 on t1.co_id=t2.co_id left join gr_groups t3 on t1.gr_id=t3.gr_id where 1 " +
						where +
						" && NULLIF(t2.deleted, 0) IS NULL order by co_name";
					// } else if (req.query.doublon && okDRH) {
					// 	query =
					// 		"SELECT c1.co_id, c1.co_name, c1.co_firstname, CONCAT(c1.co_name,c1.co_firstname) as c1concat FROM co_contacts c1 INNER JOIN (SELECT co_id, co_name, co_firstname, CONCAT(c2.co_name,c2.co_firstname) as c2concat FROM co_contacts c2 GROUP BY c2concat HAVING count(c2.co_id) > 1) dup on c1.co_name = dup.co_name where c1.deleted=0";
				} else {
					let what = [
						"t1.co_id",
						"t1.co_type",
						"t1.co_name",
						"t1.co_firstname",
						"t1.co_society",
						"t1.co_avatar",
						"t1.co_city",
						"t1.co_code",
						"t1.updatedAt"
					];
					query =
						"select " +
						what.join(", ") +
						" from co_contacts t1 where 1 " +
						where +
						" group by t1.co_id order by co_name, co_firstname, co_society";
					// if (req.query.limit) {
					// 	query += " limit 0," + req.query.limit;
					// }
				}
				// console.log("query, whereData", query, whereData);
				Contacts.query(query, whereData).exec((errsql, _rows) => {
					if (errsql) console.warn(errsql);
					let rowsOk = [];
					let skip = 0;
					if (req.query.skip) skip = req.query.skip * 1;
					let limit = 0;
					if (req.query.limit) limit = req.query.limit * 1;
					total = _rows.length;
					_.each(_rows, (row, index) => {
						if (index < skip) return;
						if (limit > 0 && index >= limit + skip) return;
						rowsOk.push(row);
					});
					rows = rowsOk;
					// console.log("query,whereData",query,whereData,rows);
					next();
				});
			}
		],
		() => {
			cb(rows, total);
		}
	);
}
function analyseImport(filename, tabfields) {
	var path = require("path"),
		fn = path.basename(filename),
		root = sails.config.appPath,
		uploadPathDir = root + path.sep + "uploads" + path.sep;
	var XLSX = require("xlsx-style");
	var workbook = XLSX.readFile(uploadPathDir + "import_" + fn);
	var first_sheet_name = workbook.SheetNames[0];
	var worksheet = workbook.Sheets[first_sheet_name];
	var range = XLSX.utils.decode_range(worksheet["!ref"]);
	var nbCols = range.e.c;
	var nbRows = range.e.r;
	var all = [];
	if (!tabfields) {
		for (var i = 0; i <= nbCols; i++) {
			var col = XLSX.utils.encode_col(i);
			if (worksheet[col + "1"]) all.push(col + "1" + " : " + worksheet[col + "1"].v);
		}
	} else {
		for (var j = 0; j <= nbRows; j++) {
			var row = XLSX.utils.encode_row(j);
			var data = {};
			for (var i2 = 0; i2 <= nbCols; i2++) {
				var col2 = XLSX.utils.encode_col(i2);
				if (tabfields[i2] && worksheet[col2 + row]) {
					if (tabfields[i2] == "dontimport") continue;
					else data[tabfields[i2]] = worksheet[col2 + row].v;
				}
			}
			if (!data.co_type) data.co_type = 1;
			data.co_import = 1;
			all.push(data);
		}
	}
	return all;
}
function savePhoto(req, co_id, next) {
	req.file("co_avatar_send").upload(
		{
			maxBytes: 10000000
		},
		(err, uploadedFiles) => {
			if (err || req.file("co_avatar_send").isNoop || uploadedFiles.length === 0) {
				return next(err);
			}
			var fs = require("fs-extra"),
				path = require("path"),
				fn = path.basename(uploadedFiles[0].fd),
				root = sails.config.appPath,
				uploadPathDir = root + path.sep + "uploads" + path.sep;
			if (!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
			fs.renameSync(uploadedFiles[0].fd, uploadPathDir + "orig_" + fn);
			Contacts.update(
				{
					co_id: co_id
				},
				{
					co_avatar: fn,
					co_avatarauto: ""
				}
			).exec(err => {
				if (err) return next(err);
				return next();
			});
		}
	);
}

module.exports = class extends BaseController {
	combo(req, res) {
		if (
			req.params.field != "co_function" &&
			req.params.field != "co_marche" &&
			req.params.field != "co_country" &&
			req.params.field != "ad_country" &&
			req.params.field != "co_activite"
		)
			// return this.send(res, { err: "Deny" });
			Services.sendWebservices(res, { err: "Deny", data: null });

		let where = "1";
		let whereData = [];
		if (req.query.query) {
			where = req.params.field + " like ?";
			whereData = ["%" + req.query.query + "%"];
		}

		let query = "";
		var data = [];
		async.series(
			[
				next => {
					if (req.params.what == "contacts") {
						query =
							"select " +
							req.params.field +
							" from co_contacts where " +
							where +
							" group by " +
							req.params.field +
							" order by " +
							req.params.field;
					} else next();
				},
				next => {
					if (req.params.what == "addresses") {
						query =
							"select " +
							req.params.field +
							" from ad_addresses where " +
							where +
							" group by " +
							req.params.field +
							" order by " +
							req.params.field;
					} else next();
				},
				next => {
					Contacts.query(query, whereData).exec((errsql, rows) => {
						if (errsql) console.warn("err", errsql);
						// console.log("rows", rows, query, queryArgs);
						_.each(rows, row => {
							if (row[req.params.field])
								data.push({
									key: row[req.params.field],
									val: row[req.params.field]
								});
						});
					});
				}
			],
			err => {
				Services.sendWebservices(res, { err: null, data: data });
			}
		);
	}
	findOne(req, res) {
		if (req.params.co_id == -1 || req.params.co_id == -2) {
			var row_co = Contacts.createEmpty();
			row_co.co_id = "";
			// row_co.co_type = "contact";
			// if (req.params.id == -2)
			row_co.co_type = "society";
			row_co.co_rights = {};
			row_co.contracts = [];
			row_co.addresses = [];
			row_co.contacts = [];
			row_co.co_birthday = "";
			row_co.history = [];
			// this.send(res, { data: row_co });
			Services.sendWebservices(res, { err: null, data: row_co });
		} else {
			Contacts.findOne({
				"t1.co_id": req.params.co_id
			})
				.populate("ag_id")
				.populate("updatedCo")
				.populate("createdCo")
				.exec((errsql, row_co) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row_co)
						row_co = {
							co_id: ""
						};
					row_co.co_password = "";
					row_co.history = [];
					async.series(
						[
							next => {
								Invoices.find("co_id_contact=?", [row_co.co_id])
									.populate("co_id_user")
									.exec((errsql, rows_in) => {
										_.each(rows_in, row_in => {
											row_co.history.push({
												ac_date: row_in.in_date,
												ac_text: "<span class='fa fa-align-justify'></span> Devis",
												ac_text2: row_in.in_object,
												ac_price: row_in.in_sumttc,
												ac_id_model: row_in.in_id,
												co_id_user: row_in.co_id_user
											});
										});
										next();
									});
							},
							next => {
								Opportunities.find("co_id_contact=?", [row_co.co_id])
									.populate("co_id_user")
									.exec((errsql, rows_op) => {
										_.each(rows_op, row_op => {
											row_co.history.push({
												ac_date: row_op.op_date,
												ac_text: "<span class='fa fa-cc'></span> Opportunité",
												ac_text2: row_op.op_name,
												ac_price: row_op.op_price,
												ac_id_model: row_op.op_id,
												co_id_user: row_op.co_id_user
											});
										});
										next();
									});
							},
							next => {
								if (!row_co.co_code) return next();

								Commandes.query("select * from cd_commandes where co_code=?", [row_co.co_code]).exec((errsql, rows_cd) => {
									_.each(rows_cd, row_cd => {
										row_co.history.push({
											ac_date: row_cd.cd_echeancepaie,
											ac_text: "Commande",
											ac_text2: "N°" + row_cd.cd_num + " - Produit : " + row_cd.pr_id + " (" + row_cd.cd_typeproduit + ")",
											ac_price: row_cd.cd_price * row_cd.cd_qtefacturee,
											ac_id_model: row_cd.cd_id,
											co_id_user: ""
										});
									});
									next();
								});
							},
							next => {
								Actions.find("co_id_contact=?", [row_co.co_id])
									.populate("co_id_user")
									.exec((errsql, rows_ac) => {
										_.each(rows_ac, row_ac => {
											let more = _.result(Shared.getActionsTypes(row_ac.ac_type), "val");
											if (row_ac.ac_type == "call") {
												let t = " - " + _.result(Shared.getCallResults(row_ac.ac_call_result), "val");
												if (row_ac.ac_call_result == 2) {
													more += t + " le<br>" + moment(row_ac.ac_call_recalldate).format("DD/MM/YYYY [à] HH[H]mm");
												}
											}
											// console.log("row_ac.ac_call_date", row_ac.ac_call_date);
											row_co.history.push({
												ac_date: row_ac.ac_call_date,
												ac_text: "<span class='fa fa-anchor'></span> Action",
												ac_text2: more,
												ac_price: 0,
												ac_id_model: row_ac.ac_id,
												co_id_user: row_ac.co_id_user
											});
										});
										next();
									});
							},
							next => {
								Documents.find("co_id=? && do_deleted=0", [row_co.co_id]).exec((errsql, rows_do) => {
									row_co.documents = rows_do;
									next();
								});
							},
							next => {
								OptionsServices.get("", "allrights_" + row_co.co_type, defaultRights => {
									row_co.defaultRights = defaultRights;
									next();
								});
							},
							next => {
								row_co.addresses = [];
								Addresses.find("co_id=? && ad_deleted=0 order by ad_label", [row_co.co_id]).exec((errsql, rows_ad) => {
									row_co.addresses = rows_ad;
									next();
								});
							},
							next => {
								row_co.contacts = [];
								ContactsContacts.find("co_id1=? || co_id2=?", [row_co.co_id, row_co.co_id])
									.populate("co_id1")
									.populate("co_id2")
									.exec((errsql, rows_cc) => {
										// console.log("rows_cc", rows_cc);
										// _.each(rows_cc, (row_cc) => {
										// 	if (row_cc.co_id1.co_id)row_co.contacts.push()
										// })
										// row_co.contacts = rows_co;
										async.eachSeries(
											rows_cc,
											(row_cc, nextCC) => {
												if (!row_cc.co_id1) return nextCC();
												let row = row_cc.co_id1;
												if (row_cc.co_id1.co_id == row_co.co_id) row = row_cc.co_id2;
												row.addresses = [];
												Addresses.find("co_id=? && ad_deleted=0 order by ad_label", [row.co_id]).exec((errsql, rows_ad) => {
													row.addresses = rows_ad;
													row_co.contacts.push(row);
													nextCC();
												});
											},
											() => {
												next();
											}
										);
									});
							}
						],
						(err, results) => {
							row_co.history.sort((a, b) => {
								return new Date(b.ac_date) - new Date(a.ac_date);
							});
							// this.send(res, {
							// 	data: row_co
							// });
							Services.sendWebservices(res, { err: null, data: row_co });
						}
					);
				});
		}
	}
	find(req, res) {
		filterContacts(req, (rows_co, total) => {
			// this.send(res, { data: rows_co, total: total });
			Services.sendWebservices(res, { err: null, data: rows_co, total: total });
		});
	}
	export(req, res) {
		filterContacts(req, rows_co => {
			var sep = "\n";
			var content = "";
			_.each(rows_co, row_co => {
				content += Shared.completeName(row_co);
				content += sep;
			});
			var filename = "export-contacts_" + moment().format("YYYY-MM-DD") + ".txt";
			res.setHeader("Content-disposition", "attachment; filename=" + filename);
			res.cookie("filedownload", "true", { path: "/" });
			res.setHeader("Content-type", "text/text");
			res.setHeader("Content-Length", content.length);

			this.send(res, content);
		});
	}
	savestatus(req, res) {
		Contacts.update(
			{
				co_id: req.body.co_id
			},
			{
				co_status: req.body.co_status
			},
			(err, row_co) => {
				// this.send(res, {
				// 	data: row_co
				// });
				Services.sendWebservices(res, { err: null, data: row_co });
			}
		);
	}
	_updateOrCreate(req, next) {
		var row_co = null;
		// var row_co_old = null;
		if (req.body.co_avatarauto) req.body.co_avatar = req.body.co_avatarauto;
		async.series(
			[
				nextSerie => {
					Contacts.replace(
						{
							co_id: req.body.co_id
						},
						[],
						req.body,
						(err, _row_co, _row_co_old) => {
							if (err) return next(err, _row_co);
							row_co = _row_co;
							// row_co_old = _row_co_old;
							nextSerie();
						},
						true
					);
				},

				nextSerie => {
					if (req.body.shortSave) return nextSerie();

					var rights = [];
					var rights2 = {};
					_.each(req.body, (bodyval, bodykey) => {
						if (bodykey.substr(0, 6) == "right_") {
							var right = bodykey.substr(6);
							rights.push([right, bodyval]);
							rights2[right] = bodyval;
						}
					});
					// if (row_co.co_type=='contact' || row_co.co_type=='customer') rights2 = {} ;
					// console.log("rights2",rights2);
					Contacts.update({ co_id: row_co.co_id }, { co_rights: rights2 }).exec(errsql => {
						if (errsql) console.warn("errsql", errsql);
						nextSerie();
					});
				},

				nextSerie => {
					if (req.body.shortSave) return nextSerie();
					// console.log("req.body.contacts", req.body.contacts);
					async.eachSeries(
						req.body.contacts,
						(co_id_temp, nextCC) => {
							ContactsContacts.findOne("(co_id1=? && co_id2=?) || (co_id1=? && co_id2=?)", [
								row_co.co_id,
								co_id_temp,
								co_id_temp,
								row_co.co_id
							]).exec((errsql, row_cc) => {
								if (row_cc) return nextCC();
								ContactsContacts.create({ co_id1: row_co.co_id, co_id2: co_id_temp }).exec((errsql, ok) => {
									nextCC();
								});
							});
						},
						() => {
							nextSerie();
						}
					);
				},

				nextSerie => {
					if (req.body.shortSave) return nextSerie();
					// console.log("req.body.contacts", req.body.contacts);
					async.eachSeries(
						req.body.contactstodelete,
						(co_id_temp, nextCC) => {
							ContactsContacts.destroy("(co_id1=? && co_id2=?) || (co_id1=? && co_id2=?)", [
								row_co.co_id,
								co_id_temp,
								co_id_temp,
								row_co.co_id
							]).exec((errsql, row_cc) => {
								nextCC();
							});
						},
						() => {
							nextSerie();
						}
					);
				}
			],
			err => {
				// Contacts.
				next(null, row_co);
			}
		);
	}
	create(req, res) {
		req.body.createdCo = req.user.co_id;
		req.body.updatedCo = req.user.co_id;
		this._updateOrCreate(req, (err, row_co) => {
			if (err) return Services.sendWebservices(res, { err: err, data: null });
			// this.send(res, { data: row_co });
			Services.sendWebservices(res, { err: null, data: row_co });
		});
	}
	update(req, res) {
		req.body.updatedCo = req.user.co_id;
		this._updateOrCreate(req, (err, row_co) => {
			if (err) return Services.sendWebservices(res, { err: err, data: null });
			// this.send(res, { data: row_co });
			Services.sendWebservices(res, { err: null, data: row_co });
		});
	}
	updateavatar(req, res) {
		savePhoto(req, req.body.co_id, () => {
			Contacts.findOne(req.body.co_id).exec((errsql, row_co) => {
				if (errsql) console.warn("errsql", errsql);
				// this.send(res, { data: row_co });
				Services.sendWebservices(res, { err: null, data: row_co });
			});
		});
	}
	undestroy(req, res) {
		Contacts.update({ co_id: req.params.co_id }, { deleted: false }).exec(errsql => {
			if (errsql) console.warn("errsql", errsql);
			// this.send(res, { success: true });
			Services.sendWebservices(res, { err: null, success: true });
		});
	}
	destroy(req, res) {
		Contacts.update({ co_id: req.params.co_id }, { deleted: true }).exec(errsql => {
			if (errsql) console.warn("errsql", errsql);
			// this.send(res, { success: true });
			Services.sendWebservices(res, { err: null, success: true });
		});
	}
	import1(req, res) {
		req.file("fileimport").upload(
			{
				maxBytes: 10000000
			},
			(err, uploadedFiles) => {
				if (err || req.file("fileimport").isNoop || uploadedFiles.length === 0) {
					// console.log("errimport", err);
					// return res.ok({
					// 	success: false
					// });
					Services.sendWebservices(res, { err: null, success: false });
				}
				var fs = require("fs-extra"),
					path = require("path"),
					fn = path.basename(uploadedFiles[0].fd),
					root = sails.config.appPath,
					uploadPathDir = root + path.sep + "uploads" + path.sep;
				if (!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
				fs.renameSync(uploadedFiles[0].fd, uploadPathDir + "import_" + fn);
				var all = analyseImport(fn, null);
				// res.ok({
				// 	data: all,
				// 	filename: fn
				// });
				Services.sendWebservices(res, { err: null, data: all, filename: fn });
			}
		);
	}
	import2(req, res) {
		var all = analyseImport(req.body.filename, req.body.tabfields);
		// res.ok({
		// 	data: all,
		// 	filename: req.body.filename
		// });
		Services.sendWebservices(res, { err: null, data: all, filename: req.body.filename });
	}
	import3(req, res) {
		var all = analyseImport(req.body.filename, req.body.tabfields);
		async.eachSeries(
			all,
			(data, next) => {
				Contacts.create(data, (err, row_co) => {
					if (err) return console.warn("errpetite", err);
					next(err);
				});
			},
			err => {
				if (err) console.warn("errgeneral", err);
				// res.ok({
				// 	data: all
				// });
				Services.sendWebservices(res, { err: null, data: all });
			}
		);
	}
	avatar(req, res) {
		// return this.send(res, "OK");

		// res.header('Cache-Control', 'public, max-age='+sails.config.http.cache);

		var fs = require("fs-extra"),
			// path = require("path"),
			// root = morphineserver.rootDir,
			// uploadPathDir = root+path.sep+"uploads",
			gm = require("gm");

		Contacts.findOne({ co_id: req.params.co_id }).exec((err, row_co) => {
			if (err) row_co.co_avatar = null;
			if (!row_co || row_co.co_id == 0) row_co = { co_avatar: null };
			// console.log("row_co", row_co);
			// console.log("row_co.co_avatar", row_co.co_avatar);

			req.params.w = req.params.w * 1;
			req.params.h = req.params.h * 1;

			fs.ensureDirSync(morphineserver.rootDir + "/uploads");

			var src = morphineserver.rootDir + "/assets/images/ill_monster1.png";
			var dest = morphineserver.rootDir + "/uploads/" + req.params.w + "-" + req.params.h + "_default";
			// var hasAvatarImg = false;
			if (row_co.co_avatar) {
				src = morphineserver.rootDir + "/uploads/orig_" + row_co.co_avatar;
				dest = morphineserver.rootDir + "/uploads/" + req.params.w + "-" + req.params.h + "_" + row_co.co_id;
				// pictureOk = uploadPathDir+path.sep+req.params.w+"-"+req.params.h+"_"+user.co_avatar ;
				// fn = user.co_avatar ;
				// fnprefix = "orig_" ;
				// hasAvatarImg = true ;
				if (!fs.existsSync(src)) {
					src = morphineserver.rootDir + "/assets/images/" + row_co.co_avatar;
				}
			}
			if (row_co.co_type == "society" || req.params.co_id == "society") {
				src = morphineserver.rootDir + "/assets/images/entreprise-1.png";
				dest = morphineserver.rootDir + "/uploads/" + req.params.w + "-" + req.params.h + "_" + row_co.co_id;
			} else if (row_co.co_type == "contact" || req.params.co_id == "contact") {
				src = morphineserver.rootDir + "/assets/images/contact-1.png";
				dest = morphineserver.rootDir + "/uploads/" + req.params.w + "-" + req.params.h + "_" + row_co.co_id;
			} else if (req.params.co_id == "user") {
				src = morphineserver.rootDir + "/assets/images/avatar02.png";
				dest = morphineserver.rootDir + "/uploads/" + req.params.w + "-" + req.params.h + "_" + row_co.co_id;
			}
			// if (!hasAvatarImg) {
			//     pictureOk = root+"/assets/images/"+req.params.w+"-"+req.params.h+"_default.png" ;
			//     fn = "ill_monster1.png" ;
			//     fnprefix = "" ;
			// }
			// if (user.co_avatarauto) {
			//     pictureOk = root+"/assets/images/"+req.params.w+"-"+req.params.h+"_"+user.co_avatarauto ;
			//     fn = user.co_avatarauto ;
			//     fnprefix = "" ;
			// }
			// console.log("src", src, dest, row_co.co_type, req.params.co_id);
			async.series([
				next => {
					// if (!fs.existsSync(dest)) {
					gm(src)
						.gravity("Center")
						.resize(req.params.w, req.params.h, "^")
						.crop(req.params.w, req.params.h)
						.noProfile()
						.write(dest, err => {
							if (err) console.warn("err", err);
							next();
						});
					// } else next();
				},
				next => {
					var stat = fs.statSync(dest);
					// console.log("If-Modified-Since", req.get('If-Modified-Since'));
					res.writeHead(200, {
						"Cache-Control": "max-age=" + 3600 * 24 * 360,
						"Last-Modified": new Date(),
						"Content-Type": "image/jpeg",
						"Content-Length": stat.size
					});
					var readStream = fs.createReadStream(dest);
					readStream.pipe(res);

					next();
				}
			]);
		});
	}
};
