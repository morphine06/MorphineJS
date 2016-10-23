#!/usr/bin/env node
"use strict";

var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var async = require('async');
// var sys = require('sys')
var exec = require('child_process').exec;

// var co = require('co');
// var prompt = require('co-prompt');



var dirCurrent = process.cwd() ;
var dirMorphine = __dirname ;
var project = dirCurrent.split('/').pop() ;
var args = process.argv.slice(2) ;
var _dirPojectsTab = dirMorphine.split('/') ;
_dirPojectsTab.pop() ;
var rootMorphine = _dirPojectsTab.join('/')+'/' ;
var bintemplate = rootMorphine+'bintemplate' ;

if (args=='new') {
    // console.log("bintemplate",bintemplate);
    newAction() ;
    // co(function *() {
    //     var projectname = yield prompt('Nom du projet: ');
    //     console.log('projectname: %s ', projectname);
    //
    // });
}

function newAction() {
    // fs.emptyDirSync('/Users/davidmiglior/Documents/test/test3') ;
    dirCurrent += '/' ;
    let files = fs.readdirSync(dirCurrent) ;
    let empty = true ;
    _.each(files, (file)=> {
        if (file.substr(0,1)!='.') empty = false ;
    }) ;
    if (!empty) {
        console.log(chalk.white.bgRed("Directory not empty. Please create a new directory and re-execute \"morphine new\"")) ;
        return ;
    }
    console.log("Please wait, copy directories and files.");
    let tabCopy = ['assets', 'config', 'controllers', 'models', 'services', 'tasks', 'views', '.babelrc', '.gitignore', '.jshintrc', 'dev.js', 'prod.js'] ;//, 'node_modules'
    async.series([
        (next) => {
            async.eachSeries(tabCopy, (dir, nextDir)=> {
                console.log("Copy : "+rootMorphine+dir+" > "+dirCurrent+dir);
                fs.copy(rootMorphine+dir, dirCurrent+dir, function() {
                    nextDir() ;
                }) ;
            }, ()=> {
                next() ;
            }) ;
        },
        // (next) => {
        //     fs.copy(rootMorphine+'libs', dirCurrent+'node_modules/morphinejs/libs', ()=> {
        //         fs.copy(rootMorphine+'package.json', dirCurrent+'node_modules/morphinejs/package.json', ()=> {
        //             next() ;
        //         }) ;
        //     }) ;
        //
        // },
        (next) => {
            fs.copy(bintemplate+'local.js', dirCurrent+'config/local.js', ()=> {
                next() ;
            }) ;
        },
        (next) => {
            let data = fs.readFileSync(dirCurrent+'tasks/copy.js', {encoding: 'utf-8'}) ;
            data = data.replace('./../../../libs/M_.js','./../../../node_modules/morphinejs/libs/M_.js') ;
            fs.writeFileSync(dirCurrent+'tasks/copy.js', data) ;

            var items = [] ;
            fs.walk(dirCurrent+'assets/js')
            .on('data', (item)=> {
                items.push(item) ;
            })
            .on('end', function () {
                async.eachSeries(items, (item, nextItem)=> {
                    if (item.stats.isFile()) {
                        let data = fs.readFileSync(item.path, {encoding: 'utf-8'}) ;
                        data = data.replace('./../../../libs/M_.js','./../../../node_modules/morphinejs/libs/M_.js') ;
                        fs.writeFileSync(item.path, data) ;
                    }
                    nextItem() ;
                }, ()=> {
                    next() ;
                }) ;
            }) ;

        },
        (next) => {
            let data = fs.readFileSync(bintemplate+'/package.json', {encoding: 'utf-8'}) ;
            data = data.replace('__VAR_NAME__',project) ;
            data = data.replace('__VAR_AUTHOR__',process.env.USER) ;
            fs.writeFileSync(dirCurrent+'package.json', data) ;
            // console.log(chalk.green("Please wait, execute 'npm install'.")) ;
            // execNpmInstall() ;
            // fs.copy(rootMorphine+'node_modules', dirCurrent+'node_modules', function() {
                next() ;
            // }) ;
        }
    ], ()=> {
        console.log(chalk.green("Now execute : \"npm install\"... then :\n'node dev' for launch development.\n'node prod' for production mode."));

    }) ;
}
function execNpmInstall(cb) {
    exec("npm install", function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) console.log('exec error: ' + error);
        cb() ;
    });
}
// function copyDirectory(dirSrc, dirDest, cb) {
//     console.log("Copy directory : ",dirDest);
//     let files = fs.readdirSync(dirSrc) ;
//     // console.log("files",files);
//     async.eachSeries(files, (file, nextFile)=> {
//         if (fs.lstatSync(dirSrc+'/'+file).isDirectory()) {
//             fs.mkdirSync(dirDest+'/'+file) ;
//             copyDirectory(dirSrc+'/'+file, dirDest+'/'+file, nextFile) ;
//         } else if (fs.lstatSync(dirSrc+'/'+file).isFile()) {
//             console.log("Copy file : ",dirSrc+'/'+file);
//             copyFile(dirSrc+'/'+file, dirDest+'/'+file, nextFile) ;
//         } else {
//             nextFile() ;
//         }
//     }, function() {
//         cb() ;
//     }) ;
//
// }
// function copyFile(source, target, cb) {
//     var cbCalled = false;
//     var rd = fs.createReadStream(source);
//     rd.on("error", function(err) {
//         done(err);
//     });
//     var wr = fs.createWriteStream(target);
//     wr.on("error", function(err) {
//         done(err);
//     });
//     wr.on("close", function(ex) {
//         done();
//     });
//     rd.pipe(wr);
//     function done(err) {
//         if (!cbCalled) {
//             cb(err);
//             cbCalled = true;
//         }
//     }
// }







