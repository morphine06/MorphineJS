"use strict";

module.exports = {
    calculateOptionsRights: (user, cb)=> {
        OptionsServices.get(0, 'allrights_'+user.co_type, function (defaultRights) {
            // console.log("defaultRights",defaultRights);
            var rights = {} ;
            if (!user.co_rights) {
                user.co_rights = {} ;
                _.each(Shared.getRights(), function (right) {
                    user.co_rights[right.key] = 2 ;
                }) ;
            }
            _.each(Shared.getRights(), function (right) {
                var ok = false ;
                if (defaultRights && ((defaultRights[right.key] && user.co_rights[right.key]))) ok = true ;
                if (user.co_rights[right.key]===true) ok = true ;
                rights[right.key] = ok ;
            }) ;
            user.rights = rights ;
            cb(rights) ;
        }) ;

    },
    sendWebservices: (res, obj)=> {
        if (obj.err) return res.status(400).send(obj) ;
        res.send(obj) ;
    },
    scripts: (mypackage) => {
        let packages = require(morphineserver.rootDir+'/tasks/packages') ;
        // let fs = require('fs-extra') ;
        var pack = packages[mypackage] ;
        var res = '' ;
        if (pack.scripts) {
            _.each(pack.scripts, (script)=> {
                if (script=='es6') {
                    res += "<script src='/compiled/"+mypackage+"-es6.js'></script>\n" ;
                } else if (script=='jst') {
                    res += "<script src='/compiled/"+mypackage+"-jst.js'></script>\n" ;
                } else if (script.indexOf('|')>=0) {
                    let s = script.split('|') ;
                    res += "<script src='/"+s[0]+"'></script>\n" ;
                } else {
                    let s = script.replace(/assets/, '') ;
                    res += "<script src='"+s+"'></script>\n" ;
                }
            }) ;
        }
        return res ;
    },
    styles: (mypackage)=> {
        let packages = require(morphineserver.rootDir+'/tasks/packages') ;
        var pack = packages[mypackage] ;
        var res = '' ;

        var nbAdded = 0 ;
        if (pack.styles && pack.styles.length) {
            _.each(pack.styles, (style, index)=> {
                if (nbAdded>0) res += '\t' ;
                if (style=='less') {
                    res += '<link rel="stylesheet" href="/compiled/'+mypackage+'-less.css" />\n' ;
                } else if (style.indexOf('|')>=0) {
                    let s = style.split('|') ;
                    res += '<link rel="stylesheet" href="/'+s[0]+'" />\n' ;
                } else {
                    let s = style.replace(/assets/, '') ;
                    res += '<link rel="stylesheet" href="'+s+'" />\n' ;
                }
                nbAdded++ ;
            }) ;
        }
        return res ;
    },
    livereload: ()=> {
        var res = '' ;
        if (morphineserver.config.environment=='development') {
            res += '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] +\':'+ morphineserver.config.tasks.livereloadPort+'/livereload.js?snipver=1"></\' + \'script>\')</script>' ;
        }
        return res ;
    }

} ;