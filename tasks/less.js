"use strict";

var fs = require("fs");
var path = require("path");
var less = require("less");
var taskutils = require("./taskutils");

module.exports = cb => {
	console.warn("Task : less...".green);
	let packages = require(morphineserver.rootDir + "/tasks/packages");
	async.eachOfSeries(
		packages,
		(mypackage, mypackagename, nextPackage) => {
			async.series(
				[
					nextTask => {
						if (mypackage.less) {
							taskutils.checkFilesModified("assets/css", modified => {
								if (!modified) return nextTask();
								async.eachSeries(
									mypackage.less,
									(f, nextFile) => {
										fs.readFile(morphineserver.rootDir + "/" + f, "utf8", (err, data) => {
											// console.log("data",data);
											var dirTem = path.dirname(morphineserver.rootDir + "/" + f);
											less.render(
												data,
												{
													paths: [dirTem],
													sourceMap: { sourceMapFileInline: true },
													strictMath: true
												},
												function(err, output) {
													if (err) console.warn(err);
													// console.log("output",output);
													fs.writeFile("assets/compiled/" + mypackagename + "-less.css", output.css, "utf8", () => {
														// mypackage.styles.push('assets/compiled/'+mypackagename+'-less.css') ;
														// nextFile() ;
														nextTask();
													});
												}
											);
										});
									},
									() => {
										nextTask();
									}
								);
							});
						} else nextTask();
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
