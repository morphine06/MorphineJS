module.exports = {
    config: {

    },
    routes: {
        'GET /': {
            controller: 'frontend/HomeController',
            action: 'index'
        },
        'POST /login': {
            controller: 'frontend/HomeController',
            action: 'login',
        },
        'GET /logout': {
            controller: 'frontend/HomeController',
            action: 'logout',
        },
        'GET /backend': {
            controller: 'backend/HomeController',
            action: 'index',
            policies: ['accessBackend']
        },

        'GET /1.0/infos': {
            controller: 'backend/HomeController',
            action: 'infos',
            policies: ['accessBackend']
        },


        'GET /1.0/contacts/combo/:field': {
            controller: 'backend/ContactsController',
            action: 'combo',
            policies: ['accessBackend']
        },

        'GET /1.0/contacts/find': {
            controller: 'backend/ContactsController',
            action: 'find',
            policies: ['accessBackend']
        },
        'GET /1.0/contacts/findone/:co_id': {
            controller: 'backend/ContactsController',
            action: 'findOne',
            policies: ['accessBackend']
        },
        'PUT /1.0/contacts/update/:co_id': {
            controller: 'backend/ContactsController',
            action: 'update',
            policies: ['accessBackend']
        },
        'DELETE /1.0/contacts/destroy/:co_id': {
            controller: 'backend/ContactsController',
            action: 'destroy',
            policies: ['accessBackend']
        },
        'POST /1.0/contacts/create': {
            controller: 'backend/ContactsController',
            action: 'create',
            policies: ['accessBackend']
        },
        'GET /1.0/contacts/avatar/:w/:h/:co_id': {
            controller: 'backend/ContactsController',
            action: 'avatar',
            policies: ['accessBackend']
        },
        'GET /1.0/groups/find': {
            controller: 'backend/GroupsController',
            action: 'find',
            policies: ['accessBackend']
        },
        'GET /1.0/groups/findone/:gr_id': {
            controller: 'backend/GroupsController',
            action: 'findOne',
            policies: ['accessBackend']
        },
        'POST /1.0/groups/create': {
            controller: 'backend/GroupsController',
            action: 'create',
            policies: ['accessBackend']
        },
        'PUT /1.0/groups/update/:gr_id': {
            controller: 'backend/GroupsController',
            action: 'update',
            policies: ['accessBackend']
        },
        '/1.0/groups/addcontactstogroup': {
            controller: 'backend/GroupsController',
            action: 'addcontactstogroup'
        },
        '/1.0/groups/removecontactstogroup': {
            controller: 'backend/GroupsController',
            action: 'removecontactstogroup'
        },
        '/1.0/groups/emptygroup/:gr_id': {
            controller: 'backend/GroupsController',
            action: 'emptygroup'
        },



        'POST /1.0/preferences/rights': {
            controller: 'backend/PreferencesController',
            action: 'saverights',
            policies: ['accessBackend']
        },
        'GET /1.0/preferences/rights/:xxx': {
            controller: 'backend/PreferencesController',
            action: 'loadrights',
            policies: ['accessBackend']
        },


    }
} ;