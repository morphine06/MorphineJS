"use strict";

// var moment = require('moment');
// moment.locale('fr');
var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	exportcandidat_1_0(req, res) {
		var ExcelBuilder = require("excel-builder");
		var slug = require("slug");
		// var basicReport = new ExcelBuilder.Template.BasicReport();
		Candidates.findOne(req.params.ca_id).exec(function(errsql, row_ca) {
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
			_.each(subtasks, function(subtask) {
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
				.then(function(data) {
					res.set({
						"Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						"Content-Disposition": 'attachment; filename="candidat-' + slug(row_ca.ca_name + " " + row_ca.ca_firstname) + '.xlsx"'
					});
					res.send(new Buffer(data));
				})
				.catch(function(e) {
					console.error(e);
					res.status(500);
					res.send(e);
				});
		});
		// var data = [[2541,"Nullam aliquet mi et nunc tempus rutrum.",260,"Seattle, WA",1342372604000,1342977404000],[2542,"Cras tristique massa ut magna venenatis pellentesque.",170,"Bothel, WA",1341767804000,1341767804000]] ;
		// var columns = [
		//     {id: 'id', name: "ID", type: 'number', width: 20},
		//     {id: 'name', name:"Name", type: 'string', width: 50},
		//     {id: 'price', name: "Price", type: 'number', style: basicReport.predefinedFormatters.currency.id},
		//     {id: 'location', name: "Location", type: 'string'},
		//     {id: 'startDate', name: "Start Date", type: 'date', style: basicReport.predefinedFormatters.date.id, width: 15},
		//     {id: 'endDate', name: "End Date", type: 'date', style: basicReport.predefinedFormatters.date.id, width: 15}
		// ];
		//
		// var worksheetData = [
		//     [
		//         {value: "ID", type: 'string'}},
		//         {value: "Name", type: 'string'}},
		//         {value: "Price", type: 'string'}},
		//         {value: "Location", type: 'string'}},
		//         {value: "Start Date", type: 'string'}},
		//         {value: "End Date", type: 'string'}}
		//     ]
		// ].concat(data);

		// basicReport.setHeader([
		//     {bold: true, text: "Generic Report"}, "", ""
		// ]);
		// basicReport.setData(worksheetData);
		// // basicReport.setColumns(columns);
		// basicReport.setFooter([
		//     '', '', 'Page &P sur &N'
		// ]);
		//
		// var worksheet = basicReport.getWorksheet();
		//
		// var sheetView = new ExcelBuilder.SheetView;
		// // sheetView.rightToLeft = true;
		// worksheet.sheetView = sheetView;

		// ExcelBuilder.Builder.createFile(basicReport.prepare(), {
		//     type: 'uint8array'
		// }).then(function (data) {
		//     res.set({
		//         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		//         'Content-Disposition': 'attachment; filename="demo.xlsx"'
		//     });
		//     res.send(new Buffer(data));
		// }).catch(function (e) {
		//     console.error(e);
		//     res.status(500);
		//     res.send(e);
		// });
	}
	import_1_0(req, res) {
		// var fs = require('fs'),
		//     path = require('path'),
		//     root = sails.config.appPath,
		//     uploadPathDir = root + path.sep + "uploads" + path.sep;
		//
		// var XLSX = require('xlsx-style');
		// var workbook = XLSX.readFile(uploadPathDir + "welljob-export.xlsx");
		// var first_sheet_name = workbook.SheetNames[0];
		// var worksheet = workbook.Sheets[first_sheet_name];
		// var range = XLSX.utils.decode_range(worksheet['!ref']);
		// var nbCols = range.e.c;
		// var nbRows = range.e.r;
		// var all = [] ;
		// for(var j = 0; j <= nbRows; j++) {
		//     var row = XLSX.utils.encode_row(j);
		//     var data = {};
		//     for(var i2 = 0; i2 <= nbCols; i2++) {
		//         var col2 = XLSX.utils.encode_col(i2);
		//         if (j>=3) {
		//             if (worksheet[col2 + row] && worksheet[col2 + row].v) {
		//                 // console.log("title", col2,row, worksheet[col2 + row].v+'');
		//                 if (col2=="A") data.ca_company = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="B") data.ca_group = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="C") data.ca_name = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="D") data.ca_firstname = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="E") data.ag_id = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="F") data.ca_agency = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="G") data.ca_type = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="H") {
		//                     data.ca_post = worksheet[col2 + row].v+''*1 ;
		//                     data.ca_posttotake = worksheet[col2 + row].v+''*1 ;
		//                 }
		//                 // if (col2=="I") data.pris = "" ;
		//                 if (col2=="J") data.ca_nbhours = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="K") data.ca_salary = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="L") data.ca_salaryvariable = worksheet[col2 + row].v+''*1 ;
		//                 // if (col2=="M") data.ca_purcent = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="N") data.ca_purcent = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="O") data.ca_planning = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="P") data.ca_13months = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="Q") data.ca_dfs = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="R") data.ca_car = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="T") data.ca_meal = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="U") data.ca_tel = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="W") data.ca_insurance = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="X") data.ca_participation = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="Y") data.ca_software = worksheet[col2 + row].v+''.trim() ;
		//                 if (col2=="Z") data.ca_clause = worksheet[col2 + row].v+''*1 ;
		//                 if (col2=="AA") data.ca_positivepoints = worksheet[col2 + row].v+''.trim() ;
		//             }
		//
		//         }
		//     }
		//     if (data.ca_name && data.ca_firstname) {
		//         all.push(data);
		//     }
		// }
		// async.eachSeries(all, function (data, next) {
		//     Contacts.create({
		//         co_name: data.ca_name,
		//         co_firstname: data.ca_firstname,
		//         co_type: 'candidate'
		//     }).then(function (row_co) {
		//         data.ca_name = data.ca_firstname+" "+data.ca_name ;
		//         data.co_id = row_co.co_id ;
		//         Candidates.create(data).then(function (row_ca) {
		//             next() ;
		//         }) ;
		//     }) ;
		// }) ;
		res.ok();
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
			.exec(function(errsql, rows_ca) {
				if (errsql) console.warn("errsql", errsql);
				res.send({ data: rows_ca });
			});
	}
	destroy_1_0(req, res) {
		Candidates.findOne(req.params.id).exec(function(errsql, row_ca) {
			if (errsql) console.warn("errsql", errsql);
			// Contacts.destroy({co_id:row_ca.co_id}).then(function () {
			Candidates.destroy({ ca_id: row_ca.ca_id }).exec(function(errsql) {
				if (errsql) console.warn("errsql", errsql);
				res.ok();
			});
			// }) ;
		});
	}
	changestatus_1_0(req, res) {
		Candidates.update({ ca_id: req.body.ca_id }, { ca_status: req.body.ca_status }).exec(function(errsql, row_ca) {
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
			Actions.create(row_ac).exec(function(errsql, _row_ac) {
				if (errsql) console.warn("errsql", errsql);
				res.send({ data: row_ca });
			});
		});
	}
	findone_1_0(req, res) {
		// console.log("req.params.id", req.params.id);
		if (req.params.id == -1) {
			// console.log("create");
			var row_ca = Candidates.createEmpty();
			// console.log("create2");
			row_ca.hasContact = false;
			row_ca.co_id = null;
			res.send({
				data: row_ca
			});
		} else {
			Candidates.findOne({ ca_id: req.params.id })
				// .populate('co_id')
				.populate("ag_id")
				.exec(function(errsql, row_ca) {
					if (errsql) console.warn("errsql", errsql);
					Contacts.findOne({ ca_id: row_ca.ca_id }).exec(function(errsql, row_co) {
						if (errsql) console.warn("errsql", errsql);
						row_ca.hasContact = false;
						row_ca.co_id = null;
						if (row_co) {
							row_ca.hasContact = true;
							row_ca.co_id = row_co;
						}
						res.send({
							data: row_ca
						});
					});
				});
		}
	}
	_updateOrCreate(req, next) {
		var ca_id = req.body.ca_id;
		// console.log("req.body", req.body);
		// delete(req.body.ca_id) ;
		// req.body.ca_id = 0 ;
		var row_ca = null;
		// var row_co = null;
		var createCa = false;
		if (!ca_id) {
			req.body.co_type = "candidate";
			req.body.createdCo = req.user.co_id;
			createCa = true;
		}
		if (!req.body.ca_ca_type) req.body.ca_ca_type = 0;
		req.body.updatedCo = req.user.co_id;
		if (!moment(req.body.ca_birthday).isValid()) delete req.body.ca_birthday;
		// req.body.ca_name = req.body.co_firstname+" "+req.body.co_name ;
		async.series(
			[
				function(nextSerie) {
					Candidates.updateOrCreate(
						{ ca_id: ca_id },
						req.body,
						function(err, _row_ca) {
							row_ca = _row_ca;
							nextSerie();
						},
						{
							co_id_user: req.user.co_id
						}
					);
				},
				// function (nextSerie) {
				//     Contacts.updateOrCreate({co_id: row_ca.co_id}, req.body, function (err, _row_co) {
				//         row_co = _row_co ;
				//         nextSerie() ;
				//     });
				// },
				// function (nextSerie) {
				//     // Candidates.dontlog = true ;
				//     Candidates
				//     .update({ca_id: row_ca.ca_id}, {co_id: row_co.co_id})
				//     .then(function (_row_ca) {
				//         row_co = _row_ca ;
				//         nextSerie() ;
				//     });
				//
				// },
				function(nextSerie) {
					var row_ac = {
						ac_date: new Date(),
						ca_id: row_ca.ca_id,
						co_id_user: req.user.co_id
						// co_id: row_co.co_id
					};
					// console.log("req.body", req.body);
					if (createCa) row_ac.ac_type = 20;
					else row_ac.ac_type = 21;
					Actions.create(row_ac).exec(function(errsql, _row_ac) {
						if (errsql) console.warn("errsql", errsql);
						nextSerie();
					});
				}
				// function (nextSerie) {
				//     var row_lo = {
				//         lo_type: 21,
				// 		ca_id: row_ca.ca_id,
				// 		co_id_user: req.user.co_id,
				// 		co_id: row_co.co_id
				// 	} ;
				//     if (!req.body.ca_id || req.body.ca_id==='') row_lo.lo_type = 20 ;
				//     Logs
				//     .create(row_lo)
				//     .then(function (_row_lo) {
				//         nextSerie() ;
				//     }) ;
				// }
			],
			function() {
				next(row_ca);
			}
		);
	}
	update_1_0(req, res) {
		this._updateOrCreate(req, function(row_ca) {
			res.send({
				data: row_ca
			});
		});
	}
	create_1_0(req, res) {
		this._updateOrCreate(req, function(row_ca) {
			res.send({
				data: row_ca
			});
		});
	}
	savesubtasksfile_1_0(req, res) {
		req.file(req.body.name).upload(
			{
				maxBytes: 10000000
			},
			function whenDone(err, uploadedFiles) {
				// console.log("err", err, uploadedFiles);
				if (err) {
					return res.ok({
						success: false
					});
				}
				var fs = require("fs"),
					path = require("path"),
					fn = "00_" + req.body.ca_id + "_" + req.body.num,
					root = sails.config.appPath,
					uploadPathDir = root + path.sep + "uploads" + path.sep;
				if (!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
				fs.renameSync(uploadedFiles[0].fd, uploadPathDir + fn);
				Candidates.findOne(req.body.ca_id).exec(function(errsql, row_ca) {
					if (errsql) console.warn("errsql", errsql);
					// console.log("row_ca.ca_subtasks",row_ca.ca_subtasks);
					row_ca.ca_subtasks["subtask_filename_" + req.body.num] = uploadedFiles[0].filename;
					Candidates.update(row_ca.ca_id, { ca_subtasks: row_ca.ca_subtasks }).exec(function(errsql, _rows_ca) {
						if (errsql) console.warn("errsql", errsql);
						res.ok({ filename: fn });
					});
				});
			}
		);
	}
	savesubtasks_1_0(req, res) {
		Candidates.update({ ca_id: req.body.ca_id }, { ca_subtasks: req.body }).exec(function(errsql, rows_ca) {
			if (errsql) console.warn("errsql", errsql);
			res.send({ data: rows_ca[0] });
		});
	}
	downloadsubtasks_1_0(req, res) {
		var path = require("path"), //fs = require("fs"),
			fn = "00_" + req.params.ca_id + "_" + req.params.num,
			root = sails.config.appPath,
			uploadPathDir = root + path.sep + "uploads" + path.sep;

		// var SkipperDisk = require('skipper-disk');
		// var fileAdapter = SkipperDisk(/* optional opts */);

		Candidates.findOne(req.params.ca_id).exec(function(errsql, row_ca) {
			// if (errsql) console.log("errsql",errsql);
			// fileAdapter.read(uploadPathDir+fn)
			// .on('error', function (err){
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
