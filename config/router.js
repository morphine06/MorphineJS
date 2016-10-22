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
        'GET /backend': {
            controller: 'backend/HomeController',
            action: 'index',
            policies: ['accessBackend']
        },

        'GET /ws/infos': {
            controller: 'backend/HomeController',
            action: 'infos',
            policies: ['accessBackend']
        }
    }
} ;