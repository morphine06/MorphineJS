"use strict";

var compressor = require('node-minify');
var fs = require('fs') ;

module.exports = (cb)=> {
    console.log("Task : compile-styles...".green) ;
    let packages = require(morphineserver.rootDir+'/tasks/packages') ;
    async.eachOfSeries(packages, (mypackage, mypackagename, nextPackage)=> {
        if (!mypackage.styles) mypackage.styles = [] ;
        async.series([
            (nextcompressor)=> {
                if (mypackage.less && mypackage.less.length) {
                    var less = require('less');
                    async.eachSeries(mypackage.less, (f, nextLess)=> {
                        fs.readFile(f, 'utf8', (err, data)=> {
                            // console.log("data",data);
                            less.render(data, function (err, output) {
                                if (err) console.log(err);
                                // console.log("output",output);
                                fs.writeFile('assets/compiled/'+mypackagename+'-less.css', output.css, 'utf8', ()=> {
                                    mypackage.styles.push('assets/compiled/'+mypackagename+'-less.css') ;
                                    nextLess() ;
                                });
                            });

                        });
                    }, ()=> {
                        nextcompressor() ;
                    }) ;
                } else nextcompressor() ;
            },
            (nextcompressor)=> {
                if (mypackage.styles && mypackage.styles.length) {
                    new compressor.minify({
                        type: 'clean-css',
                        fileIn: mypackage.styles,
                        fileOut: 'assets/compiled/'+mypackagename+'.css',
                        tempPath: '.tmp/',
                        callback: function(err, min){
                            if (err) console.log(err);
                            //console.log(min);
                            nextcompressor() ;
                        }
                    });
                } else nextcompressor() ;
            },

        ], ()=> {
            nextPackage() ;
        }) ;
    }, function() {
        cb() ;
    }) ;
} ;