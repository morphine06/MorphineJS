"use strict";


var BaseController = require('../BaseController') ;

module.exports = class extends BaseController {
    saverights(req, res) {
        async.eachSeries(Shared.getRoles(), function(role, nextRole) {
            if (role.key==='' || role.key==' ') return nextRole() ;
            var rights = {} ;
            _.each(Shared.getRights(), function (right) {
                var key = role.key+'_'+right.key ;
                rights[right.key] = req.body[key] ;
            }) ;


            // console.log("role, rights", role.key, rights);
            OptionsServices.set(0, 'allrights_'+role.key, rights, function () {
                nextRole() ;
            }) ;
        }, function () {
            this.send(res, {data: "ok"}) ;
        }) ;
    }
    loadrights(req, res) {
        var data = {} ;
        async.eachSeries(Shared.getRoles(), function(role, nextRole) {
            OptionsServices.get(0, 'allrights_'+role.key, function (rights) {
                _.each(rights, function (val, right) {
                    var key = role.key+'_'+right ;
                    data[key] = val ;
                }) ;
                nextRole() ;
            }) ;
        }, function () {
            this.send(res, {data: data}) ;
        }) ;
    }
} ;



