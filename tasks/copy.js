"use strict";

var fs = require('fs-extra') ;
var path = require('path') ;
// var browserify = require("browserify");
// var babelify = require("babelify");
var webpack = require("webpack");
var taskutils = require('./taskutils') ;

module.exports = (cb)=> {
    console.log("Task : copy...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        // console.log("mypackagename",mypackagename);
        if (!mypackage.scripts) mypackage.scripts = [] ;
        var packagesjsModified = false ;
        async.series([
            // check if tasks/packages.js modified
            (nextTask)=> {
                taskutils.checkFilesModified('tasks/packages.js', (modified1)=> {
                    packagesjsModified = modified1 ;
                    nextTask() ;
                }) ;
            },

            // copy scripts
            (nextTask)=> {
                async.eachSeries(mypackage.scripts, (script, nextScript)=> {
                    if (script.indexOf('|')>=0) {
                        let t = script.split('|') ;
                        taskutils.checkFilesModified(t[1], (modified)=> {
                            if (!modified && !packagesjsModified) return nextScript() ;
                            fs.copy(t[1], 'assets/'+t[0], function (err) {
                                if (err) console.error(err);
                                // console.log("success!");
                                nextScript() ;
                            });
                        }) ;
                    } else nextScript() ;
                }, ()=> {
                    nextTask() ;
                }) ;
            },

            // copy styles
            (nextTask)=> {
                async.eachSeries(mypackage.styles, (style, nextStyle)=> {
                    if (style.indexOf('|')>=0) {
                        let t = style.split('|') ;
                        taskutils.checkFilesModified(t[1], (modified)=> {
                            if (!modified) return nextStyle() ;
                            fs.copy(t[1], 'assets/'+t[0], function (err) {
                                if (err) console.error(err);
                                // console.log("success!");
                                nextStyle() ;
                            });
                        });
                    } else nextStyle() ;
                }, ()=> {
                    nextTask() ;
                }) ;
            },

            // copy fonts
            (nextTask)=> {
                async.eachSeries(mypackage.fonts, (font, nextFont)=> {
                    if (font.indexOf('|')>=0) {
                        let t = font.split('|') ;
                        taskutils.checkFilesModified(t[1], (modified)=> {
                            if (!modified) return nextFont() ;
                            fs.copy(t[1], 'assets/'+t[0], function (err) {
                                if (err) console.error(err);
                                // console.log("copy",t[1], 'assets/'+t[0]);
                                nextFont() ;
                            });
                        });
                    } else nextFont() ;
                }, ()=> {
                    nextTask() ;
                }) ;
            },

            // copy Shared
            (nextTask)=> {
                taskutils.checkFilesModified('services/Shared.js', (modified)=> {
                    if (!modified) return nextTask() ;
                    fs.readFile(morphineserver.rootDir+'/services/Shared.js', 'utf8', function (err,contents) {
                        if (err) return console.log(err);
                        // var tabLines = contents.split('\n');
                        // var contentsBis = "" ;
                        // for (var i = 0; i < tabLines.length; i++) {
                        //     if (i>0) contentsBis += tabLines[i]+"\n" ;
                        // }
                        // contents = contentsBis ;
                        contents = contents.replace(/module\.exports/g, "export var Shared") ;
                        // contents += "\nexport var Shared;" ;
                        contents = "// NE PAS MODIFIER CE FICHIER !!!\n// MODIFIER LE FICHIER /api/services/Shared.js\n"+contents ;
                        // grunt.file.write('assets/js/js6/libs/Shared.js', contents, { encoding: 'utf8' }) ;
                        fs.writeFile(morphineserver.rootDir+"/assets/compiled/Shared.js", contents, function (err) {
                            if (err) return console.log(err);
                            nextTask() ;
                        });

                    });
                });


            },

            // copy models
            (nextTask)=> {
                let models = fs.readdirSync(morphineserver.rootDir+'/models') ;
                fs.ensureDir(morphineserver.rootDir+'/assets/compiled/models/', function (err) {
                    async.eachSeries(models, (model, nextModel)=> {
                        taskutils.checkFilesModified('models/'+model, (modified)=> {
                            if (!modified) return nextModel() ;
                            model = model.substring(0,model.length-3) ;
                            var def = require(morphineserver.rootDir+'/models/'+model) ;
                            var mods = "" ;
                            mods += "'use strict';\nimport {M_} from './../../../libs-client/M_.js';\nexport class MT_"+model+" extends M_.Model {\ngetDefinition() {\nreturn {\n" ;
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
                        }) ;
                    }, ()=> {
                        nextTask() ;
                    }) ;
                }) ;
            },


        ], ()=> {
            nextPackage() ;
        }) ;
    }, function() {
        console.log("ok");
        cb() ;
    }) ;
} ;