'use strict';

import {M_} from './../../../libs/M_.js' ;
import {MT_Jobs} from './../../compiled/models/MT_Jobs.js' ;


export class Home extends M_.Controller {
    constructor(opts) {
        console.log("MT_Jobs",MT_Jobs);
        opts.tpl = JST['assets/templates/backend/Home.html'] ;
        super(opts) ;
    }
	init() {
        console.log("init");
		// console.log("M_.Utils.isEventSupported('click')",M_.Utils.isEventSupported('click'));
		// console.log("M_.Utils.isEventSupported('search')",M_.Utils.isEventSupported('search'));
	}
	create() {
        console.log("create");
	}
	indexAction() {
        console.log("indexAction");
	}
}
