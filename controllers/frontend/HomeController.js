"use strict";


var BaseController = require('../BaseController') ;
var passport = require('passport') ;

module.exports = class extends BaseController {
    index(req, res) {
        res.render('frontend/index', {
            layout: 'frontend/layout'
        });
    }

    login(req, res) {
        Passport.authenticate('local', function(err, user, info) {
            // console.log("err,user,info",err,user,info);
            // console.log("req.user",req.user);
            if ((err) || (!user)) return res.redirect("/?err=3") ;
            console.log("req.session",req.session);
            res.redirect("/backend") ;

            // req.login(user, function(err) {
            //     if (err) return res.redirect("/?err=1") ;
                // console.log("req.session",req.session);
                // if (req.body.keepactive) req.session.keepactive = true ;
                // else req.session.keepactive = false ;
                // res.redirect("/home") ;
            // });
        })(req, res);
    }
} ;