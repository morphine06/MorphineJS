"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Shared } from "./../../compiled/Shared.js";

export var Services = {
	drawCreatedModified: function(row_co) {
		var html = "";
		if (row_co.createdAt) {
			html += "Créé le " + moment(row_co.createdAt).format("DD/MM/YYYY [à] HH[H]mm");
			if (row_co.createdCo) html += " par " + Shared.completeName(row_co.createdCo);
			html += " - ";
		}
		if (row_co.updatedAt) {
			html += "Modifié le " + moment(row_co.updatedAt).format("DD/MM/YYYY [à] HH[H]mm");
			if (row_co.updatedCo) html += " par " + Shared.completeName(row_co.updatedCo);
		}
		return html;
	},
	displayRight: function(row_co) {
		return _.result(_.find(Shared.getRoles(), { key: row_co.co_type }), "val");
	},
	getUserRight: function(right) {
		return M_.App.Session.co_rights[right];
	},
	processContactsData: function(data) {
		// log("data",data)
		if (!data) return;
		var reg1 = /[^\+0-9]/g;
		data.co_tel1_formated = data.co_tel2_formated = data.co_tel3_formated = data.co_mobile1_formated = data.co_mobile2_formated = data.co_mobile3_formated = data.co_fax1_formated = data.co_fax2_formated = data.co_fax3_formated = data.co_tel1_normalized = data.co_tel2_normalized = data.co_fax3_formated = data.co_tel1_normalized = data.co_tel2_normalized = data.co_tel3_normalized = data.co_mobile1_normalized = data.co_mobile2_normalized = data.co_mobile3_normalized = data.co_fax1_normalized = data.co_fax2_normalized = data.co_fax3_normalized =
			"";
		if (data.co_tel1) data.co_tel1_formated = data.co_tel1.replace(reg1, "");
		if (data.co_tel2) data.co_tel2_formated = data.co_tel2.replace(reg1, "");
		if (data.co_tel3) data.co_tel3_formated = data.co_tel3.replace(reg1, "");
		if (data.co_mobile1) data.co_mobile1_formated = data.co_mobile1.replace(reg1, "");
		if (data.co_mobile2) data.co_mobile2_formated = data.co_mobile2.replace(reg1, "");
		if (data.co_mobile3) data.co_mobile3_formated = data.co_mobile3.replace(reg1, "");
		if (data.co_fax1) data.co_fax1_formated = data.co_fax1.replace(reg1, "");
		if (data.co_fax2) data.co_fax2_formated = data.co_fax2.replace(reg1, "");
		if (data.co_fax3) data.co_fax3_formated = data.co_fax3.replace(reg1, "");

		if (data.co_tel1) data.co_tel1_normalized = M_.Utils.formatPhone(data.co_tel1);
		if (data.co_tel2) data.co_tel2_normalized = M_.Utils.formatPhone(data.co_tel2);
		if (data.co_tel3) data.co_tel3_normalized = M_.Utils.formatPhone(data.co_tel3);
		if (data.co_mobile1) data.co_mobile1_normalized = M_.Utils.formatPhone(data.co_mobile1);
		if (data.co_mobile2) data.co_mobile2_normalized = M_.Utils.formatPhone(data.co_mobile2);
		if (data.co_mobile3) data.co_mobile3_normalized = M_.Utils.formatPhone(data.co_mobile3);
		if (data.co_fax1) data.co_fax1_normalized = M_.Utils.formatPhone(data.co_fax1);
		if (data.co_fax2) data.co_fax2_normalized = M_.Utils.formatPhone(data.co_fax2);
		if (data.co_fax3) data.co_fax3_normalized = M_.Utils.formatPhone(data.co_fax3);
	}
};
