"use strict";


var BaseController = require('../BaseController') ;

module.exports = class extends BaseController {
    find(req, res) {
        Groups.find('1=1').exec((errsql, rows)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:rows}) ;
        }) ;
    }
    findOne(req, res) {
        Groups.findOne(req.params.id).exec((errsql, row)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:row}) ;
        }) ;
    }
} ;