"use strict";


var uuid = require('node-uuid');


module.exports = {

    tableName: 'gr_groups',

    attributes: {
        gr_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
        },
        gr_name: {
            type: 'string',
            limit: 255,
            defaultsTo: '',
        },

    }
};

