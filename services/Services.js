"use strict";

module.exports = {
	sendWebservices: (res, obj) => {
		if (obj.err) return res.status(400).send(obj);
		res.send(obj);
	},
	scripts: mypackage => {
		let packages = require(morphineserver.rootDir + "/tasks/packages");
		// let fs = require('fs-extra') ;
		var pack = packages[mypackage];
		var res = "";
		if (pack.scripts) {
			_.each(pack.scripts, script => {
				if (script == "es6") {
					res += "<script src='/compiled/" + mypackage + "-es6.js'></script>\n";
				} else if (script == "jst") {
					res += "<script src='/compiled/" + mypackage + "-jst.js'></script>\n";
				} else if (script.indexOf("|") >= 0) {
					let s = script.split("|");
					res += "<script src='/" + s[0] + "'></script>\n";
				} else {
					let s = script.replace(/assets/, "");
					res += "<script src='" + s + "'></script>\n";
				}
			});
		}
		return res;
	},
	styles: mypackage => {
		let packages = require(morphineserver.rootDir + "/tasks/packages");
		var pack = packages[mypackage];
		var res = "";

		var nbAdded = 0;
		if (pack.styles && pack.styles.length) {
			_.each(pack.styles, (style, index) => {
				if (nbAdded > 0) res += "\t";
				if (style == "less") {
					res += '<link rel="stylesheet" href="/compiled/' + mypackage + '-less.css" />\n';
				} else if (style.indexOf("|") >= 0) {
					let s = style.split("|");
					res += '<link rel="stylesheet" href="/' + s[0] + '" />\n';
				} else {
					let s = style.replace(/assets/, "");
					res += '<link rel="stylesheet" href="' + s + '" />\n';
				}
				nbAdded++;
			});
		}
		return res;
	},
	smoothContact: (row_co, user, cb, long, exceptions) => {
		if (!row_co) return cb(null);
		let unauthFields = [
			"co_password",
			"co_apikey",
			"co_apisecret",
			"co_rights",
			"co_geo_lat",
			"co_geo_lng",
			"co_token_stripe",
			"co_token_facebook",
			"co_token_apple",
			"co_token_google",
			"co_admin"
		];
		if (long)
			unauthFields = [
				"co_password",
				"co_apikey",
				"co_apisecret",
				"co_rights",
				"co_geo_lat",
				"co_geo_lng",
				"co_token_stripe",
				"co_token_facebook",
				"co_token_apple",
				"co_token_google",
				"co_admin"
			];
		if (user && row_co.co_id == user.co_id) unauthFields = [];
		_.each(row_co, (val, key) => {
			if (_.indexOf(unauthFields, key) >= 0) delete row_co[key];
		});
		cb(row_co);
	},
	findVacationsManagers: cb => {
		Contacts.find({ co_id: 1 }).exec((errsql, rows_co) => {
			cb(rows_co);
		});
	},
	smoothContacts: (rows_co, field, user, cb, long, exceptions) => {
		if (field) {
			async.eachSeries(
				rows_co,
				(row_co, next) => {
					if (row_co && row_co[field]) {
						Services.smoothContact(
							row_co[field],
							user,
							() => {
								next();
							},
							long,
							exceptions
						);
					} else {
						next();
					}
				},
				() => {
					cb(rows_co);
				}
			);
		} else {
			async.eachSeries(
				rows_co,
				(row_co, next) => {
					Services.smoothContact(
						row_co,
						user,
						() => {
							next();
						},
						long,
						exceptions
					);
				},
				() => {
					cb(rows_co);
				}
			);
		}
	},
	livereload: () => {
		var res = "";
		if (morphineserver.config.environment == "development") {
			res +=
				"<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] +':" +
				morphineserver.config.tasks.livereloadPort +
				"/livereload.js?snipver=1\"></' + 'script>')</script>";
		}
		return res;
	},
	err: code => {
		let errs = [
			{ code: 100, message: "Bad login or password" },
			{ code: 101, message: "Email (co_email) mandatory" },
			{ code: 132, message: "UUID mandatory" },
			{ code: 102, message: "Password (co_password) mandatory" },
			{ code: 103, message: "Inactive account" },
			{ code: 104, message: "Account with this email already exists" },
			{ code: 107, message: "Account with this login already exists" },
			{ code: 105, message: "Login (co_login) mandatory" },
			{ code: 106, message: "Password mandatory" },
			{ code: 108, message: "Name mandatory" },
			{ code: 109, message: "Firstname mandatory" },
			{ code: 110, message: "eMail mandatory" },
			{ code: 111, message: "Device token mandatory" },
			{ code: 112, message: "Platform mandatory" },
			{ code: 113, message: "Operating System mandatory" },
			{ code: 114, message: "App version mandatory" },
			{ code: 115, message: "Local mandatory" },
			{ code: 118, message: "Relation already exists" },
			{ code: 119, message: "Link patient/doctor already exists" },
			{ code: 131, message: "Password not valid..." },
			{ code: 133, message: "Access token Facebook not found" },
			{ code: 134, message: "Association team/doctor exists" },
			{ code: 135, message: "co_type not ok" },
			{ code: 403, message: "Forbidden" },
			{ code: 404, message: "Not found" },
			{ code: 500, message: "Internal Server Error" },
			{ code: 1000, message: "User token mandatory" },
			{ code: 1001, message: "Bad user token" },
			{ code: 1003, message: "Request token (x-auth-requesttoken) and Token (x-auth-token) mandatory" },
			{ code: 1004, message: "Request token not found" },
			{ code: 1005, message: "Request token already used" },
			{ code: 1006, message: "Timestamp delay (10 seconds) exceeded" },
			{ code: 1007, message: "Token (x-auth-token) not valid" },
			{ code: 2000, message: "Invalid document type" },
			{ code: 2001, message: "Patient id required" },
			{ code: 2002, message: "Incorrect Doctor id" },
			{ code: 2003, message: "Patient id cannot be modified" },
			{ code: 2004, message: "Invalid form type" },
			{ code: 2005, message: "Doctor id required" },
			{ code: 2006, message: "Surgery date required" },
			{ code: 2007, message: "Form id required" },
			{ code: 2008, message: "Incorrect Patient id" },
			{ code: 2009, message: "Form id required" },
			{ code: 2010, message: "ToolsSecondary required" },
			{ code: 2011, message: "Invalid form id" },
			{ code: 2012, message: "Follow-up name required" },
			{ code: 2013, message: "Invalid form start date" },
			{ code: 2014, message: "Instance in progress" },
			{ code: 2015, message: "No parameter set" }
		];
		return _.find(errs, { code: code });
	}
};
