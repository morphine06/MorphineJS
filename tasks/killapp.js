"use strict";

var fs = require('fs') ;

module.exports = (cb)=> {
    console.log("Task : killapp...".green) ;
    process.kill(process.pid, 'SIGUSR2');
} ;