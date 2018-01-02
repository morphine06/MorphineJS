"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import {MT_Jobs} from '../../compiled/models/MT_Jobs.js' ;

export class Home extends M_.Controller {
	constructor(opts) {
		// console.log("MT_Jobs",MT_Jobs);
		opts.tpl = JST["assets/templates/backend/Home.html"];
		super(opts);
	}
	init() {
		console.warn("init");
		// console.log("M_.Utils.isEventSupported('click')",M_.Utils.isEventSupported('click'));
		// console.log("M_.Utils.isEventSupported('search')",M_.Utils.isEventSupported('search'));
	}
	create() {
		console.warn("create");
		// var chart = c3.generate({
		//     bindto: '#chart',
		//     data: {
		//         columns: [
		//             ['data1', 30, 200, 100, 400, 150, 250],
		//             ['data2', 50, 20, 10, 40, 15, 25]
		//         ]
		//     }
		// });
	}
	indexAction() {
		console.warn("indexAction");
	}
}
