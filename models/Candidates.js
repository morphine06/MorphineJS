"use strict";

module.exports = {
	tableName: "ca_candidates",

	attributes: {
		ca_id: {
			type: "integer",
			autoincrement: true,
			primary: true
		},
		ca_status: {
			type: "integer",
			defaultsTo: 1,
			index: true
		},
		ca_name: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_firstname: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_birthday: {
			type: "datetime"
		},
		ca_civility: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_email1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_email2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_email3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_tel1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_tel2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_tel3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_mobile1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_mobile2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_mobile3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_fax1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_fax2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_fax3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_web1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_web2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_web3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_address1: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_address2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_address3: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_zip: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_linkedin: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_viadeo: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_company: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_group: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_post: {
			type: "integer",
			defaultsTo: 0
		},
		ca_city: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_city2: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_country: {
			type: "varchar",
			defaultsTo: "",
			index: true
		},
		ca_type: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_experienceyears: {
			type: "integer",
			defaultsTo: 0
		},
		ca_salary: {
			type: "integer",
			defaultsTo: 0
		},
		ca_prims: {
			type: "integer",
			defaultsTo: 0
		},
		ca_nbhours: {
			type: "integer",
			defaultsTo: 0
		},
		ca_salaryvariable: {
			type: "integer",
			defaultsTo: 0
		},
		ca_purcent: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_planning: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_13months: {
			type: "integer",
			defaultsTo: 0
		},
		ca_dfs: {
			type: "integer",
			defaultsTo: 0
		},
		ca_car: {
			type: "integer",
			defaultsTo: 0
		},
		ca_tel: {
			type: "integer",
			defaultsTo: 0
		},
		ca_meal: {
			type: "integer",
			defaultsTo: 0
		},
		ca_insurance: {
			type: "integer",
			defaultsTo: 0
		},
		ca_participation: {
			type: "integer",
			defaultsTo: 0
		},
		ca_software: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_clause: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_agency: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_posttotake: {
			type: "integer",
			defaultsTo: 0
		},
		ca_salaryproposed: {
			type: "integer",
			defaultsTo: 0
		},
		ca_variableproposed: {
			type: "float",
			defaultsTo: 0
		},
		ca_salarymaintains: {
			type: "integer",
			defaultsTo: 0
		},
		ca_salarymaintainstime: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_13monthsproposed: {
			type: "integer",
			defaultsTo: 0
		},
		ca_ca_type: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evodate1: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary1: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm1: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_evodate2: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary2: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm2: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_evodate3: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary3: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm3: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_evodate4: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary4: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm4: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_evodate5: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary5: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm5: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_evodate6: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evosalary6: {
			type: "integer",
			defaultsTo: 0
		},
		ca_evocomm6: {
			type: "string",
			defaultsTo: ""
		},
		ca_otheravantages: {
			type: "text"
		},
		ca_comments: {
			type: "text"
		},
		ca_positivepoints: {
			type: "text"
		},
		ca_negativepoints: {
			type: "text"
		},
		ca_secretary: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_contractprorh: {
			type: "varchar",
			defaultsTo: ""
		},
		ca_cv: {
			type: "integer",
			defaultsTo: 0
		},
		ca_customercopy: {
			type: "integer",
			defaultsTo: 0
		},
		ca_bdd: {
			type: "integer",
			defaultsTo: 0
		},
		ca_subtasks: {
			type: "json"
		},
		ca_archive: {
			type: "boolean",
			defaultsTo: 0
		},
		createdCo: {
			model: "Contacts"
		},
		updatedCo: {
			model: "Contacts"
		}
	}
};
