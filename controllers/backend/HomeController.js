"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	index(req, res) {
		res.render("backend/index", {
			layout: "backend/layout"
		});
	}
	infos(req, res) {
		// console.log("req.user",req.user);
		if (!req.user.co_rights) req.user.co_rights = {};
		// Services.calculateOptionsRights(req.user, ()=> {
		Lists.find("li_group=? order by li_position", ["system_opportunities_step"]).exec((errsql, rows_li) => {
			// this.send(res, { user: req.user, opportunitiesSteps: rows_li });
			Services.sendWebservices(res, { err: null, user: req.user, opportunitiesSteps: rows_li });
		});
		// }) ;
	}
};
