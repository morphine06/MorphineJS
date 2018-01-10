"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Services } from "./Services.js";
// import { Shared } from "./../../compiled/Shared.js";
// import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";
// import { MT_Opportunities } from "./../../compiled/models/MT_Opportunities.js";
import { MT_Actions } from "./../../compiled/models/MT_Actions.js";
// import { ContactsWinEdit } from "./ContactsWinEdit.js";

export class DocumentsWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/DocumentsWinEdit.html"],
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
		if (!this._instance) this._instance = new DocumentsWinEdit({ controller: controller });
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
					}
				],
				[
					"save",
					(form, data) => {
						if (form.find("do_file").getValue() !== "") {
						} else {
							// M_.App.open("Opportunities", "opportunities", "list");
							this.hide();
						}
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						if (this.controller.onDeleteDocumentsWinEdit) this.controller.onDeleteDocumentsWinEdit();
						// M_.App.open("Opportunities", "opportunities", "list");
					}
				],
				[
					"beforeLoad",
					(form, args) => {
						// if (this._co_id_contact) {
						// 	args.args.co_id_contact = this._co_id_contact;
						// 	this._co_id_contact = null;
						// }
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
					name: "do_id",
					container: $("#documentswinedit_do_name")
				}

				// {
				// 	type: M_.Form.Text,
				// 	name: "do_name",
				// 	label: "Nom du fichier",
				// 	labelPosition: "top",
				// 	container: $("#documentswinedit_do_name"),
				// 	allowEmpty: true,
				// 	height: 50
				// }
			]
		});

		this.jEl.find(".M_ModalSave").click(() => {
			// this.form.validAndSave();
			M_.Utils.saveFiles([this.form.find("do_file").jEl.get(0)], "/1.0/documents/saveimage", { co_id: this._co_id_contact }, data => {
				if (this.controller.onSaveDocumentsWinEdit) this.controller.onSaveDocumentsWinEdit(data.data);
				this.hide();
			});
		});
		this.jEl.find(".M_ModalDelete").click(() => {
			this.form.delete(this.currentModel.get("ac_id"));
		});
		this.jEl.find(".M_ModalCancel").click(() => {
			if (this.controller.onCancelDocumentsWinEdit) this.controller.onCancelDocumentsWinEdit();
			this.hide();
		});
	}

	onSaveContactsWinEdit(row_co) {
		// this.form.find("co_id_contact").setValue(row_co);
		// this.loadContactInfos(row_co.co_id);
	}
	onDeleteContactsWinEdit() {
		// this.form.find("co_id_contact").setValue({ co_id: "", co_name: "", co_firstname: "" });
		// this.loadContactInfos(null);
	}
	onCancelContactsWinEdit() {}

	newDocument(do_id, callback, co_id_contact) {
		this._co_id_contact = co_id_contact;
		if (this.form.find("do_file")) {
			this.form.find("do_file").destroy();
			this.form.deleteItem("do_file");
		}

		this.form.addItem({
			type: M_.Form.File,
			name: "do_file",
			placeholder: "Fichier",
			label: "Fichier",
			labelPosition: "left",
			labelWidth: 70,
			container: $("#documentswinedit_do_file")
		});

		this.show(true);
		this.center();
		if (callback) callback(this.currentModel);
		// this.form.load(do_id, null, () => {
		// 		// this._beforeShowWin() ;
		// 	});
	}
}
