module.exports = {
    migrate: 'alter', // alter / recreate / safe
    debug: false,
    mysql: {
        client: 'mysql2',
        connection: {
            host     : 'localhost',
            user     : 'morphineserver',
            password : 'morphineserver#0260',
            database : 'morphineserver',
            charset  : 'utf8_general_ci'
        }
    }
} ;
