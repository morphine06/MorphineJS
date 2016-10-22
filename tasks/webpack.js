"use strict";

var fs = require('fs') ;
var path = require('path') ;
var webpack = require("webpack");

module.exports = (cb)=> {
    console.log("Task : webpack...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        async.series([
            (nextTask)=> {
                if (mypackage.es6EntryPoint) {
                    webpack({
                        entry: morphineserver.rootDir+'/'+mypackage.es6EntryPoint,
                        output: {
                            filename: mypackagename+'-es6.js',
                            path: morphineserver.rootDir+'/assets/compiled/',
                            sourceMapFilename: "[file].map",
                        },
                        devtool: '#source-map',
                        debug: true,
                        module: {
                            loaders: [
                                {
                                    test: /\.js$/,
                                    // exclude: /node_modules/,
                                    loader: 'babel-loader'
                                // }, {
                                //     test: /\/js\/.+\.js$/,
                                //     // exclude: /node_modules/,
                                //     loader: 'imports?jQuery=jquery,$=jquery,this=>window'
                                }
                            ]
                        }
                    }, function(err, stats) {
                        if (err) console.log("err",err);
                        // console.log("stats",stats);
                        // mypackage.scripts.push('assets/compiled/'+mypackagename+'-es6.js') ;
                        // var systemjsPath = path.dirname(require.resolve('systemjs')) ;
                        // mypackage.scripts.unshift(systemjsPath+'/dist/system.js') ;
                        nextTask() ;
                    });

                } else nextTask() ;
            },
        ], ()=> {
            nextPackage() ;
        }) ;
    }, function() {
        cb() ;
    }) ;
} ;