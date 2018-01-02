"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	index(req, res) {
		res.render("frontend/index", {
			layout: "frontend/layout"
		});
	}
	logout(req, res) {
		req.logout();
		res.redirect("/");
	}

	login(req, res) {
		Passport.authenticate("local", (err, user, info) => {
			// console.log("err,user,info",err,user,info);
			// console.log("req.user",req.user);
			if (err || !user) return res.redirect("/?err=3");

			req.login(user, err => {
				if (err) return res.redirect("/?err=1");
				res.redirect("/backend");
			});
		})(req, res);
	}
};
