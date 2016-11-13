"use strict";


var uuid = require('node-uuid');


module.exports = {

    beforeCreate: function(values, next) {
        values.gr_id = uuid.v1() ;
    },

    tableName: 'gr_groups',

    attributes: {
        gr_id: {
            type: 'string',
            primary: true,
            // unique: true
        },
        gr_name: {
            type: 'string',
            limit: 255,
            defaultsTo: '',
        },

    }
};

