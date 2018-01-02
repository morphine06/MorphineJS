"use strict";

var compressor = require("node-minify");
var fs = require("fs-extra");

module.exports = cb => {
	console.warn("Task : compile-styles...".green);
	let packages = require(morphineserver.rootDir + "/tasks/packages");
	async.eachOfSeries(
		packages,
		(mypackage, mypackagename, nextPackage) => {
			if (!mypackage.styles) mypackage.styles = [];
			async.series(
				[
					// (nextcompressor)=> {
					//     if (mypackage.less && mypackage.less.length) {
					//         var less = require('less');
					//         async.eachSeries(mypackage.less, (f, nextLess)=> {
					//             console.log("f",f);
					//             fs.readFile(f, 'utf8', (err, data)=> {
					//                 // console.log("data",data);
					//                 less.render(data, function (err, output) {
					//                     if (err) console.log(err);
					//                     // console.log("output",output);
					//                     fs.writeFile('assets/compiled/'+mypackagename+'-less.css', output.css, 'utf8', ()=> {
					//                         mypackage.styles.push('assets/compiled/'+mypackagename+'-less.css') ;
					//                         nextLess() ;
					//                     });
					//                 });
					//
					//             });
					//         }, ()=> {
					//             nextcompressor() ;
					//         }) ;
					//     } else nextcompressor() ;
					// },
					nextcompressor => {
						if (mypackage.styles && mypackage.styles.length) {
							console.warn("mypackage.styles", mypackage.styles);
							let concat = "assets/compiled/" + mypackagename + "-concat.css";
							fs.ensureFileSync("assets/compiled/" + mypackagename + ".css");
							_.each(mypackage.styles, (style, index) => {
								if (style == "less") {
									let t = fs.readFileSync("assets/compiled/" + mypackagename + "-less.css", "utf8");
									fs.appendFileSync(concat, t);
								} else if (style.indexOf("|") >= 0) {
									let s = style.split("|");
									let t = fs.readFileSync("assets/" + s[0], "utf8");
									fs.appendFileSync(concat, t);
								} else {
									let t = fs.readFileSync("" + style, "utf8");
									fs.appendFileSync(concat, t);
								}
							});
							compressor.minify({
								compressor: "csso",
								input: concat,
								output: "assets/compiled/" + mypackagename + ".css",
								// tempPath: '.tmp/',
								callback: function(err, min) {
									if (err) console.warn(err);
									//console.log(min);
									nextcompressor();
								}
							});
						} else nextcompressor();
					}
				],
				() => {
					nextPackage();
				}
			);
		},
		function() {
			console.warn("ok");
			cb();
		}
	);
};
