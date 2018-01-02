"use strict";

import { M_ } from "./../../../libs-client/M_.js";

import { Home } from "./Home.js";
import { Contacts } from "./Contacts.js";
import { Preferences } from "./Preferences.js";

import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";

M_.registerModule("Home", Home);
M_.registerModule("Contacts", Contacts);
M_.registerModule("Preferences", Preferences);

// for access of M_ and Services in templates, we set this objects in lowdash !!!
window.M_ = M_;
window.M_.Services = Services;
window.M_.Shared = Shared;
// window.i18n = {
// 	trans: (txt)=> {
// 		return 'trans'+txt ;
// 	}
// } ;
// _.M_ = M_ ;
// _.Services = M_.App.Services = Services ;
// _.Shared = Shared ;

moment.locale("fr");

var modules = [
	{ key: "Home", icon: "fa-bell faa-ring", label: "Accueil", right: "" },
	{ key: "Contacts", icon: "fa-user", label: "Contacts", right: "contacts" },
	{ key: "Preferences", icon: "fa-gears", label: "Préférences", right: "" },
	{ key: "Search", icon: "fa-gears", label: "Rechercher", right: "", hideInMenu: true }
];

M_.App.create({
	name: "PuP",
	container: $("#main"),
	defaultController: "Home",
	inDevelopment: true,
	useWebsocket: false,
	isOnline: false,
	moduleChange: (module, oldModule) => {
		if (module != "Search") $("#mainsearchinput").val("");
		$("#mainnavcontent li").removeClass("over");
		$("#mainnavcontent .menumodule_" + module).addClass("over");
	},
	beforeModuleChange: (module, oldModule) => {
		var m = _.find(modules, { key: module });
		// console.log("module, oldModule", module, oldModule, m);
		if (m.right === "" || Services.getUserRight(m.right)) return true;
		return false;
	}
})
	.beforeReady(next => {
		// console.log("Services",Services);
		let drawMenus = () => {
			var html = "";
			_.each(modules, module => {
				if (module.hideInMenu) return;
				if (module.right === "" || Services.getUserRight(module.right)) {
					html +=
						'<a href="#/' +
						module.key +
						'"><li class="menumodule_' +
						module.key +
						'"><span class=""></span><p>' +
						module.label +
						'</p><div class="M_Clear"></div></li></a>';
				}
			});
			$("#mainnavcontent").html(html);
		};
		let loadSessionInfos = () => {
			M_.Utils.getJson("/1.0/infos", {}, data => {
				M_.App.Session = data.user;
				$("#mainavatar").css(
					"background-image",
					"url(/1.0/contacts/avatar/100/100/" + M_.App.Session.co_id + "?d=" + new Date().getTime() + ")"
				);
				$("#loginInfosBt_name").html(M_.App.Session.co_firstname + " " + M_.App.Session.co_name);
				$("#loginInfosBt_role").html(M_.Services.displayRight(M_.App.Session));
				drawMenus();
				next();
			});
		};
		loadSessionInfos();
	})
	.ready(() => {
		// Services.updateDates() ;

		// $("#loginInfosBt_role").html(_.result(_.find(Shared.getRoles(), {key:M_.App.Session.co_type}), 'val') + " " + M_.App.Session.ag_id.ag_name) ;

		$("#loginInfosBt").click(evt => {
			evt.stopPropagation();
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#loginInfosBt"),
				items: [
					{
						text: "Modifier mon compte",
						click: () => {
							M_.App.open("Contacts", "show", M_.App.Session.co_id);
						}
					},
					{
						text: "Préférences",
						click: () => {
							M_.App.open("Preferences", "index");
						}
					},
					{
						text: "Se déconnecter",
						click: () => {
							window.open("/logout", "_self");
						}
					}
				]
			});
			dd.show();
		});

		$(".mainlogo").click(() => {
			M_.App.open("Home");
		});

		// $('#mainsearchinput').keyup((evt)=> {
		// 	M_.Utils.delay(()=> {
		// 		M_.App.open('Search', 'draw') ;
		// 	}, 200, "delayMainSearch");
		//
		// }) ;
		new M_.Help({
			text: "Rechercher dans les contacts, les absences, les candidats",
			attachedObj: $("#mainsearchinput")
		});

		// this.appIsFullScreen = false ;
		$("#loginFullScreen").click(() => {
			M_.Utils.toggleAppFullScreen();
		});
		new M_.Help({
			text: "Afficher l'application en plein écran",
			attachedObj: $("#loginFullScreen")
		});

		let hideMenu = function() {
			if ($("#mainnav").is(":visible")) {
				var l = -1 * $("#mainnav").width();
				$("#mainnav").transition(
					{
						left: l
					},
					500,
					() => {
						$("#mainnav").hide();
					}
				);
				$("#mainbtmenus span").addClass("fa-reorder");
				$("#mainbtmenus span").removeClass("fa-close");
			}
		};
		let showMenu = function() {
			if (!$("#mainnav").is(":visible")) {
				$("#mainnav")
					.css("left", -1 * $("#mainnav").width())
					.show()
					.transition(
						{
							left: 0
						},
						500,
						() => {}
					);
				$("#mainbtmenus span").removeClass("fa-reorder");
				$("#mainbtmenus span").addClass("fa-close");
			}
		};
		$("#mainbtmenus").mouseenter(showMenu);
		$(document)
			.on("click", "#mainbtmenus", evt => {
				evt.stopPropagation();
				if (!$("#mainnav").is(":visible")) showMenu();
				else hideMenu();
			})
			.on("click", hideMenu);

		if (!window.location.hash && M_.Utils.getCookie("mwjurl")) window.open("#/" + M_.Utils.getCookie("mwjurl"), "_self");
	});
