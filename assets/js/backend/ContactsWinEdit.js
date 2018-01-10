"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Contacts } from "./../../compiled/models/MT_Contacts.js";
import { MT_Keywords } from "./../../compiled/models/MT_Keywords.js";
import { MT_Addresses } from "./../../compiled/models/MT_Addresses.js";

export class ContactsWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/ContactsWinEdit.html"],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 900,
			_contactstodelete: []
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
		// log("this.jEl",this.jEl)
	}

	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new ContactsWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		this.form = new M_.Form.Form({
			url: "/1.0/contacts",
			// urls: {
			// 	findone: 'GET /1.0/contacts/findone',
			// 	create: 'POST /1.0/contacts/create',
			// 	update: 'PUT /1.0/contacts/update',
			// 	destroy: 'DELETE /1.0/contacts/destroy',
			// },
			model: MT_Contacts,
			controller: this,
			processData: function(data) {
				Services.processContactsData(data);
			},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						if (
							form.find("co_id").getValue() === "" &&
							form.find("co_password").getValue() === "" &&
							(form.find("co_type").getValue() == "user" ||
								form.find("co_type").getValue() == "commercial" ||
								form.find("co_type").getValue() == "secretary" ||
								form.find("co_type").getValue() == "director" ||
								form.find("co_type").getValue() == "admin")
						) {
							err.push({ key: "co_password", label: "Le mot de passe est vide" });
							return false;
						}
						if (form.find("co_name").getValue() === "" && form.find("co_society").getValue() === "") {
							err.push({ key: "co_name", label: "Vous devez indiquer un nom ou une société." });
							return false;
						}
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
					}
				],
				[
					"beforeSave",
					(form, args) => {
						// this.currentModel.get("contacts")
						let contacts = [];
						_.each(this.currentModel.get("contacts"), contact => {
							contacts.push(contact.co_id);
						});
						args.args.contacts = contacts;
						args.args.contactstodelete = this._contactstodelete;
					}
				],
				[
					"save",
					(form, data) => {
						if (this.controller.currentModelContact) this.controller.currentModelContact.set("co_id", data.data.co_id);
						this.currentModel.set("co_id", data.data.co_id);
						this.form.find("co_id").setValue(data.data.co_id);

						if (form.find("co_avatar_send").getValue() !== "") {
							M_.Utils.saveFiles(
								[form.find("co_avatar_send").jEl.get(0)],
								"/1.0/contacts/updateavatar",
								{ co_id: data.data.co_id },
								data => {
									form.deleteItem("co_avatar_send");
									Services.updateAvatar();
									this.checkMine();
									if (this.thenAction) {
										this.thenAction(data);
										this.thenAction = null;
									} else {
										if (this.controller.onSaveContactsWinEdit) this.controller.onSaveContactsWinEdit(data.data);
										this.hide();
									}
								}
							);
						} else {
							if (this.thenAction) {
								this.thenAction(data);
								this.thenAction = null;
							} else {
								if (this.controller.onSaveContactsWinEdit) this.controller.onSaveContactsWinEdit(data.data);
								this.hide();
							}
							this.checkMine();
						}
					}
				],
				[
					"delete",
					(form, model) => {
						// this.loadContact('-1') ;
						// this.contacts.store.reload() ;
						this.hide();
						if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit();
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
					container: $("#contactedit_co_name")
				},
				{
					type: M_.Form.Combobox,
					name: "co_type",
					editable: false,
					allowEmpty: false,
					placeholder: "",
					label: "Droit",
					labelPosition: "top",
					container: $("#contactedit_co_type"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getRoles() //!Shared.canEditContactsRights(M_.App.Session)
					}),
					listeners: [
						[
							"itemclick",
							(store, models) => {
								this.showHideLoginInfos();
								// if (this.form.find("co_function").getValue() === "")
								// 	this.form
								// 		.find("co_function")
								// 		.setValue(_.result(_.find(Shared.getRoles(), { key: this.form.find("co_type").getValue() }), "val"));
							}
						]
					]
				},
				// {
				// 	type: M_.Form.Checkbox,
				// 	name: "co_maintype",
				// 	container: $("#contactedit_co_maintype"),
				// 	label: "Société",
				// 	labelPosition: "right",
				// 	listeners: [
				// 		[
				// 			"change",
				// 			(tf, val) => {
				// 				// console.log("ooo", val);
				// 				this.showHideLoginInfos();
				// 			}
				// 		]
				// 	]
				// },
				{
					name: "co_name",
					placeholder: "",
					label: "Nom",
					labelPosition: "top",
					container: $("#contactedit_co_name"),
					allowEmpty: true,
					listeners: [
						[
							"update",
							(tf, val) => {
								this.setTitleWin();
							}
						]
					]
				},
				{
					type: M_.Form.Date,
					name: "co_birthday",
					placeholder: "JJ/MM/AAAA",
					label: "Date de naissance",
					labelPosition: "top",
					container: $("#contactedit_co_birthday"),
					allowEmpty: true
				},
				{
					name: "co_firstname",
					placeholder: "",
					label: "Prénom",
					labelPosition: "top",
					container: $("#contactedit_co_firstname"),
					allowEmpty: true,
					listeners: [
						[
							"update",
							(tf, val) => {
								this.setTitleWin();
							}
						]
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
				},
				{
					type: M_.Form.Combobox,
					name: "co_civility",
					useRawValue: true,
					placeholder: "",
					label: "Civilité",
					labelPosition: "top",
					container: $("#contactedit_co_civility"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: [
							{ key: "M", val: "M" },
							{ key: "Mme", val: "Mme" },
							{ key: "Mlle", val: "Mlle" },
							{ key: "Dr", val: "Dr" },
							{ key: "Me", val: "Me" },
							{ key: "Pr", val: "Pr" }
						]
					}),
					listeners: [
						[
							"itemclick",
							(tf, val) => {
								this.setTitleWin();
							}
						]
					]
				},
				{
					name: "co_society",
					label: "Société",
					labelPosition: "top",
					placeholder: "",
					container: $("#contactedit_co_society"),
					listeners: [
						[
							"update",
							(tf, val) => {
								this.setTitleWin();
							}
						]
					]
				},
				{
					type: M_.Form.Combobox,
					name: "co_function",
					label: "Fonction",
					labelPosition: "top",
					container: $("#contactedit_co_function"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/contacts/co_function"
					})
				},
				{
					name: "co_siret",
					placeholder: "",
					label: "Siret",
					labelPosition: "top",
					container: $("#contactedit_co_siret")
				},
				{
					name: "co_comptecollectif",
					placeholder: "",
					label: "Compte collectif",
					labelPosition: "top",
					container: $("#contactedit_co_comptecollectif")
				},
				{
					name: "co_comptecomptable",
					placeholder: "",
					label: "Compte comptable",
					labelPosition: "top",
					container: $("#contactedit_co_comptecomptable")
				},
				{
					name: "co_codetiers",
					placeholder: "",
					label: "Code tiers",
					labelPosition: "top",
					container: $("#contactedit_co_codetiers")
				},
				{
					name: "co_matricule",
					placeholder: "",
					label: "Numéro de matricule",
					labelPosition: "top",
					container: $("#contactedit_co_matricule")
				},

				{
					name: "co_vacations_acquisn1",
					placeholder: "",
					label: "Vacances acquises N-1",
					labelPosition: "top",
					container: $("#contactedit_co_vacations_acquisn1")
				},
				{
					name: "co_vacations_prisn1",
					placeholder: "",
					label: "Vacances prises N-1",
					labelPosition: "top",
					container: $("#contactedit_co_vacations_prisn1")
				},
				{
					name: "co_vacations_acquis",
					placeholder: "",
					label: "Vacances acquises",
					labelPosition: "top",
					container: $("#contactedit_co_vacations_acquis")
				},
				{
					name: "co_vacations_pris",
					placeholder: "",
					label: "Vacances prises",
					labelPosition: "top",
					container: $("#contactedit_co_vacations_pris")
				},

				{
					type: M_.Form.Number,
					name: "co_manpower",
					placeholder: "",
					label: "Effectif",
					labelPosition: "top",
					container: $("#contactedit_co_manpower")
				},
				{
					name: "co_code",
					placeholder: "",
					label: "Code société/Code ERP",
					labelPosition: "top",
					container: $("#contactedit_co_code")
				},
				{
					name: "co_naf",
					placeholder: "",
					label: "Code NAF",
					labelPosition: "top",
					container: $("#contactedit_co_naf")
				},
				{
					name: "co_ape",
					placeholder: "",
					label: "Code APE",
					labelPosition: "top",
					container: $("#contactedit_co_ape")
				},
				{
					type: M_.Form.Number,
					name: "co_sales",
					placeholder: "",
					label: "Chiffre d'affaire",
					labelPosition: "top",
					container: $("#contactedit_co_sales")
				},
				// {
				// 	type: M_.Form.Date,
				// 	name: "co_date_start_society",
				// 	placeholder: "",
				// 	label: "Employé depuis le",
				// 	labelPosition: "top",
				// 	container: $("#contactedit_co_date_start_society")
				// },
				// {
				// 	type: M_.Form.Date,
				// 	name: "co_date_end_society",
				// 	placeholder: "",
				// 	label: "Employé jusqu'au",
				// 	labelPosition: "top",
				// 	container: $("#contactedit_co_date_end_society")
				// },
				{
					type: M_.Form.Multi,
					name: "co_keywords",
					label: "Mots clés",
					container: $("#contactedit_co_keywords"),
					onClickBtAdd: (formEl, vals) => {
						this.openWinKeywords(vals);
					}
				},
				{
					name: "co_login",
					placeholder: "",
					label: "Login",
					labelPosition: "top",
					container: $("#contactedit_co_login")
				},
				{
					// type: M_.Form.Password,
					name: "co_password",
					placeholder: "6 caractère minimum",
					label: "Mot de passe",
					labelPosition: "top",
					minLength: 6,
					help: "Saisir un nombre, une manuscule, une minuscule, un caractère non alpha-numérique ($, &amp;, @, etc)",
					container: $("#contactedit_co_password")
				},
				{
					name: "co_email",
					placeholder: "eMail",
					label: "eMail procedePassword",
					labelWidth: 80,
					container: $("#contactedit_co_email")
				},
				{
					name: "co_email1",
					placeholder: "eMail",
					label: "eMail PRO",
					labelWidth: 80,
					container: $("#contactedit_co_email1")
				},
				{
					name: "co_email2",
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_email2")
				},
				{
					name: "co_email3",
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_email3")
				},
				{
					name: "co_emailperso1",
					placeholder: "eMail",
					label: "eMail PERSO",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso1")
				},
				{
					name: "co_emailperso2",
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso2")
				},
				{
					name: "co_emailperso3",
					placeholder: "eMail",
					label: "&nbsp;",
					labelWidth: 80,
					container: $("#contactedit_co_emailperso3")
				},
				{
					name: "co_tel1",
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "Téléphone",
					container: $("#contactedit_co_tel1")
				},
				{
					name: "co_tel2",
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#contactedit_co_tel2")
				},
				{
					name: "co_tel3",
					labelWidth: 80,
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#contactedit_co_tel3")
				},
				{
					name: "co_fax1",
					labelWidth: 80,
					placeholder: "Fax",
					label: "Fax",
					container: $("#contactedit_co_fax1")
				},
				{
					name: "co_fax2",
					labelWidth: 80,
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#contactedit_co_fax2")
				},
				{
					name: "co_fax3",
					labelWidth: 80,
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#contactedit_co_fax3")
				},
				{
					name: "co_mobile1",
					labelWidth: 80,
					placeholder: "Mobile",
					label: "Mobile",
					container: $("#contactedit_co_mobile1")
				},
				{
					name: "co_mobile2",
					labelWidth: 80,
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#contactedit_co_mobile2")
				},
				{
					name: "co_mobile3",
					labelWidth: 80,
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#contactedit_co_mobile3")
				},
				{
					type: M_.Form.Textarea,
					name: "co_comment",
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
				},
				{
					name: "co_color",
					placeholder: "Couleur",
					label: "Couleur",
					labelPosition: "top",
					container: $("#contactedit_co_color")
					// }, {
					// 	type: M_.Form.Checkbox,
					// 	name: 'co_receive_emailing',
					// 	placeholder: "Reçoit la mailinglist",
					// 	label: "Reçoit la mailinglist",
					// 	labelPosition: 'right',
					// 	container: $("#contactedit_co_receive_emailing")
				},
				{
					type: M_.Form.Combobox,
					name: "co_avatarauto",
					label: "...ou",
					labelPosition: "left",
					labelWidth: 70,
					container: $("#contactedit_co_avatarauto"),
					// useRawValue: true,
					dropdownOpts: {
						width: 410,
						drawEachItem: function(item, i, ul, items) {
							var htmlItem = `<li style="display:block; float:left; width:100px; height:100px; margin:0 2px 2px 0;"><img src='/images/avatar${
								item.text
							}.png' width='95' height='95' alt=''></li>`;
							var jElItem = $(htmlItem);
							// jElItem.data('indexitem', i) ;
							ul.append(jElItem);
							if (item.click && !item.disabled) {
								jElItem.click(
									{ fn: item },
									$.proxy(function(evt) {
										// var el = $(evt.target).closest('.M_DropdownMenu') ;
										evt.data.fn.click(evt, evt.data.fn);
										this.hide();
									}, this)
								);
							}
						}
					},
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Shared.getAvatarsAuto()
					})
				},
				{
					type: M_.Form.Picker,
					name: "co_linkedin",
					label: "LinkedIn",
					stylePicker: "font-size:17px;",
					icon: "fa fa-linkedin-square",
					hasDropdown: false,
					labelPosition: "left",
					labelWidth: 70,
					help: "Copier/coller le lien LinkedIn ici.<br>Peut contenir http:// ou pas",
					container: $("#contactedit_co_linkedin"),
					listeners: [
						[
							"clickpicker",
							(tf, val) => {
								if (tf.getValue()) window.open(M_.Utils.urlIze(tf.getValue()), "_blank");
							}
						]
					]
				},
				{
					type: M_.Form.Picker,
					icon: "fa fa-bitbucket",
					stylePicker: "font-size:17px;",
					hasDropdown: false,
					name: "co_viadeo",
					label: "Viadeo",
					labelPosition: "left",
					labelWidth: 70,
					help: "Copier/coller le lien Viadeo ici.<br>Peut contenir http:// ou pas",
					container: $("#contactedit_co_viadeo"),
					listeners: [
						[
							"clickpicker",
							(tf, val) => {
								if (tf.getValue()) window.open(M_.Utils.urlIze(tf.getValue()), "_blank");
							}
						]
					]
				},
				{
					name: "co_web1",
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web1")
				},
				{
					name: "co_web2",
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web2")
				},
				{
					name: "co_web3",
					placeholder: "Site web",
					label: "Site web",
					labelWidth: 80,
					help: "Saisir avec ou sans le http://",
					container: $("#contactedit_co_web3")
				},

				{
					name: "co_tvaintra",
					placeholder: "",
					label: "Code TVA Intracom",
					labelPosition: "top",
					container: $("#contactedit_co_tvaintra")
				},
				{
					type: M_.Form.Combobox,
					name: "co_representant",
					editable: false,
					allowEmpty: true,
					placeholder: "",
					label: "Représentant",
					labelPosition: "top",
					container: $("#contactedit_co_representant"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: [
							{ key: "1", val: "1 France Nord" },
							{ key: "3", val: "3 France Sud" },
							{ key: "2A", val: "2A Export Nord" },
							{ key: "2B", val: "2B Export Sud" },
							{ key: "4", val: "4 Carte" },
							{ key: "5", val: "5 Medical" }
						]
					}),
					listeners: [["itemclick", (store, models) => {}]]
				},
				{
					type: M_.Form.Combobox,
					name: "co_marche",
					label: "Marché",
					labelPosition: "top",
					container: $("#contactedit_co_marche"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/contacts/co_marche"
					})
				},
				{
					name: "co_tarif",
					placeholder: "",
					label: "Tarif",
					labelPosition: "top",
					container: $("#contactedit_co_tarif")
				},
				{
					type: M_.Form.Combobox,
					name: "co_activite",
					label: "Activité",
					labelPosition: "top",
					container: $("#contactedit_co_activite"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/contacts/co_activite"
					})
				},
				{
					name: "co_bank",
					placeholder: "",
					label: "Nom de la banque",
					labelPosition: "top",
					container: $("#contactedit_co_bank")
				},
				{
					name: "co_bank_iban",
					placeholder: "",
					label: "IBAN",
					labelPosition: "top",
					container: $("#contactedit_co_bank_iban")
				},
				{
					name: "co_bank_bic",
					placeholder: "",
					label: "BIC",
					labelPosition: "top",
					container: $("#contactedit_co_bank_bic")
				},
				{
					name: "co_rgtcompta",
					placeholder: "",
					label: "Mode RGT compta",
					labelPosition: "top",
					container: $("#contactedit_co_rgtcompta")
				},
				{
					name: "co_rgtmfg",
					placeholder: "",
					label: "Mode RGT sur MFG",
					labelPosition: "top",
					container: $("#contactedit_co_rgtmfg")
				}
			]
		});

		// this.controller = this ;

		$("#contactedit_btaddkeyword").click(() => {
			this.openWinKeywords();
		});

		$("#contactedit_btaddaddress").click(() => {
			this.saveContact(() => {
				this.openWinAddress("-1", this.currentModel.get("co_id"));
			});
		});
		$("#contactedit_addnewcontacts").click(() => {
			this.saveContact(() => {
				// this.openWinAddress("-1", this.currentModel.get("co_id"));
			});
		});
		this.jEl.find(".M_ModalSave").click(() => {
			if (this.modeSearch) this.search();
			else this.saveContact();
		});
		this.jEl.find(".M_ModalDelete").click(() => {
			this.deleteContact();
		});
		this.jEl.find(".M_ModalCancel").click(() => {
			if (this.controller.onCancelContactsWinEdit) this.controller.onCancelContactsWinEdit();
			this.hide();
		});

		var tabTemp = ["co_email", "co_emailperso", "co_tel", "co_mobile", "co_fax", "co_web"]; //,'co_address_liv', "co_address"
		for (let i = 0; i < tabTemp.length; i++) {
			for (let j = 1; j <= 3; j++) {
				this.form.find(tabTemp[i] + j).addListener("keyup", () => {
					this.showHideCoordinates(true);
				});
				this.form.find(tabTemp[i] + j).jEl.on("focus blur", () => {
					window.setTimeout(() => {
						this.showHideCoordinates(true);
					}, 100);
				});
			}
		}

		_.each(Shared.getRights(), right => {
			var v = false,
				indeterminate = true;
			this.form.addItem({
				type: M_.Form.Checkbox,
				name: "right_" + right.key,
				fakeGroup: "rightscheckboxs",
				threeStates: true,
				value: v,
				indeterminate: indeterminate,
				labelWidth: 300,
				labelPosition: "right",
				label: "<span style='display:inline-block; width:38px;' id='contactedit_rights_" + right.key + "'></span> " + right.label,
				autoContainer: $("#contactedit_rights"),
				listeners: [
					[
						"change",
						(store, models) => {
							this.calculateRights();
						}
					]
				]
			});
		});

		this.rightAllCheckboxs = 2;
		$("#contactedit_rightsbtall").click(() => {
			var ok = false;
			if (this.rightAllCheckboxs === 0) {
				ok = true;
				$("#contactedit_rightsbtall").html("Tout décocher");
			}
			if (this.rightAllCheckboxs == 1) {
				ok = false;
				$("#contactedit_rightsbtall").html("Tout hériter du groupe de droits");
			}
			if (this.rightAllCheckboxs == 2) {
				ok = 2;
				$("#contactedit_rightsbtall").html("Tout cocher");
			}
			var chks = this.form.getItemsByFakeGroup("rightscheckboxs");
			_.each(chks, chk => {
				chk.setValue(ok);
			});
			this.rightAllCheckboxs++;
			if (this.rightAllCheckboxs >= 3) this.rightAllCheckboxs = 0;
		});

		this.cb_addcontact = new M_.Form.Combobox({
			name: "co_id2",
			label: "Ajouter",
			labelPosition: "left",
			labelWidth: 80,
			placeholder: "",
			container: $("#contactedit_addcontacts"),
			modelKey: "co_id",
			modelValue: model => {
				return Shared.completeName(model.getData(), true);
			},
			allowEmpty: false,
			store: new M_.Store({
				controller: this,
				model: MT_Contacts,
				url: "/1.0/contacts",
				limit: 200,
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							if (this.currentModel.get("co_type") == "society") args.args.onlycontacts = "true";
							else args.args.onlysociety = "true";
						}
					]
				]
			}),
			listeners: [
				[
					"itemclick",
					(tf, model) => {
						M_.Utils.getJson("/1.0/contacts/" + model.get("co_id"), {}, data => {
							this.currentModel.get("contacts").push(data.data);
							this.drawContacts();
							tf.setValue("");
						});
					}
				]
			]
		});
	}

	checkMine() {
		if (this.currentModel.get("co_id") == M_.App.Session.co_id) {
			M_.Dialog.alert(
				"Information",
				"Votre fiche a été sauvegardée.<br/><br/><b>Le programme doit être redémarré pour prendre en compte les modifications.</b>",
				() => {
					window.open("/", "_self");
				}
			);
		}
	}
	showHideLoginInfos() {
		if (!this.form) return;
		$("#contactedit_rightscontainer").hide();
		if (this.form.find("co_type").getValue() == "society") {
			$(".contactedit_pansociety").show();
			$(".contactedit_pancontact").hide();
			$("#contactedit_contactstitle").html("Contacts associés");
		} else {
			$(".contactedit_pansociety").hide();
			$(".contactedit_pancontact").show();
			$("#contactedit_contactstitle").html("Sociétés associés");
		}

		if (Shared.isUser(this.form.find("co_type").getValue())) {
			$(".contactedit_panuser").show();
		} else {
			$(".contactedit_panuser").hide();
		}

		if (Shared.canEditContactsRights(M_.App.Session)) {
			this.form.find("co_type").enable();
			this.form.find("co_login").enable();
			this.form.find("co_password").enable();
		} else {
			if (this.currentModel.get("co_id") === "") this.form.find("co_type").enable();
			else this.form.find("co_type").disable();
			if (Shared.canEditContact(M_.App.Session, this.currentModel.getData())) {
				this.form.find("co_login").enable();
				this.form.find("co_password").enable();
			} else {
				this.form.find("co_login").disable();
				this.form.find("co_password").disable();
			}
		}

		if (Shared.canViewAndEditBirthday(M_.App.Session, this.currentModel.getData())) {
			$("#contactedit_co_birthday").show();
		} else {
			$("#contactedit_co_birthday").hide();
		}

		// if ((this.form.find("co_type").getValue() != "contact" && this.form.find("co_type").getValue() != "customer") || this.modeSearch) {
		// 	$("#contactedit_panuser").fadeIn();
		// 	$("#contactedit_panuser2").fadeOut();
		// } else {
		// 	$("#contactedit_panuser").fadeOut();
		// 	$("#contactedit_panuser2").fadeIn();
		// }
	}
	showHideCoordinates(anim = false) {
		var tabTemp = ["co_email", "co_emailperso", "co_tel", "co_mobile", "co_fax", "co_web"]; //, 'co_address_liv', "co_address"
		for (let i = 0; i < tabTemp.length; i++) {
			let previousFilled = true;
			for (let j = 1; j <= 3; j++) {
				let val = this.form.find(tabTemp[i] + j).getValue();
				if (
					(!this.modeSearch && (val !== "" || previousFilled || this.form.find(tabTemp[i] + j).jEl.is(":focus"))) ||
					(this.modeSearch && j == 1)
				) {
					if (anim) $("#contactedit_" + tabTemp[i] + j).slideDown();
					else $("#contactedit_" + tabTemp[i] + j).show();
				} else {
					if (anim) $("#contactedit_" + tabTemp[i] + j).slideUp();
					else $("#contactedit_" + tabTemp[i] + j).hide();
				}
				// log("tabTemp[i]+j).jEl.is(':focus')",this.form.find(tabTemp[i]+j).jEl.is(':focus'))
				if (val !== "" && this.form.find(tabTemp[i] + j).jEl.is(":focus")) previousFilled = true;
				else previousFilled = false;
			}
		}
	}
	newContact(type = "-1") {
		this.loadContact(type, () => {
			this.editContact(this.currentModel);
		});
	}
	deleteContact() {
		if (this.currentModel.get("deleted")) {
			M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir à nouveau activer ce contact ?", () => {
				M_.Utils.getJson("/1.0/contacts/undestroy/" + this.currentModel.get("co_id"), { deleted: false }, () => {
					this.hide();
					if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit();
				});
			});
		} else {
			M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce contact ?", () => {
				this.form.delete(this.currentModel.get("co_id"), null, () => {
					if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit();
				});
			});
		}
	}
	saveContact(cb) {
		this.thenAction = cb;
		// console.log("savecon");
		this.form.validAndSave();
	}
	searchContacts() {
		this.modeSearch = true;
		// this._beforeShowWin() ;
		this.form.reset();
		this.currentModel.set("co_id", "");
		this.currentModel.set("rights", null);
		this.initWinNow();
	}

	search() {
		this.controller.completeSearch();
	}
	initWinNow() {
		if (this.currentModel.get("co_id")) {
			this.jEl.find(".M_ModalDelete").prop("disabled", false);
		} else {
			this.jEl.find(".M_ModalDelete").prop("disabled", true);
		}
		if (this.currentModel.get("deleted")) {
			this.jEl.find(".M_ModalDelete").html("Ré-activer");
		} else {
			this.jEl.find(".M_ModalDelete").html("Supprimer");
		}

		$("#contactedit_co_avatar").hide();
		$("#contactedit_co_avatarauto").hide();

		this.show(true);
		this.showHideCoordinates(false);
		this.showHideLoginInfos();
		this.setTitleWin();

		var rights = this.currentModel.get("co_rights");
		_.each(Shared.getRights(), right => {
			if (rights && rights[right.key]) {
				this.form.find("right_" + right.key).setValue(rights[right.key]);
			}
		});
		this.calculateRights();

		if (this.modeSearch) {
			this.jEl.find(".M_ModalDelete").hide();
			this.jEl.find(".M_ModalSave").html("Rechercher");

			// $("#contactedit_co_avatar").hide();
			$("#contactedit_notforsearch").hide();
		} else {
			this.jEl.find(".M_ModalDelete").show();
			this.jEl.find(".M_ModalSave").html("Enregistrer");

			// $("#contactedit_co_avatar").show();
			$("#contactedit_notforsearch").show();
		}

		// var tabTemp = this.form.getItemsByType(M_.Form.Number) ;
		// log("tabTemp",tabTemp)

		this.rightAllCheckboxs = 2;
		$("#contactedit_rightsbtall").html("Tout hériter du groupe de droits");

		if (!this.form.find("co_avatar_send")) {
			this.form.addItem({
				type: M_.Form.File,
				name: "co_avatar_send",
				placeholder: "Avatar",
				label: "Avatar",
				labelPosition: "left",
				labelWidth: 70,
				container: $("#contactedit_co_avatar")
			});
		}

		this._contactstodelete = [];
		this.drawAddresses();
		this.drawContacts();
	}

	drawContacts() {
		$("#contactedit_contacts").empty();
		let html = "";
		_.each(this.currentModel.get("contacts"), row_co => {
			// let name = Shared.completeName(row_co, true);
			let idtemp1 = M_.Utils.id();
			// let dc = Services.drawContact(row_co);
			html = `<div style='border-bottom:1px solid #ddd; padding:5px 0;' id="${idtemp1}"></div>`;
			$("#contactedit_contacts").append(html);

			M_.App.renderMustacheTo($("#" + idtemp1), JST["assets/templates/backend/ContactsInfos.html"], {
				row_co: row_co,
				canModify: true,
				withName: true
			});
			$("#" + idtemp1 + " .contactsinfos-trash").show();
			$("#" + idtemp1 + " .contactsinfos-trash span").on("click", { co_id: row_co.co_id }, evt => {
				this._contactstodelete.push(evt.data.co_id);
				_.remove(this.currentModel.get("contacts"), c => {
					if (c.co_id == evt.data.co_id) return true;
					return false;
				});
				this.drawContacts();
			});
		});
	}
	loadAddresses() {
		M_.Utils.getJson("/1.0/addresses", { co_id: this.currentModel.get("co_id") }, data => {
			this.currentModel.set("addresses", data.data);
			this.drawAddresses();
		});
	}
	drawAddresses() {
		$("#contactedit_addresses").empty();
		let html = "";
		_.each(this.currentModel.get("addresses"), row_ad => {
			let address = Shared.completeAddress(row_ad, false, true);
			let idtemp1 = M_.Utils.id();
			html = `
			<div style='border-bottom:1px solid #ddd; padding:5px 0;'>
				<div id='${idtemp1}' style='float:right; cursor:pointer;'><span class='fa fa-edit'></span></div>
				<div><b>${row_ad.ad_label}</b></div>
				<div>${address}</div>
			</div>
			`;
			$("#contactedit_addresses").append(html);
			$("#" + idtemp1).on("click", { ad_id: row_ad.ad_id }, evt => {
				this.openWinAddress(evt.data.ad_id);
			});
		});
	}
	calculateRights() {
		// console.log("calculateRights");
		var rights = this.currentModel.get("co_rights");
		// console.log("rights",rights);
		var defaultRights = this.currentModel.get("defaultRights");
		_.each(Shared.getRights(), right => {
			if (rights) {
				// && rights[right.key]
				var val = this.form.find("right_" + right.key).getValue();
				var ok = false;
				if ((defaultRights && defaultRights[right.key] && val) || val === true) ok = true;
				if (ok)
					$("#contactedit_rights_" + right.key)
						.html("OUI")
						.css("color", "green");
				else
					$("#contactedit_rights_" + right.key)
						.html("NON")
						.css("color", "red");
			} else {
				// $("#contactedit_rights_"+right.key).html("NON").css('color','red') ;
			}
		});
	}
	editContact(model) {
		this.modeSearch = false;
		this.currentModel = model;
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
		this.form.setValues(model);
		this.initWinNow();

		// }) ;
	}
	setTitleWin() {
		if (this.modeSearch) {
			$("#contactedit_title").html("Recherche <b>sur les contacts</b>");
		} else {
			$("#contactedit_title").html(
				"<b>" +
					Shared.completeName(
						{
							co_name: this.form.find("co_name").getValue(),
							co_firstname: this.form.find("co_firstname").getValue(),
							co_society: this.form.find("co_society").getValue(),
							co_civility: this.form.find("co_civility").getValue()
						},
						true
					) +
					"</b>"
			);
		}
	}
	loadContact(co_id, callback, showWin = true) {
		// log("model.get('op_id')",model.get('op_id'), this.jEl.find('.M_ModalDelete'))
		this.form.load(co_id, null, () => {
			// this._beforeShowWin() ;
			if (callback) callback(this.currentModel);
			if (showWin) this.show(true);
		});
		// this.dontShowWin = false ;
	}
	loadAndEditContact(co_id, callback) {
		// log("model.get('op_id')",model.get('op_id'), this.jEl.find('.M_ModalDelete'))
		this.form.load(co_id, null, () => {
			this.editContact(this.currentModel);
			if (callback) callback(this.currentModel);
			this.show(true);
		});
		// this.dontShowWin = false ;
	}
	openWinKeywords(vals) {
		if (!this.winKeywords) {
			this.winKeywords = new class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST.ContactsWinKeywords,
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
					this.store = new M_.Store({
						controller: this,
						model: MT_Keywords,
						url: "/1.0/keywords",
						limit: 200,
						currentSort: ["kw_name", "asc"],
						listeners: [
							[
								"update",
								(store, models) => {
									var divKeywords = $("#winkeywords_keywords");
									divKeywords.empty();
									_.each(models, model => {
										let selected = "";
										if (_.indexOf(this.value, model.get("kw_name")) >= 0) selected = "selected";
										let html = `<div class="M_ComboboxMultiItem ${selected}" data-kw-id="${model.get("kw_id")}">${model.get(
											"kw_name"
										)} <span class="fa fa-trash"></span></div>`;
										let jEl = $(html);
										divKeywords.append(jEl);
										jEl.find(".fa-trash").click(evt => {
											M_.Dialog.confirm(
												"Confirmation effacement",
												"Etes-vous certain de vouloir supprimer ce mot clé ?<br/>Il ne sera pas effacé des fiches contacts qui contiennent déjà ce mot clé",
												() => {
													this.form.delete(
														$(evt.target)
															.parent()
															.attr("data-kw-id"),
														null,
														() => {
															this.drawKeywords();
														}
													);
												}
											);
										});
										jEl.click(evt => {
											$(evt.target).toggleClass("selected");
										});
									});
								}
							]
						]
					});
					this.form = new M_.Form.Form({
						url: "/1.0/keywords",
						model: MT_Keywords,
						controller: this,
						processData: function(data) {},
						// autoUnedit: false,
						listeners: [
							["load", (form, model) => {}],
							[
								"beforeSave",
								(form, args) => {
									if (args.args.kw_name === "") return false;
									if (args.args.kw_name.substr(0, 1) != "#") args.args.kw_name = "#" + args.args.kw_name;
								}
							],
							[
								"save",
								(form, data) => {
									// var val = form.find('kw_name').getValue() ;
									// if (substr(val,0,1)!='#')form.find('kw_name').setValue('#'+val) ;
									form.find("kw_name").setValue("");
									this.drawKeywords();
								}
							],
							["delete", (form, model) => {}]
						],
						items: [
							{
								type: M_.Form.Text,
								name: "kw_name",
								placeholder: "Nouveau mot clé",
								// label: "Nom",
								// labelPosition: 'top',
								container: $("#winkeywords_kw_name")
							}
						]
					});
					$("#winkeywords_bt_add").click(() => {
						this.form.save();
					});
					$("#winkeywords_bt_close").click(() => {
						this.hide();
					});
					$("#winkeywords_bt_define").click(() => {
						var sel = [];
						$("#winkeywords_keywords")
							.find(".M_ComboboxMultiItem.selected")
							.each((ind, jEl) => {
								sel.push(_.trim($(jEl).text())); //'data-kw-id'
							});
						// log("sel",sel.join('||'))
						//						this.onDefine(sel) ;//'||'+sel.join('||')+'||'
						this.controller.form.find("co_keywords").setValue(sel);
						this.hide();
					});
				}
				drawKeywords() {
					this.store.load();
				}
				setKeywords(vals) {
					this.value = vals;
				}
			}();
		}
		this.winKeywords.controller = this;
		this.winKeywords.setKeywords(vals);
		this.winKeywords.drawKeywords();
		this.winKeywords.show();
	}
	openWinAddress(ad_id, co_id) {
		if (!this.winAddress) {
			this.winAddress = new class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST["assets/templates/backend/ContactsWinAddress.html"],
						// tplData: {},
						modal: true,
						// controller: this,
						width: 600
					};
					opts = opts ? opts : {};
					var optsTemp = $.extend({}, defaults, opts);
					super(optsTemp);
					// log("this.jEl",this.jEl)
				}
				create() {
					super.create();
					this.form = new M_.Form.Form({
						url: "/1.0/addresses",
						model: MT_Addresses,
						controller: this,
						processData: function(data) {},
						// autoUnedit: false,
						listeners: [
							[
								"load",
								(form, model) => {
									this.currentModel = model;
									this.show();
								}
							],
							[
								"beforeLoad",
								(form, args) => {
									args.args.co_id = this.co_id;
								}
							],
							[
								"save",
								(form, data) => {
									this.hide();
									this.controller.loadAddresses();
								}
							],
							[
								"delete",
								(form, model) => {
									this.hide();
								}
							]
						],
						items: [
							{
								type: M_.Form.Hidden,
								name: "ad_id",
								container: $("#contactswinaddress_ad_label")
							},
							{
								type: M_.Form.Hidden,
								name: "co_id",
								container: $("#contactswinaddress_ad_label")
							},
							{
								type: M_.Form.Text,
								name: "ad_label",
								label: "Intitulé de l'adresse",
								placeholder: "Siège, Facturation, Livraison, etc...",
								container: $("#contactswinaddress_ad_label"),
								allowEmpty: false
							},
							{
								type: M_.Form.Text,
								name: "ad_address1",
								label: "Adresse",
								placeholder: "Adresse 1",
								container: $("#contactswinaddress_ad_address1"),
								allowEmpty: false
							},
							{
								type: M_.Form.Text,
								name: "ad_address2",
								placeholder: "Adresse 2",
								container: $("#contactswinaddress_ad_address2")
							},
							{
								type: M_.Form.Text,
								name: "ad_address3",
								placeholder: "Adresse 3",
								container: $("#contactswinaddress_ad_address3")
							},
							{
								type: M_.Form.Text,
								name: "ad_zip",
								placeholder: "Code postal",
								container: $("#contactswinaddress_ad_zip"),
								allowEmpty: false
							},
							{
								type: M_.Form.Combobox,
								name: "ad_country",
								placeholder: "Pays",
								container: $("#contactswinaddress_ad_country"),
								useRawValue: true,
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									url: "/1.0/combo/addresses/ad_country"
								}),
								allowEmpty: false
							},
							{
								type: M_.Form.Text,
								name: "ad_city",
								placeholder: "Ville",
								container: $("#contactswinaddress_ad_city"),
								allowEmpty: false
							}
						]
					});
					this.jEl.find(".contactswinaddress_bt_save").click(() => {
						this.form.validAndSave();
					});
					this.jEl.find(".contactswinaddress_bt_cancel").click(() => {
						this.hide();
					});
					this.jEl.find(".contactswinaddress_bt_delete").click(() => {
						M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir effacer cette adresse ?", () => {
							this.form.delete(this.currentModel.get("ad_id"));
						});
					});
				}
				initWinNow(ad_id, co_id) {
					this.co_id = co_id;
					this.form.load(ad_id);
				}
			}({
				controller: this
			});
		}
		this.winAddress.initWinNow(ad_id, co_id);
	}
}
