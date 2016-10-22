module.exports = {
    packageFrontend: {
        /* don't include .es6 file */
        scripts: [
            // 'assets/js/socket.io.js',
            'jquery.js|node_modules/jquery/dist/jquery.js',
            'lodash.js|node_modules/lodash/lodash.js',
            'bootstrap.js|node_modules/bootstrap/dist/js/bootstrap.js',
        ],
        /* es6 files will be auto-included from import in main.es6 */
        es6EntryPoint: '',
        jst: [
            'assets/templates/frontend/test1.html',
            'assets/templates/frontend/test2.html',
        ],
        styles: [
            'bootstrap.js|node_modules/bootstrap/dist/css/bootstrap.css',
            'assets/css/frontend/base.css',
            // 'less',
        ],
        less: [],
    },
    packageBackend: {
        /* don't include .es6 file */
        scripts: [
            'socket.io.js|node_modules/socket.io-client/socket.io.js',
            'jquery.js|node_modules/jquery/dist/jquery.js',
            'lodash.js|node_modules/lodash/lodash.js',
            'moment.js|node_modules/moment/min/moment-with-locales.js',
            'jquery.transit.js|node_modules/jquery.transit/jquery.transit.js',
            'jst',
            'es6'
        ],
        /* es6 files will be auto-included from import in main.es6 */
        es6EntryPoint: 'assets/js/backend/main.js',
        jst: [
            'assets/templates/backend/**/*.html',
        ],
        styles: [
            'assets/css/vendor/font-awesome.css',
            'less'
        ],
        less: [
            'assets/css/backend/base.less'
        ],
    }
} ;