"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { MT_Events } from "./../../compiled/models/MT_Events.js";

export class CalendarWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/CalendarWinEdit.html"],
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
	static getInstance(controller, fullcalendar) {
		if (!this._instance) this._instance = new CalendarWinEdit({ controller: controller });
		this._instance.controller = controller;
		this._instance.fullcalendar = fullcalendar;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			url: "/1.0/events",
			model: MT_Events,
			controller: this,
			processData: function(data) {},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						// if (form.find('ev_id').getValue()==='' &&
						// 	form.find('ev_password').getValue()==='' &&
						// 	form.find('ev_type').getValue()!='contact' &&
						// 	form.find('ev_type').getValue()!='customer' &&
						// 	form.find('ev_type').getValue()!='candidate') {
						// 	err.push({key:'ev_password', label:"Le mot de passe est vide"}) ;
						// 	return false ;
						// }
						// if (form.find('ev_name').getValue()==='' && form.find('ev_society').getValue()==='') {
						// 	err.push({key:'ev_name', label:"Vous devez indiquer un nom ou une société."}) ;
						// 	return false ;
						// }
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						if (this.currentModel.get("ev_id")) {
							this.jEl.find(".M_ModalDelete").prop("disabled", false);
						} else {
							this.jEl.find(".M_ModalDelete").prop("disabled", true);
						}
						this.show(true);
						this.center();
						if (this.controller.onLoadCalendarWinEdit) this.controller.onLoadCalendarWinEdit();
					}
				],
				[
					"save",
					(form, data) => {
						this.hide();
						if (this.controller.onSaveCalendarWinEdit) this.controller.onSaveCalendarWinEdit();
					}
				],
				[
					"delete",
					(form, model) => {
						this.hide();
						if (this.controller.onDeleteCalendarWinEdit) this.controller.onDeleteCalendarWinEdit();
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
					name: "ev_id",
					container: $("#calendarwinedit_ev_start")
				},
				{
					type: M_.Form.Hidden,
					name: "ev_allday",
					container: $("#calendarwinedit_ev_start")
				},
				{
					type: M_.Form.DateHour,
					name: "ev_start",
					container: $("#calendarwinedit_ev_start")
				},
				{
					type: M_.Form.DateHour,
					name: "ev_stop",
					container: $("#calendarwinedit_ev_stop")
				},
				{
					type: M_.Form.Textarea,
					name: "ev_description",
					label: "Description",
					labelPosition: "top",
					container: $("#calendarwinedit_ev_description"),
					allowEmpty: true,
					height: 50
				}
			]
		});

		this.jEl.find(".M_ModalSave").click(() => {
			this.form.validAndSave();
		});
		this.jEl.find(".M_ModalDelete").click(() => {
			M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir effacer cet événement ?", () => {
				this.form.delete(this.currentModel.get("ev_id"));
			});
		});
		this.jEl.find(".M_ModalCancel").click(() => {
			if (this.controller.onCancelCalendarWinEdit) this.controller.onCancelCalendarWinEdit();
			this.hide();
		});
	}

	newEvent(start, stop, allday) {
		this.form.reset();
		this.form.find("ev_start").setValue(start);
		this.form.find("ev_stop").setValue(stop);
		this.form.find("ev_allday").setValue(allday);
		this.jEl.find(".M_ModalDelete").prop("disabled", true);

		this.show(true);
		this.center();
		// if (callback) callback(this.currentModel);
		// this.form.load(do_id, null, () => {
		// 		// this._beforeShowWin() ;
		// 	});
	}

	loadEvent(ev_id) {
		this.form.load(ev_id);
	}
	saveEvent(calEvent) {
		var end = null,
			start = calEvent.start;
		if (!calEvent.end) {
			end = moment(calEvent.start).add(2, "hours");
		} else {
			end = calEvent.end;
		}
		var allday = !calEvent.start.hasTime() ? 1 : 0;
		if (allday === 1 && end.diff(start, "hours") < 23) end = moment(calEvent.start).add(1, "d");
		var okArgs = {
			ev_id: calEvent.ev_id,
			ev_start: start.toISOString(),
			ev_stop: end.toISOString(),
			ev_allday: allday
		};
		// this.form.save(okArgs);
		M_.Utils.putJson("/1.0/events/" + calEvent.ev_id, okArgs, data => {
			if (this.controller.onSaveCalendarWinEdit) this.controller.onSaveCalendarWinEdit();
		});
	}
}
