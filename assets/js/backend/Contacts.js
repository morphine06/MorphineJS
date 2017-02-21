'use strict';


import {M_} from './../../../libs-client/M_.js' ;
import {Services} from './Services.js' ;
import {Shared} from './../../compiled/Shared.js' ;
import {MT_Contacts} from './../../compiled/models/MT_Contacts.js' ;
// import {MT_Agencies} from 'js6/models/Agencies.js' ;
// import {MT_Contactsgroups} from 'js6/models/Contactsgroups.js' ;
import {MT_Groups} from './../../compiled/models/MT_Groups.js' ;
import {ContactsWinEdit} from './ContactsWinEdit.js' ;
// import {ContactsWinImport} from 'js6/controllers/ContactsWinImport.js' ;
import {ContactsDetails} from './ContactsDetails.js' ;
// import {AgencyDetails} from 'js6/controllers/AgencyDetails.js' ;


export class Contacts extends M_.Controller {
	// initialize object
	constructor(opts) {
        // console.log("MT_Jobs",MT_Jobs);
        opts.tpl = JST['assets/templates/backend/Contacts.html'] ;
        super(opts) ;
    }
	// called before all other functions
	// resolve(next) {
	// 	if (!M_.App.isOnline) return next(true) ;
	// 	var urlMaps = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=drawing&callback=initializeMapForOffers' ;
	// 	if (M_.Utils.isLoadedScript(urlMaps)) {
	// 		next(true) ;
	// 	} else {
	// 		window.initializeMapForOffers = ()=> {
	// 			next(true) ;
	// 		};
	// 		M_.Utils.loadScript(urlMaps);
	// 	}
	// }
	//
	init() {
		this.currentGroup = '-1' ;
		this.currentContactId = null ;
	}
	create() {
		this.currentContactId = M_.Utils.getCookie('PuP_contacts_last_co_id') ;


		// var me = this ;
		this.groups = new M_.SimpleList({
			// controller: this,
			container: $("#contacts_list_groups"),
			// classItems: 'listItem',
			itemValue: 'gr_name',
			itemKey: 'gr_id',
			dynamic: false,
			currentSelection: this.currentGroup,
			store: new M_.Store({
				controller: this,
				model: MT_Groups,
				url: "/1.0/groups/find",
				limit: 1000,
				unshiftRows: this.getUnshiftGroups(),
				listeners: [
					['update', $.proxy(function(store, rows) {
						$("#contacts_header_groups").html(M_.Utils.plural(store.countTotal(), "groupe", "groupes")) ;
					}, this)]
				]
			}),
			listeners: [
				['clickItem', (outlet, m_id, model)=> {
					if (m_id=='allagencies') {
					} else {
						this.currentGroup = m_id ;
						this.simplesearch.setValue('') ;
						this.thenLoadFirstContact = true ;
						this.loadContacts({
							skip: 0,
							gr_id: m_id
						}) ;
					}
				}],
				['render', ()=> {
					$('#contacts_list_groups .M_SimpleListItem').each((index, el)=> {
						var m_id = $(el).attr('data-m_id') ;
						if (m_id*1<0) ;
						else $(el).addClass('drophere') ;
					}) ;
				}]
			]
		}) ;
		this.contacts = new M_.SimpleList({
			// controller: this,
			container: $("#contacts_list_contacts"),
			// dynamic: true,
			// classItems: 'listItem',
			itemValue: function(model) {
				var dr = '' ;
				// if (!model.get('co_searches')) dr = '<div style="float:right; width:6px; height:6px; background-color:red; margin-top:5px; border-radius:3px;"></div>' ;
				if (model.get('ag_name')) {
					return model.get('ag_name') ;
				}
				return dr+"<input type='checkbox' class='contacts_list_contactcb' style='float:left;'>"+'<div class="M_ImgRound" style="float:left; background-image:url(/1.0/contacts/avatar/20/20/'+model.get('co_id')+'?d='+moment(model.get('updatedAt')).valueOf()+');width:20px;height:20px; margin-right:5px;"></div>'+Shared.completeName(model.getData(), true) ;
			},
			itemKey: 'co_id',
			currentSelection: this.currentContactId,
			// multipleSelection: true,
			// itemsDraggableTo: '#contacts_list_groups .M_SimpleListItem.drophere',
			store: new M_.Store({
				controller: this,
				model: MT_Contacts,
				url: "/1.0/contacts/find",
				limit: 200,
				listeners: [
					// ['beforeLoad', (store, args)=> {
					// 	if (this.deletedCB) args.args.showdeleted = this.deletedCB.getValue() ;
					// }],
					['update',(store, models)=> {
						$("#contacts_header_contacts").html(M_.Utils.plural(store.countTotal(), "contact", "contacts")) ;
						if (this.thenLoadFirstContact) {
							let idTemp = '-1' ;
							if (store.getRowByIndex(0)) idTemp = store.getRowByIndex(0).get('co_id') ;
							this.loadContact(idTemp, null, false) ;
							this.thenLoadFirstContact = false ;
						}
						// var mods = [] ;
						// for(var i=0 ; i<models.length ; i++) {
						// 	mods.push(models[i].getRowData()) ;
						// }
						// log("mods",mods)
						// localforage.setItem('contacts', mods).then(function() {
						// 	log("c'est stocké")
						// }, function(err) {
						// 	log(err) ;
						// });
					}]
				]
			}),
			listeners: [
				['clickItem', (outlet, m_id, model, evt, col, row)=> {
					// this.loadContact(m_id) ;
					// if (evt.target.tagName==='INPUT' && $(evt.target).is(':checked')) {
					// }
					M_.App.open('Contacts', 'show', m_id) ;
				}],
				['droped', (el, gr_id, selection)=> {
					// log("droped on ", gr_id, selection)
				}],
				['render', (el, gr_id, selection)=> {
					$(".contacts_list_contactcb").click((evt)=> {
						if (!$(evt.target).is(':checked')) return ;
						this.showDropDownContactsSelection(evt) ;
						return ;
					}) ;
				}]

			]
		}) ;


		this.filtergroup = new M_.Form.Text({
			placeholder: "Rechercher sur les groupes",
			name: 'filtergroup',
			container: $("#contacts_bases"),
			help: "Recherche sur les groupes ; les groupes automatique ne sont pas filtrés.",
			styleInput: 'border-radius:0; border-left:0; border-right:0;',
			stylePicker: 'border-radius:0;',
				listeners: [
					['update', (tf, val)=> {
						console.log("change", val);
						$("#contacts_list_groups .M_SimpleListItem").each((ind, el)=> {
							var mid = $(el).attr('data-m_id') ;
							var val = $(el).html() ;
							if (mid=='-1' || mid=='-2' || mid=='-3' || mid=='caddy' || mid=='lastimport' || mid=='allagencies') return ;
							// console.log("$(el).html()", $(el).html());
							if (this.filtergroup.getValue()==='' || val.indexOf(this.filtergroup.getValue()) > -1) {
								$(el).show() ;
							} else {
								$(el).hide() ;
							}
						});
					}]
				]
		}) ;

		// this.activebase = new M_.Form.Combobox({
		// 	name: 'activebase',
		// 	help: "La base qualifiée est votre base normale, sur laquelle vous devez travailler habituellement.<br/><br/>La base temporaire est une autre base de contacts, qui vous permet de travailler avec des contacts que vous ne souhaitez pas faire apparaitre dans la base qualifiée, temporairement.",
		// 	// placeholder: "Civilité",
		// 	// label: "Civilité",
		// 	// labelPosition: 'top',
		// 	container: $("#contacts_bases"),
		// 	value: 'normal',
		// 	styleInput: 'height:25px; border-radius:0;',
		// 	stylePicker: 'border-radius:0;',
		// 	store: new M_.Store({
		// 		controller: this,
		// 		model: M_.ModelKeyVal,
		// 		rows: [
		// 			{ key: 'all', val: 'Qualifiée + temporaire'},
		// 			{ key: 'normal', val: 'Base qualifiée'},
		// 			{ key: 'prospection', val: 'Base temporaire'},
		// 			{ key: 'import', val: 'Dernier import'},
		// 		]
		// 	}),
		// 	listeners: [
		// 		['itemclick', (tf, val)=> {
		// 			this.simplesearch.setValue('') ;
		// 			this.loadContacts({
		// 				skip: 0,
		// 				activebase: val
		// 			}) ;
		// 		}]
		// 	]
		// }) ;
		this.simplesearch = new M_.Form.Text({
			name: 'simplesearch',
			container: $("#contacts_simplesearch"),
			value: '',
			placeholder: "Rechercher sur les contacts",
			help: "Recherche sur le nom, prénom, fonction, code client, email, téléphone, fax, adresse, commentaire.",
			styleInput: 'border-radius:0; border-left:0; border-right:0;',
			listeners: [
				['update', (tf, val)=> {
					M_.Utils.delay(()=> {
						this.loadContacts({
							skip: 0,
							gr_id: this.currentGroup,
							query: val
						}) ;
					}, 200, 'updatesimplesearch') ;
				}]
			]
		}) ;





		// M_.App.renderMustacheTo(
		// 	$("#contacts_details_edit"),
		// 	JST.ContactsEdit
		// ) ;

		// $("#contacts_co_email1bt").click((evt)=> {
		// 	$("#contacts_co_email2bis").show() ;
		// }) ;
		// $("#contacts_co_email2bt").click((evt)=> {
		// 	$("#contacts_co_email3bis").show() ;
		// }) ;

		// $("#contacts_co_tel1bt").click((evt)=> {
		// 	$("#contacts_co_tel2bis").show() ;
		// }) ;
		// $("#contacts_co_tel2bt").click((evt)=> {
		// 	$("#contacts_co_tel3bis").show() ;
		// }) ;

		// $("#contacts_co_mobile1bt").click((evt)=> {
		// 	$("#contacts_co_mobile2bis").show() ;
		// }) ;
		// $("#contacts_co_mobile2bt").click((evt)=> {
		// 	$("#contacts_co_mobile3bis").show() ;
		// }) ;

		// $("#contacts_co_fax1bt").click((evt)=> {
		// 	$("#contacts_co_fax2bis").show() ;
		// }) ;
		// $("#contacts_co_fax2bt").click((evt)=> {
		// 	$("#contacts_co_fax3bis").show() ;
		// }) ;

		// $("#contacts_co_web1bt").click((evt)=> {
		// 	$("#contacts_co_web2bis").show() ;
		// }) ;
		// $("#contacts_co_web2bt").click((evt)=> {
		// 	$("#contacts_co_web3bis").show() ;
		// }) ;

		// $("#contacts_search").keyup((evt)=> {
		// 	M_.Utils.delay(()=> {
		// 		this.contacts.getStore().load({
		// 			skip: 0,
		// 			gr_id:'-1',
		// 			query: $("#contacts_search").val(),
		// 			agencies: this.getSelectedAgencies()
		// 		}) ;
		// 	}, 200, 'delay_search') ;
		// }) ;

		// this.drawerSave = new M_.Drawer({
		// 	jEl: $("#contacts_save_drawer"),
		// 	alignTo: $("#contacts_details"),
		// 	position: 'bottom',
		// 	floating: false
		// }) ;
		//



		$("#contacts_btsearch").click((evt)=> {
			ContactsWinEdit.getInstance(this).searchContacts() ;
		}) ;

		$("#contacts_btsettings").click((evt)=> {
			var items = [
				{
					text: "Importer des contacts",
					disabled: !Shared.canImportContact(M_.App.Session),
					click: ()=> {
						ContactsWinImport.getInstance(this).go() ;
					}
				}, {
					text: "Exporter des contacts",
					disabled: !Shared.canExportContact(M_.App.Session),
					click: ()=> {
						this.openWinExport() ;
					}
				}, {
				}, {
					text: "Inverser le nom et prénom",
					click: ()=> {
						Services.setUserOptionsPerso('persoinvertname', !Services.getUserOptionsPerso('persoinvertname'), ()=> {
							this.contacts.getStore().reload() ;
							if (this.currentContactId) this.loadContact(this.currentContactId, null, false) ;
						}) ;
					}
				}, {
					text: "Rechercher les doublons",
					click: ()=> {
						this.contacts.getStore().load({
							skip: 0,
							gr_id:'-1',
							doublon: true,
							// agencies: this.getSelectedAgencies()
						}) ;

					}
				}, {
					text: "Vérifier les emails",
					click: ()=> {
					}
				}
			] ;
			evt.stopPropagation() ;
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#contacts_btsettings"),
				items: items
			}) ;
			dd.show() ;

		}) ;

		$("#contacts_btaddgroup").click((evt)=> {
			// log("bt click")

			var dis=false, dis2=false ;
			// log("this.currentGroup",parseInt(this.currentGroup))
			var cg = parseInt(this.currentGroup) ;
			if (!isNaN(cg) && cg<0) dis = true ;
			dis2 = dis ;
			if (this.currentGroup=='caddy') {
				dis = true ;
				dis2 = false ;
			}
			var gr_name = this.groups.store.getRow(this.currentGroup).get('gr_name') ;
			var items = [
				{
					text: "Nouveau groupe",
					click: ()=> {
						this.newGroup() ;
					}
				}, {
				}, {
					text: "Vider le groupe <i>"+gr_name+"</i>",
					disabled: dis2,
					click: ()=> {
						this.emptyGroup() ;
					}
				}, {
					text: "Renommer le groupe <i>"+gr_name+"</i>",
					disabled: dis,
					click: ()=> {
						this.renameGroup() ;
					}
				}, {
					text: "Supprimer le groupe <i>"+gr_name+"</i>",
					disabled: dis,
					click: ()=> {
						this.deleteGroup() ;
					}
				}
			] ;
			evt.stopPropagation() ;
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#contacts_btaddgroup"),
				items: items
			}) ;
			dd.show() ;
			// dd._tether.position() ;
		}) ;
		$("#contacts_btaddcontact").click((evt)=> {
			evt.stopPropagation() ;


			if (Shared.canCreateContact(M_.App.Session)) ContactsWinEdit.getInstance(this).newContact() ;
			else M_.Dialog.notify("<b>Information</b><br/>Vous n'avez pas les droits suffisant pour créer un contact") ;
		}) ;

		this.allSelected = false ;
		$("#contacts_selectall").click((evt)=> {
			if (this.allSelected) {
				$(".contacts_list_contactcb").prop('checked', false) ;
				$("#contacts_selectall").html("Tout sélectionner") ;
			} else {
				$(".contacts_list_contactcb").prop('checked', true) ;
				$("#contacts_selectall").html("Tout désélectionner") ;
				this.showDropDownContactsSelection(evt) ;
			}
			this.allSelected = !this.allSelected ;
		}) ;


		// this.win = new M_.Window({
		// 	html: "Salut les amis"
		// }) ;

		this.jEl.find('.agency_selector').first().addClass('checked') ;
		this.jEl.find('.agency_selector').click((evt)=> {
			var jEl = $(evt.target) ;
			jEl.toggleClass('checked');
			if (jEl.attr('data-ag-id')=='all') {
				$(".agency_selector").addClass('checked') ;
			} else {
				$(".agency_selector[data-ag-id='all']").removeClass('checked') ;
			}
			this.loadContacts() ;
		}) ;


		this.groups.store.reload() ;
		this.loadContacts({
			skip: 0,
			gr_id: this.currentGroup
		}) ;


	}




	completeSearch() {
		var win = ContactsWinEdit.getInstance(this) ;
		var data = win.form.getValues() ;
		data.gr_id = this.currentGroup ;
		// console.log("data",data);
		this.contacts.store.load(data) ;
		win.hide() ;
	}
	renameGroup() {
		var group = this.groups.store.getRow(this.currentGroup) ;
		var jEl = $("#contacts_list_groups .M_SimpleListItem[data-m_id='"+this.currentGroup+"']") ;
		jEl.prop('contenteditable', true) ;
		M_.Utils.setSelectionRange(jEl, 0, group.get('gr_name').length) ;
		jEl.blur(()=> {
			// jEl.prop('contenteditable', false) ;
			M_.Utils.putJson('/1.0/groups/update/'+group.get('gr_id'), {gr_name:jEl.html()}, (data)=> {
				this.groups.store.reload() ;
			}) ;

		}) ;
	}
	createGroupNow() {
		$(document).off('keypress', $.proxy(this.listenGroupKeyDown, this));
		M_.Utils.postJson('/1.0/groups/create', {gr_name:this.jElGroup.html()}, (data)=> {
			this.groups.store.reload() ;
		}) ;
	}
	listenGroupKeyDown(evt) {
		if(evt.which == 13) {
			evt.stopPropagation();
			evt.preventDefault();
			this.createGroupNow();
		}
	}
	newGroup() {
		var txt = "Nouveau groupe" ;
		this.jElGroup = $("<div class='M_SimpleListItem' contenteditable='true'>"+txt+"</div>") ;
		$("#contacts_list_groups .M_SimpleListItem[data-m_id='caddy']").after(this.jElGroup) ;
		this.jElGroup.height(0).transition({height:34}) ;
		M_.Utils.setSelectionRange(this.jElGroup, 0, txt.length) ;
		$(document).on('keypress', $.proxy(this.listenGroupKeyDown, this));
		this.jElGroup.blur(()=> {
			this.createGroupNow() ;
		}) ;
	}
	emptyGroup() {
		var group = this.groups.store.getRow(this.currentGroup) ;
		M_.Dialog.confirm("Confirmation", "Etes-vous certain de vouloir vider le groupe <i>"+group.get('gr_name')+"</i><br/>Les contacts ne seront pas effacés.", ()=> {
			M_.Utils.postJson('/1.0/groups/emptygroup/'+group.get('gr_id'), {}, (data)=> {
				this.contacts.store.reload() ;
			}) ;

		}) ;
	}
	deleteGroup() {
		var group = this.groups.store.getRow(this.currentGroup) ;
		M_.Dialog.confirm("Confirmation", "Etes-vous certain de vouloir supprimer le groupe <i>"+group.get('gr_name')+"</i><br/>Les contacts ne seront pas effacés.", ()=> {
			M_.Utils.deleteJson('/1.0/groups/destroy/'+group.get('gr_id'), {}, (data)=> {
				this.groups.store.reload() ;
			}) ;

		}) ;
	}
	drawContact() {

		this.contacts.setSelection(this.currentModelContact.get('co_id')) ;
		// log("this.currentModelContact.get('co_id')",this.currentModelContact.get('co_id'))

		// $("#contacts_details_content").show() ;
		// $("#contacts_details_edit").hide() ;
		// this.drawerSave.hide() ;
		// if (this.modalForm) this.modalForm.hide() ;

		// console.log("this.currentModelContact", this.currentModelContact);
		ContactsDetails.display(
			$("#contacts_details_content"),
			this.currentModelContact
		) ;
	}
	drawAgency() {

		// this.agencies.setSelection(this.currentModelAgency.get('ag_id')) ;
		// log("this.currentModelContact.get('co_id')",this.currentModelContact.get('co_id'))

		// $("#contacts_details_content").show() ;
		// $("#contacts_details_edit").hide() ;
		// this.drawerSave.hide() ;
		// if (this.modalForm) this.modalForm.hide() ;
		AgencyDetails.display(
			$("#contacts_details_content"),
			this.currentModelAgency
		) ;
	}
	getContactsSelection() {
		var tabSelection = [] ;
		$('.contacts_list_contactcb:checked').each((index, jel)=> {
			tabSelection.push($(jel).closest('.M_SimpleListItem').attr('data-m_id')) ;
		}) ;
		return tabSelection ;
	}
	showDropDownContactsSelection(evt) {
		evt.stopPropagation() ;
		var nbChecked = $('.contacts_list_contactcb:checked').length ;
		var items = [
			{
				text: 'Ajouter '+M_.Utils.plural(nbChecked,'contact')+' au panier',
				click: ()=> {
					// this.openWinPresent() ;
					var sel = this.getContactsSelection() ;
					this.addContactsToGroup(sel, 'caddy', 'Panier') ;
				}
			}, {
				text: 'Ajouter '+M_.Utils.plural(nbChecked,'contact')+' au groupe...',
				click: ()=> {
					this.openWinGroupChoose() ;
				}
			}
		] ;

		if (this.currentGroup!='-1') {
			var group = this.groups.store.getRow(this.currentGroup) ;
			items.push({}) ;
			items.push({
				text: 'Effacer '+M_.Utils.plural(nbChecked,'contact')+' du groupe '+group.get('gr_name'),
				click: ()=> {
					var group = this.groups.store.getRow(this.currentGroup) ;
					this.removeContactsToGroup(
						this.getContactsSelection(),
						group.get('gr_id'),
						group.get('gr_name')
					) ;
				}
			}) ;
		}
		this.dropdownRowActions = new M_.Dropdown({
			alignTo: $(evt.target),
			autoShow: false,
			// destroyOnHide: true,
			offsetLeft: 20,
			offsetTop: -15,
			items: items
		}) ;
		this.dropdownRowActions.show() ;
	}
	addContactsToGroup(contacts, gr_id, gr_name) {
		M_.Utils.postJson('/1.0/groups/addcontactstogroup', {contacts:contacts, gr_id:gr_id}, (data)=> {
			this.contacts.store.reload() ;
			M_.Dialog.notify("<b>Information</b><br/>"+M_.Utils.plural(contacts.length,'contact ajouté', 'contacts ajoutés')+" au groupe <i>"+gr_name+"</i>") ;
		}) ;
	}
	removeContactsToGroup(contacts, gr_id, gr_name) {
		M_.Utils.postJson('/1.0/groups/removecontactstogroup', {contacts:contacts, gr_id:gr_id}, (data)=> {
			this.contacts.store.reload() ;
			M_.Dialog.notify("<b>Information</b><br/>"+M_.Utils.plural(contacts.length,'contact enlevé', 'contacts enlevés')+" du groupe <i>"+gr_name+"</i>") ;
		}) ;
	}
	openWinGroupChoose() {
		if (!this.winGroupChoose) {
			this.winGroupChoose = new (class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST['assets/templates/backend/ContactsWinGroupChoose.html'],
						// tplData: {},
						modal: true,
						// controller: this,
						width: 400,
					} ;
					opts = (opts)?opts:{} ;
					var optsTemp = $.extend({}, defaults, opts) ;
					super(optsTemp) ;
					// log("this.jEl",this.jEl)
				}
				create() {
					super.create() ;
					this.jEl.find('.wingroupchoose_bt_save').click(()=> {
						this.controller.addContactsToGroup(
							this.controller.getContactsSelection(),
							this.comboGroup.getValue(),
							this.comboGroup.getRawValue()
						) ;
						this.hide() ;
					}) ;
					this.jEl.find('.wingroupchoose_bt_cancel').click(()=> {
						this.hide() ;
					}) ;

					this.comboGroup = new M_.Form.Combobox({
						name: 'gr_id',
						// label: "Contact",
						// labelPosition: 'left',
						// placeholder: "",
						container: this.jEl.find('.wingroupchoose_group'),
						modelKey: 'gr_id',
						modelValue: 'gr_name',
						containerDropdown: 'body',
						store: new M_.Store({
							controller: this,
							model: MT_Groups,
							url: "/1.0/groups/find",
							limit: 200
						})

					}) ;
					// this.comboGroup.setValue(M_.App.Session) ;
				}
				initWin() {
					// this.comboGroup.reset() ;
				}
			})({
				controller: this
			}) ;

		}
		this.winGroupChoose.initWin() ;
		this.winGroupChoose.show() ;
	}

	openWinExport() {
		if (!this.winExport) {
			this.winExport = new (class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST.ContactsWinExport,
						// tplData: {},
						modal: true,
						// controller: this,
						width: 400,
					} ;
					opts = (opts)?opts:{} ;
					var optsTemp = $.extend({}, defaults, opts) ;
					super(optsTemp) ;
					// log("this.jEl",this.jEl)
				}
				create() {
					super.create() ;
					this.jEl.find('.winexport_bt_save').click(()=> {
						M_.Utils.downloadFile('/1.0/contacts/export', {gr_id:this.comboGroup.getValue()}, 'GET') ;
						this.hide() ;
					}) ;
					this.jEl.find('.winexport_bt_cancel').click(()=> {
						this.hide() ;
					}) ;

					this.comboGroup = new M_.Form.Combobox({
						name: 'gr_id',
						// label: "Contact",
						// labelPosition: 'left',
						// placeholder: "",
						container: this.jEl.find('.winexport_group'),
						modelKey: 'gr_id',
						modelValue: 'gr_name',
						containerDropdown: 'body',
						value: {gr_id:'-1', gr_name:'Tous'},
						store: new M_.Store({
							unshiftRows: this.controller.getUnshiftGroups(),
							controller: this,
							model: MT_Groups,
							url: "/1.0/groups/find",
							limit: 200
						})

					}) ;
					// this.comboGroup.setValue(M_.App.Session) ;
				}
				initWin() {
					// this.comboGroup.reset() ;
				}
			})({
				controller: this
			}) ;

		}
		this.winExport.initWin() ;
		this.winExport.show() ;
	}

	getUnshiftGroups() {
		var tab = [
			{gr_id:-6, gr_name:"<span class='fa fa-user-times'></span>&nbsp;<i>Contacts supprimées</i>", special:true},
			// {gr_id:'lastimport', gr_name:"<span class='fa fa-clock-o'></span>&nbsp;<i>Dernier import</i>", special:true},
			{gr_id:'caddy', gr_name:"<span class='fa fa-shopping-cart'></span>&nbsp;<i>Mon panier</i>", special:true},
			{gr_id:-4, gr_name:"<span class='fa fa-user'></span>&nbsp;<i>Tous les contacts</i>", special:true},
			{gr_id:-5, gr_name:"<span class='fa fa-user-plus'></span>&nbsp;<i>Tous les clients</i>", special:true},
			{gr_id:-2, gr_name:"<span class='fa fa-user-secret'></span>&nbsp;<i>Tous les utilisateurs</i>", special:true},
			{gr_id:-1, gr_name:"<span class='fa fa-group'></span>&nbsp;<i>Tous</i>", special:true},
		] ;
		// if (!Services.getUserRight('contacts_rightsusers')) tab.shift() ;

		// if (Shared.canAccessCandidate(M_.App.Session)) tab.unshift({gr_id:-3, gr_name:"<span class='fa fa-user-plus'></span>&nbsp;<i>Tous les candidats</i>", special:true}) ;

		return tab ;
	}
	onSaveContactsWinEdit(row_co) {
		// this.loadContact(this.currentModelContact.get('co_id')) ;
		M_.App.open('Contacts', 'show', row_co.co_id) ;
		this.loadContacts() ;
	}
	onDeleteContactsWinEdit() {
		this.currentContactId = null ;
		M_.App.open('Contacts') ;
		this.loadContacts() ;
	}
	onCancelContactsWinEdit() {
		M_.App.open('Contacts', 'show', this.currentModelContact.get('co_id')) ;
		// M_.App.open('Contacts', 'show', row_co.co_id) ;
	}


	loadContact(co_id, callback=null, anim=true) {
		if (anim) {
			$("#contacts_details_content").transition({opacity:0}, 100, ()=> {
				ContactsWinEdit.getInstance(this).loadContact(co_id, (currentModelContact)=> {
					this.currentModelContact = currentModelContact ;
					$("#contacts_details_content").transition({opacity:1}, 100);
					this.drawContact() ;
					if (callback) callback() ;
				}, false) ;
			});
		} else {
			ContactsWinEdit.getInstance(this).loadContact(co_id, (currentModelContact)=> {
				this.currentModelContact = currentModelContact ;
				this.drawContact() ;
				if (callback) callback() ;
			}, false) ;
		}
		M_.Utils.setCookie('PuP_contacts_last_co_id', co_id, 100) ;
	}
	loadContacts(what) {
		$("#contacts_list_agencies").hide() ;
		$("#contacts_list_contacts").show() ;
		if (!what) {
			this.contacts.store.reload(false, {
				// agencies: this.getSelectedAgencies()
			}) ;
		} else {
			what.skip = 0 ;
			// what.activebase = this.activebase.getValue() ;
			what.query = this.simplesearch.getValue() ;
			// what.agencies = this.getSelectedAgencies() ;
			this.contacts.getStore().load(what) ;
		}
	}



	editAction(co_id, ag_id) {
		if (co_id=='agency') {
			this.loadAgency(ag_id, ()=> {
				AgencyWinEdit.getInstance(this).editAgency(this.currentModelAgency) ;
			}, false) ;

		} else {
			this.loadContact(co_id, ()=> {
				ContactsWinEdit.getInstance(this).editContact(this.currentModelContact) ;
			}, false) ;
		}
	}
	showAction(co_id, ag_id) {
		if (co_id=='agency') this.loadAgency(ag_id) ;
		else this.loadContact(co_id) ;
	}
	indexAction() {
		if (this.currentContactId) this.loadContact(this.currentContactId, null, false) ;
	}
}
