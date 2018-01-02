"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";

export class Preferences extends M_.Controller {
	constructor(opts) {
		// console.log("MT_Jobs",MT_Jobs);
		opts.tpl = JST["assets/templates/backend/Preferences.html"];
		super(opts);
	}
	init() {}
	create() {
		this.mainTabs = new M_.Tabs({
			container: $("#preferences_tabs"),
			firstTab: "preferences_home"
		});

		var html = "";
		html += `<table class="offerdetail_table">
				<tr>
					<td>Droits :</td>`;
		_.each(Shared.getRoles(), role => {
			if (role.key === "" || role.key == " ") return;
			html += `<td class='M_AlignCenter'><b>${role.val}</b></td>`;
		});
		html += `</tr>`;
		_.each(Shared.getRights(), right => {
			html += `<tr>
						<td>${right.label}</td>`;
			_.each(Shared.getRoles(), role => {
				if (role.key === "" || role.key == " ") return;
				html += `<td class='M_AlignCenter' id='preferences_rights_${role.key}_${right.key}'></td>`;
			});
			html += `</tr>`;
		});
		html += `</table>`;
		$("#preferences_rightsall").html(html);

		var itemsRights = [];
		_.each(Shared.getRights(), right => {
			_.each(Shared.getRoles(), role => {
				if (role.key === "" || role.key == " ") return;
				itemsRights.push({
					type: M_.Form.Checkbox,
					name: role.key + "_" + right.key,
					value: false,
					container: $("#preferences_rights_" + role.key + "_" + right.key)
				});
			});
		});
		this.formRights = new M_.Form.Form({
			controller: this,
			// model: MT_Events,
			// container: this.jEl.find('.calendarwinedit_form'),
			// containerAlert: this.jEl.find('.calendarwinedit_alertgroup'),
			url: "/1.0/preferences/rights",
			listeners: [
				[
					"save",
					$.proxy(function(store, model) {
						// M_.Dialog.alert("Information", "Les droits ont été sauvegardés.<br/><br/><b>Le programme va redémarrer pour prendre en compte les modifications.</b>", ()=> {
						// window.open('/#/Preferences/rights', '_self') ;
						window.location.reload();
						// }) ;
					}, this)
				],
				[
					"load",
					$.proxy(function(store, model) {
						// console.log("model",model);
					}, this)
				],
				["delete", $.proxy(function(store, model) {}, this)]
			],
			items: itemsRights
		});
		$("#preferences_rights_save").click(() => {
			this.formRights.save();
		});
	}
	rightsAction() {
		this.mainTabs.show("preferences_rights", next => {
			$("#preferences_title").html("Les droits");
			$("#preferences_btreturn").show();
			this.formRights.load(1);
			next();
		});
	}
	indexAction() {
		this.mainTabs.show("preferences_home", next => {
			$("#preferences_title").html("Toutes les préférences");
			$("#preferences_btreturn").hide();
			next();
		});
	}
}
