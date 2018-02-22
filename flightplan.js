/*
fly publish:dev
npm version 1.0.54
npm publish
*/

var plan = require("flightplan");
plan.target("dev", {
	host: "www.wywiwyg.net",
	username: "root",
	agent: process.env.SSH_AUTH_SOCK
});
// var commentgit = (process.argv[3])?process.argv[3]:'automatic commit' ;

plan.local("publish", function(local) {
	local.exec("git add .");
	var input = local.prompt("Commit message ?");
	if (input === "") plan.abort("Commit message mandatory");
	local.exec('git commit -m "' + input + '"');
	local.exec("git push");
});

plan.remote("publish", function(remote) {
	remote.with("cd /home/MorphineJS", function() {
		remote.exec("git pull");
		// remote.exec("npm install");
		remote.exec("supervisorctl restart morphinejs");
	});
});
