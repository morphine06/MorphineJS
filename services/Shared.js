'use strict';

module.exports = {
    canCreateContact: function(user) {
        var rights = user.rights ;
        return rights.contacts_mine ;
    },
    canExportContact: function (user) {
        var rights = user.rights ;
        return rights.contacts_export ;
    },
    canViewAndEditBirthday: function (user, row_co) {
        var rights = user.rights ;
		if (row_co.co_id==user.co_id || rights.contacts_rightsusers) return true ;
		return false ;
	},
    canEditPreferencesRights: function(user) {
        var rights = user.rights ;
        // return true ;
        return rights.preferences_rights ;
    },
    canEditContactsRights: function (user, row_co) {
		var rights = user.rights ;
		return rights.contacts_rightsusers ;
	},
    canImportContact: function (user) {
        var rights = user.rights ;
		return rights.contacts_import ;
	},
    canModifyContact: function (user, row_co) {
		var rights = user.rights ;
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

    getRoles: function(onlyContact){
 		var tab = [
 			{ key: 'contact', val: 'Contact', isContact:true},
 			{ key: 'customer', val: 'Client', isContact:true},
 			{ key: '', val: '----------', isContact:false},
            { key: 'user', val: 'Utilisateur', isContact:false},
 			{ key: 'secretary', val: 'Assistant(e)', isContact:false},
            { key: 'director', val: 'Directeur', isContact:false},
 			{ key: ' ', val: '----------', isContact:false},
 			{ key: 'admin', val: 'Administrateur', isContact:false},
 		] ;
        if (onlyContact) {
            return _.filter(tab, {isContact:true}) ;
        }
        return tab ;
     },


     getRights: function() {
    		return [
 			{ key: 'login', label: "Authentification > Accéder au backoffice" },

 			{ key: 'contacts', label: "Contacts > Accéder au module" },
 			{ key: 'contacts_mine', label: "Contacts > Créer/modifier MES contacts" },
 			{ key: 'contacts_modifycontacts', label: "Contacts > Modifier tous les contacts" },
            { key: 'contacts_modifyusers', label: "Contacts > Modifier tous les utilisateurs (danger !!!)" },
            { key: 'contacts_rightsusers', label: "Contacts > Modifier les droits des utilisateurs" },

 			{ key: 'contacts_viewalltodos', label: "Contacts > Voir le “travail à faire“ de tous les utilsateurs" },

 			{ key: 'contacts_export', label: "Contacts > Exporter les contacts" },
 			{ key: 'contacts_import', label: "Contacts > Importer les contacts" },

 			{ key: 'preferences_shared', label: "Préférences > Accéder aux préférences partagées" },
 			{ key: 'preferences_rights', label: "Préférences > Accéder aux droits (danger !!!)" },
 			{ key: 'preferences_logs', label: "Préférences > Accéder aux logs" },
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

} ;