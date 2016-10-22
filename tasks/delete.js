"use strict";

var compressor = require('node-minify');
var fs = require('fs-extra') ;

module.exports = (cb)=> {
    console.log("Task : 'delete'...".green) ;
    let toDelete = ['assets/compiled'] ;
    async.eachSeries(toDelete, (dir, nextDir)=> {
        fs.emptydir(dir, (err) => {
            nextDir() ;
        }) ;
    }, () => {
        cb() ;
    }) ;
} ;