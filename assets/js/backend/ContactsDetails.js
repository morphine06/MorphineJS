"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
// import {SearchPanel} from 'js6/controllers/SearchPanel.js' ;
// import {ActionWinEdit} from 'js6/controllers/ActionWinEdit.js' ;
// import { OpportunitiesWinEdit } from "./OpportunitiesWinEdit.js";
import { ActionsWinEdit } from "./ActionsWinEdit.js";
import { DocumentsWinEdit } from "./DocumentsWinEdit.js";

export var ContactsDetails = new class {
	display(container, currentModelContact) {
		this.container = container;
		this.currentModelContact = currentModelContact;

		this.container.empty();
		var row_co = this.currentModelContact.getData();
		if (row_co.co_id === "") return;
		this.row_co = row_co;
		row_co.visits2 = [];
		row_co.presentations2 = [];
		_.each(row_co.visits, visit => {
			if (visit.ve_id) row_co.visits2.push(visit);
			else row_co.presentations2.push(visit);
		});

		var canModify = Shared.canEditContact(M_.App.Session, row_co);
		// console.log("row_co",row_co);

		M_.App.renderMustacheTo(this.container, JST["assets/templates/backend/ContactsDetails.html"], { row_co: row_co, canModify: canModify });
		Services.renderContactsInfo(this.container.find(".contactsdetail_infos"), {
			row_co: row_co,
			canModify: canModify,
			withName: false
		});
		//

		this.container.find(".contactsdetail_btmodify").click(() => {
			M_.App.open("Contacts", "edit", this.currentModelContact.get("co_id"));
		});
		this.container.find(".contactsdetail_btdrh").click(() => {
			M_.App.open("Candidates", "show", this.currentModelContact.get("ca_id"));
		});

		// if (row_co.history && row_co.history.length) {
		this.history = new M_.TableList({
			// controller: this,
			container: this.container.find("#contactsinfos_history"),
			// limitRows: 3,
			store: new M_.Store({
				controller: this,
				// model: MT_Actions,
				primaryKey: "td_id",
				// url: "/1.0/todo/find",
				limit: 20000,
				listeners: [
					[
						"update",
						(store, models) => {
							// console.log("models", models);
							// $("#home_actions_title").html(M_.Utils.plural(store.countTotal(), "action")+" à traiter dans les prochains jours") ;
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model) => {
						// Services.redirectForTodo(model) ;
					}
				],
				["render", (store, models) => {}]
			],
			colsDef: [
				{
					label: "Action",
					// val: 'ac_type',
					width: 120,
					val: model => {
						return model.ac_text;
					}
				},
				{
					label: "Description",
					// val: 'ac_type',
					// width: 90,
					val: model => {
						return model.ac_text2;
					}
				},
				{
					label: "Somme",
					// val: 'ac_type',
					width: 90,
					val: model => {
						if (model.ac_price * 1 === 0) return "-";
						return M_.Utils.price(model.ac_price, 0);
					}
				},
				{
					label: "Utilisateur",
					width: 150,
					val: model => {
						if (model.co_id_user) return Shared.completeName(model.co_id_user);
						return "";
					}
				},
				{
					label: "Date",
					width: 90,
					sort: model => {
						return moment(model.ac_date).format("YYYY-MM-DD HH:mm:ss");
					},
					val: function(model) {
						return moment(model.ac_date).format("DD/MM/YYYY");
					}
				}
				// {
				// 	label: "&nbsp;",
				// 	width: 120,
				// 	val: model => {
				// 		// var f = _.find(Shared.getTodoTypes(), { key: model.td_type });
				// 		// var txt = '<div class="vacations_status ' + _.result(f, "color") + '">' + _.result(f, "short") + "</div>";
				// 		// return txt;
				// 		return "";
				// 	}
				// }
			]
		});
		// console.log("row_co.history", row_co.history);
		this.history.getStore().setRows(row_co.history);
		// }

		this.documents = new M_.TableList({
			// controller: this,
			container: this.container.find("#contactsinfos_documents"),
			// limitRows: 3,
			store: new M_.Store({
				controller: this,
				// model: MT_Actions,
				primaryKey: "do_id",
				// url: "/1.0/todo/find",
				limit: 20000,
				listeners: [
					[
						"update",
						(store, models) => {
							// console.log("models", models);
							// $("#home_actions_title").html(M_.Utils.plural(store.countTotal(), "action")+" à traiter dans les prochains jours") ;
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("m_id,model", col);
						// Services.redirectForTodo(model) ;
						if (col == 2) return;
						window.open("/1.0/documents/" + m_id + "/image", "_blank");
					}
				],
				[
					"render",
					(table, models) => {
						table.container.find(".fa-trash").click(evt => {
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce document ?", () => {
								// console.log('',);
								let m_id = $(evt.target).attr("data-doid");
								M_.Utils.deleteJson("/1.0/documents/" + m_id, {}, () => {
									M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
								});
							});
						});
					}
				]
			],
			colsDef: [
				{
					label: "Date",
					width: 120,
					sort: model => {
						return moment(model.createdAt).format("YYYY-MM-DD HH:mm:ss");
					},
					val: function(model) {
						return moment(model.createdAt).format("DD/MM/YYYY");
					}
				},
				{
					label: "Nom",
					// val: 'ac_type',
					// width: 90,
					val: model => {
						return model.do_name;
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					align: "right",
					val: (model, style) => {
						var html = "";
						html += '<i data-doid="' + model.do_id + '" class="fa fa-trash faicon"></i>';
						return html;
					}
				}
			]
		});
		this.documents.getStore().setRows(row_co.documents);

		if (row_co.todos && row_co.todos.length && Shared.canViewTodosOnContact(row_co, M_.App.Session)) {
			this.todos = new M_.TableList({
				// controller: this,
				container: this.container.find(".contactsdetail_todos"),
				// limitRows: 3,
				store: new M_.Store({
					controller: this,
					// model: MT_Actions,
					primaryKey: "td_id",
					url: "/1.0/todo/find",
					limit: 20000,
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
						(outlet, m_id, model, evt, col, row) => {
							// Services.redirectForTodo(model) ;
						}
					],
					["render", (store, models) => {}]
				],
				colsDef: [
					{
						label: "Action",
						// val: 'ac_type',
						// width: 130,
						val: model => {
							return _.result(_.find(Shared.getTodoTypes(), { key: model.td_type }), "val");
						}
					},
					{
						label: "Utilisateur",
						width: 150,
						val: model => {
							if (model.co_id_user) return Shared.completeName(model.co_id_user);
							return "";
						}
					},
					{
						label: "Date",
						width: 150,
						sort: model => {
							return moment(model.td_date).format("YYYY-MM-DD");
						},
						val: function(model) {
							if (model.td_type == 5) return moment(model.td_date).format("DD MMMM");
							return moment(model.td_date).format("DD/MM/YYYY | HH:mm");
						}
					},
					{
						label: "&nbsp;",
						width: 120,
						val: model => {
							var f = _.find(Shared.getTodoTypes(), { key: model.td_type });
							var txt = '<div class="vacations_status ' + _.result(f, "color") + '">' + _.result(f, "short") + "</div>";
							return txt;
						}
					}
				]
			});
			this.todos.getStore().setRows(row_co.todos);
		}

		$("#contactsinfos_btnewaction").click(evt => {
			ActionsWinEdit.getInstance(this).loadAction("-1", null, this.currentModelContact.get("co_id"));
		});

		$("#contactsinfos_btnewdocument").click(evt => {
			// console.log('this.currentModelContact.get("co_id")', this.currentModelContact.get("co_id"));
			DocumentsWinEdit.getInstance(this).newDocument("-1", null, this.currentModelContact.get("co_id"));
		});

		// this.slider = this.container.find(".contactsdetail_co_status").get(0) ;
		// noUiSlider.create(this.slider, {
		// 	start: [50],
		// 	connect: 'lower',
		// 	snap: true,
		// 	range: {
		// 		'min': 0,
		// 		'25': 25,
		// 		'50': 50,
		// 		'75': 75,
		// 		'max': 100
		// 	}
		// }) ;
		// this.slider.noUiSlider.on('change', (arg1, arg2, arg3)=> {
		// 	this.setSlider(arg3, false, true) ;
		// });

		// this.setSlider(row_co.co_status, true) ;
	}
	onSaveActionsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	onDeleteActionsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	onCancelActionsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	onSaveDocumentsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	onDeleteDocumentsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	onCancelDocumentsWinEdit() {
		M_.App.open("Contacts", "show", this.currentModelContact.get("co_id"));
	}
	setSlider(val, setBar = false, save = false) {
		if (!val) val = 0;
		var t = Services.getTypesContactEsitimate();
		this.container.find(".contactsdetail_co_status2").html(_.result(_.find(t, { key: val }), "val"));
		if (setBar) this.slider.noUiSlider.set(val);
		if (save) {
			M_.Utils.postJson(
				"/1.0/contacts/savestatus",
				{
					co_id: this.row_co.co_id,
					co_status: val
				},
				() => {}
			);
		}

		this.container
			.find(".contactsdetail_co_status")
			.removeClass("bg_colBlue1")
			.removeClass("bg_colGreen1")
			.removeClass("bg_colOrange1")
			.removeClass("bg_colRed1");
		if (val == 25) this.container.find(".contactsdetail_co_status").addClass("bg_colRed1");
		if (val == 50) this.container.find(".contactsdetail_co_status").addClass("bg_colOrange1");
		if (val == 75) this.container.find(".contactsdetail_co_status").addClass("bg_colBlue1");
		if (val == 100) this.container.find(".contactsdetail_co_status").addClass("bg_colGreen1");
	}
}();
