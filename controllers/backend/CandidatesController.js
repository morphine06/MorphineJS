"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	exportcandidat_1_0(req, res) {
		var ExcelBuilder = require("excel-builder");
		var slug = require("slug");
		// var basicReport = new ExcelBuilder.Template.BasicReport();
		Candidates.findOne(req.params.ca_id).exec((errsql, row_ca) => {
			if (errsql) console.warn("errsql", errsql);
			var workbook = ExcelBuilder.Builder.createWorkbook();
			var sheet = workbook.createWorksheet();
			var stylesheet = workbook.getStyleSheet();

			var formater1 = stylesheet.createFormat({
				font: stylesheet.createFontStyle({
					bold: true,
					size: 16
				}).id
			});
			var formater2 = stylesheet.createFormat({
				font: stylesheet.createFontStyle({
					bold: true,
					size: 13
				}).id
			});

			var originalData = [];
			originalData.push([{ value: "Candidat : " + row_ca.ca_name + " " + row_ca.ca_firstname, metadata: { style: formater1.id } }]);
			originalData.push([{ value: "Imprimé le " + moment().format("DD/MM/YYYY"), metadata: {} }]);
			originalData.push([]);
			originalData.push([{ value: "EN AGENCE : ", metadata: { style: formater2.id } }]);
			var subtasks = Shared.getCandidateSubTasks();
			_.each(subtasks, subtask => {
				if (subtask.key == 100) {
					originalData.push([]);
					originalData.push([{ value: "HORS AGENCE : ", metadata: { style: formater2.id } }]);
				}
				var v1 = row_ca.ca_subtasks["subtask_com_" + subtask.key] ? row_ca.ca_subtasks["subtask_com_" + subtask.key] : "";
				var v2 = row_ca.ca_subtasks["subtask_by_" + subtask.key] ? row_ca.ca_subtasks["subtask_by_" + subtask.key] : "";
				var v3 = row_ca.ca_subtasks["subtask_date_" + subtask.key] ? row_ca.ca_subtasks["subtask_date_" + subtask.key] : "";
				originalData.push([subtask.val, v2, v3, v1]);
			});
			// var originalData = [
			//     [
			//         {value: 'Artist', metadata: {style: boldFormatter.id}},
			//         {value: 'Album', metadata: {style: boldFormatter.id}},
			//         {value: 'Price', metadata: {style: boldFormatter.id}}
			//     ],
			//     ['Buckethead', 'Albino Slug', 8.99],
			//     ['Buckethead', 'Electric Tears', 13.99],
			//     ['Buckethead', 'Colma', 11.34],
			//     ['Crystal Method', 'Vegas', 10.54],
			//     ['Crystal Method', 'Tweekend', 10.64],
			//     ['Crystal Method', 'Divided By Night', 8.99]
			// ];
			sheet.setData(originalData);
			sheet.setColumns([{ width: 30 }, { width: 20 }, { width: 15 }, { width: 30 }]);
			workbook.addWorksheet(sheet);
			ExcelBuilder.Builder.createFile(workbook, {
				type: "uint8array"
			})
				.then(data => {
					res.set({
						"Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						"Content-Disposition": 'attachment; filename="candidat-' + slug(row_ca.ca_name + " " + row_ca.ca_firstname) + '.xlsx"'
					});
					res.send(new Buffer(data));
				})
				.catch(e => {
					console.error(e);
					// res.status(500);
					// res.send(e);
					Services.sendWebservices(res, { err: e, data: {} });
				});
		});
	}
	import_1_0(req, res) {
		Services.sendWebservices(res, { err: null, data: {} });
	}
	find_1_0(req, res) {
		var where = {};

		if (req.query.filterarchives && req.query.filterarchives == "true");
		else where.ca_archive = false;
		if (req.query.filterpost && req.query.filterpost * 1 !== 0) where.ca_posttotake = req.query.filterpost * 1;
		if (req.query.filtercompany && req.query.filtercompany.length) where.ca_company = { contains: req.query.filtercompany };
		if (req.query.filtername && req.query.filtername.length) {
			where.or = [{ ca_name: { contains: req.query.filtername } }, { ca_firstname: { contains: req.query.filtername } }];
		}

		// console.log("where", where);
		Candidates.find(where)
			// .populate('co_id')
			.populate("ag_id")
			.exec((errsql, rows_ca) => {
				if (errsql) console.warn("errsql", errsql);
				// res.send({ data: rows_ca });
				Services.sendWebservices(res, { err: null, data: rows_ca });
			});
	}
	destroy_1_0(req, res) {
		Candidates.findOne(req.params.ca_id).exec((errsql, row_ca) => {
			if (errsql) console.warn("errsql", errsql);
			// Contacts.destroy({co_id:row_ca.co_id}).then(function () {
			Candidates.destroy({ ca_id: row_ca.ca_id }).exec(errsql => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: {} });
			});
			// }) ;
		});
	}
	changestatus_1_0(req, res) {
		Candidates.update({ ca_id: req.body.ca_id }, { ca_status: req.body.ca_status }).exec((errsql, row_ca) => {
			if (errsql) console.warn("errsql", errsql);
			var row_ac = {
				ac_date: new Date(),
				ca_id: req.body.ca_id,
				co_id_user: req.user.co_id
			};
			// console.log("row_ac", row_ac);
			// console.log("req.body", req.body);
			if (req.body.ca_status == 1) row_ac.ac_type = 23;
			else if (req.body.ca_status == 2) row_ac.ac_type = 24;
			else if (req.body.ca_status == 3) row_ac.ac_type = 25;
			else if (req.body.ca_status == 4) row_ac.ac_type = 26;
			else if (req.body.ca_status == 5) row_ac.ac_type = 27;
			// console.log("row_ac", row_ac);
			Actions.create(row_ac).exec((errsql, _row_ac) => {
				if (errsql) console.warn("errsql", errsql);
				// res.send({ data: row_ca });
				Services.sendWebservices(res, { err: null, data: row_ca });
			});
		});
	}
	findone_1_0(req, res) {
		// console.log("req.params.ca_id", req.params.ca_id);
		if (req.params.ca_id == -1) {
			// console.log("create");
			var row_ca = Candidates.createEmpty();
			// console.log("create2");
			row_ca.hasContact = false;
			row_ca.ca_id = "";
			Services.sendWebservices(res, { err: null, data: row_ca });
		} else {
			Candidates.findOne({ ca_id: req.params.ca_id })
				// .populate('co_id')
				.populate("ag_id")
				.exec((errsql, row_ca) => {
					if (errsql) console.warn("errsql", errsql);
					Contacts.findOne({ ca_id: row_ca.ca_id }).exec((errsql, row_co) => {
						if (errsql) console.warn("errsql", errsql);
						row_ca.hasContact = false;
						row_ca.co_id = null;
						if (row_co) {
							row_ca.hasContact = true;
							row_ca.co_id = row_co;
						}
						Services.sendWebservices(res, { err: null, data: row_ca });
					});
				});
		}
	}
	_updateOrCreate(req, cb) {
		var ca_id = req.body.ca_id;
		// console.log("req.body", req.body);
		// delete(req.body.ca_id) ;
		// req.body.ca_id = 0 ;
		var row_ca = null;
		// var row_co = null;
		// var createCa = false;
		if (!ca_id) {
			req.body.co_type = "candidate";
			req.body.createdCo = req.user.co_id;
			// createCa = true;
		}
		if (!req.body.ca_ca_type) req.body.ca_ca_type = 0;
		req.body.updatedCo = req.user.co_id;
		if (!moment(req.body.ca_birthday).isValid()) delete req.body.ca_birthday;
		// req.body.ca_name = req.body.co_firstname+" "+req.body.co_name ;
		async.series(
			[
				nextSerie => {
					if (req.params.ca_id) {
						Candidates.update({ ca_id: ca_id }, req.body).exec((err, _rows_ca) => {
							if (!_rows_ca.length) return nextSerie(Services.err(404));
							row_ca = _rows_ca[0];
							nextSerie();
						}, true);
					} else {
						Candidates.create(req.body).exec((err, _row_ca) => {
							row_ca = _row_ca;
							nextSerie();
						});
					}
				}
			],
			err => {
				cb(err, row_ca);
			}
		);
	}
	update_1_0(req, res) {
		this._updateOrCreate(req, (err, row_ca) => {
			if (err) return Services.sendWebservices(res, { err: err });
			Services.sendWebservices(res, { err: null, data: row_ca });
		});
	}
	create_1_0(req, res) {
		this._updateOrCreate(req, (err, row_ca) => {
			if (err) return Services.sendWebservices(res, { err: err });
			Services.sendWebservices(res, { err: null, data: row_ca });
		});
	}
	savesubtasksfile_1_0(req, res) {
		req.file(req.body.name).upload(
			{
				maxBytes: 10000000
			},
			(err, uploadedFiles) => {
				// console.log("err", err, uploadedFiles);
				if (err) {
					return Services.sendWebservices(res, { err: Services.err(404) });
				}
				var fs = require("fs-extra"),
					path = require("path"),
					fn = "00_" + req.body.ca_id + "_" + req.body.num,
					root = morphineserver.rootDir,
					uploadPathDir = root + path.sep + "uploads" + path.sep + "candidates" + path.sep;
				if (!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
				fs.renameSync(uploadedFiles[0].fd, uploadPathDir + fn);
				Candidates.findOne(req.body.ca_id).exec((errsql, row_ca) => {
					if (errsql) console.warn("errsql", errsql);
					// console.log("row_ca.ca_subtasks",row_ca.ca_subtasks);
					row_ca.ca_subtasks["subtask_filename_" + req.body.num] = uploadedFiles[0].filename;
					Candidates.update(row_ca.ca_id, { ca_subtasks: row_ca.ca_subtasks }).exec((errsql, _rows_ca) => {
						if (errsql) console.warn("errsql", errsql);
						// res.ok({ filename: fn });
						Services.sendWebservices(res, { filename: fn });
					});
				});
			}
		);
	}
	savesubtasks_1_0(req, res) {
		Candidates.update({ ca_id: req.body.ca_id }, { ca_subtasks: req.body }).exec((errsql, rows_ca) => {
			if (errsql) console.warn("errsql", errsql);
			// console.log("rows_ca", rows_ca);
			// res.send({ data: rows_ca[0] });
			Services.sendWebservices(res, { err: null, data: rows_ca[0] });
		}, true);
	}
	downloadsubtasks_1_0(req, res) {
		var path = require("path"), //fs = require("fs"),
			fn = "00_" + req.params.ca_id + "_" + req.params.num,
			root = morphineserver.rootDir,
			uploadPathDir = root + path.sep + "uploads" + path.sep + "candidates" + path.sep;

		Candidates.findOne(req.params.ca_id).exec((errsql, row_ca) => {
			// if (errsql) console.log("errsql",errsql);
			// fileAdapter.read(uploadPathDir+fn)
			// .on('error',  (err)=>{
			//     return res.serverError(err);
			// })
			// .pipe(res);
			res.download(uploadPathDir + fn, row_ca.ca_subtasks["subtask_filename_" + req.params.num]);
		});
	}
	// average_1_0(req, res) {
	// 	Candidates.query(
	// 		"SELECT ca_company, ca_post, avg(ca_salary) as salaverage, min(ca_salary) as salmin, max(ca_salary) as salmax FROM `candidates` WHERE ca_company!='' && ca_salary>0 group by ca_company, ca_post order by ca_company",
	// 		function(err, rows_ca) {
	// 			Candidates.query(
	// 				"SELECT avg(ca_salaryproposed) as salaverage, min(ca_salaryproposed) as salmin, max(ca_salaryproposed) as salmax FROM `candidates` WHERE ca_company!='' && ca_salaryproposed>0",
	// 				function(err, row_ca) {
	// 					var myaverage = {};
	// 					// console.log("row_ca", row_ca);
	// 					if (row_ca) {
	// 						row_ca = row_ca[0];
	// 						myaverage = {
	// 							min: row_ca.salmin,
	// 							max: row_ca.salmax,
	// 							average: row_ca.salaverage
	// 						};
	// 					}
	// 					res.send({ rows_ca: rows_ca, myaverage: myaverage });
	// 				}
	// 			);
	// 		}
	// 	);
	// }
};
