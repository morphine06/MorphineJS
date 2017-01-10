'use strict';

import {M_} from './../../../libs-client/M_.js' ;
import {Services} from './Services.js' ;
import {Shared} from './../../compiled/Shared.js' ;
import {MT_Contacts} from './../../compiled/models/MT_Contacts.js' ;
import {MT_Keywords} from './../../compiled/models/MT_Keywords.js' ;


export class ContactsWinEdit extends M_.Window {

	constructor(opts) {
		var defaults = {
			tpl: JST['assets/templates/backend/ContactsWinEdit.html'],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 900,
			_contractNum: 0,
			_agencyNum: 0
		} ;
		opts = (opts)?opts:{} ;
		var optsTemp = $.extend({}, defaults, opts) ;
		super(optsTemp) ;
		// log("this.jEl",this.jEl)


	}


	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new ContactsWinEdit({controller:controller}) ;
		this._instance.controller = controller ;
		return this._instance ;
	}

	create() {
		super.create() ;


		this.form = new M_.Form.Form({
			// url: '/1.0/contacts',
			urls: {
				findone: 'GET /1.0/contacts/findone',
				create: 'POST /1.0/contacts/create',
				update: 'PUT /1.0/contacts/update',
				destroy: 'DELETE /1.0/contacts/destroy',
			},
			model: MT_Contacts,
			controller: this,
			processData: function(data) {
				Services.processContactsData(data) ;
			},
			listeners: [
				['valid', (form, ok, err)=> {
					if (form.find('co_id').getValue()==='' &&
						form.find('co_password').getValue()==='' &&
						form.find('co_type').getValue()!='contact' &&
						form.find('co_type').getValue()!='customer' &&
						form.find('co_type').getValue()!='candidate') {
						err.push({key:'co_password', label:"Le mot de passe est vide"}) ;
						return false ;
					}
					if (form.find('co_name').getValue()==='' && form.find('co_society').getValue()==='') {
						err.push({key:'co_name', label:"Vous devez indiquer un nom ou une société."}) ;
						return false ;
					}
					return true ;
				}],
				['load', (form, model)=> {
					this.currentModel = model ;
				}],
				['save', (form, data)=> {
					this.hide() ;
					if (this.controller.currentModelContact) this.controller.currentModelContact.set('co_id', data.data.co_id) ;
					if (form.find('co_avatar_send').getValue()!=='') {
						M_.Utils.saveFiles([form.find('co_avatar_send').jEl.get(0)], '/1.0/contacts/updateavatar', {co_id:data.data.co_id}, (data)=> {
							form.deleteItem('co_avatar_send') ;
							Services.updateAvatar() ;
							if (this.controller.onSaveContactsWinEdit) this.controller.onSaveContactsWinEdit(data.data) ;
							this.checkMine() ;
						}) ;
					} else {
						if (this.controller.onSaveContactsWinEdit) this.controller.onSaveContactsWinEdit(data.data) ;
						this.checkMine() ;
					}
				}],
				['delete', (form, model)=> {
					// this.loadContact('-1') ;
					// this.contacts.store.reload() ;
					this.hide() ;
					if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit() ;

				}]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				hideIfEmpty: true,
				labelPosition: 'left',
				labelWidth: 100
			},
			items: [
				{
					type: M_.Form.Hidden,
					name: 'co_id',
					container: $("#contactedit_co_name")
				}, {
					type: M_.Form.Combobox,
					name: 'co_type',
					editable: false,
					allowEmpty: false,
					placeholder: "",
					label: "Droit",
					labelPosition: 'top',
					container: $("#contactedit_co_type"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getRoles(!Shared.canEditContactsRights(M_.App.Session))
					}),
					listeners: [
						['itemclick',(store, models)=> {
							this.showHideLoginInfos() ;
							if (this.form.find('co_function').getValue()==='')
								this.form.find('co_function').setValue(
									_.result(_.find(Shared.getRoles(), {key:this.form.find('co_type').getValue()}), 'val')) ;
						}]
					]

				}, {
					name: 'co_name',
					placeholder: "",
					label: "Nom",
					labelPosition: 'top',
					container: $("#contactedit_co_name"),
					allowEmpty: true,
					listeners: [
						['update',(tf, val)=> {
							this.setTitleWin() ;
						}]
					]
				}, {
					type: M_.Form.Date,
					name: 'co_birthday',
					placeholder: "JJ/MM/AAAA",
					label: "Date de naissance",
					labelPosition: 'top',
					container: $("#contactedit_co_birthday"),
					allowEmpty: true
				}, {
					name: 'co_firstname',
					placeholder: "",
					label: "Prénom",
					labelPosition: 'top',
					container: $("#contactedit_co_firstname"),
					allowEmpty: true,
					listeners: [
						['update',(tf, val)=> {
							this.setTitleWin() ;
						}]
					]
				// }, {
				// 	type: M_.Form.Combobox,
				// 	name: 'ag_id',
				// 	label: "Agence",
				// 	labelPosition: 'top',
				// 	placeholder: "",
				// 	container: $("#contactedit_ag_id"),
				// 	modelKey: 'ag_id',
				// 	modelValue: 'ag_name',
				// 	store: new M_.Store({
				// 		controller: this,
				// 		model: MT_Agencies,
				// 		url: "/1.0/agencies",
				// 		limit: 200,
				// 		args: ()=> {
				// 			var r = {} ;
				// 			if (!Shared.canEditContactForOtherAgencies(M_.App.Session)) r.onlymine = true ;
				// 			return r ;
				// 		}
				// 	})
				}, {
					type: M_.Form.Combobox,
					name: 'co_civility',
					useRawValue: true,
					placeholder: "",
					label: "Civilité",
					labelPosition: 'top',
					container: $("#contactedit_co_civility"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: [
							{ key: 'M', val: 'M'},
							{ key: 'Mme', val: 'Mme'},
							{ key: 'Mlle', val: 'Mlle'},
							{ key: 'Dr', val: 'Dr'},
							{ key: 'Me', val: 'Me'},
							{ key: 'Pr', val: 'Pr'}
						]
					}),
					listeners: [
						['itemclick',(tf, val)=> {
							this.setTitleWin() ;
						}]
					]
				}, {
					name: 'co_idpld',
					placeholder: "",
					label: "ID PLD",
					labelPosition: 'top',
					container: $("#contactedit_co_idpld")
				}, {
					type: M_.Form.Number,
					name: 'co_vacation_acquisn1',
					placeholder: "",
					label: "Congés acquis n-1",
					labelPosition: 'top',
					decimalLength: 2,
					decimalSeparator: ',',
					decimalForced: true,
					allowNegative: true,
					// labelWidth: 180,
					addon: 'J',
					container: $("#contactedit_co_vacation_acquisn1")
				}, {
					type: M_.Form.Number,
					name: 'co_vacation_prisn1',
					placeholder: "",
					label: "Congés pris n-1",
					labelPosition: 'top',
					decimalLength: 2,
					decimalSeparator: ',',
					decimalForced: true,
					allowNegative: true,
					// labelWidth: 180,
					addon: 'J',
					container: $("#contactedit_co_vacation_prisn1")
				}, {
					type: M_.Form.Number,
					name: 'co_vacation_acquis',
					placeholder: "",
					label: "Congés acquis n",
					labelPosition: 'top',
					decimalLength: 2,
					decimalSeparator: ',',
					decimalForced: true,
					allowNegative: true,
					// labelWidth: 180,
					addon: 'J',
					container: $("#contactedit_co_vacation_acquis")
				}, {
					type: M_.Form.Number,
					name: 'co_vacation_pris',
					placeholder: "",
					label: "Congés pris n",
					labelPosition: 'top',
					decimalLength: 2,
					decimalSeparator: ',',
					decimalForced: true,
					allowNegative: true,
					// labelWidth: 180,
					addon: 'J',
					container: $("#contactedit_co_vacation_pris")
				}, {
					type: M_.Form.Date,
					name: 'co_vacation_import',
					placeholder: "",
					label: "Date",
					labelPosition: 'top',
					// labelWidth: 180,
					container: $("#contactedit_co_vacation_import")
				}, {
					name: 'co_society',
					label: "Société",
					labelPosition: 'top',
					placeholder: "",
					container: $("#contactedit_co_society"),
					listeners: [
						['update',(tf, val)=> {
							this.setTitleWin() ;
						}]
					]
				}, {
					type: M_.Form.Combobox,
					name: 'co_function',
					label: "Fonction",
					labelPosition: 'top',
					container: $("#contactedit_co_function"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: '/1.0/contacts/combo/co_function'
					})


				}, {
					name: 'co_siret',
					placeholder: "",
					label: "Siret",
					labelPosition: 'top',
					container: $("#contactedit_co_siret")

				}, {
					name: 'co_comptecollectif',
					placeholder: "",
					label: "Compte collectif",
					labelPosition: 'top',
					container: $("#contactedit_co_comptecollectif")
				}, {
					name: 'co_comptecomptable',
					placeholder: "",
					label: "Compte comptable",
					labelPosition: 'top',
					container: $("#contactedit_co_comptecomptable")
				}, {
					name: 'co_codetiers',
					placeholder: "",
					label: "Code tiers",
					labelPosition: 'top',
					container: $("#contactedit_co_codetiers")
				}, {
					name: 'co_matricule',
					placeholder: "",
					label: "Numéro de matricule",
					labelPosition: 'top',
					container: $("#contactedit_co_matricule")
				}, {
					type: M_.Form.Date,
					name: 'co_date_start_society',
					placeholder: "",
					label: "Employé depuis le",
					labelPosition: 'top',
					container: $("#contactedit_co_date_start_society")
				}, {
					type: M_.Form.Date,
					name: 'co_date_end_society',
					placeholder: "",
					label: "Employé jusqu'au",
					labelPosition: 'top',
					container: $("#contactedit_co_date_end_society")
				}, {
					type: M_.Form.Multi,
					name: 'co_keywords',
					label: "Mots clés",
					container: $("#contactedit_co_keywords"),
					onClickBtAdd: (formEl, vals)=> {
						this.openWinKeywords(vals) ;
					}
				}, {
					name: 'co_login',
					placeholder: "",
					label: "Login",
					labelPosition: 'top',
					container: $("#contactedit_co_login")
				}, {
					// type: M_.Form.Password,
					name: 'co_password',
					placeholder: "6 caractère minimum",
					label: "Mot de passe",
					labelPosition: 'top',
					minLength: 6,
					help: "Saisir un nombre, une manuscule, une minuscule, un caractère non alpha-numérique ($, &amp;, @, etc)",
					container: $("#contactedit_co_password")
				}, {
					name: 'co_email',
					placeholder: "eMail",
					label: "eMail procedePassword",
					labelWidth: 80,
					container: $("#contactedit_co_email")
				}, {
					name: 'co_email1',
					placeholder: "eMail",
					label: "eMail PRO",
					labelWidth: 80,
					container: $("#contactedit_co_email1")
				}, {
					name: 'co_email2',
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_email2")
				}, {
					name: 'co_email3',
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_email3")
				}, {
					name: 'co_emailperso1',
					placeholder: "eMail",
					label: "eMail PERSO",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso1")
				}, {
					name: 'co_emailperso2',
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso2")
				}, {
					name: 'co_emailperso3',
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso3")
				}, {
					name: 'co_tel1',
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "Téléphone",
					container: $("#contactedit_co_tel1")
				}, {
					name: 'co_tel2',
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#contactedit_co_tel2")
				}, {
					name: 'co_tel3',
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#contactedit_co_tel3")
				}, {
					name: 'co_fax1',
					labelWidth: 80,
					placeholder: "Fax",
					label: "Fax",
					container: $("#contactedit_co_fax1")
				}, {
					name: 'co_fax2',
					labelWidth: 80,
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#contactedit_co_fax2")
				}, {
					name: 'co_fax3',
					labelWidth: 80,
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#contactedit_co_fax3")
				}, {
					name: 'co_mobile1',
					labelWidth: 80,
					placeholder: "Mobile",
					label: "Mobile",
					container: $("#contactedit_co_mobile1")
				}, {
					name: 'co_mobile2',
					labelWidth: 80,
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#contactedit_co_mobile2")
				}, {
					name: 'co_mobile3',
					labelWidth: 80,
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#contactedit_co_mobile3")
				}, {
					name: 'co_address1',
					placeholder: "Adresse 1",
					container: $("#contactedit_co_address1")
				}, {
					name: 'co_address2',
					placeholder: "Adresse 2",
					container: $("#contactedit_co_address2")
				}, {
					name: 'co_address3',
					placeholder: "Adresse 3",
					container: $("#contactedit_co_address3")
				}, {
					name: 'co_zip',
					placeholder: "Code postal",
					container: $("#contactedit_co_zip")
				}, {
					type: M_.Form.Combobox,
					name: 'co_country',
					placeholder: "Pays",
					container: $("#contactedit_co_country"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: '/1.0/combo/contacts/co_country'
					})
				}, {
					name: 'co_city',
					placeholder: "Ville",
					container: $("#contactedit_co_city")
				// }, {
				// 	name: 'co_address_liv1',
				// 	placeholder: "Adresse 1 livraison",
				// 	container: $("#contactedit_co_address_liv1")
				// }, {
				// 	name: 'co_address_liv2',
				// 	placeholder: "Adresse 2 livraison",
				// 	container: $("#contactedit_co_address_liv2")
				// }, {
				// 	name: 'co_address_liv3',
				// 	placeholder: "Adresse 3 livraison",
				// 	container: $("#contactedit_co_address_liv3")
				// }, {
				// 	name: 'co_zip_liv',
				// 	placeholder: "Code postal",
				// 	container: $("#contactedit_co_zip_liv")
				// }, {
				// 	name: 'co_city_liv',
				// 	placeholder: "Ville",
				// 	container: $("#contactedit_co_city_liv")
				// }, {
				// 	name: 'co_country_liv',
				// 	placeholder: "Pays",
				// 	container: $("#contactedit_co_country_liv")
				// }, {
				// 	name: 'co_telephons',
				// 	placeholder: "Téléphones",
				// 	label: "Téléphones",
				// 	container: $("#contactedit_co_telephons")
				// }, {
				// 	name: 'co_web',
				// 	placeholder: "Site web",
				// 	label: "Site web",
				// 	help: "Saisir avec ou sans le http://",
				// 	container: $("#contactedit_co_web")
				}, {
					type: M_.Form.Textarea,
					name: 'co_comment',
					placeholder: "Commentaire",
					height: 70,
					// label: "Commentaire",
					// labelPosition: 'top',
					container: $("#contactedit_co_comment")
				// }, {
				// 	type: M_.Form.Textarea,
				// 	name: 'co_comment2',
				// 	placeholder: "Commentaire 2",
				// 	label: "Commentaire 2",
				// 	container: $("#contactedit_co_comment2")
				}, {
					name: 'co_color',
					placeholder: "Couleur",
					label: "Couleur",
					labelPosition: 'top',
					container: $("#contactedit_co_color")
				// }, {
				// 	type: M_.Form.Checkbox,
				// 	name: 'co_receive_emailing',
				// 	placeholder: "Reçoit la mailinglist",
				// 	label: "Reçoit la mailinglist",
				// 	labelPosition: 'right',
				// 	container: $("#contactedit_co_receive_emailing")

				}, {
					type: M_.Form.Combobox,
					name: 'co_avatarauto',
					label: "...ou",
					labelPosition: 'left',
					labelWidth: 70,
					container: $("#contactedit_co_avatarauto"),
					// useRawValue: true,
					dropdownOpts: {
						width: 410,
						drawEachItem: function(item, i, ul, items) {
							var htmlItem = `<li style="display:block; float:left; width:100px; height:100px; margin:0 2px 2px 0;"><img src='/images/avatar${item.text}.png' width='95' height='95' alt=''></li>` ;
							var jElItem = $(htmlItem) ;
							// jElItem.data('indexitem', i) ;
							ul.append(jElItem) ;
							if (item.click && !item.disabled) {
								jElItem.click({fn:item}, $.proxy(function(evt) {
									// var el = $(evt.target).closest('.M_DropdownMenu') ;
									evt.data.fn.click(evt, evt.data.fn) ;
									this.hide() ;
								}, this)) ;
							}
						}
					},
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getAvatarsAuto()
					})
				}, {
					type: M_.Form.Picker,
					name: 'co_linkedin',
					label: "LinkedIn",
					stylePicker: 'font-size:17px;',
					icon: 'fa fa-linkedin-square',
					hasDropdown: false,
					labelPosition: 'left',
					labelWidth: 70,
					help: "Copier/coller le lien LinkedIn ici.<br>Peut contenir http:// ou pas",
					container: $("#contactedit_co_linkedin"),
					listeners: [
						['clickpicker',(tf, val)=> {
							if (tf.getValue()) window.open(M_.Utils.urlIze(tf.getValue()), '_blank');
						}]
					]
				}, {
					type: M_.Form.Picker,
					icon: 'fa fa-bitbucket',
					stylePicker: 'font-size:17px;',
					hasDropdown: false,
					name: 'co_viadeo',
					label: "Viadeo",
					labelPosition: 'left',
					labelWidth: 70,
					help: "Copier/coller le lien Viadeo ici.<br>Peut contenir http:// ou pas",
					container: $("#contactedit_co_viadeo"),
					listeners: [
						['clickpicker',(tf, val)=> {
							if (tf.getValue()) window.open(M_.Utils.urlIze(tf.getValue()), '_blank');
						}]
					]

				}, {
					name: 'co_web1',
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web1")
				}, {
					name: 'co_web2',
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web2")
				}, {
					name: 'co_web3',
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web3")




				}, {
					type: M_.Form.Number,
					name: 'co_annualincomes',
					label: "Revenu / mois",
					labelWidth: 200,
					allowComparison: true,
					autoContainer: $("#contactedit_financial1")
				}, {
					type: M_.Form.Number,
					name: 'co_familybenefits',
					label: "Allocations familiales / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial1")
				}, {
					type: M_.Form.Number,
					name: 'co_realincomes',
					label: "Revenus immobiliers / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial1")
				}, {
					type: M_.Form.Number,
					name: 'co_othersincomes',
					label: "Autres revenus / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial1")
				}, {
					type: M_.Form.Number,
					name: 'co_alimonies',
					label: "Pensions alimentaires / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial2")
				}, {
					type: M_.Form.Number,
					name: 'co_consumercredit',
					label: "Crédits consommation / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial2")
				}, {
					type: M_.Form.Number,
					name: 'co_automobilecredit',
					label: "Crédits automobile / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial2")
				}, {
					type: M_.Form.Number,
					name: 'co_otherscredit',
					label: "Autres crédits / mois",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial2")
				}, {
					type: M_.Form.Number,
					name: 'co_personalcapital',
					label: "Apport personnel",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial3")
				}, {
					type: M_.Form.Number,
					name: 'co_ratedebt',
					label: "Taux endettement maxi (%)",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial3")
				}, {
					type: M_.Form.Number,
					name: 'co_rateloan',
					label: "Taux du prêt (%)",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial3")
				}, {
					type: M_.Form.Number,
					name: 'co_durationloan',
					label: "Durée du prêt (années)",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial3")
				}, {
					type: M_.Form.Number,
					name: 'co_financialallocation',
					label: "Enveloppe financière",
					labelWidth: 200,
					autoContainer: $("#contactedit_financial3")



				}, {
					type: M_.Form.Number,
					name: 'co_km_homework',
					label: "Kilomètres domicile/travail",
					labelWidth: 200,
					allowComparison: true,
					autoContainer: $("#contactedit_co_km_homework"),
					addon: 'Km',




				}
			]

		}) ;

		// this.controller = this ;

		// $("#contactedit_btaddkeyword").click(()=> {
		// 	this.openWinKeywords() ;
		// }) ;

		this.jEl.find('.M_ModalSave').click(()=> {
			if (this.modeSearch) this.search() ;
			else this.saveContact() ;
		}) ;
		this.jEl.find('.M_ModalDelete').click(()=> {
			this.deleteContact() ;
		}) ;
		this.jEl.find('.M_ModalCancel').click(()=> {
			// $("#contacts_details").transition({opacity:0}, 100, ()=> {
			// 	this.drawContact(this.currentModel) ;
			// 	$("#contacts_details").transition({opacity:1}, 100) ;
			// }) ;
			// if (this.currentModel) this.controller.loadContact(this.controller.currentModel.get('co_id')) ;
			// else this.controller.currentModel.loadContact('-1') ;
			if (this.controller.onCancelContactsWinEdit) this.controller.onCancelContactsWinEdit() ;
			this.hide() ;
		}) ;

		var tabTemp = ['co_email','co_emailperso','co_tel','co_mobile','co_fax','co_web','co_address'] ;//,'co_address_liv'
		for(let i=0 ; i<tabTemp.length ; i++) {
			for(let j=1 ; j<=3 ; j++) {
				this.form.find(tabTemp[i]+j).addListener('keyup', ()=> {
					this.showHideCoordinates(true) ;
				}) ;
				this.form.find(tabTemp[i]+j).jEl.on('focus blur', ()=> {
					window.setTimeout(()=> {
						this.showHideCoordinates(true) ;
					},100);

				}) ;
			}
		}

		_.each(Shared.getRights(), (right)=> {
			var v = false, indeterminate = true ;
			this.form.addItem({
				type: M_.Form.Checkbox,
				name: "right_"+right.key,
				fakeGroup: "rightscheckboxs",
				threeStates: true,
				value: v,
				indeterminate: indeterminate,
				labelWidth: 300,
				labelPosition: 'right',
				label: "<span style='display:inline-block; width:38px;' id='contactedit_rights_"+right.key+"'></span> "+right.label,
				autoContainer: $("#contactedit_rights"),
				listeners: [
					['change',(store, models)=> {
						this.calculateRights() ;
					}]
				]
			}) ;
		}) ;

		$("#contactedit_addcontract").click(()=> {
			this.addContract(null) ;
		}) ;

		this.rightAllCheckboxs = 2 ;
		$("#contactedit_rightsbtall").click(()=> {
			var ok = false ;
			if (this.rightAllCheckboxs===0) {
				ok = true ;
				$("#contactedit_rightsbtall").html("Tout décocher") ;
			}
			if (this.rightAllCheckboxs==1) {
				ok = false ;
				$("#contactedit_rightsbtall").html("Tout hériter du groupe de droits") ;
			}
			if (this.rightAllCheckboxs==2) {
				ok = 2 ;
				$("#contactedit_rightsbtall").html("Tout cocher") ;
			}
			var chks = this.form.getItemsByFakeGroup('rightscheckboxs') ;
			_.each(chks, (chk)=> {
				chk.setValue(ok) ;
			}) ;
			this.rightAllCheckboxs++ ;
			if (this.rightAllCheckboxs>=3) this.rightAllCheckboxs=0 ;
		});

		$("#contactedit_btaddagency").click(()=> {
			this.addAgency() ;
		}) ;



	}
	addContract(row_cc) {
		if (!row_cc) {
			row_cc = {
				cc_id:"",
				cc_start: moment(),
				cc_end: moment(),
				cc_type: 1,
				cc_entity: 1
			} ;
		}

		// if (!this._contractNum) this._contractNum = 0 ;
		this._contractNum++ ;

		var id0 = M_.Utils.id(),
			id1 = M_.Utils.id(),
			id2 = M_.Utils.id(),
			id3 = M_.Utils.id(),
			id4 = M_.Utils.id(),
			id5 = M_.Utils.id() ;
		var html = `<div class='M_Flex' id='${id0}'>
						<div id='${id1}'></div>
						<div id='${id2}'></div>
						<div id='${id3}'></div>
						<div id='${id4}'></div>
						<div style="padding:19px 0 0 0; flex-grow:0.2; text-align:right;"><span style="cursor:pointer;" id='${id5}' class="fa fa-trash"></span></div>
					</div>`;
		$("#contactedit_contracts").append(html) ;

		$("#"+id5).data('contractNum', this._contractNum) ;
		$("#"+id5).data('idLine', id0) ;
		$("#"+id5).click((evt) => {
			this.form.deleteByFakeGroup('cc_group_'+$(evt.target).data('contractNum')) ;
			$("#"+$(evt.target).data('idLine')).remove() ;
		}) ;
		this.form.addItem([
			{
				type: M_.Form.Hidden,
				name: "cc_id_"+this._contractNum,
				fakeGroup: "cc_group_"+this._contractNum,
				container: $("#"+id1),
				value: row_cc.cc_id
			}, {
				type: M_.Form.Date,
				name: "cc_start_"+this._contractNum,
				labelPosition: 'top',
				label: "Début de contrat",
				fakeGroup: "cc_group_"+this._contractNum,
				container: $("#"+id1),
				value: row_cc.cc_start,
				allowEmpty: false,
				disabledDates: (cal, d)=> {
					if (d.day()===0 || d.day()==6) return true ;
					return false ;
				},
			}, {
				type: M_.Form.Date,
				name: "cc_end_"+this._contractNum,
				labelPosition: 'top',
				label: "Fin de contrat",
				fakeGroup: "cc_group_"+this._contractNum,
				container: $("#"+id2),
				value: row_cc.cc_end,
				allowEmpty: false,
				disabledDates: (cal, d)=> {
					var _contractNum = cal.controller.fakeGroup[0].substring(9) ;
					var minDate = this.form.find('cc_start_'+_contractNum).getValue() ;
					if (d.isBefore(minDate)) return true ;
					if (d.day()===0 || d.day()==6) return true ;
					return false ;
				},
			}, {
				type: M_.Form.Combobox,
				name: 'cc_type_'+this._contractNum,
				allowEmpty: false,
				placeholder: "",
				label: "Type de contrat",
				labelPosition: 'top',
				editable: false,
				container: $("#"+id3),
				fakeGroup: "cc_group_"+this._contractNum,
				value: row_cc.cc_type,
				store: new M_.Store({
					controller: this,
					model: M_.ModelKeyVal,
					rows: Shared.getTypesContrat()
				})
			}, {
				type: M_.Form.Combobox,
				name: 'cc_entity_'+this._contractNum,
				allowEmpty: false,
				placeholder: "",
				label: "Entité payante",
				labelPosition: 'top',
				editable: false,
				container: $("#"+id4),
				fakeGroup: "cc_group_"+this._contractNum,
				value: row_cc.cc_entity,
				store: new M_.Store({
					controller: this,
					model: M_.ModelKeyVal,
					rows: Shared.getEntities()
				})
			}
		]) ;

	}
	checkMine() {
		if (this.currentModel.get('co_id')==M_.App.Session.co_id) {
			M_.Dialog.alert("Information", "Votre fiche a été sauvegardée.<br/><br/><b>Le programme doit être redémarré pour prendre en compte les modifications.</b>", ()=> {
				window.open('/', '_self') ;
			}) ;
		}
	}
	showHideLoginInfos() {
		if (!this.form) return ;
		if ((this.form.find('co_type').getValue()!='contact' && this.form.find('co_type').getValue()!='customer') || this.modeSearch) {
			$("#contactedit_panuser").fadeIn() ;
			$("#contactedit_panuser2").fadeOut() ;
		} else {
			$("#contactedit_panuser").fadeOut() ;
			$("#contactedit_panuser2").fadeIn() ;
		}
	}
	showHideCoordinates(anim=false) {
		var tabTemp = ['co_email','co_emailperso','co_tel','co_mobile','co_fax','co_web','co_address'] ;//, 'co_address_liv'
		for(let i=0 ; i<tabTemp.length ; i++) {
			let previousFilled = true ;
			for(let j=1 ; j<=3 ; j++) {
				let val = this.form.find(tabTemp[i]+j).getValue() ;
				if ((!this.modeSearch && (val!=='' || previousFilled || this.form.find(tabTemp[i]+j).jEl.is(':focus'))) || (this.modeSearch && j==1)) {
					if (anim) $("#contactedit_"+tabTemp[i]+j).slideDown() ;
					else $("#contactedit_"+tabTemp[i]+j).show() ;
				} else {
					if (anim) $("#contactedit_"+tabTemp[i]+j).slideUp() ;
					else $("#contactedit_"+tabTemp[i]+j).hide() ;
				}
				// log("tabTemp[i]+j).jEl.is(':focus')",this.form.find(tabTemp[i]+j).jEl.is(':focus'))
				if (val!=='' && this.form.find(tabTemp[i]+j).jEl.is(':focus')) previousFilled = true ;
				else previousFilled = false ;
			}
		}
	}
	newContact(type='-1') {
		this.loadContact(type, ()=> {
			this.editContact(this.currentModel) ;
		}) ;
	}
	// newContact() {
	// 	this.openWinEditOpportunity(new MT_Opportunities({row: {
	// 		op_name: "Nouvelle opportunité",
	// 		op_step: 1,
	// 		of_id: "",
	// 		co_id_contact: "",
	// 		co_id_user: M_.App.Session
	// 	}})) ;

	// }
	deleteContact() {
		if (this.currentModel.get('deleted')) {
			M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir à nouveau activer ce contact ?", ()=> {
				M_.Utils.getJson('/1.0/contacts/undestroy/'+this.currentModel.get('co_id'), {deleted:false}, ()=> {
					this.hide() ;
					if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit() ;
				}) ;
			}) ;
		} else {
			M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce contact ?", ()=> {
				this.form.delete(this.currentModel.get('co_id'), null, ()=> {
					if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit() ;
				}) ;
			}) ;

		}
	}
	saveContact() {
		console.log("savecon");
		this.form.validAndSave() ;
	}
	// _beforeShowWin() {
	// 	this.showHideCoordinates(false) ;
	// 	if (this.currentModel.get('co_id')) {
	// 		this.jEl.find('.M_ModalDelete').prop("disabled", false) ;
	// 	} else {
	// 		this.jEl.find('.M_ModalDelete').prop("disabled", true) ;
	// 	}
	// }
	searchContacts() {
		this.modeSearch = true ;
		// this._beforeShowWin() ;
		this.form.reset() ;
		this.currentModel.set('co_id', '') ;
		this.currentModel.set('contracts', []) ;
		this.currentModel.set('rights', null) ;
		this.initWinNow() ;
	}

	addAgency(row_ag) {
		if (!row_ag) row_ag = {ag_id:'', ag_name:''} ;
		var idTemp = M_.Utils.id() ;
		$("#contactedit_ag_ids").append("<div id='"+idTemp+"'></div>") ;

		this._agencyNum++ ;

		this.form.addItem({
			type: M_.Form.Combobox,
			name: 'ag_id_'+this._agencyNum,
			// label: "Agence",
			// labelPosition: 'top',
			placeholder: "",
			container: $("#"+idTemp),
			modelKey: 'ag_id',
			modelValue: 'ag_name',
			value: row_ag,
			store: new M_.Store({
				controller: this,
				model: MT_Agencies,
				url: "/1.0/agencies",
				limit: 200,
				unshiftRows: [{
					ag_id: '',
					ag_name: '--------'
				},{
					ag_id: '',
					ag_name: 'Aucune'
				}],
				args: ()=> {
					var r = {} ;
					if (!Shared.canEditContactForOtherAgencies(M_.App.Session)) r.onlymine = true ;
					return r ;
				}
			})
		}) ;
	}
	search() {
		this.controller.completeSearch() ;
	}
	initWinNow() {

		if (this.currentModel.get('co_id')) {
			this.jEl.find('.M_ModalDelete').prop("disabled", false) ;
		} else {
			this.jEl.find('.M_ModalDelete').prop("disabled", true) ;
		}
		if (this.currentModel.get('deleted')) {
			this.jEl.find('.M_ModalDelete').html("Ré-activer") ;
		} else {
			this.jEl.find('.M_ModalDelete').html("Supprimer") ;
		}

		this.show(true) ;
		this.showHideCoordinates(false) ;
		this.showHideLoginInfos() ;
		this.setTitleWin() ;


		for(var i=1 ; i<=this._contractNum ; i++) {
			this.form.deleteByFakeGroup("cc_group_"+i) ;
		}
		this._contractNum = 0 ;
		$("#contactedit_contracts").empty() ;
		var contracts = this.currentModel.get('contracts') ;
		_.forEach(contracts, (contract) => {
			this.addContract(contract) ;
		}) ;


		for(i=1 ; i<=this._agencyNum ; i++) {
			this.form.deleteByFakeGroup("ag_id_"+i) ;
		}
		this._agencyNum = 0 ;
		$("#contactedit_ag_ids").empty() ;
		var agencies = this.currentModel.get('agencies') ;
		_.forEach(agencies, (agency) => {
			this.addAgency(agency) ;
		}) ;
		// if (agencies.length===0) this.addAgency() ;


		var rights = this.currentModel.get('co_rights') ;
		_.each(Shared.getRights(), (right)=> {
			if (rights && rights[right.key]) {
				this.form.find('right_'+right.key).setValue(rights[right.key]) ;
			}
		}) ;
		this.calculateRights() ;


		if (this.modeSearch) {
			this.jEl.find('.M_ModalDelete').hide() ;
			this.jEl.find('.M_ModalSave').html("Rechercher") ;

			$("#contactedit_co_avatar").hide() ;
			$("#contactedit_notforsearch").hide() ;
		} else {
			this.jEl.find('.M_ModalDelete').show() ;
			this.jEl.find('.M_ModalSave').html("Enregistrer") ;

			$("#contactedit_co_avatar").show() ;
			$("#contactedit_notforsearch").show() ;
		}

		// var tabTemp = this.form.getItemsByType(M_.Form.Number) ;
		// log("tabTemp",tabTemp)

		this.rightAllCheckboxs = 2 ;
		$("#contactedit_rightsbtall").html("Tout hériter du groupe de droits") ;

		if (!this.form.find('co_avatar_send')) {
			this.form.addItem({
				type: M_.Form.File,
				name: 'co_avatar_send',
				placeholder: "Avatar",
				label: "Avatar",
				labelPosition: 'left',
				labelWidth: 70,
				container: $("#contactedit_co_avatar")
			}) ;
		}

		if (Shared.canEditContactsRights(M_.App.Session)) {// || true
			$("#contactedit_rightscontainer").show() ;
			this.form.find('co_type').enable() ;
				this.form.find('co_login').enable() ;
				this.form.find('co_password').enable() ;
		} else {
			$("#contactedit_rightscontainer").hide() ;
			if (this.currentModel.get('co_id')==='') this.form.find('co_type').enable() ;
			else this.form.find('co_type').disable() ;
			if (Shared.canEditContact(M_.App.Session, this.currentModel.getData())) {
				this.form.find('co_login').enable() ;
				this.form.find('co_password').enable() ;
			} else {
				this.form.find('co_login').disable() ;
				this.form.find('co_password').disable() ;
			}
		}

		// if (Shared.canEditContactsRights(M_.App.Session, this.currentModel.getData())) {
		// 	this.form.find('co_login').enable() ;
		// 	this.form.find('co_password').enable() ;
		// } else {
		// 	if () {
		// 		this.form.find('co_login').disable() ;
		// 		this.form.find('co_password').disable() ;
		// 	} else {
		// 		this.form.find('co_login').disable() ;
		// 		this.form.find('co_password').disable() ;
		// 	}
		// }

		if (Shared.canViewAndEditBirthday(M_.App.Session, this.currentModel.getData())) {
			$("#contactedit_co_birthday").show() ;
		} else {
			$("#contactedit_co_birthday").hide() ;
		}

	}
	calculateRights() {
		// console.log("calculateRights");
		var rights = this.currentModel.get('co_rights') ;
		// console.log("rights",rights);
		var defaultRights = this.currentModel.get('defaultRights') ;
		_.each(Shared.getRights(), (right)=> {
			if (rights) {// && rights[right.key]
				var val = this.form.find('right_'+right.key).getValue() ;
				var ok = false ;
                if ((defaultRights && defaultRights[right.key] && val) || val===true) ok = true ;
				if (ok) $("#contactedit_rights_"+right.key).html("OUI").css('color','green') ;
				else $("#contactedit_rights_"+right.key).html("NON").css('color','red') ;
			} else {
				// $("#contactedit_rights_"+right.key).html("NON").css('color','red') ;
			}
		}) ;

	}
	editContact(model) {
		this.modeSearch = false ;
		this.currentModel = model ;
		// $("#contacts_details").transition({opacity:0}, 100, ()=> {
			// this.drawerSave.show() ;
			// this.modalForm = new M_.Modal({
			// 	focusOn: $("#contacts_details").parent()
			// }) ;
			// this.modalForm.show() ;
			// this.form.setValues(model) ;
			// log("model",model)
			// $("#contacts_details_content").hide() ;
			// $("#contacts_details_edit").show() ;
			// $("#contacts_details").transition({opacity:1}, 100);
			// this._beforeShowWin() ;
			this.form.setValues(model) ;
			this.initWinNow() ;

		// }) ;
	}
	setTitleWin() {
		if (this.modeSearch) {
			$("#contactedit_title").html("Recherche <b>sur les contacts</b>") ;
		} else {
			$("#contactedit_title").html("Contact <b>"+Shared.completeName({
				co_name: this.form.find('co_name').getValue(),
				co_firstname: this.form.find('co_firstname').getValue(),
				co_society: this.form.find('co_society').getValue(),
				co_civility: this.form.find('co_civility').getValue(),
			}, true)+"</b>") ;
		}
	}
	loadContact(co_id, callback, showWin=true) {
		// log("model.get('op_id')",model.get('op_id'), this.jEl.find('.M_ModalDelete'))
		this.form.load(co_id, null, ()=> {
			// this._beforeShowWin() ;
			if (callback) callback(this.currentModel) ;
			if (showWin) this.show(true) ;
		}) ;
		// this.dontShowWin = false ;
	}
	loadAndEditContact(co_id, callback) {
		// log("model.get('op_id')",model.get('op_id'), this.jEl.find('.M_ModalDelete'))
		this.form.load(co_id, null, ()=> {
			this.editContact(this.currentModel) ;
			if (callback) callback(this.currentModel) ;
			this.show(true) ;
		}) ;
		// this.dontShowWin = false ;
	}
	openWinKeywords(vals) {
		if (!this.winKeywords) {
			this.winKeywords = new (class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST.ContactsWinKeywords,
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
					this.store = new M_.Store({
						controller: this,
						model: MT_Keywords,
						url: "/1.0/keywords",
						limit: 200,
						currentSort: ['kw_name', 'asc'],
						listeners: [
							['update',(store, models)=> {
								var divKeywords = $("#winkeywords_keywords") ;
								divKeywords.empty() ;
								_.each(models, (model)=> {
									let selected = "" ;
									if (_.indexOf(this.value, model.get('kw_name'))>=0) selected="selected" ;
									let html = `<div class="M_ComboboxMultiItem ${selected}" data-kw-id="${model.get('kw_id')}">${model.get('kw_name')} <span class="fa fa-trash"></span></div>` ;
									let jEl = $(html) ;
									divKeywords.append(jEl) ;
									jEl.find('.fa-trash').click((evt)=> {
										M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce mot clé ?<br/>Il ne sera pas effacé des fiches contacts qui contiennent déjà ce mot clé", ()=> {
											this.form.delete($(evt.target).parent().attr('data-kw-id'), null, ()=> {
												this.drawKeywords() ;
											}) ;
										}) ;
									}) ;
									jEl.click((evt)=> {
										$(evt.target).toggleClass('selected') ;
									}) ;
								}) ;
							}]
						]
					}) ;
					this.form = new M_.Form.Form({
						url: '/1.0/keywords',
						model: MT_Keywords,
						controller: this,
						processData: function(data) {
						},
						// autoUnedit: false,
						listeners: [
							['load', (form, model)=> {
							}],
							['beforeSave', (form, args)=> {
								if (args.args.kw_name==='') return false ;
								if (args.args.kw_name.substr(0,1)!='#')
									args.args.kw_name = '#'+args.args.kw_name ;
							}],
							['save', (form, data)=> {
								// var val = form.find('kw_name').getValue() ;
								// if (substr(val,0,1)!='#')form.find('kw_name').setValue('#'+val) ;
								form.find('kw_name').setValue("") ;
								this.drawKeywords() ;
							}],
							['delete', (form, model)=> {
							}]
						],
						items: [
							{
								type: M_.Form.Text,
								name: 'kw_name',
								placeholder: "Nouveau mot clé",
								// label: "Nom",
								// labelPosition: 'top',
								container: $("#winkeywords_kw_name")
							}
						]
					}) ;
					$("#winkeywords_bt_add").click(()=> {
						this.form.save() ;
					}) ;
					$("#winkeywords_bt_close").click(()=> {
						this.hide() ;
					}) ;
					$("#winkeywords_bt_define").click(()=> {
						var sel = [] ;
						$("#winkeywords_keywords").find('.M_ComboboxMultiItem.selected').each((ind, jEl)=> {
							sel.push(_.trim($(jEl).text())) ;//'data-kw-id'
						}) ;
						// log("sel",sel.join('||'))
//						this.onDefine(sel) ;//'||'+sel.join('||')+'||'
						this.controller.form.find('co_keywords').setValue(sel) ;
						this.hide() ;
					}) ;
				}
				drawKeywords() {
					this.store.load() ;
				}
				setKeywords(vals) {
					this.value = vals ;
				}
			})() ;

		}
		this.winKeywords.controller = this ;
		this.winKeywords.setKeywords(vals) ;
		this.winKeywords.drawKeywords() ;
		this.winKeywords.show() ;
	}

}
