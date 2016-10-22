"use strict";

var fs = require('fs') ;

module.exports = (cb)=> {
    setTimeout(()=> {
        // this._watchAssets = true ;
        console.log(("Livereload from "+morphineserver.config._lastWatch).red);
        morphineserver.livereloadServer.refresh(morphineserver.config._lastWatch) ;
        cb() ;
    }, 1000) ;
} ;