"use strict";

var fs = require("fs-extra");

module.exports = {
	checkFilesModified: (file, cb) => {
		if (!fs.existsSync(morphineserver.rootDir + "/" + file)) return cb(false);
		// check files modified
		// let tabFilesToCheck = ['assets', ''] ;
		// let allFiles = [] ;
		fs.ensureDirSync(morphineserver.rootDir + "/.tmp");

		let lastModificationDate = moment("1974-10-12").toDate();
		let lastModificationDateSaved = moment()
			.add(-10, "years")
			.toDate();
		if (fs.existsSync(morphineserver.rootDir + "/.tmp/.morphinejs.conf.json")) {
			let conf = fs.readJsonSync(morphineserver.rootDir + "/.tmp/.morphinejs.conf.json");
			if (conf.lastmodificationdate) lastModificationDateSaved = moment(conf.lastmodificationdate).toDate();
		}
		let causedBy = "";
		fs
			.walk(morphineserver.rootDir + "/" + file)
			.on("data", item => {
				// allFiles.push(item) ;
				if (item.stats.mtime > lastModificationDate) {
					lastModificationDate = item.stats.mtime;
					causedBy = item.path;
				}
			})
			.on("end", () => {
				// console.log("lastModificationDate",lastModificationDate, lastModificationDateSaved);
				if (lastModificationDate.getTime() >= lastModificationDateSaved.getTime()) {
					console.warn("Caused by...".green + " : " + causedBy);
					cb(true);
				} else cb(false);
			});
	},
	setFilesModified: () => {
		fs.writeJsonSync(morphineserver.rootDir + "/.tmp/.morphinejs.conf.json", {
			lastmodificationdate: moment()
				.add(1, "second")
				.format("YYYY-MM-DD HH:mm:ss")
		});
	}
};
