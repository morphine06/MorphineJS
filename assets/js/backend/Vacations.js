"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { MT_Vacations } from "../../compiled/models/MT_Vacations.js";
import { VacationsWinEdit } from "./VacationsWinEdit.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";

export class Vacations extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Vacations.html"];
		super(opts);
	}
	create() {
		// this.mainTabs = new M_.Tabs({
		// 	container: $("#vacations_tabs"),
		// 	firstTab: 'vacations_default'
		// }) ;

		var modelDef = {
			key: "va_id",
			start: "va_start",
			end: "va_end",
			start2: "va_start2",
			end2: "va_end2",
			cls: model => {
				var cls = "";
				// console.log("model.get('co_id').co_type", model);
				if (model.get("va_status") == "vacation_waiting") cls += " vacations_wait";
				if (model.get("va_status") == "vacation_refused") cls += " m_gantt_hachure2";
				if (model.get("co_id_user")) cls += " " + Services.getColorForCoType(model.get("co_id_user").co_type);
				return cls;
			},
			text: model => {
				return Shared.completeName(model.get("co_id_user"));
			}
		};
		var listenersCals = [
			[
				"selected",
				(cal, date) => {
					M_.App.open("Vacations", "edit", "-1", date.format("YYYY-MM-DD"));
				}
			],
			[
				"clickitem",
				(outlet, model) => {
					M_.App.open("Vacations", "edit", model.get("va_id"));
				}
			],
			[
				"enteritem",
				(outlet, model, bar) => {
					// console.log("enteritem, model.get('va_id')", model);
					var txt = "";
					txt += Services.getUserIconInTable(model.get("co_id_user")) + "";
					txt += Shared.completeName(model.get("co_id_user")) + "<br>";
					// txt += "Agence " + model.get("ag_id").ag_name + "<br>";
					txt += _.result(_.find(Shared.getVaStatus(), { key: model.get("va_status") }), "val") + "<br>";
					txt += Shared.getNbOpenDays(model.get("va_start"), model.get("va_end"), model.get("va_start2"), model.get("va_end2")) + " jours";
					if (!bar.data("helpcreated")) {
						new M_.Help({
							text: txt,
							attachedObj: bar,
							showNow: true
						});
					}
					bar.data("helpcreated", true);
				}
			]
		];

		this.currentMonth = moment().startOf("month");
		this.cal1 = new M_.Calendar.MonthView({
			container: $("#vacations_cal1"),
			store: new M_.Store({
				controller: this,
				model: MT_Vacations,
				url: "/1.0/vacations",
				limit: 200,
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							// args.args.ag_id = M_.App.Session.ag_id.ag_id ;
							// args.args.agencies = this.getSelectedAgencies();
							// console.log("args.args.agencies", args.args.agencies);
						}
					]
				]
			}),
			modelDef: modelDef,
			dateViewed: this.currentMonth,
			displayHeader: false,
			listeners: listenersCals
		});
		this.cal2 = new M_.Calendar.MonthView({
			container: $("#vacations_cal2"),
			store: new M_.Store({
				controller: this,
				model: MT_Vacations,
				url: "/1.0/vacations",
				limit: 200,
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							// args.args.ag_id = M_.App.Session.ag_id.ag_id ;
							// args.args.agencies = this.getSelectedAgencies();
						}
					]
				]
			}),
			modelDef: modelDef,
			displayHeader: false,
			dateViewed: moment(this.currentMonth).add(1, "months"),
			listeners: listenersCals
		});

		this.setMonthsTitle();

		$("#vacations_previousmonth").click(() => {
			this.currentMonth.add(-1, "months");
			this.cal1.selectMonth(this.currentMonth);
			this.cal2.selectMonth(moment(this.currentMonth).add(1, "months"));
			this.setMonthsTitle();
		});
		$("#vacations_nextmonth").click(() => {
			this.currentMonth.add(1, "months");
			this.cal1.selectMonth(this.currentMonth);
			this.cal2.selectMonth(moment(this.currentMonth).add(1, "months"));
			this.setMonthsTitle();
		});
		$("#vacations_new").click(() => {
			M_.App.open("Vacations", "edit", "-1");
		});

		this.vacations = new M_.TableList({
			controller: this,
			container: $("#vacations_list"),
			store: new M_.Store({
				controller: this,
				model: MT_Vacations,
				url: "/1.0/vacations",
				limit: 200,
				// sortOnRemote: true,
				currentSort: ["va_start", "DESC"],
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							// args.args.ag_id = M_.App.Session.ag_id.ag_id ;
							// args.args.agencies = this.getSelectedAgencies();
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model) => {
						M_.App.open("Vacations", "edit", m_id);
					}
				],
				["render", (store, models) => {}]
			],
			colsDef: [
				{
					label: "",
					width: 50,
					val: model => {
						return Services.getUserIconInTable(model.get("co_id_user"));
					}
				},
				{
					label: "Utilisateur",
					// width: 150,
					val: model => {
						if (model.get("co_id_user")) return Shared.completeName(model.get("co_id_user"));
						return "";
					}
				},
				// {
				// 	label: "Agence",
				// 	width: 150,
				// 	// sort: (model)=> {},
				// 	val: model => {
				// 		return model.get("ag_id").ag_name;
				// 	}
				// },
				{
					label: "Du",
					width: 200,
					sort: model => {
						return moment(model.get("va_start")).format("YYYY-MM-DD");
					},
					val: model => {
						var txt = moment(model.get("va_start")).format("DD/MM/YYYY");
						if (model.get("va_start2")) txt += " (matin travaillé)";
						return txt;
					}
				},
				{
					label: "Au",
					width: 220,
					sort: model => {
						return moment(model.get("va_end")).format("YYYY-MM-DD");
					},
					val: model => {
						var txt = moment(model.get("va_end")).format("DD/MM/YYYY");
						if (model.get("va_end2")) txt += " (après-midi travaillé)";
						return txt;
					}
				},
				{
					label: "Nb jours",
					width: 150,
					val: model => {
						return Shared.getNbOpenDays(model.get("va_start"), model.get("va_end"), model.get("va_start2"), model.get("va_end2"));
					}
				},
				{
					label: "Etat",
					width: 150,
					val: model => {
						// console.log("Shared.", _.find(Shared.getVaStatus(), {key: model.get('va_status')}), model.get('va_status'));
						var f = _.find(Shared.getVaStatus(), { key: model.get("va_status") });
						var txt = '<div class="vacations_status ' + _.result(f, "color") + '">' + _.result(f, "short") + "</div>";
						if (Shared.canModifyVacation(model.getData(), M_.App.Session)) txt += '<i class="fa fa-pencil faicon"></i>';
						return txt;
					}
				}
			]
		});

		// this.jEl
		// 	.find(".agency_selector")
		// 	.first()
		// 	.addClass("checked");
		// this.jEl.find(".agency_selector").click(evt => {
		// 	var jEl = $(evt.target);
		// 	jEl.toggleClass("checked");
		// 	this.loadAgencyVacation();
		// });
	}

	// getSelectedAgencies() {
	// 	var agencies = [];
	// 	this.jEl.find(".agency_selector.checked").each((ind, el) => {
	// 		agencies.push($(el).attr("data-ag-id"));
	// 	});
	// 	if (agencies.length === 0) agencies.push("-1");
	// 	return agencies;
	// }

	setMonthsTitle() {
		$("#vacations_cal1title").html(this.currentMonth.format("MMMM YYYY"));
		$("#vacations_cal2title").html(
			moment(this.currentMonth)
				.add(1, "months")
				.format("MMMM YYYY")
		);
	}

	loadAgencyVacation() {
		Services.getPhraseVacationAcquis(M_.App.Session.co_id, $("#vacations_gain"));
		this.vacations.getStore().reload();
		this.cal1.getStore().reload();
		this.cal2.getStore().reload();
	}

	onSaveVacationsWinEdit() {
		M_.App.open("Vacations");
	}
	onDeleteVacationsWinEdit() {
		M_.App.open("Vacations");
	}
	onCancelVacationsWinEdit() {
		// console.log("onCancelVacationsWinEdit");
		M_.App.open("Vacations");
	}
	editAction(va_id, va_start) {
		VacationsWinEdit.getInstance(this).loadVacation(va_id, va_start);
		if (!this.vacations.getStore().isLoaded()) this.loadAgencyVacation();
	}

	indexAction() {
		this.loadAgencyVacation();
	}
}
