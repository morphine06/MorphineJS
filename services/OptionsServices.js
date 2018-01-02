"use strict";

module.exports = {
	get: function(co_id, name, cb) {
		Options.findOne({ name: name, co_id: co_id }).exec(function(errsql, row) {
			if (!row || !row.val) return cb(null);
			// console.log("row.val", row.val);
			cb(JSON.parse(row.val));
		});
	},
	set: function(co_id, name, val, cb) {
		Options.replace(
			{ name: name, co_id: co_id },
			[],
			{
				name: name,
				co_id: co_id,
				val: JSON.stringify(val)
			},
			function() {
				cb(val);
			}
		);
	},
	// warning : problème de sécurité, possible à un simple user de modifier les préférences générales
	saveAllOptions: function(co_id, opts, cb) {
		var me = this;
		var allOptions = this.getDefOptions();
		// var good = [] ;
		var optsok = [];
		_.forEach(opts, function(opt, key) {
			var ok = false;
			_.forEach(allOptions, function(opt) {
				if (opt[0] == key) ok = true;
			});
			if (ok) optsok.push([key, opt]);
		});
		// console.log("optsok",optsok);
		async.each(
			optsok,
			function(opt, next) {
				me.set(co_id, opt[0], opt[1], function() {
					next();
				});
			},
			function() {
				cb();
			}
		);
	},
	getDefOptions: function() {
		return [
			["activelanguages", "global", ["fr", "uk"]],
			["persomailinglist", "perso", true],
			["persohelp", "perso", true],
			["persoallcals", "perso", false],
			["persoweekend", "perso", true],
			["persomovevent", "perso", false],
			["persostartcal", "perso", 8],
			["persoinvertname", "perso", false],
			["allsendemailempty", "global", true],
			["allnextref", "global", 1],
			["allholidays", "global", ""],
			["allnameserver", "global", "localhost"]
			// ['allvacationadmin2', 'global', ''],
			// ['allvacationadmin3', 'global', ''],
		];
	},
	getAllOptions: function(co_id, cb) {
		var allOptions = this.getDefOptions();
		var opts = {};
		var me = this;
		async.each(
			allOptions,
			function(optdef, next) {
				if (co_id === "" && optdef[1] == "perso") return next();
				if (co_id !== "" && optdef[1] == "global") return next();
				me.get(co_id, optdef[0], function(opt) {
					// console.log("optdef",optdef[0], opt)
					if (opt === null) opt = optdef[2];
					opts[optdef[0]] = opt;
					next();
				});
			},
			function() {
				cb(opts);
			}
		);
	}
	// getAllUserRights: function (user, cb) {
	// 	var optionsRights = {} ;
	// 	async.eachSeries(Shared.getRights(), function (right, nextRight) {
	// 		Services.getUserRight(user.co_id, user.co_type, right.key, function (ok) {
	// 			optionsRights[right.key] = ok ;
	// 			nextRight() ;
	// 		}) ;
	// 	}, function () {
	// 		cb(optionsRights) ;
	// 	}) ;
	// }
};
