"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";

import { MT_Contacts } from "../../compiled/models/MT_Contacts.js";
import { MT_Logs } from "../../compiled/models/MT_Logs.js";
import { MT_Vacations } from "../../compiled/models/MT_Vacations.js";
import { MT_Lists } from "../../compiled/models/MT_Lists.js";

export class VacationsWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/VacationsWinEdit.html"],
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
	}

	static getInstance(controller) {
		if (!this._instance) this._instance = new VacationsWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			controller: this,
			model: MT_Vacations,
			// container: this.jEl.find('.campaignswineditmail_form'),
			// containerAlert: this.jEl.find('.campaignswineditmail_alertgroup'),
			url: "/1.0/vacations",
			listeners: [
				[
					"load",
					(store, model) => {
						$("#vacationswinedit_save1").prop("disabled", false);
						$("#vacationswinedit_save2").prop("disabled", false);
						$("#vacationswinedit_save3").prop("disabled", false);
						$("#vacationswinedit_delete").prop("disabled", false);
						this.currentModel = model;
						this.currentModelVT = model.get("va_type");
						this.initWinNow();
					}
				],
				[
					"valid",
					(form, ok, err) => {
						if (!ok) return false;
						var va_start = form.find("va_start").getValue();
						var va_end = form.find("va_end").getValue();
						var ok2 = true;
						if (!moment.isMoment(va_start)) {
							err.push({ key: "va_start", label: "Date de départ obligatoire" });
							ok2 = false;
						}
						if (!moment.isMoment(va_end)) {
							err.push({ key: "va_end", label: "Date de fin obligatoire" });
							ok2 = false;
						}
						if (va_start.isAfter(va_end)) {
							err.push({ key: "va_start", label: "Date de début après la date de fin" });
							ok2 = false;
							this.form.find("va_start").informValid(false);
							this.form.find("va_end").informValid(false);
						}
						// console.log("this.currentModelVT", this.currentModelVT);
						if (this.currentModelVT.vt_mandatory && this.form.find("va_comment").getValue() === "") {
							err.push({ key: "va_start", label: "Le commentaire est obligatoire avec le type d'absence que vous avez choisi" });
							ok2 = false;
							this.form.find("va_comment").informValid(false);
						}
						return ok2;
					}
				],
				// 87.254.238.100
				// alex@miells.com
				[
					"beforeSave",
					(store, data) => {
						$("#vacationswinedit_save1").prop("disabled", true);
						$("#vacationswinedit_save2").prop("disabled", true);
						$("#vacationswinedit_save3").prop("disabled", true);
						$("#vacationswinedit_delete").prop("disabled", true);
					}
				],
				[
					"save",
					(store, data) => {
						if (data.emailsSended) {
							var managers = "",
								supervisors = "";
							_.each(data.managers, function(manager, ind) {
								if (ind > 0) managers += " et ";
								managers += Shared.completeName(manager);
							});
							_.each(data.supervisors, function(supervisor, ind) {
								if (ind > 0) supervisors += " et ";
								supervisors += Shared.completeName(supervisor);
							});
							M_.Dialog.notify(
								"<b>Information</b><br/>L'absence a été enregistrée. Un email a été envoyé au responsable de votre agence <span class='M_Important'>" +
									managers +
									"</span> et au siège à <span class='M_Important'>" +
									supervisors +
									"</span> pour validation",
								10000
							);
						}
						if (this.controller.onSaveVacationsWinEdit) this.controller.onSaveVacationsWinEdit();
						this.hide();
						// Services.updateBadgeActions();
					}
				],
				[
					"delete",
					(store, model) => {
						if (this.controller.onDeleteVacationsWinEdit) this.controller.onDeleteVacationsWinEdit();
						this.hide();
						// Services.updateBadgeActions();
					}
				]
			],
			items: [
				{
					type: M_.Form.Hidden,
					controller: this,
					container: $("#vacationswinedit_va_start"),
					name: "va_id"
				},
				{
					type: M_.Form.Textarea,
					name: "va_comment",
					label: "Commentaire",
					styleInput: "height:116px;",
					container: $("#vacationswinedit_va_comment")
				},
				{
					type: M_.Form.Textarea,
					name: "va_comment2",
					label: "Commentaire admin validation/rejet",
					styleInput: "height:116px;",
					container: $("#vacationswinedit_va_comment2")
				},
				{
					type: M_.Form.Date,
					name: "va_start",
					label: "Date de début",
					// labelPosition: 'left',
					container: $("#vacationswinedit_va_start"),
					disabledDates: (cal, d) => {
						if (d.day() === 0) return true; // || d.day()==6
						if (!Shared.isDayWorked(d.format("YYYY-MM-DD"))) return true;
						return false;
					},
					listeners: [
						[
							"change",
							(outlet, val) => {
								var va_start = this.form.find("va_start").getValue();
								var va_end = this.form.find("va_end").getValue();
								if (va_start.isAfter(va_end)) {
									this.form.find("va_end").setValue(moment(va_start));
								}

								this.setNbDaysInfos();
							}
						]
					]
				},
				{
					type: M_.Form.Date,
					name: "va_end",
					label: "Date de fin",
					// labelPosition: 'left',
					// labelWidth: 50,
					container: $("#vacationswinedit_va_end"),
					allowEmpty: false,
					disabledDates: (cal, d) => {
						var minDate = this.form.find("va_start").getValue();
						if (d.isBefore(minDate)) return true;
						var va_type = this.form.find("va_type").getValue();
						if (d.day() === 0 && va_type != 3 && va_type != 7 && va_type != 2 && va_type != 4) return true; // || d.day()==6
						if (!Shared.isDayWorked(d.format("YYYY-MM-DD"))) return true;
						return false;
					},
					listeners: [
						[
							"change",
							(outlet, val) => {
								this.setNbDaysInfos();
							}
						]
					]
				},
				{
					type: M_.Form.Checkbox,
					name: "va_start2",
					label: "Matin<br/>travaillé",
					labelPosition: "right",
					controller: this,
					container: $("#vacationswinedit_va_start2"),
					listeners: [
						[
							"change",
							(outlet, val) => {
								this.setNbDaysInfos();
							}
						]
					]
				},
				{
					type: M_.Form.Checkbox,
					name: "va_end2",
					label: "Après-midi<br/>travaillé",
					labelPosition: "right",
					container: $("#vacationswinedit_va_end2"),
					listeners: [
						[
							"change",
							(outlet, val) => {
								this.setNbDaysInfos();
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "va_status",
					label: "Etat",
					editable: false,
					labelPosition: "left",
					container: $("#vacationswinedit_va_status"),
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getVaStatus()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "va_type",
					label: "Type d'absence",
					labelPosition: "top",
					editable: false,
					// labelWidth: 130,
					container: $("#vacationswinedit_va_type"),
					allowEmpty: false,
					modelKey: "li_id",
					modelValue: "li_name",
					store: new M_.Store({
						controller: this,
						model: MT_Lists,
						url: "/1.0/vacationstypes",
						// args: {sort:'vt_name'},
						currentSort: "li_name",
						limit: 200
					}),
					listeners: [
						[
							"itemclick",
							(cb, model) => {
								// console.log("model.get('vt_description')", model.get('vt_description'));
								$("#vacationswinedit_vt_description").html(model.get("vt_description"));
								this.currentModelVT = model.getData();
							}
						]
					]
				},
				// {
				// 	type: M_.Form.Combobox,
				// 	name: "ag_id",
				// 	label: "Agence",
				// 	labelPosition: "top",
				// 	placeholder: "",
				// 	container: $("#vacationswinedit_ag_id"),
				// 	editable: false,
				// 	allowEmpty: false,
				// 	modelKey: "ag_id",
				// 	modelValue: function(model) {
				// 		return model.get("ag_name");
				// 	},
				// 	store: new M_.Store({
				// 		controller: this,
				// 		model: MT_Agencies,
				// 		url: "/1.0/agencies",
				// 		limit: 200,
				// 		listeners: [
				// 			[
				// 				"beforeLoad",
				// 				(store, args) => {
				// 					var co_id = this.form.find("co_id_user").getValue();
				// 					if (co_id !== "" && co_id != "-1") args.args.withcoid = co_id;
				// 				}
				// 			]
				// 		]
				// 	}),
				// 	listeners: [
				// 		[
				// 			"itemclick",
				// 			() => {
				// 				// this.loadAdminVacation() ;
				// 			}
				// 		]
				// 	]
				// },
				{
					type: M_.Form.Combobox,
					name: "co_id_user",
					label: "Utilisateur",
					labelPosition: "left",
					placeholder: "",
					container: $("#vacationswinedit_co_id_user"),
					modelKey: "co_id",
					modelValue: function(model) {
						return Shared.completeName(model.getData());
					},
					store: new M_.Store({
						controller: this,
						model: MT_Contacts,
						url: "/1.0/contacts",
						limit: 200,
						args: () => {
							var args = { onlyusers: true };
							if (Shared.canSeeAllUsersForVacation(M_.App.Session)) {
								args.onlymyagency = false;
								args.onlymine = false;
							} else {
								args.onlymyagency = true;
								args.onlymine = true;
								if (Shared.canSeeUsersOfMyAgencyForVacation(M_.App.Session)) args.onlymine = false;
							}
							// console.log("args", args);
							return args;
						}
					}),
					listeners: [
						[
							"itemclick",
							(store, model) => {
								// console.log("model", model);
								// this.form.find("ag_id").setValue("");
								this.currentModel.set("co_id_user", model.getData());

								Services.getPhraseVacationAcquis(model.get("co_id"), $("#vacationswinedit_infos"));
							}
						]
					]
				}
			]
		});

		this.logs = new M_.TableList({
			// controller: this,
			container: $("#vacationswinedit_actions"),
			// limitRows: 3,
			store: new M_.Store({
				controller: this,
				model: MT_Logs,
				url: "/1.0/logs",
				limit: 2000,
				listeners: [
					[
						"update",
						(store, models) => {
							// console.log("center");
							window.setTimeout(() => {
								this.center();
							}, 300);
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model) => {
						// ActionWinEdit.getInstance(this).load(m_id) ;
					}
				],
				[
					"render",
					(store, models) => {
						this.show(true);
					}
				]
			],
			colsDef: [
				{
					label: "Historique",
					// val: 'ac_type',
					// width: 130,
					val: function(model) {
						return _.result(Shared.getLogsTypes(model.get("lg_type")), "val");
					}
				},
				{
					label: "Utilisateur",
					// width: 150,
					val: function(model) {
						if (model.get("co_id_user")) return Shared.completeName(model.get("co_id_user"));
						return "";
					}
				},
				{
					label: "Date",
					width: 150,
					val: function(model) {
						return moment(model.get("createdAt")).format("DD/MM/YYYY | HH:mm");
					}
				}
				// {
				// 	label: "Etat",
				// 	width: 150,
				// 	val: model => {
				// 		var f = _.find(Shared.getActionsTypes(), { key: model.get("ac_type") });
				// 		// var txt = "";
				// 		if (f) return "<div class='vacations_status " + f.color + "'>" + f.short + "</div>";
				// 		return "";
				// 	}
				// }
			]
		});

		$("#vacationswinedit_save1").click(() => {
			this.saveVacation();
		});
		$("#vacationswinedit_save2").click(() => {
			if (Shared.canValidVacationLikeDirector(M_.App.Session)) this.form.find("va_status").setValue("vacations_accepted");
			this.saveVacation();
		});
		$("#vacationswinedit_save3").click(() => {
			if (this.form.find("va_comment2").getValue() === "") {
				this.form.find("va_comment2").informValid(false);
				return M_.Dialog.alert("Information", "Merci d'indiquer un commentaire pour un refus", () => {});
			}
			this.form.find("va_status").setValue(2);
			if (Shared.canValidVacationLikeDirector(M_.App.Session)) this.form.find("va_status").setValue("vacations_refused");
			this.saveVacation();
		});
		$("#vacationswinedit_delete").click(() => {
			this.deleteVacation();
		});
		$("#vacationswinedit_cancel").click(() => {
			if (this.controller.onCancelVacationWinEdit) this.controller.onCancelVacationWinEdit();
			this.hide();
		});
	}
	// newVacation() {
	// 	this.loadVacation("-1", ()=> {
	// 		this.editVacation(this.currentModel) ;
	// 	}) ;
	// }
	deleteVacation() {
		M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette absence ?", () => {
			this.form.delete(this.currentModel.get("va_id"));
		});
	}
	saveVacation() {
		this.form.validAndSave();
	}
	setNbDaysInfos() {
		var v1 = this.form.find("va_start").getValue();
		var v2 = this.form.find("va_end").getValue();
		if (!moment.isMoment(v1) || !moment.isMoment(v2)) {
			$("#vacationswinedit_nbdaysinfos").html("");
			return;
		}
		var v1bis = this.form.find("va_start2").getValue();
		var v2bis = this.form.find("va_end2").getValue();
		var nbDays = Shared.getNbOpenDays(v1, v2, v1bis, v2bis);
		$("#vacationswinedit_nbdaysinfos").html(
			"Du " +
				v1.format("dddd D MMMM YYYY") +
				" au " +
				v2.format("dddd D MMMM YYYY") +
				" soit <strong>" +
				M_.Utils.plural(nbDays, "jour", "jours") +
				"</strong>"
		);
	}
	setTitleWin() {
		var html = "Edition d'une absence";
		if (!this.currentModel.get("va_id")) html = "Création d'une absence";
		$("#vacationswinedit_title").html(html);
	}
	initWinNow() {
		if (this.currentModel.get("va_id")) {
			this.jEl.find(".M_ModalDelete").prop("disabled", false);
			this.form.find("co_id_user").disable();
		} else {
			this.jEl.find(".M_ModalDelete").prop("disabled", true);
			this.form.find("co_id_user").enable();
			// let va_start = "";
			// if (this.defaultVaStart) va_start = this.defaultVaStart ;
			// this.form.find('va_start').setValue(va_start) ;
			// this.form.find('va_end').setValue('') ;
		}
		// this.defaultVaStart = null ;

		this.setTitleWin();
		this.setNbDaysInfos();
		if (this.currentModel.get("va_id") !== "") {
			this.actions.getStore().load({ va_id: this.currentModel.get("va_id") });
		} else {
			this.show();
			this.actions.getStore().load({ va_id: -1 });
		}

		Services.getPhraseVacationAcquis(this.currentModel.get("co_id_user").co_id, $("#vacationswinedit_infos"));

		var okModify = Shared.canModifyVacation(this.currentModel.getData(), M_.App.Session);
		$("#vacationswinedit_save1").prop("disabled", !okModify);
		$("#vacationswinedit_save2").prop("disabled", !okModify);
		$("#vacationswinedit_save3").prop("disabled", !okModify);
		$("#vacationswinedit_delete").prop("disabled", !okModify);

		$("#vacationswinedit_va_status").hide();
		$("#vacationswinedit_save2div").hide();
		$("#vacationswinedit_save3div").hide();
		$("#vacationswinedit_va_comment2").hide();
		if (Shared.canValidVacationLikeDirector(M_.App.Session)) {
			$("#vacationswinedit_va_status").hide();
			$("#vacationswinedit_va_comment2").show();
			if (this.currentModel.get("va_status") == 0 || this.currentModel.get("va_status") == 4) {
				$("#vacationswinedit_save2div").show();
				$("#vacationswinedit_save3div").show();
				$("#vacationswinedit_save2").html("Accepté");
			}
		}
	}
	loadVacation(va_id, va_start) {
		// console.log("loadVacation");
		// this.defaultVaStart = va_start ;
		// log("model.get('op_id')",model.get('op_id'), this.jEl.find('.M_ModalDelete'))
		this.form.load(va_id, { va_start: va_start });
		// var model = this.controller.cal1.getStore().getRow(va_id) ;
		// this.form.populate(model) ;
		// this.show() ;
		// this.dontShowWin = false ;
	}
}
