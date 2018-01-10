"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";

import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";
import { MT_Opportunities } from "./../../compiled/models/MT_Opportunities.js";
import { MT_Invoices } from "./../../compiled/models/MT_Invoices.js";
import { MT_Products } from "./../../compiled/models/MT_Products.js";
import { MT_Addresses } from "./../../compiled/models/MT_Addresses.js";

import { ContactsWinEdit } from "./ContactsWinEdit.js";

export class InvoicesWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/InvoicesWinEdit.html"],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 1100,
			_contractNum: 0,
			_agencyNum: 0,
			_linestodelete: []
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
	}

	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new InvoicesWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();
		$(".invoiceswinedit_bt_save").click(() => {
			this.form.validAndSave();
		});
		$(".invoiceswinedit_bt_duplicate").click(evt => {
			evt.stopPropagation();
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $(".invoiceswinedit_bt_duplicate"),
				offsetLeft: -100,
				items: [
					{
						text: "Dupliquer en devis",
						click: () => {
							this.thenDuplicate = "estimate";
							this.form.validAndSave();
						}
					},
					{
						text: "Dupliquer en bon de commande",
						click: () => {
							this.thenDuplicate = "purchaseorder";
							this.form.validAndSave();
						}
					},
					{
						text: "Dupliquer en facture",
						click: () => {
							this.thenDuplicate = "invoice";
							this.form.validAndSave();
						}
					}
				]
			});
			dd.show();
		});
		$(".invoiceswinedit_bt_cancel").click(() => {
			this.hide();
			// M_.App.open('Invoices') ;
			if (this.controller.onCancelInvoicesWinEdit) this.controller.onCancelInvoicesWinEdit();
		});
		$(".invoiceswinedit_bt_delete").click(() => {
			M_.Dialog.confirm("Confirmation", "Etes-vous certain de vouloir effacer ce devis ?", () => {
				this.form.delete(this.currentModel.get("in_id"));
			});
		});

		// this.idbtmodifycustomer = M_.Utils.id();
		// this.idbtcreatecustomer = M_.Utils.id();

		this.form = new M_.Form.Form({
			url: "/1.0/invoices",
			model: MT_Invoices,
			controller: this,
			args: { shortSave: true },
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						var ok2 = true;
						return ok2;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						// console.log("model", model);
						this.justLoaded();
						if (this.currentModel.get("co_id_contact")) {
							this.loadContactInfos(this.currentModel.get("co_id_contact").co_id);
						} else {
							$("#invoiceswinedit_contactinfos").empty();
						}
					}
				],
				[
					"beforeLoad",
					(form, args) => {
						args.args.co_id_contact = this.currentCoID;
					}
				],
				[
					"beforeSave",
					(form, args) => {
						args.args.linkedinvoices = this.linkedInvoices;
						args.args.linestodelete = this._linestodelete;
						// console.log("args.args", args.args);
						for (var i = 0; i < this.numline; i++) {
							// args.args['il_varations_'+i] =
						}
					}
				],
				[
					"save",
					(form, data) => {
						// console.log("data", data);
						// this.controller.invoices.store.reload() ;
						// console.log("toto");
						if (this.thenDuplicate) {
							M_.Utils.postJson("/1.0/invoices/" + data.data.in_id + "/duplicate", { in_type: this.thenDuplicate }, data2 => {
								if (this.controller.onDuplicateInvoicesWinEdit) this.controller.onDuplicateInvoicesWinEdit(data2.data);
							});
						} else {
							if (this.controller.onSaveInvoicesWinEdit) this.controller.onSaveInvoicesWinEdit(data.data);
							this.hide();
						}
						this.thenDuplicate = false;
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						// M_.App.open('Invoices') ;
						if (this.controller.onDeleteInvoicesWinEdit) this.controller.onDeleteInvoicesWinEdit();
					}
				]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				labelPosition: "left",
				labelWidth: 100
			},
			items: [
				{
					type: M_.Form.Hidden,
					name: "in_id",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Hidden,
					name: "in_sumht",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Hidden,
					name: "in_sumtva",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Hidden,
					name: "in_sumttc",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Hidden,
					name: "in_sumremise",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Hidden,
					name: "in_tvas",
					container: $("#invoiceswinedit_co_id")
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_user",
					label: "Utilisateur",
					labelPosition: "top",
					// disabled: !Shared.canAdminInvoices(M_.App.Session),
					placeholder: "",
					container: $("#invoiceswinedit_co_id_user"),
					allowEmpty: false,
					modelKey: "co_id",
					modelValue: model => {
						return Shared.completeName(model.getData());
					},
					store: new M_.Store({
						controller: this,
						model: MT_Contacts,
						url: "/1.0/contacts",
						limit: 200,
						args: { types: ["user", "secretary", "director", "admin"] },
						listeners: [["beforeLoad", (store, args) => {}]]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								this.form.find("ag_id").setValue("");
								this.currentModel.set("co_id", model.getArray());
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_contact",
					label: "Client / Société",
					labelPosition: "top",
					placeholder: "",
					container: $("#invoiceswinedit_co_id"),
					allowEmpty: false,
					modelKey: "co_id",
					modelValue: model => {
						return Shared.completeName(model.getData());
					},
					store: new M_.Store({
						controller: this,
						model: MT_Contacts,
						url: "/1.0/contacts",
						limit: 200,
						args: { onlysociety: true }, //, onlyproforma:true
						listeners: [["beforeLoad", (store, args) => {}]]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								// this.form.find("in_address").setValue(Services.completeAddress(model, false, false));
								this.loadContactInfos(model.get("co_id"));
								// this.loadLinkedInvoices();
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "op_id",
					label: "Opportunité",
					labelPosition: "top",
					placeholder: "",
					container: $("#invoiceswinedit_op_id"),
					allowEmpty: true,
					modelKey: "op_id",
					modelValue: model => {
						return model.get("op_name");
					},
					store: new M_.Store({
						controller: this,
						model: MT_Opportunities,
						url: "/1.0/opportunities",
						limit: 200,
						args: {}, //, onlyproforma:true
						listeners: [["beforeLoad", (store, args) => {}]]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								// this.form.find("in_address").setValue(Services.completeAddress(model, false, false));
								// this.loadContactInfos(model.get("co_id"));
								// this.loadLinkedInvoices();
							}
						]
					]
				},

				{
					type: M_.Form.Combobox,
					name: "ad_id_invoice",
					label: "Adresse de facturation",
					labelPosition: "top",
					// disabled: !Shared.canAdminInvoices(M_.App.Session),
					placeholder: "",
					container: $("#invoiceswinedit_ad_id_invoice"),
					allowEmpty: true,
					modelKey: "ad_id",
					modelValue: "ad_label",
					store: new M_.Store({
						controller: this,
						model: MT_Addresses,
						url: "/1.0/addresses",
						limit: 200,
						args: {},
						listeners: [
							[
								"beforeLoad",
								(store, args) => {
									args.args.co_id = this.form.find("co_id_contact").getValue();
								}
							]
						]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								this.currentModel.set("ad_id_invoice", model.getData());
								this.completeAddressFacLiv();
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "ad_id_delivery",
					label: "Adresse de livraison",
					labelPosition: "top",
					// disabled: !Shared.canAdminInvoices(M_.App.Session),
					placeholder: "",
					container: $("#invoiceswinedit_ad_id_delivery"),
					allowEmpty: true,
					modelKey: "ad_id",
					modelValue: "ad_label",
					store: new M_.Store({
						controller: this,
						model: MT_Addresses,
						url: "/1.0/addresses",
						limit: 200,
						args: {},
						listeners: [
							[
								"beforeLoad",
								(store, args) => {
									args.args.co_id = this.form.find("co_id_contact").getValue();
								}
							]
						]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								this.currentModel.set("ad_id_delivery", model.getData());
								this.completeAddressFacLiv();
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_contact2",
					label: "Contact société",
					labelPosition: "top",
					placeholder: "",
					container: $("#invoiceswinedit_co_id_contact2"),
					allowEmpty: true,
					modelKey: "co_id",
					modelValue: model => {
						return Shared.completeName(model.getData());
					},
					store: new M_.Store({
						controller: this,
						model: MT_Contacts,
						url: "/1.0/contacts",
						limit: 200,
						args: { onlycontacts: true }, //, onlyproforma:true
						listeners: [
							[
								"beforeLoad",
								(store, args) => {
									args.args.contactfromcontact = this.form.find("co_id_contact").getValue();
								}
							]
						]
					}),
					listeners: [
						[
							"itemclick",
							(item, model) => {
								this.currentModel.set("co_id_contact2", model.getData());
								this.completeAddressFacLiv();
							}
						]
					]
				},
				// {
				// 	type: M_.Form.Textarea,
				// 	name: "in_address",
				// 	height: 50,
				// 	placeholder: "",
				// 	label: "Adresse",
				// 	labelPosition: "top",
				// 	// withCounter: 250,
				// 	container: $("#invoiceswinedit_in_address"),
				// 	allowEmpty: true
				// },
				// {
				// 	type: M_.Form.Text,
				// 	name: "in_num",
				// 	placeholder: "",
				// 	label: "Numéro",
				// 	allowEmpty: false,
				// 	labelPosition: "top",
				// 	container: $("#invoiceswinedit_in_num")
				// },
				{
					type: M_.Form.Text,
					name: "in_object",
					placeholder: "",
					label: "Demande client",
					allowEmpty: false,
					labelPosition: "top",
					container: $("#invoiceswinedit_in_object")
				},
				{
					type: M_.Form.Textarea,
					name: "in_conditions",
					placeholder: "",
					label: "Conditions générales de l'offre",
					allowEmpty: true,
					labelPosition: "top",
					height: 150,
					container: $("#invoiceswinedit_in_conditions")
				},
				{
					type: M_.Form.Number,
					name: "in_minorder",
					placeholder: "",
					label: "Montant minimal de CDE",
					allowEmpty: true,
					labelPosition: "top",
					container: $("#invoiceswinedit_in_minorder")
				},
				{
					type: M_.Form.Date,
					name: "in_date",
					label: "Date devis",
					labelPosition: "top",
					// dateFormat: 'MMMM YYYY',
					// noDays: true,
					// value: moment().add(-1'month'),
					allowEmpty: false,
					container: $("#invoiceswinedit_in_date"),
					listeners: [["change", item => {}]]
				},
				{
					type: M_.Form.Combobox,
					name: "in_devise",
					editable: false,
					allowEmpty: true,
					placeholder: "",
					label: "Devise",
					labelPosition: "top",
					container: $("#invoiceswinedit_in_devise"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getDevises()
					}),
					listeners: [["itemclick", (store, models) => {}]]
				},
				{
					type: M_.Form.Combobox,
					name: "in_type",
					editable: false,
					allowEmpty: true,
					placeholder: "",
					label: "Type",
					labelPosition: "top",
					container: $("#invoiceswinedit_in_type"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getInvoiceType()
					}),
					listeners: [["itemclick", (store, models) => {}]]
				}
			]
		});

		$("#invoiceswinedit_addline").click(evt => {
			this.newLine();
			// cb.setValue('') ;
			// this.jEl.find('.M_WindowBody').animate({ scrollTop: this.jEl.find('#invoiceswinedit_addline').position().top-this.jEl.find('.M_WindowBody').outerHeight() }, "slow");
		});

		$("#invoiceswinedit_btcontactcreate").click(evt => {
			ContactsWinEdit.getInstance(this).newContact("-1");
		});
		$("#invoiceswinedit_btcontactmodify").click(evt => {
			ContactsWinEdit.getInstance(this).loadAndEditContact(this.form.find("co_id_contact").getValue());
		});
	}

	loadContactInfos(co_id) {
		$("#invoiceswinedit_contactinfos").empty();
		if (!co_id) return;
		M_.Utils.getJson("/1.0/contacts/" + co_id, {}, data => {
			let row_co = data.data;
			Services.processContactsData(row_co);
			Services.renderContactsInfo($("#invoiceswinedit_contactinfos"), {
				row_co: row_co,
				canModify: true,
				withName: true
			});
			this.center();
		});
	}

	onSaveContactsWinEdit(row_co) {
		this.form.find("co_id_contact").setValue(row_co);
		this.loadContactInfos(row_co.co_id);
		// this.form.find('in_address').setValue(Services.completeAddress(row_co)) ;
	}
	onDeleteContactsWinEdit() {
		this.form.find("co_id_contact").setValue("");
		this.loadContactInfos(null);
	}
	onCancelContactsWinEdit() {}

	completeAddressFacLiv() {
		if (this.currentModel.get("ad_id_delivery"))
			$("#invoiceswinedit_ad_id_deliverytxt").html(Shared.completeAddress(this.currentModel.get("ad_id_delivery"), false, true));
		else $("#invoiceswinedit_ad_id_deliverytxt").empty();
		if (this.currentModel.get("ad_id_invoice"))
			$("#invoiceswinedit_ad_id_invoicetxt").html(Shared.completeAddress(this.currentModel.get("ad_id_invoice"), false, true));
		else $("#invoiceswinedit_ad_id_invoicetxt").empty();
		// if (this.currentModel.get("co_id_contact2"))
		// 	$("#invoiceswinedit_co_id_contact2txt").html(Shared.completeAddress(this.currentModel.get("co_id_contact2"), false, true));
		// else $("#invoiceswinedit_co_id_contact2txt").empty();
	}

	drawHistory() {
		var rows_ac = this.currentModel.get("rows_ac");
		var html = "<table class='M_Table little' cellmargin='0' cellpadding='0'>";
		_.each(rows_ac, row_ac => {
			html += "<tr>";
			html += "<td>" + moment(new Date(row_ac.ac_date)).format("DD/MM/YYYY HH:mm:ss") + "</td>";
			html += "<td>" + Shared.completeName(row_ac.co_id_user) + "</td>";
			html += "<td>" + row_ac.ac_text + "</td>";
			html += "</tr>";
		});
		html += "</table>";
		$("#invoiceswinedit_history").html(html);
		if (rows_ac.length === 0) $("#invoiceswinedit_history_container").hide();
		else $("#invoiceswinedit_history_container").show();
	}
	justLoaded() {
		$("#invoiceswinedit_contactinfos").empty();

		this._linestodelete = [];

		for (var i = 0; i < this.numline; i++) {
			this.form.deleteByFakeGroup("oneline_" + i);
		}
		$("#invoiceswinedit_tablines").empty();
		this.numline = 0;
		var rows_il = this.currentModel.get("rows_il");
		_.each(rows_il, row_il => {
			this.addLine(row_il);
		});

		let what = "";
		$("#invoiceswinedit_forpld1").show();
		what = "devis ";
		$("#invoiceswinedit_tabproformadiv").hide();

		if (this.currentModel.get("in_id")) {
			$("#invoiceswinedit_title").html("Edition " + what + " " + this.currentModel.get("in_num"));
			$(".invoiceswinedit_bt_delete").prop("disabled", false);
			// this.form.find("co_id_contact").disable();
			// $("#" + this.idbtcreatecustomer).hide();
		} else {
			$("#invoiceswinedit_title").html("Création " + what);
			$(".invoiceswinedit_bt_delete").prop("disabled", true);
			// this.form.find("co_id_contact").enable();
			// $("#" + this.idbtcreatecustomer).show();
		}

		$("#invoiceswinedit_tabpaiements").empty();
		let table1 = $(
			"<table class='tablepayments' cellpadding='0' cellspacing='0'><tr><td></td><td style='width:100px;'></td><td style='width:110px;' class='M_AlignRight'></td><td style='width:110px;' class='M_AlignRight'><b>Paiement</b></td><td style='width:110px;' class='M_AlignRight'><b>Solde</b></td><td  style='width:50px;'></td></tr></table>"
		);
		$("#invoiceswinedit_tabpaiements").append(table1);
		_.each(this.currentModel.get("rows_pi"), row_pi => {
			row_pi.pi_sumttc = M_.Utils.price(row_pi.pi_sumttc);
			row_pi.pi_solde = M_.Utils.price(row_pi.pi_solde);
			// console.log("row_pi",row_pi);
			let sign = "€";
			if (row_pi.pi_ispurcent) sign = "%";
			table1.append(
				`<tr id=''>
				<td>Paiement ${row_pi.pa_id.pa_num}</td>
				<td>${moment(row_pi.pa_id.pa_date).format("DD/MM/YYYY")}</td>
				<td class="M_AlignRight" id=''>${row_pi.pi_value} ${sign}</td>
				<td class='M_AlignRight paiement'>${row_pi.pi_sumttc}</td>
				<td class="M_AlignRight solde">${row_pi.pi_solde}</td>
				</tr>`
			);
		});

		this.calculateTotal();
		this.completeAddressFacLiv();
		this.show();
		// this.loadLinkedInvoices();
	}

	newLine() {
		this.addLine({
			il_id: "",
			il_sumht: 0,
			il_qte: 1,
			il_paht: 0,
			il_puht: 0,
			il_remise: 0,
			il_description: "",
			il_refcustomer: "",
			il_qtestock: 0,
			il_tva: "20.00",
			pr_name: "",
			pr_id: {
				pr_id: "",
				pr_name: "",
				pr_description: "",
				pr_puht: 0
			}
		});
	}
	addLine(row_il) {
		var html = "";
		html += `
		<div id="invoices_line_${this.numline}" class='invoices_line_'>
			<div class="M_FlexRow">
				<div class="el1" style="min-width:300px;"></div>
				<div class="el2"></div>
				<div class="el3"></div>
				<div class="el4"></div>
				<div class="el5"></div>
				<div class="el6"></div>
				<div class="el7" style="max-width:50px;padding-top:10px;"></div>
			</div>
			<div class="M_FlexRow">
				<div class="el8"></div>
				<div class="el9" style="max-width:50px;"></div>
			</div>
		</div>
		`;
		$("#invoiceswinedit_tablines").append(html);

		// $('#invoices_line_'+this.numline+' .m_row_moredate1').hide() ;
		this.form.addItem({
			type: M_.Form.Hidden,
			name: "il_id_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			value: row_il.il_id,
			container: $("#invoices_line_" + this.numline + " .el1")
		});
		let pr_id_temp = "";
		if (row_il.pr_id && row_il.pr_id.pr_id) pr_id_temp = row_il.pr_id.pr_id;
		this.form.addItem({
			type: M_.Form.Hidden,
			name: "pr_id_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			value: pr_id_temp,
			container: $("#invoices_line_" + this.numline + " .el1")
		});
		this.form.addItem({
			type: M_.Form.Combobox,
			name: "pr_name_" + this.numline,
			label: "Produit",
			labelPosition: "top",
			numline: this.numline,
			fakeGroup: "oneline_" + this.numline,
			editable: true,
			placeholder: "",
			container: $("#invoices_line_" + this.numline + " .el1"),
			modelKey: "pr_id",
			value: row_il.pr_name,
			useRawValue: true,
			modelValue: function(model) {
				return model.get("pr_name"); //model.get("ga_id").ga_name + " - " +
			},
			store: new M_.Store({
				controller: this,
				model: MT_Products,
				url: "/1.0/products",
				limit: 200,
				currentSort: ["pr_name", "ASC"],
				listeners: [["beforeLoad", (store, args) => {}]]
			}),
			listeners: [
				[
					"itemclick",
					(cb, model) => {
						// console.log("model", model);
						this.form.find("pr_id_" + cb.numline).setValue(model.get("pr_id"));

						// this.form.find("il_paht_" + cb.numline).setValue(0);
						this.form.find("il_puht_" + cb.numline).setValue(model.get("pr_puht"));
						this.form.find("il_qte_" + cb.numline).setValue(1);
						this.form.find("il_description_" + cb.numline).setValue(model.get("pr_description"));

						// let desc = [];
						// let ga_columns = model.get("ga_id").ga_columns;
						// _.each(ga_columns, (col, index) => {
						// 	desc.push(col + " = " + model.get("pr_column" + (index + 1)));
						// });
						// this.form.find("il_description2_" + cb.numline).setValue(desc.join(", "));

						this.calculateTotal();
					}
				]
			]
		});

		this.form.addItem({
			type: M_.Form.Combobox,
			name: "il_tva_" + this.numline,
			numline: this.numline,
			fakeGroup: "oneline_" + this.numline,
			label: "TVA",
			labelPosition: "top",
			editable: false,
			placeholder: "",
			container: $("#invoices_line_" + this.numline + " .el4"),
			// modelKey: "pr_id",
			value: row_il.il_tva,
			// modelValue: function(model) {
			// 	return model.get("ga_id").ga_name + " - " + model.get("pr_id");
			// },
			store: new M_.Store({
				controller: this,
				model: M_.ModelKeyVal,
				rows: [
					{ key: "20.00", val: "20%" },
					{ key: "10.00", val: "10%" },
					{ key: "5.50", val: "5,5%" },
					{ key: "2.10", val: "2,1%" },
					{ key: "0.00", val: "0%" }
				]
			}),
			listeners: [
				[
					"itemclick",
					(cb, model) => {
						this.calculateTotal();
					}
				]
			]
		});
		this.form.addItem({
			type: M_.Form.Number,
			name: "il_remise_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			numline: this.numline,
			decimalLength: 2,
			label: "Remise",
			labelPosition: "top",
			labelWidth: 60,
			addon: "%",
			value: row_il.il_remise,
			container: $("#invoices_line_" + this.numline + " .el5"),
			listeners: [
				[
					"keyup",
					item => {
						this.calculateTotal(item.numline);
					}
				],
				[
					"change",
					item => {
						this.calculateTotal(item.numline);
					}
				],
				[
					"clickaddon",
					(el, evt) => {
						// console.log("clickaddon");
					}
				]
			]
		});

		// var disabled = true ;
		// if (!row_il.il_paht) row_il.il_paht=1 ;
		this.form.addItem({
			type: M_.Form.Number,
			name: "il_puht_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			numline: this.numline,
			decimalLength: 2,
			label: "Prix",
			labelPosition: "top",
			labelWidth: 60,
			value: row_il.il_puht,
			// addon: row_il.il_divise1000 ? "/1000" : "&nbsp;&nbsp;&nbsp;/1&nbsp;&nbsp;&nbsp;",
			// _currentil_divise1000: row_il.il_divise1000,
			container: $("#invoices_line_" + this.numline + " .el2"),
			listeners: [
				[
					"keyup",
					item => {
						this.calculateTotal(item.numline);
					}
				],
				[
					"change",
					item => {
						this.calculateTotal(item.numline);
					}
				]
			]
		});
		// this.form.addItem({
		// 	type: M_.Form.Number,
		// 	name: "il_paht_" + this.numline,
		// 	fakeGroup: "oneline_" + this.numline,
		// 	numline: this.numline,
		// 	decimalLength: 2,
		// 	label: "PA Ht",
		// 	labelPosition: "top",
		// 	labelWidth: 60,
		// 	// hide: true,
		// 	// disabled: disabled,
		// 	container: $("#invoices_line_" + this.numline + " .el3"),
		// 	// addon: "€",
		// 	value: row_il.il_paht,
		// 	listeners: [
		// 		[
		// 			"keyup",
		// 			item => {
		// 				this.calculateTotal(item.numline);
		// 			}
		// 		],
		// 		[
		// 			"change",
		// 			item => {
		// 				this.calculateTotal(item.numline);
		// 			}
		// 		]
		// 	]
		// });
		this.form.addItem({
			type: M_.Form.Number,
			name: "il_qte_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			numline: this.numline,
			decimalLength: 2,
			label: "Quantité",
			labelPosition: "top",
			labelWidth: 60,
			// hide: true,
			// disabled: disabled,
			container: $("#invoices_line_" + this.numline + " .el3"),
			// addon: "Qté",
			value: row_il.il_qte,
			listeners: [
				[
					"keyup",
					item => {
						this.calculateTotal(item.numline);
					}
				],
				[
					"change",
					item => {
						this.calculateTotal(item.numline);
					}
				]
			]
		});

		this.form.addItem({
			type: M_.Form.Price,
			numline: this.numline,
			name: "il_sumht_" + this.numline,
			fakeGroup: "oneline_" + this.numline,
			placeholder: "Somme",
			value: row_il.il_sumht,
			startEmpty: true,
			allowEmpty: false,
			// addon: "€&nbsp;HT",
			label: "Total HT",
			labelPosition: "top",
			container: $("#invoices_line_" + this.numline + " .el6"),
			listeners: [
				[
					"keyup",
					item => {
						this.calculateTotal(item.numline);
					}
				],
				[
					"change",
					item => {
						this.calculateTotal(item.numline);
					}
				]
			]
		});
		var allEmp = true;
		// if (row_il.et_id.et_mandatory) allEmp = false ;
		this.form.addItem({
			type: M_.Form.Textarea,
			name: "il_description_" + this.numline,
			height: 50,
			// placeholder: row_il.et_id.et_label,
			fakeGroup: "oneline_" + this.numline,
			value: row_il.il_description,
			allowEmpty: allEmp,
			container: $("#invoices_line_" + this.numline + " .el8")
		});

		var jElTrash = $('<span class="fa fa-trash M_IconFa2"></span>');
		$("#invoices_line_" + this.numline + " .el7").append(jElTrash);
		jElTrash.click({ numline: this.numline }, evt => {
			this.deleteLine(evt.data.numline);
		});

		this.calculateTotal();

		this.numline++;
		let s = this.jEl.find(".M_WindowBody").scrollTop();
		this.center();
		this.jEl.find(".M_WindowBody").scrollTop(s);
	}

	calculateTotal() {
		let totalht = 0;
		let totaltva = 0;
		let totalremise = 0;
		let tabTva = [];
		// let in_usetva = this.form.find("in_usetva").getValue();
		for (var i = 0; i < this.numline; i++) {
			if (this.form.find("pr_name_" + i)) {
				let qte = this.form.find("il_qte_" + i).getValue();
				// let paht = this.form.find("il_paht_" + i).getValue();
				let puht = this.form.find("il_puht_" + i).getValue();
				let remise = this.form.find("il_remise_" + i).getValue();
				// console.log("divise1000", divise1000);
				let tva = this.form.find("il_tva_" + i).getValue();
				let tvaTxt = this.form.find("il_tva_" + i).getRawValue();
				// let tva = 20;
				// let tvaTxt = "20%";
				let p = qte * puht;
				let remiseht = 0;
				if (remise * 1 > 0) {
					remiseht = p * remise / 100;
					// p = p - remiseht;
				}
				let ftva = _.find(tabTva, { key: tva });
				if (!ftva) {
					ftva = { key: tva, val: tvaTxt, sum: 0 };
					tabTva.push(ftva);
				}
				// // console.log('tabTva',tabTva);
				let tvasum = (p - remiseht) * (tva * 1 / 100);
				ftva.sum += tvasum;
				totalht += p;
				totaltva += tvasum;
				totalremise += remiseht;
				this.form.find("il_sumht_" + i).setValue(p - remiseht);
			}
		}
		$("#invoiceswinedit_total1").html("Total HT : " + M_.Utils.price(totalht) + "");
		$("#invoiceswinedit_total4").html("Total HT remise  : " + M_.Utils.price(totalremise) + "");
		$("#invoiceswinedit_total5").html("Total HT après remise : " + M_.Utils.price(totalht - totalremise) + "");
		let txtTva = "";
		_.each(tabTva, obj => {
			txtTva += "TVA " + obj.val + " : " + M_.Utils.price(obj.sum) + "<br>";
		});
		$("#invoiceswinedit_total2").html(txtTva);
		$("#invoiceswinedit_total3").html("Total TTC : " + M_.Utils.price(totalht - totalremise + totaltva) + "");
		this.form.find("in_sumht").setValue(totalht);
		this.form.find("in_sumtva").setValue(totaltva);
		this.form.find("in_sumttc").setValue(totalht - totalremise + totaltva);
		this.form.find("in_sumremise").setValue(totalremise);
		this.form.find("in_tvas").setValue(JSON.stringify(tabTva));
	}

	deleteLine(numline) {
		// var et_id = this.form.find('il_date_'+numline).et_id ;
		// var il_id = this.form.find('il_date_'+numline).il_id ;
		this._linestodelete.push(this.form.find("il_id_" + numline).getValue());
		// console.log("_linestodelete", this._linestodelete);
		this.form.deleteByFakeGroup("oneline_" + numline);
		$("#invoices_line_" + numline).remove();
		this.calculateTotal();
		this.center();
	}
	initWin(in_id, co_id) {
		this.currentCoID = co_id;
		this._linestodelete = [];
		this.form.load(in_id);
	}
}
