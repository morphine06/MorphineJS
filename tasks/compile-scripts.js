"use strict";

var compressor = require('node-minify');
var fs = require('fs-extra') ;
var path = require('path') ;
// var browserify = require("browserify");
// var babelify = require("babelify");
var webpack = require("webpack");

module.exports = (cb)=> {
    console.log("Task : compile-scripts...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        // console.log("mypackagename",mypackagename);
        if (!mypackage.scripts) mypackage.scripts = [] ;
        async.series([
            // (nextTask)=> {
            //     if (mypackage.es6EntryPoint) {
            //         webpack({
            //             entry: morphineserver.rootDir+'/'+mypackage.es6EntryPoint,
            //             output: {
            //                 filename: mypackagename+'-es6.js',
            //                 path: morphineserver.rootDir+'/assets/compiled/',
            //                 sourceMapFilename: "[file].map",
            //             },
            //             devtool: '#source-map',
            //             module: {
            //                 loaders: [{
            //                     test: /\.js$/,
            //                     exclude: /node_modules/,
            //                     loader: 'babel-loader'
            //                 }]
            //             }
            //         }, function(err, stats) {
            //             if (err) console.log("err",err);
            //             // console.log("stats",stats);
            //             // mypackage.scripts.push('assets/compiled/'+mypackagename+'-es6.js') ;
            //             // var systemjsPath = path.dirname(require.resolve('systemjs')) ;
            //             // mypackage.scripts.unshift(systemjsPath+'/dist/system.js') ;
            //             nextTask() ;
            //         });
            //
            //     } else nextTask() ;
            // },
            // (nextTask)=> {
            //     if (mypackage.templates && mypackage.templates.length) {
            //         var res = "var JST = {\n" ;
            //         _.each(mypackage.templates, (f)=> {
            //             var data = fs.readFileSync(f, 'utf8') ;
            //             res += '"'+f+'": '+_.template(data).source+',\n\n\n' ;
            //         }) ;
            //         res += '};\n' ;
            //         fs.writeFile(morphineserver.rootDir+'/assets/compiled/'+mypackagename+'-jst.js', res, 'utf8', ()=> {
            //             // mypackage.scripts.push('assets/compiled/'+mypackagename+'-jst.js') ;
            //             nextTask() ;
            //         });
            //     } else nextTask() ;
            //
            // },
            // (nextTask)=> {
            //     async.eachSeries(mypackage.scripts, (script, nextScript)=> {
            //         if (script.indexOf('|')>=0) {
            //             let t = script.split('|') ;
            //             fs.copy(t[1], 'assets/compiled/'+t[0], function (err) {
            //                 if (err) return console.error(err);
            //                 // console.log("success!");
            //                 nextScript() ;
            //             });
            //         } else nextScript() ;
            //     }, ()=> {
            //         nextTask() ;
            //     }) ;
            // },
            // (nextTask)=> {
            //     if (mypackage.scripts && mypackage.scripts.length) {
            //         let cool = [] ;
            //         _.each(mypackage.scripts, (script)=> {
            //             if (script.indexOf('|')>=0) {
            //                 let t = script.split('|') ;
            //                 cool.push('assets/compiled/'+t[0]) ;
            //             } else if (script=='es6') {
            //                 cool.push('assets/compiled/'+mypackagename+'-es6.js') ;
            //             } else if (script=='jst') {
            //                 cool.push('assets/compiled/'+mypackagename+'-jst.js') ;
            //             } else {
            //                 cool.push(script) ;
            //             }
            //         }) ;
            //         // console.log("cool",cool);
            //         new compressor.minify({
            //             type: 'uglifyjs',
            //             fileIn: cool,
            //             fileOut: 'assets/compiled/'+mypackagename+'.js',
            //             tempPath: '.tmp/',
            //             callback: function(err, min){
            //                 if (err) console.log(err);
            //                 //console.log(min);
            //                 nextTask() ;
            //             }
            //         });
            //     } else nextTask() ;
            // },

        ], ()=> {
            nextPackage() ;
        }) ;
    }, function() {
        cb() ;
    }) ;
} ;