"use strict";

var BaseController = require("../BaseController");

module.exports = class extends BaseController {
	saverights(req, res) {
		async.eachSeries(
			Shared.getRoles(),
			(role, nextRole) => {
				if (role.key === "" || role.key == " ") return nextRole();
				var rights = {};
				_.each(Shared.getRights(), right => {
					var key = role.key + "_" + right.key;
					rights[right.key] = req.body[key];
				});

				// console.log("role, rights", role.key, rights);
				OptionsServices.set(0, "allrights_" + role.key, rights, () => {
					nextRole();
				});
			},
			() => {
				this.send(res, { data: "ok" });
			}
		);
	}
	loadrights(req, res) {
		var data = {};
		async.eachSeries(
			Shared.getRoles(),
			(role, nextRole) => {
				OptionsServices.get(0, "allrights_" + role.key, rights => {
					_.each(rights, (val, right) => {
						var key = role.key + "_" + right;
						data[key] = val;
					});
					nextRole();
				});
			},
			() => {
				this.send(res, { data: data });
			}
		);
	}
};
