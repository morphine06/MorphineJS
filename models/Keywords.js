"use strict";



module.exports = {


    tableName: 'kw_keywords',

    attributes: {
        kw_id: {
            type: 'integer',
            autoincrement: true,
            primary: true,
        },
        kw_name: {
            type: 'string',
            limit: 255,
            defaultsTo: '',
        },
        kw_id_parent: {
            type: 'integer',
            index: true,
        },

    }
};

