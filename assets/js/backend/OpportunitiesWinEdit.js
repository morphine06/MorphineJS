"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";
import { MT_Opportunities } from "./../../compiled/models/MT_Opportunities.js";
import { MT_Invoices } from "./../../compiled/models/MT_Invoices.js";

import { ContactsWinEdit } from "./ContactsWinEdit.js";

export class OpportunitiesWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/OpportunitiesWinEdit.html"],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 900,
			_contractNum: 0,
			_agencyNum: 0
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
		// log("this.jEl",this.jEl)
	}

	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new OpportunitiesWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			url: "/1.0/opportunities",
			model: MT_Opportunities,
			controller: this,
			processData: function(data) {},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						// if (form.find('op_id').getValue()==='' &&
						// 	form.find('op_password').getValue()==='' &&
						// 	form.find('op_type').getValue()!='contact' &&
						// 	form.find('op_type').getValue()!='customer' &&
						// 	form.find('op_type').getValue()!='candidate') {
						// 	err.push({key:'op_password', label:"Le mot de passe est vide"}) ;
						// 	return false ;
						// }
						// if (form.find('op_name').getValue()==='' && form.find('op_society').getValue()==='') {
						// 	err.push({key:'op_name', label:"Vous devez indiquer un nom ou une société."}) ;
						// 	return false ;
						// }
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						if (this.currentModel.get("op_id")) {
							this.jEl.find(".M_ModalDelete").prop("disabled", false);
						} else {
							this.jEl.find(".M_ModalDelete").prop("disabled", true);
						}
						this.drawStates();
						this.changeState(this.currentModel.get("op_state") * 1);
						if (this.currentModel.get("co_id_contact")) {
							this.loadContactInfos(this.currentModel.get("co_id_contact").co_id);
						} else {
							$("#opportunitieswinedit_contactinfos").empty();
						}
					}
				],
				[
					"save",
					(form, data) => {
						this.hide();
						if (this.controller.onSaveOpportunitiesWinEdit) this.controller.onSaveOpportunitiesWinEdit(data.data);
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						if (this.controller.onDeleteOpportunitiesWinEdit) this.controller.onDeleteOpportunitiesWinEdit();
					}
				]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				hideIfEmpty: true,
				labelPosition: "left",
				labelWidth: 100
			},
			items: [
				{
					type: M_.Form.Hidden,
					name: "op_id",
					container: $("#opportunitieswinedit_op_name")
				},
				{
					type: M_.Form.Hidden,
					name: "op_state",
					container: $("#opportunitieswinedit_op_name")
				},
				{
					type: M_.Form.Checkbox,
					name: "op_share",
					// placeholder: "Partager",
					label: "Partager",
					labelPosition: "right",
					container: $("#opportunitieswinedit_op_share")
				},
				{
					name: "op_name",
					placeholder: "",
					label: "Nom de l'opportunité",
					labelPosition: "top",
					allowEmpty: false,
					container: $("#opportunitieswinedit_op_name"),
					listeners: [["update", (tf, val) => {}]]
				},
				{
					type: M_.Form.Number,
					name: "op_price",
					placeholder: "",
					label: "Prix",
					labelPosition: "top",
					container: $("#opportunitieswinedit_op_price"),
					allowEmpty: false,
					listeners: [["update", (tf, val) => {}]]
				},
				{
					type: M_.Form.Date,
					name: "op_date",
					placeholder: "JJ/MM/AAAA",
					label: "Date de commande prévue",
					labelPosition: "top",
					container: $("#opportunitieswinedit_op_date"),
					allowEmpty: false
				},
				{
					type: M_.Form.Textarea,
					name: "op_text",
					label: "Décrivez la demande",
					labelPosition: "top",
					container: $("#opportunitieswinedit_op_text"),
					allowEmpty: true,
					height: 50
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_user",
					label: "Utilisateur",
					labelPosition: "top",
					placeholder: "",
					container: $("#opportunitieswinedit_co_id_user"),
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
						listeners: [
							[
								"beforeLoad",
								(store, args) => {
									args.args.types = ["user", "secretary", "director", "admin"];
								}
							]
						]
					}),
					listeners: [["itemclick", (tf, val) => {}]]
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_contact",
					label: "Client",
					labelPosition: "top",
					placeholder: "",
					container: $("#opportunitieswinedit_co_id_contact"),
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
						listeners: [
							[
								"beforeLoad",
								(store, args) => {
									args.args.types = ["contact", "society"];
								}
							]
						]
					}),
					listeners: [
						[
							"itemclick",
							(tf, model) => {
								// console.log("tf.getRawValue(", tf.getRawValue());
								this.form.find("op_name").setValue(tf.getRawValue());
								this.loadContactInfos(model.get("co_id"));
							}
						]
					]
				}
			]
		});

		this.invoices = new M_.TableList({
			// controller: this,
			container: $("#opportunitieswinedit_invoices"),
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
							args.args.op_id = this.currentModel.get("op_id");
							// args.args.datestart = "";
							// if (moment(this.filterDateStart.getValue()).isValid())
							// 	args.args.datestart = this.filterDateStart.getValue().format("YYYY-MM-DD");
							// args.args.datestop = "";
							// if (moment(this.filterDateStop.getValue()).isValid())
							// 	args.args.datestop = this.filterDateStop.getValue().format("YYYY-MM-DD");
						}
					],
					[
						"load",
						(store, data) => {
							this.invoicesModel = data;
							// this.drawBlocs();
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
						// this.openWinExpense(m_id) ;
						if (col == 8) return;
						M_.App.open("Opportunities", "invoices", "edit", m_id);

						// console.log("row,col",row,col);
					}
				],
				[
					"render",
					(table, models) => {
						table.jEl.find(".printinvoice").click(evt => {
							var in_id = $(evt.target).attr("data-inid");
							window.open("/1.0/documents/generate/proforma/" + in_id, "_blank");
						});
						table.jEl.find(".fa-pencil").click(evt => {
							var in_id = $(evt.target).attr("data-inid");
							M_.App.open("Opportunities", "invoices", "edit", in_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Numéro",
					width: 100,
					val: model => {
						return "" + model.get("in_num");
					}
				},
				{
					label: "Objet",
					width: 100,
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
					width: 90,
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
						html += '<i data-inid="' + model.get("in_id") + '" class="fa fa-print faicon printinvoice"></i>&nbsp;';
						return html;
					}
				}
			]
		});

		this.jEl.find(".M_ModalSave").click(() => {
			this.form.validAndSave();
		});
		this.jEl.find(".M_ModalDelete").click(() => {
			this.form.delete(this.currentModel.get("op_id"));
		});
		this.jEl.find(".M_ModalCancel").click(() => {
			if (this.controller.onCancelOpportunitiesWinEdit) this.controller.onCancelOpportunitiesWinEdit();
			// M_.App.open("Opportunities", "opportunities", "list");
			this.hide();
		});
		$("#opportunitieswinedit_btcontactcreate").click(evt => {
			ContactsWinEdit.getInstance(this).newContact();
		});
		$("#opportunitieswinedit_btcontactmodify").click(evt => {
			let co_id = this.form.find("co_id_contact").getValue();
			ContactsWinEdit.getInstance(this).loadContact(
				co_id,
				currentModelContact => {
					this.currentModelContact = currentModelContact;
					ContactsWinEdit.getInstance(this).initWinNow();
				},
				false
			);
		});
		$("#opportunitieswinedit_newinvoice").click(evt => {
			this.hide();
			M_.App.open("Opportunities", "invoices", "edit", "-1");
		});
	}

	loadContactInfos(co_id) {
		$("#opportunitieswinedit_contactinfos").empty();
		if (!co_id) return;
		// console.log("co_id", co_id);
		M_.Utils.getJson("/1.0/contacts/" + co_id, {}, data => {
			let row_co = data.data;
			Services.processContactsData(row_co);
			Services.renderContactsInfo($("#opportunitieswinedit_contactinfos"), {
				row_co: row_co,
				canModify: true,
				withName: true
			});
			this.center();
		});
	}

	drawStates() {
		$("#opportunitieswinedit_op_states").empty();
		_.each(M_.App.Settings.opportunitiesSteps, state => {
			let split = state.li_name.split(" - ");
			if (split.length != 2) return;
			let el = $(`<div class='opportunities-state' data-state="${state.li_id}">
				<h2>${split[0]}</h2>
				<p>${split[1]}</p>
			</div>`);
			$("#opportunitieswinedit_op_states").append(el);
			el.click(evt => {
				let el = $(evt.target).closest(".opportunities-state");
				this.changeState(el.attr("data-state") * 1);
			});
			if (state.li_options) {
				let tabOptions = state.li_options.split("\n");
				let el = $(`<div id="opportunitieswinedit_opts_state_${state.li_id}" class="opportunitieswinedit_opts_state_"></div>`);
				_.each(tabOptions, (opt, index) => {
					let el2 = $(
						`<div id="opportunitieswinedit_opts_state_${state.li_id}">
						<label for="opportunitieswinedit_${index}">
						<input type="checkbox" id="opportunitieswinedit_${index}" name="opportunitieswinedit_${index}" value="${opt}">${opt}
						</label>
						</div>`
					);
					el.append(el2);
				});
				$("#opportunitieswinedit_op_checkboxs").append(el);
				el.css("display", "none");
			}
		});
	}
	changeState(currentState) {
		if (!currentState) currentState = M_.App.Settings.opportunitiesSteps[0].li_id;
		$("#opportunitieswinedit_op_states .current").removeClass("current");
		$("#opportunitieswinedit_op_states .passed").removeClass("passed");
		let stop = false;
		_.each(M_.App.Settings.opportunitiesSteps, state => {
			if (stop) return;
			if (currentState == state.li_id) {
				stop = true;
				$("#opportunitieswinedit_op_states *[data-state='" + state.li_id + "']").addClass("current");
			} else {
				$("#opportunitieswinedit_op_states *[data-state='" + state.li_id + "']").addClass("passed");
			}
		});
		this.form.find("op_state").setValue(currentState);
		$(".opportunitieswinedit_opts_state_").hide();
		$("#opportunitieswinedit_opts_state_" + currentState).show();
	}
	onSaveContactsWinEdit(row_co) {
		this.form.find("co_id_contact").setValue(row_co);
		this.loadContactInfos(row_co.co_id);
	}
	onDeleteContactsWinEdit() {
		this.form.find("co_id_contact").setValue({ co_id: "", co_name: "", co_firstname: "" });
		this.loadContactInfos(null);
	}
	onCancelContactsWinEdit() {}

	loadOpportunity(op_id, callback) {
		this.form.load(op_id, null, () => {
			// this._beforeShowWin() ;
			if (callback) callback(this.currentModel);
			this.invoices.store.load();
			this.show(true);
		});
	}
}
