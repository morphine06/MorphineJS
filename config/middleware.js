module.exports = {
	transform: (req, res, next) => {
		res.notfound = () => {
			// is Ajax request
			if (req.xhr) {
				res.status(404).send("Not found !");

				// is view request
			} else {
				res.render("404", {
					layout: false,
					title: "Not found",
					text: "This ressource is not found"
				});
			}
		};
		res.forbidden = () => {
			// is Ajax request
			if (req.xhr) {
				res.status(403).send("Forbidden !");

				// is view request
			} else {
				res.render("404", {
					layout: false,
					title: "Forbidden",
					text: "You don't have access to this ressource"
				});
			}
		};
		next();
	}
};
