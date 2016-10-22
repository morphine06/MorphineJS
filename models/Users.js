"use strict";


var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');


function procedePassword(values, next) {
    if (values.us_password && values.us_password!=='') {
        bcrypt.hash(values.us_password, null, null, function(err, hash) {
            if (err) return next(err);
            values.us_password = hash;
            next();
        });
    } else {
        delete values.us_password ;
        next() ;
    }
}


module.exports = {

    beforeCreate: function(values, next) {
        procedePassword(values, next) ;
    },
    beforeUpdate: function(values, next) {
        procedePassword(values, next) ;
    },

    tableName: 'users',

    attributes: {
        us_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
            // unique: true
        },
        jo_id: {
            model: 'Jobs'
        },
        us_name: {
            type: 'varchar',
            defaultsTo: '',
            index: true
        },
        us_firstname: {
            type: 'varchar',
            defaultsTo: '',
            index: true
        },
        us_login: {
            type: 'varchar',
            index: true,
        },
        us_password: {
            type: 'varchar',
            minLength: 6,
        },
        us_num: {
            type: 'varchar',
            // defaultsTo: 3,
            index: true
        },
    }
};


// module.exports = class extends Models {
//     definition() {
//         return {
//             name: 'users',
//             primary: 'us_id',
//             fields: {
//                 us_id: {
//                     primary: true,
//                     type: 'int',
//                     autoincrement: true,
//                 },
//                 jo_id: {
//                     type: 'int',
//                     model: 'jobs'
//                 },
//                 us_name: {
//                     type: 'varchar',
//                 },
//                 us_firstname: {
//                     type: 'varchar',
//                     length: 100
//                 },
//                 us_birthday: {
//                     type: 'date'
//                 },
//                 us_login: {
//                     type: 'varchar',
//                 },
//                 us_password: {
//                     type: 'varchar',
//                 },
//             }
//         } ;
//     }
// } ;