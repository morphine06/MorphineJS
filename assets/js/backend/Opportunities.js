"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Shared } from "./../../compiled/Shared.js";
// import { Services } from "./Services.js";

import { MT_Opportunities } from "../../compiled/models/MT_Opportunities.js";
import { MT_Contacts } from "../../compiled/models/MT_Contacts.js";
import { MT_Actions } from "./../../compiled/models/MT_Actions.js";
import { MT_Invoices } from "./../../compiled/models/MT_Invoices.js";

import { OpportunitiesWinEdit } from "./OpportunitiesWinEdit.js";
import { ActionsWinEdit } from "./ActionsWinEdit.js";
import { InvoicesWinEdit } from "./InvoicesWinEdit.js";

export class Opportunities extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Opportunities.html"];
		opts._currentPanel = 2;
		// opts.tplData = { mycolumns: Shared.getOpportunitiesStates() };
		opts._currentSubViewOpportunities = 2;
		super(opts);
	}
	init() {
		// console.log("M_.Utils.isEventSupported('click')",M_.Utils.isEventSupported('click'));
		// console.log("M_.Utils.isEventSupported('search')",M_.Utils.isEventSupported('search'));
	}
	reloadAll() {
		this.storeOpportunities.load();
		this.actions.store.load();
		this.invoices.store.load();
	}
	create() {
		$("#opportunities_filterreset").click(evt => {
			this.filterUser.reset();
			this.filterDateStart.reset();
			this.filterDateStop.reset();
			this.reloadAll();
		});

		new M_.Help({
			text: "Reset les filtres de recherche",
			attachedObj: $("#opportunities_filterreset")
		});

		this.filterUser = new M_.Form.Combobox({
			type: M_.Form.Combobox,
			name: "co_id_user",
			label: "Utilisateur",
			labelPosition: "top",
			placeholder: "",
			container: $("#opportunities_filter1"),
			modelKey: "co_id",
			modelValue: model => {
				return Shared.completeName(model.getData());
			},
			allowEmpty: false,
			store: new M_.Store({
				controller: this,
				model: MT_Contacts,
				url: "/1.0/contacts",
				limit: 200,
				unshiftRows: [{ co_id: "", co_name: "Tous les utilisateurs" }],
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							args.args.types = ["user", "secretary", "director", "admin"];
						}
					]
				]
			}),
			listeners: [
				[
					"itemclick",
					(tf, val) => {
						this.reloadAll();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.reloadAll();
					}
				]
			]
		});
		this.filterDateStart = new M_.Form.Date({
			name: "datestart",
			label: "Date début",
			labelPosition: "top",
			container: $("#opportunities_filter2"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.reloadAll();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.reloadAll();
					}
				]
			]
		});
		this.filterDateStop = new M_.Form.Date({
			name: "datestop",
			label: "Date fin",
			labelPosition: "top",
			container: $("#opportunities_filter3"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.reloadAll();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.reloadAll();
					}
				]
			]
		});

		this.storeOpportunities = new M_.Store({
			controller: this,
			model: MT_Opportunities,
			primaryKey: "op_id",
			url: "/1.0/opportunities",
			limit: 20000,
			// rootData: 'aides',
			listeners: [
				[
					"beforeLoad",
					(store, args) => {
						// console.log("sdf");
						args.args.co_id = this.filterUser.getValue();
						args.args.datestart = "";
						if (moment(this.filterDateStart.getValue()).isValid())
							args.args.datestart = this.filterDateStart.getValue().format("YYYY-MM-DD");
						args.args.datestop = "";
						if (moment(this.filterDateStop.getValue()).isValid())
							args.args.datestop = this.filterDateStop.getValue().format("YYYY-MM-DD");
					}
				],
				[
					"load",
					(store, data) => {
						this.opportunitiesModel = data;

						if (this._currentPanel == 1) this.drawTable();
						else this.drawColumns();
						this.drawBlocs();
					}
				],
				[
					"update",
					(store, models) => {
						// $("#gammes-gammes-h1").html("Les " + store.count() + " gammes");
					}
				]
			]
		});

		this.opportunities = new M_.TableList({
			// controller: this,
			container: $("#opportunities_list"),
			store: new M_.Store({
				controller: this,
				model: MT_Opportunities,
				primaryKey: "op_id",
				url: "/1.0/opportunities",
				limit: 20000,
				// rootData: 'aides',
				listeners: []
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						if (col == 7) return;
						M_.App.open("Opportunities", "opportunities", "edit", m_id);
					}
				],
				[
					"render",
					(table, models) => {
						// table.container.find('.fa-exclamation-triangle').each((ind, el)=> {
						//     new M_.Help({
						//         text: "Ne sera pas affiché pour la communauté Link4Life",
						//         attachedObj: $(el)
						//     }) ;
						// }) ;
						table.container.find(".fa-trash").click(evt => {
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette opportunité ?", () => {
								let m_id = $(evt.target).attr("data-opid");
								M_.Utils.deleteJson("/1.0/opportunities/" + m_id, {}, () => {
									M_.App.open("Opportunities", "opportunities", "list");
								});
							});
						});
						table.container.find(".fa-pencil").click(evt => {
							let m_id = $(evt.target).attr("data-opid");
							M_.App.open("Opportunities", "opportunities", "edit", m_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Date",
					width: 90,
					val: model => {
						return moment(model.get("op_date")).format("DD/MM/YYYY");
					}
				},
				{
					label: "Prospect",
					// width: 150,
					val: model => {
						return Shared.completeName(model.get("co_id_contact"));
					}
				},
				{
					label: "Utilisateur",
					width: 150,
					val: model => {
						return Shared.completeName(model.get("co_id_user"));
					}
				},
				{
					label: "Prochaine action",
					// width: 350,
					val: model => {
						return "-";
					}
				},
				{
					label: "Etape",
					width: 160,
					val: model => {
						return _.result(_.find(M_.App.Settings.opportunitiesSteps, { li_id: model.get("op_state") * 1 }), "li_name");
					}
				},
				{
					label: "Etat",
					width: 150,
					val: model => {
						return "En commande";
					}
				},
				{
					label: "Prix",
					width: 110,
					align: "right",
					val: model => {
						return M_.Utils.price(model.get("op_price"), 0);
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					val: (model, style) => {
						var html = "";
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-pencil faicon"></i>&nbsp;';
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-trash faicon"></i>';
						return html;
					}
				}
			]
		});

		this.actions = new M_.TableList({
			// controller: this,
			container: $("#opportunities_actionslist"),
			store: new M_.Store({
				controller: this,
				model: MT_Actions,
				primaryKey: "ac_id",
				url: "/1.0/actions",
				limit: 20000,
				// rootData: 'aides',
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							args.args.co_id = this.filterUser.getValue();
							args.args.datestart = "";
							if (moment(this.filterDateStart.getValue()).isValid())
								args.args.datestart = this.filterDateStart.getValue().format("YYYY-MM-DD");
							args.args.datestop = "";
							if (moment(this.filterDateStop.getValue()).isValid())
								args.args.datestop = this.filterDateStop.getValue().format("YYYY-MM-DD");
						}
					],
					[
						"load",
						(store, data) => {
							this.actionsModel = data;
							this.drawBlocs();
						}
					],
					[
						"update",
						(store, models) => {
							// $("#gammes-gammes-h1").html("Les " + store.count() + " gammes");
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						// if (col == 4) return;
						M_.App.open("Opportunities", "actions", "edit", m_id);
					}
				],
				[
					"render",
					(table, models) => {
						// table.container.find('.fa-exclamation-triangle').each((ind, el)=> {
						//     new M_.Help({
						//         text: "Ne sera pas affiché pour la communauté Link4Life",
						//         attachedObj: $(el)
						//     }) ;
						// }) ;
						table.container.find(".fa-trash").click(evt => {
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette action ?", () => {
								let m_id = $(evt.target).attr("data-opid");
								M_.Utils.deleteJson("/1.0/actions/" + m_id, {}, () => {
									M_.App.open("Opportunities", "actions", "list");
								});
							});
						});
						table.container.find(".fa-pencil").click(evt => {
							let m_id = $(evt.target).attr("data-opid");
							M_.App.open("Opportunities", "actions", "edit", m_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Le",
					width: 150,
					val: model => {
						if (moment(model.get("ac_call_date")).isValid()) return moment(model.get("ac_call_date")).format("DD/MM/YYYY HH[H]mm");
						return moment(model.get("createdAt")).format("DD/MM/YYYY HH[H]mm");
					}
				},
				{
					label: "Prospect",
					// width: 150,
					val: model => {
						return Shared.completeName(model.get("co_id_contact"));
					}
				},
				{
					label: "Utilisateur",
					width: 150,
					val: model => {
						return Shared.completeName(model.get("co_id_user"));
					}
				},
				{
					label: "Type d'action",
					width: 150,
					val: model => {
						return _.result(Shared.getActionsTypes(model.get("ac_type")), "val");
					}
				},
				{
					label: "Détail",
					width: 160,
					val: model => {
						if (model.get("ac_type") == "call") {
							let t = _.result(Shared.getCallResults(model.get("ac_call_result")), "val");
							if (model.get("ac_call_result") == 2) {
								t += " le<br>" + moment(model.get("ac_call_recalldate")).format("DD/MM/YYYY [à] HH[H]mm");
							}
							return t;
						}
						return "-";
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					val: (model, style) => {
						var html = "";
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-pencil faicon"></i>&nbsp;';
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-trash faicon"></i>';
						return html;
					}
				}
			]
		});

		this.invoices = new M_.TableList({
			// controller: this,
			container: $("#opportunities_invoiceslist"),
			getTableFooter: store => {
				var total = 0,
					solde = 0;
				var nb = 0;
				store.each((model, indexTemp) => {
					total += model.get("in_sumttc") * 1;
					solde += model.get("in_solde") * 1;
					nb++;
				});
				// let col = "#00b007";
				// if (solde > 0) col = "#ff5648";
				// $('#invoices_tableinvoices4').css('background-color',col).html("Total solde : "+M_.Utils.price(solde)) ;
				return M_.Utils.plural(nb, "fiche") + " | Total : " + M_.Utils.price(total) + "" + " | Total solde : " + M_.Utils.price(solde);
			},
			// limitRows: 3,
			store: new M_.Store({
				controller: this,
				model: MT_Invoices,
				primaryKey: "in_id",
				url: "/1.0/invoices",
				limit: 20000,
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							args.args.mytypes = ["invoice"];
							args.args.co_id = this.filterUser.getValue();
							args.args.datestart = "";
							if (moment(this.filterDateStart.getValue()).isValid())
								args.args.datestart = this.filterDateStart.getValue().format("YYYY-MM-DD");
							args.args.datestop = "";
							if (moment(this.filterDateStop.getValue()).isValid())
								args.args.datestop = this.filterDateStop.getValue().format("YYYY-MM-DD");
						}
					],
					[
						"load",
						(store, data) => {
							this.invoicesModel = data;
							this.drawBlocs();
						}
					],
					[
						"update",
						(store, models) => {
							// $("#invoices_title3").html(store.count() + " factures");
							// this.nbFactures = store.count();
							// $("#invoices_title").html(this.nbFactures + " factures et " + this.nbPaiements + " paiements");
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						if (col == 5) return;
						M_.App.open("Opportunities", "invoices", "edit", m_id);

						// console.log("row,col",row,col);
					}
				],
				[
					"render",
					(table, models) => {
						table.jEl.find(".fa-pencil").click(evt => {
							var in_id = $(evt.target).attr("data-inid");
							M_.App.open("Opportunities", "invoices", "edit", in_id);
						});
						table.container.find(".fa-print").click(evt => {
							let m_id = $(evt.target).attr("data-inid");
							window.open("/1.0/invoices/" + m_id + "/print", "_blank");
						});
					}
				]
			],
			colsDef: [
				{
					label: "Numéro",
					width: 200,
					val: model => {
						return "" + model.get("in_num");
					}
				},
				{
					label: "Objet",
					width: 200,
					val: model => {
						return "" + model.get("in_object");
					}
				},
				{
					label: "Client",
					// width: 180,
					val: model => {
						return Shared.completeName(model.get("co_id_contact"), true);
					}
				},
				{
					label: "Date",
					width: 100,
					sort: model => {
						return moment(model.get("in_date")).format("YYYY-MM-DD");
					},
					val: (model, style) => {
						return moment(model.get("in_date")).format("DD/MM/YYYY");
					}
					// }, {
					// 	label: "Montant HT",
					// 	align: 'right',
					// 	sort: (model)=>{return model.get('in_sumht') ;},
					// 	width: 140,
					// 	val: (model, style)=> {
					// 		return M_.Utils.price(model.get('in_sumht')) ;
					// 	}
				},
				{
					label: "Montant TTC",
					align: "right",
					sort: model => {
						return model.get("in_sumttc");
					},
					width: 140,
					val: (model, style) => {
						return M_.Utils.price(model.get("in_sumttc"));
					}
				},
				{
					label: "&nbsp;",
					width: 150,
					val: (model, style) => {
						var html = "";
						html += '<i data-inid="' + model.get("in_id") + '" class="fa fa-pencil faicon gotoedit"></i>&nbsp;';
						html += '<i data-inid="' + model.get("in_id") + '" class="fa fa-print faicon"></i>';
						// html += '<i data-inid="' + model.get("in_id") + '" class="fa fa-print faicon printinvoice"></i>&nbsp;';
						return html;
					}
				}
			]
		});

		// $("#opportunities_btnewopportunity").click(evt => {
		// 	M_.App.open("Opportunities", "opportunities", "edit", "-1");
		// });
		// $("#opportunities_btnewaction").click(evt => {
		// 	M_.App.open("Opportunities", "actions", "edit", "-1");
		// });
		// $("#opportunities_btnewinvoice").click(evt => {
		// 	M_.App.open("Opportunities", "invoices", "edit", "-1");
		// });

		$("#opportunities_btnew").click(evt => {
			evt.stopPropagation();
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#opportunities_btnew"),
				offsetLeft: -100,
				items: [
					{
						text: "Nouvelle opportunité",
						// disabled: !Shared.canImportContact(M_.App.Session),
						click: () => {
							M_.App.open("Opportunities", "opportunities", "edit", "-1");
						}
					},
					{
						text: "Nouveau devis",
						// disabled: !Shared.canImportContact(M_.App.Session),
						click: () => {
							M_.App.open("Opportunities", "invoices", "edit", "-1");
						}
					},
					{
						text: "Nouvelle action téléphonique",
						// disabled: !Shared.canImportContact(M_.App.Session),
						click: () => {
							M_.App.open("Opportunities", "actions", "edit", "-1");
						}
					}
				]
			});
			dd.show();
		});

		$("#opportunities_btpres1").click(() => {
			// this.changePanel(1);
			M_.App.open("Opportunities", "opportunities", "list", "1");
		});
		$("#opportunities_btpres2").click(() => {
			// this.changePanel(2);
			M_.App.open("Opportunities", "opportunities", "list", "2");
		});
		$("#opportunities_btpres3").click(() => {
			// this.changePanel(3);
			M_.App.open("Opportunities", "actions", "list");
		});
		$("#opportunities_btpres4").click(() => {
			// this.changePanel(4);
			M_.App.open("Opportunities", "invoices", "list");
		});
		$("#opportunities_panel1").hide();
		$("#opportunities_panel2").hide();
		if (this._currentPanel == 1) {
			$("#opportunities_panel1").show();
		} else {
			$("#opportunities_panel2").show();
		}

		// console.log("M_.App.Settings", M_.App.Settings);
		this.tabCols = [];
		_.each(M_.App.Settings.opportunitiesSteps, state => {
			let split = state.li_name.split(" - ");
			if (split.length != 2) return;
			let el = $(
				`<div class='opportunities_col' data-statenum='${state.li_id}'>
				<h2>${split[0]}</h2>
				<h3>${split[1]}</h3>
				<div class="opportunities_total"></div>
				</div>`
			);
			$("#opportunities_panel2").append(el);
			el
				.on("dragenter", evt => {
					evt.preventDefault();
					// $(evt.target)
					// 	.closest(".opportunities_col")
					// 	.css("background-color", "red");
				})
				.on("dragleave", evt => {
					evt.preventDefault();
					// $(evt.target)
					// 	.closest(".opportunities_col")
					// 	.css("background-color", "transparent");
				})
				.on("dragover", evt => {
					evt.preventDefault();
				})
				.on("drop", evt => {
					evt.preventDefault();
					let col = $(evt.target).closest(".opportunities_col");
					// col.css("background-color", "transparent");
					var op_id = evt.originalEvent.dataTransfer.getData("op_id");
					let op_state = col.attr("data-statenum");
					// var jEl = $(document.getElementById(data));
					// var jElTd = $(evt.target).closest("td");
					// jElTd.append(jEl);
					M_.Utils.putJson("/1.0/opportunities/" + op_id, { op_state: op_state }, data => {
						// console.log("data", data);
						this.storeOpportunities.reload();
					});
				});
		});

		this.changePanel(this._currentPanel);
	}

	drawBlocs() {
		if (this.opportunitiesModel) {
			let totalpotentiel = 0,
				totalpondere = 0,
				nbgagnes = 0,
				nbpassed = 0;
			_.each(this.opportunitiesModel, row_op => {
				let state = _.find(M_.App.Settings.opportunitiesSteps, { li_id: row_op.get("op_state") * 1 });
				// console.log("state.purcent", state, row_op.get("op_state"));
				let split = state.li_name.split(" - ");
				if (split.length != 2) return;
				let p = state.li_name.substring(0, split[0].length - 1) * 1;
				totalpondere += p * row_op.get("op_price") / 100;
				if (p > 0) totalpotentiel += row_op.get("op_price") * 1;
				if (p == 100) nbgagnes++;
				if (moment(row_op.get("op_date")).isBefore(moment())) nbpassed++;
			});
			$(".home-framenumber.bgorange1 div:nth-child(1)").html(M_.Utils.price(totalpotentiel, 0));
			$(".home-framenumber.bgorange1 div:nth-child(2)").html("POTENTIEL TOTAL");
			$(".home-framenumber.bggreen1 div:nth-child(1)").html(M_.Utils.price(totalpondere, 0));
			$(".home-framenumber.bggreen1 div:nth-child(2)").html("POTENTIEL PONDÉRÉ");
			$(".home-framenumber.bgblue1 div:nth-child(1)").html(nbgagnes);
			$(".home-framenumber.bgblue1 div:nth-child(2)").html("OPPORTUNITÉS GAGNÉES");
			$(".home-framenumber.bgpurple1 div:nth-child(1)").html(nbpassed);
			$(".home-framenumber.bgpurple1 div:nth-child(2)").html("OPPORTUNITÉS EN RETARD");
		}
		if (this.actionsModel) {
			let nbpassed = 0;
			_.each(this.actionsModel, row_ac => {});
			$(".home-framenumber.bgorange2 div:nth-child(1)").html(nbpassed);
			$(".home-framenumber.bgorange2 div:nth-child(2)").html("ACTIONS EN RETARD");
		}
	}

	changePanel(num) {
		this._currentPanel = num;
		$("#opportunities_btpres1").removeClass("primary");
		$("#opportunities_btpres2").removeClass("primary");
		$("#opportunities_btpres3").removeClass("primary");
		$("#opportunities_btpres4").removeClass("primary");
		$("#opportunities_panel1").hide();
		$("#opportunities_panel2").hide();
		$("#opportunities_panel3").hide();
		$("#opportunities_panel4").hide();
		if (num == 1) {
			$("#opportunities_btpres1").addClass("primary");
			$("#opportunities_panel1").show();
			this.drawTable();
		}
		if (num == 2) {
			$("#opportunities_btpres2").addClass("primary");
			$("#opportunities_panel2").show();
			this.drawColumns();
		}
		if (num == 3) {
			$("#opportunities_btpres3").addClass("primary");
			$("#opportunities_panel3").show();
			this.actions.store.load();
		}
		if (num == 4) {
			$("#opportunities_btpres4").addClass("primary");
			$("#opportunities_panel4").show();
			this.invoices.store.load();
		}
	}

	drawColumns() {
		$(".opportunities_dditem").remove();
		let totaux = {};
		_.each(this.opportunitiesModel, model => {
			let col = $(".opportunities_col[data-statenum='" + model.get("op_state") + "']");
			if (!totaux["col" + model.get("op_state")]) totaux["col" + model.get("op_state")] = [0, 0];
			totaux["col" + model.get("op_state")][0]++;
			totaux["col" + model.get("op_state")][1] += model.get("op_price") * 1;
			let customer = Shared.completeName(model.get("co_id_contact"));
			let price = M_.Utils.price(model.get("op_price"), 0);
			let jEl = $(`<div draggable="true" data-opid="${model.get("op_id")}" class="opportunities_dditem">
				<b>${customer}</b><br>
				${model.get("op_name")}<br>
				${price}<br>
				</div>`);
			col.append(jEl);
			// console.log('model.get("op_id")', model.get("op_id"));
			jEl.data("op_id", model.get("op_id"));
			jEl
				.on("dragstart", evt => {
					evt.originalEvent.dataTransfer.setData("op_id", $(evt.target).attr("data-opid"));
				})
				.on("click", evt => {
					jEl = $(evt.target).closest(".opportunities_dditem");
					// console.log("jEl.data('ca_id')", jEl.data('ca_id'));
					// this.openWinCandidate(jEl.data('ca_id')) ;
					M_.App.open("Opportunities", "opportunities", "edit", jEl.data("op_id"));
				});
			let step = _.result(_.find(M_.App.Settings.opportunitiesSteps, { li_id: model.get("op_state") * 1 }), "li_name");
			let dateprev = moment(model.get("op_date")).format("DD/MM/YYYY");
			let who = Shared.completeName(model.get("co_id_user"));
			new M_.Help({
				text: `
				<div>DEVIS ${step}</div>
				<h4 style='margin:0;'>${customer}</h4>
				<div>${model.get("op_name")}</div>
				<div>Montant : ${price}</div>
				<div>Prévu pour le : ${dateprev}</div>
				<div>Créé par ${who} </div>
				`,
				attachedObj: jEl
			});
		});
		_.each(M_.App.Settings.opportunitiesSteps, state => {
			let split = state.li_name.split(" - ");
			if (split.length != 2) return;
			let nb = 0,
				tot = 0;
			if (totaux["col" + state.li_id]) {
				nb = totaux["col" + state.li_id][0];
				tot = totaux["col" + state.li_id][1];
			}
			$(".opportunities_col[data-statenum='" + state.li_id + "'] .opportunities_total").html(
				M_.Utils.plural(nb, "opportunité") + " | " + M_.Utils.price(tot, 0)
			);
		});
	}
	drawTable() {
		let datas = [];
		_.each(this.opportunitiesModel, model => {
			datas.push(model.getData());
		});
		this.opportunities.store.setRows(datas);
	}

	onSaveOpportunitiesWinEdit() {
		M_.App.open("Opportunities", "opportunities", "list", this._currentSubViewOpportunities);
	}
	onDeleteOpportunitiesWinEdit() {
		M_.App.open("Opportunities", "opportunities", "list", this._currentSubViewOpportunities);
	}
	onCancelOpportunitiesWinEdit() {
		M_.App.open("Opportunities", "opportunities", "list", this._currentSubViewOpportunities);
	}

	onSaveActionsWinEdit() {
		M_.App.open("Opportunities", "actions", "list");
		this.actions.store.load();
	}
	onDeleteActionsWinEdit() {
		M_.App.open("Opportunities", "actions", "list");
		this.actions.store.load();
	}
	onCancelActionsWinEdit() {
		M_.App.open("Opportunities", "actions", "list");
		this.actions.store.load();
	}

	onSaveInvoicesWinEdit() {
		M_.App.open("Opportunities", "invoices", "list");
		this.invoices.store.load();
	}
	onDeleteInvoicesWinEdit() {
		M_.App.open("Opportunities", "invoices", "list");
		this.invoices.store.load();
	}
	onCancelInvoicesWinEdit() {
		M_.App.open("Opportunities", "invoices", "list");
		this.invoices.store.load();
	}

	invoicesAction(subaction, in_id) {
		// console.log("subaction, op_id", subaction, op_id);
		this.changePanel(4);
		if (subaction == "edit") {
			InvoicesWinEdit.getInstance(this).initWin(in_id, "");
		}
		if (subaction == "list") {
			this.invoices.store.load();

			window.setTimeout(() => {
				this.storeOpportunities.load();
				this.actions.store.load();
			}, 1000);
		}
	}
	opportunitiesAction(subaction, op_id) {
		// console.log("subaction, op_id", subaction, op_id);

		if (subaction == "edit") {
			OpportunitiesWinEdit.getInstance(this).loadOpportunity(op_id);
		}
		if (subaction == "list") {
			this._currentSubViewOpportunities = op_id;
			if (op_id == 1) this.changePanel(1);
			else this.changePanel(2);
			this.storeOpportunities.load();

			window.setTimeout(() => {
				this.actions.store.load();
				this.invoices.store.load();
			}, 1000);
		}
	}
	actionsAction(subaction, op_id) {
		// console.log("subaction, op_id", subaction, op_id);
		this.changePanel(3);
		if (subaction == "edit") {
			ActionsWinEdit.getInstance(this).loadAction(op_id);
		}
		if (subaction == "list") {
			this.actions.store.load();

			window.setTimeout(() => {
				this.storeOpportunities.load();
				this.invoices.store.load();
			}, 1000);
		}
	}

	indexAction() {
		this._currentSubViewOpportunities = 2;
		this.storeOpportunities.load();
	}
}
