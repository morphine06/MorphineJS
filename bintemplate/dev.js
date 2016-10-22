"use strict";


var nodemon = require('nodemon');
var config = require('./config/tasks') ;

nodemon({
    script: 'prod.js',
    ext: 'js json',
    // args: ['ENV=development', 'PORT=5000'],
    env: {
        ENV: 'development',
        // PORT: 8000
    },
    // ignore: [".tmp/**", "assets/**", "views/**"],
    // verbose: true,
    watch: ['.tmp']
});

nodemon.on('start', ()=> {
    console.log('!!!!App has started');
    // console.log("nodemon.config",nodemon.config);
}).on('quit', ()=> {
    console.log('!!!!App has quit');
}).on('restart', (files)=> {
    console.log('!!!!App restarted due to: ', files);
});
