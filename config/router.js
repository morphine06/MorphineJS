module.exports = {
	config: {},
	routes: {
		"GET /": {
			controller: "frontend/HomeController",
			action: "index"
		},
		"POST /login": {
			controller: "frontend/HomeController",
			action: "login"
		},
		"GET /logout": {
			controller: "frontend/HomeController",
			action: "logout"
		},
		"GET /backend": {
			controller: "backend/HomeController",
			action: "index",
			policies: ["accessBackend"]
		},

		"GET /1.0/infos": {
			controller: "backend/HomeController",
			action: "infos",
			policies: ["accessBackend"]
		},

		"GET /1.0/logs": {
			controller: "backend/LogsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/combo/:what/:field": {
			controller: "backend/ContactsController",
			action: "combo",
			policies: ["accessBackend"]
		},

		"GET /1.0/contacts": {
			controller: "backend/ContactsController",
			action: "find",
			policies: ["accessBackend"]
		},
		"GET /1.0/contacts/:co_id": {
			controller: "backend/ContactsController",
			action: "findOne",
			policies: ["accessBackend"]
		},
		"PUT /1.0/contacts/:co_id": {
			controller: "backend/ContactsController",
			action: "update",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/contacts/:co_id": {
			controller: "backend/ContactsController",
			action: "destroy",
			policies: ["accessBackend"]
		},
		"POST /1.0/contacts": {
			controller: "backend/ContactsController",
			action: "create",
			policies: ["accessBackend"]
		},
		"GET /1.0/contacts/avatar/:w/:h/:co_id": {
			controller: "backend/ContactsController",
			action: "avatar",
			policies: ["accessBackend"]
		},
		"POST /1.0/contacts/updateavatar": {
			controller: "backend/ContactsController",
			action: "updateavatar",
			policies: ["accessBackend"]
		},
		"GET /1.0/groups": {
			controller: "backend/GroupsController",
			action: "find",
			policies: ["accessBackend"]
		},
		"GET /1.0/groups/:gr_id": {
			controller: "backend/GroupsController",
			action: "findOne",
			policies: ["accessBackend"]
		},
		"POST /1.0/groups": {
			controller: "backend/GroupsController",
			action: "create",
			policies: ["accessBackend"]
		},
		"PUT /1.0/groups/:gr_id": {
			controller: "backend/GroupsController",
			action: "update",
			policies: ["accessBackend"]
		},
		"/1.0/groups/addcontactstogroup": {
			controller: "backend/GroupsController",
			action: "addcontactstogroup"
		},
		"/1.0/groups/removecontactstogroup": {
			controller: "backend/GroupsController",
			action: "removecontactstogroup"
		},
		"/1.0/groups/emptygroup/:gr_id": {
			controller: "backend/GroupsController",
			action: "emptygroup"
		},

		"GET /1.0/products": {
			controller: "backend/ProductsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/products/:pr_id": {
			controller: "backend/ProductsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/products": {
			controller: "backend/ProductsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/products/:pr_id": {
			controller: "backend/ProductsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/products/:pr_id": {
			controller: "backend/ProductsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/products/:pr_id/:num/savefile": {
			controller: "backend/ProductsController",
			action: "savefile_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/products/:pr_id/:num/file": {
			controller: "backend/ProductsController",
			action: "file_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/opportunities": {
			controller: "backend/OpportunitiesController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/opportunities/:op_id": {
			controller: "backend/OpportunitiesController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/opportunities": {
			controller: "backend/OpportunitiesController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/opportunities/:op_id": {
			controller: "backend/OpportunitiesController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/opportunities/:op_id": {
			controller: "backend/OpportunitiesController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/events": {
			controller: "backend/EventsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/events/:ev_id": {
			controller: "backend/EventsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/events": {
			controller: "backend/EventsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/events/:ev_id": {
			controller: "backend/EventsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/events/:ev_id": {
			controller: "backend/EventsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/candidates": {
			controller: "backend/CandidatesController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/candidates/:ca_id": {
			controller: "backend/CandidatesController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/candidates": {
			controller: "backend/CandidatesController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/candidates/:ca_id": {
			controller: "backend/CandidatesController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/candidates/:ca_id": {
			controller: "backend/CandidatesController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/actions": {
			controller: "backend/ActionsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/actions": {
			controller: "backend/ActionsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/invoices": {
			controller: "backend/InvoicesController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/invoices/:in_id/print": {
			controller: "backend/InvoicesController",
			action: "print_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/invoices/:in_id": {
			controller: "backend/InvoicesController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/invoices": {
			controller: "backend/InvoicesController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/invoices/:in_id/duplicate": {
			controller: "backend/InvoicesController",
			action: "duplicate_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/invoices/:in_id": {
			controller: "backend/InvoicesController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/invoices/:in_id": {
			controller: "backend/InvoicesController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/lists": {
			controller: "backend/ListsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/lists/:li_id": {
			controller: "backend/ListsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/lists": {
			controller: "backend/ListsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/lists/:li_id": {
			controller: "backend/ListsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/lists/:li_id": {
			controller: "backend/ListsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/documents/:do_id/image": {
			controller: "backend/DocumentsController",
			action: "load_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/documents": {
			controller: "backend/DocumentsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/documents/:do_id": {
			controller: "backend/DocumentsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/documents": {
			controller: "backend/DocumentsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/documents/saveimage": {
			controller: "backend/DocumentsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		// "PUT /1.0/documents/:do_id": {
		// 	controller: "backend/DocumentsController",
		// 	action: "update_1_0",
		// 	policies: ["accessBackend"]
		// },
		"DELETE /1.0/documents/:do_id": {
			controller: "backend/DocumentsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/vacations/currentinfos/:co_id": {
			controller: "backend/VacationsController",
			action: "currentinfos_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/vacations/export/:start/:end": {
			controller: "backend/VacationsController",
			action: "export_1_0"
		},
		"POST /1.0/vacations/exportcheck/:start/:end": {
			controller: "backend/VacationsController",
			action: "exportcheck_1_0"
		},
		"POST /1.0/vacations/import": {
			controller: "backend/VacationsController",
			action: "import_1_0"
		},
		"POST /1.0/vacations/exportxls": {
			controller: "backend/VacationsController",
			action: "exportxls_1_0"
		},
		"POST /1.0/vacations/exportremainings": {
			controller: "backend/VacationsController",
			action: "exportremainings_1_0"
		},
		"GET /1.0/actions": {
			controller: "backend/ActionsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/actions": {
			controller: "backend/ActionsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/actions/:ac_id": {
			controller: "backend/ActionsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/vacations": {
			controller: "backend/VacationsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/vacations/:va_id": {
			controller: "backend/VacationsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/vacations": {
			controller: "backend/VacationsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/vacations/:va_id": {
			controller: "backend/VacationsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/vacations/:va_id": {
			controller: "backend/VacationsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/vacationstypes": {
			controller: "backend/VacationsController",
			action: "vacationstypes_find_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/campaigns/template": {
			controller: "backend/CampaignsController",
			action: "loadtemplate_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/campaigns": {
			controller: "backend/CampaignsController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/campaigns/:ca_id": {
			controller: "backend/CampaignsController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/campaigns": {
			controller: "backend/CampaignsController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/campaigns/:ca_id": {
			controller: "backend/CampaignsController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/campaigns/:ca_id": {
			controller: "backend/CampaignsController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"GET /1.0/addresses": {
			controller: "backend/AddressesController",
			action: "find_1_0",
			policies: ["accessBackend"]
		},
		"GET /1.0/addresses/:ad_id": {
			controller: "backend/AddressesController",
			action: "findone_1_0",
			policies: ["accessBackend"]
		},
		"POST /1.0/addresses": {
			controller: "backend/AddressesController",
			action: "create_1_0",
			policies: ["accessBackend"]
		},
		"PUT /1.0/addresses/:ad_id": {
			controller: "backend/AddressesController",
			action: "update_1_0",
			policies: ["accessBackend"]
		},
		"DELETE /1.0/addresses/:ad_id": {
			controller: "backend/AddressesController",
			action: "destroy_1_0",
			policies: ["accessBackend"]
		},

		"POST /1.0/preferences/rights": {
			controller: "backend/PreferencesController",
			action: "saverights",
			policies: ["accessBackend"]
		},
		"GET /1.0/preferences/rights/:xxx": {
			controller: "backend/PreferencesController",
			action: "loadrights",
			policies: ["accessBackend"]
		}
	}
};
