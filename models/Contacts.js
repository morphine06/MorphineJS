"use strict";


var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');


function procedePassword(values, next) {
    if (values.co_password && values.co_password!=='') {
        bcrypt.hash(values.co_password, null, null, function(err, hash) {
            if (err) return next(err);
            values.co_password = hash;
            next();
        });
    } else {
        delete values.co_password ;
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

    tableName: 'co_contacts',

    attributes: {
        co_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
            // unique: true
        },
        co_type: {
            type: 'string',
            limit: 10,
            defaultsTo: '',
        },
        co_apikey: {
            type: 'varchar',
            length: 36,
            index: true,
        },
        co_apisecret: {
            type: 'varchar',
            length: 36,
            index: true,
        },
        co_society: {
            type: 'varchar',
            length: 10,
            defaultsTo: '',
        },
        co_civility: {
            type: 'varchar',
            length: 10,
            defaultsTo: '',
        },
        co_rights: {
            type: 'json'
        },
        co_pseudo: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_avatar: {
            type: 'string'
        },
        co_name: {
            type: 'varchar',
            defaultsTo: '',
            index: true
        },
        co_firstname: {
            type: 'varchar',
            defaultsTo: '',
            index: true
        },
        co_function: {
            type: 'string',
            limit: 10,
            defaultsTo: '',
        },
        co_birthday: {
            type: 'date'
        },
        co_tel: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_mobile: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_email: {
            type: 'varchar',
            index: true,
        },
        co_login: {
            type: 'varchar',
            index: true,
        },
        co_password: {
            type: 'varchar',
        },
        co_lang: {
            type: 'varchar',
            length: 2,
            index: true,
        },
        co_sex: {
            type: 'integer',
            defaultsTo: 0
        },
        co_address1: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_address2: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_zip: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_city: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_country: {
            type: 'varchar',
            defaultsTo: 'France'
        },
        co_active: {
            type: 'boolean'
        },
        co_aboutme: {
            type: 'text'
        },
        co_geo_lat: {
            type: 'float',
            length: '10,6'
        },
        co_geo_lng: {
            type: 'float',
            length: '10,6'
        },
        co_token_stripe: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_token_facebook: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_token_apple: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_token_google: {
            type: 'varchar',
            defaultsTo: ''
        },
        co_iscontactable: {
            type: 'boolean',
            defaultsTo: 1
        },
        co_admin: {
            type: 'boolean',
            defaultsTo: 0
        },
        deleted: {
            type: 'boolean',
            defaultsTo: 0
        },
        createdCo: {
            model: 'Contacts'
        },
        modifiedCo: {
            model: 'Contacts'
        },
    }
};

