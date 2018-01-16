"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Candidates } from "./../../compiled/models/MT_Candidates.js";

export class CandidatesWinEdit extends M_.Window {
	constructor(opts) {
		var defaults = {
			tpl: JST["assets/templates/backend/CandidatesWinEdit.html"],
			// tplData: {},
			modal: true,
			// controller: this,
			width: 900
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
		// log("this.jEl",this.jEl)
	}

	// static _instance = null ;
	static getInstance(controller) {
		if (!this._instance) this._instance = new CandidatesWinEdit({ controller: controller });
		this._instance.controller = controller;
		return this._instance;
	}

	create() {
		super.create();

		var commercialsTypes = Shared.getCommercialsType();
		commercialsTypes.unshift({ key: 0, val: "Aucune évolution sur contrat" });

		this.form = new M_.Form.Form({
			url: "/1.0/candidates",
			model: MT_Candidates,
			controller: this,
			validBeforeSave: true,
			processData: function(data) {
				// if (data.co_id) {
				// 	data.co_name = data.co_id.co_name ;
				// 	data.co_firstname = data.co_id.co_firstname ;
				// 	// data.ag_id = data.co_id.ag_id ;
				// 	data.co_civility = data.co_id.co_civility ;
				// 	data.co_keywords = data.co_id.co_keywords ;
				// 	var tabTemp = ['co_email','co_tel','co_mobile','co_fax','co_address'] ;//,'co_web'
				// 	_.each(tabTemp, (field) => {
				// 		for(let i=1 ; i<=3 ; i++) {
				// 			data[field+i] = data.co_id[field+i] ;
				// 		}
				// 	}) ;
				// 	data.co_country = data.co_id.co_country ;
				// 	data.co_zip = data.co_id.co_zip ;
				// 	data.co_city = data.co_id.co_city ;
				// 	data.co_country = data.co_id.co_country ;
				// 	data.co_linkedin = data.co_id.co_linkedin ;
				// 	data.co_viadeo = data.co_id.co_viadeo ;
				// }
			},
			listeners: [
				[
					"valid",
					(form, ok, err) => {
						return true;
					}
				],
				[
					"load",
					(form, model) => {
						this.currentModel = model;
						this.setGoodUnity(this.currentModel.get("ca_ca_type"));
						if (this.controller.onLoadCandidatesWinEdit) this.controller.onLoadCandidatesWinEdit();
					}
				],
				[
					"save",
					(form, data) => {
						this.hide();
						if (this.controller.onSaveCandidatesWinEdit) this.controller.onSaveCandidatesWinEdit();
					}
				],
				[
					"delete",
					(form, model) => {
						if (this.controller.onDeleteCandidatesWinEdit) this.controller.onDeleteCandidatesWinEdit();
					}
				]
			],
			itemsDefaults: {
				type: M_.Form.Text,
				labelPosition: "left",
				labelWidth: 100
			},
			items: [
				{
					type: M_.Form.Hidden,
					name: "ca_id",
					container: $("#candidateswinedit_ca_name")
					// }, {
					// 	type: M_.Form.Hidden,
					// 	name: 'co_id',
					// 	container: $("#candidateswinedit_co_name")
				},
				{
					type: M_.Form.Date,
					name: "ca_birthday",
					placeholder: "",
					label: "Naissance",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_birthday")
				},
				{
					name: "ca_name",
					placeholder: "",
					label: "Nom",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_name"),
					listeners: [
						[
							"update",
							(tf, val) => {
								this.setTitleWin();
							}
						]
					],
					allowEmpty: false
				},
				{
					name: "ca_firstname",
					placeholder: "",
					label: "Prénom",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_firstname"),
					listeners: [
						[
							"update",
							(tf, val) => {
								this.setTitleWin();
							}
						]
					],
					allowEmpty: false
				},
				// {
				// 	type: M_.Form.Combobox,
				// 	name: "ag_id",
				// 	label: "Agence",
				// 	labelPosition: "top",
				// 	placeholder: "",
				// 	container: $("#candidateswinedit_ag_id"),
				// 	modelKey: "ag_id",
				// 	modelValue: "ag_name",
				// 	store: new M_.Store({
				// 		controller: this,
				// 		model: MT_Agencies,
				// 		url: "/1.0/agencies",
				// 		limit: 200
				// 	})
				// },
				{
					type: M_.Form.Combobox,
					name: "ca_civility",
					useRawValue: true,
					placeholder: "",
					label: "Civilité",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_civility"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabCivility()
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
					type: M_.Form.Picker,
					name: "ca_linkedin",
					label: "LinkedIn",
					stylePicker: "font-size:17px;",
					icon: "fa fa-linkedin-square",
					hasDropdown: false,
					labelPosition: "top",
					help: "Copier/coller le lien LinkedIn ici.<br>Peut contenir http:// ou pas",
					container: $("#candidateswinedit_ca_linkedin"),
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
					name: "ca_viadeo",
					label: "Viadeo",
					labelPosition: "top",
					help: "Copier/coller le lien Viadeo ici.<br>Peut contenir http:// ou pas",
					container: $("#candidateswinedit_ca_viadeo"),
					listeners: [
						[
							"clickpicker",
							(tf, val) => {
								if (tf.getValue()) window.open(M_.Utils.urlIze(tf.getValue()), "_blank");
							}
						]
					]

					// }, {
					// 	type: M_.Form.Multi,
					// 	name: 'ca_keywords',
					// 	label: "Mots clés",
					// 	container: $("#candidateswinedit_ca_keywords"),
					// 	onClickBtAdd: (formEl, vals)=> {
					// 		this.openWinKeywords(vals) ;
					// 	}
				},
				{
					name: "ca_email1",
					placeholder: "eMail",
					label: "eMail PERSO",
					container: $("#candidateswinedit_ca_email1")
				},
				{
					name: "ca_email2",
					placeholder: "eMail",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_email2")
				},
				{
					name: "ca_email3",
					placeholder: "eMail",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_email3")
				},
				{
					name: "ca_tel1",
					placeholder: "Téléphone",
					label: "Téléphone",
					container: $("#candidateswinedit_ca_tel1")
				},
				{
					name: "ca_tel2",
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_tel2")
				},
				{
					name: "ca_tel3",
					placeholder: "Téléphone",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_tel3")
				},
				{
					name: "ca_fax1",
					placeholder: "Fax",
					label: "Fax",
					container: $("#candidateswinedit_ca_fax1")
				},
				{
					name: "ca_fax2",
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_fax2")
				},
				{
					name: "ca_fax3",
					placeholder: "Fax",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_fax3")
				},
				{
					name: "ca_mobile1",
					placeholder: "Mobile",
					label: "Mobile",
					container: $("#candidateswinedit_ca_mobile1")
				},
				{
					name: "ca_mobile2",
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_mobile2")
				},
				{
					name: "ca_mobile3",
					placeholder: "Mobile",
					label: "&nbsp;",
					container: $("#candidateswinedit_ca_mobile3")
					// }, {
					// 	name: 'ca_web1',
					// 	placeholder: "Site web",
					// 	label: "Site web",
					// 	help: "Saisir avec ou sans le http://",
					// 	container: $("#candidateswinedit_ca_web1")
					// }, {
					// 	name: 'ca_web2',
					// 	placeholder: "Site web",
					// 	label: "Site web",
					// 	help: "Saisir avec ou sans le http://",
					// 	container: $("#candidateswinedit_ca_web2")
					// }, {
					// 	name: 'ca_web3',
					// 	placeholder: "Site web",
					// 	label: "Site web",
					// 	help: "Saisir avec ou sans le http://",
					// 	container: $("#candidateswinedit_ca_web3")
				},
				{
					name: "ca_address1",
					placeholder: "Adresse 1",
					container: $("#candidateswinedit_ca_address1")
				},
				{
					name: "ca_address2",
					placeholder: "Adresse 2",
					container: $("#candidateswinedit_ca_address2")
				},
				{
					name: "ca_address3",
					placeholder: "Adresse 3",
					container: $("#candidateswinedit_ca_address3")
				},
				{
					name: "ca_zip",
					placeholder: "Code postal",
					container: $("#candidateswinedit_ca_zip")
				},
				{
					name: "ca_country",
					placeholder: "Pays",
					container: $("#candidateswinedit_ca_country")
				},
				{
					name: "ca_city",
					placeholder: "Ville",
					container: $("#candidateswinedit_ca_city")

					// }, {
					// 	name: 'ca_company',
					// 	label: "Société",
					// 	labelPosition: 'top',
					// 	container: $("#candidateswinedit_ca_company")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_company",
					label: "Société",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_company"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/candidates/ca_company"
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_group",
					label: "Groupe",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_group"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/candidates/ca_group"
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_post",
					label: "Poste",
					labelPosition: "top",
					editable: false,
					allowEmpty: false,
					useZeroIfEmpty: true,
					container: $("#candidateswinedit_ca_post"),
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabPost()
					})
				},
				{
					name: "ca_city2",
					label: "Ville/agence",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_city")
				},
				{
					name: "ca_type",
					label: "Typologie",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_type")
					// type: M_.Form.Combobox,
					// name: 'ca_type',
					// label: "Typologie",
					// labelPosition: 'top',
					// container: $("#candidateswinedit_ca_type"),
					// editable: false,
					// useZeroIfEmpty: true,
					// store: new M_.Store({
					// 	controller: this,
					// 	model: M_.ModelKeyVal,
					// 	rows: Services.getTabTypology()
					// })
				},
				{
					type: M_.Form.Number,
					name: "ca_experienceyears",
					label: "Nb année exp.",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_experienceyears")
				},
				{
					type: M_.Form.Number,
					name: "ca_salary",
					label: "Salaire brut",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_salary"),
					listeners: [
						[
							"update",
							(outlet, val) => {
								this.updateCalculateSalary();
							}
						]
					]
				},
				{
					type: M_.Form.Number,
					name: "ca_prims",
					label: "Primes",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_prims")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_nbhours",
					label: "Base horaire",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_nbhours"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabNbHours()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_salaryvariable",
					label: "Salaire var. sur",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_salaryvariable"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabSalaryVariable()
					})
				},
				{
					name: "ca_purcent",
					label: "Taux de %",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_purcent")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_13months",
					label: "Nb mois",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_13months"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTab13Month()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_dfs",
					label: "DFS",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_dfs"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabDFS()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_car",
					label: "Déplacement",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_car"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabCar()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_meal",
					label: "Repas / TR",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_meal"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabMeal()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_insurance",
					label: "Mutuelle",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_insurance"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabInsurance()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_participation",
					label: "Participation",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_participation"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabParticipation()
					})
				},
				{
					name: "ca_planning",
					placeholder: "nb postes",
					label: "Planning",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_planning")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_software",
					label: "Logiciel",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_software"),
					useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						url: "/1.0/combo/candidates/ca_software"
					})
				},
				{
					type: M_.Form.Text,
					name: "ca_clause",
					label: "Clause non c.",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_clause")
					// editable: false,
					// useZeroIfEmpty: true,
					// store: new M_.Store({
					// 	controller: this,
					// 	model: M_.ModelKeyVal,
					// 	rows: Services.getTabClause()
					// })
				},
				{
					name: "ca_agency",
					label: "Si création d'une agence...",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_agency"),
					allowEmpty: true
				},
				{
					type: M_.Form.Combobox,
					name: "ca_posttotake",
					label: "Poste à pourvoir",
					labelPosition: "top",
					editable: false,
					container: $("#candidateswinedit_ca_posttotake"),
					allowEmpty: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabPost()
					})
				},
				{
					type: M_.Form.Number,
					name: "ca_salaryproposed",
					label: "Salaire proposé",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_salaryproposed"),
					listeners: [
						[
							"update",
							(outlet, val) => {
								this.updateCalculateSalary();
							}
						]
					]
				},
				{
					type: M_.Form.Number,
					decimalLength: 2,
					name: "ca_variableproposed",
					label: "Variable proposé",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_variableproposed")
				},
				{
					type: M_.Form.Number,
					name: "ca_salarymaintains",
					label: "Maintien salaire",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_salarymaintains")
				},
				{
					type: M_.Form.Number,
					name: "ca_salarymaintainstime",
					label: "Durée",
					addon: "mois",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_salarymaintainstime")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_ca_type",
					label: "Type",
					labelPosition: "top",
					editable: false,
					// labelWidth: 120,
					container: $("#candidateswinedit_ca_ca_type"),
					// useRawValue: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: commercialsTypes
					}),
					listeners: [
						[
							"itemclick",
							(store, model) => {
								// console.log("arguments",store, models);
								this.setGoodUnity(model.get("key"));
							}
						]
					]
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate1",
					label: "Palier 1",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate1")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary1",
					label: "Salaire 1",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary1")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm1",
					label: "Commentaire 1",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm1")
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate2",
					label: "Palier 2",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate2")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary2",
					label: "Salaire 2",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary2")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm2",
					label: "Commentaire 2",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm2")
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate3",
					label: "Palier 3",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate3")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary3",
					label: "Salaire 3",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary3")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm3",
					label: "Commentaire 3",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm3")
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate4",
					label: "Palier 4",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate4")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary4",
					label: "Salaire 4",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary4")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm4",
					label: "Commentaire 4",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm4")
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate5",
					label: "Palier 5",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate5")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary5",
					label: "Salaire 5",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary5")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm5",
					label: "Commentaire 5",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm5")
				},
				{
					type: M_.Form.Number,
					name: "ca_evodate6",
					label: "Palier 6",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evodate6")
				},
				{
					type: M_.Form.Number,
					name: "ca_evosalary6",
					label: "Salaire 6",
					labelPosition: "top",
					addon: "€",
					container: $("#candidateswinedit_ca_evosalary6")
				},
				{
					type: M_.Form.Text,
					name: "ca_evocomm6",
					label: "Commentaire 6",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_evocomm6")
				},
				{
					type: M_.Form.Textarea,
					label: "Points positifs",
					labelPosition: "top",
					name: "ca_positivepoints",
					container: $("#candidateswinedit_ca_positivepoints")
				},
				{
					type: M_.Form.Textarea,
					label: "Points négatifs",
					labelPosition: "top",
					name: "ca_negativepoints",
					container: $("#candidateswinedit_ca_negativepoints")
				},
				{
					type: M_.Form.Textarea,
					label: "Autres avantages",
					labelPosition: "top",
					name: "ca_otheravantages",
					height: 50,
					container: $("#candidateswinedit_ca_otheravantages")
				},
				{
					type: M_.Form.Textarea,
					label: "Commentaires",
					labelPosition: "top",
					name: "ca_comments",
					height: 50,
					container: $("#candidateswinedit_ca_comments")
				},
				{
					name: "ca_secretary",
					label: "Profil secrétaire agence",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_secretary")
				},
				{
					name: "ca_contractprorh",
					label: "Contrat pro RH",
					labelPosition: "top",
					container: $("#candidateswinedit_ca_contractprorh")
				},
				{
					type: M_.Form.Combobox,
					name: "ca_cv",
					label: "Récupération CV",
					labelPosition: "top",
					useZeroIfEmpty: true,
					container: $("#candidateswinedit_ca_cv"),
					editable: false,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabBdd()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_customercopy",
					label: "Copie client",
					labelPosition: "top",
					useZeroIfEmpty: true,
					container: $("#candidateswinedit_ca_customercopy"),
					editable: false,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabBdd()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_bdd",
					label: "Récup. BDD",
					labelPosition: "top",
					useZeroIfEmpty: true,
					container: $("#candidateswinedit_ca_bdd"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTabBdd()
					})
				},
				{
					type: M_.Form.Combobox,
					name: "ca_13monthsproposed",
					label: "Nb mois",
					labelPosition: "top",
					useZeroIfEmpty: true,
					container: $("#candidateswinedit_ca_13monthsproposed"),
					editable: false,
					useZeroIfEmpty: true,
					store: new M_.Store({
						controller: this,
						model: M_.ModelKeyVal,
						rows: Services.getTab13Month()
					})
				}
			]
		});
		// this.form.disable() ;
		// this.controller = this ;

		// $("#candidateswinedit_btaddkeyword").click(()=> {
		// 	this.openWinKeywords() ;
		// }) ;

		$("#candidateswinedit_bt_save").click(() => {
			this.form.validAndSave();
		});
		$("#candidateswinedit_bt_delete").click(() => {
			this.deleteCandidate();
		});
		$("#candidateswinedit_bt_cancel").click(() => {
			if (this.controller.onCancelCandidatesWinEdit) this.controller.onCancelCandidatesWinEdit();
			this.hide();
		});

		var tabTemp = ["ca_email", "ca_tel", "ca_mobile", "ca_fax", "ca_address"]; //,'ca_address_liv','ca_web'
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
	}
	setGoodUnity(unity, initialize) {
		var ok = "%";
		if (unity * 1 == 1 || unity * 1 == 4) {
			ok = "€";
		}
		for (var i = 1; i <= 6; i++) {
			this.form.find("ca_evosalary" + i).changeAddon(ok);
			if (initialize) {
				// this.form.find('co_ca_sal_stage'+i).setValue(0) ;
			}
		}
		if (unity * 1 === 0) $("#candidateswinedit_evolution").slideUp();
		else $("#candidateswinedit_evolution").slideDown();
	}

	showHideCoordinates(anim = false) {
		var tabTemp = ["ca_email", "ca_tel", "ca_mobile", "ca_fax", "ca_address"]; //, 'ca_address_liv','ca_web'
		for (let i = 0; i < tabTemp.length; i++) {
			let previousFilled = true;
			for (let j = 1; j <= 3; j++) {
				let val = this.form.find(tabTemp[i] + j).getValue();
				if (
					(!this.modeSearch && (val !== "" || previousFilled || this.form.find(tabTemp[i] + j).jEl.is(":focus"))) ||
					(this.modeSearch && j == 1)
				) {
					if (anim) $("#candidateswinedit_" + tabTemp[i] + j).slideDown();
					else $("#candidateswinedit_" + tabTemp[i] + j).show();
				} else {
					if (anim) $("#candidateswinedit_" + tabTemp[i] + j).slideUp();
					else $("#candidateswinedit_" + tabTemp[i] + j).hide();
				}
				// log("tabTemp[i]+j).jEl.is(':focus')",this.form.find(tabTemp[i]+j).jEl.is(':focus'))
				if (val !== "" && this.form.find(tabTemp[i] + j).jEl.is(":focus")) previousFilled = true;
				else previousFilled = false;
			}
		}
	}
	newCandidate() {
		this.loadCandidate("-1", () => {
			this.editCandidate(this.currentModel);
		});
	}
	deleteCandidate() {
		M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce candidat ?", () => {
			this.form.delete(this.currentModel.get("ca_id"), null, () => {
				if (this.controller.onDeleteContactsWinEdit) this.controller.onDeleteContactsWinEdit();
			});
		});
	}
	initWinNow() {
		if (this.currentModel.get("ca_id")) {
			$("#candidateswinedit_bt_delete").prop("disabled", false);
		} else {
			$("#candidateswinedit_bt_delete").prop("disabled", true);
		}

		this.show(true);
		this.showHideCoordinates(false);
		this.setTitleWin();
		this.updateCalculateSalary();
	}
	editCandidate(model) {
		this.modeSearch = false;
		this.currentModel = model;
		this.form.setValues(model);
		this.initWinNow();
	}
	setTitleWin() {
		$("#candidateswinedit_title").html(
			"Edition d'une candidature <b>" +
				Shared.completeName(
					{
						ca_name: this.form.find("ca_name").getValue(),
						ca_firstname: this.form.find("ca_firstname").getValue(),
						// ca_society: this.form.find('ca_society').getValue(),
						ca_civility: this.form.find("ca_civility").getValue()
					},
					true
				) +
				"</b>"
		);
	}
	loadCandidate(ca_id, callback, showWin = true) {
		this.form.load(ca_id, null, () => {
			if (callback) callback(this.currentModel);
			if (showWin) this.editCandidate(this.currentModel);
		});
	}
	updateCalculateSalary() {
		$("#candidateswinedit_calculsalary").html(Services.calculateAugmentationSalary(this.form.getValues()));
	}
	// 	openWinKeywords(vals) {
	// 		if (!this.winKeywords) {
	// 			this.winKeywords = new (class extends M_.Window {
	// 				constructor(opts) {
	// 					var defaults = {
	// 						tpl: JST.WinKeywords,
	// 						// tplData: {},
	// 						modal: true,
	// 						// controller: this,
	// 						width: 400,
	// 					} ;
	// 					opts = (opts)?opts:{} ;
	// 					var optsTemp = $.extend({}, defaults, opts) ;
	// 					super(optsTemp) ;
	// 					// log("this.jEl",this.jEl)
	// 				}
	// 				create() {
	// 					super.create() ;
	// 					this.store = new M_.Store({
	// 						controller: this,
	// 						model: MT_Keywords,
	// 						url: "/1.0/keywords",
	// 						limit: 200,
	// 						currentSort: ['kw_name', 'asc'],
	// 						listeners: [
	// 							['update',(store, models)=> {
	// 								var divKeywords = $("#winkeywords_keywords") ;
	// 								divKeywords.empty() ;
	// 								_.each(models, (model)=> {
	// 									let selected = "" ;
	// 									if (_.indexOf(this.value, model.get('kw_name'))>=0) selected="selected" ;
	// 									let html = `<div class="M_ComboboxMultiItem ${selected}" data-kw-id="${model.get('kw_id')}">${model.get('kw_name')} <span class="fa fa-trash"></span></div>` ;
	// 									let jEl = $(html) ;
	// 									divKeywords.append(jEl) ;
	// 									jEl.find('.fa-trash').click((evt)=> {
	// 										M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce mot clé ?<br/>Il ne sera pas effacé des fiches contacts qui contiennent déjà ce mot clé", ()=> {
	// 											this.form.delete($(evt.target).parent().attr('data-kw-id'), null, ()=> {
	// 												this.drawKeywords() ;
	// 											}) ;
	// 										}) ;
	// 									}) ;
	// 									jEl.click((evt)=> {
	// 										$(evt.target).toggleClass('selected') ;
	// 									}) ;
	// 								}) ;
	// 							}]
	// 						]
	// 					}) ;
	// 					this.form = new M_.Form.Form({
	// 						url: '/1.0/keywords',
	// 						model: MT_Keywords,
	// 						controller: this,
	// 						processData: function(data) {
	// 						},
	// 						// autoUnedit: false,
	// 						listeners: [
	// 							['load', (form, model)=> {
	// 							}],
	// 							['beforeSave', (form, args)=> {
	// 								if (args.args.kw_name==='') return false ;
	// 								if (args.args.kw_name.substr(0,1)!='#')
	// 									args.args.kw_name = '#'+args.args.kw_name ;
	// 							}],
	// 							['save', (form, data)=> {
	// 								// var val = form.find('kw_name').getValue() ;
	// 								// if (substr(val,0,1)!='#')form.find('kw_name').setValue('#'+val) ;
	// 								form.find('kw_name').setValue("") ;
	// 								this.drawKeywords() ;
	// 							}],
	// 							['delete', (form, model)=> {
	// 							}]
	// 						],
	// 						items: [
	// 							{
	// 								type: M_.Form.Text,
	// 								name: 'kw_name',
	// 								placeholder: "Nouveau mot clé",
	// 								// label: "Nom",
	// 								// labelPosition: 'top',
	// 								container: $("#winkeywords_kw_name")
	// 							}
	// 						]
	// 					}) ;
	// 					$("#winkeywords_bt_add").click(()=> {
	// 						this.form.save() ;
	// 					}) ;
	// 					$("#winkeywords_bt_close").click(()=> {
	// 						this.hide() ;
	// 					}) ;
	// 					$("#winkeywords_bt_define").click(()=> {
	// 						var sel = [] ;
	// 						$("#winkeywords_keywords").find('.M_ComboboxMultiItem.selected').each((ind, jEl)=> {
	// 							sel.push(_.trim($(jEl).text())) ;//'data-kw-id'
	// 						}) ;
	// 						// log("sel",sel.join('||'))
	// //						this.onDefine(sel) ;//'||'+sel.join('||')+'||'
	// 						this.container.form.find('ca_keywords').setValue(vals) ;
	// 						this.hide() ;
	// 					}) ;
	// 				}
	// 				drawKeywords() {
	// 					this.store.load() ;
	// 				}
	// 				setKeywords(vals) {
	// 					this.value = vals ;
	// 				}
	// 			})() ;
	//
	// 		}
	// 		this.winKeywords.setKeywords(vals) ;
	// 		this.winKeywords.drawKeywords() ;
	// 		this.winKeywords.show() ;
	// 	}
}
