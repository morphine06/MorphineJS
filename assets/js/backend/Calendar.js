"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Shared } from "./../../compiled/Shared.js";
// import { MT_Events } from "./../../compiled/models/MT_Events.js";
import { CalendarWinEdit } from "./CalendarWinEdit.js";

export class Calendar extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Calendar.html"];
		super(opts);
	}
	init() {}
	create() {
		$("#calendar_btprevious").click(() => {
			$("#calendar_fullcalendar").fullCalendar("prev");
		});
		$("#calendar_btnext").click(() => {
			$("#calendar_fullcalendar").fullCalendar("next");
		});
		$("#calendar_bthome").click(() => {
			$("#calendar_fullcalendar").fullCalendar("today");
		});
		$("#calendar_btmonth").click(() => {
			$("#calendar_fullcalendar").fullCalendar("changeView", "month");
		});
		$("#calendar_btweek").click(() => {
			$("#calendar_fullcalendar").fullCalendar("changeView", "agendaWeek");
		});
		$("#calendar_btday").click(() => {
			$("#calendar_fullcalendar").fullCalendar("changeView", "agendaDay");
		});
		$("#calendar_fullcalendar").fullCalendar({
			header: false,
			defaultView: "agendaWeek",
			firstDay: 1,
			weekends: true,
			weekNumbers: true,
			height: "parent",
			slotDuration: "00:30:00",
			snapDuration: "00:15:00",
			scrollTime: "08:00:00",
			// lang: 'fr',
			selectable: true,
			editable: true,
			fixedWeekCount: false,
			eventStartEditable: true,
			// timeFormat: {
			// 	agenda: "HH:mm",
			// 	default: "HH:mm"
			// },
			// columnFormat: {
			// 	month: "ddd",
			// 	week: "ddd DD/MM",
			// 	day: "dddd"
			// },
			// titleFormat: {
			// 	month: "MMMM YYYY",
			// 	week: "D MMMM YYYY",
			// 	day: "D MMMM YYYY"
			// },
			// buttonText: {
			// 	today: "Aujourd'hui",
			// 	month: "mois",
			// 	week: "semaine",
			// 	day: "jour"
			// },
			// longDateFormat:{LT:"HH:mm",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},
			// allDayText: "Journée",
			// axisFormat: "HH",
			// isRTL:!1,
			// showMonthAfterYear:!1,
			// monthNames: M_.i18n.months,
			// monthNamesShort: M_.i18n.monthsShort,
			// dayNames: M_.i18n.days,
			// dayNamesShort: M_.i18n.daysShort,
			// weekNumberTitle: "S",
			displayEventEnd: {
				month: true,
				basicWeek: true,
				default: true
			},
			eventAfterAllRender: () => {
				// var vObj = $("#calendar_fullcalendar").fullCalendar("getView");
				// var start2 = moment(vObj.intervalStart).startOf("day");
				// var end2 = moment(vObj.intervalEnd)
				// 	.startOf("day")
				// 	.subtract(1, "days");
				// // console.log("vObj.name",vObj.name);
				// if (vObj.name == "month") {
				// 	$("#calendar_title").html(M_.Utils.ucfirst(start2.format("MMMM YYYY")));
				// } else if (vObj.name == "agendaWeek") {
				// 	$("#calendar_title").html(start2.format("DD/MM/YYYY") + " au " + end2.format("DD/MM/YYYY"));
				// } else {
				// 	$("#calendar_title").html(start2.format("DD/MM/YYYY"));
				// }
			},

			events: (start, end, timezone, callback) => {
				// console.log("start, end", start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
				M_.Utils.getJson(
					"/1.0/events",
					{
						datestart: start.format("YYYY-MM-DD"),
						datestop: end.format("YYYY-MM-DD"),
						co_id_user: M_.App.Session.co_id //this.comboWho.getValue()
					},
					data => {
						// var tab = data.data;
						// console.log("tab", tab);
						// var events = [];
						_.each(data.data, d => {
							d.title = d.ev_description;
							d.start = d.ev_start;
							d.end = d.ev_stop;
							d.allDay = d.ev_allday;
							d.className = "calendar_perso";
							// events.push(tab[i]);
						});
						// $("#calendar_fullcalendar").fullCalendar("option", "height", $("#calendar_fullcalendar").height());
						// console.log("events", events);
						callback(data.data);
					}
				);
			},
			select: (start, end, jsEvent, view) => {
				var allday = !start.hasTime() && !end.hasTime();
				CalendarWinEdit.getInstance(this, $("#calendar_fullcalendar")).newEvent(start, end, allday);
			},
			eventClick: (calEvent, jsEvent, view) => {
				// console.log("calEvent", calEvent, jsEvent, view);
				// $(this).css('border-color', 'red');
				// if (!calEvent.start || !calEvent.end) console.warn("warning start or end not set !!!", calEvent);

				// calEvent.datestart = calEvent.start.format("YYYY-MM-DD HH:mm:ss");
				// calEvent.datestop = calEvent.end.format("YYYY-MM-DD HH:mm:ss");
				CalendarWinEdit.getInstance(this, $("#calendar_fullcalendar")).loadEvent(calEvent.ev_id);
			},
			eventDrop: (calEvent, delta, revertFunc) => {
				// log("calEvent",calEvent, delta)
				// if (!confirm("Are you sure about this change?")) revertFunc();
				CalendarWinEdit.getInstance(this, $("#calendar_fullcalendar")).saveEvent(calEvent);
			},
			eventResize: (calEvent, delta, revertFunc) => {
				// log("calEvent",calEvent, delta)
				CalendarWinEdit.getInstance(this, $("#calendar_fullcalendar")).saveEvent(calEvent);
			}
		});
	}

	onSaveCalendarWinEdit(data) {
		$("#calendar_fullcalendar").fullCalendar("refetchEvents");
	}
	onDeleteCalendarWinEdit() {
		$("#calendar_fullcalendar").fullCalendar("refetchEvents");
	}
	onCancelCalendarWinEdit() {}

	listAction(action, ca_id) {}
	editAction(ca_type, ca_id) {
		// this.campaigns.store.load();
		// if (ca_type == "mailinglist") {
		// 	this.openWinMailinglist(ca_id);
		// }
	}
	indexAction() {
		// this.campaigns.store.load();
	}
}
