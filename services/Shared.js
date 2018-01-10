"use strict";

module.exports = {
	getContactEmail: row_co => {
		if (!row_co) return "";
		if (row_co.co_email1) return row_co.co_email1;
		if (row_co.co_email2) return row_co.co_email2;
		if (row_co.co_email3) return row_co.co_email3;
		if (row_co.co_emailperso1) return row_co.co_emailperso1;
		if (row_co.co_emailperso2) return row_co.co_emailperso2;
		if (row_co.co_emailperso3) return row_co.co_emailperso3;
		return "";
	},
	canModifyVacation: user => {
		return true;
	},
	canValidVacationLikeDirector: user => {
		return true;
	},
	canValidVacationLikeSiege: user => {
		return true;
	},
	canSeeAllUsersForVacation: user => {
		return true;
	},
	canCreateContact: user => {
		var rights = user.rights;
		return rights.contacts_mine;
	},
	canExportContact: function(user) {
		var rights = user.rights;
		return rights.contacts_export;
	},
	canViewAndEditBirthday: function(user, row_co) {
		var rights = user.rights;
		if (row_co.co_id == user.co_id || rights.contacts_seebirthday) return true;
		return false;
	},
	canEditPreferencesRights: function(user) {
		var rights = user.rights;
		// return true ;
		return rights.preferences_rights;
	},
	canEditContactsRights: function(user) {
		var rights = user.rights;
		return rights.contacts_modifyusers;
	},
	canImportContact: function(user) {
		var rights = user.rights;
		return rights.contacts_import;
	},
	canEditContact: function(user, row_co) {
		var rights = user.rights;
		if (row_co.co_id == user.co_id) return true;
		if (rights.contacts_mine && row_co.createdCo && row_co.createdCo.co_id == user.co_id && _.find(this.getRoles(true), { key: row_co.co_type }))
			return true;
		if (rights.contacts_modifycontacts && _.find(this.getRoles(true), { key: row_co.co_type })) return true;
		if (rights.contacts_modifyusers && !_.find(this.getRoles(true), { key: row_co.co_type })) return true;
		return false;
	},
	isUser: function(co_type) {
		let roels = Shared.getRoles();
		let r = _.find(roels, { key: co_type });
		if (r && !r.isContact) return true;
		return false;
	},

	getRoles: function(onlyContact) {
		var tab = [
			{ key: "contact", val: "Contact", isContact: true },
			{ key: "society", val: "Société", isContact: true },
			{ key: "", val: "----------", isContact: false },
			{ key: "user", val: "Utilisateur", isContact: false },
			{ key: "secretary", val: "Assistant(e)", isContact: false },
			{ key: "director", val: "Directeur", isContact: false },
			{ key: " ", val: "----------", isContact: false },
			{ key: "admin", val: "Administrateur", isContact: false }
		];
		if (onlyContact) {
			return _.filter(tab, { isContact: true });
		}
		return tab;
	},

	getRights: function() {
		return [
			{ key: "login", label: "Authentification > Accéder au backoffice" },

			{ key: "contacts", label: "Contacts > Accéder au module" },
			{ key: "contacts_mine", label: "Contacts > Créer/modifier MES contacts" },
			{ key: "contacts_modifycontacts", label: "Contacts > Modifier tous les contacts" },
			{ key: "contacts_modifyusers", label: "Contacts > Modifier tous les utilisateurs (danger !!!)" },
			{ key: "contacts_seebirthday", label: "Contacts > Voir les âges" },

			{ key: "contacts_viewalltodos", label: "Contacts > Voir le “travail à faire“ de tous les utilsateurs" },

			{ key: "contacts_export", label: "Contacts > Exporter les contacts" },
			{ key: "contacts_import", label: "Contacts > Importer les contacts" },

			{ key: "preferences_shared", label: "Préférences > Accéder aux préférences partagées" },
			{ key: "preferences_rights", label: "Préférences > Accéder aux droits (danger !!!)" },
			{ key: "preferences_logs", label: "Préférences > Accéder aux logs" },
			{ key: "preferences_documents", label: "Préférences > Accéder aux documents PDF" }
		];
	},
	getAvatarsAuto: function() {
		return [
			{ key: "avatar01.png", val: "01" },
			{ key: "avatar02.png", val: "02" },
			{ key: "avatar03.png", val: "03" },
			{ key: "avatar04.png", val: "04" },
			{ key: "avatar05.png", val: "05" },
			{ key: "avatar06.png", val: "06" },
			{ key: "avatar07.png", val: "07" },
			{ key: "avatar08.png", val: "08" },
			{ key: "avatar09.png", val: "09" },
			{ key: "avatar10.png", val: "10" },
			{ key: "avatar11.png", val: "11" },
			{ key: "avatar12.png", val: "12" },
			{ key: "avatar13.png", val: "13" },
			{ key: "avatar14.png", val: "14" },
			{ key: "avatar15.png", val: "15" },
			{ key: "avatar16.png", val: "16" }
		];
	},
	completeAddress: function(row_co, withLink, useBR) {
		let lineend = "\n";
		if (useBR) lineend = "<br/>";
		// if (row_co instanceof M_.Model) row_co = row_co.getData() ;
		var html = "";
		if (withLink) {
			var link =
				row_co.co_address1 +
				" " +
				row_co.co_address2 +
				" " +
				row_co.co_address2 +
				" " +
				row_co.co_zip +
				" " +
				row_co.co_city +
				" " +
				row_co.co_country;
			html += '<a href="http://maps.google.com/?q=' + link + "\" target='_blank'>";
		}
		if (row_co.co_address1) html += "" + row_co.co_address1 + lineend;
		if (row_co.co_address2) html += "" + row_co.co_address2 + lineend;
		if (row_co.co_address3) html += "" + row_co.co_address3 + lineend;
		if (row_co.co_zip || row_co.co_city || row_co.co_country)
			html += "" + row_co.co_zip + " " + row_co.co_city + " " + row_co.co_country + lineend;
		if (withLink) html += "</a>";
		return html;
	},

	getCallResults: function(mytype) {
		var tab = [
			{ key: 0, val: "A répondu", icon: "fa-telephon" },
			{ key: 1, val: "A rappeler", icon: "fa-telephon" },
			{ key: 2, val: "Ne souhaite pas répondre", icon: "fa-telephon" }
		];
		if (mytype) {
			return _.find(tab, { key: mytype });
		}
		return tab;
	},
	isDayWorked: function(dString) {
		var tabDaysNotWorkedTxt =
			"2011-04-24, 2011-04-25, 2011-07-14, 2011-08-15, 2011-11-01, 2011-11-11, 2011-12-25, 2012-01-01, 2012-04-08, 2012-04-09, 2012-05-01, 2012-05-08, 2012-05-17, 2012-05-27, 2012-07-14, 2012-08-15, 2012-11-01, 2012-11-18, 2012-12-25, 2013-01-01, 2013-04-01, 2013-05-01, 2013-05-08, 2013-05-09, 2013-07-14, 2013-08-15, 2013-11-01, 2013-11-11, 2013-12-25, 2014-01-01, 2014-04-21, 2014-05-01, 2014-05-08, 2014-05-29, 2014-06-09, 2014-07-14, 2014-08-15, 2014-11-01, 2014-11-11, 2014-12-25, 2015-01-01, 2015-04-06, 2015-05-01, 2015-05-08, 2015-05-14, 2015-07-14, 2015-08-15, 2015-11-01, 2015-11-11, 2015-12-25, 2016-01-01, 2016-03-28, 2016-05-01, 2016-05-08, 2016-05-05, 2016-07-14, 2016-08-15, 2016-11-01, 2016-11-11, 2016-12-25, 2017-01-01, 2017-04-17, 2017-05-01, 2017-05-08, 2017-05-25, 2017-07-14, 2017-08-15, 2017-11-01, 2017-11-11, 2017-12-25, 2018-01-01, 2018-04-02, 2018-05-01, 2018-05-10, 2018-05-20, 2018-05-08, 2018-07-14, 2018-08-15, 2018-11-01, 2018-11-11, 2018-12-25, 2019-01-01, 2019-04-22, 2019-05-01, 2019-05-08, 2019-05-30, 2019-06-10, 2019-07-14, 2019-08-15, 2019-11-01, 2019-11-11, 2019-12-25, 2020-01-01, 2020-04-13, 2020-05-01, 2020-05-08, 2020-05-21, 2020-06-01, 2020-07-14, 2020-08-15, 2020-11-01, 2020-11-11, 2020-12-25, 2021-01-01"; //, 2017-06-05
		var tabDaysNotWorkedOK = [];
		var tabDaysNotWorked = tabDaysNotWorkedTxt.split(",");
		for (var i = 0; i < tabDaysNotWorked.length; i++) {
			tabDaysNotWorkedOK.push(tabDaysNotWorked[i].trim());
		}
		var dayNotWorked = false;
		if (tabDaysNotWorkedOK.indexOf(dString) >= 0) dayNotWorked = true;
		return !dayNotWorked;
	},
	getNbOpenDays: function(v1, v2, v1bis, v2bis, notUseSaturday) {
		// log("v1",v1)
		// log("v2",v2)
		// log("v1bis",v1bis)
		// log("v2bis",v2bis)
		var nbDays = 0;
		var vCurrent = moment(v1).startOf("day");
		while (vCurrent.isBefore(v2) || vCurrent.isSame(v2)) {
			var dayNotWorked = !this.isDayWorked(vCurrent.format("YYYY-MM-DD"));

			if (vCurrent.day() !== 0 && !dayNotWorked) {
				if (!notUseSaturday) nbDays++;
				else if (vCurrent.day() != 6) nbDays++;
			}

			vCurrent.add(1, "day");
		}
		if (v1bis) nbDays -= 0.5;
		if (v2bis) nbDays -= 0.5;
		return nbDays;
	},
	getVaStatus: function() {
		return [
			{ key: "vacations_waiting", val: "Attente de validation", short: "Attente", color: "bg_col5" },
			{ key: "vacations_accepted", val: "Accepté par le responsable", short: "Accepté", color: "bg_col2" },
			// { key: 1, val: "Validé par le siège", short: "Validé", color: "bg_col2" },
			{ key: "vacations_refused", val: "Refusé par le responsable", short: "Refusé", color: "bg_col3" }
			// { key: 2, val: "Refusé par le siège", short: "Refusé", color: "bg_col3" },
			// { key: 3, val: "Exporté", short: "Exporté", color: "bg_col4" }
		];
	},
	getInvoiceType: function(mytype) {
		var tab = [
			{ key: "estimate", val: "Devis", icon: "fa-telephon" },
			{ key: "purchaseorder", val: "Bon de commande", icon: "fa-telephon" },
			{ key: "invoice", val: "Facture", icon: "fa-telephon" }
		];
		if (mytype) {
			let t = _.find(tab, { key: mytype });
			// console.log("t", t);
			return t;
		}
		return tab;
	},
	getCampaignType: function(mytype) {
		var tab = [{ key: "mailinglist", val: "Mailinglist", icon: "fa-telephon" }, { key: "sms", val: "SMS", icon: "fa-telephon" }];
		if (mytype) {
			return _.find(tab, { key: mytype });
		}
		return tab;
	},
	// getInvoiceType: function(mytype) {
	// 	var tab = [{ key: "OP", val: "OP" }, { key: "OC", val: "OC" }];
	// 	if (mytype) {
	// 		return _.find(tab, { key: mytype });
	// 	}
	// 	return tab;
	// },
	getDevises: function(mytype) {
		var tab = [{ key: 0, val: "Euro €" }, { key: 1, val: "Dollar $" }];
		if (mytype) {
			return _.find(tab, { key: mytype });
		}
		return tab;
	},

	completeName: function(row_co, withSociety) {
		// console.log("row_co", row_co);
		if (!row_co) return "";
		var res = "";
		// console.log("this.getUserRight('persoinvertname')", this.getUserRight('persoinvertname'));
		// if (row_co.co_type == "society") {
		// } else {
		if (row_co.co_name) res += row_co.co_name.toUpperCase();
		if (row_co.co_firstname && row_co.co_name) res += " ";
		if (row_co.co_firstname) res += _.capitalize(row_co.co_firstname);
		if (row_co.co_society) res += _.capitalize(row_co.co_society);
		// }
		// if (withSociety && !_.isEmpty(row_co.co_society)) {
		// 	let more = "";
		// 	if (res) more = " | " + res;
		// 	res = _.capitalize(row_co.co_society) + more;
		// }
		return res;
	},
	getLogsTypes: function(mytype) {
		var tab = [
			{ key: "product_created", val: "Création d'un produit" },
			{ key: "product_updated", val: "Modification d'un produit" },
			{ key: "product_deleted", val: "Effacement d'un produit" },

			{ key: "invoice_created", val: "Création d'une facture" },
			{ key: "invoice_updated", val: "Modification d'une facture" },
			{ key: "invoice_deleted", val: "Effacement d'une facture" },

			{ key: "estimate_created", val: "Création d'un devis" },
			{ key: "estimate_updated", val: "Modification d'un devis" },
			{ key: "estimate_deleted", val: "Effacement d'un devis" },

			{ key: "purchaseorder_created", val: "Création d'un bon de commande" },
			{ key: "purchaseorder_updated", val: "Modification d'un bon de commande" },
			{ key: "purchaseorder_deleted", val: "Effacement d'un bon de commande" },

			{ key: "vacation_created", val: "Création de l'absence par l'utilisateur", color: "bg_col5" },
			{ key: "vacation_updated", val: "Modification de l'absence par l'utilisateur", color: "bg_col5" },
			{ key: "vacation_accepted", val: "Acceptation de l'absence par le responsable", color: "bg_col2" },
			{ key: "vacation_refused", val: "Refus de l'absence par le responsable", color: "bg_col3" }
		];
		if (mytype) {
			return _.find(tab, { key: mytype });
		}
		return tab;
	},
	getActionsTypes: function(mytype) {
		var tab = [
			{ key: "call", val: "Appel téléphone", icon: "fa-telephon" },
			{ key: "estimate", val: "Devis", icon: "fa-telephon" },
			{ key: "emailout", val: "eMail sortant", icon: "fa-telephon" },
			{ key: "emailin", val: "eMail entrant", icon: "fa-telephon" },
			{ key: "skype", val: "Skype", icon: "fa-telephon" },
			{ key: "expedition", val: "Expédition de commande", icon: "fa-telephon" },
			{ key: "reservetransport", val: "Réserver le transport", icon: "fa-telephon" },
			{ key: "do_invoice", val: "Faire la facture", icon: "fa-telephon" },
			{ key: "expedition", val: "Date d'expédition", icon: "fa-telephon" },
			{ key: "send_documents", val: "Envoyer les documents au client", icon: "fa-telephon" }

			// { key: "vacations_created", val: "Création de l'absence par l'utilisateur", icon: "fa-telephon", color: "bg_col5" },
			// { key: "vacations_updated", val: "Modification de l'absence par l'utilisateur", icon: "fa-telephon", color: "bg_col5" },
			// { key: "vacations_acceptedleader", val: "Acceptation de l'absence par le responsable", icon: "fa-telephon", color: "bg_col2" },
			// { key: "vacations_accepteddirector", val: "Validation de l'absence par le siège", icon: "fa-telephon", color: "bg_col2" },
			// { key: "vacations_refusedleader", val: "Refus de l'absence par le responsable", icon: "fa-telephon", color: "bg_col3" },
			// { key: "vacations_refuseddirector", val: "Refus de l'absence par le siège", icon: "fa-telephon", color: "bg_col3" },
			// { key: "vacations_exported", val: "Export de l'absence", icon: "fa-telephon", color: "bg_col4" }
		];
		if (mytype) {
			return _.find(tab, { key: mytype });
		}
		return tab;
	},
	// completeName: function(row_co, withSociety) {
	// 	// console.log("row_co", row_co);
	// 	if (!row_co) return "";
	// 	var res = "";
	// 	// console.log("this.getUserRight('persoinvertname')", this.getUserRight('persoinvertname'));
	// 	if (row_co.co_name) res += row_co.co_name.toUpperCase();
	// 	if (row_co.co_firstname && row_co.co_name) res += " ";
	// 	if (row_co.co_firstname) res += _.capitalize(row_co.co_firstname);
	// 	if (withSociety && !_.isEmpty(row_co.co_society)) {
	// 		let more = "";
	// 		if (res) more = " | " + res;
	// 		res = _.capitalize(row_co.co_society) + more;
	// 	}
	// 	return res;
	// },

	number_format: function(number, decimals, decPoint, thousandsSep) {
		// eslint-disable-line camelcase
		//  discuss at: http://locutus.io/php/number_format/
		// original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// improved by: Kevin van Zonneveld (http://kvz.io)
		// improved by: davook
		// improved by: Brett Zamir (http://brett-zamir.me)
		// improved by: Brett Zamir (http://brett-zamir.me)
		// improved by: Theriault (https://github.com/Theriault)
		// improved by: Kevin van Zonneveld (http://kvz.io)
		// bugfixed by: Michael White (http://getsprink.com)
		// bugfixed by: Benjamin Lupton
		// bugfixed by: Allan Jensen (http://www.winternet.no)
		// bugfixed by: Howard Yeend
		// bugfixed by: Diogo Resende
		// bugfixed by: Rival
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		//  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		//  revised by: Luke Smith (http://lucassmith.name)
		//    input by: Kheang Hok Chin (http://www.distantia.ca/)
		//    input by: Jay Klehr
		//    input by: Amir Habibi (http://www.residence-mixte.com/)
		//    input by: Amirouche
		//   example 1: number_format(1234.56)
		//   returns 1: '1,235'
		//   example 2: number_format(1234.56, 2, ',', ' ')
		//   returns 2: '1 234,56'
		//   example 3: number_format(1234.5678, 2, '.', '')
		//   returns 3: '1234.57'
		//   example 4: number_format(67, 2, ',', '.')
		//   returns 4: '67,00'
		//   example 5: number_format(1000)
		//   returns 5: '1,000'
		//   example 6: number_format(67.311, 2)
		//   returns 6: '67.31'
		//   example 7: number_format(1000.55, 1)
		//   returns 7: '1,000.6'
		//   example 8: number_format(67000, 5, ',', '.')
		//   returns 8: '67.000,00000'
		//   example 9: number_format(0.9, 0)
		//   returns 9: '1'
		//  example 10: number_format('1.20', 2)
		//  returns 10: '1.20'
		//  example 11: number_format('1.20', 4)
		//  returns 11: '1.2000'
		//  example 12: number_format('1.2000', 3)
		//  returns 12: '1.200'
		//  example 13: number_format('1 000,50', 2, '.', ' ')
		//  returns 13: '100 050.00'
		//  example 14: number_format(1e-8, 8, '.', '')
		//  returns 14: '0.00000001'
		number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
		var n = !isFinite(+number) ? 0 : +number;
		var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
		var sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
		var dec = typeof decPoint === "undefined" ? "." : decPoint;
		var s = "";
		var toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return "" + (Math.round(n * k) / k).toFixed(prec);
		};
		// @todo: for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || "").length < prec) {
			s[1] = s[1] || "";
			s[1] += new Array(prec - s[1].length + 1).join("0");
		}
		return s.join(dec);
	}
};
