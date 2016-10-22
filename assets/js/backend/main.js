'use strict';

import {M_} from './../../../libs/M_.js' ;
import {Home} from './Home.js' ;

M_.registerModule('Home',Home) ;

// import {Services} from 'js6/libs/Services.js' ;
// import {Shared} from 'js6/libs/Shared.js' ;

// var M_ = System.get('M_/M_') ;
// var Contacts = System.get('controllers/Contacts').Contacts ;
// var dav = new M_.David() ;
// dav.print() ;
// // Contacts.init() ;
// Contacts.init() ;
// console.log("Contacts",Contacts)

// log("App",M_.App)

_.M_ = M_ ;
// _.Services = M_.App.Services = Services ;
// _.Shared = Shared ;
// _.Utils = M_.Utils ;


moment.locale('fr') ;

var modules = [
	{key:'Home', icon:'fa-bell faa-ring', label:"Accueil", right:''},
	{key:'Contacts', icon:'fa-user', label:"Contacts", right:'contacts'},
	{key:'Expenses', icon:'fa-user-plus', label:"Notes de frais", right:'expenses'},
	{key:'Vacation', icon:'fa-plane', label:"Absences", right:'vacation'},
	{key:'VacationAdmin', icon:'fa-plane', label:"Absences admin", right:'vacation_admin'},
	{key:'Reports', icon:'fa-globe', label:"Rapport hebdo", right:'reports'},
	{key:'ReportsAdmin', icon:'fa-globe', label:"Rapport hebdo admin", right:'reports_admin'},
	{key:'MonthlyReports', icon:'fa-globe', label:"Rapport mensuel", right:'monthlyreports'},
	{key:'MonthlyReportsAdmin', icon:'fa-globe', label:"Rapport mensuel admin", right:'monthlyreports_admin'},
	{key:'Candidates', icon:'fa-user-plus', label:"Module DRH", right:'humanresources'},
	{key:'Commercials', icon:'fa-user-plus', label:"Paliers ch. d'aff", right:'commercials'},
	{key:'Preferences', icon:'fa-gears', label:"Préférences", right:''},
	{key:'Search', icon:'fa-gears', label:"Rechercher", right:'', hideInMenu: true},
] ;

M_.App
.create({
	name: 'PuP',
	container: $('#main'),
	defaultController: 'Home',
	inDevelopment: true,
	useWebsocket: false,
	isOnline: false,
	moduleChange: (module, oldModule)=> {
		if (module!='Search') $('#mainsearchinput').val('');
		$("#mainnavcontent li").removeClass('over') ;
		$("#mainnavcontent .menumodule_"+module).addClass('over') ;
	},
	beforeModuleChange: (module, oldModule)=> {
		var m = _.find(modules, {key:module}) ;
		// console.log("module, oldModule", module, oldModule, m);
		// if (m.right==='' || Services.getUserRight(m.right)) return true ;
		return true ;
	}
})
.beforeReady(function(next) {

	this.drawMenus = function() {

		var html = "" ;
		_.each(modules, (module)=> {
			if (module.hideInMenu) return ;
			// if (module.right==='' || Services.getUserRight(module.right)) {
				html += '<a href="#/'+module.key+'"><li class="menumodule_'+module.key+'"><span class=""></span><p>'+module.label+'</p><div class="M_Clear"></div></li></a>' ;
			// }
		}) ;
		$("#mainnavcontent").html(html) ;
	};
	this.loadSessionInfos = function() {
		$.ajax({
			url: "/ws/infos",
			type: 'GET',
			contentType: 'application/json',
			data: JSON.stringify({}),
			dataType: 'json',
			success: (data)=> {
				_.Session = M_.App.Session = data.data ;
				// log("M_.App.Session",M_.App.Session);
				// console.log("title", Services.getUserRight('contacts'));
				this.drawMenus() ;

				if (next) next() ;
			}
		});
	} ;
	this.loadSessionInfos() ;

})
.ready(function() {


	// Services.updateDates() ;

	// $("#loginInfosBt_role").html(_.result(_.find(Shared.getRoles(), {key:M_.App.Session.co_type}), 'val') + " " + M_.App.Session.ag_id.ag_name) ;

	$('#loginInfosBt').click((evt)=> {
		evt.stopPropagation() ;
		var dd = new M_.Dropdown({
			autoShow: true,
			alignTo: $('#loginInfosBt'),
			items: [
				{
					text: "Modifier mon compte",
					click: ()=> {
						M_.App.open('Contacts', 'show', M_.App.Session.co_id) ;
					}
				}, {
					text: "Préférences",
					click: ()=> {
						M_.App.open('Preferences', 'index') ;
					}
				}, {
					text: "Se déconnecter",
					click: ()=> {
						window.open('/logout', '_self') ;
					}

				}
			]
		}) ;
		dd.show() ;
	}) ;


	$(".mainlogo").click(()=> {
		M_.App.open('Home') ;
	});


	// Services._updateBadgeActions() ;
	// $("#loginAlert").click((evt)=> {
	// 	evt.stopPropagation() ;
	// 	var items = [];
	// 	_.each(M_.App.Session.todos, (todo)=> {
	// 		let f = M_.Utils.findInArray(Shared.getTodoTypes(), todo.td_type) ;
	// 		let d = moment(todo.co_id_user.updatedAt).valueOf() ;
	// 		let txt = `
	// 			<div class='M_ImgRound loginAlertLiContent2' style="background-image:url(/bp/login/avatar/35/35/${todo.co_id_user.co_id}?d=${d})"></div>
	// 			<div class='loginAlertLiContent'>
	// 				<div>${f.val}</div>
	// 				<div class='loginAlertLiLittle'>${Services.getTextForTodo(todo)}</div>
	// 			</div>
	// 			<div class='M_Clear'></div>
	// 		` ;
	// 		items.push({
	// 			text: txt,
	// 			todo: todo,
	// 			click: (evt, item)=> {
	// 				Services.redirectForTodo(item.todo) ;
	// 			}
	// 		}) ;
	// 	}) ;
	// 	var dd = new M_.Dropdown({
	// 		autoShow: true,
	// 		alignTo: $("#loginAlert"),
	// 		itemsClass: 'loginAlertLi',
	// 		items: items
	// 	}) ;
	// 	dd.show() ;
	// }) ;


	// $('#mainsearchinput').keyup((evt)=> {
	// 	M_.Utils.delay(()=> {
	// 		M_.App.open('Search', 'draw') ;
	// 	}, 200, "delayMainSearch");
    //
	// }) ;
	new M_.Help({
		text: "Rechercher dans les contacts, les absences, les candidats",
		attachedObj: $('#mainsearchinput')
	}) ;


	this.appIsFullScreen = false ;
	$('#loginFullScreen').click(()=> {
		M_.Utils.toggleAppFullScreen() ;
	}) ;
	new M_.Help({
		text: "Afficher l'application en plein écran",
		attachedObj: $('#loginFullScreen')
	}) ;


	function hideMenu() {
		if ($('#mainnav').is(':visible')) {
			var l = -1*$('#mainnav').width() ;
			$('#mainnav').transition({
				left: l
			}, 500, ()=> {
				$('#mainnav').hide() ;
			}) ;
			$('#mainbtmenus span').addClass('fa-reorder') ;
			$('#mainbtmenus span').removeClass('fa-close') ;
		}
	}
	function showMenu() {
		if (!$('#mainnav').is(':visible')) {
			$('#mainnav')
			.css('left', -1*$('#mainnav').width())
			.show()
			.transition({
				left: 0
			}, 500, ()=> {
			}) ;
			$('#mainbtmenus span').removeClass('fa-reorder') ;
			$('#mainbtmenus span').addClass('fa-close') ;
		}
	}
	$('#mainbtmenus').mouseenter(showMenu) ;
	$(document)
	.on('click', '#mainbtmenus', (evt)=> {
		evt.stopPropagation() ;
		if (!$('#mainnav').is(':visible')) showMenu() ;
		else hideMenu() ;
	})
	.on('click', hideMenu) ;

	if (!window.location.hash && M_.Utils.getCookie('mwjurl')) window.open('#/'+M_.Utils.getCookie('mwjurl'), '_self') ;

});
