/*
if you return false to a policy, you must do something with "res"... res.redirect or res.send an error
*/

module.exports = {
	calculateOptionsRights: (user, cb) => {
		OptionsServices.get(0, "allrights_" + user.co_type, function(defaultRights) {
			// console.log("defaultRights",defaultRights);
			var rights = {};
			if (!user.co_rights) {
				user.co_rights = {};
				_.each(Shared.getRights(), function(right) {
					user.co_rights[right.key] = 2;
				});
			}
			_.each(Shared.getRights(), function(right) {
				var ok = false;
				if (defaultRights && (defaultRights[right.key] && user.co_rights[right.key])) ok = true;
				if (user.co_rights[right.key] === true) ok = true;
				rights[right.key] = ok;
			});
			user.rights = rights;
			cb(rights);
		});
	},
	accessBackend: function(req, res, next) {
		// console.log("test1bis",req.user);
		if (req.headers["x-auth-apikey"]) {
			this.checkToken(req, (err, row_co) => {
				if (err) {
					Services.sendWebservices(res, { err: err });
					next(false);
				} else {
					req.user = row_co;
					next(true);
				}
			});
		} else {
			// console.log("req.user2",req.user);
			// console.log("req.session",req.session);
			if (req.user && req.user.co_id) return next(true);
			res.redirect("/?err=2");
			return next(false);
		}
	},
	accessFrontend: function(req, res, next) {
		// console.log("test2bis");
		next(true);
	},
	checkToken: (req, cb) => {
		// console.log("req.headers", req.headers);
		if (!req.headers["x-auth-apikey"]) return cb({ code: 1000, message: "API user key and API secret mandatory" }, null);
		if (!req.headers["x-auth-apisecret"]) return cb({ code: 1000, message: "API user key and API secret mandatory" }, null);
		Contacts.findOne({
			co_apikey: req.headers["x-auth-apikey"],
			co_apisecret: req.headers["x-auth-apisecret"]
		}).exec(function(errsql, row_co) {
			if (!row_co) return cb({ code: 1001, message: "Bad user token" }, null);
			return cb(null, row_co);
		});
	},
	allowAlreadyTrue: () => {
		return true;
	}
};
