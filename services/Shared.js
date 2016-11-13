'use strict';

module.exports = {
    completeAddress: function (row_co, withLink, useBR) {
		let lineend = '\n' ;
		if (useBR) lineend = '<br/>' ;
		// if (row_co instanceof M_.Model) row_co = row_co.getData() ;
		var html = "" ;
		if (withLink) {
			var link = row_co.co_address1+" "+row_co.co_address2+" "+row_co.co_address2+" "+row_co.co_zip+" "+row_co.co_city+" "+row_co.co_country ;
			html += "<a href=\"http://maps.google.com/?q="+link+"\" target='_blank'>" ;
		}
		if (row_co.co_address1) html += ""+row_co.co_address1+lineend ;
		if (row_co.co_address2) html += ""+row_co.co_address2+lineend ;
		if (row_co.co_address3) html += ""+row_co.co_address3+lineend ;
		if (row_co.co_zip || row_co.co_city || row_co.co_country) html += ""+row_co.co_zip+" "+row_co.co_city+" "+row_co.co_country+lineend ;
		if (withLink) html += "</a>" ;
		return html ;
	},

	completeName: function(row_co, withSociety) {
		// console.log("row_co", row_co);
		if (!row_co)  return "" ;
		var res = "" ;
		// console.log("this.getUserRight('persoinvertname')", this.getUserRight('persoinvertname'));
		if (row_co.co_name) res += row_co.co_name.toUpperCase() ;
		if (row_co.co_firstname && row_co.co_name) res += " " ;
		if (row_co.co_firstname) res += _.capitalize(row_co.co_firstname) ;
		if (withSociety && !_.isEmpty(row_co.co_society)) {
			let more = '' ;
			if (res) more = " | "+res ;
			res = _.capitalize(row_co.co_society)+more ;
		}
		return res ;
	},
    canCreateContact: function(user) {
        var rights = user.optionsRights ;
        return rights.contacts_export ;
    },
    canExportContact: function (user) {
        var rights = user.optionsRights ;
        return rights.contacts_export ;
    },
    canViewAndModifyBirthday: function (row_co, user) {
        var rights = user.co_rights ;
		if (row_co.co_id==user.co_id || rights.contacts_rightsusers) return true ;
		return false ;
	},
    canModifyRights: function (row_co, user) {
		var rights = user.co_rights ;
		return rights.contacts_rightsusers ;
	},
    canImportContact: function (user) {
        var rights = user.co_rights ;
		return rights.contacts_import ;
	},
    canModifyContact: function (row_co, user) {
		var rights = user.co_rights ;
		if (
			row_co.co_id==user.co_id
		) return true ;
		if (
			rights.contacts_mine &&
			row_co.createdCo &&
			row_co.createdCo.co_id==user.co_id
		) return true ;
		if (
			rights.contacts_modifycontacts &&
			// row_co.ag_id &&
			// row_co.ag_id.ag_id == user.ag_id.ag_id &&
			this.agencyInAgency(row_co.agencies, user.agencies) &&
			(row_co.co_type=='contact' || row_co.co_type=='candidate')
		) return true ;
		if (
			rights.contacts_modifyusers &&
			// row_co.ag_id &&
			// row_co.ag_id.ag_id == user.ag_id.ag_id &&
			this.agencyInAgency(row_co.agencies, user.agencies) &&
			(row_co.co_type!='contact' && row_co.co_type!='candidate')
		) return true ;
		if (
			rights.contacts_modifyallcontacts &&
			(row_co.co_type=='contact' || row_co.co_type=='candidate')
		) return true ;
		if (
			rights.contacts_modifyallusers &&
			(row_co.co_type!='contact' && row_co.co_type!='candidate')
		) return true ;
		return false ;

	},

    getRoles: function(){
 		return [
 			{ key: 'contact', val: 'Contact'},
 			{ key: 'customer', val: 'Client'},
 			// { key: 'candidate', val: 'Candidat'},
 			{ key: '', val: '----------'},
 			{ key: 'director', val: 'Responsable agence'},
 			{ key: 'commercial', val: "Chargé(e) affaires"},
 			{ key: 'accountant', val: 'Chargé(e) recrutement'},
 			{ key: 'secretary', val: 'Assistant(e)'},
 			{ key: ' ', val: '----------'},
 			{ key: 'user', val: 'Utilisateur'},
 			{ key: 'admin', val: 'Administrateur'},
 		] ;
     },

     getRights: function() {
    		return [
 			{ key: 'login', label: "Authentification > Accéder à l'ERP" },

 			{ key: 'contacts', label: "Contacts > Accéder au module" },
 			{ key: 'contacts_seecontacts', label: "Contacts > Voir les contacts de mon agence" },
 			{ key: 'contacts_mine', label: "Contacts > Créer/modifier MES contacts" },
 			{ key: 'contacts_modifycontacts', label: "Contacts > Modifier les contacts de mon agence" },
 			{ key: 'contacts_modifyusers', label: "Contacts > Modifier les utilisateurs de mon agence (danger !!!)" },

 			{ key: 'contacts_seeallcontacts', label: "Contacts > Voir TOUS les contacts (des autres agences)" },
 			{ key: 'contacts_modifyallcontacts', label: "Contacts > Modifier TOUS les contacts (des autres agences)" },
 			{ key: 'contacts_seeallusers', label: "Contacts > Voir TOUS les utilisateurs (des autres agences)" },
 			{ key: 'contacts_modifyallusers', label: "Contacts > Modifier TOUS les utilisateurs (des autres agences)" },
 			{ key: 'contacts_rightsusers', label: "Contacts > Modifier les droits des utilisateurs (Danger !!!)" },

 			{ key: 'contacts_agency', label: "Contacts > Modifier mon agence" },
 			{ key: 'contacts_agencies', label: "Contacts > Créer/modifier les agences" },
 			{ key: 'contacts_viewagencytodos', label: "Contacts > Voir le “travail à faire“ des utilisateurs de mon agence" },
 			{ key: 'contacts_viewalltodos', label: "Contacts > Voir le “travail à faire“ de tous les utilsateurs" },


 			{ key: 'contacts_export', label: "Contacts > Exporter les contacts" },
 			{ key: 'contacts_import', label: "Contacts > Importer les contacts" },


 			{ key: 'vacation', label: "Absences > Accéder au module" },
 			{ key: 'vacation_forothers', label: "Absences > Créer/modifier pour les utilisateurs de mon agence" },
 			{ key: 'vacation_admin', label: "Absences > Vue administrateur" },
 			{ key: 'vacation_director', label: "Absences > Valide au nom du responsable les absences" },
 			{ key: 'vacation_supervisor', label: "Absences > Valide au nom du siège les absences" },

 			{ key: 'reports', label: "Rapport hebdo > Accéder au module Rapport hebdo" },
 			{ key: 'reports_admin', label: "Rapport hebdo > Vue administrateur" },
 			{ key: 'reports_incharge', label: "Rapport hebdo > Responsable de la saisie des rapports hebdomadaire" },

 			{ key: 'monthlyreports', label: "Rapport mensuel > Accéder au module Rapport mensuel" },
 			{ key: 'monthlyreports_admin', label: "Rapport mensuel > Vue administrateur" },

 			{ key: 'humanresources', label: "Ressources humaines > Accéder au module" },

 			{ key: 'commercials', label: "Paliers des chargés d'affaires > Accéder au module" },

 			{ key: 'invoices', label: "Factures proforma > Accéder au module" },
 			{ key: 'invoices_admin', label: "Factures proforma > Vue administrateur" },

 			{ key: 'expenses', label: "Notes de frais > Accéder au module" },
 			{ key: 'expenses_admin', label: "Notes de frais > Vue administrateur" },
 			{ key: 'expenses_export1', label: "Notes de frais > Peut exporter pour les banques" },
 			{ key: 'expenses_export2', label: "Notes de frais > Peut exporter en compta" },
 			{ key: 'expenses_export3', label: "Notes de frais > Peut exporter voitures" },

 			// { key: 'preferences_perso', label: "Préférences > Accéder aux préférences personnelles" },
 			{ key: 'preferences_shared', label: "Préférences > Accéder aux préférences partagées" },
 			{ key: 'preferences_rights', label: "Préférences > Accéder aux droits (danger !!!)" },
 			{ key: 'preferences_quotations', label: "Préférences > Accéder aux citations" },
 			{ key: 'preferences_vacationtypes', label: "Préférences > Accéder aux types d'absences" },
 			{ key: 'preferences_logs', label: "Préférences > Accéder aux logs" },
 			{ key: 'preferences_expenses', label: "Préférences > Accéder aux types de notes de frais" },
 			{ key: 'preferences_kilometers', label: "Préférences > Accéder aux indemnités kilométriques" },
 			{ key: 'preferences_entity', label: "Préférences > Accéder aux entités" },
 			{ key: 'preferences_documents', label: "Préférences > Accéder aux documents PDF" },


 		] ;
 	},
    getAvatarsAuto: function() {
		return [
			{key: 'avatar01.png', val: "01"},
			{key: 'avatar02.png', val: "02"},
			{key: 'avatar03.png', val: "03"},
			{key: 'avatar04.png', val: "04"},
			{key: 'avatar05.png', val: "05"},
			{key: 'avatar06.png', val: "06"},
			{key: 'avatar07.png', val: "07"},
			{key: 'avatar08.png', val: "08"},
			{key: 'avatar09.png', val: "09"},
			{key: 'avatar10.png', val: "10"},
			{key: 'avatar11.png', val: "11"},
			{key: 'avatar12.png', val: "12"},
			{key: 'avatar13.png', val: "13"},
			{key: 'avatar14.png', val: "14"},
			{key: 'avatar15.png', val: "15"},
			{key: 'avatar16.png', val: "16"},
		] ;
	},
} ;