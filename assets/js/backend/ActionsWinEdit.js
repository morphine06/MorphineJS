"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";
import { MT_Actions } from "./../../compiled/models/MT_Actions.js";
import { ContactsWinEdit } from "./ContactsWinEdit.js";

export class ActionsWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/ActionsWinEdit.html"],
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
		if (!this._instance) this._instance = new ActionsWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			url: "/1.0/actions",
			model: MT_Actions,
			controller: this,
			processData: function(data) {},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						// if (form.find('ac_id').getValue()==='' &&
						// 	form.find('ac_password').getValue()==='' &&
						// 	form.find('ac_type').getValue()!='contact' &&
						// 	form.find('ac_type').getValue()!='customer' &&
						// 	form.find('ac_type').getValue()!='candidate') {
						// 	err.push({key:'ac_password', label:"Le mot de passe est vide"}) ;
						// 	return false ;
						// }
						// if (form.find('ac_name').getValue()==='' && form.find('ac_society').getValue()==='') {
						// 	err.push({key:'ac_name', label:"Vous devez indiquer un nom ou une société."}) ;
						// 	return false ;
						// }
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						if (this.currentModel.get("ac_id")) {
							this.jEl.find(".M_ModalDelete").prop("disabled", false);
						} else {
							this.jEl.find(".M_ModalDelete").prop("disabled", true);
						}
						if (this.currentModel.get("co_id_contact")) {
							this.loadContactInfos(this.currentModel.get("co_id_contact").co_id);
						} else {
							$("#actionswinedit_contactinfos").empty();
						}
						this.showActionTypePanel();
					}
				],
				[
					"save",
					(form, data) => {
						this.hide();
						if (this.controller.onSaveActionsWinEdit) this.controller.onSaveActionsWinEdit(data.data);
						// M_.App.open("Opportunities", "opportunities", "list");
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						if (this.controller.onDeleteActionsWinEdit) this.controller.onDeleteActionsWinEdit();
						// M_.App.open("Opportunities", "opportunities", "list");
					}
				],
				[
					"beforeLoad",
					(form, args) => {
						if (this._co_id_contact) {
							args.args.co_id_contact = this._co_id_contact;
							this._co_id_contact = null;
						}
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
					name: "ac_id",
					container: $("#actionswinedit_ac_type")
				},
				{
					type: M_.Form.Checkbox,
					name: "ac_share",
					// placeholder: "Partager",
					label: "Partager",
					labelPosition: "right",
					container: $("#actionswinedit_ac_share")
				},
				{
					type: M_.Form.Combobox,
					name: "ac_type",
					editable: false,
					allowEmpty: false,
					placeholder: "",
					label: "Type de l'action",
					labelPosition: "top",
					container: $("#actionswinedit_ac_type"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getActionsTypes()
					}),
					listeners: [
						[
							"itemclick",
							(store, model) => {
								this.currentModel.set("ac_type", model.get("key"));
								// this.currentModel.set("ac_call_date", moment());
								this.form.find("ac_call_date").setValue(moment());
								this.showActionTypePanel();
								// console.log("models", models);
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "ac_call_result",
					editable: false,
					allowEmpty: true,
					placeholder: "",
					label: "Résultat",
					labelPosition: "top",
					container: $("#actionswinedit_ac_call_result"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getCallResults()
					}),
					listeners: [
						[
							"itemclick",
							(store, model) => {
								this.currentModel.set("ac_call_result", model.get("key"));
								if (this.form.find("ac_call_result").getValue() * 1 == 1) {
									this.form.find("ac_call_recalldate").setValue(
										moment()
											.add(1, "days")
											.startOf("hour")
									);
									this.form.find("ac_call_co_id").setValue(M_.App.Session);
								}
								this.showActionTypePanel();
							}
						]
					]
				},

				{
					type: M_.Form.Textarea,
					name: "ac_call_text",
					label: "Remarque",
					labelPosition: "top",
					container: $("#actionswinedit_ac_call_text"),
					allowEmpty: true,
					height: 50
				},
				{
					type: M_.Form.DateHour,
					name: "ac_call_date",
					placeholder: "",
					label: "Date de l'appel",
					labelPosition: "top",
					container: $("#actionswinedit_ac_call_date"),
					allowEmpty: true
				},
				{
					type: M_.Form.DateHour,
					name: "ac_call_recalldate",
					placeholder: "",
					label: "Rappeler le",
					labelPosition: "top",
					container: $("#actionswinedit_ac_call_recalldate"),
					allowEmpty: true
				},
				{
					type: M_.Form.Combobox,
					name: "co_id_user",
					label: "Utilisateur",
					labelPosition: "top",
					placeholder: "",
					container: $("#actionswinedit_co_id_user"),
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
					name: "ac_call_co_id",
					label: "Utilisateur qui doit rappeler",
					labelPosition: "top",
					placeholder: "",
					container: $("#actionswinedit_ac_call_co_id"),
					modelKey: "co_id",
					modelValue: model => {
						return Shared.completeName(model.getData());
					},
					allowEmpty: true,
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
					container: $("#actionswinedit_co_id_contact"),
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
									args.args.onlycustomers = "true";
								}
							]
						]
					}),
					listeners: [
						[
							"itemclick",
							(tf, model) => {
								this.loadContactInfos(model.get("co_id"));
							}
						]
					]
				}
			]
		});

		this.jEl.find(".M_ModalSave").click(() => {
			this.form.validAndSave();
		});
		this.jEl.find(".M_ModalDelete").click(() => {
			this.form.delete(this.currentModel.get("ac_id"));
		});
		this.jEl.find(".M_ModalCancel").click(() => {
			if (this.controller.onCancelActionsWinEdit) this.controller.onCancelActionsWinEdit();
			this.hide();
		});
		$("#actionswinedit_btcontactcreate").click(evt => {
			ContactsWinEdit.getInstance(this).newContact();
		});
		$("#actionswinedit_btcontactmodify").click(evt => {
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
		$("#actionswinedit_btestimatecreate").click(evt => {
			// ContactsWinEdit.getInstance(this).newContact();
		});
		$("#actionswinedit_panel_call").hide();
		$("#actionswinedit_panel_estimate").hide();
	}

	loadContactInfos(co_id) {
		$("#actionswinedit_contactinfos").empty();
		if (!co_id) return;
		M_.Utils.getJson("/1.0/contacts/" + co_id, {}, data => {
			let row_co = data.data;
			Services.processContactsData(row_co);
			Services.renderContactsInfo($("#actionswinedit_contactinfos"), {
				row_co: row_co,
				canModify: true,
				withName: true
			});
			this.center();
		});
	}

	showActionTypePanel() {
		$("#actionswinedit_panel_call").hide();
		$("#actionswinedit_panel_estimate").hide();
		// console.log('this.currentModel.get("ac_type")', this.currentModel.get("ac_type"), this.currentModel.get("ac_call_result"));
		if (this.currentModel.get("ac_type") == "call") {
			$("#actionswinedit_ac_call_co_id").hide();
			$("#actionswinedit_ac_call_recalldate").hide();
			$("#actionswinedit_panel_call").show();
			if (this.currentModel.get("ac_call_result") == 1) {
				$("#actionswinedit_ac_call_co_id").show();
				$("#actionswinedit_ac_call_recalldate").show();
			}
		}
		if (this.currentModel.get("ac_type") == "estimate") {
			$("#actionswinedit_panel_estimate").show();
		}
		this.center();
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

	loadAction(ac_id, callback, co_id_contact) {
		this._co_id_contact = co_id_contact;
		this.form.load(ac_id, null, () => {
			// this._beforeShowWin() ;
			if (callback) callback(this.currentModel);
			this.show(true);
		});
	}
}
