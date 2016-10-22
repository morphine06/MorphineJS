"use strict";


var BaseController = require('../BaseController') ;

module.exports = class extends BaseController {
    index(req, res) {
        res.render('backend/index', {
            layout: 'backend/layout'
        });
    }
    infos(req, res) {
        res.send({user:req.user}) ;
    }
} ;