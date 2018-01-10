"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Contacts } from "../../compiled/models/MT_Contacts.js";
import { MT_Invoices } from "../../compiled/models/MT_Invoices.js";
// import { ElementsWinEdit } from "./ElementsWinEdit.js";
// import { StatsWinEdit } from "./StatsWinEdit.js";
import { InvoicesWinEdit } from "./InvoicesWinEdit.js";

export class Invoices extends M_.Controller {
	constructor(opts) {
		if (!opts) opts = {};
		opts.tpl = JST["assets/templates/backend/Invoices.html"];
		super(opts);
	}
	init() {}
	create() {
		this.filterType1 = new M_.Form.Checkbox({
			type: M_.Form.Checkbox,
			name: "type1",
			label: "Devis",
			value: true,
			container: $("#invoices_filter4"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});
		this.filterType2 = new M_.Form.Checkbox({
			type: M_.Form.Checkbox,
			name: "type2",
			label: "Bon de commande",
			value: true,
			container: $("#invoices_filter5"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});
		this.filterType3 = new M_.Form.Checkbox({
			type: M_.Form.Checkbox,
			name: "type3",
			label: "Facture",
			value: true,
			container: $("#invoices_filter6"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});
		this.filterUser = new M_.Form.Combobox({
			type: M_.Form.Combobox,
			name: "co_id_user",
			label: "Utilisateur",
			labelPosition: "top",
			placeholder: "",
			container: $("#invoices_filter1"),
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
						this.invoices.store.load();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});
		this.filterDateStart = new M_.Form.Date({
			name: "datestart",
			label: "Date début",
			labelPosition: "top",
			container: $("#invoices_filter2"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.invoices.store.load();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});
		this.filterDateStop = new M_.Form.Date({
			name: "datestop",
			label: "Date fin",
			labelPosition: "top",
			container: $("#invoices_filter3"),
			listeners: [
				[
					"change",
					(tf, val) => {
						this.invoices.store.load();
					}
				],
				[
					"keyup",
					(tf, val) => {
						this.invoices.store.load();
					}
				]
			]
		});

		this.invoices = new M_.TableList({
			// controller: this,
			container: $("#invoices_list"),
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
							args.args.co_id = this.filterUser.getValue();
							args.args.datestart = "";
							if (moment(this.filterDateStart.getValue()).isValid())
								args.args.datestart = this.filterDateStart.getValue().format("YYYY-MM-DD");
							args.args.datestop = "";
							if (moment(this.filterDateStop.getValue()).isValid())
								args.args.datestop = this.filterDateStop.getValue().format("YYYY-MM-DD");
							let mytypes = [];
							if (this.filterType1.getValue()) mytypes.push("estimate");
							if (this.filterType2.getValue()) mytypes.push("purchaseorder");
							if (this.filterType3.getValue()) mytypes.push("invoice");
							args.args.mytypes = mytypes;
						}
					],
					[
						"load",
						(store, data) => {
							this.invoicesModel = data;
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
						M_.App.open("Invoices", "edit", m_id);

						// console.log("row,col",row,col);
					}
				],
				[
					"render",
					(table, models) => {
						table.jEl.find(".fa-pencil").click(evt => {
							var in_id = $(evt.target).attr("data-inid");
							M_.App.open("Invoices", "edit", in_id);
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
					label: "Type",
					width: 200,
					val: model => {
						return "" + Shared.getInvoiceType(model.get("in_type")).val;
					}
				},
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

		$("#invoices_btcreate").click(evt => {
			// M_.App.open("Invoices", "edit", "-1");
			evt.stopPropagation();
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#invoices_btcreate"),
				offsetLeft: -100,
				items: [
					{
						text: "Nouveau devis",
						click: () => {
							M_.App.open("Invoices", "edit", "-1");
						}
					},
					{
						text: "Nouveau bon de commande",
						// disabled: !Shared.canImportContact(M_.App.Session),
						click: () => {
							M_.App.open("Invoices", "edit", "-2");
						}
					},
					{
						text: "Nouvelle facture",
						// disabled: !Shared.canImportContact(M_.App.Session),
						click: () => {
							M_.App.open("Invoices", "edit", "-3");
						}
					}
				]
			});
			dd.show();
		});
	}

	onSaveInvoicesWinEdit() {
		M_.App.open("Invoices", "list");
		this.invoices.store.load();
	}
	onDeleteInvoicesWinEdit() {
		M_.App.open("Invoices", "list");
		this.invoices.store.load();
	}
	onCancelInvoicesWinEdit() {
		M_.App.open("Invoices", "list");
		this.invoices.store.load();
	}
	onDuplicateInvoicesWinEdit(data) {
		M_.App.open("Invoices", "edit", data.in_id);
		this.invoices.store.load();
	}

	listAction() {
		this.invoices.store.load();
	}
	editAction(in_id) {
		InvoicesWinEdit.getInstance(this).initWin(in_id, "");
	}
	indexAction() {
		this.listAction();
	}
}
