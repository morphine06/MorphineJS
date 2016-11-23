"use strict";


var BaseController = require('../BaseController') ;

module.exports = class extends BaseController {
    index(req, res) {
        res.render('backend/index', {
            layout: 'backend/layout'
        });
    }
    infos(req, res) {
        // console.log("req.user",req.user);
        if (!req.user.co_rights) req.user.co_rights = {} ;
        // Services.calculateOptionsRights(req.user, ()=> {
            this.send(res, {user:req.user}) ;
        // }) ;

    }
} ;