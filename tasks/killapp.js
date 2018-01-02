"use strict";

module.exports = cb => {
	console.warn("Task : killapp...".green);
	process.kill(process.pid, "SIGUSR2");
};
