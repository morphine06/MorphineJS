"use strict";

var fs = require('fs') ;
var path = require('path') ;
var less = require('less');
var compressor = require('node-minify');

module.exports = (cb)=> {
    console.log("Task : minify-scripts...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        async.series([
            (nextTask)=> {

                if (mypackage.scripts && mypackage.scripts.length) {
                    let cool = [] ;
                    _.each(mypackage.scripts, (script)=> {
                        if (script.indexOf('|')>=0) {
                            let t = script.split('|') ;
                            cool.push('assets/compiled/'+t[0]) ;
                        } else if (script=='es6') {
                            cool.push('assets/compiled/'+mypackagename+'-es6.js') ;
                        } else if (script=='jst') {
                            cool.push('assets/compiled/'+mypackagename+'-jst.js') ;
                        } else {
                            cool.push(script) ;
                        }
                    }) ;
                    // console.log("cool",cool);
                    new compressor.minify({
                        type: 'uglifyjs',
                        fileIn: cool,
                        fileOut: 'assets/compiled/'+mypackagename+'.js',
                        tempPath: '.tmp/',
                        callback: function(err, min){
                            if (err) console.log(err);
                            //console.log(min);
                            nextTask() ;
                        }
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
