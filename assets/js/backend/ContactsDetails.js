"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
// import {SearchPanel} from 'js6/controllers/SearchPanel.js' ;
// import {ActionWinEdit} from 'js6/controllers/ActionWinEdit.js' ;

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

		this.container.find(".contactsdetail_btmodify").click(() => {
			M_.App.open("Contacts", "edit", this.currentModelContact.get("co_id"));
		});
		this.container.find(".contactsdetail_btdrh").click(() => {
			M_.App.open("Candidates", "show", this.currentModelContact.get("ca_id"));
		});

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
							var txt = '<div class="vacation_status ' + _.result(f, "color") + '">' + _.result(f, "short") + "</div>";
							return txt;
						}
					}
				]
			});
			this.todos.getStore().setRows(row_co.todos);
		}

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
