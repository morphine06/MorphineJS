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

        'GET /ws/infos': {
            controller: 'backend/HomeController',
            action: 'infos',
            policies: ['accessBackend']
        },

        'GET /ws/contacts': {
            controller: 'backend/ContactsController',
            action: 'find',
            policies: ['accessBackend']
        },
        'GET /ws/contacts/:co_id': {
            controller: 'backend/ContactsController',
            action: 'findOne',
            policies: ['accessBackend']
        },
        'PUT /ws/contacts/:co_id': {
            controller: 'backend/ContactsController',
            action: 'update',
            policies: ['accessBackend']
        },
        'POST /ws/contacts': {
            controller: 'backend/ContactsController',
            action: 'create',
            policies: ['accessBackend']
        },
        'GET /ws/groups': {
            controller: 'backend/GroupsController',
            action: 'find',
            policies: ['accessBackend']
        },
        'GET /ws/groups/:gr_id': {
            controller: 'backend/GroupsController',
            action: 'findOne',
            policies: ['accessBackend']
        },
        'GET /ws/contacts/avatar/:w/:h/:co_id': {
            controller: 'backend/ContactsController',
            action: 'avatar',
            policies: ['accessBackend']
        },
    }
} ;