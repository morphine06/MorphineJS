"use strict";


var uuid = require('node-uuid');


module.exports = {

    tableName: 'cogr_contactsgroups',

    attributes: {
        cogr_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
        },
        co_id: {
            model: 'Contacts'
        },
        gr_id: {
            model: 'Groups'
        },

    }
};

