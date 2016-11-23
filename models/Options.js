"use strict";


module.exports = {

    tableName: 'op_options',

    attributes: {
        op_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
        },
        name: {
            type: 'string',
            defaultsTo: '',
        },
        co_id: {
            model: 'Contacts'
        },
        val: {
            type: 'text',
            defaultsTo: ''
        },

    }
};

