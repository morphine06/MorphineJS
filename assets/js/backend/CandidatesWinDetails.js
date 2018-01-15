"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { CandidatesWinEdit } from "./CandidatesWinEdit.js";
import { MT_Actions } from "./../../compiled/models/MT_Actions.js";
import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";

export class CandidatesWinDetails extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST.CandidatesWinDetails,
			// tplData: {},
			// html: ``,
			modal: true,
			// controller: this,
			width: 900,
			// minHeight: '80%',
			opencoid: ""
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
		// log("this.jEl",this.jEl)
	}

	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new CandidatesWinDetails({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.mainTabs = new M_.Tabs({
			container: $("#candidateswindetails_tabs"),
			buttons: $("#candidateswindetails_tabsbuttons"),
			firstTab: "candidateswindetails_details",
			onChange: (idTab, next) => {
				// this.center() ;
				if (idTab == "candidateswindetails_history") {
					this.actions.getStore().reload(false, {}, () => {
						this.center();
					});
				}
				if (idTab == "candidateswindetails_details") {
					this.center();
				}
				if (idTab == "candidateswindetails_steps") {
					this.center();
				}
				if (idTab == "candidateswindetails_steps2") {
					this.center();
				}

				next();
			}
		});

		this.formAction = new M_.Form.Form({
			url: "/1.0/actions",
			model: MT_Actions,
			controller: this,
			listeners: [
				[
					"beforeSave",
					(form, data) => {
						// console.log("data.args", data);
						data.args.ca_id = this.currentData.ca_id;
					}
				],
				[
					"save",
					(form, model) => {
						form.reset();
						this.actions.getStore().reload();
					}
				]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				labelPosition: "top"
				// labelWidth: 100
			},
			items: [
				{
					type: M_.Form.Combobox,
					name: "ac_type",
					label: "Type",
					labelPosition: "top",
					container: $("#candidateswindetails_ac_type"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getActionTypes()
					}),
					listeners: [
						[
							"itemclick",
							(tf, val) => {
								// this.setTitleWin() ;
							}
						]
					]
				},
				{
					container: $("#candidateswindetails_ac_text"),
					name: "ac_text",
					label: "Texte"
				}
			]
		});
		$("#candidateswindetails_btsaveaction").click(evt => {
			this.formAction.save();
		});
		$("#candidateswindetails_btcreatecontact").click(evt => {
			this.openWinNewUser();
		});
		$("#candidateswindetails_btseecontact").click(() => {
			this.hide();
			// console.log("this.opencoid",this.opencoid);
			M_.App.open("Contacts", "edit", this.opencoid);
		});

		this.formSubtasks = new M_.Form.Form({
			url: "/1.0/candidates/subtasks",
			// model: MT_Candidates,
			controller: this,
			listeners: [
				[
					"beforeSave",
					(form, data) => {
						// console.log("data.args", data);
						data.args.ca_id = this.currentData.ca_id;
						this.modal = new M_.Modal({
							clickHide: false,
							isLoading: "En cours de chargement<br>Merci de patienter"
						});
						this.modal.show();
					}
				],
				[
					"save",
					(form, data) => {
						var tabFiles = [];
						_.each(form.getItems(), item => {
							if (item instanceof M_.Form.File) {
								// console.log("item.getValue()", item.getValue());
								if (item.getValue()) tabFiles.push(item);
							}
						});
						// console.log("tabFiles,data", tabFiles, data);
						function sendNextFileNow(ca_id, cb) {
							let item = tabFiles.pop();
							if (item) {
								M_.Utils.saveFiles(
									[item.jEl.get(0)],
									"/1.0/candidates/savesubtasksfile",
									{
										ca_id: ca_id,
										name: item.name,
										num: item.name.substring(13) //subtask_file_
									},
									data => {
										sendNextFileNow(ca_id, cb);
									}
								);
							} else cb();
						}
						sendNextFileNow(data.data.ca_id, () => {
							_.each(form.getItems(), item => {
								if (item instanceof M_.Form.File) {
									item.recreate();
								}
							});
							if (this._thenprint) {
								window.open("/1.0/candidates/exportcandidat/" + this.currentData.ca_id, "_self");
								this._thenprint = false;
							} else {
							}
							this.modal.hide();
						});
					}
				],
				[
					"update",
					(form, model) => {
						// log("update")
						var subtasks = Shared.getCandidateSubTasks();
						_.each(subtasks, (subtask, ind) => {
							var outlet = this.formSubtasks.find("subtask_do_" + subtask.key);
							// if (!outlet) return ;
							if (subtask.key == 34 || subtask.key == 134) return;
							var tr = outlet.jEl.closest("tr");
							if (tr.length && outlet.getValue()) {
								tr.find("td:nth-child(2)").html(this.getSubtaskIco(true));
								tr
									.find("td:nth-child(1)")
									.find("div.candidateswindetails_by")
									.html("Fait par " + this.formSubtasks.find("subtask_by_" + subtask.key).getValue());
							} else {
								tr.find("td:nth-child(2)").html(this.getSubtaskIco(false));
								tr
									.find("td:nth-child(1)")
									.find("div.candidateswindetails_by")
									.html("");
							}
							tr.find(".herefiledescription").html("");
							// if () tr.find('.herefiledescription')
						});
					}
				]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				labelPosition: "left",
				labelWidth: 100
			},
			items: []
		});

		for (var numPart = 0; numPart < 2; numPart++) {
			var html = "<table style='width:100%;'>";
			var subtasks = Shared.getCandidateSubTasks();
			_.each(subtasks, (subtask, ind) => {
				if (numPart == 0 && subtask.key >= 100) return;
				if (numPart == 1 && subtask.key < 100) return;
				var idTemp = M_.Utils.id();
				html +=
					"<tr id='" +
					idTemp +
					"' class='candidateswindetails_tr'><td style='width:300px;'></td><td style='width:30px;'></td><td style='width:130px; vertical-align:top;'></td><td style='vertical-align:top;'><div class='herecommdescription'></div><div class='herefiledescription' style='margin-top:-8px;margin-bottom:8px;'></div></td><td style='width:30px;vertical-align:top;padding-top:7px;'><span class='forinputfile'></span><label for='subtask_file_" +
					subtask.key +
					"'><span style='font-size:16px;' class='fa fa-file'></span></label></td></tr>";
				subtask.idTemp = idTemp; //<span class='fa fa-edit'></span><span class='forinputfile'></span>
			});
			html += "</table>";
			if (numPart == 0) $("#candidateswindetails_cbs").html(html);
			if (numPart == 1) $("#candidateswindetails_cbs2").html(html);
			_.each(subtasks, (subtask, ind) => {
				if (numPart == 0 && subtask.key >= 100) return;
				if (numPart == 1 && subtask.key < 100) return;
				if (subtask.key == 34 || subtask.key == 134) {
					$("#" + subtask.idTemp + " td:nth-child(1)").html(
						"<label style='display:inline-block; margin-left:30px;'>" + subtask.val + "</label>"
					);
				} else
					this.formSubtasks.addItem({
						type: M_.Form.Checkbox,
						container: $("#" + subtask.idTemp + " td:nth-child(1)"),
						name: "subtask_do_" + subtask.key,
						label: subtask.val,
						myidtemp: subtask.idTemp,
						labelPosition: "right",
						listeners: [
							[
								"change",
								(outlet, val) => {
									// console.log("change");
									var indTemp = outlet.name.substring(11);
									if (val) {
										outlet.jEl
											.closest("td")
											.find("div.candidateswindetails_by")
											.html("Fait par " + Services.completeName(M_.App.Session));
										this.formSubtasks.find("subtask_by_" + indTemp).setValue(Services.completeName(M_.App.Session));
									} else {
										outlet.jEl
											.closest("td")
											.find("div.candidateswindetails_by")
											.empty();
										this.formSubtasks.find("subtask_by_" + indTemp).setValue("");
									}
									// var idTR = outlet.jEl.closest("tr").attr("id");
									if (val) {
										this.formSubtasks.find("subtask_date_" + indTemp).setValue(moment());
										$("#" + outlet.myidtemp + " td:nth-child(2)").html(this.getSubtaskIco(true));
									} else {
										this.formSubtasks.find("subtask_date_" + indTemp).setValue("");
										$("#" + outlet.myidtemp + " td:nth-child(2)").html(this.getSubtaskIco(false));
									}
								}
							]
						]
					});
				$("#" + subtask.idTemp + " td:nth-child(1)").append(
					'<div style="margin:-8px 0 0 30px;" class="little candidateswindetails_by"></div>'
				);
				this.formSubtasks.addItem({
					type: M_.Form.Hidden,
					container: $("#" + subtask.idTemp + " td:nth-child(3)"),
					name: "subtask_by_" + subtask.key
				});
				this.formSubtasks.addItem({
					type: M_.Form.Hidden,
					container: $("#" + subtask.idTemp + " td:nth-child(3)"),
					name: "subtask_filename_" + subtask.key
				});
				if (subtask.key != 34 && subtask.key != 134)
					$("#" + subtask.idTemp + " td:nth-child(2)").html('<span class="red fa fa-warning"></span>');
				if (subtask.key != 34 && subtask.key != 134)
					this.formSubtasks.addItem({
						type: M_.Form.Date,
						container: $("#" + subtask.idTemp + " td:nth-child(3)"),
						name: "subtask_date_" + subtask.key,
						myidtemp: subtask.idTemp,
						listeners: [
							[
								"change",
								(outlet, val) => {
									var indTemp = outlet.name.substring(13);
									if (!this.formSubtasks.find("subtask_do_" + indTemp).getValue()) {
										this.formSubtasks.find("subtask_do_" + indTemp).setValue(true);
										outlet.jEl
											.closest("tr")
											.find("div.candidateswindetails_by")
											.html("Fait par " + Services.completeName(M_.App.Session));
										// console.log(outlet.jEl.closest("td").find("div.candidateswindetails_by"));
										this.formSubtasks.find("subtask_by_" + indTemp).setValue(Services.completeName(M_.App.Session));
										$("#" + outlet.myidtemp + " td:nth-child(2)").html(this.getSubtaskIco(true));
									}
								}
							]
						]
					});
				this.formSubtasks.addItem({
					type: M_.Form.Text,
					container: $("#" + subtask.idTemp + " td:nth-child(4) .herecommdescription"),
					name: "subtask_com_" + subtask.key
				});
				this.formSubtasks.addItem({
					type: M_.Form.File,
					container: $("#" + subtask.idTemp + " td:nth-child(5) .forinputfile"),
					name: "subtask_file_" + subtask.key,
					idTempNum: subtask.idTemp,
					listeners: [
						[
							"change",
							(outlet, val) => {
								// console.log("val",val);
								var file = M_.Utils.getBaseNameFromPath(outlet.getValue(), "\\");
								$("#" + outlet.idTempNum + " .herefiledescription").html("Envoie du fichier " + file);
							}
						]
					]
				});
				$("#" + subtask.idTemp + " td:nth-child(5) .forinputfile").hide();
				$("#" + subtask.idTemp + " td:nth-child(5) .fa-file")
					.parent()
					.attr("for", this.formSubtasks.find("subtask_file_" + subtask.key).id);
			});
		}

		this.actions = new M_.TableList({
			// controller: this,
			container: $("#candidateswindetails_historylist"),
			// limitRows: 3,
			store: new M_.Store({
				controller: this,
				model: MT_Actions,
				url: "/1.0/actions",
				limit: 20000,
				args: () => {
					var args = { ca_id: this.currentData.ca_id };
					return args;
				},
				listeners: [
					[
						"update",
						(store, models) => {
							// $("#home_actions_title").html(M_.Utils.plural(store.countTotal(), "action")+" à traiter dans les prochains jours") ;
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
				["render", (store, models) => {}]
			],
			colsDef: [
				{
					label: "Action",
					// val: 'ac_type',
					// width: 130,
					val: function(model) {
						return _.result(_.find(Shared.getActionTypes(), { key: model.get("ac_type") }), "val");
					}
				},
				{
					label: "Utilisateur",
					// width: 150,
					val: function(model) {
						if (model.get("co_id_user")) return Services.completeName(model.get("co_id_user"));
						return "";
					}
				},
				{
					label: "Date",
					width: 150,
					val: function(model) {
						return moment(model.get("ac_date")).format("DD/MM/YYYY | HH:mm");
					}
				},
				{
					label: "Etat",
					width: 150,
					val: "ac_state"
				}
			]
		});

		$("#candidateswindetails_bt_cancel").click(() => {
			if (this.controller.onCancelCandidatesWinDetails) this.controller.onCancelCandidatesWinDetails();
			this.hide();
			this.formSubtasks.save();
			// M_.App.open('Candidates') ;
		});

		$("#candidateswindetails_bt_delete").click(() => {
			M_.Dialog.confirm(
				"Confirmation",
				"Souhaitez-vous effacer définitivement ce candidat ?<br/>La fiche contact sera également effacée.",
				() => {
					M_.Utils.deleteJson("/1.0/candidates/" + this.currentData.ca_id, {}, () => {
						if (this.controller.onCancelCandidatesWinDetails) this.controller.onCancelCandidatesWinDetails();
						this.hide();
					});
				}
			);
		});
		$("#candidateswindetails_bt_modify").click(() => {
			// M_.App.open('Candidates', 'edit', this.currentData.ca_id) ;
			CandidatesWinEdit.getInstance(this).loadCandidate(this.currentData.ca_id);
		});

		$("#candidateswindetails_bt_archive").click(() => {
			var ok = true;
			if (this.currentData.ca_archive) ok = false;
			var txt = "Souhaitez-vous mettre en archive ce candidat ?";
			if (this.currentData.ca_archive) txt = "Souhaitez-vous désarchiver ce candidat ?";
			M_.Dialog.confirm("Confirmation", txt, () => {
				M_.Utils.postJson("/1.0/candidates/" + this.currentData.ca_id, { ca_id: this.currentData.ca_id, ca_archive: ok }, () => {
					if (this.controller.onCancelCandidatesWinDetails) this.controller.onCancelCandidatesWinDetails();
					this.hide();
				});
			});
		});

		$("#candidateswindetails_btprint").click(() => {
			this._thenprint = true;
			this.formSubtasks.save();
		});
	}
	openWinNewUser() {
		if (!this.winNewUser) {
			this.winNewUser = new class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST.CandidatesWinNewUser,
						// tplData: {},
						modal: true,
						// controller: this,
						width: 400
					};
					opts = opts ? opts : {};
					var optsTemp = $.extend({}, defaults, opts);
					super(optsTemp);
					// log("this.jEl",this.jEl)
				}
				create() {
					super.create();
					$("#candidateswinnewuser_bt_save").click(() => {
						this.form.validAndSave();
						// this.hide() ;
					});
					$("#candidateswinnewuser_bt_cancel").click(() => {
						this.hide();
					});

					this.form = new M_.Form.Form({
						url: "/1.0/contacts",
						model: MT_Contacts,
						controller: this,
						args: { copycandidate: true },
						// processData: function(data) {
						// 	Services.processContactsData(data) ;
						// },
						listeners: [
							// ['valid', (form, ok, err)=> {
							// 	if (form.find('co_id').getValue()==='' &&
							// 		form.find('co_password').getValue()==='' &&
							// 		form.find('co_type').getValue()!='contact' &&
							// 		form.find('co_type').getValue()!='candidate') {
							// 		err.push({key:'co_password', label:"Le mot de passe est vide"}) ;
							// 		return false ;
							// 	}
							// 	return true ;
							// }],
							// ['load', (form, model)=> {
							// 	this.currentModel = model ;
							// }],
							[
								"save",
								(form, data) => {
									// console.log("data RETURN", data);
									this.controller.onSaveCandidatesWinNewContact(data);
									this.hide();
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
								name: "co_id",
								container: $("#candidateswinnewuser_co_type")
							},
							{
								type: M_.Form.Hidden,
								name: "ca_id",
								container: $("#candidateswinnewuser_co_type")
							},
							{
								type: M_.Form.Combobox,
								name: "co_type",
								editable: false,
								allowEmpty: false,
								placeholder: "",
								label: "Droit",
								labelPosition: "top",
								container: $("#candidateswinnewuser_co_type"),
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									rows: Shared.getRoles()
								}),
								listeners: [["itemclick", (store, models) => {}]]
							},
							// {
							// 	type: M_.Form.Combobox,
							// 	name: "ag_id_1",
							// 	label: "Agence",
							// 	labelPosition: "top",
							// 	placeholder: "",
							// 	container: $("#candidateswinnewuser_ag_id"),
							// 	allowEmpty: false,
							// 	modelKey: "ag_id",
							// 	modelValue: "ag_name",
							// 	store: new M_.Store({
							// 		controller: this,
							// 		model: MT_Agencies,
							// 		url: "/1.0/agencies",
							// 		limit: 200
							// 	})
							// },
							{
								type: M_.Form.Text,
								name: "co_login",
								placeholder: "6 caractère minimum",
								label: "Identifiant / Login",
								labelPosition: "top",
								minLength: 6,
								allowEmpty: false,
								help: "",
								container: $("#candidateswinnewuser_co_login")
							},
							{
								type: M_.Form.Password,
								name: "co_password",
								placeholder: "6 caractère minimum",
								label: "Mot de passe",
								labelPosition: "top",
								minLength: 6,
								allowEmpty: false,
								help: "Saisir un nombre, une manuscule, une minuscule, un caractère non alpha-numérique ($, &amp;, @, etc)",
								container: $("#candidateswinnewuser_co_password")
							}
						]
					});
				}
				initWin() {
					// console.log("this.controller.currentData.ca_id", this.controller.currentData.ca_id);
					this.form.find("ca_id").setValue(this.controller.currentData.ca_id);
				}
			}({
				controller: this
			});
		}
		this.winNewUser.initWin();
		this.winNewUser.show();
	}
	onSaveCandidatesWinNewContact(data) {
		this.opencoid = data.co_id;
		$("#candidateswindetails_btcreatecontact").hide();
		$("#candidateswindetails_btseecontact").show();
	}
	getSubtaskIco(ok) {
		if (!ok) return '<span class="red fa fa-warning"></span>';
		else return '<span class="green fa fa-thumbs-up"></span>';
	}

	onSaveCandidatesWinEdit() {
		this.loadCandidate(this.currentData.ca_id);
	}
	onCancelCandidatesWinEdit() {
		this.loadCandidate(this.currentData.ca_id);
	}
	onDeleteCandidatesWinEdit() {
		this.hide();
		M_.App.open("Candidates");
	}
	loadCandidate(ca_id) {
		M_.Utils.getJson("/1.0/candidates/" + ca_id, {}, data => {
			// console.log("data", data);
			this.currentData = data.data;
			Services.processCandidatesData(this.currentData);
			$("#candidateswindetails_details").empty();
			M_.App.renderMustacheTo($("#candidateswindetails_details"), JST.CandidatesDetails, { row_ca: this.currentData });
			$(".candidatesdetails-showcontact").click(event => {
				this.hide();
				// console.log("this.opencoid",this.opencoid);
				M_.App.open("Contacts", "show", this.opencoid);
			});
			$(".candidatesdetails-editcontact").click(event => {
				CandidatesWinEdit.getInstance(this).loadCandidate(this.currentData.ca_id);
			});
			this.mainTabs.show("candidateswindetails_details", next => {
				this.show();
				this.center();
				// console.log("showwww");
				next();
			});

			this.opencoid = this.currentData.co_id ? this.currentData.co_id.co_id : "";

			// console.log("this.currentData.ca_subtasks", this.currentData);
			this.formSubtasks.setValues(this.currentData.ca_subtasks);
			var subtasks = Shared.getCandidateSubTasks();
			_.each(subtasks, (subtask, ind) => {
				var outlet = this.formSubtasks.find("subtask_com_" + subtask.key);
				// if (!outlet) return ;
				var tr = outlet.jEl.closest("tr");
				tr.find(".herefiledescription").html("");
				let idTemp = M_.Utils.id();
				if (this.currentData.ca_subtasks["subtask_filename_" + subtask.key])
					tr
						.find(".herefiledescription")
						.html(
							"<a href='/1.0/candidates/downloadsubtasks/" +
								this.currentData.ca_id +
								"/" +
								subtask.key +
								"'>" +
								this.currentData.ca_subtasks["subtask_filename_" + subtask.key] +
								"</a> <a href='javascript:void(0);' id='" +
								idTemp +
								"'><span class='fa fa-trash'></span></a>"
						);
				$("#" + idTemp).click({ subtaskkey: subtask.key }, evt => {
					var subtaskkey = evt.data.subtaskkey;
					var outlet = this.formSubtasks.find("subtask_com_" + subtaskkey);
					var tr = outlet.jEl.closest("tr");
					tr.find(".herefiledescription").html("");
					this.formSubtasks.find("subtask_filename_" + subtaskkey).setValue("");
				});
			});

			if (this.currentData.hasContact) {
				$("#candidateswindetails_btcreatecontact").hide();
				$("#candidateswindetails_btseecontact").show();
			} else {
				$("#candidateswindetails_btcreatecontact").show();
				$("#candidateswindetails_btseecontact").hide();
			}

			if (this.currentData.ca_archive) $("#candidateswindetails_bt_archive").html("Désarchiver");
			else $("#candidateswindetails_bt_archive").html("Archiver");
		});
	}
}
