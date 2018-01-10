"use strict";

var BaseController = require("../BaseController");

var margeLeft = 30,
	// posX = margeLeft,
	posY = 20,
	wpage = 550,
	numPage = 0,
	txt = "",
	col0 = 10,
	// wcol0 = 40,
	col1 = 50,
	wcol1 = 100,
	col2 = 150,
	wcol2 = 210,
	col3 = 330,
	wcol3 = 80,
	col4 = 380,
	wcol4 = 100,
	col5 = 440,
	wcol5 = 100,
	doc = null;

module.exports = class extends BaseController {
	_printHeader(row_in) {
		doc.addPage({ margin: 0 });
		numPage++;
		posY = 20;

		doc.image(morphineserver.rootDir + "/assets/images/logo-plastifrance.png", 300, posY, { width: 200 });

		doc
			.font("Helvetica-Bold")
			.fillColor("black")
			.fontSize(20);
		doc.text("DEMANDE DE PRIX", margeLeft, posY);
		doc.moveDown(0);
		doc
			.font("Helvetica-Bold")
			.fillColor("#8bc34a")
			.fontSize(20);
		doc.text(row_in.in_num);

		if (numPage == 1) {
			posY = 100;
			if (row_in.co_id_contact) {
				txt = "";
				txt += Shared.completeName(row_in.co_id_contact).toUpperCase() + "\n";
				doc
					.font("Helvetica-Bold")
					.fillColor("black")
					.fontSize(11);
				doc.text(txt, margeLeft, posY);
				doc.moveDown(0);
				if (row_in.co_id_contact2) {
					txt = "";
					txt += Shared.completeName(row_in.co_id_contact2).toUpperCase() + "\n";
					doc
						.font("Helvetica")
						.fillColor("black")
						.fontSize(11);
					doc.text(txt);
					doc.moveDown(0);
				}
				txt = "";
				txt += Shared.completeAddress(row_in.ad_id_invoice, false, false) + "";
				if (row_in.co_id_contact.co_tel1) txt += "\nTél : " + row_in.co_id_contact.co_tel1;
				// if (row_in.co_id_contact.co_mobile1) txt += "Mobile : " + row_in.co_id_contact.co_mobile1;
				if (row_in.co_id_contact.co_email1) txt += "\nEmail : " + row_in.co_id_contact.co_email1;
				doc
					.font("Helvetica")
					.fillColor("#aaaaaa")
					.fontSize(11);
				doc.text(txt);
			}

			if (row_in.co_id_user) {
				txt = "";
				txt += "PLASTIFRANCE\n";
				doc
					.font("Helvetica-Bold")
					.fillColor("black")
					.fontSize(11);
				doc.text(txt, 350, posY);
				doc.moveDown(0);
				txt = "";
				txt += Shared.completeName(row_in.co_id_user) + "\n";
				if (row_in.co_id_user.co_tel1) txt += "\nTél : " + row_in.co_id_user.co_tel1;
				// if (row_in.co_id_user.co_mobile1) txt += "\nMobile : " + row_in.co_id_user.co_mobile1;
				if (row_in.co_id_user.co_email1) txt += "\nEmail : " + row_in.co_id_user.co_email1;
				doc
					.font("Helvetica")
					.fillColor("#aaaaaa")
					.fontSize(11);
				doc.text(txt);
			}

			doc
				.font("Helvetica-Bold")
				.fillColor("black")
				.fontSize(11);
			doc.text(row_in.in_object, 350, posY + 80, { width: 230 });

			posY = 220;
			txt = "";
			txt += "Monsieur,\nNous vous prions de trouver ci-dessous notre meilleure offre de prix pour les produits suivants";
			doc
				.font("Helvetica")
				.fillColor("black")
				.fontSize(11);
			doc.text(txt, margeLeft, posY);
			posY = 260;
		} else {
			posY = 100;
		}

		doc.rect(margeLeft, posY, wpage, 40).fill("#8bc34a");

		posY += 10;

		doc
			.font("Helvetica")
			.fillColor("black")
			.fontSize(10);
		doc.text("RÉFÉRENCE\nPLASTIFRANCE", margeLeft + col1, posY);
		doc.text("DESCRIPTIF\nARTICLE", margeLeft + col2, posY);
		doc.text("QTE MINI À\nCOMMANDER", margeLeft + col3, posY, { align: "right", width: wcol3 });
		doc.text("PRIX\n(€/1000 P)", margeLeft + col4, posY, { align: "right", width: wcol4 });
		doc.text("MONTANT\n ", margeLeft + col5, posY, { align: "right", width: wcol4 });

		doc.moveDown(3);
		posY += 40;
	}
	print_1_0(req, res) {
		let fs = require("fs-extra");
		let PDFDocument = require("pdfkit");
		doc = new PDFDocument({ autoFirstPage: false });

		posY = 20;
		numPage = 0;
		txt = "";

		let row_in;
		async.series(
			[
				nextSer => {
					Invoices.findOne({ in_id: req.params.in_id })
						.populate("co_id_user")
						.populate("co_id_contact")
						.populate("co_id_contact2")
						.populate("ad_id_invoice")
						.populate("ad_id_delivery")
						.populate("co_id_contact")
						.populate("op_id")
						// .populate("in_call_co_id")
						.exec((errsql, _row_in) => {
							row_in = _row_in;
							InvoicesLines.find("in_id=?", [row_in.in_id])
								.populate("pr_id")
								.exec((errsql, rows_il) => {
									row_in.rows_il = rows_il;
									nextSer();
								});
						});
				},
				nextSer => {
					this._printHeader(row_in);

					// les lignes
					_.each(row_in.rows_il, row_il => {
						// console.log("row_il", row_il);
						let maxheight = 0;
						if (row_il.pr_id && row_il.pr_id.ga_id) {
							let pathimg = morphineserver.rootDir + "/uploads/gamme_" + row_il.pr_id.ga_id + "_2";
							if (fs.existsSync(pathimg)) {
								doc.image(pathimg, margeLeft + col0, posY, { width: 30 });
								// console.log("doc", doc);
								let img = doc._imageRegistry[pathimg];
								// console.log("img", img.width, img.height);
								let hTemp = 30 * img.height / img.width;
								// console.log("hTemp", hTemp, doc.y);
								if (maxheight < doc.y + hTemp) maxheight = doc.y + hTemp;
							}
						}
						doc
							.font("Helvetica")
							.fillColor("black")
							.fontSize(10);
						doc.text(row_il.pr_name, margeLeft + col1, posY, { width: wcol1 });
						if (maxheight < doc.y) maxheight = doc.y;
						let txt22 = "";
						if (row_il.il_description2) txt22 += row_il.il_description2 + "\n";
						txt22 += row_il.il_description;
						doc.text(txt22, margeLeft + col2, posY, { width: wcol2 });
						if (maxheight < doc.y) maxheight = doc.y;
						doc.text("* " + Services.number_format(row_il.il_qte * 1, 0, ",", ".") + "", margeLeft + col3, posY, {
							width: wcol3,
							align: "right"
						});
						doc.text(Services.number_format(row_il.il_puht, 2, ",", ".") + " €", margeLeft + col4, posY, {
							width: wcol4,
							align: "right"
						});
						doc.text(Services.number_format(row_il.il_sumht, 2, ",", ".") + " €", margeLeft + col5, posY, {
							width: wcol5,
							align: "right"
						});
						doc.moveDown(0.5);

						// console.log("row_il.il_variations", row_il.il_variations);
						if (!_.isArray(row_il.il_variations)) row_il.il_variations = [];
						_.each(row_il.il_variations, variation => {
							// console.log("variation", variation);
							doc.moveDown(0);
							let posYtemp = doc.y;
							doc.text(Services.number_format(variation.qte * 1, 0, ",", ".") + "", margeLeft + col3, posYtemp, {
								width: wcol3,
								align: "right"
							});
							doc.text(Services.number_format(variation.price, 2, ",", ".") + " €", margeLeft + col4, posYtemp, {
								width: wcol4,
								align: "right"
							});
							if (doc.y > 600) {
								// console.log("here", doc.y);
								this._printHeader(row_in);
								maxheight = doc.y;
							}
						});
						if (maxheight < doc.y) maxheight = doc.y;

						maxheight += 5;

						let txtOpts = [];
						if (row_il.il_colisage) txtOpts.push("Qté/emballage : " + row_il.il_colisage);
						if (row_il.il_delay) txtOpts.push("Délai : " + row_il.il_delay);
						if (row_il.il_refcustomer) txtOpts.push("Votre référence : " + row_il.il_refcustomer);
						if (row_il.il_qtestock * 1 > 0) txtOpts.push("Stock : " + Services.number_format(row_il.il_qtestock, 0, ",", "."));

						doc
							.font("Helvetica-Bold")
							.fillColor("#8bc34a")
							.fontSize(10);
						doc.text(txtOpts.join(" | "), margeLeft + col1, maxheight, { width: wpage });
						doc.moveDown(0);

						doc
							.strokeColor("#aaaaaa")
							.moveTo(margeLeft, doc.y + 5)
							.lineTo(margeLeft + wpage, doc.y + 5)
							.stroke();
						posY = doc.y + 15;

						if (doc.y > 600) {
							// console.log("here2", doc.y);
							this._printHeader(row_in);
						}
					});

					doc
						.font("Helvetica")
						.fillColor("#aaaaaa")
						.fontSize(10);
					doc.text(
						"Les commandes de produits devront correspondre à un multiple entier du nombre de pièces Qté/emballage.",
						margeLeft + col1,
						posY,
						{ width: 300, align: "left" }
					);

					doc
						.font("Helvetica")
						.fillColor("black")
						.fontSize(10);
					doc.text("TOTAL HT *", margeLeft + col4, posY, { width: wpage, align: "left" });
					doc.text(Services.number_format(row_in.in_sumht, 2, ",", ".") + " €", margeLeft + col5, posY, { width: wcol4, align: "right" });

					if (row_in.in_sumremise * 1 > 0) {
						doc.moveDown(0);
						posY = doc.y;
						doc
							.font("Helvetica")
							.fillColor("black")
							.fontSize(10);
						doc.text("TOTAL REMISE", margeLeft + col4, posY, { width: wpage, align: "left" });
						doc.text(Services.number_format(row_in.in_sumremise, 2, ",", ".") + " €", margeLeft + col5, posY, {
							width: wcol4,
							align: "right"
						});
						doc.moveDown(0);
						posY = doc.y;
						doc
							.font("Helvetica")
							.fillColor("black")
							.fontSize(10);
						doc.text("TOTAL HT APRÈS REMISE", margeLeft + col4, posY, { width: wpage, align: "left" });
						doc.text(Services.number_format(row_in.in_sumht - row_in.in_sumremise, 2, ",", ".") + " €", margeLeft + col5, posY, {
							width: wcol4,
							align: "right"
						});
					}

					let labelHT = "NET À PAYER";
					if (row_in.in_usetva) {
						_.each(row_in.in_tvas, tva => {
							doc.moveDown(0);
							posY = doc.y;
							doc.text("TVA " + tva.val + "", margeLeft + col4, posY, { width: wpage, align: "left" });
							doc.text(Services.number_format(tva.sum, 2, ",", ".") + " €", margeLeft + col5, posY, { width: wcol4, align: "right" });
						});
						doc.moveDown(0);
						labelHT = "TOTAL TTC";
					}
					posY = doc.y;
					doc
						.font("Helvetica-Bold")
						.fillColor("black")
						.fontSize(10);
					doc.text(labelHT, margeLeft + col4, posY, { width: wpage, align: "left" });
					doc.text(Services.number_format(row_in.in_sumttc, 2, ",", ".") + " €", margeLeft + col5, posY, { width: wcol4, align: "right" });

					// bas de page
					posY = 600;

					doc.image(morphineserver.rootDir + "/assets/images/pub-contacteznous.png", 350, posY + 60, { width: 200 });

					if (row_in.in_minorder * 1 > 0) {
						doc
							.font("Helvetica-Bold")
							.fillColor("red")
							.fontSize(8);
						doc.text(
							"VALEUR MINIMALE DE LA COMMANDE : " + Services.number_format(row_in.in_minorder, 0, ",", ".") + " €",
							margeLeft,
							posY,
							{
								align: "left",
								width: wpage
							}
						);
						doc.moveDown(1);
					}

					posY = 590;
					doc
						.font("Helvetica-Bold")
						.fillColor("black")
						.fontSize(8);
					doc.text("CONDITIONS GENERALES DE L'OFFRE", margeLeft, posY + 30, { align: "left" });
					doc.moveDown(0);

					doc
						.font("Helvetica")
						.fillColor("black")
						.fontSize(8);
					doc.text(row_in.in_conditions, { align: "left", width: 500 });
					// doc.moveDown(1);
					//
					// doc.text("Délai : 2 semaines à réception de la commande\nCondition de paiement : habituelle\nValidité de l'offre : 2017", {
					// 	align: "left",
					// 	width: wpage
					// });
					// doc.moveDown(1);

					doc.moveDown(1);
					doc
						.font("Helvetica")
						.fillColor("black")
						.fontSize(11);
					doc.text(
						"845 Rue du Pic de Bertagne\nB.P.110—13881 GEMENOS CEDEX France\nS.A.S.U. au capital de 2.600.000 €\nR.C.S Marseille B518 956 560 00016—NAF2229A\nN°TVA Intracom. FR 01 518 956 560",
						margeLeft,
						700,
						{ align: "left", width: wpage }
					);

					nextSer();
				}
			],
			() => {
				// doc.pipe(fs.createWriteStream("/path/to/file.pdf"));
				doc.pipe(res);
				doc.end();
			}
		);
	}
	find_1_0(req, res) {
		let where = "1&1",
			whereData = [];
		if (req.query.deleted == "true") where += "";
		else where += " && in_deleted=0";
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && in_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		if (req.query.datestart) {
			where += " && in_date>=?";
			whereData.push(req.query.datestart);
		}
		if (req.query.datestop) {
			where += " && in_date<=?";
			whereData.push(req.query.datestop);
		}
		if (req.query.co_id) {
			where += " && co_id_user=?";
			whereData.push(req.query.co_id);
		}
		if (req.query.op_id) {
			where += " && op_id=?";
			whereData.push(req.query.op_id);
		}
		// console.log("mytypes", mytypes);
		if (req.query.mytypes) {
			where += " && (0";
			_.each(req.query.mytypes, mytype => {
				where += " || in_type=?";
				whereData.push(mytype);
			});
			where += ")";
		}
		// console.log("where", where);
		Invoices.find(where + " order by in_id desc", whereData)
			.populate("co_id_user")
			.populate("co_id_contact")
			.exec((errsql, rows) => {
				if (errsql) console.warn("errsql", errsql);
				Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
			});
		// console.log("toto");
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilitÃ© d'utiliser TABLE.populate('field')
		if (req.params.in_id == "-1" || req.params.in_id == "-2" || req.params.in_id == "-3") {
			let row = Invoices.createEmpty();
			row.in_id = "";
			row.in_type = "estimate";
			if (req.params.in_id == "-2") row.in_type = "purchaseorder";
			if (req.params.in_id == "-3") row.in_type = "invoice";
			row.in_date = new Date();
			// row.in_conditions =
			// 	"Nos prix s'entendent nets, hors taxes, en €, 1 000 pièces, prix départ, emballage compris pour transport routier, selon nos conditions générales de vente.\nPort avancé sur facture. Franco (en France) à partir de 450€ H.T. Les livraisons express sont à la charge du client.\nEnvoi d'échantillons gratuits sur simple demande.\n\nCondition de paiement : habituelle\nValidité de l'offre : 2017";
			Invoices.findOne("1 order by createdAt DESC").exec((errsql, row_in_last) => {
				if (row_in_last) {
					row.in_conditions = row_in_last.in_conditions;
				}
				Services.smoothContact(req.user, req.user, row_co => {
					row.co_id_user = row_co;
					row.rows_il = [];
					row.rows_ac = [];
					Services.sendWebservices(res, { err: null, data: row });
				});
			});
		} else {
			Invoices.findOne({ in_id: req.params.in_id })
				.populate("co_id_user")
				.populate("co_id_contact")
				.populate("co_id_contact2")
				.populate("ad_id_invoice")
				.populate("ad_id_delivery")
				.populate("co_id_contact")
				.populate("op_id")
				// .populate("in_call_co_id")
				.exec((errsql, row) => {
					if (errsql) console.warn("errsql", errsql);
					if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					row.in_ref = row.in_id;
					// Services.smoothContact(row.co_id_provider, req.user, () => {
					InvoicesLines.find("in_id=?", [row.in_id])
						.populate("pr_id")
						.exec((errsql, rows_il) => {
							row.rows_il = rows_il;
							// _.each(rows_il, row_il => {
							// 	row_il.il_variations = [];
							// });
							Actions.find("in_id=?", [row.in_id]).exec((errsql, rows_ac) => {
								row.rows_ac = rows_ac;
								Services.sendWebservices(res, { err: null, data: row });
							});
						});

					// }) ;
				});
		}
	}
	_saveLines(req, row_in, cb) {
		// let in_sumht = 0;
		// let linesOk = [];
		var eachtab = [];
		for (var i = 0; i < 1000; i++) {
			if (req.body["pr_name_" + i]) eachtab.push(i);
		}
		// console.log("eachtab", eachtab);
		async.eachSeries(
			eachtab,
			function(num, nextLine) {
				var row_il = {
					in_id: row_in.in_id,
					pr_id: req.body["pr_id_" + num],
					pr_name: req.body["pr_name_" + num],
					il_tva: req.body["il_tva_" + num],
					il_sumht: req.body["il_sumht_" + num],
					il_qte: req.body["il_qte_" + num],
					il_puht: req.body["il_puht_" + num],
					il_paht: 0,
					il_remise: req.body["il_remise_" + num],
					il_sumttc: req.body["il_sumht_" + num] * 1.2,
					il_description: req.body["il_description_" + num]
				};
				if (!row_il.pr_id) row_il.pr_id = 0;
				// in_sumht += req.body["il_sumht_" + num] * 1;
				if (req.body["il_id_" + num]) {
					InvoicesLines.update(req.body["il_id_" + num], row_il).exec(function(errsql, ok) {
						if (errsql) console.warn("errsql", errsql);
						// linesOk.push(req.body["il_id_" + num]);
						nextLine();
					});
				} else {
					// console.log("row_il",row_il);
					InvoicesLines.create(row_il).exec(function(errsql, _row_il) {
						if (errsql) console.warn("errsql", errsql);
						// console.log('_',_);
						// linesOk.push(_row_il.il_id);
						nextLine();
					});
				}
			},
			function() {
				// console.log("linestodelete", req.body.linestodelete);
				async.eachSeries(
					req.body.linestodelete,
					(il_id, nextIl) => {
						if (!il_id) return nextIl();
						InvoicesLines.destroy({ il_id: il_id }).exec(function(errsql) {
							if (errsql) console.warn("errsql", errsql);
							nextIl();
						});
					},
					err => {}
				);
				// effacement des lignes en trop
				// InvoicesLines.find({ in_id: row_in.in_id }).exec(function(errsql, rows_il) {
				// 	if (errsql) console.warn("errsql", errsql);
				// 	async.eachSeries(
				// 		rows_il,
				// 		function(row_il, nextLine) {
				// 			if (linesOk.indexOf(row_il.il_id) < 0) {
				// 				InvoicesLines.destroy({ il_id: row_il.il_id }).exec(function(errsql) {
				// 					if (errsql) console.warn("errsql", errsql);
				// 					nextLine();
				// 				});
				// 			} else nextLine();
				// 		},
				// 		function() {
				cb();
				// 		}
				// 	);
				// });
			}
		);
	}
	_getNum(row_in, cb) {
		// let num = "OC" + moment().format("YY") + "/";
		let num = "";
		if (row_in.in_type == "estimate") num += "D";
		if (row_in.in_type == "purchaseorder") num += "C";
		if (row_in.in_type == "invoice") num += "F";
		num += moment().format("YY") + "-";

		Invoices.findOne("in_type=? order by in_num desc", [row_in.in_type]).exec((errsql, _row_in) => {
			let str = 0;
			if (_row_in) {
				str = _row_in.in_num.substring(_row_in.in_num.indexOf("-") + 1, _row_in.in_num.length) * 1;
			}
			str++;
			str += "";
			var pad = "0000";
			var ans = pad.substring(0, pad.length - str.length) + str;
			cb(num + ans);
		});
	}
	create_1_0(req, res) {
		let row_in;
		async.series(
			[
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user)) return nextAllow(Services.err(403));
					nextAllow();
				},
				nextAllow => {
					req.body.in_updatedCo = req.user.co_id;
					req.body.in_createdCo = req.user.co_id;
					Invoices.create(req.body).exec((errsql, row) => {
						if (errsql) console.warn("errsql", errsql);
						row_in = row;
						nextAllow();
					}, true);
				},
				nextAllow => {
					this._saveLines(req, row_in, () => {
						nextAllow();
					});
				},
				nextAllow => {
					this._getNum(row_in, in_num => {
						Invoices.update({ in_id: row_in.in_id }, { in_num: in_num }).exec((errsql, ok) => {
							nextAllow();
						});
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, data: row_in });
			}
		);
	}

	update_1_0(req, res) {
		let row_in;

		delete req.body.ga_id;
		async.series(
			[
				nextAllow => {
					Invoices.findOne({ in_id: req.params.in_id }).exec((errsql, _row_in) => {
						if (!_row_in) return nextAllow(Services.err(404));
						row_in = _row_in;
						nextAllow();
					});
				},
				// nextAllow => {
				// 	if (!Policies.allowAlreadyTrue(req.user, row_pr)) return nextAllow(Services.err(403));
				// 	nextAllow();
				// },
				nextAllow => {
					req.body.in_updatedCo = req.user.co_id;
					Invoices.update({ in_id: req.params.in_id }, req.body).exec((errsql, rows) => {
						if (rows.length === 0) return nextAllow(Services.err(404));
						row_in = rows[0];
						nextAllow();
					}, true);
				},
				nextAllow => {
					this._saveLines(req, row_in, () => {
						nextAllow();
					});
				}
				// nextAllow => {
				// 	this._getNum(row_in, in_num => {
				// 		Invoices.update({ in_id: row_in.in_id }, { in_num: in_num }).exec((errsql, ok) => {
				// 			nextAllow();
				// 		});
				// 	});
				// }
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Services.sendWebservices(res, { err: null, data: row_in });
			}
		);
	}
	destroy_1_0(req, res) {
		let row_in;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Invoices.findOne({ in_id: req.params.in_id }).exec((errsql, _row_in) => {
						if (!_row_in) return nextAllow(Services.err(404));
						row_in = _row_in;
						nextAllow();
					});
				},
				nextAllow => {
					if (!Policies.allowAlreadyTrue(req.user, row_in)) return nextAllow(Services.err(403));
					nextAllow();
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Invoices.update({ in_id: req.params.in_id }, { in_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
	duplicate_1_0(req, res) {
		let row_in_old, rows_il_old, row_in_new;
		async.series(
			[
				next => {
					Invoices.findOne({ in_id: req.params.in_id }).exec((errsql, _row_in_old) => {
						row_in_old = _row_in_old;
						next();
					});
				},
				next => {
					InvoicesLines.find("in_id=?", [row_in_old.in_id]).exec((errsql, _rows_il_old) => {
						rows_il_old = _rows_il_old;
						// console.log("rows_il_old", rows_il_old);
						next();
					});
				},
				next => {
					row_in_old.in_id = "";
					row_in_old.in_type = req.body.in_type;
					this._getNum(row_in_old, in_num => {
						row_in_old.in_num = in_num;
						row_in_old.in_object = row_in_old.in_object + " - copy";
						Invoices.create(row_in_old).exec((errsql, _row_in_new) => {
							row_in_new = _row_in_new;
							next();
						}, true);
					});
				},
				next => {
					async.eachSeries(
						rows_il_old,
						(row_il_old, nextIl) => {
							// console.log("row_il_old", row_il_old);
							row_il_old.il_id = "";
							row_il_old.in_id = row_in_new.in_id;
							InvoicesLines.create(row_il_old).exec((errsql, ok) => {
								nextIl();
							});
						},
						err => {
							next();
						}
					);
				}
			],
			err => {
				Services.sendWebservices(res, { err: null, data: row_in_new });
			}
		);
	}
};
