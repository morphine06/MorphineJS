"use strict";

var gaze = require("gaze");

module.exports = cb => {
	// morphineserver.livereloadServer.watch(morphineserver.config.tasks.livereloadWatch);
	// console.log("process.cwd()",this.config.development.livereloadWatch);
	console.warn("Task : 'watch'...".green);

	_.each(morphineserver.config.tasks.watch, what => {
		if (what.restart) return;
		gaze(what.dirs, function(err, watcher) {
			// _.each(what.dirs, (dir)=> {
			// fs.watch(process.cwd()+"/"+dir, {recursive:true}, (eventType, filename)=> {
			// var watched = this.watched();
			// console.log("watched",watched);

			this.on("all", function(event, filename) {
				console.warn("Watch : /" + filename);
				morphineserver.config._lastWatch = "/" + filename;
				morphineserver.launchTasks(what.tasks, () => {});
			});
			// }) ;
		});
	});

	// this._watchAssets = true ;
	// _.each(morphineserver.config.tasks.livereloadWatch, (dir)=> {
	//     fs.watch(process.cwd()+"/"+dir, {recursive:true}, (eventType, filename)=> {
	//         if (!this._watchAssets) return ;
	//         this._watchAssets = false ;
	//         morphineserver.launchTasks(['delete', 'compile-scripts', 'compile-styles'], ()=> {
	//             setTimeout(()=> {
	//                 this._watchAssets = true ;
	//                 console.log(("Livereload from "+filename).red);
	//                 morphineserver.livereloadServer.refresh(filename) ;
	//             }, 1000) ;
	//         }) ;
	//     }) ;
	// }) ;
	//
	// _.each(morphineserver.config.tasks.apiWatch, (dir)=> {
	//     fs.watch(process.cwd()+"/"+dir, {recursive:true}, (eventType, filename)=> {
	//         console.log(("Restart application from "+filename).red);
	//         process.kill(process.pid, 'SIGUSR2');
	//     }) ;
	// }) ;

	cb();
};
