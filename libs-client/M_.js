// mettre des types généraux : par exemple "meublé" et "chambre de bonne" dans "appartement" ou "bastide" et "chateau" dans "villa"

// changer update en change pour les événements combobox

//// voir http://jsfiddle.net/jhfrench/GpdgF/ pour un treeview
//// mettre un appel bouton "téléphonique reçu" accessible sur toutes les pages
//// excellent : http://dropthebit.com/demos/fancy_input/fancyInput.html
/// pour du scroll : http://johnpolacek.github.io/superscrollorama/
/// peut servir, d'autres trucs bien sur ce site : http://tympanus.net/codrops/2012/01/24/arctext-js-curving-text-with-css3-and-jquery/
/// à utiliser sur un site web : http://www.seanmccambridge.com/tubular/
/// excellent : http://tutorialzine.com/2011/09/jquery-pointpoint-plugin/
/// peut-être pas mal, pour rafraichir les listes : http://usehook.com/
// à étudier : http://www.chartjs.org/docs/#getting-started-creating-a-chart
// à copier ??? http://paulkinzett.github.io/toolbar/

/// http://codecanyon.net/item/fun-captcha-jquery-plugin/6705437?ref=yuzuruishikawa

// Mac OS X: http://blog.coolaj86.com/articles/how-to-create-an-osx-pkg-installer.html
// Ubuntu Linux: http://blog.coolaj86.com/articles/how-to-create-a-debian-installer.html
// Microsoft Windows: http://blog.coolaj86.com/articles/how-to-create-an-innosetup-installer.html

// à annalyser : http://www.corm.fr/demonstration/
// à analyser également (permet de faire des applications locales en nodejs) : https://github.com/rogerwang/node-webkit

// l'utiliser pour la création du PDF ? http://www.jqueryrain.com/?l1iRfaTH
/// ...pas mal du tout, car çà permet de laisser en colonne !!!!

"use strict";

// import {$} from "./../js/jquery";
// import {moment} from "./../js/moment-with-locales";
// console.log("moment",moment);
//
// var jquery = $ ;

window.log = function() {
	if (window.console) {
		console.warn.apply(window.console, arguments);
	}
};

moment().localeData("fr");
moment().utcOffset(0);
// console.log("moment().utcOffset()",moment().utcOffset());

Array.prototype.m_remove = function(val) {
	var pos = this.indexOf(val);
	if (~pos) this.splice(pos, 1);
};

/**
 * M_ is a javascript application framework to build single page web applications, rather graphic than theory.
 * @namespace M_
 * @version 1.0
 * @author David Miglior <david@miglior.fr>
 * @todo Renomer les balises HTML utilisés en "data-" (par convention)
 * @todo Si le dernier argument de M_.App.open est false alors ne pas appeler d'action (permet de faire un bouton cancel)
 * @todo  Donner un nom : Bootstrap commander
 *
 */
M_ = {
	_registeredModules: {}
};

M_.registerModule = (name, module) => {
	// console.log("name,module",name,module);
	M_._registeredModules[name] = module;
};

/**
 * The Morphine application, instancied
 * @class
 * @memberof! <global>
 * @property {type} inDevelopment
 * @property {type} useWebsocket
 * @property {type} name
 * @property {type} routes
 * @property {type} defaultController
 * @property {type} tabController
 * @property {type} tabOutlets
 * @property {type} container
 * @property {type} currentController
 * @property {type} namespace
 * @property {type} templates
 * @property {type} models
 * @property {type} scripts
 * @property {type} app
 * @property {type} beforeAllAjax
 * @property {type} afterAllAjax
 * @property {type} lastModule
 * @property {type} lastAction
 * @property {type} executeNextAction
 * @property {type} controllersDir
 */
M_.App = new class {
	/**
	 * Already instancied
	 * @return {[type]} [description]
	 */
	constructor() {}
	/**
	 * To document
	 * @param {type} opts
	 */
	create(opts) {
		this.defaults = {
			inDevelopment: true,
			useWebsocket: false,
			name: "",
			routes: {},
			defaultController: "Home",
			tabController: [],
			tabOutlets: {},
			container: null,
			currentController: null,
			namespace: "",
			templates: null,
			models: {},
			scripts: null,
			app: null,
			_tabScriptsLoaded: [],
			_tabModelsLoaded: [],
			beforeAllAjax: null,
			afterAllAjax: null,
			_cmptAjax: 0,
			_lastHashBis: "-------",
			_urlArgs: [],
			lastModule: "-------",
			lastAction: "-------",
			// _hashIsLoading: false,
			executeNextAction: true,
			_ready: null,
			_beforeReady: null,
			controllersDir: "app/controllers/",
			moduleChange: null,
			beforeModuleChange: null
		};
		$.extend(this, this.defaults, opts);

		$(window).resize(() => {
			if (this.M_tsResize) window.clearTimeout(this.M_tsResize);
			this.M_tsResize = window.setTimeout(() => {
				this.resize();
			}, 300);
		});

		if ("onhashchange" in window) {
			$(window).on("hashchange", () => {
				this._hashChanged();
			});
			// } else {
			// 	this.lastHash = window.location.hash;
			// 	window.setInterval(()=> {
			// 		if (window.location.hash != this.lastHash) {
			// 			this.lastHash = window.location.hash;
			// 			this._hashChanged();
			// 		}
			// 	}, 100);
		}

		$.ajaxPrefilter((options, originalOptions, jqXHR) => {
			//log("c un ajax 1 ",arguments)
			this.onBeforeAllAjax(options, originalOptions, jqXHR);
			jqXHR.always(data => {
				//log("c un ajax 2 ",arguments)
				this.onAfterAllAjax(data, options, originalOptions, jqXHR);
			});
		});

		return this;
	}
	/**
	 * @function onBeforeAllAjax
	 * @memberOf! M_.App
	 * @instance
	 * @param {Object} options
	 * @param {Object} originalOptions
	 * @param {jqXHR} jqXHR
	 */
	onBeforeAllAjax(options, originalOptions, jqXHR) {}
	/**
	 * To document
	 * @param {Object} data
	 * @param {Object} options
	 * @param {Object} originalOptions
	 * @param {jqXHR} jqXHR
	 */
	onAfterAllAjax(data, options, originalOptions, jqXHR) {}
	/**
	 * To document
	 * @return {M_.App}
	 */
	resize() {
		var tabController = this.tabController;
		for (var i = 0; i < tabController.length; i++) {
			tabController[i].onResize();
		}
		return this;
	}
	/**
	 * @param  {Function}
	 * @return {M_.App}
	 */
	beforeReady(fn) {
		this._beforeReady = fn;
		return this;
	}
	/**
	 * @param  {Function}
	 * @return {M_.App}
	 */
	ready(fn) {
		// log("ready")
		this._ready = fn;
		M_.Help.createMHelp();
		if (this._beforeReady) {
			this._beforeReady(() => {
				this._reallyReady();
			});
		} else this._reallyReady();
		return this;
	}
	_reallyReady() {
		if (document.readyState == "complete") {
			this._ready();
			this._hashChanged();
		} else {
			$(document).ready(() => {
				this._ready();
				this._hashChanged();
			});
		}
	}
	/**
	 * Open a page
	 * @param  {String} module
	 * @param  {String} action
	 * @return {M_.App}
	 */
	open(module, action) {
		// log("open", this.currentController)
		this._lastHashBis = window.location.hash;
		var url = "";
		var args = [];
		this.executeNextAction = true;
		if (module.substring(0, 1) == "/") {
			url = "#" + module;
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== false) args.push(arguments[i]);
				else this.executeNextAction = false;
			}
			url = "#/" + args.join("/");
		}
		//log("module,url,args",module, ";", url,";",args)
		if (url == window.location.hash) {
			this._hashChanged();
		} else {
			window.open(url, "_self");
		}
		return this;
	}
	_getHashArgs() {
		var hash = window.location.hash.substring(2, window.location.hash.length);
		var t = hash.split("/");
		return t;
	}
	_hashChanged() {
		var args = this._getHashArgs();
		var module = this.defaultController;
		if (args[0] && args[0] !== "") module = args[0];
		var justCreated = false;
		if (this[module] === undefined) {
			// var Mod = System.get('js6/controllers/'+module+".js")[module] ;
			// this[module] = new Mod({controllerName:module, tpl:JST[module]}) ;
			// console.log("JST",JST,M_._registeredModules);
			// import {mymod} from './'+module+'.js' ;
			this[module] = new M_._registeredModules[module]({
				controllerName: module,
				tpl: JST[module]
			});
			this.tabController.push(this[module]);
			justCreated = true;
		}
		this[module].resolve(ok => {
			if (ok) {
				if (this.beforeModuleChange) {
					let ok2 = this.beforeModuleChange(module, this.lastModule);
					if (ok2 !== false) this.__hashChanged(justCreated);
				} else this.__hashChanged(justCreated);
			}
		});
	}
	__hashChanged(justCreated) {
		var tabController = this.tabController;
		for (var i = 0; i < tabController.length; i++) {
			tabController[i].onExit();
		}

		// if (this._hashIsLoading) return ;
		// log("_hashChanged9")
		var args = this._getHashArgs();
		var module = this.defaultController;
		if (args[0] && args[0] !== "") module = args[0];
		var action = "";
		if (args[1] && args[1] !== "") action = args[1];
		// log("module2",module)

		// log("currentController", this.currentController)
		if (this.currentController && this.lastModule !== module) {
			var currentControllerNameSaved = this.currentController.controllerName;
			$("#part_" + this.currentController.controllerName)
				.css("left", 0)
				.css("z-index", 1)
				.css("transform-origin", "5% 50%")
				.transition(
					{
						// x: $(window).width(),
						perspective: "1000px",
						rotateY: "50deg",
						scale: 0.7,
						opacity: 0.3
					},
					500,
					el => {
						$("#part_" + currentControllerNameSaved).hide();
						// this._hashChangedMore() ;
					}
				);
		} else {
			// this._hashChangedMore() ;
		}

		if (!justCreated) {
			if (this.lastModule == module) {
				this[module]._onShow(false);
			} else {
				// var tabController = this.tabController ;
				for (i = 0; i < tabController.length; i++) {
					if (this.currentController.controllerName == tabController[i].controllerName) continue;
					// tabController[i].hide() ;
					$("#part_" + tabController[i].controllerName).css("z-index", 0);
				}

				this[module]._onShow(true);
			}
		} else {
			// import {mod} from 'controllers/'+module ;
			// log("module",module, System.get('js6/controllers/'+module+".js"))
			this[module].init.call(this[module]);
			this[module].renderTemplate.call(this[module]);
			this[module].create.call(this[module]);
			this[module]._onShow.call(this[module], true);
		}

		if (action === "") action = this[module].defaultAction;
		if (!this[module][action + "Action"]) {
			console.warn("You must define function '" + action + "Action" + "()' in " + this[module].controllerName + " controller");
			this.open(module, "index");
		} else {
			args.splice(0, 2);
			this[module][action + "Action"].apply(this[module], args);
		}

		if (this.moduleChange) this.moduleChange(module, this.lastModule);

		this.lastModule = module;
		this.lastAction = action;
	}
	/**
	 * @param  {jQuery}		container
	 * @param  {JSTemplate}	tpl
	 * @param  {Object}		tplData
	 * @return {jQuery}
	 */
	renderMustacheTo(container, tpl, tplData = {}) {
		//, tplPartials={}
		var jEl = $(this.renderMustache(tpl, tplData)); //, tplPartials
		jEl.appendTo(container);
		return jEl;
	}
	/**
	 * @param  {JSTemplate}	tpl
	 * @param  {Object}		tplData
	 * @return {String}
	 */
	renderMustache(tpl, tplData = {}) {
		//, tplPartials={}
		// console.log("tplPartials",tplPartials)
		// console.log('_.templateSettings.imports',_.templateSettings.imports)
		// console.log("tpl",tpl);
		var template = tpl(tplData);
		return template;
	}
}();

/**
A generic controller to extends
 * @class
 * @memberof! <global>
 * @example
export class Calculator extends M_.Controller {
	init() {
	}
	create() {
	}
}
*/
M_.Controller = class {
	/**
	 * Generally, you don't need to extend this class. Extend create method.
	 * @param  {object} opts Configuration object
	 */
	constructor(opts) {
		var defaults = {
			controller: "",
			controllerName: "",
			controllerSrc: null,
			defaultAction: "index",
			jEl: null,
			tpl: null,
			tplData: {},
			tplPartials: {},
			models: [],
			templates: [],
			scripts: []
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);
	}
	/**
	 * To document
	 */
	init() {}
	/**
	 * @param  {Function}
	 */
	resolve(next) {
		next(true);
	}
	/**
	 * To document
	 */
	renderTemplate() {
		if (this.tpl) {
			this.jEl = M_.App.renderMustacheTo(M_.App.container, this.tpl, this.tplData, this.tplPartials);
			this.jEl.attr("id", "part_" + this.controllerName);
			this.jEl.addClass("M_part");
		}
	}
	/**
	 * To document
	 */
	render() {}
	/**
	 * To document
	 */
	indexAction() {}
	/**
	 * To document
	 */
	onResize() {}
	/**
	 * To document
	 */
	onExit() {}
	/**
	 * To document
	 */
	onControllerChange() {}
	/**
	 * Extend this method to initialize your UI
	 */
	doLayout() {}
	/**
	 * This method is called each time the controller is shown.
	 * @param  {boolean} firstTime True when this function is called for the first time.
	 */
	show(firstTime) {}

	_onShow(anim) {
		// console.log("_onShow");
		// var args = this._urlArgs.slice(0) ;
		// args.unshift(firstTime) ;
		// this.show.apply(this, args) ;
		M_.App.currentController = this;
		this.onControllerChange();

		this.show.apply(this);
		// console.log("_onShow");
		this.jEl
			// .css('scale', 1)
			// .css('rotateX',0)
			// .css('perspective','0px')
			// .css('rotateY','0deg')
			.css("transform", "rotateY(0deg)")
			.css("transform", "perspective(0)")
			.css("opacity", 1)
			.css("z-index", 2)
			.show();

		if (anim) {
			// console.log("anim");
			this.jEl.css("left", $(window).width()).transition(
				{
					left: 0,
					delay: 100
				},
				500,
				() => {
					// console.log("finit");
				}
			);
		} else {
			this.jEl.css("left", 0);
		}
	}
	/**
	 * onShow description
	 * @param  {Boolean} firstTime [description]
	 */
	onShow(firstTime) {}
	/**
	 * hide description
	 */
	hide() {
		if (this.jEl) this.jEl.hide();
	}
};

/**
 * Usefull methods for manipulate date, string, paths, etc...
 * @memberof! <global>
 */
M_.Utils = class {
	static preloadImages(preload, cb) {
		// var preload = ["a.gif", "b.gif", "c.gif"];
		var promises = [];
		// for (var i = 0; i < preload.length; i++) {
		_.each(preload, (p, i) => {
			(function(url, promise) {
				var img = new Image();
				img.onload = function() {
					promise.resolve();
				};
				img.src = url;
			})(p, (p = $.Deferred()));
		});
		$.when.apply($, promises).done(function() {
			// alert("All images ready sir!");
			cb();
		});
	}

	static isEventSupported(eventName) {
		var TAGNAMES = {
			select: "input",
			change: "input",
			search: "input",
			submit: "form",
			reset: "form",
			error: "img",
			load: "img",
			abort: "img"
		};
		var el = document.createElement(TAGNAMES[eventName] || "div");
		eventName = "on" + eventName;
		var isSupported = eventName in el;
		if (!isSupported) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] == "function";
		}
		el = null;
		return isSupported;
	}

	static humanFileSizeString(fileSizeInBytes) {
		var i = -1;
		var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
		do {
			fileSizeInBytes = fileSizeInBytes / 1024;
			i++;
		} while (fileSizeInBytes > 1024);

		return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
	}

	/**
	 * Idem as jQuery $.isArray(obj)
	 * @param  {object}  obj The object to test
	 * @return {boolean}     True if obj is an array
	 */
	static isArray(obj) {
		return $.isArray(obj);
	}

	static get_html_translation_table(table, quote_style) {
		//  discuss at: http://phpjs.org/functions/get_html_translation_table/
		// original by: Philip Peterson
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: noname
		// bugfixed by: Alex
		// bugfixed by: Marco
		// bugfixed by: madipta
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: T.Wild
		// improved by: KELAN
		// improved by: Brett Zamir (http://brett-zamir.me)
		//    input by: Frank Forte
		//    input by: Ratheous
		//        note: It has been decided that we're not going to add global
		//        note: dependencies to php.js, meaning the constants are not
		//        note: real constants, but strings instead. Integers are also supported if someone
		//        note: chooses to create the constants themselves.
		//   example 1: get_html_translation_table('HTML_SPECIALCHARS');
		//   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

		var entities = {},
			hash_map = {},
			decimal;
		var constMappingTable = {},
			constMappingQuoteStyle = {};
		var useTable = {},
			useQuoteStyle = {};

		// Translate arguments
		constMappingTable[0] = "HTML_SPECIALCHARS";
		constMappingTable[1] = "HTML_ENTITIES";
		constMappingQuoteStyle[0] = "ENT_NOQUOTES";
		constMappingQuoteStyle[2] = "ENT_COMPAT";
		constMappingQuoteStyle[3] = "ENT_QUOTES";

		useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : "HTML_SPECIALCHARS";
		useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : "ENT_COMPAT";

		if (useTable !== "HTML_SPECIALCHARS" && useTable !== "HTML_ENTITIES") {
			throw new Error("Table: " + useTable + " not supported");
			// return false;
		}

		entities["38"] = "&amp;";
		if (useTable === "HTML_ENTITIES") {
			entities["160"] = "&nbsp;";
			entities["161"] = "&iexcl;";
			entities["162"] = "&cent;";
			entities["163"] = "&pound;";
			entities["164"] = "&curren;";
			entities["165"] = "&yen;";
			entities["166"] = "&brvbar;";
			entities["167"] = "&sect;";
			entities["168"] = "&uml;";
			entities["169"] = "&copy;";
			entities["170"] = "&ordf;";
			entities["171"] = "&laquo;";
			entities["172"] = "&not;";
			entities["173"] = "&shy;";
			entities["174"] = "&reg;";
			entities["175"] = "&macr;";
			entities["176"] = "&deg;";
			entities["177"] = "&plusmn;";
			entities["178"] = "&sup2;";
			entities["179"] = "&sup3;";
			entities["180"] = "&acute;";
			entities["181"] = "&micro;";
			entities["182"] = "&para;";
			entities["183"] = "&middot;";
			entities["184"] = "&cedil;";
			entities["185"] = "&sup1;";
			entities["186"] = "&ordm;";
			entities["187"] = "&raquo;";
			entities["188"] = "&frac14;";
			entities["189"] = "&frac12;";
			entities["190"] = "&frac34;";
			entities["191"] = "&iquest;";
			entities["192"] = "&Agrave;";
			entities["193"] = "&Aacute;";
			entities["194"] = "&Acirc;";
			entities["195"] = "&Atilde;";
			entities["196"] = "&Auml;";
			entities["197"] = "&Aring;";
			entities["198"] = "&AElig;";
			entities["199"] = "&Ccedil;";
			entities["200"] = "&Egrave;";
			entities["201"] = "&Eacute;";
			entities["202"] = "&Ecirc;";
			entities["203"] = "&Euml;";
			entities["204"] = "&Igrave;";
			entities["205"] = "&Iacute;";
			entities["206"] = "&Icirc;";
			entities["207"] = "&Iuml;";
			entities["208"] = "&ETH;";
			entities["209"] = "&Ntilde;";
			entities["210"] = "&Ograve;";
			entities["211"] = "&Oacute;";
			entities["212"] = "&Ocirc;";
			entities["213"] = "&Otilde;";
			entities["214"] = "&Ouml;";
			entities["215"] = "&times;";
			entities["216"] = "&Oslash;";
			entities["217"] = "&Ugrave;";
			entities["218"] = "&Uacute;";
			entities["219"] = "&Ucirc;";
			entities["220"] = "&Uuml;";
			entities["221"] = "&Yacute;";
			entities["222"] = "&THORN;";
			entities["223"] = "&szlig;";
			entities["224"] = "&agrave;";
			entities["225"] = "&aacute;";
			entities["226"] = "&acirc;";
			entities["227"] = "&atilde;";
			entities["228"] = "&auml;";
			entities["229"] = "&aring;";
			entities["230"] = "&aelig;";
			entities["231"] = "&ccedil;";
			entities["232"] = "&egrave;";
			entities["233"] = "&eacute;";
			entities["234"] = "&ecirc;";
			entities["235"] = "&euml;";
			entities["236"] = "&igrave;";
			entities["237"] = "&iacute;";
			entities["238"] = "&icirc;";
			entities["239"] = "&iuml;";
			entities["240"] = "&eth;";
			entities["241"] = "&ntilde;";
			entities["242"] = "&ograve;";
			entities["243"] = "&oacute;";
			entities["244"] = "&ocirc;";
			entities["245"] = "&otilde;";
			entities["246"] = "&ouml;";
			entities["247"] = "&divide;";
			entities["248"] = "&oslash;";
			entities["249"] = "&ugrave;";
			entities["250"] = "&uacute;";
			entities["251"] = "&ucirc;";
			entities["252"] = "&uuml;";
			entities["253"] = "&yacute;";
			entities["254"] = "&thorn;";
			entities["255"] = "&yuml;";
		}

		if (useQuoteStyle !== "ENT_NOQUOTES") {
			entities["34"] = "&quot;";
		}
		if (useQuoteStyle === "ENT_QUOTES") {
			entities["39"] = "&#39;";
		}
		entities["60"] = "&lt;";
		entities["62"] = "&gt;";

		// ascii decimals to real symbols
		for (decimal in entities) {
			if (entities.hasOwnProperty(decimal)) {
				hash_map[String.fromCharCode(decimal)] = entities[decimal];
			}
		}

		return hash_map;
	}

	static html_entity_decode(string, quote_style) {
		//  discuss at: http://phpjs.org/functions/html_entity_decode/
		// original by: john (http://www.jd-tech.net)
		//    input by: ger
		//    input by: Ratheous
		//    input by: Nick Kolosov (http://sammy.ru)
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// improved by: marc andreu
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Onno Marsman
		// bugfixed by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: Fox
		//  depends on: get_html_translation_table
		//   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
		//   returns 1: 'Kevin & van Zonneveld'
		//   example 2: html_entity_decode('&amp;lt;');
		//   returns 2: '&lt;'

		var hash_map = {},
			symbol = "",
			tmp_str = "",
			entity = "";
		tmp_str = string.toString();

		if (false === (hash_map = this.get_html_translation_table("HTML_ENTITIES", quote_style))) {
			return false;
		}

		// fix &amp; problem
		// http://phpjs.org/functions/get_html_translation_table:416#comment_97660
		delete hash_map["&"];
		hash_map["&"] = "&amp;";

		for (symbol in hash_map) {
			entity = hash_map[symbol];
			tmp_str = tmp_str.split(entity).join(symbol);
		}
		tmp_str = tmp_str.split("&#039;").join("'");

		return tmp_str;
	}

	static getIframeDocument(jEl) {
		var iframeDoc = jEl.get(0).contentWindow || jEl.get(0).contentDocument;
		if (iframeDoc.document) {
			iframeDoc = iframeDoc.document;
		}
		return iframeDoc;
	}

	// static generateAndDownloadFile(urlGenerate, urlDownload, args={}) {
	// 	var defaults = 	{
	// 		methodGenerate: 'POST',
	// 		methodDownload: 'POST',
	// 		argsGenerate: {},
	// 		argsDownload: {},
	// 	};
	// 	var myargs = $.extend({}, defaults, args) ;
	// 	this.ajaxJson(urlGenerate, myargs.argsGenerate, myargs.methodDownload, (data)=> {
	//
	// 	}
	// 	this.downloadFile(urlDownload, myargs.argsDownload, myargs.methodDownload) ;
	// }
	static downloadFile(url, args = {}, method = "POST") {
		$("#M_FileDownload").remove();
		$(document.body).append("<iframe id='M_FileDownload' src='about:blank' style='display:none;'></iframe>");
		var html = "";
		_.each(args, (val, key) => {
			html += `<input type="hidden" name="${key}" value="${val}">`;
		});
		var doc = this.getIframeDocument($("#M_FileDownload"));
		// console.log("html", html);
		doc.write("<html><head></head><body><form method='" + method + "' action='" + url + "'>" + html + "</form></body></html>");
		// var started = false;
		$(doc)
			.find("form")
			.submit();
	}
	static downloadFile2(url, args = {}, method = "POST") {
		$("#M_FileDownload").remove();
		$(document.body).append("<iframe id='M_FileDownload' src='" + url + "' style='display:block; width:100%; height:200px;'></iframe>");
		window.setTimeout(() => {
			// var doc = this.getIframeDocument($("#M_FileDownload"));
			// var toto = doc.toString();
			// console.log("doc.window", doc);
			// var txt = $(doc).html() ;
			// console.log("txt", txt, JSON.parse(txt));
		}, 2000);
	}

	static urlIze(str) {
		str = M_.Utils.trim(str);
		if (str.substring(0, 7) == "http://") return str;
		if (str.substring(0, 8) == "https://") return str;
		return "http://" + str;
	}

	static limitText(str, n, useWordBoundary) {
		var toLong = str.length > n,
			s_ = toLong ? str.substr(0, n - 1) : this;
		s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(" ")) : s_;
		return toLong ? s_ + "&hellip;" : s_;
	}
	/**
	 * toggleAppFullScreen description
	 * @return {Boolean} true if actually passed in full screen (after function executed)
	 */
	static toggleAppFullScreen() {
		var element = document.body;
		$(document.body).css("width", "100%");
		if (!M_.Utils._appIsFullScreen) {
			var requestMethod =
				element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
			if (requestMethod) {
				requestMethod.call(element);
			} else if (typeof window.ActiveXObject !== "undefined") {
				// Older IE.
				var wscript = new window.ActiveXObject("WScript.Shell");
				if (wscript !== null) {
					wscript.SendKeys("{F11}");
				}
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
		M_.Utils._appIsFullScreen = !M_.Utils._appIsFullScreen;
	}

	/**
	 * Return moment object
	 * @return {boolean}     True if obj is an array
	 */
	static moment() {
		return moment;
	}
	/**
	 * Idem as jQuery $.isFunction()
	 * @param  {object}  obj The object to test
	 * @return {boolean}     True if obj is an function
	 */
	static isFunction(obj) {
		return $.isFunction(obj);
	}
	/**
	 * Idem as jQuery $.isEmptyObject()
	 * @param  {object}  obj The object to test
	 * @return {boolean}     True if obj is {}
	 */
	static isEmptyObject(obj) {
		return $.isEmptyObject(obj);
	}

	/**
	 * Check if d is a moment date
	 * @param  {moment}  obj The object to test
	 * @return {boolean}     True if obj is {}
	 */
	static isDate(d) {
		if (moment(d).isValid()) return true;
		return false;
	}

	/**
	 * Return the extension of a path.
	 * @param  {String} path The path
	 * @return {String}      The extension or ''
	 * @example
	 * var ext = M_.Utils.getExtensionFromPath("foo/bar/my_file.html") ;
	 * // ext = "html"
	 */
	static getExtensionFromPath(path) {
		return path.split(".").pop();
	}

	/**
	 * Return the base name of a path.
	 * @param  {String} path The path
	 * @return {String}      The name of the file
	 * @example
	 * var filename = getBaseNameFromPath("foo/bar/myfile.html") ;
	 * // filename = "myfile.html"
	 */
	static getBaseNameFromPath(path) {
		return path.split("/").pop();
	}

	/**
	 * Return the directory of a path.
	 * @param  {String} path The path
	 * @return {String}      The name of the file
	 * @example
	 * var filename = getDirFromPath("foo/bar/myfile.html") ;
	 * // filename = "foo/bar"
	 */
	static getDirFromPath(path) {
		var tabPaths = path.split("/");
		tabPaths.pop();
		return tabPaths.join("/");
	}
	/**
	 * Convert hexadecimal to RGB
	 * @param  {number} hex Number to convert
	 * @return {object}     Object contain keys : r, g, b ; {r:x, g:y, b:z}
	 */
	static hexToRgb(hex) {
		//Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (result)
			return {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			};
		else return null;
	}
	/**
	 * Convert RGB to Hexa
	 * @param  {number} r Red
	 * @param  {integer} g Green
	 * @param  {integer} b Blue
	 * @return {number}   Number of hexadecimal
	 */
	static rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	/**
	 * Convert RGB from css (like #FFFFFF) to Hexa
	 * @param  {number} rgb
	 * @return {number}   Object contain keys : r, g, b ; {r:x, g:y, b:z}
	 */
	static rgbFromCssToHex(rgb) {
		if (rgb.indexOf("#") === 0) return rgb;
		if (rgb.indexOf("rgb") === 0) {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
			return (
				"#" +
				("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
			);
		}
	}
	/**
	 * Return a uniq ID
	 * @return {String} A incremental number start from 1
	 */
	static id() {
		if (!this.cmpUniqId) this.cmpUniqId = 0;
		this.cmpUniqId++;
		return "_M_el_" + this.cmpUniqId;
	}

	/**
	 * Don't use that...
	 */
	static removeEventsNotAttachedToDocument() {
		window.setTimeout(() => {
			// log("go")
			var tab = $._data(document, "events").click;
			// log("tab",tab)
			if (!tab) return;
			// var nb = 0;
			var tabToRemove = [];
			for (var i = 0; i < tab.length; i++) {
				if (tab[i].selector && $(tab[i].selector).length === 0 && tab[i].selector.substring(0, 7) == "#_M_el_") {
					// nb++;
					tabToRemove.push(tab[i].selector);
				}
			}
			// log("tabToRemove",tabToRemove)
			for (i = 0; i < tabToRemove.length; i++) {
				$(document).off("click", tabToRemove[i]);
			}
			// log("nb", nb) ;
		}, 500);
	}
	/**
	 * Set the z-index upper
	 * @param {jQuery} jEl jQuery object
	 */
	static setZIndexForModal(jEl) {
		this._cmptZIndexModal += 10;
		jEl.css("z-index", this._cmptZIndexModal);
		$(".modal-backdrop")
			.last()
			.css("z-index", this._cmptZIndexModal - 1);
	}
	// static getMaxZIndex() {
	// 	var heighest = -999 ;
	// 	$("*").each(function() {
	// 		var current = parseInt($(this).css("z-index"), 10);
	// 		heighest = Math.max(current, heighest) ;
	// 	});
	// 	if (heighest==-999) heighest = 0 ;
	// 	return heighest ;
	// }

	/**
	 * Clone an object... simple level !!!!
	 * @param  {object} obj
	 * @return {object} the new object
	 */
	static clone(obj) {
		var target = {};
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				target[i] = obj[i];
			}
		}
		return target;
	}
	/**
	 * Create a UUID with a random algorithme
	 * @return {String} The number is like 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	 */
	static createUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	/**
	 * Clone an object... simple level !!!!
	 * @param  {object} nb
	 * @param  {object} singular
	 * @param  {object} plural
	 * @return {object} singular
	 * @example
var plural1 = M_.Utils.plural(3, "guitare")
// plural1 = guitares
var plural2 = M_.Utils.plural(3, "guitare", "guitarez")
// plural2 = guitarez
var plural3 = M_.Utils.plural(3, "une guitare", "une des {nb} guitares")
// plural3 = une des 3 guitares
	 */
	static plural(nb, singular, plural = null, withoutnumber = false) {
		if (nb <= 1 && nb >= -1) {
			if (singular.indexOf("{{nb}}") >= 0) {
				return singular.replace(/\{\{nb\}\}/, nb);
			}
			if (withoutnumber) return singular;
			return nb + " " + singular;
		}
		if (!plural) plural = singular + "s";
		if (plural.indexOf("{{nb}}") >= 0) {
			return plural.replace(/\{\{nb\}\}/, nb);
		}
		if (withoutnumber) return plural;
		return nb + "&nbsp;" + plural;
	}
	/**
	 * Create a delay
	 * @param  {function} callback - une fonction à appeler
	 * @param  {number} time - un temp en millisecondes
	 * @param  {String} [arbitralName="arbitralName"] - donner de préférence un nom unique
	 */
	static delay(callback, time, arbitralName = "arbitralName") {
		if (!this.tabDelay) this.tabDelay = {};
		if (arbitralName === "") arbitralName = "arbitralName";
		if (this.tabDelay[arbitralName]) window.clearTimeout(this.tabDelay[arbitralName]);
		this.tabDelay[arbitralName] = window.setTimeout(() => {
			//log("callback")
			callback();
		}, time);
	}
	/**
	 * Check if variable is empty : [], undef, null, false, 0, "", "0", "undefined", undefined
	 * @param  {object} obj
	 * @return {boolean} true if empty
	 */
	static isEmpty(obj) {
		var undef, key, i, len;
		var emptyValues = [undef, null, false, 0, "", "0", "undefined", undefined];

		if ($.type(obj) === "date") return false;

		for (i = 0, len = emptyValues.length; i < len; i++) {
			if (obj === emptyValues[i] || obj == emptyValues[i]) {
				return true;
			}
		}
		if (typeof obj === "object") {
			for (key in obj) {
				//TODO: should we check for own properties only?
				//if (obj.hasOwnProperty(key)) {
				return false;
				//}
			}
			return true;
		}
		return false;
	}
	/**
	 * Format a phone number... for french format !!! to update...
	 * @param  {String} num
	 * @return {String} the formated number
	 */
	static formatPhone(num) {
		var ret = "";
		var toAdd = "";
		//$phone_number = preg_replace("/[^\+0-9]/", "", $phone_number);
		num = num.replace(/[^\+0-9]/g, "");
		if (num.substring(0, 1) == "+") {
			toAdd = num.substr(0, 3) + " ";
			num = num.substr(3);
		}
		for (let kk = 0; kk < num.length; kk++) {
			if (kk % 2 === 0) ret = " " + ret;
			ret = num.substr(num.length - kk - 1, 1) + ret;
		}
		return toAdd + ret.trim();
	}
	static alphaNum(str) {
		if (!str) return "";
		var reg1 = /[^\+0-9]/g;
		str = str.replace(reg1, "");
		return str;
	}
	/**
	 * Strip html tags
	 * @param  {String} num
	 * @param  {String} allowed
	 * @return {String} the new string
	 */
	static strip_tags(input, allowed) {
		//From: http://phpjs.org/functions
		// console.log("input",input);
		input += "";
		if (!input) return "";
		allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, "").replace(tags, function($0, $1) {
			return allowed.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
		});
	}
	/**
	 * First char to upper case
	 * @param  {String} str
	 * @return {String} the new string
	 */
	static ucfirst(str) {
		//  discuss at: http://phpjs.org/functions/ucfirst/
		// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Onno Marsman
		// improved by: Brett Zamir (http://brett-zamir.me)
		//   example 1: ucfirst('kevin van zonneveld');
		//   returns 1: 'Kevin van zonneveld'

		str += "";
		str = str.toLowerCase();
		var f = str.charAt(0).toUpperCase();
		return f + str.substr(1);
	}

	/**
	 * First char to upper case
	 * @param  {String} str - the base string
	 * @param  {number} len - add 'padStr' X times
	 * @param  {String} [padStr='0'] - the string to add
	 * @param  {number} [direction=-1] - -1=left, 1=right
	 * @return {String} the new string
	 */
	static str_pad(str, len, padStr = "0", direction = -1) {
		str += "";
		var res = "";
		//warning if len<str.length
		if (direction < 0)
			str = str
				.split("")
				.reverse()
				.join("");
		for (var i = 0; i < len; i++) {
			var c = str.charAt(i);
			if (c === "") res += padStr;
			res += str.charAt(i);
		}
		if (direction < 0)
			res = res
				.split("")
				.reverse()
				.join("");
		return res;
	}
	/**
	 * Remove break line, space and tabulation
	 * @param  {String} str - the base string
	 * @return {String} the new string
	 */
	static trim(str) {
		//return str.replace(/^\s+|\s+$/g, '');
		str = $.trim(str);
		str = str.replace(/^(\n\r)+|(\n\r)+$/g, "");
		return str;
	}
	/**
	 * Set cookie
	 * @param  {String} cname - the name of the cookie
	 * @param  {String} cvalue - the value of the cookie
	 * @param  {String} [expireDays=7] - expiration in days
	 */
	static setCookie(cname, cvalue, expireDays = 7) {
		var d = new Date();
		d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return null;
	}
	/**
	 * Check if browser is on macos
	 * @return {boolean} true if ok
	 */
	static isMacos() {
		var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
		return isMac;
	}
	static valInArray(tab, key, keyName = "key", valName = "val") {
		var f = this.findInArray(tab, key, keyName);
		if (f) return _.result(f, valName);
		else return "";
	}
	static findInArray(tab, key, keyName = "key") {
		var obj = {};
		obj[keyName] = key;
		var f = _.find(tab, obj);
		// console.log("f", f);
		return f;
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static getFromSimpleArray(tab, what) {
		for (var i2 = 0; i2 < tab.length; i2++) {
			if (tab[i2][0] == what) return tab[i2][1];
		}
		return "";
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static getSimpleArray(tab, index, what) {
		var pos = this.searchSimpleArray(tab, index, what);
		if (pos >= 0) return tab[pos];
		return null;
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static searchSimpleArray(tab, index, what) {
		for (var i2 = 0; i2 < tab.length; i2++) {
			if (tab[i2][index] == what) return i2;
		}
		return -1;
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static searchArrayObjects(tab, what, val) {
		for (var i2 = 0; i2 < tab.length; i2++) {
			if (tab[i2][what] == val) return i2;
		}
		return -1;
	}
	/**
	 * Get cookie
	 * @param  {String} cname - the name of the cookie
	 * @return {String} the value of the cookie
	 */
	static getFromArrayObjects(tab, what, val) {
		for (var i2 = 0; i2 < tab.length; i2++) {
			if (tab[i2][what] == val) return tab[i2];
		}
		return null;
	}
	/**
	 * To document
	 */
	static inArray(needle, haystack) {
		var length = haystack.length;
		for (var i = 0; i < length; i++) {
			if (haystack[i] == needle) return true;
		}
		return false;
	}
	/**
	 * To document
	 * @param  {String}  str      the string to convert
	 * @param  {Boolean} is_xhtml [description]
	 * @return {String}           modified string
	 */
	static nl2br(str, is_xhtml) {
		var breakTag = is_xhtml || typeof is_xhtml === "undefined" ? "<br " + "/>" : "<br>"; //Adjust comment to avoid issue on phpjs.org display

		return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
	}
	/**
	 * replaceCommaWithPoint description
	 * @param  {String} txt
	 * @return {String}
	 */
	static replaceCommaWithPoint(txt) {
		txt += "";
		/*if (typeof(txt)=="string" ) {
			if (txt.indexOf(",")>=0) {
				var txt1 = txt.substring(0,txt.indexOf(","))	;
				var txt2 = txt.substring(txt.indexOf(",")+1,txt.length)	;
				return txt1+"."+txt2 ;
			}
		}
		*/
		var exp = new RegExp(",", "g");
		return txt.replace(exp, ".");
	}
	/**
	 * Like PHP function
	 * @param  {Array} tab
	 * @param  {String} field
	 * @return {Boolean}       true if is set
	 */
	static isset(tab, field) {
		if (typeof tab[field] != "undefined") return true;
		return false;
	}
	/**
	 * Like PHP function
	 * @param  {String} path
	 * @param  {String} options
	 * @return {String}
	 */
	static pathinfo(path, options) {
		//  discuss at: http://phpjs.org/functions/pathinfo/
		// original by: Nate
		//  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// improved by: Brett Zamir (http://brett-zamir.me)
		//    input by: Timo
		//        note: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
		//        note: The way the bitwise arguments are handled allows for greater flexibility
		//        note: & compatability. We might even standardize this code and use a similar approach for
		//        note: other bitwise PHP functions
		//        note: php.js tries very hard to stay away from a core.js file with global dependencies, because we like
		//        note: that you can just take a couple of functions and be on your way.
		//        note: But by way we implemented this function, if you want you can still declare the PATHINFO_*
		//        note: yourself, and then you can use: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
		//        note: which makes it fully compliant with PHP syntax.
		//  depends on: basename
		//   example 1: pathinfo('/www/htdocs/index.html', 1);
		//   returns 1: '/www/htdocs'
		//   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
		//   returns 2: 'index.html'
		//   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
		//   returns 3: 'html'
		//   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
		//   returns 4: 'index'
		//   example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
		//   returns 5: {basename: 'index.html', extension: 'html'}
		//   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');
		//   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
		//   example 7: pathinfo('/www/htdocs/index.html');
		//   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}

		var opt = "",
			optName = "",
			optTemp = 0,
			tmp_arr = {},
			cnt = 0,
			i = 0;
		var have_basename = false,
			have_extension = false,
			have_filename = false;

		// Input defaulting & sanitation
		if (!path) {
			return false;
		}
		if (!options) {
			options = "PATHINFO_ALL";
		}

		// Initialize binary arguments. Both the string & integer (constant) input is
		// allowed
		var OPTS = {
			PATHINFO_DIRNAME: 1,
			PATHINFO_BASENAME: 2,
			PATHINFO_EXTENSION: 4,
			PATHINFO_FILENAME: 8,
			PATHINFO_ALL: 0
		};
		// PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
		for (optName in OPTS) {
			OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
		}
		if (typeof options !== "number") {
			// Allow for a single string or an array of string flags
			options = [].concat(options);
			for (i = 0; i < options.length; i++) {
				// Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
				if (OPTS[options[i]]) {
					optTemp = optTemp | OPTS[options[i]];
				}
			}
			options = optTemp;
		}

		// Internal Functions
		var __getExt = function(path) {
			var str = path + "";
			var dotP = str.lastIndexOf(".") + 1;
			return !dotP ? false : dotP !== str.length ? str.substr(dotP) : "";
		};

		// Gather path infos
		if (options & OPTS.PATHINFO_DIRNAME) {
			var dirName = path.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/, ""); // dirname
			tmp_arr.dirname = dirName === path ? "." : dirName;
		}

		if (options & OPTS.PATHINFO_BASENAME) {
			if (false === have_basename) {
				have_basename = this.basename(path);
			}
			tmp_arr.basename = have_basename;
		}

		if (options & OPTS.PATHINFO_EXTENSION) {
			if (false === have_basename) {
				have_basename = this.basename(path);
			}
			if (false === have_extension) {
				have_extension = __getExt(have_basename);
			}
			if (false !== have_extension) {
				tmp_arr.extension = have_extension;
			}
		}

		if (options & OPTS.PATHINFO_FILENAME) {
			if (false === have_basename) {
				have_basename = this.basename(path);
			}
			if (false === have_extension) {
				have_extension = __getExt(have_basename);
			}
			if (false === have_filename) {
				have_filename = have_basename.slice(
					0,
					have_basename.length - (have_extension ? have_extension.length + 1 : have_extension === false ? 0 : 1)
				);
			}

			tmp_arr.filename = have_filename;
		}

		// If array contains only 1 element: return string
		cnt = 0;
		for (opt in tmp_arr) {
			cnt++;
		}
		if (cnt == 1) {
			return tmp_arr[opt];
		}

		// Return full-blown array
		return tmp_arr;
	}
	/**
	 * Format a number with good decimal and add devise
	 * @param  {Number} nb
	 * @param  {Number} decimal
	 * @param  {String} devise
	 * @return {String}
	 */
	static formatPrice(nb, decimal = 2, devise = M_.i18n.devise) {
		return this.price(nb, decimal, devise);
	}
	/**
	 * Alias of formatPrice
	 * @param  {Number} nb
	 * @param  {Number} decimal
	 * @param  {String} devise
	 * @return {String}
	 */
	static price(nb, decimal = 2, devise = M_.i18n.devise, sep = " ") {
		return this.number_format(nb, decimal, ",", ".") + sep + devise;
	}
	static shortPrice(nb, devise = M_.i18n.devise, sep = " ") {
		var res = "";
		if (nb < 1000) res += Math.round(nb) + "";
		else if (nb < 1000000) res += Math.round(nb / 1000) + "K";
		else res += Math.round(nb / 1000000) + "M";
		return res + sep + devise;
	}
	/**
	 * Format number in %
	 * @param  {Number} nb
	 * @param  {Number} decimal
	 * @return {String}
	 */
	static purcent(nb, decimal = 2, sep = " ") {
		return this.number_format(nb, decimal, ",", ".") + sep + "%";
	}
	/**
	 * Like PHP function
	 * @param  {Number} a
	 * @param  {Number} b Number of decimal
	 * @param  {String} c decimal separator
	 * @param  {String} d thousen separator
	 * @return {String}   this formated number
	 */
	static number_format(a, b, c, d) {
		var i, e, f, g, h;
		a = Number(a);
		a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
		e = a + "";
		f = e.split(".");
		if (!f[0]) f[0] = "0";
		if (!f[1]) f[1] = "";
		if (f[1].length < b) {
			g = f[1];
			for (i = f[1].length + 1; i <= b; i++) {
				g += "0";
			}
			f[1] = g;
		}
		if (d !== "" && f[0].length > 3) {
			h = f[0];
			f[0] = "";
			for (var j = 3; j < h.length; j += 3) {
				i = h.slice(h.length - j, h.length - j + 3);
				f[0] = d + i + f[0] + "";
			}
			j = h.substr(0, h.length % 3 === 0 ? 3 : h.length % 3);
			f[0] = j + f[0];
		}
		c = b <= 0 ? "" : c;
		return f[0] + c + f[1];
	}
	/**
	 * Text selection in HTML input field
	 * @param {jQuery} jEl
	 * @param {Number} start from which char
	 * @param {Number} stop  to which char
	 */
	static setSelectionRange(jEl, start = 0, stop = 0) {
		if (jEl instanceof $) jEl = jEl[0];
		if (jEl.childNodes.length) {
			// log("jEl.childNodes[0]",jEl.childNodes[0])
			var range = document.createRange();
			var sel = window.getSelection();
			range.setStart(jEl.childNodes[0], start);
			range.collapse(true);
			if (stop > 0) range.setEnd(jEl.childNodes[0], stop);
			sel.removeAllRanges();
			sel.addRange(range);
		}
		// log("range",range)
	}
	/**
	 * Return the upper z-index
	 * @param  {jQuery} [selectorLimit]
	 * @return {number}
	 */
	static getMaxZIndex(selectorLimit = null) {
		var max = 0;
		$(selectorLimit || "*").each((index, el) => {
			var jEl = $(el);
			if (el.id == "M_Help") return true;
			var zindex = parseInt(jEl.css("z-index"), 10) || 0;
			max = Math.max(max, zindex);
		});
		// log("max",max)
		return max;
	}
	/**
	 * Get max z-index + 10
	 * @param  {Number} [increment] number to increment
	 * @return {number}           next z-index
	 */
	static getNextZIndex(increment = 10) {
		return this.getMaxZIndex() + increment;
	}
	/**
	 * Get default speed limit
	 * @return {Number} number of milliseconds
	 */
	static getSpeedAnim() {
		return 500;
	}
	/**
	 * Display smoothly an element
	 * @param  {jQuery}   jEl the element
	 * @param  {Function} cb  callback function after finished animation
	 */
	static showSmoothly(jEl, cb) {
		if (jEl.is(":hidden"))
			jEl
				.css("opacity", 0)
				.show()
				.transition({ opacity: 1 }, this.getSpeedAnim(), () => {
					if (cb) cb();
				});
		else if (cb) cb();
	}
	/**
	 * Hide smoothly an element
	 * @param  {jQuery}   jEl the element
	 * @param  {Function} cb  callback function after finished animation
	 */
	static hideSmoothly(jEl, cb) {
		if (jEl.is(":visible"))
			jEl.css("opacity", 1).transition({ opacity: 0 }, this.getSpeedAnim(), () => {
				jEl.hide();
				if (cb) cb();
			});
		else if (cb) cb();
	}
	/**
	 * Do a POST of json data
	 * @param  {String}   url  the url to call
	 * @param  {object}   args arguments to send
	 * @param  {Function} cb   callback function with "data" argument
	 * @return {jqXHR}
	 */
	static postJson(url, args, cb, optsAjax) {
		return this.ajaxJson(url, args, "POST", cb, optsAjax);
	}
	/**
	 * Do a PUT of json data
	 * @param  {String}   url  the url to call
	 * @param  {object}   args arguments to send
	 * @param  {Function} cb   callback function with "data" argument
	 * @return {jqXHR}
	 */
	static putJson(url, args, cb, optsAjax) {
		return this.ajaxJson(url, args, "PUT", cb, optsAjax);
	}
	/**
	 * Do a GET of json data
	 * @param  {String}   url  the url to call
	 * @param  {object}   args arguments to send
	 * @param  {Function} cb   callback function with "data" argument
	 * @return {jqXHR}
	 */
	static getJson(url, args, cb, optsAjax) {
		return this.ajaxJson(url, args, "GET", cb, optsAjax);
	}
	/**
	 * Do a DELETE of json data
	 * @param  {String}   url  the url to call
	 * @param  {object}   args arguments to send
	 * @param  {Function} cb   callback function with "data" argument
	 * @return {jqXHR}
	 */
	static deleteJson(url, args, cb, optsAjax) {
		return this.ajaxJson(url, args, "DELETE", cb, optsAjax);
	}
	/**
	 * Do a Ajax call of json data
	 * @param  {String}   url  the url to call
	 * @param  {object}   args arguments to send
	 * @param  {String}   POST|PUT|GET|DELETE
	 * @param  {Function} cb   callback function with "data" argument
	 * @return {jqXHR}
	 */
	static ajaxJson(url, args, method, cb, optsAjax) {
		var opts = {
			url: url,
			type: method,
			dataType: "json",
			success: function(data) {
				cb(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				cb(jqXHR.responseJSON);
			}
		};
		if (optsAjax) _.merge(opts, optsAjax);
		if (method == "GET" || method == "DELETE") {
			if (args) opts.data = args;
		} else {
			opts.data = JSON.stringify(args);
			opts.contentType = "application/json";
			opts.processData = false;
			opts.cache = false;
		}
		// log("opts",opts)

		if (M_.App.useWebsocket) {
			if (method == "POST")
				return io.socket.post(url, opts, (data, jwres) => {
					cb(data);
				});
			if (method == "PUT")
				return io.socket.put(url, opts, (data, jwres) => {
					cb(data);
				});
			if (method == "GET")
				return io.socket.get(url, opts, (data, jwres) => {
					cb(data);
				});
			if (method == "DELETE")
				return io.socket.delete(url, opts, (data, jwres) => {
					cb(data);
				});
		}
		return $.ajax(opts);
	}

	// exemple :
	// M_.Utils.saveFiles([form.find('co_avatar_send').jEl.get(0)], '/avatarupdate', {}, function() {
	// }) ;
	/**
	 * Save a file with Ajax technic
	 * @param  {Array}   files    array of input html files
	 * @param  {String}   url      url to call
	 * @param  {Object}   moreArgs send more arguments
	 * @param  {Function} cb       callback after finished
	 * @return {jqXHR}
	 * @example
M_.Utils.saveFiles([form.find('co_avatar_send').jEl.get(0)], '/avatarupdate', {}, function() {}) ;
	 */
	static saveFiles(files, url, moreArgs = {}, cb = null) {
		if (files.length === 0) return cb();
		var formData = new FormData();
		for (var key in moreArgs) {
			formData.append(key, moreArgs[key]);
		}
		// console.log("files", files);
		for (var i = 0; i < files.length; i++) {
			// console.log("files[i].files", files[i].files);
			for (var j = 0; j < files[i].files.length; j++) {
				var name = files[i].name;
				// if (files[i].files.length>0) name += '['+j+']' ;
				// console.log("name", name);
				formData.append(name, files[i].files[j]);
			}
		}
		return $.ajax({
			url: url,
			type: "POST",
			//headers: {Connection: close},
			data: formData,
			contentType: false,
			processData: false,
			dataType: "json",
			cache: false,
			success: data => {
				cb(data);
			}
		});
	}
	/**
	 * Check if a script is loaded (warning : check exactly the file name)
	 * @param  {String}  url url to call
	 * @return {Boolean}     true if already loaded
	 */
	static isLoadedScript(url) {
		var ok = false;
		$("script").each(function() {
			if (this.src === url) ok = true;
		});
		return ok;
	}
	/**
	 * Load a javascript file dynamically ; warning, no callback !!!
	 * @param  {String} url url to call
	 */
	static loadScript(url) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		// script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +'&signed_in=true&callback=initialize';
		script.src = url;
		document.body.appendChild(script);
	}
	/**
	 * To document
	 */
	static saveSelection() {
		if (window.getSelection) {
			var sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				this._selection = sel.getRangeAt(0);
			}
		} else if (document.selection && document.selection.createRange) {
			this._selection = document.selection.createRange();
		} else this._selection = null;
	}

	/**
	 * To document
	 */
	static restoreSelection() {
		if (this._selection) {
			if (window.getSelection) {
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(this._selection);
			} else if (document.selection && this._selection.select) {
				this._selection.select();
			}
		}
	}
};
M_.Utils._appIsFullScreen = false;

/**
 * Observable interface
 * @interface M_.Observable
 * @memberof! <global>
 */
M_.Observable = {
	/**
	 * Call this method in init() method of your class where you implement this mixin
	 */
	initObservable: function() {
		this._listeners = [];
		if (this.listeners) {
			for (var i = 0; i < this.listeners.length; i++) {
				this.addListener(this.listeners[i][0], this.listeners[i][1]);
			}
		}
		//log("this._listeners", this._listeners.length)
	},
	/**
	 * Add a listner to this object
	 * @param {String} evtName The event name
	 * @param {Function} fct     A callback function to execute when event is trigged
	 */
	addListener: function(evtName, fct) {
		this._listeners.push({ evtName: evtName, fct: fct });
	},
	/**
	 * Remove a listner to this object
	 * @param {String} evtName The event name
	 * @param {Function} fct     A callback function previously saved whith addListener()
	 */
	removeListener: function(evtName, fct) {
		var listenersOk = [];
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i].evtName == evtName && this._listeners[i].fct == fct) {
				listenersOk.push(this._listeners[i]);
			}
		}
		this._listeners = listenersOk;
	},
	/**
	 * Trigger the event
	 * @param  {String} evtName The event name previously registered with addListener()
	 * @return {boolean}         Return the result of callback function
	 */
	trigger: function(evtName) {
		var res = true;
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i].evtName == evtName) {
				var args = Array.prototype.slice.call(arguments);
				res = this._listeners[i].fct.apply(this, args.slice(1));
			}
		}
		return res;
	}
};

/**
 * Redefine this constants in your language
 * @memberof! <global>
 */
M_.i18n = {
	// days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	// months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	// daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	// monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	devise: "€",
	translate: function() {}
};

/**
 * Create a model class. Generally you extends this class like exemple below
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @property {array} fields - the fields definition
 * @property {object} row - the values
 * @property {String} primaryKey - the primary key name
 * @example
M_.ModelKeyVal = class extends M_.Model {
	getDefinition() {
		return {
			primaryKey: "key",
			fields: [{ name: 'key' }, { name: 'val' }]
		};
	}
};
 */
M_.Model = class {
	constructor(opts) {
		var defaults = {
			fields: null,
			row: {},
			store: null,
			primaryKey: null
		};
		$.extend(this, defaults, opts, this.getDefinition());

		_.mixin(this, M_.Observable);
		this.initObservable();

		if (!this.row) console.warn("Vous devez définir opts.row");
		// if (!this.store) log("Vous devez définir opts.store") ;
		var fields = this.fields;
		for (var j = 0; j < fields.length; j++) {
			if (!fields[j].type) fields[j].type = "string";
		}
		this.updateRow();
	}
	/**
	 * You must extends this class to return a definition
	 * @function M_.Model#getDefinition
	 */
	getDefinition() {
		return {};
	}
	/**
	 * @return {type}
	 */
	updateRow() {
		var fields = this.fields;
		// log("fields",fields)
		for (var j = 0; j < fields.length; j++) {
			var val = "";
			if (fields[j].type == "date") {
				if (this.row[fields[j].name] === undefined) continue;
				if ($.type(this.row[fields[j].name]) == "date") {
					val = this.row[fields[j].name];
				} else {
					// var fd = 'Y-m-d' ;
					if (this.row[fields[j].name]) {
						// if (this.row[fields[j].name].length>10) fd = 'Y-m-d H:i:s' ;
						// log("this.row[fields[j].name",this.row[fields[j].name])
						// val = M_.Utils.parseDate(this.row[fields[j].name], fd) ;
						val = moment(this.row[fields[j].name]);
						// log("val",val)
					} else val = "";
				}
				this.row[fields[j].name] = val;
			}
			if (fields[j].type == "number") {
				val = this.row[fields[j].name];
				//log("number",fields[j].name,val)
				this.row[fields[j].name] = val * 1;
			}
		}
	}
	/**
	 * Get an object that represent the data model
	 * @returns {object} un nombre
	 */
	getData() {
		return this.getArray();
	}
	getRowData() {
		return this.getArray();
	}
	getArray() {
		var ret = {};
		var fields = this.fields;
		for (var j = 0; j < fields.length; j++) {
			var val = this.get(fields[j].name);
			if (val !== null) {
				ret[fields[j].name] = val;
			}
		}
		for (var key in this.row) {
			if (!M_.Utils.isset(ret, key)) ret[key] = this.row[key];
		}
		return ret;
	}
	/**
	 * Set a object that represent the data model
	 * @param  {object} row - The row
	 * @param  {object} silently - Event "update" is not called
	 */
	setRow(row, silently = false) {
		this.row = row;
		if (silently !== true) {
			this.trigger("update", this);
			if (this.store) this.store.trigger("update", this.store);
		}
	}
	/**
	 * Set only one field of model
	 * @param  {String} field - The field name
	 * @param  {something} val - The value
	 * @param  {object} silently - Event "update" is not called
	 */
	set(field, val, silently) {
		//log("val",field,val)
		this.row[field] = val;
		if (silently !== true) {
			this.trigger("update", this);
			if (this.store) this.store.trigger("update", this.store);
		}
	}
	/**
	 * Create an empty model
	 */
	createEmptyRow() {
		var fields = this.fields;
		for (var j = 0; j < fields.length; j++) {
			this.row[fields[j].name] = "";
		}
	}

	//warning : stocker le résultat ???
	/**
	 * Get a field
	 * @param  {String} field - The field name
	 */
	get(field) {
		var val,
			fields = this.fields;

		for (var j = 0; j < fields.length; j++) {
			// log("fields[j].name",fields[j].name)
			if (fields[j].name == field) {
				if (fields[j].fn) {
					//if (this.row[field]) val = this.row[field] ;
					//else val = eval(fields[j].fn) ;
				} else if (this.row[field] !== undefined) {
					//fields[j].type &&
					if (fields[j].type == "string" || fields[j].type == "text") {
						val = this.row[field];
					} else if (fields[j].type == "number") {
						val = this.row[field] * 1;
					} else if (fields[j].type == "array") {
						val = this.row[field];
					} else if (fields[j].type == "boolean") {
						if (this.row[field] == "true" || this.row[field] === true || this.row[field] === "1" || this.row[field] === 1) val = true;
						else val = false;
					} else if (fields[j].type == "date") {
						if ($.type(this.row[field]) == "date") val = this.row[field];
						else {
							// var fd = 'Y-m-d' ;
							if (this.row[fields[j]]) {
								// if (this.row[fields[j]].length>10) fd = 'Y-m-d H:i:s' ;
								// val = M_.Utils.parseDate(this.row[field]) ;
								val = moment(this.row[field]);
							}
						}
					}
				}
				break;
			}
		}
		if (val === undefined && M_.Utils.isset(this.row, field)) val = this.row[field];
		return val;
	}
	/**
	 * Get the id of row (defined in primaryKey)
	 */
	getId() {
		return this.get(this.primaryKey);
	}
};

/**
 * Use a standard model key / value. No params.
 * @class M_.ModelKeyVal
 * @memberof! <global>
 * @example
// Very useful with combobox
var combo = new M_.Form.Combobox({
	name: 'of_typecook',
	label: "Type de cuisine",
	container: $("#here"),
	store: new M_.Store({
		controller: this,
		model: M_.ModelKeyVal,
		currentSort: ["key", 1],
		rows: [{key:1, val:"Cuisine américaine"}, {key:2, val:"Cuisine niçoise"}]
	})
}) ;
 */
M_.ModelKeyVal = class extends M_.Model {
	getDefinition() {
		return {
			primaryKey: "key",
			fields: [{ name: "key" }, { name: "val" }]
		};
	}
};

/**
 * A store is a client cache of rows. It can do ajax requests in json
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @property {array} [rows=[]] - the data rows
 * @property {boolean} [useWebsocket=M_.App.useWebsocket] - true if use websocket and not ajax
 * @property {array} [rowsModel=[]] - the model rows
 * @property {String} [url=""] - the model rows
 * @property {object} [args={}] - arguments object to pass to each ajax request
 * @property {String} [rootData="data"] - property where read data in json response
 * @property {array} [currentSort=null] - sort the store : ['name', 'asc'] ; the second is 'asc' or 'desc'
 * @property {M_.Model} [model=null] - the model to use
 * @property {String} [primaryKey=""] - the primary key
 * @property {number} [limit=null] - send 'limit' param to ajax request
 * @property {boolean} [sortOnRemote=false] - send 'sort' param to ajax request
 * @property {number} [skip=0] - send 'skip' param to ajax request
 * @property {array} [unshiftRows=[]] - add this rows in first position, just after load
 * @property {array} [pushRows=[]] - add this rows in last positions, just after load
 * @example
// json store
var store = new M_.Store({
	controller: this,
	model: MT_Contacts,
	url: "/contacts",
	limit: 200,
	listeners: [
		['load',(store, data)=> {
			// data are loaded
		}]
	]
}) ;
// ajax response would have the fields define in your model
{
	data: [
		{id:1, name:"David Miglior"},
		{id:2, name:"Michael Miglior"}
	]
}
 */
M_.Store = class {
	/**
	 * Initialize the store. If you extend this method, you should call this._super()
	 *
	 * @param  {object} opts The configuration object
	 */
	constructor(opts) {
		var defaults = {
			rows: [],
			useWebsocket: M_.App.useWebsocket,
			rowsModel: [],
			_tabFieldsForSort: [],
			url: "",
			args: {},
			rootData: "data",
			currentSort: null,
			model: null,
			lastLoadArgs: {},
			primaryKey: "",
			limit: null,
			sortOnRemote: false,
			sortAfterLoad: false,
			skip: 0,
			lastTotal: 0,
			unshiftRows: [],
			pushRows: [],
			_loaded: false,
			_loading: false,
			group: null
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		if (this.model) {
			var model = new this.model({ row: {}, store: {} });
			this.primaryKey = model.primaryKey;
		}
		//must be last init, because update event
		if (this.rows && this.rows.length > 0) {
			//M_.Utils.delay("", $.proxy(function() {
			this.setRows(this.rows);
			//}, this), 10) ;
			//			log("this.unshiftRows",this.unshiftRows)
			if (this.unshiftRows && this.unshiftRows.length > 0) {
				for (let i = 0; i < this.unshiftRows.length; i++) this.rows.unshift(this.unshiftRows[i]);
			}
			if (this.pushRows && this.pushRows.length > 0) {
				for (let i = 0; i < this.pushRows.length; i++) this.rows.push(this.pushRows[i]);
			}
			this.useModel();
		}
	}

	/**
	 * Return the first model instance where the value of field equal val. The comparaison is do with ==, so "2"==2
	 *
	 * @param  {String} field The searched field name
	 * @param  {string|number} val   The value researched.
	 * @return {model}       Return the model instance founded or null
	 */
	//val can be a RegExp
	getRowBy(field, val) {
		var rows = this.rowsModel;
		for (var i = 0; i < rows.length; i++) {
			var v;
			if (this.model) v = rows[i].get(field);
			else v = rows[i][field];
			if (v == val) {
				return rows[i];
			}
		}
		return null;
	}
	/**
	 * @param  {type}
	 * @param  {type}
	 * @return {type}
	 */
	getIndexBy(field, val) {
		var rows = this.rowsModel;
		for (var i = 0; i < rows.length; i++) {
			var v = rows[i].get(field);
			if (v == val) {
				return i;
			}
		}
		return -1;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getRowByIndex(index) {
		var rows = this.rowsModel;
		if (rows[index]) return rows[index];
		return null;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getRow(val) {
		return this.getRowBy(this.primaryKey, val);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getIndexById(id) {
		var rows = this.rowsModel;
		for (var i = 0; i < rows.length; i++) {
			var v = rows[i].getId();
			if (v == id) {
				return i;
			}
		}
		return -1;
	}

	//val can be a RegExp
	/**
	 * @param  {type}
	 * @param  {type}
	 * @return {type}
	 */
	getRowsBy(field, val) {
		var res = [];
		var rows = this.rowsModel;
		for (var i = 0; i < rows.length; i++) {
			var v = rows[i].get(field);
			if (v == val) {
				res.push(rows[i]);
			}
		}
		return res;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getRowAt(index) {
		return this.rowsModel[index];
	}
	/**
	 * @param {type}
	 */
	setRows(rows) {
		this.rows = rows;
		this.useModel();
		//log("this.rows1",this.rows)
		//log("setRows",this.rowsModel)
		this.trigger("update", this, this.rowsModel);
	}
	/**
	 * @param {type}
	 */
	setModels(rows) {}
	/**
	 * @param {type}
	 */
	addModel(row) {}
	/**
	 * @param {type}
	 */
	addRow(row) {
		this.addRows([row]);
	}
	/**
	 * @param {type}
	 */
	addModels(rows) {}
	/**
	 * @param {type}
	 */
	addRows(rows) {
		//this.rows = this.rows.concat(rows) ;
		//this.useModel() ;
		for (var i = 0; i < rows.length; i++) {
			var m = null;
			var row = rows[i];
			if (row instanceof M_.Model) {
				m = row;
				row = row.getArray();
			} else {
				m = new this.model({ row: row, store: this });
			}
			this.rows.push(row);
			this.rowsModel.push(m);
			// this.addRow(rows[i]) ;
			this.trigger("addedRow", this, m);
		}
		this.trigger("update", this, this.rowsModel);
	}
	/**
	 * @return {type}
	 */
	getRows() {
		return this.rowsModel;
	}
	/**
	 * @return {type}
	 */
	count() {
		return this.rowsModel.length;
	}
	/**
	 * @return {type}
	 */
	countTotal() {
		//log("countTotal",this.rowsModel,this.rows)
		if (this.lastTotal === 0) return this.count();
		return this.lastTotal;
	}
	/**
	 * @return {type}
	 */
	deleteAll() {
		this.rows = [];
		this.rowsModel = [];
		this.trigger("removedAll", this);
		this.trigger("update", this, this.rowsModel);
	}
	/**
	 * To document
	 */
	setKeysOnRows() {
		for (var i = 0; i < this.rows.length; i++) {
			this.rows[i]._mid = i;
		}
	}
	_sortRemote(fields, direction) {
		// console.log("_sortRemote", fields, direction);
		if (!this.lastLoadArgs) this.lastLoadArgs = {};
		// this.lastLoadArgs.sort = this.currentSort[0];
		// this.lastLoadArgs.direction = this.currentSort[1];
		this.lastLoadArgs.sort = fields;
		if (direction > 0) this.lastLoadArgs.sort += " ASC";
		else this.lastLoadArgs.sort += " DESC";
		this.reload();
	}
	/**
	 * To document
	 * @param  {Array} fields
	 * @param  {type} direction - direction=1 ASC, direction=-1 DESC, direction=0 toggle
	 * @param  {type} silently
	 * @return {type}
	 * @example
	 * 	store.sort('co_name') ;
	 * 	store.sort('co_name', 1) ;
	 * 	store.sort([['co_name', 1], ['co_date',-1]]) ;
	 */
	sort(fields, direction, silently) {
		// console.log("fields", fields, direction, silently, group);
		if (!direction) direction = 0;
		if (_.isFunction(fields)) {
		} else {
			if (!this._tabFieldsForSort[fields]) this._tabFieldsForSort[fields] = -1;
			this._tabFieldsForSort[fields] = this._tabFieldsForSort[fields] * -1;
			direction = this._tabFieldsForSort[fields];
			// console.log("direction,fields", direction, fields);
			// if (direction === 0) {
			// } else {
			// 	this._tabFieldsForSort[fields] = direction;
			// }
			this.currentSort = [fields, direction];
		}
		if (this.trigger("beforeSort", this, fields, direction) === false) return false;
		//log("this.currentSort",this.currentSort)
		if (this.sortOnRemote) {
			this._sortRemote(fields, direction);
			return;
		}

		// console.log("ok");
		this.rowsModel.sort((a, b) => {
			// log("a,b",a,b)
			let a0;
			let b0;
			let firstres = 0;
			if (_.isFunction(fields)) {
				a0 = fields(a);
				b0 = fields(b);
			} else {
				a0 = a.get(fields);
				b0 = b.get(fields);
			}
			if (a0 === null || b0 === null) return 0;
			if (typeof a0 == "number") {
				if (direction == -1) firstres = b0 - a0;
				else firstres = a0 - b0;
			} else if (a0 instanceof Date) {
				if (direction == -1) firstres = b0 - a0;
				else firstres = a0 - b0;
			} else if (a0 && b0 && a0.getDate && a0.getDate() instanceof Date) {
				if (direction == -1) firstres = b0.getDate() - a0.getDate();
				else firstres = a0.getDate() - b0.getDate();
			} else if (_.isString(a0) && _.isString(b0)) {
				if (direction == -1) firstres = b0.localeCompare(a0);
				else firstres = a0.localeCompare(b0);
			} else firstres = 0;
			// console.log("a0, b0", a0, b0, firstres);
			if (this.group) {
				let a1, b1;
				a1 = this.group(a, this);
				b1 = this.group(b, this);
				let lc = a1.localeCompare(b1);
				// console.log('group',a1,b1,lc);
				if (lc === 0) return firstres;
				return lc;
			}
			return firstres;
		});
		this.trigger("sort", this);
		if (silently !== true) {
			this.trigger("update", this, this.rowsModel);
		}
	}
	// sortByFunction(fun) {
	// 	this.rowsModel.sort((a, b)=> {
	// 		var vala = fun(a) ;
	// 		var valb = fun(b) ;
	// 	}) ;
	// 	this.trigger("sort", this);
	// }
	/**
	 * To document
	 */
	useModel() {
		if (this.model) {
			this.rowsModel = [];
			// var fields = this.model.fields ;
			// log("this.rows",this.rows)
			for (var i = 0; i < this.rows.length; i++) {
				this.rowsModel[i] = new this.model({ row: this.rows[i], store: this });
				//this.rowsModel[i].updateRow() ;
			}
		} else {
			this.rowsModel = this.rows;
		}
	}
	/**
	 * @param  {Function} fn
	 */
	each(fn) {
		//log("length",this.rowsModel)
		for (var i = 0; i < this.rowsModel.length; i++) {
			var ret = fn.call(this, this.rowsModel[i], i);
			if (ret === false) break;
		}
	}
	/**
	 * @return {type}
	 */
	createEmptyRow() {
		var mod = new this.model({ row: {}, store: this });
		mod.createEmptyRow();
		return mod;
	}
	/**
	 * @param {type} skip
	 */
	setSkip(skip) {
		this.skip = skip;
		if (!this.lastLoadArgs) this.lastLoadArgs = {};
		this.lastLoadArgs.skip = skip;
		this.reload();
	}
	/**
	 * @param {type} query
	 */
	setQuery(query) {
		this.reload();
	}
	/**
	 * @return {Boolean}
	 */
	isLoading() {
		return this._loading;
	}
	/**
	 * @return {Boolean}
	 */
	isLoaded() {
		return this._loaded;
	}
	/**
	 * @param  {type} args
	 * @param  {Function} callback
	 * @return {type}
	 */
	load(args, callback) {
		// log("load")
		var okArgs = {};
		if (this.currentSort) {
			if (_.isArray(this.currentSort)) okArgs.sort = this.currentSort[0] + " " + this.currentSort[1];
			else okArgs.sort = this.currentSort;
		}
		if (this.limit && this.limit > 0) okArgs.limit = this.limit;
		if (this.skip) okArgs.skip = this.skip;

		if (args && (args.skip || args.skip === 0)) this.skip = args.skip;
		// if (args && args.sort && _.isArray(args.sort)) this.currentSort[0] = args.sort ;
		// if (args && args.sort && _.isString(args.sort)) this.currentSort = args.sort ;
		// if (args && args.direction) this.currentSort[1] = args.direction ;
		if (args && args.limit) this.limit = args.limit;

		var thisArgs = this.args;
		if (_.isFunction(thisArgs)) thisArgs = this.args();
		$.extend(okArgs, thisArgs, args);
		var obj = { url: this.url, args: okArgs };
		if (this.trigger("beforeLoad", this, obj) === false) return false;
		if (obj.args.onBeforeLoad) obj.args.onBeforeLoad(this, obj);
		this.lastLoadArgs = obj.args;
		this._loaded = false;
		this._loading = true;
		if (this.useWebsocket) {
			io.socket.get(obj.url, okArgs, (data, jwres) => {
				this._treatDataStore(data, callback);
			});
		} else {
			if (this.loadAjaxXHR) this.loadAjaxXHR.abort();
			this.loadAjaxXHR = M_.Utils.getJson(obj.url, okArgs, data => {
				// log("this.loadAjaxXHR", this.loadAjaxXHR, data);
				if (this.loadAjaxXHR.statusText == "abort") return;
				this._treatDataStore(data, callback);
				this.loadAjaxXHR = null;
			});
			// this.loadAjaxXHR = $.ajax({
			// 	url: obj.url,
			// 	type: 'GET',
			// 	contentType: 'application/json',
			// 	data: okArgs,
			// 	dataType: 'json',
			// 	success: (data) => {
			// 		// log("data",data)
			// 		this._treatDataStore(data, callback) ;
			// 	}
			// });
		}
	}
	getOriginalData() {
		return this.lastdata;
	}
	_treatDataStore(data, callback) {
		// log("_treatDataStore",data)
		this._loaded = true;
		this._loading = false;
		this.lastdata = data;

		this.trigger("loadraw", this, data);

		var i;
		//if (this.lastLoadArgs.addRows) this.rows = this.rows.concat(data.data) ;
		//else
		if (data.total || data.total === 0) this.lastTotal = data.total * 1;
		//		 log("this.unshiftRows",this.unshiftRows)
		if (this.unshiftRows.length > 0) {
			for (i = 0; i < this.unshiftRows.length; i++) data[this.rootData].unshift(this.unshiftRows[i]);
		}
		if (this.pushRows.length > 0) {
			for (i = 0; i < this.pushRows.length; i++) data[this.rootData].push(this.pushRows[i]);
		}
		//if (this.lastLoadArgs.add)  ;
		//else
		this.rows = data[this.rootData];
		// this.lastLoadArgs.add = false ;

		this.useModel();
		// if (this.currentSort && !this.sortOnRemote && _.isArray(this.currentSort))
		// 	this.sort(this.currentSort[0], this.currentSort[1], true) ;
		//this.setKeysOnRows() ;

		if (this.sortAfterLoad) {
			this.sort(this.sortAfterLoad, 1, true);
		}

		this.trigger("load", this, this.rowsModel);
		this.trigger("update", this, this.rowsModel);
		if (this.lastLoadArgs.onUpdate) this.lastLoadArgs.onUpdate(this.rowsModel);

		if (this.lastLoadArgs.onBeforeLoad) this.lastLoadArgs.onBeforeLoad = null;
		if (this.lastLoadArgs.onUpdate) this.lastLoadArgs.onUpdate = null;
		if (callback) callback(this);
	}
	/**
	 * @param  {Boolean} [reset=false]
	 * @param  {type} [moreArgs=null]
	 * @return {type}
	 */
	reload(reset = false, moreArgs = null, cb = null) {
		if (reset) {
			this.skip = 0;
			this.lastLoadArgs = {};
		}
		if (moreArgs) $.extend(this.lastLoadArgs, moreArgs);
		this.load(this.lastLoadArgs, cb);
	}
};

/**
 * A base graphical object
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 */
M_.Outlet = class {
	constructor(opts) {
		var defaults = {
			controller: null,
			container: null,
			id: "",
			view: null,
			jEl: null,
			help: null,
			rendered: false,
			top: 0,
			left: 0
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();

		if (!M_.Utils.isEmpty(this.jEl) && $.type(this.jEl) == "string") this.jEl = $("#" + this.jEl);
		// if (!M_.Utils.isEmpty(this.container) && $.type(this.container)=="string") this.container = $("#"+this.container) ;

		if (M_.Utils.isEmpty(this.jEl)) this.create();

		if (this.jEl && M_.Utils.isEmpty(this.jEl.attr("id"))) this.jEl.attr("id", this.id);
		this._attachHelp();

		// if (M_.Utils.isEmpty(this.id)) {
		// 	if (this.jEl && !M_.Utils.isEmpty(this.jEl.attr('id'))) {
		// 		this.id = this.jEl.attr('id') ;
		// 	} else {
		// 		this.id = M_.Utils.id() ;
		// 	}
		// }
		// if (this.jEl && M_.Utils.isEmpty(this.jEl.attr('id'))) this.jEl.attr('id', this.id) ;
		// M_.App.registerOutlet(this) ;
		this.trigger("created", this);
	}
	_attachHelp() {
		if (this.help && this.jEl) {
			new M_.Help({
				controller: this.controller,
				text: this.help,
				attachedObj: this.container
			});
		}
	}
	/**
	 * Extend this class to create your UI.
	 */
	create() {
		this.jEl = $("<div></div>");
		this.container.append(this.jEl);
	}
	/**
	 * Destroy the outlet
	 */
	destroy() {
		if (!this.jEl) return;
		this.jEl.remove();
		this.container.empty();
	}
	/**
	 * Return jEl element. Generally the main object.
	 * @returns {jquery} the main jQuery element
	 */
	getEl() {
		return this.jEl;
	}

	/**
	 * Search a class or selector in the container, like $.find()
	 * @param  {string} selector
	 * @return {jQuery}
	 */
	findEl(selector) {
		return this.container.find(selector);
	}
};

/**
 * Implement this interface to get a store
 * @interface
 * @memberof! <global>
 */
M_.Stored = {
	//autoFocus: null,
	/**
	 * Call this method in your init() function
	 */
	initStored: function() {
		if (!this.store) console.warn("store is mandatory in M_.Stored");
		else
			//if (this.store) this.setStore(this.store) ;
			this.store.addListener("update", $.proxy(this.updateStore, this));
	},
	/**
	 * Configure a new store
	 * @param {M_.Store} store The new store used
	 */
	setStore: function(store) {
		this.store = store;
		this.store.addListener("update", $.proxy(this.updateStore, this));
	},
	/**
	 * Return the store object
	 * @return {M_.Store} The store object or null
	 */
	getStore: function() {
		return this.store;
	}
	/**
	 * Redefine this method to update your UI
	 * @param  {M_.Store} store The store object
	 */
	// updateStore: function(store) {
	// }
};

/**
 * Display an help on jquery element
 * @class
 * @memberof! <global>
 * @property  {type} controller
 * @property  {type} text
 * @property  {type} attachedObj
 * @property  {type} shiftX
 * @property  {type} shiftY
 * @property  {type} maxWidth
 */
M_.Help = class {
	constructor(opts) {
		var defaults = {
			controller: null,
			text: "",
			attachedObj: null,
			shiftX: 15,
			shiftY: -15,
			maxWidth: 300,
			showNow: false
		};
		opts = opts ? opts : {};
		opts = $.extend(this, defaults, opts);
		this.create();

		if (this.showNow) {
			this.show();
			$(document).on("mousemove", $.proxy(this._mousemove, this));
		}
	}
	_mousemove(evt) {
		var top = evt.pageY * 1 + this.shiftY;
		var left = evt.pageX * 1 + this.shiftX;
		if (left + 300 + 100 > $(window).width()) {
			left = evt.pageX * 1 - this.shiftX - $("#M_Help").outerWidth();
			if ($("#M_Help").hasClass("left"))
				$("#M_Help")
					.removeClass("left")
					.addClass("right");
			if (!$("#M_Help").hasClass("right")) $("#M_Help").addClass("right");
		} else {
			if ($("#M_Help").hasClass("right"))
				$("#M_Help")
					.removeClass("right")
					.addClass("left");
			if (!$("#M_Help").hasClass("left")) $("#M_Help").addClass("left");
		}
		if (top + $("#M_Help").outerHeight() - 10 > $(window).height()) {
			top = $(window).height() - $("#M_Help").outerHeight() - 10;
			// $('#M_Help.left:after').css('top',top) ;
		}
		$("#M_Help").css({
			top: top,
			left: left
		});
	}
	/**
	 * To document
	 */
	create() {
		// console.log("this.attachedObj", this.attachedObj);
		this.attachedObj.mouseenter(evt => {
			this.show(evt);
			$(document).on("mousemove", $.proxy(this._mousemove, this));
		});
		this.attachedObj.mouseleave(evt => {
			this.hide(evt);
			$(document).off("mousemove", $.proxy(this._mousemove, this));
		});
		this.attachedObj.click(evt => {
			this.hide(evt);
		});
		if (this.attachedObj.prop("tagName").toLowerCase() == "input") {
			this.attachedObj.focus(evt => {
				this.hide();
			});
			this.attachedObj.focus(evt => {
				this.hide();
			});
		}
	}
	/**
	 * @param  {event} evt
	 */
	show(evt) {
		$("#M_Help")
			.html(this.text)
			.css("max-width", this.maxWidth)
			.show();
	}
	/**
	 * @param  {event} evt
	 */
	hide(evt) {
		$("#M_Help").hide();
	}
	/**
	 *
	 */
	static createMHelp() {
		$("body").append("<div id='M_Help'></div>");
	}
	/**
	 *
	 */
	static hideMHelp() {
		$("#M_Help").hide();
	}
};

/**
 * Like a card layout. Use HTML to define them.
 * @class
 * @memberof! <global>
 * @property {String} firstTab
 */
M_.Tabs = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			firstTab: null,
			buttons: null,
			onChange: null
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (this.buttons) {
			this.buttons.find(".M_TabButton").each((ind, el) => {
				$(el).click(evt => {
					var jEl = $(evt.target);
					if (jEl.hasClass("disabled")) return;
					// console.log("jEl.attr('for')", jEl.attr('for'));
					this.show(jEl.attr("for"), next => {
						if (this.onChange) {
							this.onChange(jEl.attr("for"), next);
						} else {
							next();
						}
					});
				});
			});
		}

		// this.container.children('.M_Tab').each(function() {
		// 	this.tabTabs.push($(this)) ;
		// }) ;
	}
	// addTab(jEl) {
	// 	this.tabTabs.push(tab) ;
	// }
	/**
	 * @param  {type}
	 * @param  {type}
	 * @return {type}
	 */
	show(jElId, cbBeforeShow, anim = true) {
		var speed = M_.Utils.getSpeedAnim();
		// log("show",jElId)
		var current = null;
		this.container.children(".M_Tab").each((ind, el) => {
			// log("$(this).attr('id')",$(this).attr('id'))
			if ($(el).hasClass("active")) {
				current = $(el);
				return false;
			}
		});
		// log("current",current)
		if (current && current.attr("id") == jElId) {
			cbBeforeShow(cbAfterShow => {
				if (cbAfterShow === false) return;
				if (cbAfterShow) cbAfterShow();
			});
			return;
		} else if (current) {
			if (anim) {
				current.transition({ opacity: 0 }, speed, () => {
					current.removeClass("active");
					$("#" + jElId)
						.css("opacity", 0.01)
						.addClass("active");
					cbBeforeShow(cbAfterShow => {
						if (cbAfterShow === false) return;
						$("#" + jElId).transition({ opacity: 1 }, speed, () => {
							if (cbAfterShow) cbAfterShow();
						});
					});
				});
			} else {
				current.removeClass("active");
				cbBeforeShow(cbAfterShow => {
					if (cbAfterShow === false) return;
					$("#" + jElId)
						.css("opacity", 1)
						.addClass("active");
					if (cbAfterShow) cbAfterShow();
				});
			}
		} else {
			if (anim) {
				$("#" + jElId)
					.css("opacity", 0.01)
					.addClass("active");
				cbBeforeShow(cbAfterShow => {
					if (cbAfterShow === false) return;
					$("#" + jElId).transition({ opacity: 1 }, speed, () => {
						if (cbAfterShow) cbAfterShow();
					});
				});
			} else {
				cbBeforeShow(cbAfterShow => {
					if (cbAfterShow === false) return;
					$("#" + jElId)
						.css("opacity", 1)
						.addClass("active");
					if (cbAfterShow) cbAfterShow();
				});
			}
		}
		if (this.buttons) {
			this.buttons.find(".M_TabButton").each((ind, el) => {
				$(el).removeClass("active");
				if ($(el).attr("for") == jElId) $(el).addClass("active");
			});
		}
	}
};

/**
 * A graphical tree
 * @class
 * @memberof! <global>
 * @extends M_.Outlet
 * @property {String} autoLoad
 * @property {String} tpl
 */
M_.Tree = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			autoLoad: false,
			displayRootNode: true,
			url: "",
			cls: "M_Tree",
			retractable: true,
			movable: true,
			dynamic: false,
			rootNode: {
				opened: true,
				hidden: false,
				label: "RootNode",
				id: "rootnode",
				draggable: false,
				droppable: true,
				nodes: []
			}
		};

		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	/**
	 * @return {type}
	 */
	create() {
		this.jEl = $("<div class='" + this.cls + "'></div>");
		this.container.append(this.jEl);
		// this._drawNodes();
	}
	/**
	 * Draw the tree
	 */
	draw() {
		this._drawNodes();
	}
	appendNodes(parentId, nodes) {
		let parentNode = this.jEl.find("li[m_id=" + parentId + "]");
		parentNode.find(" > ul").empty();
		_.each(nodes, node => {
			this._createNode(parentId, node);
		});
		parentNode.addClass("loaded");
	}
	// _drawNodes() {
	// 	var html = "";
	// 	html += "<ul>";
	// 	html += this._createChildNodes(this.rootNode);
	// 	html += "</ul>";
	// 	this.jEl.html(html);
	//
	// 	this.jEl
	// 		.find("li:has(ul)")
	// 		.addClass("M_TreeParentLi")
	// 		.find(" > span"); //.attr('title', 'Collapse this branch')
	// 	if (this.retractable) {
	// 		this.jEl.find("li.M_TreeParentLi > span > i").on("click", evt => {
	// 			var target = $(evt.target);
	// 			var children = target.closest("li.M_TreeParentLi").find(" > ul > li");
	// 			if (children.is(":visible")) {
	// 				children.slideUp();
	// 				target
	// 					.find(" > i")
	// 					.addClass("fa-plus-square")
	// 					.removeClass("fa-minus-square"); //.attr('title', 'Expand this branch')
	// 			} else {
	// 				children.slideDown();
	// 				target
	// 					.find(" > i")
	// 					.addClass("fa-minus-square")
	// 					.removeClass("fa-plus-square"); //.attr('title', 'Collapse this branch')
	// 			}
	// 			evt.stopPropagation();
	// 		});
	// 	}
	// 	this.jEl.find("li > span").on("click", evt => {
	// 		var nodeId = $(evt.target)
	// 			.closest("li")
	// 			.attr("m_id");
	// 		this.setSelected(nodeId);
	//
	// 		var node = this.getNode(nodeId);
	// 		if (node.clickable !== false) {
	// 			this.trigger("nodeclick", this, nodeId, node);
	// 			if (this.dynamic) this.trigger("nodeopen", this, nodeId, node);
	// 		}
	// 	});
	// 	this._dragMID = null;
	// 	if (this.movable) {
	// 		this.jEl
	// 			.find("li.draggable > span")
	// 			.attr("draggable", true)
	// 			.on("drag", (evt, evt2) => {
	// 				// console.log("drag",evt);
	// 				this._dragMID = $(evt.target)
	// 					.closest("li")
	// 					.attr("m_id");
	// 			});
	// 		this.jEl
	// 			.find("li.droppable > span")
	// 			.on("dragover", evt => {
	// 				// console.log("dragover",evt);
	// 				var nodeDrop = $(evt.target)
	// 					.closest("li")
	// 					.attr("m_id");
	// 				if (nodeDrop != this._dragMID) evt.preventDefault();
	// 			})
	// 			.on("drop", evt => {
	// 				// console.log("drop",evt);
	// 				evt.preventDefault();
	// 				var mid = this._dragMID;
	// 				var nodeDrop = $(evt.target)
	// 					.closest("li")
	// 					.attr("m_id");
	// 				// console.log("this.isNodeParentOf(mid, nodeDrop)", this.isNodeParentOf(mid, nodeDrop));
	// 				if (mid != nodeDrop && !this.isNodeParentOf(mid, nodeDrop)) {
	// 					let ok = this.trigger("beforenodemove", this, mid, nodeDrop);
	// 					if (ok === false) return;
	// 					this.moveNode(mid, nodeDrop);
	// 				}
	// 			});
	// 	}
	// }

	getNodePath(nodeId, names) {
		// console.log("getNodePath",nodeId);
		let nodepath = [];
		let jEl = this.jEl.find("li[m_id=" + nodeId + "]");
		function iter(el, nodepath, scope) {
			let n = scope._recreateNode(el.attr("m_id"));
			nodepath.unshift(n);
			let p = el.parent().parent();
			if (p.is("li")) {
				iter(p, nodepath, scope);
			}
		}
		iter(jEl, nodepath, this);
		return nodepath;
	}
	isNodeParentOf(nodeId, childOfNodeId) {
		let path1 = this.getNodePath(nodeId);
		let path2 = this.getNodePath(childOfNodeId);
		// console.log("path1,path2", path1, path2);
		// let dif = [];
		let ok = false;
		_.each(path2, (p2, i2) => {
			if (!path1[i2]) {
				ok = true;
				return false;
			}
			if (p2.id == path1[i2].id) return;
			if (p2.id != path1[i2].id) return false;
		});
		return ok;
	}
	_recreateNode(nodeId) {
		let parentNodeEl = this.jEl.find("li[m_id='" + nodeId + "']");
		let hasChild = false;
		if (parentNodeEl.find(" > ul > li").length) hasChild = true;
		return {
			hidden: false,
			label: parentNodeEl.find(" > span > .txt").html(),
			draggable: parentNodeEl.hasClass("draggable"),
			droppable: parentNodeEl.hasClass("draggable"),
			id: nodeId,
			hasChild: hasChild,
			opened: parentNodeEl.hasClass("opened")
			// nodes: []
		};
	}
	_createNode(parentId, node) {
		let parentNodeEls = this.jEl.find("li[m_id=" + parentId + "] > ul");
		if (parentId == "-1") parentNodeEls = this.jEl.find(" > ul");
		var html = "";
		if (!node.id) node.id = M_.Utils.id();
		let myclass = "";
		if (node.draggable) myclass += " draggable";
		if (node.droppable) myclass += " droppable";
		if (node.clickable !== false) myclass += " clickable";
		let fa = "",
			fa2 = "";
		if (node.hasChild || (node.nodes && node.nodes.length)) {
			myclass += " openable";
		} else {
			fa = "display:none;";
		}
		if (node.opened || !this.dynamic) {
			myclass += " opened";
			fa2 = "fa-minus-square";
		} else {
			fa2 = "fa-plus-square";
		}
		// console.log("node.hasChild", node.hasChild, myclass);
		html += "<li m_id='" + node.id + "' class='" + myclass + "'>";
		html += "<span><i class='fa " + fa2 + "' style='" + fa + "'></i><div class='txt'>" + node.label + "</div></span>";
		html += "<ul></ul>";
		html += "</li>";
		let jEl = $(html);
		// console.log("html", html, parentNodeEls);
		parentNodeEls.append(jEl);
		jEl.find(" > span").on("click", evt => {
			var jEl = $(evt.target).closest("li");
			var nodeId = jEl.attr("m_id");
			var node = this._recreateNode(nodeId);

			if (node.clickable !== false) {
				this.setSelected(nodeId);
				this.trigger("nodeclick", this, nodeId, node);
				if (node.opened) {
					this.closeNode(nodeId);
				} else {
					this.openNode(nodeId);
				}
			}
		});
		this._dragMID = null;
		if (this.movable && node.draggable) {
			jEl
				.find(" > span")
				.attr("draggable", true)
				.on("drag", (evt, evt2) => {
					// console.log("drag",evt);
					this._dragMID = $(evt.target)
						.closest("li")
						.attr("m_id");
				});
			if (node.droppable) {
				jEl.find(" > span").on("dragover", evt => {
					var nodeDrop = $(evt.target)
						.closest("li")
						.attr("m_id");
					// console.log("dragover", nodeDrop);
					if (nodeDrop != this._dragMID) evt.preventDefault();
				});
				jEl.find(" > span").on("drop", evt => {
					evt.preventDefault();
					var mid = this._dragMID;
					var nodeDrop = $(evt.target)
						.closest("li")
						.attr("m_id");
					// console.log("this.isNodeParentOf(mid, nodeDrop)", this.isNodeParentOf(mid, nodeDrop));
					if (mid != nodeDrop && !this.isNodeParentOf(mid, nodeDrop)) {
						let ok = this.trigger("beforenodemove", this, mid, nodeDrop);
						if (ok === false) return;
						this.moveNode(mid, nodeDrop);
					}
				});
			}
		}
	}
	// _createChildNodes(parent) {
	// 	var html = "";
	// 	if (!parent.id) parent.id = M_.Utils.id();
	// 	let myclass = "";
	// 	if (parent.draggable) myclass += " draggable";
	// 	if (parent.droppable) myclass += " droppable";
	// 	html += "<li m_id='" + parent.id + "' class='" + myclass + "'>";
	// 	let fa = "";
	// 	if (parent.nodes && parent.nodes.length) fa = "fa fa-minus-square";
	// 	html += "<span><i class='" + fa + "'></i><div class='txt'>" + parent.label + "</div></span>";
	// 	html += "<ul>";
	// 	if (parent.nodes && parent.nodes.length) {
	// 		_.each(parent.nodes, (node, index) => {
	// 			html += this._createChildNodes(node);
	// 		});
	// 	}
	// 	html += "</ul>";
	// 	html += "</li>";
	// 	return html;
	// }
	// _iter(parent, nodeId, action) {
	// 	// if (action=='path') this._nodepath.push(parent.id) ;
	// 	if (nodeId == "rootnode") {
	// 		if (action == "get") {
	// 			this._nodeparent = null;
	// 			this._resNodeId = parent;
	// 		}
	// 		if (action == "add") {
	// 			if (!parent.nodes) parent.nodes = [];
	// 			parent.nodes.push(this._nodeToAdd);
	// 		}
	// 		return;
	// 	}
	// 	if (parent.nodes && parent.nodes.length) {
	// 		_.each(parent.nodes, (node, index) => {
	// 			if (!node) return;
	// 			if (node.id == nodeId) {
	// 				if (action == "remove") parent.nodes.splice(index, 1);
	// 				if (action == "get") {
	// 					this._nodeparent = parent;
	// 					this._resNodeId = node;
	// 				}
	// 				if (action == "add") {
	// 					if (!node.nodes) node.nodes = [];
	// 					node.nodes.push(this._nodeToAdd);
	// 				}
	// 			}
	// 			this._iter(node, nodeId, action);
	// 		});
	// 	}
	// 	// return '' ;
	// }
	/**
	 * @param {NodeObject} node
	 * @param {String} parentId
	 */
	addNode(node, parentId, silently) {
		this.trigger("nodeadd", this, node, parentId, node => {
			this._createNode(parentId, node);
			// this._checkAllOpenable();
		});
	}
	closeNode(nodeId) {
		let jEl = this.jEl.find("li[m_id=" + nodeId + "]");
		var node = this._recreateNode(nodeId);
		node.opened = false;
		jEl.removeClass("opened");
		jEl.find(" > ul").hide();
		if (jEl.hasClass("openable")) {
			jEl.find(" > span > i").removeClass("fa-minus-square");
			jEl.find(" > span > i").addClass("fa-plus-square");
		}
	}
	openPath(path, cb) {
		function iter(num, scope, cb) {
			// console.log("num", num);
			scope.setSelected(path[num]);
			scope.openNode(path[num], () => {
				if (path[num + 1]) iter(num + 1, scope, cb);
				else if (cb) cb();
			});
		}
		iter(0, this, cb);
	}
	openNode(nodeId, cb) {
		let jEl = this.jEl.find("li[m_id=" + nodeId + "]");
		var node = this._recreateNode(nodeId);
		node.opened = true;
		jEl.addClass("opened");
		jEl.find(" > ul").show();
		if (jEl.hasClass("openable")) {
			jEl.find(" > span > i").addClass("fa-minus-square");
			jEl.find(" > span > i").removeClass("fa-plus-square");
		}
		// console.log("openNode");
		if (!cb) cb = function() {};
		if (this.dynamic && jEl.hasClass("openable") && !jEl.hasClass("loaded")) this.trigger("nodeopen", this, nodeId, node, cb);
	}
	// addNode(node, parentId, silently) {
	// 	this._nodeToAdd = node;
	// 	this._iter(this.rootNode, parentId, "add");
	// 	this._drawNodes();
	// 	if (!silently) this.trigger("nodeadd", this, node, parentId);
	// }
	/**
	 * @param  {String}	nodeId
	 * @param  {String}	parentId
	 */
	// moveNode(nodeId, parentId, silently) {
	// 	// log("nodeId, parentId",nodeId, parentId)
	// 	var node = this.getNode(nodeId);
	// 	this.removeNode(nodeId, true);
	// 	this.addNode(node, parentId, true);
	// 	this._drawNodes();
	// 	if (!silently) this.trigger("nodemove", this, nodeId, parentId);
	// }
	// _checkAllOpenable() {
	// 	this.jEl.find("li[m_id]").each((ind, el) => {
	// 		if ($(el).find(" > ul > li").length) {
	// 			$(el)
	// 				.find(" > span > i")
	// 				.show();
	// 			$(el).addClass("openable");
	// 			// if (
	// 			// 	$(el)
	// 			// 		.find(" > ul")
	// 			// 		.css("display") == "none"
	// 			// )
	// 			// 	$(el).addClass("opened");
	// 			// else $(el).removeClass("opened");
	// 		} else {
	// 			$(el)
	// 				.find(" > span > i")
	// 				.hide();
	// 			$(el).removeClass("opened");
	// 			// .removeClass("openable")
	// 		}
	// 	});
	// }
	moveNode(nodeId, parentId, silently) {
		let jEl = this.jEl.find("li[m_id=" + nodeId + "]");
		// let parentjEl = jEl.parent().parent();
		let jEl2 = this.jEl.find("li[m_id=" + parentId + "]");
		let p = jEl.detach();
		jEl2.find(" > ul").append(p);
		// this._checkAllOpenable();

		if (!silently) this.trigger("nodemove", this, nodeId, parentId);
		// log("nodeId, parentId",nodeId, parentId)
		// var node = this.getNode(nodeId);
		// this.removeNode(nodeId, true);
		// this.addNode(node, parentId, true);
		// this._drawNodes();
	}

	/**
	 * @param  {type}
	 * @return {Array}
	 */
	// getNodePath(nodeId, names) {
	// 	// console.log("getNodePath",nodeId);
	// 	var nodepath = [];
	// 	let node = this.getNode(nodeId);
	// 	if (!node) return nodepath;
	// 	if (names) nodepath.push(node.label);
	// 	else nodepath.push(node.id);
	// 	// this._iter(this.rootNode, nodeId, 'path') ;
	// 	var nodeIdStart = nodeId;
	// 	if (nodeId == "rootnode") return nodepath;
	// 	for (var i = 0; i < 100; i++) {
	// 		var parentNode = this.getNodeParent(nodeIdStart);
	// 		if (names) {
	// 			nodepath.unshift(parentNode.label);
	// 		} else {
	// 			nodepath.unshift(parentNode.id);
	// 		}
	// 		nodeIdStart = parentNode.id;
	// 		if (parentNode.id == "rootnode") break;
	// 	}
	// 	return nodepath;
	// }
	// getNodeParent(nodeId) {
	// 	this._nodeparent = null;
	// 	this._iter(this.rootNode, nodeId, "get");
	// 	// return M_.Utils.clone(this._nodeparent) ;
	// 	return this._nodeparent;
	// }
	// isNodeChildOf(nodeId, childOfNodeId) {
	// 	let path1 = this.getNodePath(nodeId);
	// 	let path2 = this.getNodePath(childOfNodeId);
	// }
	// isNodeParentOf(nodeId, childOfNodeId) {
	// 	let path1 = this.getNodePath(nodeId);
	// 	let path2 = this.getNodePath(childOfNodeId);
	// 	// 	console.log("path1,path2",path1,path2);
	// 	let dif = [];
	// 	let ok = false;
	// 	_.each(path2, (p2, i2) => {
	// 		if (!path1[i2]) {
	// 			ok = true;
	// 			return false;
	// 		}
	// 		if (p2 == path1[i2]) return;
	// 		if (p2 != path1[i2]) return false;
	// 	});
	// 	return ok;
	// }
	/**
	 * @param  {String}	nodeId
	 */
	removeNode(nodeId, silently) {
		// this.jEl.find("li[m_id='"++"']").remove() ;
		// this._iter(this.rootNode, nodeId, "remove");
		// this._drawNodes();
		let jEl = this.jEl.find("li[m_id=" + nodeId + "]");
		jEl.remove();
		// this._checkAllOpenable();
		if (!silently) this.trigger("noderemove", this, nodeId);
	}
	/**
	 * @param  {String}	nodeId
	 * @return {NodeObject}
	 */
	// getNode(nodeId) {
	// 	this._resNodeId = null;
	// 	this._iter(this.rootNode, nodeId, "get");
	// 	// return M_.Utils.clone(this._resNodeId) ;
	// 	return this._resNodeId;
	// }
	getNode(nodeId) {
		return this._recreateNode(nodeId);
	}
	initDynamic(rootNode) {
		this.rootNode = rootNode;
		// let myclass = "";
		var html = "";
		html += "<ul>";
		html += "</ul>";
		this.jEl.html(html);
		this._createNode("-1", rootNode);
		// this._checkAllOpenable();
	}
	/**
	 * @param {NodeObject} rootNode
	 */
	setRootNode(rootNode) {
		this.rootNode = rootNode;
		// let myclass = "";
		var html = "";
		html += "<ul>";
		html += "</ul>";
		this.jEl.html(html);
		function iter(parentId, node, scope) {
			scope._createNode(parentId, node);
			_.each(node.nodes, n => {
				iter(node.id, n, scope);
			});
		}
		iter("-1", rootNode, this);
		// this._checkAllOpenable();
		// this._drawNodes();
	}
	getSelected() {
		let sel = "rootnode";
		if (this.jEl.find("span.selected").closest("li").length)
			sel = this.jEl
				.find("span.selected")
				.closest("li")
				.attr("m_id");
		return sel;
	}
	setSelected(nodeId) {
		// console.log("nodeId",nodeId);
		this.jEl.find("span.selected").removeClass("selected");
		this.jEl.find('li[m_id="' + nodeId + '"] > span').addClass("selected");
	}
	_listenDocClick(evt) {
		// console.log("_listenDocClick", this._currentRenameId, $(evt.target).closest('li'));
		this._listenDoc(evt, false);
	}
	_listenDocKeypress(evt) {
		if (evt.which == 13) {
			evt.preventDefault();
			this._listenDoc(evt, true);
		}
	}
	_listenDoc(evt, nevermind) {
		if (
			!nevermind &&
			$(evt.target)
				.closest("li")
				.attr("m_id") == this._currentRenameId
		)
			return;
		this.jEl.find('li[m_id="' + this._currentRenameId + '"] > span > div').attr("contenteditable", false);
		$(document).off("click", $.proxy(this._listenDocClick, this));
		$(document).off("keypress", $.proxy(this._listenDocKeypress, this));
		let label = this.jEl.find('li[m_id="' + this._currentRenameId + '"] > span > div').text();
		this.trigger("noderename", this, this._currentRenameId, label);
	}
	renameNode(nodeId) {
		this._currentRenameId = nodeId;
		let el = this.jEl.find('li[m_id="' + nodeId + '"] > span > div');
		el.attr("contenteditable", true);
		var range = document.createRange();
		range.selectNodeContents(el.get(0));
		var txtsel = window.getSelection();
		txtsel.removeAllRanges();
		txtsel.addRange(range);
		window.setTimeout(() => {
			$(document).on("click", $.proxy(this._listenDocClick, this));
			$(document).on("keypress", $.proxy(this._listenDocKeypress, this));
		}, 200);
	}
};

/**
 * A graphical list to implement
 * @class
 * @memberof! <global>
 * @extends M_.Outlet
 * @implements M_.Stored
 * @property {String} autoLoad
 * @property {String} tpl
 */
M_.List = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			autoLoad: false,
			tpl: ""
		};

		// if (!opts.jEl && !opts.colsDef) log("jEl is mandatory in M_.List") ;
		// if (!opts.tpl && !opts.colsDef) log("tpl is mandatory in M_.List") ;
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		// $.extend(true, this.prototype, M_.Stored) ;
		_.mixin(this, M_.Stored);
		// log("store", Object.mixin)
		this.initStored();

		//this.render();
	}
	/**
	 * @return {type}
	 */
	updateStore() {
		this.render();
	}
	/**
	 * Redefine this method to render your UI
	 */
	render() {}
};

// M_.Draggable = class {
// 	constructor(el, jElHandle=null, jElHelper=null) {
// 		//tabDraggable.push({el:el, jElHandle:jElHandle}) ;
// 		jElHandle.mousedown({el:el}, $.proxy(function(evt) {
// 			this.dragEl = evt.data.el ;
// 			this.dragStart = true ;
// 			this.dragDiff = {top: evt.pageY-this.dragEl.offset().top, left: evt.pageX-this.dragEl.offset().left}
// 		}, this)) ;
// 		$(document).mouseup({el:el}, $.proxy(function() {
// 			this.dragStart = false ;
// 		}, this)) ;
// 		$(document).mousemove({el:el}, $.proxy(function(evt) {
// 			if (this.dragStart && this.dragEl == evt.data.el) {
// 				var top = evt.pageY ;
// 				var left = evt.pageX ;
// 				this.dragEl.offset({top: top-this.dragDiff.top, left: left-this.dragDiff.left}) ;
// 			}
// 		}, this)) ;
// 	}

/**
 * A simple list "à la Apple"
 * @class
 * @memberof! <global>
 * @extends M_.List
 * @property {type} classItems
 * @property {type} itemValue
 * @property {type} itemKey
 * @property {type} selectionVisible
 * @property {type} multipleSelection
 * @property {type} currentSelection
 * @property {type} dynamic
 * @property {type} lineHeight
 * @property {type} loadLimit
 * @property {type} itemsDraggableTo
 */
M_.SimpleList = class extends M_.List {
	constructor(opts) {
		var defaults = {
			classItems: "M_SimpleListItem",
			itemValue: "",
			itemKey: "",
			selectionVisible: false,
			multipleSelection: false,
			currentSelection: [],
			dynamic: false,
			loadLimit: 400,
			lineHeight: 34,
			oddEven: true,
			// _startPosition: 0,
			itemsDraggableTo: false,
			_dragStarted: false,
			_lastSelection: null,
			group: null,
			groupLabel: null,
			groupStartClosed: false,
			groupClose: false,
			_groupsclosed: []
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		if (optsTemp && optsTemp.store && optsTemp.group) {
			optsTemp.store.group = optsTemp.group;
		}
		super(optsTemp);

		// this.setSelection(this.currentSelection) ;
		// this.create() ;
	}
	/**
	 * @return {type}
	 */
	updateStore() {
		super.updateStore();
		this.setSelection(this.currentSelection);
	}
	/**
	 * @return {type}
	 */
	create() {
		var html = "";
		html += `<div class='M_SimpleList'>
   					<div class='M_SimpleListContent'>
   						<div class='M_SimpleListContentFake1'></div>
   						<div class='M_SimpleListContentReal'></div>
   						<div class='M_SimpleListContentFake2'></div>
   					</div>
   				</div>`;
		this.jEl = $(html);
		this.container.append(this.jEl);
		if (!this.dynamic) this.jEl.find(".M_SimpleListContent").css("background-image", "none");

		if (this.dynamic) {
			// console.log("this.jEl",this.jEl);
			this.jEl.scroll(evt => {
				// console.log("scroll", this.isrendering);
				if (this._scrollisloading) return;
				M_.Utils.delay(
					() => {
						var diff = this.jEl.scrollTop();
						var _skipPosition = Math.ceil(diff / this.lineHeight) - Math.ceil(this.loadLimit / 4);
						if (_skipPosition < 0) _skipPosition = 0;
						this._lastscrolltop = diff;

						this._triggerFromTo();

						if (this.store.skip == _skipPosition) return;
						let h1 = this.jEl.find(".M_SimpleListContentFake1").height() + this.jEl.find(".M_SimpleListContentReal").height();
						let h2 = diff + this.jEl.height();
						if (h1 < h2 || this.jEl.find(".M_SimpleListContentFake1").height() > diff) {
							this._lastscrolltop = diff;
							this._scrollisloading = true;
							this.store.reload(false, { skip: _skipPosition, limit: this.loadLimit });
						}
					},
					100,
					"m_simplelist_scroll"
				);
			});
		}
	}
	_triggerFromTo() {
		let from = Math.ceil(this.jEl.scrollTop() / this.lineHeight) + 1;
		let to = Math.ceil(this.jEl.height() / this.lineHeight) + from;
		if (to > this.store.countTotal()) to = this.store.countTotal();
		this.trigger("showfromto", this, from, to);
	}
	/**
	 * @return {type}
	 */
	render() {
		// log("render")
		this.isrendering = true;
		var html = "",
			mid = this.store.primaryKey,
			previousgroup = "----",
			previousgroupnum = 0;
		this.store.each((model, indexTemp) => {
			// console.log("model.getData()", model.getData());
			// log("cg_created",model.get('cg_name'))
			var val = "";
			if ($.isFunction(this.itemValue)) val = this.itemValue(model);
			else val = model.get(this.itemValue);
			var clsTr = this.classItems;
			if (this.store.group) {
				let g1 = this.store.group(model, this.store);
				let g2 = this.groupLabel(model, this.store);
				if (previousgroup != g1) {
					previousgroupnum++;
					let closeopenfa = "";
					if (this.groupClose) {
						let chevtemp = "down";
						if (_.indexOf(this._groupsclosed, previousgroupnum) >= 0) chevtemp = "left";
						closeopenfa = '<div style="float:right;"><span class="fa fa-chevron-' + chevtemp + ' M_TableGroupChevron"></span></div>';
					}
					html += "<div class='M_SimpleListGroup' data-groupnum='" + previousgroupnum + "'>";
					html += "" + closeopenfa + g2 + "";
					html += "</div>";
				}
				previousgroup = g1;
				clsTr += " M_TableGroupItem_" + previousgroupnum;
				// if (_.indexOf(this._groupsclosed, previousgroupnum) >= 0) styleTr += "display:none;";
			}
			if (this.oddEven) {
				if (this.dynamic) {
					if ((indexTemp + this.store.skip) % 2 === 0) clsTr += " M_TableListOdd";
					else clsTr += " M_TableListEven";
				} else {
					if (indexTemp % 2 === 0) clsTr += " M_TableListOdd";
					else clsTr += " M_TableListEven";
				}
			}
			html += "<div class='" + clsTr + " M_Noselectable' data-m_id='" + model.get(mid) + "'>" + val + "</div>";
		});
		this.jEl.find(".M_SimpleListContentReal").html(html);

		// this.jEl.find('.'+this.classItems).m_draggable() ;

		// $("."+this.classItems).draggable({
		// 	cursor: "move",
		// 	cursorAt: { top: -12, left: -20 },
		// 	helper: function( event ) {
		// 		return $( "<div class='ui-widget-header' style='z-index:100000;'>I'm a custom helper</div>" );
		// 	}
		// });
		// console.log("this.jEl.scrollTop()", this.jEl.scrollTop());

		if (this.dynamic) {
			var totalHeight = this.lineHeight * this.store.countTotal();
			this.jEl.find(".M_SimpleListContentFake1").height(this.store.skip * this.lineHeight);
			this.jEl.find(".M_SimpleListContent").height(totalHeight);
			this.jEl.scrollTop(this._lastscrolltop);
			// this._lastscrolltop = 0;
			window.setTimeout(() => {
				this.jEl.scrollTop(this._lastscrolltop);
				this._scrollisloading = false;
				this._triggerFromTo();
			}, 1);
		}
		// this.jEl.find('.M_SimpleListContentFake2').height(totalHeight - ((this._skipPosition+100)*this.lineHeight)) ;

		this.jEl.find("." + this.classItems).on("mousedown", evt => {
			// log("this.currentSelection",this.currentSelection)
			var item = $(evt.target).closest("." + this.classItems);
			var m_id = item.attr("data-m_id");
			var model = this.store.getRow(m_id);

			if (this.trigger("beforeClickItem", this, m_id, model, evt) === false) return;

			var ok = true,
				dontremoveselection = false;
			if (this.multipleSelection) {
				if ((M_.Utils.isMacos && evt.metaKey) || evt.ctrlKey) {
					// evt.preventDefault() ;
					// evt.stopPropagation() ;
					if (item.hasClass("selected")) ok = false;
				} else if (evt.shiftKey) {
					dontremoveselection = true;
					var lastIndex = this.store.getIndexById(this._lastSelection);
					var currentIndex = this.store.getIndexById(m_id);
					var min = Math.min(lastIndex, currentIndex);
					var max = Math.max(lastIndex, currentIndex);
					// var r =
					this.store.each((row, i) => {
						if (i >= min && i <= max) {
							var m_idTemp = row.getId();
							this.jEl.find("." + this.classItems + '[data-m_id="' + m_idTemp + '"]').addClass("selected");
							if (this.currentSelection.indexOf(m_idTemp) == -1) this.currentSelection.push(m_idTemp);
						}
					});
				} else {
					if (!item.hasClass("selected")) {
						this.jEl.find("." + this.classItems).removeClass("selected");
						this.currentSelection = [];
					} else {
						dontremoveselection = true;
						ok = false;
					}
				}
			} else {
				this.jEl.find("." + this.classItems).removeClass("selected");
				this.currentSelection = [];
			}
			if (ok) {
				item.addClass("selected");
				this.trigger("clickItem", this, m_id, model, evt);
				this._lastSelection = m_id;
				if (this.currentSelection.indexOf(m_id) == -1) this.currentSelection.push(m_id);
			} else {
				if (!dontremoveselection) {
					item.removeClass("selected");
					this.currentSelection.m_remove(m_id);
				}
			}
			// log("this.currentSelection",this.currentSelection)

			if (this.itemsDraggableTo) {
				// this.jEl.on('mousedown', (evt)=> {
				// 	// evt.preventDefault() ;
				// 	// evt.stopPropagation() ;
				$(document).on("mousemove", $.proxy(this.moveViewable, this));
				// }) ;
				$(document).on("mouseup", evt => {
					// log("this.viewable",this.viewable)
					if (this.viewable) this.viewable.remove();
					$(document).off("mousemove", $.proxy(this.moveViewable, this));
					$(document).off("mouseenter", this.itemsDraggableTo, $.proxy(this.enterViewable, this));
					$(document).off("mouseleave", this.itemsDraggableTo, $.proxy(this.leaveViewable, this));
					var elTemp = $(this.itemsDraggableTo + ".over");
					if (elTemp.length) {
						this.trigger("droped", elTemp, elTemp.attr("data-m_id"), this.getSelection());
						$(this.itemsDraggableTo).removeClass("over");
					}
					this._dragStarted = false;
				});
				$(document).on("mouseenter", this.itemsDraggableTo, $.proxy(this.enterViewable, this));
				$(document).on("mouseleave", this.itemsDraggableTo, $.proxy(this.leaveViewable, this));
				//  (evt)=> {
				// 	log("evt.target", $(evt.target))
				// }) ;
			}
		});

		// $( "#contacts_list_contacts .M_SimpleListContentReal" ).selectable();
		// this.jEl.find('.M_SimpleListContentReal').selectable();
		// this.jEl.find('.M_SimpleListContentReal').draggable();
		this.setSelection(this.currentSelection);
		this.trigger("render", this);
		window.setTimeout(() => {
			this.isrendering = false;
		}, 200);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	leaveViewable(evt) {
		$(evt.target).removeClass("over");
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	enterViewable(evt) {
		// log("evt.target", $(evt.target))
		// $(this.itemsDraggableTo).removeClass('over') ;
		$(evt.target).addClass("over");
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	moveViewable(evt) {
		evt.preventDefault();
		// log("this._dragStarted",this._dragStarted)
		if (!this._dragStarted) {
			var sel = this.getSelection();
			this.viewable = $(
				"<div style='width:20px; height:20px; position:relative; z-index:100000;'><div class='M_Badge' style='right:-30px;'>" +
					sel.length +
					"</div><span class='fa fa-group' style='font-size:30px;'></span></div>"
			);
			$("body").append(this.viewable);
		}
		this.viewable.offset({ top: evt.pageY, left: evt.pageX + 30 });
		this._dragStarted = true;
	}
	/**
	 * @param {type}
	 */
	setSelection(m_id) {
		// log("setSelection",m_id)
		// if (!m_id) return ;
		if (!$.isArray(m_id)) m_id = [m_id];
		if (!this.multipleSelection) this.jEl.find("." + this.classItems).removeClass("selected");
		var goodItem = [];
		for (var i = 0; i < m_id.length; i++) {
			// log("m_id[i]",m_id[i])
			goodItem = this.jEl.find("." + this.classItems + '[data-m_id="' + m_id[i] + '"]');
			goodItem.addClass("selected");
		}
		// this.currentSelection = m_id ;
		if (this.selectionVisible && goodItem.length) {
			var posYRow = goodItem.position().top;
			var posYParent = goodItem.parent().position().top;
			// log(posYRow, posYParent)
			var goodContainer = goodItem.closest(".M_SimpleList");
			// log('goodContainer.scrollTop()',goodContainer.scrollTop())
			if (
				1 * (posYRow - posYParent) < goodContainer.scrollTop() ||
				1 * (posYRow - posYParent) > goodContainer.scrollTop() + goodContainer.height() - goodItem.height() - 30
			) {
				goodItem.closest(".M_SimpleList").animate(
					{
						scrollTop: 1 * (posYRow - posYParent) - goodContainer.height() / 3
					},
					"slow"
				);
			}
		}
	}
	/**
	 * @return {type}
	 */
	getSelection() {
		var tabSelection = [];
		// log("this.currentSelection",this.currentSelection)
		for (var i = 0; i < this.currentSelection.length; i++) {
			var model = this.store.getRow(this.currentSelection[i]);
			tabSelection.push(model);
		}
		return tabSelection;
	}
};

/**
 * A multi columns list, a table
 * @class
 * @memberof! <global>
 * @extends M_.SimpleList
 * @property {type} colsDef
 * @property {type} classHeader
 * @property {type} classItems
 * @property {type} styleTable
 * @property {type} fullHeight
 * @property {type} oddEven
 * @property {type} limitRows
 * @property {type} moreText
 * @property {type} lessText
 * @property {type} withMouseOverRaw
 */
M_.TableList = class extends M_.SimpleList {
	constructor(opts) {
		var defaults = {
			colsDef: null,
			classHeader: "M_TableListHeader",
			classItems: "M_TableListItem",
			styleTable: "",
			fullHeight: true,
			limitRows: 0,
			moreText: "%n lignes de plus",
			lessText: "Masquer les lignes supplémentaires",
			withMouseOverRaw: true,
			headerHeight: 30,
			_colsToHide: [],
			draggableRows: false
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
	}
	/**
	 * @return {type}
	 */
	create() {
		var html = "",
			cls = "";
		if (this.groupStartClosed) {
			for (let ig = 0; ig < 100; ig++) this._groupsclosed.push(ig);
		}
		if (this.fullHeight) cls += "M_FullHeight";
		if (this.withMouseOverRaw) cls += " M_TableListOverRaw";
		this._idMore = M_.Utils.id();

		html += `<div class='M_TableList ${cls}' style='${this.styleTable}'>
 					<div class='M_TableListOverflow' style="overflow:auto; height:100%;">
 						<div class='M_SimpleListContent'>
 							<div class='M_TableListFake1'></div>
 							<table cellpadding="0" cellspacing="0">
 								<thead></thead>
 								<tbody></tbody>
 							</table>
 						</div>
 					</div>
 					<div class="M_AlignRight"><a id="${this._idMore}" href='javascript:void(0);'>${this.getMoreText()}</a></div>
 				</div>`;
		this.jEl = $(html);
		this.container.append(this.jEl);
		this.jEl.css("padding-top", this.headerHeight);

		this._limitRows = true;
		if (this.limitRows) {
			$("#" + this._idMore)
				.parent()
				.show();
			this._limitRows = true;
		} else {
			$("#" + this._idMore)
				.parent()
				.hide();
			this._limitRows = false;
		}
		$("#" + this._idMore).click(() => {
			// console.log("click");
			this._limitRows = !this._limitRows;
			this.render();
		});

		if (this.dynamic) {
			this.jEl.find(".M_TableListOverflow").scroll(evt => {
				if (this._scrollisloading) return;
				M_.Utils.delay(
					() => {
						var diff = this.jEl.find(".M_TableListOverflow").scrollTop();
						var _skipPosition = Math.ceil(diff / this.lineHeight) - Math.ceil(this.loadLimit / 4);
						if (_skipPosition < 0) _skipPosition = 0;
						this._lastscrolltop = diff;

						this._triggerFromTo();
						if (this.store.skip == _skipPosition) return;

						let h1 = this.jEl.find(".M_TableListFake1").height() + this.jEl.find("table").height();
						let h2 = diff + this.jEl.find(".M_TableListOverflow").height();
						// console.log("h1,h2", h1, h2, diff);
						if (h1 < h2 || this.jEl.find(".M_TableListFake1").height() > diff) {
							this._lastscrolltop = diff;
							this._scrollisloading = true;
							this.store.reload(false, { skip: _skipPosition, limit: this.loadLimit });
						}
					},
					100,
					"m_tablelist_scroll"
				);
			});
		}
	}
	_triggerFromTo() {
		let from = Math.ceil(this.jEl.find(".M_TableListOverflow").scrollTop() / this.lineHeight) + 1;
		let to = Math.ceil(this.jEl.find(".M_TableListOverflow").height() / this.lineHeight) + from;
		if (to > this.store.countTotal()) to = this.store.countTotal();
		this.trigger("showfromto", this, from, to);
	}
	_setMoreLessText() {
		if (this.limitRows) {
			if (this._limitRows) {
				$("#" + this._idMore).html(this.getMoreText());
			} else {
				$("#" + this._idMore).html(this.getLessText());
			}
			if (this._getNbRowsLimited() > 0) $("#" + this._idMore).show();
			else $("#" + this._idMore).hide();
		}
	}
	_getNbRowsLimited() {
		return this.store.count() - this.limitRows;
	}
	/**
	 * @return {type}
	 */
	getMoreText() {
		var val = this.moreText;
		val = val.replace(/%n/, this._getNbRowsLimited());
		return val;
	}
	/**
	 * @return {type}
	 */
	getLessText() {
		var val = this.lessText;
		val = val.replace(/%n/, this._getNbRowsLimited());
		return val;
	}
	/**
	 * @return {type}
	 */
	render() {
		var html = "",
			mid = this.store.primaryKey,
			colsDef = this.colsDef;
		html += "<tr>";
		for (var i = 0; i < colsDef.length; i++) {
			let cls = this.classHeader + " M_Noselectable";
			let style = "";
			if (colsDef[i].align && colsDef[i].align == "right") cls += " M_AlignRight";
			if (colsDef[i].align && colsDef[i].align == "center") cls += " M_AlignCenter";
			if (colsDef[i].align && colsDef[i].align == "left") cls += " M_AlignLeft";
			if (!colsDef[i].align) cls += " M_AlignLeft";
			if (colsDef[i].width) {
				var w = "";
				if ($.type(colsDef[i].width) === "string") w = colsDef[i].width;
				else w = colsDef[i].width + "px";
				style += "width:" + w + "; ";
			}
			html += "<th data-m-col='" + i + "' class='" + cls + "' style='" + style + "'>" + colsDef[i].label;
			if (this.fullHeight) html += "<div style='" + style + "'>" + colsDef[i].label + "</div>";
			html += "</th>";
		}
		html += "</tr>";
		this.jEl
			.find("thead")
			.empty()
			.html(html);

		if (this.dynamic) {
			var totalHeight = this.lineHeight * this.store.countTotal();
			this.jEl.find(".M_TableListFake1").height(this.store.skip * this.lineHeight);
			this.jEl.find(".M_SimpleListContent").height(totalHeight);
			this.jEl.find(".M_TableListOverflow").scrollTop(this._lastscrolltop);
			window.setTimeout(() => {
				this.jEl.find(".M_TableListOverflow").scrollTop(this._lastscrolltop);
				this._scrollisloading = false;
				this._triggerFromTo();
			}, 1);
		}

		html = "";
		let previousgroup = "----",
			previousgroupnum = 0;
		// console.log('this._groupsclosed',this._groupsclosed);
		this.store.each((model, indexTemp) => {
			// log("model",model)
			if (this.limitRows && indexTemp >= this.limitRows && this._limitRows) return true;
			var clsTr = "";
			var styleTr = "";
			if (this.oddEven) {
				if (indexTemp % 2 === 0) clsTr += " M_TableListOdd";
				else clsTr += " M_TableListEven";
			}
			var draggable = "";
			if (this.draggableRows) draggable = "draggable='true'";
			if (this.store.group) {
				let g1 = this.store.group(model, this.store);
				let g2 = this.groupLabel(model, this.store);
				if (previousgroup != g1) {
					previousgroupnum++;
					let closeopenfa = "";
					if (this.groupClose) {
						let chevtemp = "down";
						if (_.indexOf(this._groupsclosed, previousgroupnum) >= 0) chevtemp = "left";
						closeopenfa = '<div style="float:right;"><span class="fa fa-chevron-' + chevtemp + ' M_TableGroupChevron"></span></div>';
					}
					html += "<tr class='M_TableGroup' data-groupnum='" + previousgroupnum + "'>";
					html += "<td colspan=" + colsDef.length + ">" + closeopenfa + g2 + "</td>";
					html += "</tr>";
				}
				previousgroup = g1;
				clsTr += " M_TableGroupItem_" + previousgroupnum;
				if (_.indexOf(this._groupsclosed, previousgroupnum) >= 0) styleTr += "display:none;";
			}
			html += "<tr class='" + clsTr + "' style='" + styleTr + "' " + draggable + ">";
			for (var i = 0; i < colsDef.length; i++) {
				let val = "",
					cls = this.classItems + " M_Noselectable",
					mystyle = { cls: "", style: "" };
				if ($.isFunction(colsDef[i].val)) {
					// console.log("model", model);
					val = colsDef[i].val(model, mystyle);
				} else {
					if (model instanceof M_.Model) val = model.get(colsDef[i].val);
					else val = model[colsDef[i].val];
				}
				if (colsDef[i].align && colsDef[i].align == "right") cls += " M_AlignRight";
				if (colsDef[i].align && colsDef[i].align == "center") cls += " M_AlignCenter";
				if (colsDef[i].align && colsDef[i].align == "left") cls += " M_AlignLeft";
				cls += " " + mystyle.cls;
				let datamid = "";
				if (model instanceof M_.Model) datamid = model.get(mid);
				else datamid = model[mid];
				html += "<td class='" + cls + "' style='" + mystyle.style + "' data-m_id='" + datamid + "'>" + val + "</td>";
			}
			html += "</tr>";
		});
		this.jEl
			.find("tbody")
			.empty()
			.html(html);

		this.jEl.find("." + this.classHeader).on("click", evt => {
			// console.log("evt", evt);
			var item = $(evt.target).closest("." + this.classHeader);
			var numcol = item.attr("data-m-col");
			var colDef = this.colsDef[numcol];
			if (colDef) {
				let direction = -1;
				if (colDef._sortDirection) direction = colDef._sortDirection;
				direction = direction * -1;
				colDef._sortDirection = direction;
				// console.log("colDef._sortDirection", colDef._sortDirection);

				if (colDef.sort) this.store.sort(colDef.sort, direction);
				else this.store.sort(colDef.val, direction);
			}
		});

		this.jEl.find(".M_TableGroup").on("click", evt => {
			if (this.groupClose) {
				let trtemp = $(evt.target).closest("tr");
				let groupnum = trtemp.attr("data-groupnum") * 1;
				let jelsg = this.jEl.find(".M_TableGroupItem_" + groupnum);
				if (jelsg.is(":visible")) {
					jelsg.hide();
					if (_.indexOf(this._groupsclosed, groupnum) < 0) this._groupsclosed.push(groupnum);
					if (this.groupClose) {
						trtemp
							.find(".M_TableGroupChevron")
							.removeClass("fa-chevron-down")
							.addClass("fa-chevron-left");
					}
				} else {
					jelsg.show();
					_.pull(this._groupsclosed, groupnum);
					if (this.groupClose) {
						trtemp
							.find(".M_TableGroupChevron")
							.removeClass("fa-chevron-left")
							.addClass("fa-chevron-down");
					}
				}
				// console.log('this._groupsclosed',this._groupsclosed);
			}
		});

		this.jEl.find("." + this.classItems).on("click", evt => {
			// log("dddddddddddddd")
			var item = $(evt.target).closest("." + this.classItems);
			var m_id = item.attr("data-m_id");
			var model = this.store.getRow(m_id);

			// get num col
			var col = item.index();
			var row = item.parent().index();

			if (this.trigger("beforeClickItem", this, m_id, model, evt, col, row) === false) return;
			// item.addClass('selected') ;
			this.trigger("clickItem", this, m_id, model, evt, col, row);
		});
		// this.jEl.find("tbody tr").on('mouseover', (evt)=> {
		// }) ;
		// this.jEl.find("tbody tr").on('mouseout', (evt)=> {
		// }) ;

		this._setMoreLessText();

		this.hideColumns(this._colsToHide);

		this.trigger("render", this, this.jEl);
	}
	showAllColumns() {
		this._colsToHide = [];
		$("#" + this.id)
			.find("tr td")
			.show();
		$("#" + this.id)
			.find("tr th")
			.show();
	}
	showColumns(cols) {
		if (!$.isArray(cols)) cols = [cols];
		this._colsToHide = _.difference(this._colsToHide, cols);
		$("#" + this.id)
			.find("tr td")
			.show();
		$("#" + this.id)
			.find("tr th")
			.show();
		this.hideColumns(this._colsToHide);
	}
	hideColumns(cols) {
		if (!$.isArray(cols)) cols = [cols];
		this._colsToHide = this._colsToHide.concat(cols);
		this._colsToHide = _.uniq(this._colsToHide);
		// console.log("this._colsToHide", this._colsToHide);
		_.each(this._colsToHide, col => {
			$("#" + this.id)
				.find("tr td:nth-child(" + col + ")")
				.hide();
			$("#" + this.id)
				.find("tr th:nth-child(" + col + ")")
				.hide();
		});
	}
};

/**
 * Implements this to get CRUD (get/post/put/delete) ajax requests
 * @interface
 * @memberof! <global>
 */
M_.CRUD = {
	/**
	 * @return {type}
	 */
	initCRUD() {
		// var defaults = {
		// 	url: "",
		// 	args: {},
		// 	model: null,
		// 	useWebsocket: M_.App.useWebsocket
		// };
		// $.extend(this, defaults) ;
	},
	// onLoad: function(model) {},
	// onSave: function(data) {},
	// onDelete: function(data) {},
	/**
	 * @param  {type}
	 * @param  {Object}
	 * @param  {Function}
	 * @return {type}
	 */
	load(id, args = {}, callback = null) {
		this._callbackFormLoaded = callback;
		//this.callbackLoadRow = callback ;
		var okArgs = {};
		//var okArgs = {action: 'get'} ;
		//okArgs[this.primaryKey] = id ;
		$.extend(okArgs, this.args, args);
		if (this.onBeforeLoad) this.onBeforeLoad();
		var obj = { url: this.url, args: okArgs };
		if (this.trigger("beforeLoad", this, obj) === false) return false;
		//this.lastLoadArgs = okArgs ;
		var url = obj.url;
		var method = "GET";
		if (this.urls) {
			let aaurl = this._analyseUrl(this.urls.findone);
			method = aaurl.method;
			url = aaurl.url;
		}
		// console.log("method, url",method, url);
		if (id) url += "/" + id;
		// alert("this.useWebsocket",this.useWebsocket)
		if (this.useWebsocket) {
			io.socket.get(url, okArgs, (data, jwres) => {
				this._treatDataCrud(data, callback);
			});
		} else {
			if (this.ajaxLoad) this.ajaxLoad.abort();
			this.ajaxLoad = M_.Utils.ajaxJson(url, okArgs, method, data => {
				this._treatDataCrud(data, callback);
			});
		}
	},
	_treatDataCrud(data, callback) {
		// log("_treatDataCrud",data)
		var row = null;
		if (data && data[this.rootData]) row = data[this.rootData];
		else row = data;
		this.trigger("loadraw", this, row);
		if (this.processData) this.processData(row);
		var m;
		if (this.model) {
			m = new this.model({ row: row });
		} else {
			m = row;
		}
		this.dataLoaded = m;
		if (this.onLoad) this.onLoad(m);
		this.trigger("load", this, m);
		if (callback) callback(m);
	},
	_analyseUrl(theurl) {
		if (theurl.indexOf(" ") >= 0) {
			var [method, url] = theurl.split(" ");
			return { method: method, url: url };
		} else return { method: "POST", url: theurl };
	},
	/**
	 * @param  {type}
	 * @param  {Object}
	 * @param  {Function}
	 * @return {type}
	 */
	save(modelOrData = null, args = {}, callback = null) {
		this._callbackFormSaved = callback;
		// if (this.validAndAlert()) {
		// log("modelOrData",modelOrData)
		this._isForm = false;
		if (!modelOrData) {
			modelOrData = this.getValues(true);
			this._isForm = true;
		}
		// log("modelOrData", modelOrData)
		var data = modelOrData;
		var key;
		if (data instanceof M_.Model) {
			data = data.getArray();
		}
		// log("data",data)
		// log("data", data)
		for (key in data) {
			// if (data[key] && data[key].toDate && data[key].toDate() instanceof Date) {
			if (moment.isMoment(data[key])) {
				data[key] = data[key].toISOString();
			}
		}
		// log("data", data)

		var okArgs = { action: "save" };
		$.extend(okArgs, this.args, args, data);

		// log("okArgs",okArgs);

		/*var fields=this.fields ;
			for(var j=0 ; j<fields.length ; j++) {
				if (fields[j].type=='date') {
					this.row[fields[j].name] = M_.Utils.formatDate(this.row[fields[j].name], 'Y-m-d H:i:s') ;
				}
			}
			$.extend(okArgs, this.row) ;
			$.extend(okArgs, this.args, args) ;
			if (this.trigger("beforeLoad", this, {url: this.url, args:okArgs})===false) return false ;
			this.lastLoadArgs = okArgs ;
			*/
		var url = this.url;
		var method = "POST";
		if (this.urls) {
			let aaurl = this._analyseUrl(this.urls.create);
			method = aaurl.method;
			url = aaurl.url;
		}
		var moreUrl = "";
		if (this.model) {
			var modelTemp = new this.model({ row: {} });
			if (!_.isEmpty(okArgs[modelTemp.primaryKey])) {
				method = "PUT";
				moreUrl = "/" + okArgs[modelTemp.primaryKey];
				if (this.urls) {
					let aaurl = this._analyseUrl(this.urls.update);
					method = aaurl.method;
					url = aaurl.url;
				}
			}
			// log("this.model.primaryKey",modelTemp.primaryKey,okArgs)
		}
		// console.log("url,method",url,method,this.model,okArgs);

		var obj = { url: url + moreUrl, method: method, args: okArgs };
		if (this.trigger("beforeSave", this, obj) === false) return false;

		// return ;
		// var formData = new FormData() ;
		// for(key in okArgs) {
		// 	formData.append(key, okArgs[key]) ;
		// }

		M_.Utils.ajaxJson(obj.url, obj.args, obj.method, data => {
			// log("dataaaaa",data)
			if (data.error) {
				let errTxt = "";
				if (data.error == "E_VALIDATION") {
					_.each(data.invalidAttributes, (attr, key) => {
						errTxt += key + " : ";
						_.each(attr, msg => {
							errTxt += msg.message;
						});
						errTxt += "\n";
					});
				}
				if (this.informValidReturnSails) this.informValidReturnSails(data);
				this.trigger("error", this, data, errTxt);
			} else {
				this.trigger("save", this, data);
				if (this._callbackFormSaved) this._callbackFormSaved(data);
			}
		});

		// $.ajax({
		// 	url: this.url+moreUrl,
		// 	type: method,
		// 	//headers: {Connection: close},
		// 	data: JSON.stringify(okArgs),
		// 	contentType: 'application/json',
		// 	processData: false,
		// 	dataType: 'json',
		// 	cache: false,
		// 	success: (data)=> {
		// 		//&this.trigger("saved", data);
		// 		this.trigger("save", this, data);
		// 		if (this._callbackFormSaved) this._callbackFormSaved(data) ;
		// 	}
		// });
		// }
	},
	/**
	 * @param  {type}
	 * @param  {Object}
	 * @param  {Function}
	 * @return {type}
	 */
	delete(id, args = {}, callback = null) {
		this._callbackFormDelete = callback;
		var okArgs = {};
		$.extend(okArgs, this.args, args);

		var url = this.url;
		var method = "DELETE";
		if (this.urls) {
			let aaurl = this._analyseUrl(this.urls.destroy);
			method = aaurl.method;
			url = aaurl.url;
		}

		if (this.trigger("beforeDelete", this, { url: url, args: okArgs }) === false) return false;
		M_.Utils.ajaxJson(url + "/" + id, okArgs, method, data => {
			this.trigger("delete", this, data);
			if (this._callbackFormDelete) this._callbackFormDelete(data);
		});
		// $.ajax({
		// 	url: this.url+"/"+id,
		// 	type: 'DELETE',
		// 	//contentType: 'application/json',
		// 	data: okArgs,
		// 	dataType: 'json',
		// 	success: (data)=> {
		// 		this.trigger("delete", this, data);
		// 		if (this._callbackFormDelete) this._callbackFormDelete(data) ;
		// 	}
		// });
	}
};

/**
 * To do
 * @class
 * @memberof! <global>
 * @extends M_.SimpleList
 * @implements M_.Observable
 * @property {type} jEl
 * @property {type} alignTo
 * @property {type} position
 * @property {type} height
 * @property {type} width
 * @property {type} speed
 * @property {type} visible
 * @property {type} floating
 */
M_.Drawer = class {
	constructor(opts) {
		var defaults = {
			jEl: null,
			alignTo: null,
			position: "bottom",
			height: 45,
			width: 45,
			speed: 300,
			visible: false,
			floating: true
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		$(window).resize(() => {
			if (this.tsResize) window.clearTimeout(this.tsResize);
			this.tsResize = window.setTimeout(() => {
				if (this.floating) this.showOrHide(this.visible, false);
			}, 100);
		});
	}
	/**
	 * @return {Boolean}
	 */
	isVisible() {
		return this.visible;
	}
	/**
	 * @return {type}
	 */
	show() {
		if (this.visible) return;
		if (this.trigger("beforeShow", this) === false) return;
		this.showOrHide(true);
		this.trigger("show", this);
	}
	/**
	 * @return {type}
	 */
	hide() {
		if (!this.visible) return;
		if (this.trigger("beforeHide", this) === false) return;
		this.showOrHide(false);
		this.trigger("hide", this);
	}
	/**
	 * @param  {type}
	 * @param  {Boolean}
	 * @return {type}
	 */
	showOrHide(ok, anim = true) {
		var top, left, topStart, leftStart;
		this.jEl.outerWidth(this.width);
		this.jEl.outerHeight(this.height);

		if (!this.floating && !ok) {
			this.alignTo.height("100%");
		}
		this.jEl.css("position", "absolute");

		if (this.position == "bottom") {
			this.jEl.outerWidth(this.alignTo.outerWidth());
			top = this.alignTo.offset().top + this.alignTo.outerHeight() - this.jEl.outerHeight();
			left = this.alignTo.offset().left;
			topStart = top + this.jEl.outerHeight();
			leftStart = left;
		}
		if (this.position == "top") {
			this.jEl.outerWidth(this.alignTo.outerWidth());
			top = this.alignTo.offset().top;
			left = this.alignTo.offset().left;
			topStart = top - this.jEl.outerHeight();
			leftStart = left;
		}
		if (this.position == "left") {
			this.jEl.outerHeight(this.alignTo.outerHeight());
			top = this.alignTo.offset().top;
			left = this.alignTo.offset().left;
			topStart = top;
			leftStart = left - this.jEl.outerWidth();
		}
		if (this.position == "right") {
			this.jEl.outerHeight(this.alignTo.outerHeight());
			top = this.alignTo.offset().top;
			left = this.alignTo.offset().left + this.alignTo.outerWidth() - this.jEl.outerWidth();
			topStart = top;
			leftStart = left - this.jEl.outerWidth();
		}
		if (anim) {
			if (ok) {
				this.jEl
					.show()
					.offset({ top: topStart, left: leftStart })
					.transition({ top, left }, M_.Utils.getSpeedAnim(), () => {
						// log("finis")
					});
			} else {
				this.jEl.offset({ top, left }).transition({ top: topStart, left: leftStart }, M_.Utils.getSpeedAnim());
			}
			// if (ok) {
			// 	this.jEl.addClass('M_TransitionNone')
			// 			.show()
			// 			.offset({top:topStart, left:leftStart}) ;
			// 	this.jEl[0].offsetHeight;
			// 	this.jEl.removeClass('M_TransitionNone')
			// 			.offset({top, left}) ;
			// 	this.jEl.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',()=> {
			// 		this.jEl.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd') ;
			// 	}) ;
			// } else {
			// 	this.jEl.addClass('M_TransitionNone')
			// 			.offset({top, left}) ;
			// 	this.jEl[0].offsetHeight;
			// 	this.jEl.removeClass('M_TransitionNone')
			// 			.offset({top:topStart, left:leftStart}) ;
			// 	this.jEl.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',()=> {
			// 		this.jEl.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd') ;
			// 		this.jEl.hide() ;
			// 	}) ;
			// }
			// if (ok) {
			// 	this.jEl.offset({top:topStart, left:leftStart}).animate({
			// 		top, left
			// 	}, this.speed, ()=> {
			// 		if (!this.floating) this.jEl.css('position', 'static') ;
			// 	}) ;
			// } else {
			// 	this.jEl.offset({top, left}).animate({
			// 		top:topStart, left:leftStart
			// 	}, this.speed, ()=> {
			// 	}) ;
			// }
		} else {
			if (ok) this.jEl.offset({ top, left });
			else this.jEl.offset({ top: topStart, left: leftStart });
		}

		if (!this.floating && ok) {
			this.alignTo.height("calc(100% - " + this.height + "px)");
		}

		this.visible = ok;
	}
};

/**
 * Display a background on html document
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @property {type} visible
 * @property {type} focusOn
 * @property {type} clickHide
 * @property {type} alpha
 * @property {type} zindex
 */
M_.Modal = class {
	constructor(opts) {
		var defaults = {
			visible: false,
			focusOn: false,
			clickHide: false,
			alpha: 0.5,
			zindex: 500,
			isLoading: null,
			text: ""
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		$(window).resize(() => {
			if (this.tsResize) window.clearTimeout(this.tsResize);
			this.tsResize = window.setTimeout(() => {
				this.showOrHide(this.visible, false);
			}, 100);
		});

		if (this.focusOn) {
			this.jEl1 = $("<div class='M_Modal'></div>");
			$("body").append(this.jEl1);
			this.jEl2 = $("<div class='M_Modal'></div>");
			$("body").append(this.jEl2);
			this.jEl3 = $("<div class='M_Modal'></div>");
			$("body").append(this.jEl3);
			this.jEl4 = $("<div class='M_Modal'></div>");
			$("body").append(this.jEl4);
			if (this.clickHide) {
				this.jEl1.click(() => {
					this.hide();
				});
				this.jEl2.click(() => {
					this.hide();
				});
				this.jEl3.click(() => {
					this.hide();
				});
				this.jEl4.click(() => {
					this.hide();
				});
			}
		} else {
			this.jEl = $("<div class='M_Modal'><p>" + this.text + "</p></div>");
			$("body").append(this.jEl);
			if (this.clickHide) {
				this.jEl.click(() => {
					this.hide();
				});
			}
			if (this.isLoading) {
				this.jEl.html(
					"<div style='width:300px;margin:200px auto 0 auto; text-align:center;'><i style='font-size:100px;' class='fa fa-clock-o faa-spin animated'></i><br><h1 style='color:white;'>" +
						this.isLoading +
						"</h1></div>"
				);
			}
		}
	}
	/**
	 * @return {Boolean}
	 */
	isVisible() {
		return this.visible;
	}
	/**
	 * @return {type}
	 */
	show() {
		if (this.trigger("beforeShow", this) === false) return false;
		this.showOrHide(true);
		this.trigger("show", this);
	}
	/**
	 * @return {type}
	 */
	hide() {
		if (this.trigger("beforeHide", this) === false) return false;
		this.showOrHide(false);
		this.trigger("hide", this);
	}
	/**
	 * @param  {type}
	 * @param  {Boolean}
	 * @return {type}
	 */
	showOrHide(ok, anim = false) {
		var speed = M_.Utils.getSpeedAnim();
		if (this.focusOn) {
			if (ok) {
				let posTop1 = this.focusOn.offset().top;
				let posTop2 = this.focusOn.offset().top + this.focusOn.outerHeight();
				let posTop3 = $(window).height();
				let posLeft1 = this.focusOn.offset().left;
				let posLeft2 = this.focusOn.offset().left + this.focusOn.outerWidth();
				let posLeft3 = $(window).width();
				this.jEl1
					.css({
						"z-index": this.zindex,
						top: 0,
						left: 0,
						width: "100%",
						height: posTop1
					})
					.transition({ opacity: this.alpha }, speed);
				this.jEl2
					.css({
						"z-index": this.zindex,
						top: posTop1,
						left: 0,
						width: posLeft1,
						height: posTop2 - posTop1
					})
					.transition({ opacity: this.alpha }, speed);
				this.jEl3
					.css({
						"z-index": this.zindex,
						top: posTop1,
						left: posLeft2,
						width: posLeft3 - posLeft2,
						height: posTop2 - posTop1
					})
					.transition({ opacity: this.alpha }, speed);
				this.jEl4
					.css({
						"z-index": this.zindex,
						top: posTop2,
						left: 0,
						width: "100%",
						height: posTop3 - posTop2
					})
					.transition({ opacity: this.alpha }, speed);
			} else {
				this.jEl1.css({ "z-index": this.zindex }).transition({ opacity: 0 }, speed, () => {
					this.jEl1.remove();
					this.jEl2.remove();
					this.jEl3.remove();
					this.jEl4.remove();
				});
				this.jEl2.css({ "z-index": this.zindex }).transition({ opacity: 0 }, speed);
				this.jEl3.css({ "z-index": this.zindex }).transition({ opacity: 0 }, speed);
				this.jEl4.css({ "z-index": this.zindex }).transition({ opacity: 0 }, speed);
			}
		} else {
			if (ok)
				this.jEl
					.css({ "z-index": this.zindex })
					.show()
					.transition({ opacity: this.alpha }, speed);
			else
				this.jEl.transition({ opacity: 0 }, speed, () => {
					this.jEl.remove();
				});
		}
		this.visible = ok;
	}
};

/**
 * Display a window from a template
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @property {type} visible
 * @property {type} clickHide
 * @property {type} alpha
 * @property {type} zindex
 * @property {type} width
 * @property {type} maxWidth
 * @property {type} height
 * @property {type} html
 * @property {type} tpl
 * @property {type} tplData
 * @property {type} tplPartials
 * @property {type} cls
 * @property {type} modal
 * @property {type} animFrom
 * @property {type} top
 * @property {type} left
 * @property {type} position
 */
M_.Window = class {
	constructor(opts) {
		var defaults = {
			visible: false,
			clickHide: false,
			alpha: 0.5,
			zindex: M_.Utils.getNextZIndex(),
			width: 400,
			maxWidth: 0,
			height: "auto",
			minHeight: false,
			html: null,
			tpl: null,
			tplData: {},
			tplPartials: {},
			cls: "",
			modal: true,
			animFrom: null,
			top: 100,
			left: 0,
			position: "center",
			offsetPositionRight: 20,
			offsetPositionLeft: 20,
			offsetPositionTop: 20,
			offsetPositionBottom: 20
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		$(window).resize(() => {
			if (this.tsResize) window.clearTimeout(this.tsResize);
			this.tsResize = window.setTimeout(() => {
				// this.showOrHide(this.visible, false) ;
				this.center();
			}, 100);
		});

		this.create();
	}
	/**
	 * @return {type}
	 */
	create() {
		this.jEl = $("<div class='M_Window'></div>").hide();
		$("body").append(this.jEl);

		// if (this.width=='auto') this.width = '100%' ;

		if (this.minHeight)
			this.jEl.css({
				"min-height": this.minHeight
			});

		this.jEl.css({
			"z-index": this.zindex,
			width: this.width,
			height: this.height
		});

		if (this.tpl) {
			this.jEl.html(M_.App.renderMustache(this.tpl, this.tplData, this.tplPartials));
		} else if (this.html) {
			this.jEl.html(this.html);
		}
	}

	/**
	 * Search a class or selector in the container, like $.find()
	 * @param  {string} selector
	 * @return {jQuery}
	 */
	findEl(selector) {
		return this.jEl.find(selector);
	}

	/**
	 * @return {Boolean}
	 */
	isVisible() {
		return this.visible;
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	show(anim = true) {
		if (this.trigger("beforeShow", this) === false) return false;
		this.showOrHide(true, anim);
		this.trigger("show", this);
		M_.Window._lastWindow = this;
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	hide(anim = true) {
		if (this.trigger("beforeHide", this) === false) return false;
		this.showOrHide(false, anim);
		this.trigger("hide", this);
		M_.Window._lastWindow = null;
	}
	maximize() {
		this.jEl.height($(window).height() - 150);
		var l = ($(window).width() - this.jEl.outerWidth()) / 2;
		var t = 50;
		this.jEl.css({
			left: l,
			top: t
		});
	}
	/**
	 * @return {type}
	 */
	center() {
		this.jEl.height("auto");
		var l = ($(window).width() - this.jEl.outerWidth()) / 2;
		var t = ($(window).height() - this.jEl.outerHeight()) / 2;
		// console.log("$(window).height()",$(window).height()-200,this.jEl.outerHeight());
		if (this.jEl.outerHeight() > $(window).height() - 150) {
			this.jEl.height($(window).height() - 150);
			// console.log("setheigt",$(window).height()-200);
			// t = ($(window).height()-this.jEl.height()-200)/2 ;
			t = 50;
		}
		this.jEl.css({
			left: l,
			top: t
		});
		return this;
	}
	/**
	 * @param  {type}
	 * @param  {Boolean}
	 * @return {type}
	 */
	showOrHide(ok, anim = true) {
		// log("showOrHide")
		var speed = M_.Utils.getSpeedAnim();
		if (ok) {
			this.zindex = M_.Utils.getNextZIndex();
			if (this.modal && !this.modalObj) {
				this.modalObj = new M_.Modal({
					clickHide: this.clickHide,
					alpha: this.alpha,
					zindex: this.zindex - 1,
					listeners: [
						[
							"beforeHide",
							() => {
								if (this.trigger("beforeHide", this) === false) return false;
							}
						]
					]
				});
				this.modalObj.show();
			}
			// this.jEl.height(this.height) ;
			var l1 = this.left,
				l2 = this.left,
				t1 = this.top,
				t2 = this.top,
				w1 = this.width,
				w2 = this.width,
				h1 = this.height,
				h2 = this.height,
				s1 = 0.5,
				s2 = 1,
				o1 = 0,
				o2 = 1;

			// if (animFrom) {
			// 	t1 = animFrom.offset().top - $(window).scrollTop() ;
			// 	l1 = animFrom.offset().left ;
			// 	// w1 = animFrom.width() ;
			// 	// h1 = animFrom.height() ;
			// 	log("t,l",t1,l1, animFrom)
			// }

			this.jEl
				.addClass(this.cls)
				.css({
					scale: 1,
					opacity: 0,
					"z-index": this.zindex,
					left: 0,
					top: 0,
					width: w1,
					height: h1
				})
				.show();
			// log("this.jEl.height()",this.jEl.height(), $(window).height())

			if (this.maxWidth !== 0) {
				// w1 = w2 = this.maxWidth ;
				this.jEl.css({
					"max-width": this.maxWidth
				});
			}
			if (this.jEl.outerHeight() + 100 > $(window).height()) {
				h1 = h2 = $(window).height() - 100;
			}
			if (this.position == "center" || this.position == "top") {
				l1 = l2 = ($(window).width() - this.jEl.outerWidth()) / 2;
				if (h2 == "auto") t1 = t2 = ($(window).height() - this.jEl.height()) / 2;
				else t1 = t2 = ($(window).height() - h2) / 2;
			}
			if (this.position == "top") {
				s1 = 1;
				o1 = 1;
				if (h2 == "auto") {
					t1 = -1 * this.jEl.height() - this.offsetPositionTop;
				} else {
					t1 = h2 - 30;
				}
				t2 = this.offsetPositionTop;
			}
			this.jEl
				.addClass(this.cls)
				.css({ scale: s1, opacity: o1, left: l1, top: t1, width: w1, height: h1 })
				.show()
				.transition({ scale: s2, opacity: o2, left: l2, top: t2, width: w2 + 1, height: h2 }, speed, () => {
					// this.jEl.outerWidth(this.width+1);
				});
		} else {
			this.jEl.transition({ scale: 0.5, opacity: 0 }, speed, () => {
				this.jEl.hide();
			});
			if (this.modalObj) {
				this.modalObj.hide();
				this.modalObj = null;
			}
		}
		this.visible = ok;
	}
	static _escapeButtonListener() {
		M_.Window._lastWindow = null;
		$(document).keydown(evt => {
			if (evt.keyCode == 27) {
				if (M_.Window._lastWindow) {
					M_.Window._lastWindow.hide();
				}
			}
		});
	}
};
M_.Window._escapeButtonListener();

/**
 * Display a button
 * @class
 * @memberof! <global>
 * @extends M_.Outlet
 * @property {type} text
 * @property {type} cls
 * @property {type} handler
 */
M_.Button = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			text: "Save",
			cls: "primary",
			handler: null
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
	}
	/**
	 * @return {type}
	 */
	create() {
		var html = `<button class="M_Button ${this.cls}" id="${this.id}">${this.text}</button>`;
		this.jEl = $(html);
		this.container.append(this.jEl);
		if (this.handler) this.jEl.click(this.handler);
	}
};

/**
 * Display a alert dialog window or a confirm dialog window
 * @memberof! <global>
 * @property {type} textButtonOk
 * @property {type} textButtonCancel
 */
M_.Dialog = new class {
	constructor(opts) {
		this.defaults = {
			textButtonOk: "OK",
			textButtonCancel: "Annuler"
		};
		opts = opts ? opts : {};
		$.extend(this, this.defaults, opts);
	}
	_createTemplate(title, text, icon = "fa-warning") {
		var html = `<div style="overflow:auto; height:90%;">
						<h1 style="line-height:22px;">${title}</h1>
						<div>
							<div class='M_FloatLeft' style='width:25%'><span class='fa ${icon} M_IconBig'></span></div>
							<div class='M_FloatLeft' style='width:75%'>${text}</div>
							<div class='M_Clear'></div>
						</div>
					</div>`;
		return html;
	}
	/**
	 * @param  {type}
	 * @param  {type}
	 * @param  {type}
	 * @return {type}
	 */
	alert(title, text, callbackOk, optswin={}) {
		// this.callbackOk = callbackOk ;
		var html = this._createTemplate(title, text);
		html += `<div class="M_margintop">
						<div class='M_FloatRight'>
							<button type="button" class='M_DialogOK M_Button primary'>${this.textButtonOk}</button>
						</div>
						<div class='M_Clear'></div>
					</div>`;
		optswin.html = html;
		var win = new M_.Window(optswin);
		win.show();
		win.jEl.find(".M_DialogOK").click(() => {
			if (callbackOk) callbackOk();
			win.hide();
		});
	}
	/**
	 * @param  {type}
	 * @param  {type}
	 * @param  {type}
	 * @param  {type}
	 * @return {type}
	 */
	confirm(title, text, callbackOk, callbackCancel, optswin = {}) {
		// this.callbackOk = callbackOk ;
		// this.callbackCancel = callbackCancel ;
		var html = this._createTemplate(title, text);
		html += `<div class="M_margintop">
						<div class='M_FloatRight'>
							<button type="button" class='M_DialogOK M_Button primary'>${this.textButtonOk}</button>
						</div>
						<div class='M_FloatRight'>
							<button type="button" class='M_DialogCancel M_ModalCancel M_Button'>${this.textButtonCancel}</button>
						</div>
						<div class='M_Clear'></div>
					</div>`;
		optswin.html = html;
		var winConfirm = new M_.Window(optswin);
		winConfirm.show();
		winConfirm.jEl.find(".M_DialogOK").click(() => {
			winConfirm.hide();
			if (callbackOk) callbackOk.apply(this);
		});
		winConfirm.jEl.find(".M_DialogCancel").click(() => {
			winConfirm.hide();
			if (callbackCancel) callbackCancel.apply(this);
		});
	}
	hide() {
		this.win.hide();
	}
	/**
	 * alert user
	 * @param  {String} text
	 * @param  {String} position
	 * @param  {Number} time      number of milliseconds
	 * @param  {Function} callbackClose
	 */
	notify(text, time = 2000, position = "top", callbackClose = null, optswin = {}) {
		var html = "";
		html += `<div class="">
							${text}
						</div>`;
		optswin.html = html;
		optswin.modal = false;
		optswin.position = "top";
		var win = new M_.Window(optswin);
		win.jEl.click(() => {
			win.hide();
		});
		window.setTimeout(() => {
			if (callbackClose) callbackClose();
			win.hide();
		}, time);
		win.show();
	}
}();

/**
 * Create a dropdown
 * @class
 * @memberof! <global>
 * @extends M_.Outlet
 * @property {type} destroyOnHide
 * @property {type} alignTo
 * @property {type} offsetTop
 * @property {type} offsetLeft
 * @property {type} container
 * @property {type} constraints
 * @property {type} autoSize
 * @property {type} autoShow
 * @property {type} items
 * @property {type} html
 * @property {type} alwaysDropdownBelow
 */
M_.Dropdown = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			destroyOnHide: true,
			_visible: false,
			alignTo: null,
			offsetTop: 0,
			offsetLeft: 0,
			container: "body",
			alwaysDropdownBelow: false,
			constraints: $(window),
			autoSize: true,
			autoShow: false,
			items: [],
			html: null,
			itemsClass: "",
			drawEachItem: null,
			// id: null,
			_items: [],
			width: 0
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);

		// this.create() ;
	}
	drawItem(item, i, ul, items) {
		if (this.drawEachItem) return this.drawEachItem.call(this, item, i, ul, items);
		if (!item.text || item.text == "_m_separation") {
			ul.append($(`<li class="M_DropdownSeparation"></li>`));
			return;
		}
		var more = "";
		if (item.disabled) more += " disabled";
		if (this.itemsClass) more += " " + this.itemsClass;
		if (item.cls) more += " " + item.cls;
		var htmlItem = `<li class="M_DropdownMenu ${more}">${item.text}</li>`;
		var jElItem = $(htmlItem);
		// jElItem.data('indexitem', i) ;
		ul.append(jElItem);
		if (item.click && !item.disabled) {
			jElItem.click({ fn: item }, evt => {
				// var el = $(evt.target).closest('.M_DropdownMenu') ;
				evt.data.fn.click(evt, evt.data.fn);
				this.hide();
			});
		}
	}
	/**
	 * @function setItems
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @param {type}
	 */
	setItems(items) {
		this.jEl.empty();
		this.jEl.height("auto");
		// log("setItems",this.jEl)
		if (items.length) {
			var ul = $("<ul>");
			this.jEl.append(ul);
			for (var i = 0; i < items.length; i++) {
				this.drawItem(items[i], i, ul, items);
			}
			this._setPosition();
		}
	}
	/**
	 * @function create
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {type}
	 */
	create() {
		// console.log("create");
		var html = `<div class="M_Relative"><div id="${this.id}" class="M_Dropdown"></div></div>`;
		// log("this.container",this.container)
		$(this.container).append(html);
		this.jEl = $(this.container).find(".M_Dropdown");
		this.jEl.css("z-index", M_.Utils.getNextZIndex());
		if (this.width > 0) this.jEl.width(this.width);

		if (this.items.length) this.setItems(this.items);
		else if (this.html) this.jEl.html(this.html);

		// if (this.autoShow) this.show() ;

		this.jEl.on("M_DropdownHide", evt => {
			// log("M_DropdownHide")
			// evt.stopPropagation() ;
			this.hide();
		});
		// this.jEl.on('M_DropdownShow', (evt)=> {
		// 	// evt.stopPropagation() ;
		// 	log("show!!!")
		// 	this.show() ;
		// }) ;

		// log("ddd",this.jEl)
	}
	/**
	 * @function show
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {type}
	 */
	show() {
		// log("show",this._visible)
		// var evt = $.Event('click') ;
		// evt.stopPropagation() ;
		// log("show", this._visible, this.jEl)
		// window.event.stopPropagation();
		// M_.Dropdown.closeAllDropdown() ;
		if (this._visible) return;
		if (this.trigger("beforeShow", this) === false) return false;
		this.showOrHide(true);
		this.trigger("show", this);
	}
	/**
	 * @function hide
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {type}
	 */
	hide() {
		// log("hide", this.destroyOnHide, this.jEl.get(0).id)
		// log("hide ",this._visible, this.jEl)
		if (!this._visible) return;
		if (this.trigger("beforeHide", this) === false) return false;
		this.showOrHide(false);
		this.trigger("hide", this);
	}
	/**
	 * @function isVisible
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {Boolean}
	 */
	isVisible() {
		return this._visible;
	}
	_waitEndClose() {
		window.setTimeout(() => {
			this._waitEndClose();
		}, 10);
	}
	/**
	 * @function realign
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {type}
	 */
	realign() {
		this._setPosition();
	}
	_setPosition() {
		// search parent overflow with auto or hidden
		var rettemp = this.jEl
			.parents()
			.filter(function() {
				if ($(this).css("overflow") === "auto" || $(this).css("overflow") === "hidden") return true;
				return false;
			})
			.first();
		// var compareTo = {top: $(window).scrollTop(), height: $(window).height()} ;
		// if (rettemp.length) compareTo = {top: }
		var compareTo = $("body"); // work because body height == window height !!!!
		if (rettemp.length) compareTo = rettemp;

		this.jEl.height("auto");

		var t = this.alignTo.offset().top + this.alignTo.outerHeight() + this.offsetTop;
		var l = this.alignTo.offset().left + this.offsetLeft;
		this.jEl.show().offset({ top: t, left: l });
		// log("this.offsetLeft",this.offsetLeft)

		var top = this.jEl.offset().top;
		var h = this.jEl.outerHeight();
		var topCompareTo = compareTo.offset().top;
		var hCompareTo = compareTo.outerHeight();
		// console.log("hCompareTo", hCompareTo);
		// console.log("top,h,topCompareTo,hCompareTo", top,h,topCompareTo,hCompareTo,this.jEl);
		if (top + h > topCompareTo + hCompareTo && this.alwaysDropdownBelow !== true) {
			// check if space above is bigger than below
			if (top - topCompareTo > topCompareTo + hCompareTo - top) {
				//more big above
				// max height
				let maxh = top - topCompareTo - 35;
				let moreH = 0;
				if (h > maxh && this.autoSize) {
					h = maxh;
					this.jEl.height(h - 50);
				} else moreH = 30;
				t = top - h - moreH;
				this.jEl.offset({ top: t, left: l });
			} else {
				// more big bottom
				let maxh = topCompareTo + hCompareTo - top - 25;
				if (h > maxh && this.autoSize) {
					h = maxh;
					this.jEl.height(h);
				}
			}
		}

		// var hWin = $(window).height() ;
		// var top = this.jEl.offset().top ;
		// var h = this.jEl.height() ;
		// if (top+h-$(window).scrollTop() > hWin) {
		// 	// try to set dropdown on top of alignTo
		// 	if (this.alignTo.offset().top>(hWin/2) && h<(hWin/2)) {
		// 		t = this.alignTo.offset().top - h - 30 ;
		// 		this.jEl.offset({top:t, left:l}) ;

		// 	// else set dropdown height
		// 	} else {
		// 		var h = hWin-(top-$(window).scrollTop())-30 ;
		// 		this.jEl.height(h) ;
		// 	}
		// }
	}
	/**
	 * @function showOrHide
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @param  {type}
	 * @return {type}
	 */
	showOrHide(ok) {
		// log("showOrHide",ok,this.jEl)
		var speed = M_.Utils.getSpeedAnim();
		if (ok) {
			// this.jEl.show().css({opacity:0}).offset({top, left}).transition({opacity:1}) ;
			M_.Dropdown.closeAllDropdown();
			// log("this.jEl",this.jEl)
			this.jEl
				.show()
				.css({ opacity: 0.5 })
				.transition({ opacity: 1 }, speed);
			this._setPosition();
			this._visible = true;
		} else {
			// this.jEl.transition({opacity:0}, speed, ()=> {
			this.jEl.hide();
			this._visible = false;
			if (this.destroyOnHide) this.destroy();
			// }) ;
		}
		// log("_visible",this._visible)
	}
	/**
	 * @function destroy
	 * @memberOf! M_.Dropdown
	 * @instance
	 * @return {type}
	 */
	destroy() {
		// log("destroy");
		// $(document).off('click', $.proxy(this.onDocumentClick, this)) ;
		this.jEl.parent().remove();
		this.trigger("destroy", this);
	}
	/**
	 * @return {type}
	 */
	static closeAllDropdown() {
		// log("closeAllDropdown")
		$(".M_Dropdown").trigger("M_DropdownHide");
		// if (this.tabDropdowns) {
		// 	for(var i=0 ; i<this.tabDropdowns.length ; i++) {
		// 		if (this.tabDropdowns[i]) this.tabDropdowns[i].hide() ;
		// 	}
		// }
	}
	static _goGlobalListeners() {
		$(document)
			.on("click", ".M_Dropdown", evt => {
				M_.Help.hideMHelp();
				evt.stopPropagation();
			})
			.on("click", evt => {
				M_.Help.hideMHelp();
				// log("clickDocument")
				// if ($(evt.target).closest('.M_Dropdown').length===0) {
				this.closeAllDropdown();
				// $('.M_Dropdown').trigger('M_DropdownHide') ;
				// }
			});
	}
};
M_.Dropdown._goGlobalListeners();

/**
 * Create month calendar to display directly on page or in a M_.Form.Date
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @property {type} container
 * @property {type} dateViewed
 * @property {type} dateSelected
 * @property {type} renderCellDay
 * @property {type} dateFormat
 * @property {type} dateFormatFrom
 * @property {type} firstDay
 * @property {type} noDays
 * @property {type} noMonths
 * @property {type} allways6lines
 * @property {type} cls
 * @property {type} displayHeader
 * @property {type} showDateSelected
 * @property {type} showDateViewed
 */
M_.CalendarMonth = class {
	constructor(opts) {
		var defaults = {
			container: null,
			dateViewed: moment(),
			dateSelected: moment(),
			renderCellDay: null,
			// disabledDatesTo: null,
			// disabledDatesFrom: null,
			disabledDates: null,
			dateFormat: "DD/MM/YYYY",
			dateFormatFrom: "YYYY-MM-DD",
			firstDay: 1, //0=sunday, 1=monday
			noDays: false,
			noMonths: false,
			_thefirstDay: null,
			_thelastDay: null,
			allways6lines: false,
			cls: "",
			_cls: "",
			displayHeader: true,
			selectable: true,
			showDateSelected: true,
			showDateViewed: true,
			showWeekNumber: false,
			selectWeek: false
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();

		this.create();
	}
	// tpl: 'tpl_M_CalendarMonth',

	/**
	 * @return {type}
	 */
	create() {
		var html = `<div class="M_CalendarMonth ${this._cls} ${this.cls}">
			<div class="M_CalendarMonth_days">
				<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>
				<div class="M_CalendarMonth_date">Date</div>
				<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>
				<div class="M_CalendarMonth_content"></div>
			</div>
			<div class="M_CalendarMonth_months">
				<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>
				<div class="M_CalendarMonth_date">Date</div>
				<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>
				<div class="M_CalendarMonth_content"></div>
			</div>
			<div class="M_CalendarMonth_years">
				<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>
				<div class="M_CalendarMonth_date">Date</div>
				<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>
				<div class="M_CalendarMonth_content"></div>
			</div>
		</div>`;

		this.jEl = $(html);
		this.container.append(this.jEl);
		this.redraw();

		if (!this.displayHeader) this.container.find(".M_CalendarMonth_date, .M_CalendarMonth_previous, .M_CalendarMonth_next").hide();
		else this.container.find(".M_CalendarMonth_date, .M_CalendarMonth_previous, .M_CalendarMonth_next").show();
	}
	/**
	 * @param {type}
	 * @param {type}
	 */
	setDateViewed(dateViewed, dateSelected) {
		this.dateViewed = dateViewed;
		// log("this.dateViewed",this.dateViewed)
		if (dateSelected) this.dateSelected = dateSelected;
		this.redraw();
	}
	/**
	 * @param {type}
	 * @param {type}
	 */
	setDateSelected(dateSelected, dateViewed) {
		this.dateSelected = dateSelected;
		if (dateViewed) this.dateViewed = dateViewed;
		this.redraw();
	}
	/**
	 * @return {type}
	 */
	getDateSelected() {
		return moment(this.dateSelected);
	}
	/**
	 * @return {type}
	 */
	redraw() {
		this.showDays();
	}
	/**
	 * @return {type}
	 */
	showYears() {
		this.jEl.find(".M_CalendarMonth_days").hide();
		this.jEl.find(".M_CalendarMonth_months").hide();
		this.jEl.find(".M_CalendarMonth_years").show();

		var yearStart = Math.floor(this.dateViewed.year() / 10) * 10 - 1;

		var html = "";
		html += "<table>";
		for (var i = 0; i < 12; i++) {
			var dActu = moment({ year: yearStart + i, month: this.dateViewed.month(), day: 1 });
			if (i % 4 === 0) html += "<tr>";
			var active = "";
			if (dActu.year() == this.dateSelected.year()) active = "class='active'";
			html += "<td " + active + " data-m-date='" + dActu.format("YYYY-MM-DD") + "'>" + dActu.year() + "</td>";
			if (i % 4 === 3) html += "</tr>";
		}
		html += "</table>";
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content").html(html);

		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_date").html(yearStart + 1 + " - " + (yearStart + 11));

		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content td").off("click");
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content td").on("click", evt => {
			var d = $(evt.target).attr("data-m-date");
			this.selectYear(d);
		});
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_next").off("click");
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_next").on("click", evt => {
			this.nextYears();
		});
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_previous").off("click");
		this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_previous").on("click", evt => {
			this.previousYears();
		});
		this.trigger("viewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @return {type}
	 */
	previousYears() {
		this.dateViewed.add(-10, "years"); //  = new Date(this.dateViewed.getFullYear()*1-10, this.dateViewed.getMonth(), 1) ;
		this.showYears();
		this.trigger("yearViewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @return {type}
	 */
	nextYears() {
		this.dateViewed.add(10, "years"); //this.dateViewed = new Date(this.dateViewed.getFullYear()*1+10, this.dateViewed.getMonth(), 1) ;
		this.showYears();
		this.trigger("yearViewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	selectYear(date) {
		// if ($.type(date)=="string") date = moment(date) ; //date = M_.Utils.parseDate(date, 'Y-m-d') ;
		this.dateViewed = moment(date);
		if (this.noMonths) {
			this.dateViewed.month(0).date(1);
			//this.selectDate(date) ;
			this.trigger("selected", this, moment(this.dateViewed));
		} else {
			this.showMonths();
			this.trigger("yearViewedChanged", this, moment(this.dateViewed));
		}
	}
	/**
	 * @return {type}
	 */
	showMonths() {
		if (this.noMonths) {
			this.showYears();
			return;
		}
		this.jEl.find(".M_CalendarMonth_days").hide();
		this.jEl.find(".M_CalendarMonth_months").show();
		this.jEl.find(".M_CalendarMonth_years").hide();

		var html = "";
		html += "<table>";
		var tabMonths = moment.months();
		for (var i = 0; i < 12; i++) {
			var dActu = moment({ year: this.dateViewed.year(), month: i, day: 1 }); //new Date(this.dateViewed.year(), i, 1) ;
			if (i % 3 === 0) html += "<tr>";
			var active = "";
			if (dActu.year() == this.dateSelected.year() && dActu.month() == this.dateSelected.month()) active = "class='active'";
			var moreD = "";
			if (this.showWeekNumber) {
				var dTemp3 = moment(dActu).endOf("month");
				moreD += "<br>(S" + dActu.week() + " - S" + dTemp3.week() + ")";
			}
			html += "<td " + active + " data-m-date='" + dActu.format("YYYY-MM-DD") + "'>" + tabMonths[i] + moreD + "</td>";
			if (i % 3 == 2) html += "</tr>";
		}
		html += "</table>";
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content").html(html);

		this.jEl
			.find(".M_CalendarMonth_months .M_CalendarMonth_date")
			.html(this.dateViewed.year() + " <span class='fa fa-arrow-circle-down'></span>");

		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content td").off("click");
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content td").on("click", evt => {
			var d = $(evt.target).attr("data-m-date");
			this.selectMonth(d);
		});
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_next").off("click");
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_next").on("click", evt => {
			this.nextYear();
		});
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_date").off("click");
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_date").on("click", evt => {
			this.showYears();
		});
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_previous").off("click");
		this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_previous").on("click", evt => {
			this.previousYear();
		});
		this.trigger("viewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	selectMonth(date) {
		// if ($.type(date)=="string") date = moment(date) ;
		this.dateViewed = moment(date);
		if (this.noDays) {
			this.dateViewed.date(1);
			//this.selectDate(date) ;
			this.trigger("selected", this, moment(this.dateViewed));
		} else {
			this.showDays();
			this.trigger("dateViewedChanged", this, moment(this.dateViewed));
		}
	}
	/**
	 * @return {type}
	 */
	previousYear() {
		// var d = this.dateViewed.date();
		// if (this.dateViewed.date() * 1 > 28) d = 28;
		this.dateViewed.subtract(1, "years");
		this.showMonths();
		this.trigger("yearViewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @return {type}
	 */
	nextYear() {
		// var d = this.dateViewed.date();
		// if (this.dateViewed.date() * 1 > 28) d = 28;
		this.dateViewed.add(1, "years");
		this.showMonths();
		this.trigger("yearViewedChanged", this, moment(this.dateViewed));
	}
	/**
	 * @return {type}
	 */
	showDays() {
		var i;
		if (this.noDays) {
			this.showMonths();
			return;
		}
		this.jEl.find(".M_CalendarMonth_days").show();
		this.jEl.find(".M_CalendarMonth_months").hide();
		this.jEl.find(".M_CalendarMonth_years").hide();

		var today = moment();
		var year = this.dateViewed.year();
		var month = this.dateViewed.month();
		// var date = this.dateViewed.date() ;
		var nbDaysInMonth = this.dateViewed.daysInMonth();
		var firstDate = moment({ year: year, month: month, day: 1 }).startOf("day");
		var decalage = 0;
		// log("firstDate",firstDate,decalage)
		for (i = 1; i <= 7; i++) {
			if (firstDate.day() == 1) break;
			decalage--;
			firstDate.add(-1, "days");
		}
		// log("firstDate",firstDate,decalage)
		var html = "";
		html += "<table>";
		html += "<thead><tr>";
		if (this.showWeekNumber) html += "<th>S</th>";
		var tabDaysShort = moment.weekdaysShort();
		for (i = 0; i < 7; i++) {
			var j = (i + 1) % 7;
			html += "<th>" + tabDaysShort[j] + "</th>";
		}
		html += "</tr></thead>";
		html += "<tbody>";
		var tabCells = [];
		var nbMax = Math.ceil(nbDaysInMonth + 15);
		var nbLines = 0;
		// log("firstDate",nbMax,firstDate, this.dateViewed)
		for (i = 0; i < nbMax; i++) {
			var dActu = moment()
				.year(year)
				.month(month)
				.date(1 + decalage + i)
				.startOf("day"); //{year:year, month:month, day:1+decalage+i}
			if (i === 0) this._thefirstDay = moment(dActu);
			if (dActu.day() == 1) {
				html += "<tr>";
				if (this.showWeekNumber) {
					let tdClsWeek = "";
					if (this.disabledDates && this.disabledDates(this, dActu)) tdClsWeek = "notselectable";
					html +=
						"<td class='" + tdClsWeek + "' data-m-date='" + dActu.format("YYYY-MM-DD") + "'><b>" + dActu.week() + "</b>&nbsp;&nbsp;</td>";
				}
				nbLines++;
				if (this.allways6lines && nbLines == 7) {
					this._thelastDay = moment(dActu);
					break;
				}
			}
			var tdCls = "";
			if (
				this.showDateViewed &&
				dActu.year() == this.dateSelected.year() &&
				dActu.month() == this.dateSelected.month() &&
				dActu.date() == this.dateSelected.date()
			)
				tdCls += "active ";
			if (dActu.month() != this.dateViewed.month()) tdCls += "notthegoodmonth ";
			var isDisabled = false;
			if (this.disabledDates) isDisabled = this.disabledDates(this, dActu);
			if (isDisabled) tdCls += "notselectable ";
			if (this.showDateSelected && dActu.year() == today.year() && dActu.month() == today.month() && dActu.date() == today.date())
				tdCls += "current ";
			var contentTemp = dActu.date();
			var idCell = M_.Utils.id();
			//if (this.renderCellDay) contentTemp = this.renderCellDay(this, dActu, idCell) ;
			tabCells.push([dActu, idCell]);
			html +=
				"<td class='" +
				tdCls +
				"' id='" +
				idCell +
				"' data-m-date='" +
				dActu.format("YYYY-MM-DD") +
				"'><div class='M_CalendarMonth_txt'>" +
				contentTemp +
				"</div></td>";
			if (dActu.day() === 0) html += "</tr>";
			if (dActu.month() != month && dActu.day() === 0 && !this.allways6lines && nbLines >= 2) {
				this._thelastDay = moment(dActu);
				break;
			}
		}
		html += "</tbody>";
		html += "</table>";
		var tabMonths = moment.months();
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content").html(html);
		this.jEl
			.find(".M_CalendarMonth_days .M_CalendarMonth_date")
			.html(tabMonths[this.dateViewed.month()] + " " + this.dateViewed.year() + " <span class='fa fa-arrow-circle-down'></span>");

		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content td").off("click");
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content td").on("click", evt => {
			var target = $(evt.target).closest("td");
			if (target.hasClass("notselectable")) return;
			var d = target.attr("data-m-date");
			var date = moment(d);
			if (this.selectWeek) date.startOf("week");
			//this.selectDate(d) ;
			if (this.selectable) this.setDateSelected(date);
			this.trigger("selected", this, date);
		});
		if (this.selectWeek) {
			this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content tr").mouseenter(evt => {
				$(evt.target)
					.closest("tr")
					.addClass("alllineover");
			});
			this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content tr").mouseleave(evt => {
				$(evt.target)
					.closest("tr")
					.removeClass("alllineover");
			});
		}
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_next").off("click");
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_next").on("click", evt => {
			this.nextMonth();
		});
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_date").off("click");
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_date").on("click", evt => {
			this.showMonths();
		});
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_previous").off("click");
		this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_previous").on("click", evt => {
			this.previousMonth();
		});

		if (this.renderCellDay) {
			for (i = 0; i < tabCells.length; i++) {
				var el = $("#" + tabCells[i][1]);
				var contentTemp2 = this.renderCellDay(this, tabCells[i][0], el);
				el.html(contentTemp2);
			}
		}
		this.trigger("viewedChanged", this, moment(this.dateViewed));
	}

	/**
	 * @return {type}
	 */
	getFirstDay() {
		return this._thefirstDay;
	}
	/**
	 * @return {type}
	 */
	getLastDay() {
		return this._thelastDay;
	}
	/**
	 * @return {type}
	 */
	previousMonth() {
		// console.log("this.dateViewed", this.dateViewed);
		this.dateViewed.subtract(1, "month").startOf("months");
		this.showDays();
	}
	/**
	 * @return {type}
	 */
	nextMonth() {
		// this.dateViewed = moment({year:this.dateViewed.year(), month:this.dateViewed.month()*1+1, day:1}) ;
		this.dateViewed.add(1, "month").startOf("months");
		this.showDays();
	}
	/**
	 * @return {type}
	 */
	destroy() {
		this.jEl.remove();
		this.trigger("destroy", this);
	}
};

M_.Calendar = {};

M_.Calendar.MonthView = class extends M_.CalendarMonth {
	constructor(opts) {
		var defaults = {
			displayHeader: false,
			_cls: "M_CalendarMonthView",
			cellMinHeight: 50,
			cellHeadMinHeight: 20,
			showDateViewed: false,
			showDateSelected: true,
			provideEvents: null,
			selectable: false,
			modelDef: {
				key: "key",
				start: "start",
				end: "end",
				text: "text",
				cls: "cls"
			},
			events: [
				// {
				// 	id: '1',
				// 	start: moment(),
				// 	end: moment().add(8, 'days'),
				// 	text: "Céline",
				// 	bgcolor: 'red'
				// }, {
				// 	id: '2',
				// 	start: moment(),
				// 	end: moment().add(2, 'days'),
				// 	text: "Bernard",
				// 	bgcolor: 'green'
				// }, {
				// 	id: '3',
				// 	start: moment().subtract(2, 'days'),
				// 	end: moment().add(8, 'days'),
				// 	text: "Bernard2",
				// 	bgcolor: 'green'
				// }, {
				// 	id: '4',
				// 	start: moment().subtract(60, 'days'),
				// 	end: moment().subtract(15, 'days'),
				// 	text: "Henri",
				// 	bgcolor: 'purple'
				// }
			]
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);

		super(opts);

		_.mixin(this, M_.Stored);
		// log("store", Object.mixin)
		this.initStored();
	}
	loadEvents() {
		if (this.store)
			this.store.load({
				skip: 0,
				// where: "{'va_start':{'<': '"+moment(this.dateViewed).startOf('month').add(1, 'month').format('YYYY-MM-DD')+"'}, 'va_end':{'>':'"+moment(this.dateViewed).startOf('month').format('YYYY-MM-DD')+"'}}"
				start: moment(this.dateViewed)
					.startOf("month")
					.format("YYYY-MM-DD"),
				end: moment(this.dateViewed)
					.startOf("month")
					.add(1, "month")
					.format("YYYY-MM-DD")
			});
	}
	selectMonth(date) {
		super.selectMonth(date);
		this.loadEvents();
	}
	updateStore() {
		// this.showDays() ;
		this.drawEvents();
		// log("this.store",this.store) ;
	}
	showDays() {
		super.showDays();
		// this._loadEvents() ;
		// if (this.store) this.store.reload() ;
	}
	_loadEvents() {
		// if (this.provideEvents) {
		// 	this.provideEvents((events)=> {
		// 		this.events = events ;
		// 		this.drawEvents() ;
		// 	}) ;
		// } else {
		// 	this.drawEvents() ;
		// }
	}
	drawEvents() {
		this.jEl.find(".M_CalendarMonthView_bar").remove();
		if (this.cellMinHeight > 0) {
			this.jEl.find(".M_CalendarMonth_days tbody tr").css("min-height", this.cellMinHeight);
			this.jEl.find(".M_CalendarMonth_days tbody tr").css("height", this.cellMinHeight);
		}
		if (this.cellHeadMinHeight > 0) {
			this.jEl.find(".M_CalendarMonth_days thead tr").css("min-height", this.cellHeadMinHeight);
			this.jEl.find(".M_CalendarMonth_days thead tr").css("height", this.cellHeadMinHeight);
		}
		// var widthCell = this.jEl.find("td").outerWidth();
		// var tabNbEventsByDate = {} ; // stock le nb d'événements pour une journée
		var tabNbEventsByWeek = {}; // stock le nb d'événements dans la semaine
		var tabBars = [];
		// _.each(this.events, (evt)=> {
		this.store.each(model => {
			var start = moment(model.get(this.modelDef.start)).startOf("day");
			var end = moment(model.get(this.modelDef.end)).startOf("day");
			var start2 = model.get(this.modelDef.start2) || false;
			var end2 = model.get(this.modelDef.end2) || false;
			var nbDays = end.diff(start, "days") + 1;
			var dActu = moment(start);
			for (var nj = 0; nj < nbDays; nj++) {
				var isFirst = false;
				var isLast = false;
				var startOfWeek = moment(dActu)
					.startOf("week")
					.format("YYYY-MM-DD");
				if (nj === 0 || dActu.day() === 1) {
					if (!tabNbEventsByWeek[startOfWeek]) tabNbEventsByWeek[startOfWeek] = 0;
					if (nj === 0) isFirst = true;
					var objTemp = {
						id: model.get(this.modelDef.key),
						start: moment(dActu),
						start2: start2,
						end2: end2,
						isFirst: isFirst,
						isLast: isLast,
						nbDays: 0,
						startOfWeek: startOfWeek,
						position: tabNbEventsByWeek[startOfWeek]
						// text: model.get(this.modelDef.text),
						// color: model.get(this.modelDef.color),
						// bgcolor: model.get(this.modelDef.bgcolor)
					};
					if (_.isFunction(this.modelDef.text)) objTemp.text = this.modelDef.text(model);
					else objTemp.text = model.get(this.modelDef.text);
					if (_.isFunction(this.modelDef.cls)) objTemp.cls = this.modelDef.cls(model);
					else objTemp.cls = model.get(this.modelDef.cls);
					tabBars.push(objTemp);
					tabNbEventsByWeek[startOfWeek]++;
				}
				tabBars[tabBars.length - 1].nbDays++;
				if (nj === nbDays - 1) tabBars[tabBars.length - 1].isLast = true;
				// if (!tabNbEventsByDate[dActu.format('YYYY-MM-DD')]) tabNbEventsByDate[dActu.format('YYYY-MM-DD')] = 0 ;
				// tabNbEventsByDate[dActu.format('YYYY-MM-DD')]++ ;

				dActu.add(1, "days");
			}
		});
		// _.each(tabBars, (barEvt)=> {
		for (let barEvt of tabBars) {
			var bar = $("<div class='M_CalendarMonthView_bar " + barEvt.cls + "' data-m-evt='" + barEvt.id + "'>" + barEvt.text + "</div>");
			var css = {
				top: barEvt.position * 15 + 25
			};
			if (barEvt.bgcolor) css["background-color"] = barEvt.bgcolor;
			if (barEvt.color) css.color = barEvt.color;
			var moreLeft = 0;
			var moreWidth = 0;
			if (barEvt.start2 && barEvt.isFirst) moreLeft = 50; //widthCell/2
			if (barEvt.end2 && barEvt.isLast) moreWidth = 50; //widthCell/2
			css.left = moreLeft + "%";
			bar
				.width(101 * barEvt.nbDays - moreLeft - moreWidth + "%") //widthCell*barEvt.nbDays
				.css(css)
				.html(barEvt.text);
			var el2 = this.jEl.find("td[data-m-date='" + barEvt.start.format("YYYY-MM-DD") + "']");
			if (el2) el2.append(bar);
			var tr = this.jEl.find("td[data-m-date='" + barEvt.startOfWeek + "']").parent();
			var h = 25 + 15 * tabNbEventsByWeek[barEvt.startOfWeek] + 5;
			tr.css("height", Math.max(h, this.cellMinHeight));
		}
		this.jEl
			.find(".M_CalendarMonthView_bar")
			.click(evt => {
				evt.stopPropagation();
				var bar = $(evt.target);
				var id = bar.closest(".M_CalendarMonthView_bar").attr("data-m-evt");
				var found = this.store.getRow(id);
				if (found) this.trigger("clickitem", this, found, bar);
			})
			.mouseenter(evt => {
				var bar = $(evt.target);
				var id = bar.closest(".M_CalendarMonthView_bar").attr("data-m-evt");
				var found = this.store.getRow(id);
				this.trigger("enteritem", this, found, bar);
			});
	}
	setEvents(events) {
		this.events = events;
		this.redraw();
	}
};

/**
 * All form elements
 * @namespace
 * @memberof! <global>
 */
M_.Form = {};

/**
 * Manage a form
 * @class
 * @memberof! <global>
 * @implements M_.Observable
 * @implements M_.CRUD
 * @property {type} useWebsocket
 * @property {type} items
 * @property {type} itemsDefaults
 * @property {type} model
 * @property {type} url
 */
M_.Form.Form = class {
	constructor(opts) {
		var defaults = {
			useWebsocket: M_.App.useWebsocket,
			items: [],
			_items: [],
			itemsDefaults: {},
			_currentModel: null,
			model: null,
			url: "",
			urls: null,
			rootData: "data",
			validBeforeSave: true
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		_.mixin(this, M_.Observable);
		this.initObservable();
		_.mixin(this, M_.CRUD);
		this.initCRUD();

		var items = this.items;
		for (var i = 0; i < items.length; i++) {
			this.addItem(items[i]);
		}

		if (this.autoUnedit) {
			// $(document).click((evt)=> {
			// 	if ($(evt.target).closest('.edit').length===0) {
			// 		this.edit(false) ;
			// 	}
			// }) ;
		}
	}
	/**
	 * @return {type}
	 */
	reset() {
		var _items = this._items;
		for (var i = 0; i < _items.length; i++) {
			_items[i].reset();
		}
		this.trigger("reset", this);
	}
	enable() {
		var _items = this._items;
		for (var i = 0; i < _items.length; i++) {
			_items[i].enable();
		}
		this.trigger("disable", this);
	}
	/**
	 * @return {type}
	 */
	valid(err = []) {
		var ok = true;
		var _items = this._items;
		for (var i = 0; i < _items.length; i++) {
			if (!_items[i].valid()) {
				ok = false;
				var label = _items[i].name;
				if (_items[i].label !== "") label = _items[i].label;
				err.push({ key: _items[i].name, label: label });
			}
			// console.log("_items[i].valid(),_items[i].name", _items[i].valid(),_items[i].name);
		}
		var ok2 = this.trigger("valid", this, ok, err);
		// console.log("ok2", ok2, ok);
		return ok && ok2;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	informValidReturnSails(data) {
		// log("informValidReturnSails",data)
		var errTxt = "";
		_.each(data.invalidAttributes, (attr, key) => {
			// log("attr, key",attr, key)
			if (this.find(key)) {
				this.find(key).informValid(false);
				let key2 = this.find(key).label;
				if (key2 === "") key2 = key;
				key = key2;
			}
			errTxt += "<b>" + key + "</b> : ";
			_.each(attr, msg => {
				errTxt += msg.message;
			});
			errTxt += "<br/>";
		});
		M_.Dialog.alert("Erreur", "Merci de corriger les champs en rouge :<br/>" + errTxt);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	onLoad(model) {
		if (this.model)
			this.setValues(model); //.getData()
		else this.setValues(model);
	}
	/**
	 * @return {type}
	 */
	onBeforeLoad() {
		this.resetValid();
	}
	/**
	 * @param {type}
	 */
	setValues(dataOrModel) {
		// console.log("this._items", this._items);
		this.reset();
		if (!(dataOrModel instanceof M_.Model) && this.model) dataOrModel = new this.model({ row: dataOrModel });
		this._currentModel = dataOrModel;
		var _items = this._items;
		// log("_items",_items)
		for (var i = 0; i < _items.length; i++) {
			let v;
			if (this.model) v = this._currentModel.get(_items[i].name);
			else v = this._currentModel[_items[i].name];
			// log("_items[i].name",i, _items[i].name, v)
			if (v !== undefined) {
				if (_items[i] instanceof M_.Form.Combobox) {
					let v2;
					if (this.model) v2 = this._currentModel.get(_items[i].name + "_val");
					else v2 = this._currentModel[_items[i].name + "_val"];
					// log("v2",v2,name+'_val')
					if (v2) _items[i].setValueAndRawValue(v, v2);
					else {
						_items[i].setValue(v);
					}
				} else {
					// console.log("v", v, _items[i].inputType);
					_items[i].setValue(v);
				}
			} else {
				_items[i].reset();
			}
		}
		//		this._hideIfEmpty() ;
		this.trigger("update", this);
	}
	//	_hideIfEmpty() {
	//		var _items = this._items ;
	//		for(var i=0 ; i<_items.length ; i++) {
	//			// _items[i]._hideIfEmpty() ;
	//			// log("hideIfEmpty",_items[i].hideIfEmpty2)
	//			if (_items[i].hideContainerIfEmpty && M_.Utils.isEmpty(_items[i].getValue())) {
	//				_items[i].container.hide() ;
	//			} else {
	//				_items[i].container.show() ;
	//			}
	//				// if (this._inEdit || _items[i].value!=='') _items[i].container.closest(_items[i].hideIfEmpty).show() ;
	//			// 	else if (_items[i].value==='') _items[i].container.closest(_items[i].hideIfEmpty).hide() ;
	//			// }
	//		}
	//	}
	/**
	 * @param  {Boolean}
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValues(serialized = false, returnModel = false) {
		// var model = new this.model() ;
		// log("model",model)
		var _items = this._items,
			data = {};
		for (var i = 0; i < _items.length; i++) {
			if (_items[i] instanceof M_.Form.File) continue;
			// 	// log("AAAAAAAAAAA")
			// 	var resTemp = _items[i].getValue(serialized) ;
			// 	if (resTemp==="") continue ;
			// 	else data[_items[i].name] = resTemp ;
			// } else
			var val = _items[i].getValue(serialized);
			if (_items[i].name.slice(-2) === "[]") {
				var nameTemp = _items[i].name.slice(0, -2);
				if (!data[nameTemp]) data[nameTemp] = [];
				data[nameTemp].push(val);
			} else {
				data[_items[i].name] = val;
			}
			// if (data[_items[i].name]==undefined) {
			// 	data[_items[i].name] = val ;
			// } else {
			// 	if (Array.isArray(data[_items[i].name])) {
			// 		data[_items[i].name].push(val) ;
			// 	} else {
			// 		data[_items[i].name] = [data[_items[i].name], val] ;
			// 	}
			// }

			// if (moment.isMoment(data[_items[i].name])) data[_items[i].name] = data[_items[i].name].format("YYYY-MM-DD HH:mm:ss") ;
			// if (_items[i].)
		}
		// log("getValues",data);
		if (returnModel) return new this.model({ row: data });
		return data;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	find(fieldName) {
		var _items = this._items;
		for (var i = 0; i < _items.length; i++) {
			if (_items[i].name == fieldName) {
				return _items[i];
			}
		}
		return null;
	}
	/**
	 * @return {type}
	 */
	resetValid() {
		for (var i = 0; i < this._items.length; i++) {
			this._items[i].informValid(true);
		}
	}
	/**
	 * @return {type}
	 */
	validAndAlert() {
		var err = [];
		var ok = this.valid(err);
		if (!ok) this._alert(err);
		return ok;
	}
	_alert(err) {
		var errTxt = "";
		_.each(err, er => {
			errTxt += "• " + er.label + "<br>";
		});
		M_.Dialog.alert("Erreur", "Merci de corriger les champs en rouge :<br>" + errTxt);
	}
	validAndSave(modelOrData = null, args = {}, callback = null) {
		var err = [];
		var ok = this.valid(err);
		// console.log("ok", ok);
		if (ok) this.save(modelOrData, args, callback);
		else this._alert(err);
		return ok;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	populate(dataOrModel) {
		this.setValues(dataOrModel);
		// if (data instanceof M_.Model) {
		// 	data = data.getArray();
		// }
		// this.resetSate();
		// for (var i = 0; i < this.outlets.length; i++) {
		// 	var outlet = this.outlets[i];
		// 	for (var key in data) {
		// 		if (outlet.name == key) {
		// 			if (outlet instanceof M_.Form.Static) {
		// 				if (data[key + "_val"])
		// 					outlet.setValueAndText(data[key], data[key + "_val"]);
		// 				else
		// 					outlet.setValue(data[key]);
		// 			} else if (outlet instanceof M_.Form.MultiCombobox) {
		// 				outlet.reset();
		// 				if ($.isArray(data[key]))
		// 					outlet.setValue(data[key]);
		// 			} else if (outlet instanceof M_.Form.Combobox) {
		// 				if (data[key + "_val"])
		// 					outlet.setValueAndText(data[key], data[key + "_val"]);
		// 				else
		// 					outlet.setValue(data[key]);
		// 			} else {
		// 				outlet.setValue(data[key]);
		// 			}
		// 		}
		// 	}
		// }
	}
	/**
	 * @param {type}
	 */
	addItem(item) {
		if (!_.isArray(item)) item = [item];
		for (let i = 0; i < item.length; i++) {
			var optsItem = $.extend({}, this.itemsDefaults, item[i]);
			optsItem.form = this;
			if (optsItem.autoContainer) {
				var jElTemp = $("<div></div>");
				optsItem.autoContainer.append(jElTemp);
				optsItem.container = jElTemp;
			}
			if (optsItem.type === M_.Form.Div) new optsItem.type(optsItem);
			else {
				var item2 = new optsItem.type(optsItem);
				this._items.push(item2);
			}
		}
		// console.log("this._items",this._items);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	deleteItem(name) {
		var keepedItems = [];
		for (var i = 0; i < this._items.length; i++) {
			// log("destroy",this._items[i].name,name)
			if (this._items[i].name == name) {
				this._items[i].destroy();
			} else {
				keepedItems.push(this._items[i]);
			}
		}
		this._items = keepedItems;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getItem(name) {
		this.find(name);
	}
	/**
	 * @return {type}
	 */
	getItems() {
		return this._items;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	getItemsByFakeGroup(fakeGroupName) {
		var keepedItems = [];
		for (var i = 0; i < this._items.length; i++) {
			if (this._items[i].fakeGroup.indexOf(fakeGroupName) >= 0) keepedItems.push(this._items[i]);
		}
		return keepedItems;
	}

	getItemsByType(type) {
		var keepedItems = [];
		for (var i = 0; i < this._items.length; i++) {
			if (this._items[i] instanceof type) keepedItems.push(this._items[i]);
		}
		return keepedItems;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	deleteByFakeGroup(fakeGroupName) {
		var keepedItems = [];
		for (var i = 0; i < this._items.length; i++) {
			// console.log("this._items[i].fakeGroup.indexOf(fakeGroupName)",this._items[i].fakeGroup.indexOf(fakeGroupName),fakeGroupName);
			if (this._items[i].fakeGroup.indexOf(fakeGroupName) < 0) keepedItems.push(this._items[i]);
			else this._items[i].destroy();
		}
		this._items = keepedItems;
	}
	getCurrentModel() {
		return this._currentModel;
	}
	disable() {
		var _items = this._items;
		for (var i = 0; i < _items.length; i++) {
			if (this._items[i].disable) _items[i].disable();
		}
		this.trigger("disable", this);
	}
	// disable() {
	// 	for (var i = 0; i < this._items.length; i++) {
	// 		if (this._items[i].disable) this._items[i].disable();
	// 	}
	// }
};

/**
 * Base class to input form
 * @class
 * @memberof! <global>
 * @extends M_.Outlet
 * @property {type} name
 * @property {type} value
 * @property {type} autoContainer
 * @property {type} hideContainerIfEmpty
 * @property {type} placeholder
 * @property {type} form
 * @property {type} inputType
 * @property {type} editable
 * @property {type} clsInput
 * @property {type} clsGroup
 * @property {type} clsLabel
 * @property {type} styleInput
 * @property {type} styleGroup
 * @property {type} styleLabel
 * @property {type} label
 * @property {type} labelPosition
 * @property {type} labelWidth
 * @property {type} labelFocusInput
 * @property {type} dontSave
 * @property {type} fakeGroup
 * @property {type} allowEmpty
 * @property {type} minLength
 * @property {type} maxLength
 * @property {type} disabled
 */
M_.Form.Input = class extends M_.Outlet {
	constructor(opts) {
		var defaults = {
			name: "",
			value: "",
			autoContainer: null,
			// modelValue: '',
			// modelKey: '',
			hideContainerIfEmpty: false,
			placeholder: "",
			form: null,
			inputType: "hidden",
			tabindex: 0,
			editable: true,
			_inEdit: false,
			_clsMore: "",
			clsInput: "",
			clsGroup: "",
			clsLabel: "",
			styleInput: "",
			styleGroup: "",
			styleLabel: "",
			label: "",
			labelPosition: "top",
			labelWidth: 0,
			labelFocusInput: true,
			dontSave: false,
			fakeGroup: [],
			allowEmpty: true,
			minLength: null,
			maxLength: null,
			disabled: false,
			previousValue: null,
			addon: "",
			addonStyle: "",
			addonClass: ""
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (typeof this.fakeGroup === "string") this.fakeGroup = [this.fakeGroup];

		if ((this.labelPosition == "left" || this.labelPosition == "right") && this.labelWidth === 0) this.labelWidth = 0.3;

		this.setValue(this.value);
	}
	/**
	 * @param {type}
	 */
	setLabel(txt) {
		this.container.find("label").html(txt);
	}
	/**
	 * @return {type}
	 */
	create() {
		if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
		var v = this.value;
		if ($.type(v) !== "string") v = "";
		if (this.labelPosition == "left" && this.label !== "") {
			this.clsLabel += " M_LabelLeft";
			this.clsInput += " M_InputLeft";
		}
		if (this.labelPosition == "right" && this.label !== "") {
			this.clsLabel += " M_LabelRight";
			this.clsInput += " M_InputRight";
		}
		if (
			this.labelWidth > 0 &&
			this.label !== "" &&
			(this.labelPosition == "left" || this.labelPosition == "right") &&
			this.inputType != "checkbox"
		) {
			if (this.labelWidth <= 1) {
				this.styleLabel += " width:" + this.labelWidth * 100 + "%;";
				this.styleInput += " width:" + (100 - this.labelWidth * 100) + "%;";
			} else {
				this.styleLabel += " width:" + this.labelWidth + "px;";
				this.styleInput += " width:calc(100% - " + this.labelWidth + "px);";
			}
		}

		var html = "";
		var readOnly = "";
		var forattr = "";
		var tabindex = "";
		if (this.tabindex) tabindex = 'tabindex="' + this.tabindex + '"';
		if (this.labelFocusInput) forattr = 'for="' + this.id + '"';
		if (!this.editable) readOnly = "readonly";
		if (this.inputType == "hidden") {
			html += `<input ${readOnly} id="${this.id}" type="${this.inputType}" class="M_Input" name="${this.name}" value="${v}">`;
		} else {
			html += `<div style="${this.styleGroup}" class="M_FormGroup ${this.clsGroup}">`;
			if (this.label !== "" && (this.labelPosition == "left" || this.labelPosition == "top"))
				html += `<label style="${this.styleLabel}" class="${this.clsLabel}" ${forattr}>${this.label}</label>`;
			// if (this._addInputGroup) html += `<div class="M_InputGroup">` ;
			var multiple = "";
			if (this.multiple) multiple = "multiple";
			if (this.inputType == "file") {
				html += `<input ${tabindex} ${readOnly} id="${this.id}" type="${this.inputType}" style="${
					this.styleInput
				}" ${multiple} class="M_Input M_InputFile ${this.clsInput}" name="${this.name}" value="${v}" placeholder="${
					this.placeholder
				}"><label class='M_InputFileLabel' for="${this.id}">${this.txtChooseFile}</label>`;
			} else if (this.inputType == "textarea") {
				if (!this.height) this.height = 100;
				this.styleInput += " height:" + this.height + "px;";
				html += `<textarea ${tabindex} placeholder="${this.placeholder}" ${readOnly} id="${this.id}" class="M_Input ${
					this.clsInput
				}" style="${this.styleInput}" rows="${this.rows}" name="${this.name}">${v}</textarea>`;
			} else if (this.inputType == "none") {
				html += `<div id="${this.id}"></div>`;
			} else {
				var incremental = "";
				if (this.incremental) incremental = 'incremental="incremental"';
				html += `<input ${tabindex} ${readOnly} id="${this.id}" ${incremental} type="${this.inputType}" style="${
					this.styleInput
				}" class="M_Input ${this._clsMore} ${this.clsInput}" name="${this.name}" value="${v}" placeholder="${this.placeholder}">`;
			}
			// if (this._addInputGroup) html += `</div>` ;
			if (this.label !== "" && (this.labelPosition == "bottom" || this.labelPosition == "right"))
				html += `<label style="${this.styleLabel}" class="${this.clsLabel}" ${forattr}">${this.label}</label>`;
			html += `</div>`;
		}
		// log("html",html)
		this.container.append(html);
		this.jEl = $("#" + this.id);
		if (this.disabled) this.jEl.prop("disabled", true);
		// this.jEl = this.container.find('.M_Input') ;
		// this.jEl.attr('data-m-after', this.placeholder) ;
		if (this.addon) {
			// console.log("addon")
			this.jEl.addClass("M_Addon");
			var moreCls = "",
				moreStyle = "";
			if ((this.labelPosition == "left" || this.labelPosition == "right") && this.label !== "") {
				moreCls += " M_InputLeft";
				moreStyle += " width:calc(100% - " + this.labelWidth + "px);";
			}
			this.jEl.outerWidth("100%");
			this.jEl.removeClass("M_InputLeft");
			this.jEl.wrap("<div class='M_FormInputGroup " + moreCls + "' style='" + moreStyle + "'>");
			var htmlCaret = `<div class="M_FormAddon ${this.addonClass}" style='${this.addonStyle}'>${this.addon}</div>`;
			this._addon = $(htmlCaret);
			this.container.find(".M_FormInputGroup").append(this._addon);
			this._addon.click(evt => {
				// this.clickAddon(this, evt);
				this.trigger("clickaddon", this, evt);
			});
		}
	}
	changeAddon(txt) {
		this.jEl
			.parent()
			.find(".M_FormAddon")
			.html(txt);
	}

	/**
	 * @return {type}
	 */
	reset() {
		this.setValue("");
	}
	/**
	 * @return {type}
	 */
	disable() {
		this.disabled = true;
		this.jEl.prop("disabled", true);
	}
	/**
	 * @return {type}
	 */
	enable() {
		this.disabled = false;
		this.jEl.prop("disabled", false);
	}
	/**
	 * @return {type}
	 */
	valid() {
		var ok = true,
			val = this.getValue(); //,err = ""
		if (!this.allowEmpty && M_.Utils.isEmpty(val)) {
			ok = false;
			// err = "Ce champs ne peut pas être vide\n";
		}
		if (this.minLength !== null && val.length < this.minLength) {
			if (val.length === 0 && this.allowEmpty) {
			} else {
				ok = false;
				// err = "La longeur minimum est de " + this.minLength + " pour ce champs\n";
			}
		}
		if (this.maxLength !== null && val.length > this.maxLength) {
			ok = false;
			// err = "La longeur maximum est de " + this.maxLength + " pour ce champs\n";
		}
		// console.log("this.maxLength",this.maxLength);
		this.informValid(ok);
		return ok;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	informValid(ok) {
		if (!ok) this.jEl.addClass("M_Error");
		else this.jEl.removeClass("M_Error");
	}
	/**
	 * @return {Boolean}
	 */
	isEmpty() {
		// log("isEmpty","'"+this.value+"'")
		var v = this.getValue();
		if (v === "" || v === null) return true;
		return false;
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		// console.log("setValuePrim", val);
		this.previousValue = this.value;
		this.value = val;
		this.jEl.val(val);
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		this.value = this.jEl.val();
		return this.value;
	}
	/**
	 * @return {type}
	 */
	hide() {
		this.container.hide();
	}
	/**
	 * @return {type}
	 */
	show() {
		this.container.show();
	}
};

M_.Form.Slider = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			placeholder: "",
			inputType: "perso",
			jElCursor: null,
			steps: 2,
			value: 0,
			labelLeft: "Left",
			labelRight: "Right",
			colorLeft: "red",
			colorRight: "green",
			labelWidth: 50
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	create() {
		if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
		// var v = this.value;
		var jEl = $(
			"<div class='M_Slider'><label class='M_SliderLabelLeft'>" +
				this.labelLeft +
				"</label><div class='M_SliderBar'><div class='M_SliderCursor'></div></div><label class='M_SliderLabelRight'>" +
				this.labelRight +
				"</label><div class='M_Clear'></div></div>"
		);
		var wLabels = 0;
		if (this.labelLeft === "") {
			jEl.find(".M_SliderLabelLeft").remove();
		} else {
			wLabels += this.labelWidth;
			jEl.find(".M_SliderLabelLeft").width(this.labelWidth);
		}
		if (this.labelRight === "") {
			jEl.find(".M_SliderLabelRight").remove();
		} else {
			wLabels += this.labelWidth;
			jEl.find(".M_SliderLabelRight").width(this.labelWidth);
		}
		this.container.append(jEl);
		this.jEl = jEl.find(".M_SliderBar");
		this.jElCursor = jEl.find(".M_SliderCursor");
		this._spaceCursor = this.jElCursor.position().left;

		this.jEl.css("width", "calc(100% - " + wLabels + "px)");

		// this.jElCursor.width((this.jEl.width() - this._spaceCursor*2)/this.steps);
		this.jEl.click(evt => {
			var pos = 0;
			if (this.steps == 2) {
				if (!this.getValue()) pos = 1;
				this.setValue(pos);
			} else {
				var parentOffset = $(evt.target)
					.closest(".M_Slider")
					.offset();
				var relX = evt.pageX - parentOffset.left;
				var w = this.jEl.width();
				// console.log("w % this.steps", Math.ceil(relX / (w/this.steps)));
				pos = Math.ceil(relX / (w / this.steps)) - 1;
				// if (pos<0) pos = 0 ;
				this.setValue(pos);
			}
			this.trigger("change", this, pos);
		});
	}
	setPosition(pos) {
		// console.log("pos",pos);
		if (pos === false) pos = 0;
		if (pos === true) pos = 1;
		var w = this.jEl.width();
		var l = pos * (w / this.steps) + 3;
		if (pos === 0) {
			this.jEl.removeClass("step1");
			l += this._spaceCursor;
		} else {
			this.jEl.addClass("step1");
		}
		// if (pos===0) this.jEl.css('background-color',this.colorLeft) ;
		// else this.jEl.css('background-color',this.colorRight) ;
		this.jElCursor.transition({ left: l });
	}
	setValue(val) {
		if (val === "") return;
		// console.log("this.name,val",this.name,val);
		this.previousValue = this.value;
		this.value = val;
		this.setPosition(val);
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		if (this.steps == 2) {
			if (this.value == 1) return true;
			return false;
		}
		return this.value;
	}
};

/**
 * Hidden input form
 * @class
 * @extends M_.Form.Input
 * @memberof! <global>
 */
M_.Form.Hidden = class extends M_.Form.Input {
	setValue(val) {
		if (_.isPlainObject(val)) val = val[this.name];
		super.setValue(val);
	}
};

/**
 * A multi is a combobox + a list of values
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 * @property {type} confirmDelete
 * @property {type} confirmDeleteMessage
 * @property {type} value
 * @property {type} onClickBtAdd
 */
M_.Form.Multi = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "none",
			confirmDelete: false,
			confirmDeleteMessage: "Etes-vous certain de vouloir supprimer ce mot clé ?",
			value: [],
			onClickBtAdd: null,
			chooseValues: null,
			chooseValuesAreNumbers: true
		};
		opts._idBtAddKeyword = M_.Utils.id();
		if (opts.label) opts.label += " <span id='" + opts._idBtAddKeyword + "' class='fa fa-plus faa-pulse animated-hover'>";
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
		if (this.value.length) this.setValue(this.value);
		// $("#" + this._idBtAddKeyword).click(evt => {
		$(this.container.find("label")).click(evt => {
			evt.stopPropagation();
			if (this.onClickBtAdd) this.onClickBtAdd(this, this.value);
			else if (this.chooseValues) this.showChooseValues();
		});
	}
	showChooseValues() {
		let html = "";
		_.each(this.chooseValues, c => {
			let idTemp = M_.Utils.id();
			let checked = "";
			if (_.indexOf(this.value, c.key) >= 0) checked = "checked";
			html += `<div class="M_FormMultiItem"><label for="${idTemp}"><input type='checkbox' id='${idTemp}' name='${idTemp}' data-id="${
				c.key
			}" ${checked}>${c.val}</label></div>`;
		});
		this.dd = new M_.Dropdown({
			autoShow: true,
			alignTo: $("#" + this._idBtAddKeyword),
			html: html
		});
		this.dd.show();
		this.dd.jEl.find(".M_FormMultiItem input").change(evt => {
			let ids = [];
			this.dd.jEl.find(".M_FormMultiItem input:checked").each((ind, el) => {
				let id = $(el).attr("data-id");
				let v2 = id;
				if (!isNaN(id)) v2 = id * 1;
				ids.push(v2);
			});
			this.setValue(ids);
		});
	}
	/**
	 * @return {type}
	 */
	drawContainer() {
		// log("this.value",this.value,this.name);
		this.jEl.empty();
		_.each(this.value, val => {
			let valtxt = "",
				valid = "";
			if (this.chooseValues) {
				let v2 = val;
				if (!isNaN(val)) v2 = val * 1;
				let v = _.find(this.chooseValues, { key: v2 });
				if (v) {
					valid = v.key;
					valtxt = v.val;
				} else return;
			} else {
				valid = valtxt = val;
			}
			let html = `<div class="M_ComboboxMultiItem selected" data-kw-id="${valid}">${valtxt} <span class="fa fa-trash faa-pulse animated-hover"></span></div>`;
			let jEl = $(html);
			this.jEl.append(jEl);
			jEl.find(".fa-trash").click(evt => {
				if (this.confirmDelete) {
					M_.Dialog.confirm("Confirmation effacement", this.confirmDeleteMessage, () => {
						this.removeValue(
							$(evt.target)
								.parent()
								.attr("data-kw-id")
						);
					});
				} else {
					this.removeValue(
						$(evt.target)
							.parent()
							.attr("data-kw-id")
					);
				}
			});
		});
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	removeValue(valtoremove) {
		// _.pull(this.value, val);
		let oks = [];
		_.each(this.value, val => {
			if (val != valtoremove) oks.push(val);
		});
		this.value = oks;
		this.drawContainer();
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.previousValue = this.value;
		if (val === "") val = [];
		this.value = val;
		this.drawContainer();
	}
	/**
	 * @return {type}
	 */
	getValue() {
		return this.value;
	}
	/**
	 * @param {type}
	 */
	addValue(val) {
		this.value.push(val);
	}
};

/**
 * Display stars to rate
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 * @property {type} value
 * @property {type} nbStars
 */
M_.Form.Rating = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "none",
			value: -1,
			nbStars: 5
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
		this.jEl.addClass("M_FormRate");
		for (var i = 0; i < this.nbStars; i++) {
			var el = $("<div class='M_FormRateItem'>" + i + "</div>");
			this.jEl.append(el);
			el.mouseenter({ note: i }, evt => {
				if (this._toExitStar) window.clearTimeout(this._toExitStar);
				// log("mouseover", evt.data.note, $(evt.target))
				// $(evt.target).addClass('over') ;
				for (var i = 0; i < this.nbStars; i++) {
					if (i <= evt.data.note * 1) this.jEl.find(".M_FormRateItem:nth-child(" + (i + 1) + ")").addClass("over");
					else this.jEl.find(".M_FormRateItem:nth-child(" + (i + 1) + ")").removeClass("over");
				}
			});
			el.mouseleave({ note: i }, evt => {
				this._toExitStar = window.setTimeout(() => {
					this._toExitStar = null;
					this.setValue(this.value);
				}, 300);
			});
			el.click({ note: i }, evt => {
				this.setValue(evt.data.note * 1);
			});
		}
		this.drawContainer();
	}
	/**
	 * @return {type}
	 */
	drawContainer() {
		// this.jEl.empty() ;
		// this.jEl.removeClass('M_FormRate') ;
		for (var i = 0; i < this.nbStars; i++) {
			if (i <= this.value * 1) this.jEl.find(".M_FormRateItem:nth-child(" + (i + 1) + ")").addClass("over");
			else this.jEl.find(".M_FormRateItem:nth-child(" + (i + 1) + ")").removeClass("over");
		}
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	removeValue(val) {
		_.pull(this.value, val);
		this.drawContainer();
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.previousValue = this.value;
		if (val === "") val = 0;
		this.value = val;
		this.drawContainer();
	}
	/**
	 * @return {type}
	 */
	getValue() {
		return this.value;
	}
	/**
	 * @param {type}
	 */
	addValue(val) {
		this.value.push(val);
	}
};

/**
 * Input file form
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} placeholder
 * @property {type} inputType
 * @property {type} regxValidChar
 */
M_.Form.File = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			placeholder: "",
			inputType: "file",
			txtChooseFile: "Choisir un fichier",
			multiple: false,
			regxValidChar: null
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		this._labelButton = $(this.jEl.get(0).nextElementSibling);

		this.jEl.on("change", evt => {
			let fileName = "";
			if (this.jEl.files && this.jEl.files.length > 1)
				fileName = (this.jEl.getAttribute("data-multiple-caption") || "").replace("{count}", this.jEl.files.length);
			else fileName = evt.target.value.split("\\").pop();
			if (fileName) this._labelButton.html(fileName);
			else this._labelButton.html(this.txtChooseFile);

			this.trigger("change", this, evt);
		});
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		this.value = this.jEl.val();
		// if (this.jEl.get(0).files.length>0) return this.jEl.get(0).files[0] ;
		return this.value;
		// return this.value ;
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.previousValue = this.value;
		this.value = val;
	}
	setLabelButton(txt) {
		this._labelButton.html(txt);
	}
	recreate() {
		this.jEl
			.wrap("<form>")
			.closest("form")
			.get(0)
			.reset();
		this.jEl.unwrap();
	}
	reset() {
		this._labelButton.html(this.txtChooseFile);
	}
	// reset() {
	// 	if (!this.jEl) return ;
	// 	var par = this.jEl.parent() ;
	// 	this.jEl.remove() ;
	// 	// this.container.empty() ;
	//
	// 	var tabindex = "" ;
	// 	var readOnly = "" ;
	// 	if (this.tabindex) tabindex = 'tabindex="'+this.tabindex+'"' ;
	// 	if (!this.editable) readOnly = "readonly" ;
	// 	var multiple = "" ;
	// 	if (this.multiple) multiple = "multiple" ;
	// 	this.jEl = $(`<input ${tabindex} ${readOnly} id="${this.id}" type="${this.inputType}" style="${this.styleInput}" ${multiple} class="M_Input ${this.clsInput}" name="${this.name}" value="" placeholder="${this.placeholder}">`) ;
	// 	par.append(this.jEl) ;
	// 	this.jEl.on('change', (evt)=> {
	// 		this.trigger("change", this, evt) ;
	// 	}) ;
	// }
};

/**
 * Input text form
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} placeholder
 * @property {type} inputType
 * @property {type} regxValidChar
 */
M_.Form.Text = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			placeholder: "",
			inputType: "text",
			regxValidChar: null,
			selectOnFocus: false
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		// this.jEl.keypress((evt)=> {
		// 	// log("evt.which",evt.which)
		// 	if (this.jEl.hasClass('M_editablePlaceholder')) {
		// 		this.jEl.removeClass('M_editablePlaceholder') ;
		// 		this.jEl.empty() ;
		// 	}
		// 	if(evt.which == 13) {
		// 		evt.preventDefault() ;
		// 		this.form.edit(false) ;
		// 		this.jEl.blur() ;
		// 	}
		// }) ;
		// this.jEl.keydown((evt)=> {
		// 	// log("keydownevt.which",evt.which)
		// }) ;
		this.jEl.keyup(evt => {
			if (evt.which == 13) {
				if (this.onEnterInput(evt) !== false) {
					this.onKeyup(evt);
				}
			} else this.onKeyup(evt);
		});
		this.jEl.keypress(evt => {
			this.onKeyPress(evt);
		});
		if (this.selectOnFocus) {
			this.jEl.focus(evt => {
				evt.preventDefault();
				this.jEl.select();
			});
		}
	}
	onEnterInput(evt) {}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	onKeyup(evt) {
		// this.value = this.jEl.val() ;
		this.trigger("keyup", this, evt);
		this.trigger("update", this, this.getValue());
		this.valid();
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	onKeyPress(evt) {
		this.trigger("keypress", this, evt);
		if (evt.which == 13) return true;
		if (evt.which == 9) return true;
		if (evt.which == 8) return true;
		if (!this.validChar(String.fromCharCode(evt.which))) {
			evt.preventDefault();
			evt.stopPropagation();
			evt.stopImmediatePropagation();
			// this.informValid(2);
			return false;
		}
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	validChar(txt) {
		if (this.regxValidChar === null) return true;
		var reg = new RegExp(this.regxValidChar);
		var ok = reg.test(txt);
		return ok;
	}
};

M_.Form.Search = class extends M_.Form.Text {
	constructor(opts) {
		var defaults = {
			inputType: "search",
			incremental: true
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (M_.Utils.isEventSupported("search")) {
			this.jEl.on("search", evt => {
				this.trigger("search", this, evt);
			});
		} else {
			this.jEl.on("keyup", evt => {
				this.trigger("search", this, evt);
			});
		}
	}
};

/**
 * Input textarea form
 * @class
 * @memberof! <global>
 * @extends M_.Form.Text
 * @property {type} inputType
 * @property {type} acceptTabulation
 * @property {type} rows
 */
M_.Form.Textarea = class extends M_.Form.Text {
	constructor(opts) {
		var defaults = {
			inputType: "textarea",
			acceptTabulation: false,
			rows: 4
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (this.acceptTabulation) {
			this.jEl.on("keydown", e => {
				var keyCode = e.keyCode || e.which;
				if (keyCode == 9) {
					e.preventDefault();
					var start = this.jEl.get(0).selectionStart;
					var end = this.jEl.get(0).selectionEnd;
					this.jEl.val(this.jEl.val().substring(0, start) + "\t" + this.jEl.val().substring(end));
					this.jEl.get(0).selectionStart = this.jEl.get(0).selectionEnd = start + 1;
				}
			});
		}
	}
};

M_.Form.Password = class extends M_.Form.Text {
	constructor(opts) {
		var defaults = {
			inputType: "password",
			checkstrength: true
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (this.checkstrength) {
			this.jElPass = $("<div class='M_DivPassword'>OK</div>");
			this.jElPass.hide();
			this.container.append(this.jElPass);
			this.container.css("position", "relative");
			this.jEl.on("keyup", e => {
				var pos = this.jEl.offset();
				this.jElPass.show();
				var score = this.checkPassword();
				this.jElPass.removeClass("bg_col3 bg_col5 bg_col2");
				if (score < 2) {
					this.jElPass.addClass("bg_col3").html("Mauvais");
				} else if (score < 4) {
					this.jElPass.addClass("bg_col5").html("Moyen");
				} else {
					this.jElPass.addClass("bg_col2").html("Bon");
				}
				this.jElPass
					.offset({
						top: pos.top,
						left: pos.left + this.jEl.outerWidth() - this.jElPass.outerWidth()
					})
					.outerHeight(this.jEl.outerHeight());
			});
		}
	}
	checkPassword() {
		var v = this.jEl.val();
		var err = [];
		var score = 0;
		if (v.length < this.minLength) {
			err.push(this.minLength + " char minimum");
		} else score++;
		var re = /[0-9]/;
		if (!re.test(v)) {
			err.push("password must contain at least one number (0-9)!");
		} else score++;
		re = /[a-z]/;
		if (!re.test(v)) {
			err.push("password must contain at least one lowercase letter (a-z)!");
		} else score++;
		re = /[A-Z]/;
		if (!re.test(v)) {
			err.push("password must contain at least one uppercase letter (A-Z)!");
		} else score++;
		return score;
	}
};

/**
 * A wysiwyg editor
 * @class
 * @memberof! <global>
 * @extends M_.Form.Textarea
 * @property {type} heightEditor
 */
M_.Form.TextEditor = class extends M_.Form.Textarea {
	constructor(opts) {
		var defaults = {
			heightEditor: 200,
			optionsEditor: {}
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	/**
	 * @return {type}
	 */
	create() {
		super.create();

		// var h = this.jEl.height() ;
		this.jEl.hide();
		var idTemp1 = M_.Utils.id();
		var idTemp2 = M_.Utils.id();
		this.jEl.after("<div id='" + idTemp1 + "'></div><div><div class='M_FormEditor-Content' id='" + idTemp2 + "'></div></div>");
		$("#" + idTemp2).height(this.heightEditor);
		this.optionsEditor.buttonsContainer = $("#" + idTemp1);
		this.optionsEditor.container = $("#" + idTemp2);
		this.editor = new M_.Editor(this.optionsEditor);
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.previousValue = this.value;
		this.value = val;
		this.jEl.val(val);
		this.editor.container.html(val);
	}
	/**
	 * @return {type}
	 */
	getValue() {
		var val = this.editor.container.html();
		this.jEl.val(val);
		return val;
	}
	/**
	 * @return {type}
	 */
	getEditor() {
		return this.editor;
	}
};

/**
 * A radio buttons group
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 * @property {type} radioPosition
 * @property {type} items
 */
M_.Form.RadioGroup = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "radiogroup",
			radioPosition: "inline", // inline | col
			items: []
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	/**
	 * @return {type}
	 */
	create() {
		// var id1 = M_.Utils.id(),
		// 	id2 = M_.Utils.id() ;

		if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
		var v = this.value;
		if ($.type(v) !== "string") v = "";
		if ((this.labelPosition == "left" || this.labelPosition == "right") && this.label !== "") {
			this.clsLabel += " M_LabelLeft";
			this.clsInput += " M_InputLeft";
		}
		if (
			this.labelWidth > 0 &&
			this.label !== "" &&
			(this.labelPosition == "left" || this.labelPosition == "right") &&
			this.inputType != "checkbox"
		) {
			if (this.labelWidth <= 1) {
				this.styleLabel += " width:" + this.labelWidth * 100 + "%;";
				this.styleInput += " width:" + (100 - this.labelWidth * 100) + "%;";
			} else {
				this.styleLabel += " width:" + this.labelWidth + "px;";
				this.styleInput += " width:calc(100% - " + this.labelWidth + "px);";
			}
		}

		var html = "";
		// var readOnly = "";
		var forattr = "";
		if (this.labelFocusInput) forattr = 'for="' + this.id + '"';
		// if (!this.editable) readOnly = "readonly";

		// var html = `<div class='M_HorizontalForm'></div></div>` ;

		html += `<div style="${this.styleGroup}" class="M_FormGroup ${this.clsGroup}">`;
		if (this.label !== "" && (this.labelPosition == "left" || this.labelPosition == "top"))
			html += `<label style="${this.styleLabel}" class="${this.clsLabel}" ${forattr}>${this.label}</label>`;
		html += `<div id="${this.id}" type="${this.inputType}" style="${this.styleInput}" class="M_Input ${this.clsInput}">`;
		var nameTemp = M_.Utils.id();
		_.each(this.items, item => {
			let idTemp = M_.Utils.id();
			html += `<div class="M_RadioGroupItem ${this.radioPosition}"><input type='radio' name="${nameTemp}" id="${idTemp}" value="${
				item.key
			}" class="M_InputRight"/><label for="${idTemp}" class="M_LabelRight">${item.val}</label></div>`;
		});
		html += `</div></div>`;

		this.container.append(html);
		this.jEl = this.container.find(".M_HorizontalForm");

		this.container.find("input").click(evt => {
			this.trigger("change", this, this.getValue(), evt);
		});
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.previousValue = this.value;
		this.value = val;
		this.container.find("input").each((ind, el) => {
			if (el.value == this.value) $(el).prop("checked", true);
			else $(el).prop("checked", false);
		});
	}
	/**
	 * @return {type}
	 */
	getValue() {
		var v = this.container.find("input:checked").val();
		return v;
	}
};

/**
 * Input checkbox form
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 * @property {type} labelWidth
 * @property {type} labelFocusInput
 * @property {type} labelPosition
 */
M_.Form.Checkbox = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "checkbox",
			labelWidth: 100,
			labelFocusInput: true,
			labelPosition: "right",
			threeStates: false,
			indeterminate: false,
			previousValue: false
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);

		if (this.threeStates) {
			var v = 0;
			if (this.value) v = 1;
			if (this.indeterminate) v = 2;
			this.jEl.data("checked", v);
			if (v === 2) this.jEl.prop("indeterminate", true);
		}
		this.jEl.change(evt => {
			if (this.indeterminate) {
				switch (this.jEl.data("checked")) {
					// unchecked, going indeterminate
					case 0:
						this.jEl.data("checked", 1);
						this.jEl.prop("indeterminate", true);
						break;
					// indeterminate, going checked
					case 1:
						this.jEl.data("checked", 2);
						this.jEl.prop("indeterminate", false);
						this.jEl.prop("checked", true);
						break;
					// checked, going unchecked
					default:
						this.jEl.data("checked", 0);
						this.jEl.prop("indeterminate", false);
						this.jEl.prop("checked", false);
				}
			}
			this.trigger("change", this, this.getValue(), evt);
		});
		if (this.indeterminate) this.jEl.prop("indeterminate", true);
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		// console.log("val", val);
		if (val === "" || val === "false" || val === "0" || val === 0) val = false;
		if (val === "true" || val === "1" || val === 1) val = true;
		this.previousValue = this.value;
		this.value = val;
		if (val) this.jEl.prop("checked", true);
		else this.jEl.prop("checked", false);
		if (this.threeStates) {
			var v = 0;
			if (val) v = 1;
			if (val == 2) v = 2;
			this.jEl.data("checked", v);
			if (v === 2) this.jEl.prop("indeterminate", true);
			else this.jEl.prop("indeterminate", false);
		}
	}
	imcheckbox() {
		return "ok";
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		if (this.threeStates) {
			if (this.jEl.prop("indeterminate")) return 2;
		}
		return this.jEl.is(":checked");
	}
};

/**
 * Input number form ; only number are accepted
 * @class
 * @memberof! <global>
 * @extends M_.Form.Text
 * @property {type} decimalLength
 * @property {type} decimalSeparator
 * @property {type} decimalForced
 * @property {type} allowNegative
 * @property {type} valueMax
 * @property {type} valueMin
 * @property {type} startEmpty
 * @property {type} allowComparison allow signs : > or < or = or >= or <=
 */
M_.Form.Number = class extends M_.Form.Text {
	constructor(opts) {
		var defaults = {
			// inputType: 'number',
			decimalLength: 0,
			decimalSeparator: ",",
			decimalForced: false,
			allowNegative: true,
			allowPoint: false,
			valueMax: null,
			valueMin: null,
			startEmpty: false,
			allowComparison: false
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	// onKeyup(evt) {}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	validChar(txt) {
		var re = "\\d";
		if (this.allowNegative) re += "|\\-";
		if (this.allowPoint) re += "|\\.";
		if (this.decimalLength > 0) re += "|\\" + this.decimalSeparator;
		if (this.allowComparison) re += "|>|<|=";
		this.regxValidChar = re;
		var ok = super.validChar(txt);
		if (this.maxLength && (this.jEl.val() + "").length >= this.maxLength) ok = false;
		return ok;
	}
	/**
	 * @param {type}
	 */
	setValue(v) {
		// log("setValue",v)
		if (this.startEmpty && (v === "" || v === null || typeof v === "undefined")) return this.jEl.val("");
		v = v * 1;
		this.value = v;
		var v2 = v;
		v2 = (v2 + "").replace(".", this.decimalSeparator);
		if (this.decimalForced) {
			let dec = v % 1,
				nbDec = Math.pow(10, this.decimalLength),
				dec2 = Math.round(dec * nbDec);
			dec2 = M_.Utils.str_pad(dec2, this.decimalLength, "0", -1);
			// log("dec",dec, nbDec, dec2)
			v2 = Math.floor(v) + this.decimalSeparator + dec2;
		}
		this.jEl.val(v2);
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		if (this.startEmpty && this.jEl.val() === "") return null;
		var v = (this.jEl.val() + "").replace(this.decimalSeparator, ".");
		this.value = v * 1;
		if (this.allowComparison) this.value = v;
		return this.value;
	}
};

/**
 * Input price form ; only number are accepted
 * @class
 * @memberof! <global>
 * @extends M_.Form.Number
 * @property {type} decimalLength
 * @property {type} decimalSeparator
 * @property {type} decimalForced
 * @property {type} allowNegative
 */
M_.Form.Price = class extends M_.Form.Number {
	constructor(opts) {
		var defaults = {
			decimalLength: 2,
			decimalSeparator: ",",
			decimalForced: true,
			allowNegative: true
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
};

/**
 * Input color form ; TO implement !!!!
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 */
M_.Form.Color = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "color"
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
};

/**
 * A base class to add a picker to input text form
 * @class
 * @memberof! <global>
 * @extends M_.Form.Text
 * @property {type} hidePicker
 * @property {type} showDropdownOnFocus
 * @property {type} icon
 * @property {type} containerDropdown
 */
M_.Form.Picker = class extends M_.Form.Text {
	constructor(opts) {
		var defaults = {
			alwaysDropdownBelow: false,
			hasDropdown: true,
			hidePicker: false,
			showDropdownOnFocus: true,
			icon: "fa fa-caret-down",
			containerDropdown: null,
			_clsMore: "M_Combobox",
			stylePicker: "",
			dropdownOpts: {},
			dropdown: null
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		if (!optsTemp.containerDropdown) optsTemp.containerDropdown = optsTemp.container;
		optsTemp.containerDropdown = "body";
		// log("optsTemp.containerDropdown",optsTemp.containerDropdown,optsTemp.container)

		super(optsTemp);

		if (this.showDropdownOnFocus && this.hasDropdown) {
			this._sameEventEventClick = false;
			this.jEl.on("click", evt => {
				// focus
				// console.log("this._sameEventEventClick", this._sameEventEventClick);
				if (!this._sameEventEventClick) this.showDropdown(evt);
				this._sameEventEventClick = true;
				M_.Utils.delay(
					() => {
						this._sameEventEventClick = false;
					},
					200,
					"_sameEventEventClick"
				);
			});
		}
	}
	/**
	 * @return {type}
	 */
	createDropdown() {
		if (this.dropdown) return;
		if (!this.hasDropdown) return;
		// console.log("createDropdown");
		var optsTemp = $.extend(
			{},
			{
				alignTo: this.jEl,
				autoShow: false,
				destroyOnHide: true,
				container: this.containerDropdown,
				alwaysDropdownBelow: this.alwaysDropdownBelow,
				listeners: [
					[
						"hide",
						() => {
							this.dropdown = null;
						}
					]
				]
			},
			this.dropdownOpts
		);
		this.dropdown = new M_.Dropdown(optsTemp);
	}
	/**
	 * @return {Boolean}
	 */
	isDropdownVisible() {
		if (!this.dropdown) return false;
		return this.dropdown.isVisible();
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	showDropdown(evt) {
		// log("showDropdown")
		M_.Help.hideMHelp();
		if (!this.hasDropdown) return;
		evt.stopPropagation();
		if (!this.dropdown) this.createDropdown();
		this.dropdown.show();
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	clickPicker(evt) {
		this.showDropdown(evt);
		this.trigger("clickpicker", this, evt);
	}
	/**
	 * @return {type}
	 */
	create() {
		super.create();

		if (!this.hidePicker) {
			var moreCls = "",
				moreStyle = "";
			if ((this.labelPosition == "left" || this.labelPosition == "right") && this.label !== "") {
				moreCls += " M_InputLeft";
				moreStyle += " width:calc(100% - " + this.labelWidth + "px);";
			}
			this.jEl.outerWidth("100%");
			this.jEl.removeClass("M_InputLeft");
			this.jEl.wrap("<div class='M_FormInputGroup " + moreCls + "' style='" + moreStyle + "'>");
			var htmlCaret = `<div class="M_FormCaret ${this.icon}" style='${this.stylePicker}'></div>`;
			this.caret = $(htmlCaret);
			this.container.find(".M_FormInputGroup").append(this.caret);
			this.caret.click(evt => {
				this.clickPicker(evt);
			});
		}
	}
};

/**
 * Input date form ; display a date picker and a month view
 * @class
 * @memberof! <global>
 * @extends M_.Form.Picker
 * @property {type} icon
 * @property {type} dateFormat
 * @property {type} dateFormatInput
 */
M_.Form.Date = class extends M_.Form.Picker {
	constructor(opts) {
		var defaults = {
			icon: "fa fa-calendar",
			dateFormat: "DD/MM/YYYY",
			dateFormatInput: "YYYY-MM-DD",
			noDays: false,
			noMonths: false,
			showWeekNumber: false,
			selectWeek: false,
			disabledDates: null
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		// if (!optsTemp.value) optsTemp.value = moment() ;
		super(optsTemp);

		// this.jEl.click((evt)=> {
		// 	evt.stopPropagation() ;
		// 	// if (!this.dropdown) this.createDropdown() ;
		// 	// this.dropdown.show() ;
		// })
		// this.jEl.on('M_DropdownShow', (evt)=> {
		// 	if (!this.dropdown) this.createDropdown() ;
		// 	this.dropdown.show() ;
		// }) ;
	}
	/**
	 * @return {type}
	 */
	createDropdown() {
		this.dropdown = new M_.Dropdown({
			destroyOnHide: true,
			alignTo: this.jEl,
			container: this.containerDropdown,
			autoSize: false,
			alwaysDropdownBelow: this.alwaysDropdownBelow,
			listeners: [
				[
					"destroy",
					() => {
						this.dropdown = null;
						this.calendar.destroy();
					}
				]
			]
		});
		this.calendar = new M_.CalendarMonth({
			controller: this,
			container: this.dropdown.jEl,
			noDays: this.noDays,
			noMonths: this.noMonths,
			showWeekNumber: this.showWeekNumber,
			selectWeek: this.selectWeek,
			disabledDates: this.disabledDates,
			listeners: [
				[
					"selected",
					(cal, date) => {
						// log("date",cal, date)
						// this.container.html(date.format('DD/MM/YYYY')) ;
						this.setValue(date);
						this.trigger("change", this, date);
						this.dropdown.hide();
					}
				],
				[
					"viewedChanged",
					() => {
						this.dropdown.realign();
					}
				]
			]
		});
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	showDropdown(evt) {
		super.showDropdown(evt);
		if (moment.isMoment(this.value) && this.calendar) {
			this.calendar.setDateViewed(this.value);
			this.calendar.setDateSelected(this.value);
		}
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	onKeyup(evt) {
		super.onKeyup(evt);
		if (this.isDropdownVisible()) {
			var m = moment(this.jEl.val(), this.dateFormat);
			if (m.isValid()) {
				this.value = m;
				if (this.calendar) {
					this.calendar.setDateViewed(this.value);
					this.calendar.setDateSelected(this.value);
				}
			}
		}
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		if (val === "" || !val || val == "0000-00-00" || val == "0000-00-00 00:00:00") val = "";
		else if (moment.isMoment(val)) {
			if (!val.isValid()) val = "";
			// else val = val.format('YYYY-MM-DD') ;
		} else val = moment(val, this.dateFormatInput);
		this.value = val;
		// if (val!=='') log("format",val,val.format(this.dateFormat))
		if (val !== "") {
			this.jEl.val(val.format(this.dateFormat));
		} else this.jEl.val(val);
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		var v = this.jEl.val();
		if (v !== "") {
			v = moment(v, this.dateFormat).startOf("day");
			if (!serialized) return v;
			v = v.format("YYYY-MM-DD");
		}
		return v;
	}
};

M_.Form.DateWeek = class extends M_.Form.Date {
	constructor(opts) {
		var defaults = {
			// icon: 'fa fa-clock-o',
			dateFormat: "YYYY-\\SWW",
			dateFormatInput: "YYYY-MM-DD",
			showWeekNumber: true,
			selectWeek: true
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
	}
};

/**
 * Input hour form ; display a date picker and a hour view
 * @class
 * @memberof! <global>
 * @extends M_.Form.Date
 * @property {type} icon
 * @property {type} dateFormat
 * @property {type} dateFormatInput
 * @property {type} incrementHour
 * @property {type} incrementMinute
 * @property {type} incrementSecond
 */
M_.Form.Hour = class extends M_.Form.Date {
	constructor(opts) {
		var defaults = {
			icon: "fa fa-clock-o",
			dateFormat: "HH:mm",
			dateFormatInput: "HH:mm",
			incrementHour: 1,
			incrementMinute: 10,
			incrementSecond: 5
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);
	}
	/**
	 * @return {type}
	 */
	createDropdown() {
		// log("createDropdown")
		var html = `
		<div class="">
			<div class="M_Col6 M_FormHour_hour_up"><span class="fa fa-chevron-up"></span></div>
			<div class="M_Col6 M_FormHour_minute_up"><span class="fa fa-chevron-up"></span></div>
			<div class="M_Col6 M_FormHour_second_up"><span class="fa fa-chevron-up"></span></div>
			<div class="M_Clear"></div>

			<div class="M_Col6"><input type="text" class="form-control M_FormHour_hour" placeholder="" maxlength="2"></div>
			<div class="M_Col6"><input type="text" class="form-control M_FormHour_minute" placeholder="" maxlength="2"></div>
			<div class="M_Col6"><input type="text" class="form-control M_FormHour_second" placeholder="" maxlength="2"></div>
			<div class="M_Clear"></div>

			<div class="M_Col6 M_FormHour_hour_down"><span class="fa fa-chevron-down"></span></div>
			<div class="M_Col6 M_FormHour_minute_down"><span class="fa fa-chevron-down"></span></div>
			<div class="M_Col6 M_FormHour_second_down"><span class="fa fa-chevron-down"></span></div>
			<div class="M_Clear"></div>
			<div>
		</div>
		`;
		this.dropdown = new M_.Dropdown({
			destroyOnHide: true,
			alignTo: this.jEl,
			autoSize: false,
			html: html,
			listeners: [
				[
					"destroy",
					() => {
						this.dropdown = null;
					}
				]
			]
		});
		this.jElDropdown = this.dropdown.jEl;
		this.value = moment();
		// log("this.value",this.value)
		if (this.jEl.val().length > 0) this.value = moment(this.jEl.val(), this.dateFormat);
		this.setToCurrent();
		if (this.dateFormat.indexOf("s") < 0) {
			this.jElDropdown.find(".M_FormHour_second_up, .M_FormHour_second_down").hide();
			this.jElDropdown
				.find(".M_FormHour_second")
				.parent()
				.hide();
			this.jElDropdown
				.find(".col-lg-4")
				.removeClass("col-lg-4")
				.addClass("col-lg-6");
			this.jElDropdown.find(".dropdown-menu").addClass("short");
		}
		this.jElDropdown.find(".M_FormHour_hour_up").off("click");
		this.jElDropdown.find(".M_FormHour_hour_up").on(
			"click",
			$.proxy(function(evt) {
				// log("this.value",this.value)
				var m = this.value.hours() + this.incrementHour;
				m = Math.floor(m / this.incrementHour) * this.incrementHour;
				this.value.hours(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".M_FormHour_minute_up").off("click");
		this.jElDropdown.find(".M_FormHour_minute_up").on(
			"click",
			$.proxy(function(evt) {
				var m = this.value.minutes() + this.incrementMinute;
				m = Math.floor(m / this.incrementMinute) * this.incrementMinute;
				this.value.minutes(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".M_FormHour_second_up").off("click");
		this.jElDropdown.find(".M_FormHour_second_up").on(
			"click",
			$.proxy(function(evt) {
				var m = this.value.seconds() + this.incrementSecond;
				m = Math.floor(m / this.incrementSecond) * this.incrementSecond;
				this.value.seconds(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".M_FormHour_hour_down").off("click");
		this.jElDropdown.find(".M_FormHour_hour_down").on(
			"click",
			$.proxy(function(evt) {
				var m = this.value.hours() - this.incrementHour;
				m = Math.floor(m / this.incrementHour) * this.incrementHour;
				this.value.hours(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".M_FormHour_minute_down").off("click");
		this.jElDropdown.find(".M_FormHour_minute_down").on(
			"click",
			$.proxy(function(evt) {
				var m = this.value.minutes() - this.incrementMinute;
				m = Math.floor(m / this.incrementMinute) * this.incrementMinute;
				this.value.minutes(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".M_FormHour_second_down").off("click");
		this.jElDropdown.find(".M_FormHour_second_down").on(
			"click",
			$.proxy(function(evt) {
				var m = this.value.seconds() - this.incrementSecond;
				m = Math.floor(m / this.incrementSecond) * this.incrementSecond;
				this.value.seconds(m);
				this.setToCurrent();
				this.setValue(this.value);
			}, this)
		);
		this.jElDropdown.find(".dropdown-menu").show();
	}
	/**
	 * To document
	 */
	setToCurrent() {
		this.jElDropdown.find(".M_FormHour_hour").val(this.value.format("HH"));
		this.jElDropdown.find(".M_FormHour_minute").val(this.value.format("mm"));
		this.jElDropdown.find(".M_FormHour_second").val(this.value.format("ss"));
	}
	getValue() {
		var v = this.jEl.val();
		var t = v.split(":");
		var m = moment()
			.hours(t[0])
			.minutes(t[1])
			.seconds(0);
		// console.log("v",v,m,t);
		return m;
	}
	setValue(val) {
		var val2;
		// console.log("val",val,moment().utcOffset());
		if (!val) val = "00:00";
		if (typeof val == "string") {
			var v = "";
			if (val.length > 11) v = val.substring(11, 16);
			else v = val;
			var t = v.split(":");
			val2 = moment()
				.hours(t[0])
				.minutes(t[1])
				.seconds(0); //.add(moment().utcOffset(),'minutes')
		} else val2 = moment(val); //.add(moment().utcOffset(),'minutes')
		this.jEl.val(val2.format(this.dateFormat));
		this.value = val2;
	}
};

/**
 * Input datehour form ; display 2 pickers for date and hour
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} configDateDef
 * @property {type} configHourDef
 */
M_.Form.DateHour = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			configDateDef: {
				label: "",
				// labelPosition: 'left',
				// labelWidth: 3,
				name: "",
				containerWidth: "64%",
				required: true
			},
			configHourDef: {
				label: "",
				name: "",
				containerWidth: "36%",
				incrementMinute: 15,
				required: false
			}
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);

		// if ((this.labelPosition=='left' || this.labelPosition=='right') && this.labelWidth===0) this.labelWidth = 0.3 ;
	}
	/**
	 * @return {type}
	 */
	create() {
		var id1 = M_.Utils.id(),
			id2 = M_.Utils.id();

		if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
		var v = this.value;
		if ($.type(v) !== "string") v = "";
		if ((this.labelPosition == "left" || this.labelPosition == "right") && this.label !== "") {
			this.clsLabel += " M_LabelLeft";
			this.clsInput += " M_InputLeft";
		}
		if (
			this.labelWidth > 0 &&
			this.label !== "" &&
			(this.labelPosition == "left" || this.labelPosition == "right") &&
			this.inputType != "checkbox"
		) {
			if (this.labelWidth <= 1) {
				this.styleLabel += " width:" + this.labelWidth * 100 + "%;";
				this.styleInput += " width:" + (100 - this.labelWidth * 100) + "%;";
			} else {
				this.styleLabel += " width:" + this.labelWidth + "px;";
				this.styleInput += " width:calc(100% - " + this.labelWidth + "px);";
			}
		}

		var html = "";
		// var readOnly = "";
		var forattr = "";
		if (this.labelFocusInput) forattr = 'for="' + this.id + '"';
		// if (!this.editable) readOnly = "readonly";

		// var html = `<div class='M_HorizontalForm'></div></div>` ;

		html += `<div style="${this.styleGroup}" class="M_FormGroup ${this.clsGroup}">`;
		if (this.label !== "" && (this.labelPosition == "left" || this.labelPosition == "top"))
			html += `<label style="${this.styleLabel}" class="${this.clsLabel}" ${forattr}>${this.label}</label>`;
		html += `<div id="${this.id}" type="${this.inputType}" style="${this.styleInput}" class="M_Input ${
			this.clsInput
		}"><div id='${id1}' class='M_FloatLeft'></div><div id='${id2}' class='M_FloatLeft'></div>`;
		html += `</div>`;

		this.container.append(html);
		this.jEl = this.container.find(".M_HorizontalForm");

		var configDate = $.extend({}, this.configDateDef, this.configDate);
		var configHour = $.extend({}, this.configHourDef, this.configHour);
		configDate.container = $("#" + id1);
		configHour.container = $("#" + id2);
		$("#" + id1).width(configDate.containerWidth);
		$("#" + id2).width(configHour.containerWidth);
		this.formDate = new M_.Form.Date(configDate);
		this.formHour = new M_.Form.Hour(configHour);
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		this.formDate.setValue(val);
		this.formHour.setValue(val);
	}
	/**
	 * @param  {Boolean}
	 * @return {type}
	 */
	getValue(serialized = false) {
		var d1 = this.formDate.getValue();
		if (d1 !== "") {
			var d = moment(d1);
			var d2 = this.formHour.getValue();
			if (d2) {
				d.hours(d2.hours());
				d.minutes(d2.minutes()); //+d2.utcOffset()
				d.seconds(d2.seconds());
			}
			d.add(d.utcOffset(), "minutes").utcOffset(0);
			return d;
		}
		return d1;
	}
};

/**
 * Input combobox form ; display a comobobox
 * @class
 * @memberof! <global>
 * @extends M_.Form.Picker
 * @property {type} store
 * @property {type} modelKey
 * @property {type} modelValue
 * @property {type} mode
 * @property {type} editable
 * @property {type} useRawValue
 * @property {type} useZeroIfEmpty
 */
M_.Form.Combobox = class extends M_.Form.Picker {
	constructor(opts) {
		var defaults = {
			store: null,
			modelKey: "key",
			modelValue: "val",
			mode: "local",
			editable: true,
			useRawValue: false,
			useZeroIfEmpty: false
			// inputType: 'text',
			// _currentVal: ''
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);

		if (this.store.url === "") this.mode = "local";
		else this.mode = "remote";

		if (this.mode == "remote") {
			this.store.addListener("load", (store, models) => {
				// log("models", models, this.modelValue)
				this.createDropdown();
				this._createItemsFromStore();
				this.dropdown.show();
			});
		}

		// this.jEl.on('M_DropdownShow', (evt)=> {
		// 	if (!this.dropdown) this.createDropdown() ;
		// 	this.showDropdown() ;
		// }) ;
		if (!this.editable) {
			this.jEl.css("cursor", "pointer");
			this.jEl.on("click", evt => {
				this.showDropdown(evt);
			});
		}
	}
	_createItemsFromStore() {
		// log("_createItemsFromStore",this.store)
		var items = [];
		this.store.each(model => {
			// var val = "" ;
			// if (typeof this.modelValue === 'function') val = this.modelValue(model) ;
			// else val = model.get(this.modelValue) ;
			items.push({
				text: this._getVal(model),
				click: $.proxy(this.clickItemDropdown, this, model.get(this.modelKey))
			});
		});
		// if (!this.dropdown)
		this.createDropdown();
		this.dropdown.setItems(items);
	}
	/**
	 * @return {type}
	 */
	create() {
		super.create();
		// this.caret = $('<span class="fa fa-caret-down M_caret M_showonedit"></span>') ;
		// this.container.find('.M_editable').after(this.caret);
		// this.caret.click($.proxy(this.showDropdown, this)) ;
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	showDropdown(evt) {
		M_.Help.hideMHelp();
		if (evt) evt.stopPropagation();
		if (this.disabled) return;
		// if (!this.dropdown)

		if (this.mode == "local") {
			this.createDropdown();
			this._createItemsFromStore();
			this.dropdown.show();
		} else if (this.store.load()) {
			// this.createDropdown() ;
		}
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	clickItemDropdown(val) {
		this.setValue(val);
		let model = this.store.getRow(val);
		if (model) {
			this.trigger("itemclick", this, model);
		} else {
			this.trigger("itemclick", this, val);
		}
	}
	/**
	 * @return {type}
	 */
	getRawValue() {
		// return this.container.find('M_editable').text() ;
		return this.jEl.val();
	}
	/**
	 * @return {type}
	 */
	getValue() {
		if (this.useRawValue) return this.getRawValue();
		if (this.getRawValue() === "") this.value = "";
		if (this.value === "" && this.useZeroIfEmpty) return 0;
		return this.value;
	}
	/**
	 * @return {type}
	 */
	getValueAndRaw() {
		return { key: this.value, val: this.getRawValue() };
	}
	_getVal(model) {
		var val = "";
		if (typeof this.modelValue === "function") val = this.modelValue(model);
		else val = model.get(this.modelValue);
		return val;
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		// log("setValue",this.name, val)
		if (val === null) val = "";
		if (typeof val === "object") {
			let model = new this.store.model({ row: val });
			// log("setValue créé",model)
			this.setValueAndRawValue(val[this.modelKey], this._getVal(model));
			this.trigger("update", this, model);
		} else {
			this.value = val;
			let model = this.store.getRow(val);
			if (model) {
				this.setValueAndRawValue(val, this._getVal(model));
				this.trigger("update", this, model);
			} else {
				this.setRawValue(val);
				this.trigger("update", this, val);
			}
		}
	}
	/**
	 * @param {type}
	 * @param {type}
	 */
	setValueAndRawValue(val, rawVal) {
		this.value = val;
		this.setRawValue(rawVal);
	}
	/**
	 * @param {type}
	 */
	setRawValue(val) {
		var v = val;
		v = M_.Utils.strip_tags(v);
		v = M_.Utils.html_entity_decode(v);
		v = M_.Utils.trim(v);
		this.jEl.val(v);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	onKeyup(evt) {
		// log("this.keyField",this.keyField)
		var v = this.getRawValue();
		if (this.mode == "local") {
			this.showDropdown();
			var items = [];
			this.store.each(model => {
				// log("model",model)
				var val = this._getVal(model).toLowerCase();
				if (val.indexOf(v.toLowerCase()) >= 0) {
					items.push({
						text: this._getVal(model),
						click: $.proxy(this.clickItemDropdown, this, model.get(this.modelKey))
					});
				}
			});
			this.dropdown.setItems(items);
		} else {
			this.store.load({ query: v.toLowerCase() });
		}
		this.trigger("keyup", this, evt);
	}
};

/**
 * Input combobox form ; display a comobobox + a list of values
 * @class
 * @memberof! <global>
 * @extends M_.Form.Combobox
 */
M_.Form.ComboboxMulti = class extends M_.Form.Combobox {
	constructor(opts) {
		var defaults = {
			allowCreate: true
		};
		opts = opts ? opts : {};
		var optsTemp = $.extend({}, defaults, opts);
		super(optsTemp);

		this.jElForMulti = $("<div></div>");
		this.container.append(this.jElForMulti);
		this.container.append("<div class='M_Clear'></div>");
	}
	onEnterInput() {
		if (this.allowCreate) {
			this.addItemMulti("", this.getRawValue());
			this.setValueAndRawValue("", "");
		}
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	clickItemDropdown(val) {
		var model = this.store.getRow(val);
		var realval = this._getVal(model);
		// super.clickItemDropdown(val);
		// this.setValueAndRawValue('', '') ;
		// this.addItemMulti(val, realval) ;
		// this.setValue(val) ;
		// let model = this.store.getRow(val) ;
		// if (model) {
		// 	this.trigger('itemclick', this, model) ;
		// } else {
		// 	this.trigger('itemclick', this, val) ;
		// }
		this.setRawValue("");
		this.addItemMulti(val, realval);
	}
	/**
	 * @param {type}
	 * @param {type}
	 */
	addItemMulti(val, realval, deletable) {
		var idTemp = M_.Utils.id();
		var html =
			"<div class='M_ComboboxMultiItem selected' data-comboboxmultiitem=\"" + val + '" data-comboboxmultiitemval="' + realval + '">' + realval;
		if (deletable !== false) html += "&nbsp;<span class='fa fa-trash faa-pulse animated-hover' id='" + idTemp + "'></span>";
		html += " </div>";
		this.jElForMulti.append(html);
		if (deletable !== false) {
			$("#" + idTemp).click(evt => {
				$(evt.target)
					.closest(".M_ComboboxMultiItem")
					.remove();
				this.trigger("update", this, val);
			});
		}
	}
	/**
	 * @return {type}
	 */
	getValue() {
		var res = [];
		var me = this;
		this.jElForMulti.find(".M_ComboboxMultiItem").each(function() {
			var obj = {};
			obj[me.modelKey] = $(this).attr("data-comboboxmultiitem");
			obj[me.modelValue] = $(this).attr("data-comboboxmultiitemval");
			res.push(obj);
		});
		return res;
	}
	setValue(val) {
		this.reset();
		_.each(val, v => {
			this.addItemMulti(v[this.modelKey], v[this.modelValue], v.deletable);
		});
	}
	/**
	 * @return {type}
	 */
	reset() {
		if (this.jElForMulti) this.jElForMulti.empty();
	}
	/**
	 * @return {type}
	 */
	getValueAndRaw() {
		var res = [];
		this.jElForMulti.find(".M_ComboboxMultiItem").each(function() {
			res.push({
				val: $(this).attr("data-comboboxmultiitemval"),
				key: $(this).attr("data-comboboxmultiitem")
			});
		});
		return res;
	}
};

/**
 * A simple div to use in forms (no label)
 * @class
 * @memberof! <global>
 * @property {type} html
 */
M_.Form.Div = class {
	constructor(opts) {
		var defaults = {
			html: ""
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);
		this.container.append(this.html);
	}
};

/**
 * A simple div with label
 * @class
 * @memberof! <global>
 * @extends M_.Form.Input
 * @property {type} inputType
 */
M_.Form.Display = class extends M_.Form.Input {
	constructor(opts) {
		var defaults = {
			inputType: "none"
		};
		opts = opts ? opts : {};
		opts = $.extend({}, defaults, opts);
		super(opts);
	}
	/**
	 * @param {type}
	 */
	setValue(val) {
		// if (val=="") val=[] ;
		this.value = val;
		this.jEl.html(val);
	}
	/**
	 * @return {type}
	 */
	getValue() {
		return this.value;
	}
};

/**
 * A wysiwyg editor to use directly or in a textarea
 * @class
 * @memberof! <global>
 * @property {type} buttonsContainer
 * @property {type} buttons
 */
M_.Editor = class {
	constructor(opts) {
		var defaults = {
			buttonsContainer: null,
			uploadurl: "/upload",
			buttonsToDisplay: [
				"formatBlock",
				"bold",
				"italic",
				"justifyLeft",
				"justifyCenter",
				"justifyRight",
				"justifyFull",
				"list",
				"removeFormat",
				"|",
				"createLink",
				"table",
				"image",
				"templates",
				"|",
				"source"
			],
			buttons: [
				[
					"formatBlock",
					"Fomater paragraphe",
					"fa-font",
					"",
					"",
					[
						["formatH1", "H1", "", "execFormatBlock", "H1"],
						["formatH2", "H2", "", "execFormatBlock", "H2"],
						["formatH3", "H3", "", "execFormatBlock", "H3"],
						["formatH4", "H4", "", "execFormatBlock", "H4"],
						["formatH5", "H5", "", "execFormatBlock", "H5"],
						["formatP", "P", "", "execFormatBlock", "P"],
						["formatDIV", "DIV", "", "execFormatBlock", "DIV"]
					]
				],
				["bold", "Gras", "fa-bold", "execCommand", "bold"],
				["italic", "Italique", "fa-italic", "execCommand", "italic"],
				["justifyLeft", "Justifier à gauche", "fa-align-left", "execJustify", "Left"],
				["justifyCenter", "Justifier au centre", "fa-align-center", "execJustify", "Center"],
				["justifyRight", "Justifier à droite", "fa-align-right", "execJustify", "Right"],
				["justifyFull", "Justifier à gauche et à droite", "fa-align-justify", "execJustify", "Full"],
				[
					"list",
					"Liste numéroté ou avec puces",
					"fa-list-ol",
					"execCommand",
					"",
					[
						["insertorderedlist", "Liste numéroté", "fa-list-ol", "execCommand", "insertorderedlist"],
						["insertunorderedlist", "Liste avec puces", "fa-list-ul", "execCommand", "insertunorderedlist"],
						["outdent", "Outdent", "fa-outdent", "execCommand", "outdent"],
						["indent", "Indent", "fa-indent", "execCommand", "indent"]
					]
				],
				["removeFormat", "Effacer", "fa-eraser", "execCommand", "removeFormat"],
				"|",
				[
					"createLink",
					"Lien",
					"fa-link",
					"",
					"",
					[
						["insertorderedlist", "Créer un lien", "fa-link", "execLink", ""],
						["insertunorderedlist", "Enlever le lien", "fa-unlink", "execCommand", "unlink"]
					]
				],
				[
					"table",
					"Outils tableau",
					"fa-table",
					"",
					"",
					[
						["insertTable", "Insérer un tableau", "", "execInsertTable"],
						["insertTableColumn", "Nouvelle colonne", "", "execInsertTableColumn"],
						["insertTableRow", "Nouvelle rangée", "", "execInsertTableRow"],
						["editTable", "Edition tableau", "", "execEditTable"],
						["editCell", "Edition céllule", "", "execEditCell"]
					]
				],
				[
					"image",
					"Images",
					"fa-picture-o",
					"",
					"",
					[
						["newImage", "Nouvelle image", "fa-picture-o", "execNewImage", ""],
						["infoImage", "Information sur l'image", "fa-edit", "execImageInfo", ""],
						["imagesLibrary", "Bibliothèque d'images", "fa-windows", "execImageLibrary", ""],
						["imagesReplace", "Remplacer image", "fa-magic", "execImageReplace", ""]
					]
				],
				["templates", "Templates", "fa-file", "execTemplate", ""],
				"|",
				["source", "Code source", "fa-terminal", "execSource"]
			]
		};
		opts = opts ? opts : {};
		$.extend(this, defaults, opts);

		this.init();
	}
	/**
	 */
	init() {
		this.createButtons();

		if (this.container) {
			this.setContainer(this.container);
			this.path = $("<div class='M_FormEditor-Path'>&nbsp;</div>");
			this.container.after(this.path);
		}
		document.execCommand("styleWithCSS", false, false);
		document.execCommand("enableObjectResizing", false, false);
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	execJustify(what) {
		document.execCommand("justify" + what, false, null);
		this.caretMove();
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	execCommand(comm) {
		document.execCommand(comm, false, null);
		this.caretMove();
	}
	/**
	 * @return {type}
	 */
	execInsertTable() {
		document.execCommand(
			"insertHTML",
			false,
			"<table><tr><td>Cell 1.1</td><td>Cell 1.2</td></tr><tr><td>Cell 2.1</td><td>Cell 2.2</td></tr></table>"
		);
		this.caretMove();
	}
	/**
	 * @param  {type}
	 * @return {type}
	 */
	execFormatBlock(block) {
		document.execCommand("formatBlock", false, block.toLowerCase());
		this.caretMove();
	}
	/**
	 * @return {type}
	 */
	execInsertTableColumn() {
		var td = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("td");
		if (td.length && td.closest("#" + this.container.get(0).id).length) {
			var n = td
				.closest("tr")
				.find("td")
				.index(td);
			td
				.closest("table")
				.find("tr")
				.each(function() {
					$(this)
						.find("td")
						.eq(n)
						.after("<td>Nouvelle cellule</td>");
				});
		}
	}
	/**
	 * @return {type}
	 */
	execInsertTableRow() {
		var tr = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("tr");
		if (tr.length && tr.closest("#" + this.container.get(0).id).length) {
			// var n = tr.closest("table").find("tr").index(tr) ;
			var countTds = tr.find("td").length;
			var newTr = $("<tr></tr>");
			for (var i = 0; i < countTds; i++) {
				newTr.append("<td>Nouvelle cellule</td>");
			}
			tr.after(newTr);
		}
	}
	execTemplate(data, evt) {
		// this.trigger("clicktemplate", this);
		if (this.clickTemplate) this.clickTemplate(evt);
	}
	/**
	 * @return {type}
	 */
	execLink() {
		if (!this.winLink) {
			this.winLink = new class extends M_.Window {
				constructor() {
					super({
						modal: true,
						width: 400
					});
				}
				create() {
					var idBtSave = M_.Utils.id(),
						idBtCancel = M_.Utils.id(),
						idLink = M_.Utils.id(),
						idTarget = M_.Utils.id();
					this.html = `<div class="M_WindowContent">
						<div class="M_WindowHeader">
							<h1>Edition <b>d'un lien</b></h1>
						</div>
						<div class="M_WindowBody">
							<div id="${idLink}"></div>
							<div id="${idTarget}"></div>
						</div>
						<div class="M_WindowFooter">
							<div class="M_FloatRight">
								<button id="${idBtSave}" type="button" class="M_Button primary">Enregistrer</button>
							</div>
							<div class="M_FloatLeft">
								<button id="${idBtCancel}" type="button" class="M_Button">Annuler</button>
							</div>
						</div>
					</div>`;
					super.create();

					this.form = new M_.Form.Form({
						items: [
							{
								type: M_.Form.Text,
								name: "link",
								placeholder: "Lien",
								label: "Lien",
								labelPosition: "top",
								container: $("#" + idLink)
							},
							{
								type: M_.Form.Combobox,
								name: "target",
								allowEmpty: true,
								placeholder: "",
								label: "Cible",
								labelPosition: "top",
								container: $("#" + idTarget),
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									rows: [{ key: "", val: "Aucun" }, { key: "_blank", val: "_blank" }, { key: "_self", val: "_self" }]
								})
							}
						]
					});
					$("#" + idBtSave).click(() => {
						M_.Utils.restoreSelection();
						document.execCommand("createLink", false, this.form.find("link").getValue());
						if (this.form.find("target").getValue() !== "")
							$(document.getSelection().getRangeAt(0).commonAncestorContainer)
								.closest("a")
								.attr("target", this.form.find("target").getValue());
						this.hide();
					});
					$("#" + idBtCancel).click(() => {
						M_.Utils.restoreSelection();
						this.hide();
					});
				}
			}();
		}
		this.winLink.show();
	}
	/**
	 * @return {type}
	 */
	execSource() {
		if (!this.winSource) {
			this.winSource = new class extends M_.Window {
				constructor(containerEditor) {
					super({
						modal: true,
						width: 800
					});
					this.containerEditor = containerEditor;
				}
				create() {
					var idBtSave = M_.Utils.id(),
						idBtCancel = M_.Utils.id(),
						idCode = M_.Utils.id();
					this.html = `<div class="M_WindowContent">
						<div class="M_WindowHeader">
							<h1>Edition <b>du code source</b></h1>
						</div>
						<div class="M_WindowBody">
							<div id="${idCode}"></div>
						</div>
						<div class="M_WindowFooter">
							<div class="M_FloatRight">
								<button id="${idBtSave}" type="button" class="M_Button primary">Enregistrer</button>
							</div>
							<div class="M_FloatLeft">
								<button id="${idBtCancel}" type="button" class="M_Button">Annuler</button>
							</div>
						</div>
					</div>`;
					super.create();

					this.form = new M_.Form.Form({
						items: [
							{
								type: M_.Form.Textarea,
								name: "htmlcode",
								acceptTabulation: true,
								rows: 30,
								container: $("#" + idCode)
							}
						]
					});
					$("#" + idBtSave).click(() => {
						var html = this.form.find("htmlcode").getValue();
						this.containerEditor.html(html);
						this.hide();
					});
					$("#" + idBtCancel).click(() => {
						M_.Utils.restoreSelection();
						this.hide();
					});
				}
			}(this.container);
		}
		var html = this.container.html();
		this.winSource.form.find("htmlcode").setValue(html);
		this.winSource.show();
	}
	/**
	 * @return {type}
	 */
	execEditTable() {
		var table = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("table");
		if (!table.length || !table.closest("#" + this.container.get(0).id).length) return;
		if (!this.winEditTable) {
			this.winEditTable = new class extends M_.Window {
				constructor(containerEditor) {
					super({
						modal: true,
						width: 800,
						containerEditor: containerEditor
					});
				}
				create() {
					var idBtSave = M_.Utils.id(),
						idBtCancel = M_.Utils.id(),
						idwidth = M_.Utils.id(),
						idcellspacing = M_.Utils.id(),
						idcellpadding = M_.Utils.id(),
						idborder = M_.Utils.id(),
						idstyle = M_.Utils.id(),
						idid = M_.Utils.id(),
						idalign = M_.Utils.id();
					this.html = `<div class="M_WindowContent">
						<div class="M_WindowHeader">
							<h1>Edition <b>d'un tableau</b></h1>
						</div>
						<div class="M_WindowBody">
							<div id="${idwidth}"></div>
							<div id="${idcellspacing}"></div>
							<div id="${idcellpadding}"></div>
							<div id="${idborder}"></div>
							<div id="${idstyle}"></div>
							<div id="${idid}"></div>
							<div id="${idalign}"></div>
						</div>
						<div class="M_WindowFooter">
							<div class="M_FloatRight">
								<button id="${idBtSave}" type="button" class="M_Button primary">Enregistrer</button>
							</div>
							<div class="M_FloatLeft">
								<button id="${idBtCancel}" type="button" class="M_Button">Annuler</button>
							</div>
						</div>
					</div>`;
					super.create();

					this.form = new M_.Form.Form({
						itemsDefaults: {
							labelPosition: "left",
							labelWidth: 250
						},
						items: [
							{
								type: M_.Form.Text,
								label: "Largeur (px ou %)",
								name: "width",
								container: $("#" + idwidth)
							},
							{
								type: M_.Form.Number,
								label: "Espacement des cellules",
								name: "cellpadding",
								container: $("#" + idcellpadding)
							},
							{
								type: M_.Form.Number,
								label: "Marge des cellules",
								name: "cellspacing",
								container: $("#" + idcellspacing)
							},
							{
								type: M_.Form.Number,
								label: "Taille de la bordure",
								name: "border",
								container: $("#" + idborder)
							},
							{
								type: M_.Form.Text,
								label: "Style CSS",
								name: "style",
								container: $("#" + idstyle)
							},
							{
								type: M_.Form.Text,
								label: "ID",
								name: "id",
								container: $("#" + idid)
							},
							{
								type: M_.Form.Combobox,
								name: "align",
								allowEmpty: true,
								placeholder: "",
								label: "Alignement",
								container: $("#" + idalign),
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									rows: [
										{ key: "", val: "Aucun" },
										{ key: "left", val: "Gauche" },
										{ key: "center", val: "Centré" },
										{ key: "right", val: "Droite" }
									]
								})
							}
						]
					});
					$("#" + idBtSave).click(() => {
						this.currentTable.css({ width: this.form.find("width").getValue() });
						this.currentTable.attr("cellpadding", this.form.find("cellpadding").getValue());
						this.currentTable.attr("cellspacing", this.form.find("cellspacing").getValue());
						this.currentTable.attr("border", this.form.find("border").getValue());
						this.currentTable.attr("align", this.form.find("align").getValue());
						this.hide();
					});
					$("#" + idBtCancel).click(() => {
						M_.Utils.restoreSelection();
						this.hide();
					});
				}
				setCurrentTable(currentTable) {
					this.currentTable = currentTable;
					var sEl = this.currentTable.get(0).style;
					if (sEl.width !== "") this.form.find("width").setValue(this.currentTable.get(0).style.width);
					else this.form.find("width").setValue("");
					if (this.currentTable.attr("cellpadding")) this.form.find("cellpadding").setValue(this.currentTable.attr("cellpadding"));
					else this.form.find("cellpadding").setValue("");
					if (this.currentTable.attr("cellspacing")) this.form.find("cellspacing").setValue(this.currentTable.attr("cellspacing"));
					else this.form.find("cellspacing").setValue("");
					if (this.currentTable.attr("border")) this.form.find("border").setValue(this.currentTable.attr("border"));
					else this.form.find("border").setValue("");
					if (this.currentTable.attr("align")) this.form.find("align").setValue(this.currentTable.attr("align"));
					else this.form.find("align").setValue("");
				}
			}(this.container);
		}
		this.winEditTable.setCurrentTable(table);
		this.winEditTable.show();
	}
	/**
	 * @return {type}
	 */
	execEditCell() {
		var td = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("td");
		if (!td.length || !td.closest("#" + this.container.get(0).id).length) return;
		if (!this.winEditCell) {
			this.winEditCell = new class extends M_.Window {
				constructor(containerEditor) {
					super({
						modal: true,
						width: 800,
						containerEditor: containerEditor
					});
				}
				create() {
					var idBtSave = M_.Utils.id(),
						idBtCancel = M_.Utils.id(),
						idwidth = M_.Utils.id(),
						idalign = M_.Utils.id(),
						idvalign = M_.Utils.id(),
						idcolor = M_.Utils.id();
					this.html = `<div class="M_WindowContent">
						<div class="M_WindowHeader">
							<h1>Edition <b>d'une cellule</b></h1>
						</div>
						<div class="M_WindowBody">
							<div id="${idwidth}"></div>
							<div id="${idalign}"></div>
							<div id="${idvalign}"></div>
							<div id="${idcolor}"></div>
						</div>
						<div class="M_WindowFooter">
							<div class="M_FloatRight">
								<button id="${idBtSave}" type="button" class="M_Button primary">Enregistrer</button>
							</div>
							<div class="M_FloatLeft">
								<button id="${idBtCancel}" type="button" class="M_Button">Annuler</button>
							</div>
						</div>
					</div>`;
					super.create();

					this.form = new M_.Form.Form({
						itemsDefaults: {
							labelPosition: "left",
							labelWidth: 250
						},
						items: [
							{
								type: M_.Form.Text,
								label: "Largeur (px ou %)",
								name: "width",
								container: $("#" + idwidth)
							},
							{
								type: M_.Form.Combobox,
								name: "align",
								allowEmpty: true,
								placeholder: "",
								label: "Alignement",
								container: $("#" + idalign),
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									rows: [
										{ key: "", val: "Aucun" },
										{ key: "left", val: "Gauche" },
										{ key: "center", val: "Centré" },
										{ key: "right", val: "Droite" }
									]
								})
							},
							{
								type: M_.Form.Combobox,
								name: "valign",
								allowEmpty: true,
								placeholder: "",
								label: "Alignement vertical",
								container: $("#" + idvalign),
								store: new M_.Store({
									controller: this,
									model: M_.ModelKeyVal,
									rows: [
										{ key: "", val: "Aucun" },
										{ key: "top", val: "Haut" },
										{ key: "middle", val: "Milieu" },
										{ key: "bottom", val: "Bas" }
									]
								})
							},
							{
								type: M_.Form.Text,
								label: "Couleur",
								name: "color",
								container: $("#" + idwidth)
							}
						]
					});
					$("#" + idBtSave).click(() => {
						this.currentCell.css({ width: this.form.find("width").getValue() });
						this.currentCell.attr("align", this.form.find("align").getValue());
						this.currentCell.attr("valign", this.form.find("valign").getValue());
						this.currentCell.css({
							backgroundColor: this.form.find("color").getValue()
						});
						this.hide();
					});
					$("#" + idBtCancel).click(() => {
						M_.Utils.restoreSelection();
						this.hide();
					});
				}
				setCurrentCell(currentCell) {
					this.currentCell = currentCell;
					var sEl = this.currentCell.get(0).style;
					if (sEl.width !== "") this.form.find("width").setValue(this.currentCell.css("width"));
					else this.form.find("width").setValue("");
					if (this.currentCell.attr("align")) this.form.find("align").setValue(this.currentCell.attr("cellpadding"));
					else this.form.find("align").setValue("");
					if (this.currentCell.attr("valign")) this.form.find("valign").setValue(this.currentCell.attr("valign"));
					else this.form.find("valign").setValue("");
					if (sEl.backgroundColor !== "") this.form.find("color").setValue(this.currentCell.css("backgroundColor"));
					else this.form.find("color").setValue("");
				}
			}(this.container);
		}
		this.winEditCell.setCurrentCell(td);
		this.winEditCell.show();
	}
	/**
	 * @return {type}
	 */
	execNewImage() {
		if (!this.winNewImage) {
			this.winNewImage = new class extends M_.Window {
				constructor(containerEditor, uploadurl) {
					super({
						modal: true,
						width: 800,
						uploadurl: uploadurl,
						tabFilesToSend: []
					});
					this.containerEditor = containerEditor;
				}
				create() {
					var idBtSave = M_.Utils.id(),
						idBtCancel = M_.Utils.id(),
						idCode = M_.Utils.id();
					this.html = `<div class="M_WindowContent">
						<div class="M_WindowHeader">
							<h1>Envoyer <b>des images</b></h1>
						</div>
						<div class="M_WindowBody">
							<div id="${idCode}"></div>
							<div class="m_dropherenewimage" contenteditable><h2>Déposer ici un (ou des) fichier(s) de votre bureau</h2></div>
							<h2 style="margin-top:15px;">Ou choisissez les fichiers à envoyer</h2>
							<input type="file" class="m_fileinput" multiple />
							<div class="M_Clear"></div>
							<output class="m_fileoutput"></output>
							<div class="M_Clear"></div>
						</div>
						<div class="M_WindowFooter">
							<div class="M_FloatRight">
								<button id="${idBtSave}" type="button" class="M_Button primary">Enregistrer</button>
							</div>
							<div class="M_FloatLeft">
								<button id="${idBtCancel}" type="button" class="M_Button">Annuler</button>
							</div>
						</div>
					</div>`;
					super.create();

					this.jEl.find(".m_dropherenewimage").on(
						"dragover",
						$.proxy(function(e) {
							this.jEl.find(".m_dropherenewimage").css("background-color", "green");
						}, this)
					);
					this.jEl.find(".m_dropherenewimage").on(
						"dragleave",
						$.proxy(function(e) {
							this.jEl.find(".m_dropherenewimage").css("background-color", "white");
						}, this)
					);
					this.jEl.find(".m_dropherenewimage").on(
						"drop",
						$.proxy(function(e) {
							this.jEl.find(".m_dropherenewimage").css("background-color", "white");
							e.preventDefault();
							var files = e.originalEvent.dataTransfer.files;
							if (files.length === 0) return;
							for (var i = 0; i < files.length; i++) {
								var f = files[i];
								this.createThumbnail(f);
							}
						}, this)
					);

					$("#" + idBtSave).click(() => {
						var formData = new FormData();
						for (var i = 0; i < this.tabFilesToSend.length; i++) {
							formData.append("file" + i, this.tabFilesToSend[i]);
						}
						var xhr = new XMLHttpRequest();
						xhr.open("POST", this.uploadurl);
						var me = this;
						xhr.onload = function() {
							//console.log(xhr.responseText);
							var jsonResponse = JSON.parse(xhr.responseText);
							if (me.callbackSave) {
								var img = null;
								if (jsonResponse.tabRes.length > 0) img = jsonResponse.tabRes[0];
								me.callbackSave(img);
							} else {
								for (var i = 0; i < jsonResponse.tabRes.length; i++) {
									document.execCommand("insertImage", false, jsonResponse.tabRes[i]);
								}
							}
							me.hide();
							//document.execCommand("insertImage", false, jsonResponse.url) ;
							//me.caretMove() ;
						};
						xhr.upload.onprogress = function(e) {
							if (e.lengthComputable) {
								// var complete = (e.loaded / e.total * 100 | 0);
								//Mlog("complete",complete)
								//updates a <progress> tag to show upload progress
								//$('progress').val(complete);
							}
						};
						xhr.send(formData);
					});
					$("#" + idBtCancel).click(() => {
						M_.Utils.restoreSelection();
						this.hide();
					});
				}
				resetFileInput() {
					var control = this.jEl.find(".m_fileinput");
					this.jEl.find(".m_fileinput").replaceWith((control = control.clone(true)));
					this.jEl.find(".m_fileinput").on(
						"change",
						$.proxy(function(e) {
							var files = e.target.files;
							if (files.length === 0) return;
							for (var i = 0; i < files.length; i++) {
								var f = files[i];
								this.createThumbnail(f);
							}
						}, this)
					);
				}
				createThumbnail(f) {
					this.tabFilesToSend.push(f);
					var list = this.jEl.find(".m_fileoutput");
					var reader = new FileReader();
					var me = this;
					reader.onload = (function(theFile) {
						return function(e) {
							list.append(
								['<img style="margin:0 15px 15px 0" src="', e.target.result, '" title="', theFile.name, '" width="100" />'].join("")
							);
							me.center();
						};
					})(f);
					reader.readAsDataURL(f);
				}
			}(this.container, this.uploadurl);
		}
		this.winNewImage.resetFileInput();
		this.winNewImage.show();
	}
	/**
	 * @return {type}
	 */
	caretMove() {
		if (document.getSelection().rangeCount > 0) {
			var sel = $(document.getSelection().getRangeAt(0).commonAncestorContainer);
			var html = "";
			var jEls = sel.parentsUntil("#" + this.container.get(0).id);
			if (!sel.hasClass("M_FormEditor-Content")) {
				var tabTemp = [];
				jEls.each(function(ind, el) {
					if (el.tagName) tabTemp.push(el.tagName);
				});
				tabTemp.reverse();
				tabTemp.push("text");
				html = tabTemp.join(" &gt; ");
			}
			//html += sel.get(0).tagName ;
			html += "&nbsp;";
			this.path.html(html);
		}

		if (document.queryCommandValue("bold") == "true") this.buttonsContainer.find('button[m_id="bold"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="bold"]').removeClass("active");
		if (document.queryCommandValue("italic") == "true") this.buttonsContainer.find('button[m_id="italic"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="italic"]').removeClass("active");
		if (document.queryCommandValue("justifyLeft") == "true") this.buttonsContainer.find('button[m_id="justifyLeft"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="justifyLeft"]').removeClass("active");
		if (document.queryCommandValue("justifyRight") == "true") this.buttonsContainer.find('button[m_id="justifyRight"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="justifyRight"]').removeClass("active");
		if (document.queryCommandValue("justifyCenter") == "true") this.buttonsContainer.find('button[m_id="justifyCenter"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="justifyCenter"]').removeClass("active");
		if (document.queryCommandValue("justifyFull") == "true") this.buttonsContainer.find('button[m_id="justifyFull"]').addClass("active");
		else this.buttonsContainer.find('button[m_id="justifyFull"]').removeClass("active");
	}
	/**
	 * @return {type}
	 */
	createButtons() {
		var toolbar = $("<div>", { class: "M_Editor", role: "toolbar" });
		this.buttonsContainer.append(toolbar);
		// var currentGroup = $("<div>", {'class':'btn-group'}) ;
		// toolbar.append(currentGroup) ;
		for (var i = 0; i < this.buttons.length; i++) {
			let bt = this.buttons[i];
			if (_.indexOf(this.buttonsToDisplay, bt[0]) < 0) continue;
			if (bt[0] === "|") {
				// currentGroup = $("<div>", {'class':'btn-group'}) ;
				// toolbar.append(currentGroup) ;
			} else {
				let caret = "";
				if (bt[5]) caret = "<span class='fa fa-caret-down'></span>";
				let button = $("<button m_id='" + bt[0] + "'><i class='fa " + bt[2] + "'></i> " + caret + "</button>");
				toolbar.append(button);
				if (bt[5]) {
					button.click({ items: bt[5] }, evt => {
						evt.stopPropagation();
						M_.Utils.saveSelection();
						var items = [];
						_.each(evt.data.items, item => {
							let nameTemp = item[1];
							if (item[2] && item[2] !== "") nameTemp = "<i class='fa " + item[2] + "'></i>&nbsp;" + nameTemp;
							items.push({
								text: nameTemp,
								click: evt => {
									// evt.stopPropagation() ;
									// evt.preventDefault()
									M_.Utils.restoreSelection();
									this[item[3]](item[4]);
								}
							});
						});
						var dropdown = new M_.Dropdown({
							destroyOnHide: true,
							alignTo: $(evt.target).closest("button"),
							items: items
						});
						dropdown.show();
					});
				} else {
					button.click({ items: bt[5] }, evt => {
						this[bt[3]](bt[4], evt);
					});
				}
			}
		}
	}
	/**
	 * @param {type}
	 */
	setContainer(container) {
		this.container = container;
		this.container.on(
			"click",
			$.proxy(function(e) {
				this.container.prop("contenteditable", true);
				this.container.addClass("isEditing");
				if (!this.isStartedDrag) {
					$("#" + this.container.get(0).id + " .M_todelete").remove();
					this.imgDraggable = null;
				}
				this.caretMove();
			}, this)
		);
		this.container.on(
			"keyup",
			$.proxy(function(e) {
				this.caretMove();
			}, this)
		);
		this.container.on(
			"keydown",
			$.proxy(function(e) {
				this.caretMove();
			}, this)
		);
		this.container.on(
			"dragstart",
			$.proxy(function(e) {
				$("#" + this.container.get(0).id + " .M_todelete").remove();
			}, this)
		);
		$(document).on(
			"dblclick",
			"#" + this.container.get(0).id + " img",
			$.proxy(function(e) {
				this.execImageInfo();
			}, this)
		);
		$(document).on(
			"drop",
			"#" + this.container.get(0).id + " img",
			$.proxy(function(e) {
				console.warn("drop on image", e);
			}, this)
		);
		$(document).click(
			$.proxy(function(e) {
				if ($(e.target).closest("#" + this.container.get(0).id + ", #" + this.buttonsContainer.get(0).id).length === 0) {
					$("#" + this.container.get(0).id + " .M_todelete").remove();
					//this.container.prop("contenteditable", false) ;
					this.container.removeClass("isEditing");
				}
			}, this)
		);
		this.container.on(
			"drop",
			$.proxy(e => {
				var files = e.originalEvent.dataTransfer.files;
				if (files.length === 0) return;

				e.preventDefault();
				if (!this.container.prop("contenteditable")) {
					M_.Dialog.alert("Information", "Merci de cliquer d'abord l'endroit où vous souhaitez insérer l'image");
					return;
				}
				this.container.prop("contenteditable", true);
				var formData = new FormData();
				formData.append("file0", files[0]);
				var xhr = new XMLHttpRequest();
				xhr.open("POST", this.uploadurl);
				var me = this;
				xhr.onload = function() {
					//console.log(xhr.responseText);
					var jsonResponse = JSON.parse(xhr.responseText);
					document.execCommand("insertImage", false, jsonResponse.tabRes[0]);
					me.caretMove();
				};
				xhr.upload.onprogress = function(e) {
					if (e.lengthComputable) {
						// var complete = (e.loaded / e.total * 100 | 0);
						//updates a <progress> tag to show upload progress
						//$('progress').val(complete);
					}
				};
				xhr.send(formData);
			}, this)
		);
	}
};

export var M_ = M_;

$.postJSON = function(url, data, callback) {
	return $.ajax({
		type: "POST",
		url: url,
		contentType: "application/json",
		data: JSON.stringify(data),
		dataType: "json",
		success: callback
	});
};

// (function(factory) {
// 	if (typeof define === 'function' && define.amd) {
// 		define([ 'jquery' ], factory);
// 	}
// 	else {
// 		factory(jQuery);
// 	}
// })(function($) {

// ;;

// var defaults = {
// } ;

// var md = $.m_draggable = { version: "0.1.2" };

// // classic jQuery plugin ; I don't comment
// $.fn.m_draggable = function(options) {
// 	var args = Array.prototype.slice.call(arguments, 1);
// 	var res = this;
// 	this.each(function(i, _element) {
// 		var element = $(_element);
// 		var draggable = element.data('m_draggable');
// 		var singleRes;
// 		if (typeof options === 'string') {
// 			if (draggable && $.isFunction(draggable[options])) {
// 				singleRes = draggable[options].apply(draggable, args);
// 				if (!i) res = singleRes;
// 				if (options === 'destroy') element.removeData('m_draggable');
// 			}
// 		} else if (!draggable) { // don't initialize twice
// 			draggable = new m_draggable(element, options);
// 			element.data('m_draggable', draggable);
// 			draggable.reload();
// 		}
// 	});
// 	return res;
// };

// // More interesting...
// function m_draggable(element, instanceOptions) {
// 	var me = this;

// 	var opts = $.extend(true, {}, defaults, instanceOptions) ;

// 	// Exports
// 	// me.render = render ;
// 	me.sayHello = sayHello ;
// 	me.reload = reload ;
// 	me.opts = opts ;

// 	// local variables

// 	// for debug
// 	function log() {
// 		if (window.console) console.log.apply(window.console, arguments) ;
// 	}

// 	function reload() {
// // 		jElHandle.mousedown({el:el}, $.proxy(function(evt) {
// // 			this.dragEl = evt.data.el ;
// // 			this.dragStart = true ;
// // 			this.dragDiff = {top: evt.pageY-this.dragEl.offset().top, left: evt.pageX-this.dragEl.offset().left}
// // 		}, this)) ;
// // 		$(document).mouseup({el:el}, $.proxy(function() {
// // 			this.dragStart = false ;
// // 		}, this)) ;
// // 		$(document).mousemove({el:el}, $.proxy(function(evt) {
// // 			if (this.dragStart && this.dragEl == evt.data.el) {
// // 				var top = evt.pageY ;
// // 				var left = evt.pageX ;
// // 				this.dragEl.offset({top: top-this.dragDiff.top, left: left-this.dragDiff.left}) ;
// // 			}
// // 		}, this)) ;
// 	}

// 	// don't create / re-create dom, resize all components
// 	function redraw() {
// 		render() ;
// 	}
// 	function sayHello() {
// 		log("hello") ;
// 	}

// }

// // mg._startDrag = false ;

// ;;

// });

// M_.Draggable = class {
// 	constructor(el, jElHandle=null, jElHelper=null) {
// 		//tabDraggable.push({el:el, jElHandle:jElHandle}) ;
// 		jElHandle.mousedown({el:el}, $.proxy(function(evt) {
// 			this.dragEl = evt.data.el ;
// 			this.dragStart = true ;
// 			this.dragDiff = {top: evt.pageY-this.dragEl.offset().top, left: evt.pageX-this.dragEl.offset().left}
// 		}, this)) ;
// 		$(document).mouseup({el:el}, $.proxy(function() {
// 			this.dragStart = false ;
// 		}, this)) ;
// 		$(document).mousemove({el:el}, $.proxy(function(evt) {
// 			if (this.dragStart && this.dragEl == evt.data.el) {
// 				var top = evt.pageY ;
// 				var left = evt.pageX ;
// 				this.dragEl.offset({top: top-this.dragDiff.top, left: left-this.dragDiff.left}) ;
// 			}
// 		}, this)) ;
// 	}
