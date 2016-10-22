"use strict";

var fs = require('fs-extra') ;
var path = require('path') ;
// var browserify = require("browserify");
// var babelify = require("babelify");
var webpack = require("webpack");

module.exports = (cb)=> {
    console.log("Task : copy...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        // console.log("mypackagename",mypackagename);
        if (!mypackage.scripts) mypackage.scripts = [] ;
        async.series([

            (nextTask)=> {
                async.eachSeries(mypackage.scripts, (script, nextScript)=> {
                    if (script.indexOf('|')>=0) {
                        let t = script.split('|') ;
                        fs.copy(t[1], 'assets/compiled/'+t[0], function (err) {
                            if (err) return console.error(err);
                            // console.log("success!");
                            nextScript() ;
                        });
                    } else nextScript() ;
                }, ()=> {
                    nextTask() ;
                }) ;
            },

            (nextTask)=> {
                async.eachSeries(mypackage.styles, (style, nextStyle)=> {
                    if (style.indexOf('|')>=0) {
                        let t = style.split('|') ;
                        fs.copy(t[1], 'assets/compiled/'+t[0], function (err) {
                            if (err) return console.error(err);
                            // console.log("success!");
                            nextStyle() ;
                        });
                    } else nextStyle() ;
                }, ()=> {
                    nextTask() ;
                }) ;
            },


            (nextTask)=> {
                let models = fs.readdirSync(morphineserver.rootDir+'/models') ;
                fs.ensureDir(morphineserver.rootDir+'/assets/compiled/models/', function (err) {
                    async.eachSeries(models, (model, nextModel)=> {
                        model = model.substring(0,model.length-3) ;
                        var def = require(morphineserver.rootDir+'/models/'+model) ;
                        var mods = "" ;
                        mods += "'use strict';\nimport {M_} from './../../../libs/M_.js';\nexport class MT_"+model+" extends M_.Model {\ngetDefinition() {\nreturn {\n" ;
                        // mods += '"name": "co_contacts",\n' ;
                        // mods += '"autoIncrement": false,\n' ;
                        let tabOk = [] ;
                        let attributes = def.attributes ;
                        let primaryKey = '' ;
                        _.each(attributes, (obj, key)=> {
                            obj.name = key ;
                            tabOk.push(obj) ;
                            if (obj.primary) primaryKey = key ;
                        }) ;
                        mods += '"primaryKey": "'+primaryKey+'",\n' ;
                        mods += '"fields":\n' ;
                        mods += JSON.stringify(tabOk, null, "\t") ;
                        mods += "\n} ;\n}} " ;
                        fs.writeFileSync(morphineserver.rootDir+'/assets/compiled/models/MT_'+model+'.js', mods) ;
                        nextModel() ;
                    }, ()=> {
                        nextTask() ;
                    }) ;
                }) ;
            },


        ], ()=> {
            nextPackage() ;
        }) ;
    }, function() {
        cb() ;
    }) ;
} ;