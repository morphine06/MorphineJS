"use strict";

module.exports = function(next) {
	// console.log("morphineserver.morphineJsInDev",morphineserver.morphineJsInDev);

	var data = {
		co_id: 1,
		co_name: "Miglior",
		co_firstname: "David",
		co_email: "david@miglior.fr",
		co_login: "david@miglior.fr",
		co_password: "xxxxx",
		co_type: "admin",
		co_active: 1,
		co_geo_lat: "43.709464",
		co_geo_lng: "7.258434",
		co_address1: "5 rue Castel",
		co_address2: "",
		co_zip: "06000",
		co_city: "Nice",
		co_admin: 1,
		co_apikey: "1111",
		co_apisecret: "1111"
	}; //gps nice

	Contacts.replace("co_id=1", [], data, (errsql, row_co) => {
		var tabNum = [];
		for (var i = 2; i <= 20; i++) tabNum.push(i);
		async.eachSeries(
			tabNum,
			(num, nextNum) => {
				let co_type = "user";
				if (num > 10) co_type = "contact";
				Contacts.replace(
					{ co_id: num },
					[],
					{
						co_id: num,
						co_name: _.capitalize(co_type),
						co_firstname: num,
						co_email: "contact" + num + "@email.com",
						co_login: "contact" + num + "@email.com",
						co_password: "xxxxx",
						co_type: co_type,
						co_active: 1,
						co_geo_lat: "43.709464",
						co_geo_lng: "7.258434",
						co_address1: "5 rue Castel",
						co_address2: "",
						co_zip: "06000",
						co_city: "Nice",
						co_admin: 0,
						co_apikey: num,
						co_apisecret: num,
						deleted: 0
					},
					(errsql, row_co) => {
						nextNum();
					}
				);
			},
			() => {
				next();
			}
		);
	});
};
