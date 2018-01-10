"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Services } from "./Services.js";
// import { Shared } from "./../../compiled/Shared.js";
import { MT_Lists } from "./../../compiled/models/MT_Lists.js";

export class ListsWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/ListsWinEdit.html"],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 400,
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
		if (!this._instance) this._instance = new ListsWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			url: "/1.0/lists",
			model: MT_Lists,
			controller: this,
			processData: function(data) {},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						if (this.currentModel.get("li_id")) {
							this.jEl.find(".M_ModalDelete").prop("disabled", false);
						} else {
							this.jEl.find(".M_ModalDelete").prop("disabled", true);
						}
					}
				],
				[
					"save",
					(form, data) => {
						this.hide();
						if (this.controller.onSaveListsWinEdit) this.controller.onSaveListsWinEdit(data.data);
						// M_.App.open("Opportunities", "opportunities", "list");
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						if (this.controller.onDeleteListsWinEdit) this.controller.onDeleteListsWinEdit();
						// M_.App.open("Opportunities", "opportunities", "list");
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
					name: "li_id",
					container: $("#listswinedit_li_name")
				},
				{
					type: M_.Form.Checkbox,
					name: "li_activate",
					// placeholder: "Partager",
					label: "Actif",
					labelPosition: "right",
					container: $("#listswinedit_li_activate")
				},
				{
					type: M_.Form.Number,
					name: "li_position",
					label: "Position",
					labelPosition: "top",
					container: $("#listswinedit_li_position"),
					allowEmpty: true
				},
				{
					type: M_.Form.Text,
					name: "li_name",
					label: "Nom de l'élément de la liste",
					labelPosition: "top",
					container: $("#listswinedit_li_name"),
					allowEmpty: false
				},
				{
					type: M_.Form.Textarea,
					name: "li_options",
					label: "Options de l'élément",
					labelPosition: "top",
					container: $("#listswinedit_li_options"),
					allowEmpty: true,
					height: 50
				},
				{
					type: M_.Form.Text,
					name: "li_group",
					label: "Nom de la liste",
					labelPosition: "top",
					container: $("#listswinedit_li_group"),
					allowEmpty: false,
					height: 50
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
	}

	loadList(li_id, callback) {
		this.form.load(li_id, null, () => {
			// this._beforeShowWin() ;
			if (callback) callback(this.currentModel);
			this.show(true);
		});
	}
}
