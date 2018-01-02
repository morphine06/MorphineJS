"use strict";

module.exports = class {
	before(req, res, next) {
		// console.log("before",req.controller);
		next();
	}
	policies(req, res, next) {
		let ok = true;
		async.eachSeries(
			req.policies,
			(policy, nextPolicy) => {
				if (!Policies[policy]) {
					console.warn("Policy " + policy + " not found");
					ok = false;
					return nextPolicy();
				}
				Policies[policy](req, res, ok => {
					if (!ok) ok = false;
					nextPolicy();
				});
			},
			() => {
				next(ok);
			}
		);
	}
	render(page, params) {
		this.res.render(page, params);
	}
	send(res, data) {
		if (_.isObject(data) && data.err) return res.status(400).send({ err: data.err });
		res.send(data);
	}
};
