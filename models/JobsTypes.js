"use strict";

module.exports =  {
    tableName: 'jobstypes',
    attributes: {
        jt_id: {
            primary: true,
            type: 'int',
            autoincrement: true,
        },
        jt_name: {
            type: 'varchar',
        },
    }
} ;