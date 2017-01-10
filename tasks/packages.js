module.exports = {
    packageFrontend: {
        /* don't include .es6 file */
        scripts: [
            // 'assets/js/socket.io.js',
            'compiled/jquery.js|node_modules/jquery/dist/jquery.js',
            'compiled/lodash.js|node_modules/lodash/lodash.js',
            'compiled/bootstrap.js|node_modules/bootstrap/dist/js/bootstrap.js',
        ],
        /* es6 files will be auto-included from import in main.es6 */
        es6EntryPoint: '',
        jst: [
            'assets/templates/frontend/test1.html',
            'assets/templates/frontend/test2.html',
        ],
        styles: [
            'compiled/bootstrap.css|node_modules/bootstrap/dist/css/bootstrap.css',
            'assets/css/frontend/base.css',
            // 'less',
        ],
        less: [],
    },
    packageBackend: {
        /* don't include .es6 file */
        scripts: [
            'compiled/socket.io.js|node_modules/socket.io-client/dist/socket.io.js',
            'compiled/jquery.js|node_modules/jquery/dist/jquery.js',
            'compiled/lodash.js|node_modules/lodash/lodash.js',
            'compiled/moment.js|node_modules/moment/min/moment-with-locales.js',
            'compiled/jquery.transit.js|node_modules/jquery.transit/jquery.transit.js',
            // 'compiled/d3.js|node_modules/d3/build/d3.js',
            // 'compiled/c3.js|node_modules/c3/c3.js',
            'jst',
            'es6'
        ],
        /* es6 files will be auto-included from import in main.es6 */
        es6EntryPoint: 'assets/js/backend/main.js',
        jst: [
            'assets/templates/backend/**/*.html',
        ],
        styles: [
            'compiled/font-awesome.css|node_modules/font-awesome/css/font-awesome.css',
            // 'compiled/c3.css|node_modules/c3/c3.css',
            'less'
        ],
        less: [
            'assets/css/backend/base.less'
        ],
        fonts: [
            'fonts/fontawesome-webfont.eot|node_modules/font-awesome/fonts/fontawesome-webfont.eot',
            'fonts/fontawesome-webfont.svg|node_modules/font-awesome/fonts/fontawesome-webfont.svg',
            'fonts/fontawesome-webfont.ttf|node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
            'fonts/fontawesome-webfont.woff|node_modules/font-awesome/fonts/fontawesome-webfont.woff',
            'fonts/fontawesome-webfont.woff2|node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
            'fonts/FontAwesome.otf|node_modules/font-awesome/fonts/FontAwesome.otf',
        ],
    }
} ;