"use strict";

/* dimanche 23 octobre 2016, première version entiérement fonctionnelle de morphinejs */

var nodemon = require("nodemon");
var config = require("./config/tasks");
var chalk = require("chalk");
var watch = [".tmp"];
// var globule = require('globule');
for (var i = 0; i < config.watch.length; i++) {
	if (config.watch[i].restart) {
		// var filepaths = globule.find(config.watch[i].dirs, {filter:'isDirectory'});
		// console.log("filepaths",filepaths);
		for (var j = 0; j < config.watch[i].dirs.length; j++) {
			var p = config.watch[i].dirs[j];
			p = p.replace("/**", "");
			p = p.replace("/*", "");
			watch.push(p);
		}
	}
}

nodemon({
	script: "prod.js",
	ext: "js json",
	// args: ['ENV=development', 'PORT=5000'],
	env: {
		ENV: "development"
		// PORT: 8000
	},
	// ignore: [".tmp/**", "assets/**", "views/**"],
	// verbose: true,
	watch: watch
});

nodemon
	.on("start", () => {
		console.warn(chalk.green("!!!!App has started in development mode"));
		// console.log("nodemon.config",nodemon.config);
	})
	.on("quit", () => {
		console.warn(chalk.gray("!!!!App has quit"));
	})
	.on("restart", files => {
		console.warn(chalk.gray("!!!!App restarted due to: "), files);
	});
