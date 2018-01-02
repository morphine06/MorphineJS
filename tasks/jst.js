"use strict";

var fs = require("fs");
var globule = require("globule");
var taskutils = require("./taskutils");

module.exports = cb => {
	console.warn("Task : jst...".green);
	let packages = require(morphineserver.rootDir + "/tasks/packages");
	taskutils.checkFilesModified("assets/templates", modified => {
		if (!modified) {
			console.warn("ok");
			return cb();
		}
		async.eachOfSeries(
			packages,
			(mypackage, mypackagename, nextPackage) => {
				async.series(
					[
						nextTask => {
							if (mypackage.jst && mypackage.jst.length) {
								let files = globule.find(mypackage.jst);
								// console.log("files",files);
								var res = "var JST = {\n";
								_.each(files, f => {
									var data = fs.readFileSync(f, "utf8");
									res += '"' + f + '": ' + _.template(data).source + ",\n\n\n";
								});
								res += "};\n";
								fs.writeFile(morphineserver.rootDir + "/assets/compiled/" + mypackagename + "-jst.js", res, "utf8", () => {
									// mypackage.scripts.push('assets/compiled/'+mypackagename+'-jst.js') ;
									nextTask();
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
	});
};
