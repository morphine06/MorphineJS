"use strict";

let BaseController = require("../BaseController");

function generateExport(req, test, cb) {
	let start = moment(req.body.start);
	let end = moment(req.body.end);

	// console.log("req.body", req.body);
	let where = { va_start: { "<=": end.toDate() }, va_end: { ">=": start.toDate() } };
	// if (req.body.alreadyexport === true || req.body.alreadyexport == "true") where.or = [{ va_status: 'vacation_waiting' }, { va_status: 3 }];
	// else where.va_status = 1;

	Vacations.find(where)
		.populate("co_id_user")
		.populate("va_type")
		.exec((errsql, rows_va) => {
			if (errsql) console.warn("errsql", errsql);
			// let txtWI = "" ;
			// let txtLI = "" ;
			// let txtWE = "" ;
			// let txtLP = "" ;
			let tabEntities = {};
			let sep = ":";
			let err = [];
			async.eachSeries(
				rows_va,
				(row_va, nextSerie) => {
					Agencies.findOne({ ag_id: row_va.ag_id })
						.populate("ag_entity")
						.exec((errsql, row_ag) => {
							if (errsql) console.warn("errsql", errsql);

							if (!tabEntities[row_ag.ag_entity.en_id]) {
								tabEntities[row_ag.ag_entity.en_id] = {
									en_id: row_ag.ag_entity.en_id,
									en_name: row_ag.ag_entity.en_name,
									txt: ""
								};
							}

							if (!row_va.co_id_user.co_matricule) {
								err.push([row_va.co_id_user.co_id, "Manque le matricule de " + Shared.completeName(row_va.co_id_user)]);
								return nextSerie();
							}
							let va_start = moment(row_va.va_start);
							let va_end = moment(row_va.va_end);
							let va_start2 = row_va.va_start2;
							let va_end2 = row_va.va_end2;
							if (va_start.diff(start) < 0) {
								va_start = moment(start);
								va_start2 = false;
							}
							if (va_end.diff(end) > 0) {
								va_end = moment(end);
								va_end2 = false;
							}
							let txtRet = "";
							txtRet += row_va.co_id_user.co_matricule;
							txtRet += sep;
							if (row_va.va_type.vt_code) txtRet += ".JAB" + row_va.va_type.vt_code;
							else txtRet += ".CPC";
							txtRet += sep;
							txtRet += Shared.getNbOpenDays(va_start, va_end, va_start2, va_end2);
							txtRet += sep;
							txtRet += va_start.format("YYYYMMDD");
							txtRet += sep;
							txtRet += va_end.format("YYYYMMDD");
							txtRet += "\n";
							let ok = false;
							// if (row_va.co_id_user.co_codetiers=="000461") {
							// 	txtWI += txtRet ;
							// 	ok = true ;
							// } else if (row_va.co_id_user.co_codetiers=="000049") {
							// 	txtLI += txtRet ;
							// 	ok = true ;
							// } else if (row_va.co_id_user.co_codetiers=="000462") {
							// 	txtWE += txtRet ;
							// 	ok = true ;
							// } else if (row_va.co_id_user.co_codetiers=="000260") {
							// 	txtLP += txtRet ;
							// 	ok = true ;
							// }
							tabEntities[row_ag.ag_entity.en_id].txt += txtRet;
							ok = true;

							if (test || !ok) return nextSerie();
							else {
								Vacations.update({ va_id: row_va.va_id }, { va_status: "vacation_exported" }, _row_va => {
									Actions.create({
										ac_date: new Date(),
										va_id: row_va.va_id,
										co_id_user: req.user.co_id,
										co_id: row_va.co_id_user.co_id,
										ac_type: 16
									}).exec((errsql, row_ac) => {
										if (errsql) console.warn("errsql", errsql);
										nextSerie();
									});
								});
							}
						});
				},
				() => {
					cb({ err: err, start: start, end: end, tabEntities: tabEntities }); //, txtWI:txtWI, txtLI:txtLI, txtWE:txtWE, txtLP:txtLP
				}
			);
		});
}

module.exports = class extends BaseController {
	import_1_0(req, res) {
		req.file("myfile").upload(
			{
				maxBytes: 10000000
			},
			(err, uploadedFiles) => {
				// console.log("err", err, uploadedFiles);
				if (err || req.file("myfile").isNoop || uploadedFiles.length === 0) {
					console.warn("errimport", err);
					return res.ok({
						success: false
					});
				}
				let nbUpdated = 0,
					notfound = ""; //nbCreated = 0,
				// console.log("uploadedFiles", uploadedFiles);
				async.eachSeries(
					uploadedFiles,
					(uploadedFile, nextFile) => {
						let fs = require("fs"),
							path = require("path"),
							root = sails.config.appPath,
							uploadPathDir = root + path.sep + "uploads" + path.sep;

						fs.renameSync(uploadedFile.fd, uploadPathDir + "cp-LI.xls");
						let XLSX = require("xlsx-style");
						let workbook = XLSX.readFile(uploadPathDir + "cp-LI.xls");
						let first_sheet_name = workbook.SheetNames[0];
						let worksheet = workbook.Sheets[first_sheet_name];
						let range = XLSX.utils.decode_range(worksheet["!ref"]);
						let nbCols = range.e.c;
						let nbRows = range.e.r;
						let all = [];
						for (let j = 0; j <= nbRows; j++) {
							let row = XLSX.utils.encode_row(j);
							let data = {};
							for (let i2 = 0; i2 <= nbCols; i2++) {
								let col2 = XLSX.utils.encode_col(i2);
								if (j >= 4) {
									if (worksheet[col2 + row] && worksheet[col2 + row].v) {
										if (col2 == "B") data.matricule = worksheet[col2 + row].v.trim();
										if (col2 == "C") data.name = worksheet[col2 + row].v.trim();
										if (col2 == "D") data.name = worksheet[col2 + row].v.trim();
										if (col2 == "E") data.firstname = worksheet[col2 + row].v;
										if (col2 == "F") data.acquisn1 = worksheet[col2 + row].v * 1;
										if (col2 == "G") data.prisn1 = worksheet[col2 + row].v * 1;
										if (col2 == "H") data.acquis = worksheet[col2 + row].v * 1;
										if (col2 == "I") data.pris = worksheet[col2 + row].v * 1;
									}
								}
								// if(tabfields[i2] && worksheet[col2 + row]) {
								// 	if(tabfields[i2] == 'dontimport') continue;
								// 	else data[tabfields[i2]] = worksheet[col2 + row].v;
								// }
							}
							// if(!data.co_type) data.co_type = 1;
							// data.co_import = 1;
							if (data.name && data.matricule) {
								if (!data.acquisn1) data.acquisn1 = 0;
								if (!data.prisn1) data.prisn1 = 0;
								if (!data.acquis) data.acquis = 0;
								if (!data.pris) data.pris = 0;
								all.push(data);
							}
						}
						// console.log("all", all);
						async.eachSeries(
							all,
							(one, nextAll) => {
								Contacts.findOne({ co_name: one.name, co_matricule: one.matricule }).exec((errsql, row_co) => {
									if (errsql) console.warn("errsql", errsql);
									if (row_co) {
										let u = {
											// co_vacations_gain: one.acquis - one.pris,
											// co_vacations_gain2: one.acquisn1 - one.prisn1,
											co_vacations_acquisn1: one.acquisn1,
											co_vacations_prisn1: one.prisn1,
											co_vacations_acquis: one.acquis,
											co_vacations_pris: one.pris,
											co_vacations_import: new Date()
										};
										// console.log("u", u);
										Contacts.update({ co_id: row_co.co_id }, u).exec((errsql, row_co) => {
											if (errsql) console.warn("errsql", errsql);
											nbUpdated++;
											nextAll();
										});
									} else {
										notfound += one.name + " (" + one.matricule + ") non trouvé<br>";
										nextAll();
									}
								});
							},
							() => {
								nextFile();
							}
						);
					},
					() => {
						res.ok({
							// data: all,
							nbUpdated: nbUpdated,
							notfound: notfound
						});
					}
				);
			}
		);
	}
	exportcheck_1_0(req, res) {
		generateExport(req, true, ret => {
			res.send({ err: ret.err });
		});
	}
	exportxls_1_0(req, res) {
		let path = require("path"),
			root = sails.config.appPath,
			uploadPathDir = root + path.sep + "uploads" + path.sep,
			myfile = "Export.csv";

		let start = moment(req.body.start);
		let end = moment(req.body.end);
		let tabStatus = Shared.getVaStatus();

		let where = { va_start: { "<=": end.toDate() }, va_end: { ">=": start.toDate() } };
		// where.va_status = 1 ;

		Vacations.find(where)
			.populate("co_id_user")
			.populate("va_type")
			.populate("ag_id")
			// .sort('')
			.exec((errsql, rows_va) => {
				if (errsql) console.warn("errsql", errsql);

				// trier par nom et prénom
				let json2csv = require("json2csv");
				let fs = require("fs");
				let fields = [
					"Entité",
					"Salarié",
					"Début",
					"Matin travaillé",
					"Fin",
					"Aprés-midi travaillé",
					"Type",
					"Statut",
					"Commentaire",
					"Nb Jours"
				];
				let myCars = [];
				// let line = 0;
				async.eachSeries(
					rows_va,
					(row_va, nextVa) => {
						let d = {
							Entité: "",
							Salarié: Shared.completeName(row_va.co_id_user),
							Début: moment(row_va.va_start).format("DD/MM/YYYY"),
							"Matin travaillé": row_va.va_start2 ? "Oui" : "",
							Fin: moment(row_va.va_end).format("DD/MM/YYYY"),
							"Aprés-midi travaillé": row_va.va_end2 ? "Oui" : "",
							Type: row_va.va_type.vt_name,
							Statut: _.find(tabStatus, { key: row_va.va_status }).val,
							Commentaire: row_va.va_comment,
							"Nb Jours": Shared.getNbOpenDays(row_va.va_start, row_va.va_end, row_va.va_start2, row_va.va_end2)
						};
						// line++;
						if (row_va.ag_id && row_va.ag_id.ag_entity) {
							Entities.findOne(row_va.ag_id.ag_entity).exec((errsql, row_en) => {
								if (errsql) console.warn("errsql", errsql);
								d["Entité"] = row_en.en_name;
								myCars.push(d);
								nextVa();
							});
						} else {
							myCars.push(d);
							nextVa();
						}
					},
					() => {
						json2csv({ data: myCars, fields: fields, del: ";" }, (err, csv) => {
							if (err) console.warn(err);
							fs.writeFile(uploadPathDir + myfile, csv, err => {
								if (err) throw err;
								let iconv = require("iconv-lite");
								// console.log('file saved');
								res.setHeader(
									"Content-disposition",
									"attachment; filename=export_vacances_" + moment().format("YYYY-MM-DD") + ".csv"
								);
								res.setHeader("Content-type", "application/vnd.ms-excel");
								// let filestream = fs.createReadStream(uploadPathDir+myfile);
								// filestream.pipe(res);
								fs
									.createReadStream(uploadPathDir + myfile)
									.pipe(iconv.decodeStream("utf8"))
									.pipe(iconv.encodeStream("win1252"))
									.pipe(res);
							});
						});
					}
				);
			});
	}
	export_1_0(req, res) {
		let fs = require("fs"),
			path = require("path"),
			root = sails.config.appPath,
			uploadPathDir = root + path.sep + "uploads" + path.sep,
			myfile =
				"Abscence-" +
				moment(req.body.start)
					.startOf("months")
					.format("MMMM-YYYY") +
				".zip";
		let zip = new require("node-zip")();
		let data;

		generateExport(req, false, ret => {
			// console.log("ret.tabEntities",ret.tabEntities);

			_.each(ret.tabEntities, (row_en, key) => {
				// console.log("row_en[key].txt",row_en.txt);
				zip.file(row_en.en_name + ".txt", row_en.txt);
			});
			data = zip.generate({ base64: false, compression: "DEFLATE" });
			fs.writeFileSync(uploadPathDir + myfile, data, "binary");

			res.setHeader("Content-disposition", "attachment; filename=" + myfile);
			res.setHeader("Content-type", "application/zip");
			let filestream = fs.createReadStream(uploadPathDir + myfile);
			filestream.pipe(res);

			// let filename = "export-conges_"+ret.start.format('YYYY-MM-DD')+"_"+ret.end.format('YYYY-MM-DD')+".txt" ;
			// res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			// res.cookie('filedownload', "true", {path: '/'}) ;
			// res.setHeader('Content-type', 'text/text');
			// res.setHeader('Content-Length', ret.content.length);
			//
			// res.send(ret.content) ;
		});
	}
	vacationstypes_find_1_0(req, res) {
		Lists.find("li_group=? order by li_position, li_name", ["system_vacations_type"]).exec((errsql, rows_li) => {
			Services.sendWebservices(res, { err: null, data: rows_li });
		});
	}
	findone_1_0(req, res) {
		if (req.params.va_id == -1) {
			let row_va = Vacations.createEmpty();
			if (req.query.va_start) {
				row_va.va_start = moment(req.query.va_start);
				row_va.va_end = moment(req.query.va_start);
			} else {
				row_va.va_start = moment();
				row_va.va_end = moment();
			}
			row_va.co_id_user = req.user;
			row_va.va_status = "vacation_waiting";
			row_va.va_id = "";
			Services.sendWebservices(res, { err: null, data: row_va });
		} else {
			Vacations.findOne({ va_id: req.params.va_id })
				.populate("co_id_user")
				.populate("va_type")
				// .populate("ag_id")
				.exec((errsql, row_va) => {
					if (errsql) console.warn("errsql", errsql);
					Services.sendWebservices(res, { err: null, data: row_va });
				});
		}
	}
	find_1_0(req, res) {
		// let where = {} ;
		// if (req.query.start) where.va_end = {'>': req.query.start} ;
		// if (req.query.end) where.va_start = {'<': req.query.end} ;
		// if (req.query.co_id_user && req.query.co_id_user!=-1) where.co_id_user = req.query.co_id_user ;
		// // if (req.query.ag_id && req.query.ag_id!=-1) where.ag_id = req.query.ag_id ;
		// if (req.query.agencies) {
		// 	_.each(req.query.agencies, function (agency) {
		//
		// 	}) ;
		// }
		// if (req.query.notHideThisProject && req.query.va_status*1===0) {
		// 	where.or = [
		// 		{va_status: 0},
		// 		{ag_id: req.query.notHideThisProject}
		// 	] ;
		// } else if ((req.query.va_status || req.query.va_status*1===0) && req.query.va_status!='-1') where.va_status = req.query.va_status ;
		//
		// console.log("where",where, req.query);

		let where = "1=1";
		let whereData = [];
		if (req.query.start) {
			where += " && va_end>?";
			whereData.push(moment(req.query.start).format("YYYY-MM-DD"));
		}
		if (req.query.end) {
			where += " && va_start<?";
			whereData.push(moment(req.query.end).format("YYYY-MM-DD"));
		}
		if (req.query.co_id_user && req.query.co_id_user != -1) {
			where += " && co_id_user=?";
			whereData.push(req.query.co_id_user);
		}
		// if (req.query.ag_id && req.query.ag_id != -1) {
		// 	where += " && t1.ag_id=?";
		// 	whereData.push(req.query.ag_id);
		// }
		// if (req.query.agencies) {
		// 	where += " && (0";
		// 	_.each(req.query.agencies, ag_id => {
		// 		where += " || t1.ag_id=?";
		// 		whereData.push(ag_id);
		// 	});
		// 	where += ")";
		// }
		// if (req.query.notHideThisProject && req.query.va_status == 'vacation_waiting') {
		// 	where += " && (va_status=0)";// || t1.ag_id=?
		// 	whereData.push(req.query.notHideThisProject);
		// } else if ((req.query.va_status || req.query.va_status * 1 === 0) && req.query.va_status != "-1") {
		// where.va_status = req.query.va_status ;
		// if (req.query.va_status * 1 === 0) where += " && (va_status=0 || va_status=4)";
		// else
		if (req.query.va_status) {
			where += " && va_status=?";
			whereData.push(req.query.va_status);
		}
		// }

		// let query =
		// 	"select t1.*, " +
		// 	Services.prePopulatePerso("t2", "co_id_user", ["co_id", "co_civility", "co_society", "co_name", "co_firstname", "co_type"]) +
		// 	", " +
		// 	Services.prePopulatePerso("t3", "ag_id", ["ag_id", "ag_name", "ag_ville"]) +
		// 	" from vacations t1 left join contacts t2 on t1.co_id_user=t2.co_id left join agencies t3 on t1.ag_id=t3.ag_id where " +
		// 	where;
		// console.log("where,whereData", where, whereData);
		Vacations.find(where, whereData)
			.populate("co_id_user")
			.exec((errsql, rows_va) => {
				// console.log("rows_va", rows_va);
				// Services.populatePerso(rows_va, ["ag_id", "co_id_user"]);
				// console.log("rows_va", rows_va);
				// res.send({ data: rows_va });
				Services.sendWebservices(res, { err: null, data: rows_va });
			});
		// Vacations
		// .populate('co_id_user')
		// .populate('ag_id')
		// // .sort('va')
		// .exec(function(errsql, rows_va) {
		// 	res.send({data:rows_va}) ;
		// }) ;
	}
	_updateOrCreate(req, res, next) {
		if (!req.body.co_id) req.body.co_id = req.user.co_id;
		req.body.updatedCo = req.user.co_id;
		if (!req.body.va_id) req.body.createdCo = req.user.co_id;
		let row_va;
		Contacts.findOne(req.body.co_id_user).exec((errsql, row_co) => {
			if (errsql) console.warn("errsql", errsql);
			// if (!req.body.va_id) req.body.ag_id = row_co.ag_id ;
			let acceptedorrefused = false;
			let row_va_old;
			let lg_type = "";
			async.series(
				[
					nextS => {
						if (req.body.va_id) {
							Vacations.findOne(req.body.va_id)
								.populate("va_type")
								.exec((errsql, _row_va_old) => {
									if (errsql) console.warn("errsql", errsql);
									row_va_old = _row_va_old;
									if (
										(req.body.va_status == 1 || req.body.va_status == 5 || req.body.va_status == 2) &&
										(row_va_old.va_status * 1 === 0 || row_va_old.va_status * 1 == 4)
									) {
										acceptedorrefused = "";
										// if (req.body.va_status == 1) acceptedorrefused = "Validé par le siège";
										if (req.body.va_status == "vacation_accepted") acceptedorrefused = "Validé par le responsable";
										if (req.body.va_status == "vacation_refused") acceptedorrefused = "Refusé par le responsable";
										nextS();
									} else nextS();
								});
						} else nextS();

						// if (!req.body.va_id) {
						// 	Services.getAgenciesForContact(row_co.co_id, function (agencies) {
						// 		if (agencies.length) req.body.ag_id = agencies[0].ag_id ;
						// 		nextS() ;
						// 	}) ;
						// } else nextS() ;
					},
					nextS => {
						if (req.body.va_id) {
							Vacations.update({ va_id: req.body.va_id }, req.body).exec((errsql, _rows_va) => {
								row_va = _rows_va[0];
								lg_type = "vacation_updated";
								nextS();
							}, true);
						} else {
							Vacations.create(req.body).exec((errsql, _row_va) => {
								row_va = _row_va;
								lg_type = "vacation_created";
								nextS();
							}, true);
						}
					},
					nextS => {
						Logs.create({ co_id_user: req.user.co_id, va_id: row_va.va_id, lg_type: lg_type }).exec((errsql, _row_hi) => {
							nextS();
						});
					},
					nextS => {
						let myemail = Shared.getContactEmail(row_co);
						if (myemail && acceptedorrefused) {
							EmailSender.send(
								res,
								Shared.completeName(row_co) + " <" + myemail + ">",
								"Abscence " + acceptedorrefused,
								"vacationacceptrefuse",
								{
									row_co: row_co,
									row_va: row_va,
									row_vt: row_va_old.va_type,
									acceptedrefused: acceptedorrefused
								},
								{},
								() => {
									nextS();
								}
							);
							// sails.hooks.email.send(
							// 	"vacationacceptrefuse",
							// 	{
							// 		row_co: row_co,
							// 		row_va: row_va,
							// 		row_vt: row_va_old.va_type,
							// 		acceptedrefused: acceptedorrefused
							// 		// row_ag: row_ag
							// 	},
							// 	{
							// 		to: Shared.completeName(row_co) + " <" + myemail + ">",
							// 		subject: "MyWellJob > Absence " + acceptedorrefused
							// 	},
							// 	err => {
							// 		if (err) console.warn(err || "Mail sended!");
							// 		nextS();
							// 	}
							// );
						} else nextS();
					}
					// nextS => {
					// 	let row_ac = {
					// 		ac_date: new Date(),
					// 		va_id: row_va.va_id,
					// 		co_id_user: req.user.co_id,
					// 		co_id: row_co.co_id
					// 	};
					// 	if (!req.body.va_id) row_ac.ac_type = 10;
					// 	else row_ac.ac_type = 11;
					// 	if (req.body.va_status == 1) row_ac.ac_type = 13;
					// 	if (req.body.va_status == 2) row_ac.ac_type = 15;
					// 	if (req.body.va_status == 3) row_ac.ac_type = 16;
					// 	if (req.body.va_status == 4) row_ac.ac_type = 12;
					// 	if (req.body.va_status == 5) row_ac.ac_type = 14;
					// 	Actions.create(row_ac).exec((errsql, row_ac) => {
					// 		if (errsql) console.warn("errsql", errsql);
					// 		nextS();
					// 	});
					// }
				],
				() => {
					next(null, row_va);
				}
			);
		});
	}
	create_1_0(req, res) {
		this._updateOrCreate(req, res, (err, row_va) => {
			if (err) return res.send(err);
			let row_co, row_li, row_ag, rows_co_manager, rows_co_vacationsupervisor;
			async.series(
				[
					next => {
						Contacts.findOne({ co_id: row_va.co_id_user }).exec((errsql, _row_co) => {
							if (errsql) console.warn("errsql", errsql);
							row_co = _row_co;
							next();
						});
					},
					next => {
						Lists.findOne({ li_id: row_va.va_type }).exec((errsql, _row_li) => {
							if (errsql) console.warn("errsql", errsql);
							row_li = _row_li;
							next();
						});
					},
					// next => {
					// 	Agencies.findOne({ ag_id: row_va.ag_id }).exec((errsql, _row_ag) => {
					// 		if (errsql) console.warn("errsql", errsql);
					// 		row_ag = _row_ag;
					// 		next();
					// 	});
					// }
					next => {
						Services.findVacationsManagers(_rows_co_manager => {
							rows_co_manager = _rows_co_manager;
							async.eachSeries(
								rows_co_manager,
								(row_co_manager, nextManager) => {
									if (row_co_manager.co_id == row_va.co_id_user) {
										nextManager();
										return;
									}
									let myemail = Shared.getContactEmail(row_co_manager);
									if (myemail) {
										EmailSender.send(
											res,
											Shared.completeName(row_co_manager) + " <" + myemail + ">",
											"Absence à vérifier pour " + Shared.completeName(row_co),
											"vacationvalidationmanager",
											{
												row_co_manager: row_co_manager,
												row_co: row_co,
												row_va: row_va,
												row_li: row_li,
												row_ag: row_ag
											},
											{},
											() => {
												nextManager();
											}
										);
										// sails.hooks.email.send(
										// 	"vacationvalidationmanager",
										// 	{
										// 		row_co_manager: row_co_manager,
										// 		row_co: row_co,
										// 		row_va: row_va,
										// 		row_li: row_li,
										// 		row_ag: row_ag
										// 	},
										// 	{
										// 		to: Shared.completeName(row_co_manager) + " <" + myemail + ">",
										// 		subject: "MyWellJob > Absence à vérifier pour " + Shared.completeName(row_co)
										// 	},
										// 	err => {
										// 		if (err) console.warn(err || "Mail sended!");
										// 		nextManager();
										// 	}
										// );
									} else nextManager();
								},
								() => {
									next();
								}
							);
						});
					}
					// next => {
					// 	Services.findVacationSupervisors(_rows_co_vacationsupervisor => {
					// 		rows_co_vacationsupervisor = _rows_co_vacationsupervisor;
					// 		async.eachSeries(
					// 			rows_co_vacationsupervisor,
					// 			(row_co_manager, nextManager) => {
					// 				let myemail = Shared.getContactEmail(row_co_manager);
					// 				if (myemail) {
					// 					sails.hooks.email.send(
					// 						"vacationvalidationsupervisor",
					// 						{
					// 							row_co_manager: row_co_manager,
					// 							row_co: row_co,
					// 							row_va: row_va,
					// 							row_vt: row_vt,
					// 							row_ag: row_ag
					// 						},
					// 						{
					// 							to: Shared.completeName(row_co_manager) + " <" + Shared.getContactEmail(row_co_manager) + ">",
					// 							subject: "MyWellJob > Absence à valider " + row_ag.ag_name
					// 						},
					// 						err => {
					// 							if (err) console.warn(err || "Mail sended!");
					// 							nextManager();
					// 						}
					// 					);
					// 				} else nextManager();
					// 			},
					// 			() => {
					// 				next();
					// 			}
					// 		);
					// 	});
					// }
				],
				() => {
					Services.sendWebservices(res, {
						err: null,
						data: row_va,
						emailsSended: true,
						supervisors: rows_co_vacationsupervisor,
						managers: rows_co_manager
					});
					// res.ok({
					// 	data: row_va,
					// 	emailsSended: true,
					// 	supervisors: rows_co_vacationsupervisor,
					// 	managers: rows_co_manager
					// });
				}
			);
		});
	}
	update_1_0(req, res) {
		this._updateOrCreate(req, res, (err, row_va) => {
			if (err) return res.send(err);
			// res.ok({ data: row_va });
			// console.log("row_va", row_va);
			Services.sendWebservices(res, { err: null, data: row_va });
		});
	}
	destroy_1_0(req, res) {
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Vacations.findOne({ pr_id: req.params.va_id }).exec((errsql, _row_va) => {
						if (!_row_va) return nextAllow(Services.err(404));
						// row_pr = _row_pr;
						nextAllow();
					});
				},
				// nextAllow => {
				// 	if (!Policies.allowProductDestroy(req.user, row_pr)) return nextAllow(Services.err(403));
				// 	nextAllow();
				// }
				nextAllow => {
					Vacations.update({ va_id: req.params.va_id }, { va_deleted: deleted }).exec((errsql, row) => {
						nextAllow();
					});
				},
				nextAllow => {
					Logs.create({ co_id_user: req.user.co_id, va_id: req.params.va_id, lg_type: "vacation_deleted" }).exec((errsql, _row_hi) => {
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, success: true });
			}
		);
		// Vacations.findOne({ va_id: req.params.id }).exec((errsql, row_va) => {
		// 	if (errsql) console.warn("errsql", errsql);
		// 	let logs = {
		// 		co_id_user: req.user.co_id,
		// 		lo_text: "Effacement:" + JSON.stringify(row_va, null, "\t"),
		// 		va_id: req.params.id
		// 	};
		// 	Vacations.destroy({ va_id: req.params.id }).exec((errsql, row_va) => {
		// 		if (errsql) console.warn("errsql", errsql);
		// 		Logs.create(logs).exec((errsql, row_lo) => {
		// 			if (errsql) console.warn("errsql", errsql);
		// 			res.ok({ data: { ok: "ok" } });
		// 		});
		// 	});
		// });
	}
	currentinfos_1_0(req, res) {
		Contacts.findOne({ co_id: req.params.co_id }).exec((errsql, row_co) => {
			if (errsql) console.warn("errsql", errsql);
			Vacations.find({ co_id_user: req.params.co_id }).exec((errsql, rows_va) => {
				if (errsql) console.warn("errsql", errsql);
				let vacations_current = 0;

				async.eachSeries(
					rows_va,
					(row_va, nextSerie) => {
						Lists.findOne({ li_id: row_va.va_type }).exec((errsql, row_li) => {
							if (errsql) console.warn("errsql", errsql);
							if (row_li.li_options.indexOf("deduction") >= 0 && row_va.va_status == 1)
								vacations_current += Shared.getNbOpenDays(row_va.va_start, row_va.va_end, row_va.va_start2, row_va.va_end2);
							nextSerie();
						});
					},
					() => {
						if (!row_co.co_vacations_pris) row_co.co_vacations_pris = 0;
						if (!row_co.co_vacations_acquis) row_co.co_vacations_acquis = 0;
						if (!row_co.co_vacations_prisn1) row_co.co_vacations_prisn1 = 0;
						if (!row_co.co_vacations_acquisn1) row_co.co_vacations_acquisn1 = 0;
						if (!row_co.co_vacations_import) row_co.co_vacations_import = new Date();
						res.send({
							data: {
								vacations_current: vacations_current,
								vacations_pris: row_co.co_vacations_pris,
								vacations_acquis: row_co.co_vacations_acquis,
								vacations_prisn1: row_co.co_vacations_prisn1,
								vacations_acquisn1: row_co.co_vacations_acquisn1,
								vacations_import: row_co.co_vacations_import
							}
						});
					}
				);
			});
		});
	}
	exportremainings_1_0(req, res) {
		let fs = require("fs"),
			path = require("path"),
			root = sails.config.appPath,
			uploadPathDir = root + path.sep + "uploads" + path.sep,
			myfile = "RemainingsDays.csv";
		let json2csv = require("json2csv");
		// let fields = ['Agences', 'Salarié', 'Acquis N-1', 'Acquis N', 'COMPTABLE Pris N-1', 'COMPTABLE Pris N par anticipation', 'Pris N-1', 'Pris N par anticipation', 'Reste'];
		let fields = ["Agences", "Salarié", "Acquis N-1", "Pris N-1", "Reste N-1"];
		let myCars = [];
		Contacts.query("select t1.* from contacts t1 where co_type!='contact' && co_type!='customer' && deleted=0", [], (errsql, rows_co) => {
			if (errsql) console.warn("errsql", errsql);
			async.eachSeries(
				rows_co,
				(row_co, nextCo) => {
					Services.getAgenciesForContact(row_co.co_id, agencies => {
						Vacations.find({ co_id_user: row_co.co_id }).exec((errsql, rows_va) => {
							if (errsql) console.warn("errsql", errsql);
							let vacations_current = 0;

							async.eachSeries(
								rows_va,
								(row_va, nextSerie) => {
									VacationsTypes.findOne({ vt_id: row_va.va_type }).exec((errsql, row_vt) => {
										if (errsql) console.warn("errsql", errsql);
										if (row_vt.vt_deduction && row_va.va_status == 1)
											vacations_current += Shared.getNbOpenDays(
												row_va.va_start,
												row_va.va_end,
												row_va.va_start2,
												row_va.va_end2
											);
										nextSerie();
									});
								},
								() => {
									let vacations_pris = row_co.co_vacations_pris * 1;
									// let vacations_acquis = row_co.co_vacations_acquis * 1;
									let vacations_prisn1 = row_co.co_vacations_prisn1 * 1;
									let vacations_acquisn1 = row_co.co_vacations_acquisn1 * 1;
									// let vacations_current = vacations_current*1 ;
									// let vacations_import = row_co.co_vacations_import;
									// let reste = vacations_acquisn1 + vacations_acquis - (vacations_pris + vacations_prisn1 + vacations_current);

									vacations_prisn1 = vacations_prisn1 + vacations_current;
									if (vacations_prisn1 >= vacations_acquisn1) {
										vacations_pris = vacations_prisn1 - vacations_acquisn1 + vacations_pris;
										vacations_prisn1 = vacations_acquisn1;
									}
									if (vacations_pris > 0) {
									} //else reste = reste - vacations_acquis;
									let txtAgencies = [];
									_.each(agencies, agency => {
										txtAgencies.push(agency.ag_name);
									});
									let resten1 = vacations_acquisn1 - vacations_prisn1;
									myCars.push({
										Agences: txtAgencies.join(", "),
										Salarié: Shared.completeName(row_co),
										"Acquis N-1": (vacations_acquisn1 + "").replace(".", ","),
										// 'Acquis N': (vacations_acquis+'').replace('\.',','),
										// 'COMPTABLE Pris N-1': (row_co.co_vacations_prisn1+'').replace('\.',','),
										// 'COMPTABLE Pris N par anticipation': (row_co.co_vacations_pris+'').replace('\.',','),
										"Pris N-1": (vacations_prisn1 + "").replace(".", ","),
										// 'Pris N par anticipation': (vacations_pris+'').replace('\.',','),
										"Reste N-1": (resten1 + "").replace(".", ",")
									});
									nextCo();
								}
							);
						});
					});
				},
				() => {
					json2csv({ data: myCars, fields: fields, del: ";" }, (err, csv) => {
						fs.writeFile(uploadPathDir + myfile, csv, err => {
							if (err) throw err;
							let iconv = require("iconv-lite");
							// console.log('file saved');
							res.setHeader(
								"Content-disposition",
								"attachment; filename=export_jours_restants_" + moment().format("YYYY-MM-DD") + ".csv"
							);
							res.setHeader("Content-type", "application/vnd.ms-excel");
							// let filestream = fs.createReadStream(uploadPathDir+myfile);
							// filestream.pipe(res);
							fs
								.createReadStream(uploadPathDir + myfile)
								.pipe(iconv.decodeStream("utf8"))
								.pipe(iconv.encodeStream("win1252"))
								.pipe(res);
						});
					});
				}
			);
		});
	}
};
