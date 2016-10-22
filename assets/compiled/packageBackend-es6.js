/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _M_ = __webpack_require__(1);
	
	var _Home = __webpack_require__(2);
	
	_M_.M_.registerModule('Home', _Home.Home);
	
	// import {Services} from 'js6/libs/Services.js' ;
	// import {Shared} from 'js6/libs/Shared.js' ;
	
	// var M_ = System.get('M_/M_') ;
	// var Contacts = System.get('controllers/Contacts').Contacts ;
	// var dav = new M_.David() ;
	// dav.print() ;
	// // Contacts.init() ;
	// Contacts.init() ;
	// console.log("Contacts",Contacts)
	
	// log("App",M_.App)
	
	_.M_ = _M_.M_;
	// _.Services = M_.App.Services = Services ;
	// _.Shared = Shared ;
	// _.Utils = M_.Utils ;
	
	
	moment.locale('fr');
	
	var modules = [{ key: 'Home', icon: 'fa-bell faa-ring', label: "Accueil", right: '' }, { key: 'Contacts', icon: 'fa-user', label: "Contacts", right: 'contacts' }, { key: 'Expenses', icon: 'fa-user-plus', label: "Notes de frais", right: 'expenses' }, { key: 'Vacation', icon: 'fa-plane', label: "Absences", right: 'vacation' }, { key: 'VacationAdmin', icon: 'fa-plane', label: "Absences admin", right: 'vacation_admin' }, { key: 'Reports', icon: 'fa-globe', label: "Rapport hebdo", right: 'reports' }, { key: 'ReportsAdmin', icon: 'fa-globe', label: "Rapport hebdo admin", right: 'reports_admin' }, { key: 'MonthlyReports', icon: 'fa-globe', label: "Rapport mensuel", right: 'monthlyreports' }, { key: 'MonthlyReportsAdmin', icon: 'fa-globe', label: "Rapport mensuel admin", right: 'monthlyreports_admin' }, { key: 'Candidates', icon: 'fa-user-plus', label: "Module DRH", right: 'humanresources' }, { key: 'Commercials', icon: 'fa-user-plus', label: "Paliers ch. d'aff", right: 'commercials' }, { key: 'Preferences', icon: 'fa-gears', label: "Préférences", right: '' }, { key: 'Search', icon: 'fa-gears', label: "Rechercher", right: '', hideInMenu: true }];
	
	_M_.M_.App.create({
		name: 'PuP',
		container: $('#main'),
		defaultController: 'Home',
		inDevelopment: true,
		useWebsocket: false,
		isOnline: false,
		moduleChange: function moduleChange(module, oldModule) {
			if (module != 'Search') $('#mainsearchinput').val('');
			$("#mainnavcontent li").removeClass('over');
			$("#mainnavcontent .menumodule_" + module).addClass('over');
		},
		beforeModuleChange: function beforeModuleChange(module, oldModule) {
			var m = _.find(modules, { key: module });
			// console.log("module, oldModule", module, oldModule, m);
			// if (m.right==='' || Services.getUserRight(m.right)) return true ;
			return true;
		}
	}).beforeReady(function (next) {
	
		this.drawMenus = function () {
	
			var html = "";
			_.each(modules, function (module) {
				if (module.hideInMenu) return;
				// if (module.right==='' || Services.getUserRight(module.right)) {
				html += '<a href="#/' + module.key + '"><li class="menumodule_' + module.key + '"><span class=""></span><p>' + module.label + '</p><div class="M_Clear"></div></li></a>';
				// }
			});
			$("#mainnavcontent").html(html);
		};
		this.loadSessionInfos = function () {
			var _this = this;
	
			$.ajax({
				url: "/ws/infos",
				type: 'GET',
				contentType: 'application/json',
				data: JSON.stringify({}),
				dataType: 'json',
				success: function success(data) {
					_.Session = _M_.M_.App.Session = data.data;
					// log("M_.App.Session",M_.App.Session);
					// console.log("title", Services.getUserRight('contacts'));
					_this.drawMenus();
	
					if (next) next();
				}
			});
		};
		this.loadSessionInfos();
	}).ready(function () {
	
		// Services.updateDates() ;
	
		// $("#loginInfosBt_role").html(_.result(_.find(Shared.getRoles(), {key:M_.App.Session.co_type}), 'val') + " " + M_.App.Session.ag_id.ag_name) ;
	
		$('#loginInfosBt').click(function (evt) {
			evt.stopPropagation();
			var dd = new _M_.M_.Dropdown({
				autoShow: true,
				alignTo: $('#loginInfosBt'),
				items: [{
					text: "Modifier mon compte",
					click: function click() {
						_M_.M_.App.open('Contacts', 'show', _M_.M_.App.Session.co_id);
					}
				}, {
					text: "Préférences",
					click: function click() {
						_M_.M_.App.open('Preferences', 'index');
					}
				}, {
					text: "Se déconnecter",
					click: function click() {
						window.open('/logout', '_self');
					}
	
				}]
			});
			dd.show();
		});
	
		$(".mainlogo").click(function () {
			_M_.M_.App.open('Home');
		});
	
		// Services._updateBadgeActions() ;
		// $("#loginAlert").click((evt)=> {
		// 	evt.stopPropagation() ;
		// 	var items = [];
		// 	_.each(M_.App.Session.todos, (todo)=> {
		// 		let f = M_.Utils.findInArray(Shared.getTodoTypes(), todo.td_type) ;
		// 		let d = moment(todo.co_id_user.updatedAt).valueOf() ;
		// 		let txt = `
		// 			<div class='M_ImgRound loginAlertLiContent2' style="background-image:url(/bp/login/avatar/35/35/${todo.co_id_user.co_id}?d=${d})"></div>
		// 			<div class='loginAlertLiContent'>
		// 				<div>${f.val}</div>
		// 				<div class='loginAlertLiLittle'>${Services.getTextForTodo(todo)}</div>
		// 			</div>
		// 			<div class='M_Clear'></div>
		// 		` ;
		// 		items.push({
		// 			text: txt,
		// 			todo: todo,
		// 			click: (evt, item)=> {
		// 				Services.redirectForTodo(item.todo) ;
		// 			}
		// 		}) ;
		// 	}) ;
		// 	var dd = new M_.Dropdown({
		// 		autoShow: true,
		// 		alignTo: $("#loginAlert"),
		// 		itemsClass: 'loginAlertLi',
		// 		items: items
		// 	}) ;
		// 	dd.show() ;
		// }) ;
	
	
		// $('#mainsearchinput').keyup((evt)=> {
		// 	M_.Utils.delay(()=> {
		// 		M_.App.open('Search', 'draw') ;
		// 	}, 200, "delayMainSearch");
		//
		// }) ;
		new _M_.M_.Help({
			text: "Rechercher dans les contacts, les absences, les candidats",
			attachedObj: $('#mainsearchinput')
		});
	
		this.appIsFullScreen = false;
		$('#loginFullScreen').click(function () {
			_M_.M_.Utils.toggleAppFullScreen();
		});
		new _M_.M_.Help({
			text: "Afficher l'application en plein écran",
			attachedObj: $('#loginFullScreen')
		});
	
		function hideMenu() {
			if ($('#mainnav').is(':visible')) {
				var l = -1 * $('#mainnav').width();
				$('#mainnav').transition({
					left: l
				}, 500, function () {
					$('#mainnav').hide();
				});
				$('#mainbtmenus span').addClass('fa-reorder');
				$('#mainbtmenus span').removeClass('fa-close');
			}
		}
		function showMenu() {
			if (!$('#mainnav').is(':visible')) {
				$('#mainnav').css('left', -1 * $('#mainnav').width()).show().transition({
					left: 0
				}, 500, function () {});
				$('#mainbtmenus span').removeClass('fa-reorder');
				$('#mainbtmenus span').addClass('fa-close');
			}
		}
		$('#mainbtmenus').mouseenter(showMenu);
		$(document).on('click', '#mainbtmenus', function (evt) {
			evt.stopPropagation();
			if (!$('#mainnav').is(':visible')) showMenu();else hideMenu();
		}).on('click', hideMenu);
	
		if (!window.location.hash && _M_.M_.Utils.getCookie('mwjurl')) window.open('#/' + _M_.M_.Utils.getCookie('mwjurl'), '_self');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

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
	
	
	'use strict';
	
	// import {$} from "./../js/jquery";
	// import {moment} from "./../js/moment-with-locales";
	// console.log("moment",moment);
	//
	// var jquery = $ ;
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	window.log = function () {
		if (window.console) {
			console.log.apply(window.console, arguments);
		}
	};
	
	moment().localeData('fr');
	moment().utcOffset(0);
	console.log("moment().utcOffset()", moment().utcOffset());
	
	Array.prototype.m_remove = function (val) {
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
	exports.M_ = M_ = {
		_registeredModules: {}
	};
	
	M_.registerModule = function (name, module) {
		console.log("name,module", name, module);
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
	M_.App = new (function () {
		/**
	  * Already instancied
	  * @return {[type]} [description]
	  */
		function _class() {
			_classCallCheck(this, _class);
		}
		/**
	  * To document
	  * @param {type} opts
	  */
	
	
		_createClass(_class, [{
			key: 'create',
			value: function create(opts) {
				var _this = this;
	
				this.defaults = {
					inDevelopment: true,
					useWebsocket: false,
					name: "",
					routes: {},
					defaultController: 'Home',
					tabController: [],
					tabOutlets: {},
					container: null,
					currentController: null,
					namespace: '',
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
					controllersDir: 'app/controllers/',
					moduleChange: null,
					beforeModuleChange: null
				};
				$.extend(this, this.defaults, opts);
	
				$(window).resize(function () {
					if (_this.M_tsResize) window.clearTimeout(_this.M_tsResize);
					_this.M_tsResize = window.setTimeout(function () {
						_this.resize();
					}, 300);
				});
	
				if ("onhashchange" in window) {
					$(window).on('hashchange', function () {
						_this._hashChanged();
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
	
				$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
					//log("c un ajax 1 ",arguments)
					_this.onBeforeAllAjax(options, originalOptions, jqXHR);
					jqXHR.always(function (data) {
						//log("c un ajax 2 ",arguments)
						_this.onAfterAllAjax(data, options, originalOptions, jqXHR);
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
	
		}, {
			key: 'onBeforeAllAjax',
			value: function onBeforeAllAjax(options, originalOptions, jqXHR) {}
			/**
	   * To document
	   * @param {Object} data
	   * @param {Object} options
	   * @param {Object} originalOptions
	   * @param {jqXHR} jqXHR
	   */
	
		}, {
			key: 'onAfterAllAjax',
			value: function onAfterAllAjax(data, options, originalOptions, jqXHR) {}
			/**
	   * To document
	   * @return {M_.App}
	   */
	
		}, {
			key: 'resize',
			value: function resize() {
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
	
		}, {
			key: 'beforeReady',
			value: function beforeReady(fn) {
				this._beforeReady = fn;
				return this;
			}
			/**
	   * @param  {Function}
	   * @return {M_.App}
	   */
	
		}, {
			key: 'ready',
			value: function ready(fn) {
				var _this2 = this;
	
				// log("ready")
				this._ready = fn;
				M_.Help.createMHelp();
				if (this._beforeReady) {
					this._beforeReady(function () {
						_this2._reallyReady();
					});
				} else this._reallyReady();
				return this;
			}
		}, {
			key: '_reallyReady',
			value: function _reallyReady() {
				var _this3 = this;
	
				if (document.readyState == "complete") {
					this._ready();
					this._hashChanged();
				} else {
					$(document).ready(function () {
						_this3._ready();
						_this3._hashChanged();
					});
				}
			}
			/**
	   * Open a page
	   * @param  {String} module
	   * @param  {String} action
	   * @return {M_.App}
	   */
	
		}, {
			key: 'open',
			value: function open(module, action) {
				// log("open", this.currentController)
				this._lastHashBis = window.location.hash;
				var url = "";
				var args = [];
				this.executeNextAction = true;
				if (module.substring(0, 1) == '/') {
					url = "#" + module;
				} else {
					for (var i = 0; i < arguments.length; i++) {
						if (arguments[i] !== false) args.push(arguments[i]);else this.executeNextAction = false;
					}
					url = '#/' + args.join('/');
				}
				//log("module,url,args",module, ";", url,";",args)
				if (url == window.location.hash) {
					this._hashChanged();
				} else {
					window.open(url, '_self');
				}
				return this;
			}
		}, {
			key: '_getHashArgs',
			value: function _getHashArgs() {
				var hash = window.location.hash.substring(2, window.location.hash.length);
				var t = hash.split('/');
				return t;
			}
		}, {
			key: '_hashChanged',
			value: function _hashChanged() {
				var _this4 = this;
	
				var args = this._getHashArgs();
				var module = this.defaultController;
				if (args[0] && args[0] !== '') module = args[0];
				var justCreated = false;
				if (this[module] === undefined) {
					// var Mod = System.get('js6/controllers/'+module+".js")[module] ;
					// this[module] = new Mod({controllerName:module, tpl:JST[module]}) ;
					console.log("JST", JST, M_._registeredModules);
					// import {mymod} from './'+module+'.js' ;
					this[module] = new M_._registeredModules[module]({ controllerName: module, tpl: JST[module] });
					this.tabController.push(this[module]);
					justCreated = true;
				}
				this[module].resolve(function (ok) {
					if (ok) {
						if (_this4.beforeModuleChange) {
							var ok2 = _this4.beforeModuleChange(module, _this4.lastModule);
							if (ok2 !== false) _this4.__hashChanged(justCreated);
						} else _this4.__hashChanged(justCreated);
					}
				});
			}
		}, {
			key: '__hashChanged',
			value: function __hashChanged(justCreated) {
	
				var tabController = this.tabController;
				for (var i = 0; i < tabController.length; i++) {
					tabController[i].onExit();
				}
	
				// if (this._hashIsLoading) return ;
				// log("_hashChanged9")
				var args = this._getHashArgs();
				var module = this.defaultController;
				if (args[0] && args[0] !== '') module = args[0];
				var action = '';
				if (args[1] && args[1] !== '') action = args[1];
				// log("module2",module)
	
				// log("currentController", this.currentController)
				if (this.currentController && this.lastModule !== module) {
					var currentControllerNameSaved = this.currentController.controllerName;
					$("#part_" + this.currentController.controllerName).css('left', 0).css('z-index', 1).css('transform-origin', '5% 50%').transition({
						// x: $(window).width(),
						perspective: '1000px',
						rotateY: '50deg',
						scale: 0.7,
						opacity: 0.3
					}, 500, function (el) {
						$("#part_" + currentControllerNameSaved).hide();
						// this._hashChangedMore() ;
					});
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
							$("#part_" + tabController[i].controllerName).css('z-index', 0);
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
	
				if (action === '') action = this[module].defaultAction;
				if (!this[module][action + 'Action']) {
					log("You must define function '" + action + 'Action' + "()' in " + this[module].controllerName + " controller");
					this.open(module, "index");
				} else {
					args.splice(0, 2);
					this[module][action + 'Action'].apply(this[module], args);
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
	
		}, {
			key: 'renderMustacheTo',
			value: function renderMustacheTo(container, tpl) {
				var tplData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
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
	
		}, {
			key: 'renderMustache',
			value: function renderMustache(tpl) {
				var tplData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
				//, tplPartials={}
				// console.log("tplPartials",tplPartials)
				// console.log('_.templateSettings.imports',_.templateSettings.imports)
				// console.log("tpl",tpl);
				var template = tpl(tplData);
				return template;
			}
		}]);
	
		return _class;
	}())();
	
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
	M_.Controller = function () {
		/**
	  * Generally, you don't need to extend this class. Extend create method.
	  * @param  {object} opts Configuration object
	  */
		function _class2(opts) {
			_classCallCheck(this, _class2);
	
			var defaults = {
				controller: "",
				controllerName: "",
				controllerSrc: null,
				defaultAction: 'index',
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
	
	
		_createClass(_class2, [{
			key: 'init',
			value: function init() {}
			/**
	   * @param  {Function}
	   */
	
		}, {
			key: 'resolve',
			value: function resolve(next) {
				next(true);
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'renderTemplate',
			value: function renderTemplate() {
				if (this.tpl) {
					this.jEl = M_.App.renderMustacheTo(M_.App.container, this.tpl, this.tplData, this.tplPartials);
					this.jEl.attr("id", "part_" + this.controllerName);
					this.jEl.addClass('M_part');
				}
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'render',
			value: function render() {}
			/**
	   * To document
	   */
	
		}, {
			key: 'indexAction',
			value: function indexAction() {}
			/**
	   * To document
	   */
	
		}, {
			key: 'onResize',
			value: function onResize() {}
			/**
	   * To document
	   */
	
		}, {
			key: 'onExit',
			value: function onExit() {}
			/**
	   * To document
	   */
	
		}, {
			key: 'onControllerChange',
			value: function onControllerChange() {}
			/**
	   * Extend this method to initialize your UI
	   */
	
		}, {
			key: 'doLayout',
			value: function doLayout() {}
			/**
	   * This method is called each time the controller is shown.
	   * @param  {boolean} firstTime True when this function is called for the first time.
	   */
	
		}, {
			key: 'show',
			value: function show(firstTime) {}
		}, {
			key: '_onShow',
			value: function _onShow(anim) {
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
				.css('transform', 'rotateY(0deg)').css('transform', 'perspective(0)').css('opacity', 1).css('z-index', 2).show();
	
				if (anim) {
					// console.log("anim");
					this.jEl.css('left', $(window).width()).transition({
						left: 0,
						delay: 100
					}, 500, function () {
						// console.log("finit");
					});
				} else {
					this.jEl.css('left', 0);
				}
			}
			/**
	   * onShow description
	   * @param  {Boolean} firstTime [description]
	   */
	
		}, {
			key: 'onShow',
			value: function onShow(firstTime) {}
			/**
	   * hide description
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				if (this.jEl) this.jEl.hide();
			}
		}]);
	
		return _class2;
	}();
	
	/**
	 * Usefull methods for manipulate date, string, paths, etc...
	 * @memberof! <global>
	 */
	M_.Utils = function () {
		function _class3() {
			_classCallCheck(this, _class3);
		}
	
		_createClass(_class3, null, [{
			key: 'isEventSupported',
			value: function isEventSupported(eventName) {
				var TAGNAMES = {
					'select': 'input', 'change': 'input', 'search': 'input',
					'submit': 'form', 'reset': 'form',
					'error': 'img', 'load': 'img', 'abort': 'img'
				};
				var el = document.createElement(TAGNAMES[eventName] || 'div');
				eventName = 'on' + eventName;
				var isSupported = eventName in el;
				if (!isSupported) {
					el.setAttribute(eventName, 'return;');
					isSupported = typeof el[eventName] == 'function';
				}
				el = null;
				return isSupported;
			}
		}, {
			key: 'humanFileSizeString',
			value: function humanFileSizeString(fileSizeInBytes) {
	
				var i = -1;
				var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
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
	
		}, {
			key: 'isArray',
			value: function isArray(obj) {
				return $.isArray(obj);
			}
		}, {
			key: 'get_html_translation_table',
			value: function get_html_translation_table(table, quote_style) {
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
				constMappingTable[0] = 'HTML_SPECIALCHARS';
				constMappingTable[1] = 'HTML_ENTITIES';
				constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
				constMappingQuoteStyle[2] = 'ENT_COMPAT';
				constMappingQuoteStyle[3] = 'ENT_QUOTES';
	
				useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
				useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
	
				if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
					throw new Error('Table: ' + useTable + ' not supported');
					// return false;
				}
	
				entities['38'] = '&amp;';
				if (useTable === 'HTML_ENTITIES') {
					entities['160'] = '&nbsp;';
					entities['161'] = '&iexcl;';
					entities['162'] = '&cent;';
					entities['163'] = '&pound;';
					entities['164'] = '&curren;';
					entities['165'] = '&yen;';
					entities['166'] = '&brvbar;';
					entities['167'] = '&sect;';
					entities['168'] = '&uml;';
					entities['169'] = '&copy;';
					entities['170'] = '&ordf;';
					entities['171'] = '&laquo;';
					entities['172'] = '&not;';
					entities['173'] = '&shy;';
					entities['174'] = '&reg;';
					entities['175'] = '&macr;';
					entities['176'] = '&deg;';
					entities['177'] = '&plusmn;';
					entities['178'] = '&sup2;';
					entities['179'] = '&sup3;';
					entities['180'] = '&acute;';
					entities['181'] = '&micro;';
					entities['182'] = '&para;';
					entities['183'] = '&middot;';
					entities['184'] = '&cedil;';
					entities['185'] = '&sup1;';
					entities['186'] = '&ordm;';
					entities['187'] = '&raquo;';
					entities['188'] = '&frac14;';
					entities['189'] = '&frac12;';
					entities['190'] = '&frac34;';
					entities['191'] = '&iquest;';
					entities['192'] = '&Agrave;';
					entities['193'] = '&Aacute;';
					entities['194'] = '&Acirc;';
					entities['195'] = '&Atilde;';
					entities['196'] = '&Auml;';
					entities['197'] = '&Aring;';
					entities['198'] = '&AElig;';
					entities['199'] = '&Ccedil;';
					entities['200'] = '&Egrave;';
					entities['201'] = '&Eacute;';
					entities['202'] = '&Ecirc;';
					entities['203'] = '&Euml;';
					entities['204'] = '&Igrave;';
					entities['205'] = '&Iacute;';
					entities['206'] = '&Icirc;';
					entities['207'] = '&Iuml;';
					entities['208'] = '&ETH;';
					entities['209'] = '&Ntilde;';
					entities['210'] = '&Ograve;';
					entities['211'] = '&Oacute;';
					entities['212'] = '&Ocirc;';
					entities['213'] = '&Otilde;';
					entities['214'] = '&Ouml;';
					entities['215'] = '&times;';
					entities['216'] = '&Oslash;';
					entities['217'] = '&Ugrave;';
					entities['218'] = '&Uacute;';
					entities['219'] = '&Ucirc;';
					entities['220'] = '&Uuml;';
					entities['221'] = '&Yacute;';
					entities['222'] = '&THORN;';
					entities['223'] = '&szlig;';
					entities['224'] = '&agrave;';
					entities['225'] = '&aacute;';
					entities['226'] = '&acirc;';
					entities['227'] = '&atilde;';
					entities['228'] = '&auml;';
					entities['229'] = '&aring;';
					entities['230'] = '&aelig;';
					entities['231'] = '&ccedil;';
					entities['232'] = '&egrave;';
					entities['233'] = '&eacute;';
					entities['234'] = '&ecirc;';
					entities['235'] = '&euml;';
					entities['236'] = '&igrave;';
					entities['237'] = '&iacute;';
					entities['238'] = '&icirc;';
					entities['239'] = '&iuml;';
					entities['240'] = '&eth;';
					entities['241'] = '&ntilde;';
					entities['242'] = '&ograve;';
					entities['243'] = '&oacute;';
					entities['244'] = '&ocirc;';
					entities['245'] = '&otilde;';
					entities['246'] = '&ouml;';
					entities['247'] = '&divide;';
					entities['248'] = '&oslash;';
					entities['249'] = '&ugrave;';
					entities['250'] = '&uacute;';
					entities['251'] = '&ucirc;';
					entities['252'] = '&uuml;';
					entities['253'] = '&yacute;';
					entities['254'] = '&thorn;';
					entities['255'] = '&yuml;';
				}
	
				if (useQuoteStyle !== 'ENT_NOQUOTES') {
					entities['34'] = '&quot;';
				}
				if (useQuoteStyle === 'ENT_QUOTES') {
					entities['39'] = '&#39;';
				}
				entities['60'] = '&lt;';
				entities['62'] = '&gt;';
	
				// ascii decimals to real symbols
				for (decimal in entities) {
					if (entities.hasOwnProperty(decimal)) {
						hash_map[String.fromCharCode(decimal)] = entities[decimal];
					}
				}
	
				return hash_map;
			}
		}, {
			key: 'html_entity_decode',
			value: function html_entity_decode(string, quote_style) {
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
				    symbol = '',
				    tmp_str = '',
				    entity = '';
				tmp_str = string.toString();
	
				if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
					return false;
				}
	
				// fix &amp; problem
				// http://phpjs.org/functions/get_html_translation_table:416#comment_97660
				delete hash_map['&'];
				hash_map['&'] = '&amp;';
	
				for (symbol in hash_map) {
					entity = hash_map[symbol];
					tmp_str = tmp_str.split(entity).join(symbol);
				}
				tmp_str = tmp_str.split('&#039;').join("'");
	
				return tmp_str;
			}
		}, {
			key: 'getIframeDocument',
			value: function getIframeDocument(jEl) {
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
	
		}, {
			key: 'downloadFile',
			value: function downloadFile(url) {
				var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
				var method = arguments.length <= 2 || arguments[2] === undefined ? 'POST' : arguments[2];
	
				$("#M_FileDownload").remove();
				$(document.body).append("<iframe id='M_FileDownload' src='about:blank' style='display:none;'></iframe>");
				var html = "";
				_.each(args, function (val, key) {
					html += '<input type="hidden" name="' + key + '" value="' + val + '">';
				});
				var doc = this.getIframeDocument($("#M_FileDownload"));
				// console.log("html", html);
				doc.write("<html><head></head><body><form method='" + method + "' action='" + url + "'>" + html + "</form></body></html>");
				var started = false;
				$(doc).find('form').submit();
			}
		}, {
			key: 'downloadFile2',
			value: function downloadFile2(url) {
				var _this5 = this;
	
				var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
				var method = arguments.length <= 2 || arguments[2] === undefined ? 'POST' : arguments[2];
	
				$("#M_FileDownload").remove();
				$(document.body).append("<iframe id='M_FileDownload' src='" + url + "' style='display:block; width:100%; height:200px;'></iframe>");
				window.setTimeout(function () {
					var doc = _this5.getIframeDocument($("#M_FileDownload"));
					var toto = doc.toString();
					// console.log("doc.window", doc);
					// var txt = $(doc).html() ;
					// console.log("txt", txt, JSON.parse(txt));
				}, 2000);
			}
		}, {
			key: 'urlIze',
			value: function urlIze(str) {
				str = M_.Utils.trim(str);
				if (str.substring(0, 7) == 'http://') return str;
				return "http://" + str;
			}
		}, {
			key: 'limitText',
			value: function limitText(str, n, useWordBoundary) {
				var toLong = str.length > n,
				    s_ = toLong ? str.substr(0, n - 1) : this;
				s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
				return toLong ? s_ + '&hellip;' : s_;
			}
			/**
	   * toggleAppFullScreen description
	   * @return {Boolean} true if actually passed in full screen (after function executed)
	   */
	
		}, {
			key: 'toggleAppFullScreen',
			value: function toggleAppFullScreen() {
				var element = document.body;
				$(document.body).css('width', '100%');
				if (!M_.Utils._appIsFullScreen) {
					var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
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
	
		}, {
			key: 'moment',
			value: function (_moment) {
				function moment() {
					return _moment.apply(this, arguments);
				}
	
				moment.toString = function () {
					return _moment.toString();
				};
	
				return moment;
			}(function () {
				return moment;
			})
			/**
	   * Idem as jQuery $.isFunction()
	   * @param  {object}  obj The object to test
	   * @return {boolean}     True if obj is an function
	   */
	
		}, {
			key: 'isFunction',
			value: function isFunction(obj) {
				return $.isFunction(obj);
			}
			/**
	   * Idem as jQuery $.isEmptyObject()
	   * @param  {object}  obj The object to test
	   * @return {boolean}     True if obj is {}
	   */
	
		}, {
			key: 'isEmptyObject',
			value: function isEmptyObject(obj) {
				return $.isEmptyObject(obj);
			}
	
			/**
	   * Check if d is a moment date
	   * @param  {moment}  obj The object to test
	   * @return {boolean}     True if obj is {}
	   */
	
		}, {
			key: 'isDate',
			value: function isDate(d) {
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
	
		}, {
			key: 'getExtensionFromPath',
			value: function getExtensionFromPath(path) {
				return path.split('.').pop();
			}
	
			/**
	   * Return the base name of a path.
	   * @param  {String} path The path
	   * @return {String}      The name of the file
	   * @example
	   * var filename = getBaseNameFromPath("foo/bar/myfile.html") ;
	   * // filename = "myfile.html"
	   */
	
		}, {
			key: 'getBaseNameFromPath',
			value: function getBaseNameFromPath(path) {
				return path.split('/').pop();
			}
	
			/**
	   * Return the directory of a path.
	   * @param  {String} path The path
	   * @return {String}      The name of the file
	   * @example
	   * var filename = getDirFromPath("foo/bar/myfile.html") ;
	   * // filename = "foo/bar"
	   */
	
		}, {
			key: 'getDirFromPath',
			value: function getDirFromPath(path) {
				var tabPaths = path.split('/');
				tabPaths.pop();
				return tabPaths.join('/');
			}
			/**
	   * Convert hexadecimal to RGB
	   * @param  {number} hex Number to convert
	   * @return {object}     Object contain keys : r, g, b ; {r:x, g:y, b:z}
	   */
	
		}, {
			key: 'hexToRgb',
			value: function hexToRgb(hex) {
				//Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function (m, r, g, b) {
					return r + r + g + g + b + b;
				});
	
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}
			/**
	   * Convert RGB to Hexa
	   * @param  {number} r Red
	   * @param  {integer} g Green
	   * @param  {integer} b Blue
	   * @return {number}   Number of hexadecimal
	   */
	
		}, {
			key: 'rgbToHex',
			value: function rgbToHex(r, g, b) {
				return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
			}
			/**
	   * Convert RGB from css (like #FFFFFF) to Hexa
	   * @param  {number} rgb
	   * @return {number}   Object contain keys : r, g, b ; {r:x, g:y, b:z}
	   */
	
		}, {
			key: 'rgbFromCssToHex',
			value: function rgbFromCssToHex(rgb) {
				if (rgb.indexOf('#') === 0) return rgb;
				if (rgb.indexOf('rgb') === 0) {
					rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
					return "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
				}
			}
			/**
	   * Return a uniq ID
	   * @return {String} A incremental number start from 1
	   */
	
		}, {
			key: 'id',
			value: function id() {
				if (!this.cmpUniqId) this.cmpUniqId = 0;
				this.cmpUniqId++;
				return "_M_el_" + this.cmpUniqId;
			}
	
			/**
	   * Don't use that...
	   */
	
		}, {
			key: 'removeEventsNotAttachedToDocument',
			value: function removeEventsNotAttachedToDocument() {
				window.setTimeout(function () {
					// log("go")
					var tab = $._data(document, "events").click;
					// log("tab",tab)
					if (!tab) return;
					var nb = 0;
					var tabToRemove = [];
					for (var i = 0; i < tab.length; i++) {
						if (tab[i].selector && $(tab[i].selector).length === 0 && tab[i].selector.substring(0, 7) == "#_M_el_") {
							nb++;
							tabToRemove.push(tab[i].selector);
						}
					}
					// log("tabToRemove",tabToRemove)
					for (i = 0; i < tabToRemove.length; i++) {
						$(document).off('click', tabToRemove[i]);
					}
					// log("nb", nb) ;
				}, 500);
			}
			/**
	   * Set the z-index upper
	   * @param {jQuery} jEl jQuery object
	   */
	
		}, {
			key: 'setZIndexForModal',
			value: function setZIndexForModal(jEl) {
				this._cmptZIndexModal += 10;
				jEl.css('z-index', this._cmptZIndexModal);
				$(".modal-backdrop").last().css("z-index", this._cmptZIndexModal - 1);
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
	
		}, {
			key: 'clone',
			value: function clone(obj) {
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
	
		}, {
			key: 'createUUID',
			value: function createUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = Math.random() * 16 | 0,
					    v = c == 'x' ? r : r & 0x3 | 0x8;
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
	
		}, {
			key: 'plural',
			value: function plural(nb, singular) {
				var _plural = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
				var withoutnumber = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	
				if (nb <= 1 && nb >= -1) {
					if (singular.indexOf('{{nb}}') >= 0) {
						return singular.replace(/\{\{nb\}\}/, nb);
					}
					if (withoutnumber) return singular;
					return nb + " " + singular;
				}
				if (!_plural) _plural = singular + "s";
				if (_plural.indexOf('{{nb}}') >= 0) {
					return _plural.replace(/\{\{nb\}\}/, nb);
				}
				if (withoutnumber) return _plural;
				return nb + "&nbsp;" + _plural;
			}
			/**
	   * Create a delay
	   * @param  {function} callback - une fonction à appeler
	   * @param  {number} time - un temp en millisecondes
	   * @param  {String} [arbitralName="arbitralName"] - donner de préférence un nom unique
	   */
	
		}, {
			key: 'delay',
			value: function delay(callback, time) {
				var arbitralName = arguments.length <= 2 || arguments[2] === undefined ? "arbitralName" : arguments[2];
	
				if (!this.tabDelay) this.tabDelay = {};
				if (arbitralName === "") arbitralName = "arbitralName";
				if (this.tabDelay[arbitralName]) window.clearTimeout(this.tabDelay[arbitralName]);
				this.tabDelay[arbitralName] = window.setTimeout(function () {
					//log("callback")
					callback();
				}, time);
			}
			/**
	   * Check if variable is empty : [], undef, null, false, 0, "", "0", "undefined", undefined
	   * @param  {object} obj
	   * @return {boolean} true if empty
	   */
	
		}, {
			key: 'isEmpty',
			value: function isEmpty(obj) {
				var undef, key, i, len;
				var emptyValues = [undef, null, false, 0, "", "0", "undefined", undefined];
	
				if ($.type(obj) === "date") return false;
	
				for (i = 0, len = emptyValues.length; i < len; i++) {
					if (obj === emptyValues[i] || obj == emptyValues[i]) {
						return true;
					}
				}
				if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object") {
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
	
		}, {
			key: 'formatPhone',
			value: function formatPhone(num) {
				var ret = "";
				var toAdd = "";
				//$phone_number = preg_replace("/[^\+0-9]/", "", $phone_number);
				num = num.replace(/[^\+0-9]/g, '');
				if (num.substring(0, 1) == "+") {
					toAdd = num.substr(0, 3) + " ";
					num = num.substr(3);
				}
				for (var kk = 0; kk < num.length; kk++) {
					if (kk % 2 === 0) ret = ' ' + ret;
					ret = num.substr(num.length - kk - 1, 1) + ret;
				}
				return toAdd + ret.trim();
			}
		}, {
			key: 'alphaNum',
			value: function alphaNum(str) {
				if (!str) return "";
				var reg1 = /[^\+0-9]/g;
				str = str.replace(reg1, '');
				return str;
			}
			/**
	   * Strip html tags
	   * @param  {String} num
	   * @param  {String} allowed
	   * @return {String} the new string
	   */
	
		}, {
			key: 'strip_tags',
			value: function strip_tags(input, allowed) {
				//From: http://phpjs.org/functions
				if (!input) return "";
				allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
				var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
				return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
					return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
				});
			}
			/**
	   * First char to upper case
	   * @param  {String} str
	   * @return {String} the new string
	   */
	
		}, {
			key: 'ucfirst',
			value: function ucfirst(str) {
				//  discuss at: http://phpjs.org/functions/ucfirst/
				// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// bugfixed by: Onno Marsman
				// improved by: Brett Zamir (http://brett-zamir.me)
				//   example 1: ucfirst('kevin van zonneveld');
				//   returns 1: 'Kevin van zonneveld'
	
				str += '';
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
	
		}, {
			key: 'str_pad',
			value: function str_pad(str, len) {
				var padStr = arguments.length <= 2 || arguments[2] === undefined ? '0' : arguments[2];
				var direction = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];
	
				str += "";
				var res = "";
				//warning if len<str.length
				if (direction < 0) str = str.split("").reverse().join("");
				for (var i = 0; i < len; i++) {
					var c = str.charAt(i);
					if (c === '') res += padStr;
					res += str.charAt(i);
				}
				if (direction < 0) res = res.split("").reverse().join("");
				return res;
			}
			/**
	   * Remove break line, space and tabulation
	   * @param  {String} str - the base string
	   * @return {String} the new string
	   */
	
		}, {
			key: 'trim',
			value: function trim(str) {
				//return str.replace(/^\s+|\s+$/g, '');
				str = $.trim(str);
				str = str.replace(/^(\n\r)+|(\n\r)+$/g, '');
				return str;
			}
			/**
	   * Set cookie
	   * @param  {String} cname - the name of the cookie
	   * @param  {String} cvalue - the value of the cookie
	   * @param  {String} [expireDays=7] - expiration in days
	   */
	
		}, {
			key: 'setCookie',
			value: function setCookie(cname, cvalue) {
				var expireDays = arguments.length <= 2 || arguments[2] === undefined ? 7 : arguments[2];
	
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
	
		}, {
			key: 'getCookie',
			value: function getCookie(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
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
	
		}, {
			key: 'isMacos',
			value: function isMacos() {
				var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
				return isMac;
			}
		}, {
			key: 'valInArray',
			value: function valInArray(tab, key) {
				var keyName = arguments.length <= 2 || arguments[2] === undefined ? 'key' : arguments[2];
				var valName = arguments.length <= 3 || arguments[3] === undefined ? 'val' : arguments[3];
	
				var f = this.findInArray(tab, key, keyName);
				if (f) return _.result(f, valName);else return "";
			}
		}, {
			key: 'findInArray',
			value: function findInArray(tab, key) {
				var keyName = arguments.length <= 2 || arguments[2] === undefined ? 'key' : arguments[2];
	
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
	
		}, {
			key: 'getFromSimpleArray',
			value: function getFromSimpleArray(tab, what) {
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
	
		}, {
			key: 'getSimpleArray',
			value: function getSimpleArray(tab, index, what) {
				var pos = this.searchSimpleArray(tab, index, what);
				if (pos >= 0) return tab[pos];
				return null;
			}
			/**
	   * Get cookie
	   * @param  {String} cname - the name of the cookie
	   * @return {String} the value of the cookie
	   */
	
		}, {
			key: 'searchSimpleArray',
			value: function searchSimpleArray(tab, index, what) {
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
	
		}, {
			key: 'searchArrayObjects',
			value: function searchArrayObjects(tab, what, val) {
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
	
		}, {
			key: 'getFromArrayObjects',
			value: function getFromArrayObjects(tab, what, val) {
				for (var i2 = 0; i2 < tab.length; i2++) {
					if (tab[i2][what] == val) return tab[i2];
				}
				return null;
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'inArray',
			value: function inArray(needle, haystack) {
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
	
		}, {
			key: 'nl2br',
			value: function nl2br(str, is_xhtml) {
				var breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br ' + '/>' : '<br>'; //Adjust comment to avoid issue on phpjs.org display
	
				return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			}
			/**
	   * replaceCommaWithPoint description
	   * @param  {String} txt
	   * @return {String}
	   */
	
		}, {
			key: 'replaceCommaWithPoint',
			value: function replaceCommaWithPoint(txt) {
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
				return txt.replace(exp, '.');
			}
			/**
	   * Like PHP function
	   * @param  {Array} tab
	   * @param  {String} field
	   * @return {Boolean}       true if is set
	   */
	
		}, {
			key: 'isset',
			value: function isset(tab, field) {
				if (typeof tab[field] != 'undefined') return true;
				return false;
			}
			/**
	   * Like PHP function
	   * @param  {String} path
	   * @param  {String} options
	   * @return {String}
	   */
	
		}, {
			key: 'pathinfo',
			value: function pathinfo(path, options) {
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
	
				var opt = '',
				    optName = '',
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
					options = 'PATHINFO_ALL';
				}
	
				// Initialize binary arguments. Both the string & integer (constant) input is
				// allowed
				var OPTS = {
					'PATHINFO_DIRNAME': 1,
					'PATHINFO_BASENAME': 2,
					'PATHINFO_EXTENSION': 4,
					'PATHINFO_FILENAME': 8,
					'PATHINFO_ALL': 0
				};
				// PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
				for (optName in OPTS) {
					OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
				}
				if (typeof options !== 'number') {
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
				var __getExt = function __getExt(path) {
					var str = path + '';
					var dotP = str.lastIndexOf('.') + 1;
					return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
				};
	
				// Gather path infos
				if (options & OPTS.PATHINFO_DIRNAME) {
					var dirName = path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); // dirname
					tmp_arr.dirname = dirName === path ? '.' : dirName;
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
						have_filename = have_basename.slice(0, have_basename.length - (have_extension ? have_extension.length + 1 : have_extension === false ? 0 : 1));
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
	
		}, {
			key: 'formatPrice',
			value: function formatPrice(nb) {
				var decimal = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
				var devise = arguments.length <= 2 || arguments[2] === undefined ? M_.i18n.devise : arguments[2];
	
				return this.price(nb, decimal, devise);
			}
			/**
	   * Alias of formatPrice
	   * @param  {Number} nb
	   * @param  {Number} decimal
	   * @param  {String} devise
	   * @return {String}
	   */
	
		}, {
			key: 'price',
			value: function price(nb) {
				var decimal = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
				var devise = arguments.length <= 2 || arguments[2] === undefined ? M_.i18n.devise : arguments[2];
				var sep = arguments.length <= 3 || arguments[3] === undefined ? ' ' : arguments[3];
	
				return this.number_format(nb, decimal, ",", ".") + sep + devise;
			}
		}, {
			key: 'shortPrice',
			value: function shortPrice(nb) {
				var devise = arguments.length <= 1 || arguments[1] === undefined ? M_.i18n.devise : arguments[1];
				var sep = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];
	
				var res = '';
				if (nb < 1000) res += Math.round(nb) + '';else if (nb < 1000000) res += Math.round(nb / 1000) + 'K';else res += Math.round(nb / 1000000) + 'M';
				return res + sep + devise;
			}
			/**
	   * Format number in %
	   * @param  {Number} nb
	   * @param  {Number} decimal
	   * @return {String}
	   */
	
		}, {
			key: 'purcent',
			value: function purcent(nb) {
				var decimal = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
				var sep = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];
	
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
	
		}, {
			key: 'number_format',
			value: function number_format(a, b, c, d) {
				var i, e, f, g, h;
				a = Number(a);
				a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
				e = a + '';
				f = e.split('.');
				if (!f[0]) f[0] = '0';
				if (!f[1]) f[1] = '';
				if (f[1].length < b) {
					g = f[1];
					for (i = f[1].length + 1; i <= b; i++) {
						g += '0';
					}
					f[1] = g;
				}
				if (d !== '' && f[0].length > 3) {
					h = f[0];
					f[0] = '';
					for (var j = 3; j < h.length; j += 3) {
						i = h.slice(h.length - j, h.length - j + 3);
						f[0] = d + i + f[0] + '';
					}
					j = h.substr(0, h.length % 3 === 0 ? 3 : h.length % 3);
					f[0] = j + f[0];
				}
				c = b <= 0 ? '' : c;
				return f[0] + c + f[1];
			}
			/**
	   * Text selection in HTML input field
	   * @param {jQuery} jEl
	   * @param {Number} start from which char
	   * @param {Number} stop  to which char
	   */
	
		}, {
			key: 'setSelectionRange',
			value: function setSelectionRange(jEl) {
				var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
				var stop = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	
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
	
		}, {
			key: 'getMaxZIndex',
			value: function getMaxZIndex() {
				var selectorLimit = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
				var max = 0;
				$(selectorLimit || "*").each(function (index, el) {
					var jEl = $(el);
					if (el.id == 'M_Help') return true;
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
	
		}, {
			key: 'getNextZIndex',
			value: function getNextZIndex() {
				var increment = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];
	
				return this.getMaxZIndex() + increment;
			}
			/**
	   * Get default speed limit
	   * @return {Number} number of milliseconds
	   */
	
		}, {
			key: 'getSpeedAnim',
			value: function getSpeedAnim() {
				return 500;
			}
			/**
	   * Display smoothly an element
	   * @param  {jQuery}   jEl the element
	   * @param  {Function} cb  callback function after finished animation
	   */
	
		}, {
			key: 'showSmoothly',
			value: function showSmoothly(jEl, cb) {
				if (jEl.is(':hidden')) jEl.css('opacity', 0).show().transition({ opacity: 1 }, this.getSpeedAnim(), function () {
					if (cb) cb();
				});else if (cb) cb();
			}
			/**
	   * Hide smoothly an element
	   * @param  {jQuery}   jEl the element
	   * @param  {Function} cb  callback function after finished animation
	   */
	
		}, {
			key: 'hideSmoothly',
			value: function hideSmoothly(jEl, cb) {
				if (jEl.is(':visible')) jEl.css('opacity', 1).transition({ opacity: 0 }, this.getSpeedAnim(), function () {
					jEl.hide();
					if (cb) cb();
				});else if (cb) cb();
			}
			/**
	   * Do a POST of json data
	   * @param  {String}   url  the url to call
	   * @param  {object}   args arguments to send
	   * @param  {Function} cb   callback function with "data" argument
	   * @return {jqXHR}
	   */
	
		}, {
			key: 'postJson',
			value: function postJson(url, args, cb) {
				return this.ajaxJson(url, args, 'POST', cb);
			}
			/**
	   * Do a PUT of json data
	   * @param  {String}   url  the url to call
	   * @param  {object}   args arguments to send
	   * @param  {Function} cb   callback function with "data" argument
	   * @return {jqXHR}
	   */
	
		}, {
			key: 'putJson',
			value: function putJson(url, args, cb) {
				return this.ajaxJson(url, args, 'PUT', cb);
			}
			/**
	   * Do a GET of json data
	   * @param  {String}   url  the url to call
	   * @param  {object}   args arguments to send
	   * @param  {Function} cb   callback function with "data" argument
	   * @return {jqXHR}
	   */
	
		}, {
			key: 'getJson',
			value: function getJson(url, args, cb) {
				return this.ajaxJson(url, args, 'GET', cb);
			}
			/**
	   * Do a DELETE of json data
	   * @param  {String}   url  the url to call
	   * @param  {object}   args arguments to send
	   * @param  {Function} cb   callback function with "data" argument
	   * @return {jqXHR}
	   */
	
		}, {
			key: 'deleteJson',
			value: function deleteJson(url, args, cb) {
				return this.ajaxJson(url, args, 'DELETE', cb);
			}
			/**
	   * Do a Ajax call of json data
	   * @param  {String}   url  the url to call
	   * @param  {object}   args arguments to send
	   * @param  {String}   POST|PUT|GET|DELETE
	   * @param  {Function} cb   callback function with "data" argument
	   * @return {jqXHR}
	   */
	
		}, {
			key: 'ajaxJson',
			value: function ajaxJson(url, args, method, cb) {
				var opts = {
					url: url,
					type: method,
					dataType: 'json',
					success: function success(data) {
						cb(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						cb(jqXHR.responseJSON);
					}
				};
				if (method == 'GET' || method == 'DELETE') {
					if (args) opts.data = args;
				} else {
					opts.data = JSON.stringify(args);
					opts.contentType = 'application/json';
					opts.processData = false;
					opts.cache = false;
				}
				// log("opts",opts)
	
				if (M_.App.useWebsocket) {
					if (method == 'POST') return io.socket.post(url, opts, function (data, jwres) {
						cb(data);
					});
					if (method == 'PUT') return io.socket.put(url, opts, function (data, jwres) {
						cb(data);
					});
					if (method == 'GET') return io.socket.get(url, opts, function (data, jwres) {
						cb(data);
					});
					if (method == 'DELETE') return io.socket.delete(url, opts, function (data, jwres) {
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
	
		}, {
			key: 'saveFiles',
			value: function saveFiles(files, url) {
				var moreArgs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
				var cb = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	
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
					type: 'POST',
					//headers: {Connection: close},
					data: formData,
					contentType: false,
					processData: false,
					dataType: 'json',
					cache: false,
					success: function success(data) {
						cb(data);
					}
				});
			}
			/**
	   * Check if a script is loaded (warning : check exactly the file name)
	   * @param  {String}  url url to call
	   * @return {Boolean}     true if already loaded
	   */
	
		}, {
			key: 'isLoadedScript',
			value: function isLoadedScript(url) {
				var ok = false;
				$("script").each(function () {
					if (this.src === url) ok = true;
				});
				return ok;
			}
			/**
	   * Load a javascript file dynamically ; warning, no callback !!!
	   * @param  {String} url url to call
	   */
	
		}, {
			key: 'loadScript',
			value: function loadScript(url) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				// script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +'&signed_in=true&callback=initialize';
				script.src = url;
				document.body.appendChild(script);
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'saveSelection',
			value: function saveSelection() {
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
	
		}, {
			key: 'restoreSelection',
			value: function restoreSelection() {
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
		}]);
	
		return _class3;
	}();
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
		initObservable: function initObservable() {
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
		addListener: function addListener(evtName, fct) {
			this._listeners.push({ evtName: evtName, fct: fct });
		},
		/**
	  * Remove a listner to this object
	  * @param {String} evtName The event name
	  * @param {Function} fct     A callback function previously saved whith addListener()
	  */
		removeListener: function removeListener(evtName, fct) {
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
		trigger: function trigger(evtName) {
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
		translate: function translate() {}
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
	M_.Model = function () {
		function _class4(opts) {
			_classCallCheck(this, _class4);
	
			var defaults = {
				fields: null,
				row: {},
				store: null,
				primaryKey: null
			};
			$.extend(this, defaults, opts, this.getDefinition());
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			if (!this.row) log("Vous devez définir opts.row");
			// if (!this.store) log("Vous devez définir opts.store") ;
			var fields = this.fields;
			for (var j = 0; j < fields.length; j++) {
				if (!fields[j].type) fields[j].type = 'string';
			}
			this.updateRow();
		}
		/**
	     * You must extends this class to return a definition
	  * @function M_.Model#getDefinition
	     */
	
	
		_createClass(_class4, [{
			key: 'getDefinition',
			value: function getDefinition() {
				return {};
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'updateRow',
			value: function updateRow() {
				var fields = this.fields;
				// log("fields",fields)
				for (var j = 0; j < fields.length; j++) {
					var val = "";
					if (fields[j].type == 'date') {
						if (this.row[fields[j].name] === undefined) continue;
						if ($.type(this.row[fields[j].name]) == 'date') {
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
					if (fields[j].type == 'number') {
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
	
		}, {
			key: 'getData',
			value: function getData() {
				return this.getArray();
			}
		}, {
			key: 'getRowData',
			value: function getRowData() {
				return this.getArray();
			}
		}, {
			key: 'getArray',
			value: function getArray() {
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
	
		}, {
			key: 'setRow',
			value: function setRow(row) {
				var silently = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
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
	
		}, {
			key: 'set',
			value: function set(field, val, silently) {
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
	
		}, {
			key: 'createEmptyRow',
			value: function createEmptyRow() {
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
	
		}, {
			key: 'get',
			value: function get(field) {
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
							if (fields[j].type == 'string' || fields[j].type == 'text') {
								val = this.row[field];
							} else if (fields[j].type == 'number') {
								val = this.row[field] * 1;
							} else if (fields[j].type == 'array') {
								val = this.row[field];
							} else if (fields[j].type == 'boolean') {
								if (this.row[field] == 'true' || this.row[field] === true || this.row[field] === '1' || this.row[field] === 1) val = true;else val = false;
							} else if (fields[j].type == 'date') {
								if ($.type(this.row[field]) == 'date') val = this.row[field];else {
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
	
		}, {
			key: 'getId',
			value: function getId() {
				return this.get(this.primaryKey);
			}
		}]);
	
		return _class4;
	}();
	
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
	M_.ModelKeyVal = function (_M_$Model) {
		_inherits(_class5, _M_$Model);
	
		function _class5() {
			_classCallCheck(this, _class5);
	
			return _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).apply(this, arguments));
		}
	
		_createClass(_class5, [{
			key: 'getDefinition',
			value: function getDefinition() {
				return {
					primaryKey: "key",
					fields: [{ name: 'key' }, { name: 'val' }]
				};
			}
		}]);
	
		return _class5;
	}(M_.Model);
	
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
	M_.Store = function () {
	
		/**
	  * Initialize the store. If you extend this method, you should call this._super()
	  *
	  * @param  {object} opts The configuration object
	  */
		function _class6(opts) {
			_classCallCheck(this, _class6);
	
			var defaults = {
				rows: [],
				useWebsocket: M_.App.useWebsocket,
				rowsModel: [],
				_tabFieldsForSort: [],
				url: '',
				args: {},
				rootData: 'data',
				currentSort: null,
				model: null,
				lastLoadArgs: {},
				primaryKey: "",
				limit: null,
				sortOnRemote: false,
				skip: 0,
				lastTotal: 0,
				unshiftRows: [],
				pushRows: [],
				_loaded: false,
				_loading: false
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
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
					for (var i = 0; i < this.unshiftRows.length; i++) {
						this.rows.unshift(this.unshiftRows[i]);
					}
				}
				if (this.pushRows && this.pushRows.length > 0) {
					for (var _i = 0; _i < this.pushRows.length; _i++) {
						this.rows.push(this.pushRows[_i]);
					}
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
	
	
		_createClass(_class6, [{
			key: 'getRowBy',
			value: function getRowBy(field, val) {
				var rows = this.rowsModel;
				for (var i = 0; i < rows.length; i++) {
					var v;
					if (this.model) v = rows[i].get(field);else v = rows[i][field];
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
	
		}, {
			key: 'getIndexBy',
			value: function getIndexBy(field, val) {
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
	
		}, {
			key: 'getRowByIndex',
			value: function getRowByIndex(index) {
				var rows = this.rowsModel;
				if (rows[index]) return rows[index];
				return null;
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'getRow',
			value: function getRow(val) {
				return this.getRowBy(this.primaryKey, val);
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'getIndexById',
			value: function getIndexById(id) {
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
	
		}, {
			key: 'getRowsBy',
			value: function getRowsBy(field, val) {
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
	
		}, {
			key: 'getRowAt',
			value: function getRowAt(index) {
				return this.rowsModel[index];
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setRows',
			value: function setRows(rows) {
				this.rows = rows;
				this.useModel();
				//log("this.rows1",this.rows)
				//log("setRows",this.rowsModel)
				this.trigger("update", this, this.rowsModel);
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setModels',
			value: function setModels(rows) {}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addModel',
			value: function addModel(row) {}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addRow',
			value: function addRow(row) {
				this.addRows([row]);
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addModels',
			value: function addModels(rows) {}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addRows',
			value: function addRows(rows) {
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
	
		}, {
			key: 'getRows',
			value: function getRows() {
				return this.rowsModel;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'count',
			value: function count() {
				return this.rowsModel.length;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'countTotal',
			value: function countTotal() {
				//log("countTotal",this.rowsModel,this.rows)
				if (this.lastTotal === 0) return this.count();
				return this.lastTotal;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'deleteAll',
			value: function deleteAll() {
				this.rows = [];
				this.rowsModel = [];
				this.trigger("removedAll", this);
				this.trigger("update", this, this.rowsModel);
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'setKeysOnRows',
			value: function setKeysOnRows() {
				for (var i = 0; i < this.rows.length; i++) {
					this.rows[i]._mid = i;
				}
			}
		}, {
			key: '_sortRemote',
			value: function _sortRemote(fields, direction) {
				//log("sortRemote")
				if (!this.lastLoadArgs) this.lastLoadArgs = {};
				// this.lastLoadArgs.sort = this.currentSort[0] ;
				// this.lastLoadArgs.direction = this.currentSort[1] ;
				// this.lastLoadArgs.sort = fields ;
				// if (direction>0) this.lastLoadArgs.sort += " ASC" ;
				// else this.lastLoadArgs.sort += " ASC" ;
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
	
		}, {
			key: 'sort',
			value: function sort(fields, direction, silently) {
				// console.log("fields", fields);
				if (!direction) direction = 0;
				if (_.isFunction(fields)) {} else {
					if (direction === 0) {
						if (!this._tabFieldsForSort[fields]) {
							this._tabFieldsForSort[fields] = 1;
						} else {
							this._tabFieldsForSort[fields] = this._tabFieldsForSort[fields] * -1;
						}
						direction = this._tabFieldsForSort[fields];
					} else {
						this._tabFieldsForSort[fields] = direction;
					}
					this.currentSort = [fields, direction];
				}
				if (this.trigger("beforeSort", this, fields, direction) === false) return false;
				//log("this.currentSort",this.currentSort)
				if (this.sortOnRemote) {
					this._sortRemote(fields, direction);
					return;
				}
				// console.log("ok");
				this.rowsModel.sort(function (a, b) {
					// log("a,b",a,b)
					var a0;
					var b0;
					if (_.isFunction(fields)) {
						a0 = fields(a);
						b0 = fields(b);
						// console.log("a0, b0", a0, b0);
					} else {
						a0 = a.get(fields);
						b0 = b.get(fields);
					}
					if (a0 === null || b0 === null) return 0;
					if (typeof a0 == "number") {
						if (direction == -1) return b0 - a0;
						return a0 - b0;
					} else if (a0 instanceof Date) {
						if (direction == -1) return b0 - a0;
						return a0 - b0;
					} else if (a0 && b0 && a0.getDate && a0.getDate() instanceof Date) {
						if (direction == -1) return b0.getDate() - a0.getDate();
						return a0.getDate() - b0.getDate();
					} else if (a0 && b0) {
						if (direction == -1) return b0.localeCompare(a0);
						return a0.localeCompare(b0);
					} else return 0;
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
	
		}, {
			key: 'useModel',
			value: function useModel() {
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
	
		}, {
			key: 'each',
			value: function each(fn) {
				//log("length",this.rowsModel)
				for (var i = 0; i < this.rowsModel.length; i++) {
					var ret = fn.call(this, this.rowsModel[i], i);
					if (ret === false) break;
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'createEmptyRow',
			value: function createEmptyRow() {
				var mod = new this.model({ row: {}, store: this });
				mod.createEmptyRow();
				return mod;
			}
			/**
	   * @param {type} skip
	   */
	
		}, {
			key: 'setSkip',
			value: function setSkip(skip) {
				this.skip = skip;
				if (!this.lastLoadArgs) this.lastLoadArgs = {};
				this.lastLoadArgs.skip = skip;
				this.reload();
			}
			/**
	   * @param {type} query
	   */
	
		}, {
			key: 'setQuery',
			value: function setQuery(query) {
				this.reload();
			}
			/**
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isLoading',
			value: function isLoading() {
				return this._loading;
			}
			/**
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isLoaded',
			value: function isLoaded() {
				return this._loaded;
			}
			/**
	   * @param  {type} args
	   * @param  {Function} callback
	   * @return {type}
	   */
	
		}, {
			key: 'load',
			value: function load(args, callback) {
				var _this7 = this;
	
				// log("load")
				var okArgs = {};
				if (this.currentSort) {
					if (_.isArray(this.currentSort)) okArgs.sort = this.currentSort[0] + " " + this.currentSort[1];else okArgs.sort = this.currentSort;
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
					io.socket.get(obj.url, okArgs, function (data, jwres) {
						_this7._treatDataStore(data, callback);
					});
				} else {
					// if (this.loadAjaxXHR) this.loadAjaxXHR.abort() ;
					// log("okArgs",okArgs)
					this.loadAjaxXHR = M_.Utils.getJson(obj.url, okArgs, function (data) {
						_this7._treatDataStore(data, callback);
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
		}, {
			key: '_treatDataStore',
			value: function _treatDataStore(data, callback) {
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
					for (i = 0; i < this.unshiftRows.length; i++) {
						data.data.unshift(this.unshiftRows[i]);
					}
				}
				if (this.pushRows.length > 0) {
					for (i = 0; i < this.pushRows.length; i++) {
						data.data.push(this.pushRows[i]);
					}
				}
				//if (this.lastLoadArgs.add)  ;
				//else
				this.rows = data.data;
				// this.lastLoadArgs.add = false ;
	
				this.useModel();
				// if (this.currentSort && !this.sortOnRemote && _.isArray(this.currentSort))
				// 	this.sort(this.currentSort[0], this.currentSort[1], true) ;
				//this.setKeysOnRows() ;
	
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
	
		}, {
			key: 'reload',
			value: function reload() {
				var reset = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
				var moreArgs = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
				var cb = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
				if (reset) {
					this.skip = 0;
					this.lastLoadArgs = {};
				}
				if (moreArgs) $.extend(this.lastLoadArgs, moreArgs);
				this.load(this.lastLoadArgs, cb);
			}
		}]);
	
		return _class6;
	}();
	
	/**
	 * A base graphical object
	 * @class
	 * @memberof! <global>
	 * @implements M_.Observable
	 */
	M_.Outlet = function () {
		function _class7(opts) {
			_classCallCheck(this, _class7);
	
			var defaults = {
				controller: null,
				container: null,
				id: '',
				view: null,
				jEl: null,
				help: null,
				rendered: false,
				top: 0,
				left: 0
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
	
			if (!M_.Utils.isEmpty(this.jEl) && $.type(this.jEl) == "string") this.jEl = $("#" + this.jEl);
			// if (!M_.Utils.isEmpty(this.container) && $.type(this.container)=="string") this.container = $("#"+this.container) ;
	
			if (M_.Utils.isEmpty(this.jEl)) this.create();
	
			if (this.jEl && M_.Utils.isEmpty(this.jEl.attr('id'))) this.jEl.attr('id', this.id);
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
			this.trigger('created', this);
		}
	
		_createClass(_class7, [{
			key: '_attachHelp',
			value: function _attachHelp() {
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
	
		}, {
			key: 'create',
			value: function create() {
				this.jEl = $("<div></div>");
				this.container.append(this.jEl);
			}
			/**
	   * Destroy the outlet
	   */
	
		}, {
			key: 'destroy',
			value: function destroy() {
				if (!this.jEl) return;
				this.jEl.remove();
				this.container.empty();
			}
			/**
	   * Return jEl element. Generally the main object.
	   * @returns {jquery} the main jQuery element
	   */
	
		}, {
			key: 'getEl',
			value: function getEl() {
				return this.jEl;
			}
	
			/**
	   * Search a class or selector in the container, like $.find()
	   * @param  {string} selector
	   * @return {jQuery}
	   */
	
		}, {
			key: 'findEl',
			value: function findEl(selector) {
				return this.container.find(selector);
			}
		}]);
	
		return _class7;
	}();
	
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
		initStored: function initStored() {
			if (!this.store) log("store is mandatory in M_.Stored");
			//if (this.store) this.setStore(this.store) ;
			else this.store.addListener("update", $.proxy(this.updateStore, this));
		},
		/**
	  * Configure a new store
	  * @param {M_.Store} store The new store used
	  */
		setStore: function setStore(store) {
			this.store = store;
			this.store.addListener("update", $.proxy(this.updateStore, this));
		},
		/**
	  * Return the store object
	  * @return {M_.Store} The store object or null
	  */
		getStore: function getStore() {
			return this.store;
		}
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
	M_.Help = function () {
		function _class8(opts) {
			_classCallCheck(this, _class8);
	
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
				$(document).on('mousemove', $.proxy(this._mousemove, this));
			}
		}
	
		_createClass(_class8, [{
			key: '_mousemove',
			value: function _mousemove(evt) {
				var top = evt.pageY * 1 + this.shiftY;
				var left = evt.pageX * 1 + this.shiftX;
				if (left + 300 + 100 > $(window).width()) {
					left = evt.pageX * 1 - this.shiftX - $("#M_Help").outerWidth();
					if ($("#M_Help").hasClass('left')) $("#M_Help").removeClass('left').addClass('right');
					if (!$("#M_Help").hasClass('right')) $("#M_Help").addClass('right');
				} else {
					if ($("#M_Help").hasClass('right')) $("#M_Help").removeClass('right').addClass('left');
					if (!$("#M_Help").hasClass('left')) $("#M_Help").addClass('left');
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
	
		}, {
			key: 'create',
			value: function create() {
				var _this8 = this;
	
				// console.log("this.attachedObj", this.attachedObj);
				this.attachedObj.mouseenter(function (evt) {
					_this8.show(evt);
					$(document).on('mousemove', $.proxy(_this8._mousemove, _this8));
				});
				this.attachedObj.mouseleave(function (evt) {
					_this8.hide(evt);
					$(document).off('mousemove', $.proxy(_this8._mousemove, _this8));
				});
				this.attachedObj.click(function (evt) {
					_this8.hide(evt);
				});
				if (this.attachedObj.prop('tagName').toLowerCase() == 'input') {
					this.attachedObj.focus(function (evt) {
						_this8.hide();
					});
					this.attachedObj.focus(function (evt) {
						_this8.hide();
					});
				}
			}
			/**
	   * @param  {event} evt
	   */
	
		}, {
			key: 'show',
			value: function show(evt) {
				$("#M_Help").html(this.text).css('max-width', this.maxWidth).show();
			}
			/**
	   * @param  {event} evt
	   */
	
		}, {
			key: 'hide',
			value: function hide(evt) {
				$("#M_Help").hide();
			}
			/**
	   *
	   */
	
		}], [{
			key: 'createMHelp',
			value: function createMHelp() {
				$("body").append("<div id='M_Help'></div>");
			}
			/**
	   *
	   */
	
		}, {
			key: 'hideMHelp',
			value: function hideMHelp() {
				$("#M_Help").hide();
			}
		}]);
	
		return _class8;
	}();
	
	/**
	 * Like a card layout. Use HTML to define them.
	 * @class
	 * @memberof! <global>
	 * @property {String} firstTab
	 */
	M_.Tabs = function (_M_$Outlet) {
		_inherits(_class9, _M_$Outlet);
	
		function _class9(opts) {
			_classCallCheck(this, _class9);
	
			var defaults = {
				firstTab: null,
				buttons: null,
				onChange: null
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this9 = _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, opts));
	
			if (_this9.buttons) {
				_this9.buttons.find('.M_TabButton').each(function (ind, el) {
					$(el).click(function (evt) {
						var jEl = $(evt.target);
						// console.log("jEl.attr('for')", jEl.attr('for'));
						_this9.show(jEl.attr('for'), function (next) {
							if (_this9.onChange) {
								_this9.onChange(jEl.attr('for'), next);
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
			return _this9;
		}
		// addTab(jEl) {
		// 	this.tabTabs.push(tab) ;
		// }
		/**
	  * @param  {type}
	  * @param  {type}
	  * @return {type}
	  */
	
	
		_createClass(_class9, [{
			key: 'show',
			value: function show(jElId, cbBeforeShow) {
				var anim = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
				var speed = M_.Utils.getSpeedAnim();
				// log("show",jElId)
				var current = null;
				this.container.children('.M_Tab').each(function (ind, el) {
					// log("$(this).attr('id')",$(this).attr('id'))
					if ($(el).hasClass('active')) {
						current = $(el);
						return false;
					}
				});
				// log("current",current)
				if (current && current.attr('id') == jElId) {
					cbBeforeShow(function (cbAfterShow) {
						if (cbAfterShow === false) return;
						if (cbAfterShow) cbAfterShow();
					});
					return;
				} else if (current) {
					if (anim) {
						current.transition({ opacity: 0 }, speed, function () {
							current.removeClass('active');
							$("#" + jElId).css('opacity', 0.01).addClass('active');
							cbBeforeShow(function (cbAfterShow) {
								if (cbAfterShow === false) return;
								$("#" + jElId).transition({ opacity: 1 }, speed, function () {
									if (cbAfterShow) cbAfterShow();
								});
							});
						});
					} else {
						current.removeClass('active');
						cbBeforeShow(function (cbAfterShow) {
							if (cbAfterShow === false) return;
							$("#" + jElId).css('opacity', 1).addClass('active');
							if (cbAfterShow) cbAfterShow();
						});
					}
				} else {
					if (anim) {
						$("#" + jElId).css('opacity', 0.01).addClass('active');
						cbBeforeShow(function (cbAfterShow) {
							if (cbAfterShow === false) return;
							$("#" + jElId).transition({ opacity: 1 }, speed, function () {
								if (cbAfterShow) cbAfterShow();
							});
						});
					} else {
						cbBeforeShow(function (cbAfterShow) {
							if (cbAfterShow === false) return;
							$("#" + jElId).css('opacity', 1).addClass('active');
							if (cbAfterShow) cbAfterShow();
						});
					}
				}
				if (this.buttons) {
					this.buttons.find('.M_TabButton').each(function (ind, el) {
						$(el).removeClass('active');
						if ($(el).attr('for') == jElId) $(el).addClass('active');
					});
				}
			}
		}]);
	
		return _class9;
	}(M_.Outlet);
	
	/**
	 * A graphical tree
	 * @class
	 * @memberof! <global>
	 * @extends M_.Outlet
	 * @property {String} autoLoad
	 * @property {String} tpl
	 */
	M_.Tree = function (_M_$Outlet2) {
		_inherits(_class10, _M_$Outlet2);
	
		function _class10(opts) {
			_classCallCheck(this, _class10);
	
			var defaults = {
				autoLoad: false,
				displayRootNode: true,
				url: "",
				cls: 'M_Tree',
				retractable: true,
				rootNode: {
					expended: true,
					hidden: false,
					label: "RootNode",
					id: "rootnode",
					nodes: []
				}
	
			};
	
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).call(this, opts));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class10, [{
			key: 'create',
			value: function create() {
				this.jEl = $("<div class='" + this.cls + "'></div>");
				this.container.append(this.jEl);
				this._drawNodes();
			}
			/**
	   * Draw the tree
	   */
	
		}, {
			key: 'draw',
			value: function draw() {
				this._drawNodes();
			}
		}, {
			key: '_drawNodes',
			value: function _drawNodes() {
				var _this11 = this;
	
				var html = "";
				html += "<ul>";
				html += this._createChildNodes(this.rootNode);
				html += "</ul>";
				this.jEl.html(html);
	
				$('.M_Tree li:has(ul)').addClass('M_TreeParentLi').find(' > span'); //.attr('title', 'Collapse this branch')
				if (this.retractable) {
					$('.M_Tree li.M_TreeParentLi > span').on('click', function (evt) {
						var target = $(evt.target);
						var children = target.closest('li.M_TreeParentLi').find(' > ul > li');
						if (children.is(":visible")) {
							children.slideUp();
							target.find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign'); //.attr('title', 'Expand this branch')
						} else {
							children.slideDown();
							target.find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign'); //.attr('title', 'Collapse this branch')
						}
						evt.stopPropagation();
					});
				}
				$('.M_Tree li > span').on('click', function (evt) {
					var nodeId = $(evt.target).closest("li").attr("m_id");
					var node = _this11.getNode(nodeId);
					if (node.clickable !== false) _this11.trigger('nodeclick', _this11, nodeId, node);
				});
				this._dragMID = null;
				$('.M_Tree li > span').attr('draggable', true).on('dragover', function (evt) {
					evt.preventDefault();
				}).on('drag', function (evt, evt2) {
					_this11._dragMID = $(evt.target).closest("li").attr("m_id");
				}).on('drop', function (evt) {
					evt.preventDefault();
					var mid = _this11._dragMID;
					var nodeDrop = $(evt.target).closest("li").attr("m_id");
					_this11.moveNode(mid, nodeDrop);
					_this11.trigger('nodemove', _this11, mid, nodeDrop);
				});
			}
		}, {
			key: '_createChildNodes',
			value: function _createChildNodes(parent) {
				var _this12 = this;
	
				var html = "";
				if (!parent.id) parent.id = M_.Utils.id();
				html += "<li m_id='" + parent.id + "'>";
				html += "<span>" + parent.label + "</span>";
				if (parent.nodes && parent.nodes.length) {
					html += "<ul>";
					_.each(parent.nodes, function (node, index) {
						html += _this12._createChildNodes(node);
					});
					html += "</ul>";
				}
				html += "</li>";
				return html;
			}
		}, {
			key: '_iter',
			value: function _iter(parent, nodeId, action) {
				var _this13 = this;
	
				// if (action=='path') this._nodepath.push(parent.id) ;
				if (nodeId == 'rootnode') {
					if (action == 'get') {
						this._nodeparent = null;
						this._resNodeId = parent;
					}
					if (action == 'add') {
						if (!parent.nodes) parent.nodes = [];
						parent.nodes.push(this._nodeToAdd);
					}
					return;
				}
				if (parent.nodes && parent.nodes.length) {
					_.each(parent.nodes, function (node, index) {
						if (!node) return;
						if (node.id == nodeId) {
							if (action == 'remove') parent.nodes.splice(index, 1);
							if (action == 'get') {
								_this13._nodeparent = parent;
								_this13._resNodeId = node;
							}
							if (action == 'add') {
								if (!node.nodes) node.nodes = [];
								node.nodes.push(_this13._nodeToAdd);
							}
						}
						_this13._iter(node, nodeId, action);
					});
				}
				// return '' ;
			}
			/**
	   * @param {NodeObject} node
	   * @param {String} parentId
	   */
	
		}, {
			key: 'addNode',
			value: function addNode(node, parentId) {
				this._nodeToAdd = node;
				this._iter(this.rootNode, parentId, 'add');
				this._drawNodes();
			}
			/**
	   * @param  {String}	nodeId
	   * @param  {String}	parentId
	   */
	
		}, {
			key: 'moveNode',
			value: function moveNode(nodeId, parentId) {
				// log("nodeId, parentId",nodeId, parentId)
				var node = this.getNode(nodeId);
				this.removeNode(nodeId);
				this.addNode(node, parentId);
				this._drawNodes();
			}
			/**
	   * @param  {type}
	   * @return {Array}
	   */
	
		}, {
			key: 'getNodePath',
			value: function getNodePath(nodeId) {
				var nodepath = [nodeId];
				// this._iter(this.rootNode, nodeId, 'path') ;
				var nodeIdStart = nodeId;
				for (var i = 0; i < 100; i++) {
					var parentId = this.getNodeParent(nodeIdStart).id;
					nodepath.unshift(parentId);
					nodeIdStart = parentId;
					if (parentId == 'rootnode') break;
				}
				return nodepath;
			}
		}, {
			key: 'getNodeParent',
			value: function getNodeParent(nodeId) {
				this._nodeparent = null;
				this._iter(this.rootNode, nodeId, 'get');
				// return M_.Utils.clone(this._nodeparent) ;
				return this._nodeparent;
			}
		}, {
			key: 'isNodeChildOf',
			value: function isNodeChildOf(nodeId, childOfNodeId) {
				return this.getNodePath(nodeId);
			}
			/**
	   * @param  {String}	nodeId
	   */
	
		}, {
			key: 'removeNode',
			value: function removeNode(nodeId) {
				// this.jEl.find("li[m_id='"++"']").remove() ;
				this._iter(this.rootNode, nodeId, 'remove');
				this._drawNodes();
			}
			/**
	   * @param  {String}	nodeId
	   * @return {NodeObject}
	   */
	
		}, {
			key: 'getNode',
			value: function getNode(nodeId) {
				this._resNodeId = null;
				this._iter(this.rootNode, nodeId, 'get');
				// return M_.Utils.clone(this._resNodeId) ;
				return this._resNodeId;
			}
			/**
	   * @param {NodeObject} rootNode
	   */
	
		}, {
			key: 'setRootNode',
			value: function setRootNode(rootNode) {
				this.rootNode = rootNode;
				this._drawNodes();
			}
		}]);
	
		return _class10;
	}(M_.Outlet);
	
	/**
	 * A graphical list to implement
	 * @class
	 * @memberof! <global>
	 * @extends M_.Outlet
	 * @implements M_.Stored
	 * @property {String} autoLoad
	 * @property {String} tpl
	 */
	M_.List = function (_M_$Outlet3) {
		_inherits(_class11, _M_$Outlet3);
	
		function _class11(opts) {
			_classCallCheck(this, _class11);
	
			var defaults = {
				autoLoad: false,
				tpl: ''
			};
	
			// if (!opts.jEl && !opts.colsDef) log("jEl is mandatory in M_.List") ;
			// if (!opts.tpl && !opts.colsDef) log("tpl is mandatory in M_.List") ;
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			// $.extend(true, this.prototype, M_.Stored) ;
			var _this14 = _possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).call(this, opts));
	
			Object.mixin(_this14, M_.Stored);
			// log("store", Object.mixin)
			_this14.initStored();
	
			//this.render();
			return _this14;
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class11, [{
			key: 'updateStore',
			value: function updateStore() {
				this.render();
			}
			/**
	   * Redefine this method to render your UI
	   */
	
		}, {
			key: 'render',
			value: function render() {}
		}]);
	
		return _class11;
	}(M_.Outlet);
	
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
	M_.SimpleList = function (_M_$List) {
		_inherits(_class12, _M_$List);
	
		function _class12(opts) {
			_classCallCheck(this, _class12);
	
			var defaults = {
				classItems: 'M_SimpleListItem',
				itemValue: '',
				itemKey: '',
				selectionVisible: false,
				multipleSelection: false,
				currentSelection: [],
				dynamic: false,
				lineHeight: 34,
				loadLimit: 400,
				oddEven: true,
				// _startPosition: 0,
				itemsDraggableTo: false,
				_dragStarted: false,
				_lastSelection: null
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, optsTemp));
	
			// this.setSelection(this.currentSelection) ;
			// this.create() ;
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class12, [{
			key: 'updateStore',
			value: function updateStore() {
				_get(_class12.prototype.__proto__ || Object.getPrototypeOf(_class12.prototype), 'updateStore', this).call(this);
				this.setSelection(this.currentSelection);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'create',
			value: function create() {
				var _this16 = this;
	
				var html = "";
				html += '<div class=\'M_SimpleList\'>\n\t\t\t\t\t<div class=\'M_SimpleListContent\'>\n\t\t\t\t\t\t<div class=\'M_SimpleListContentFake1\'></div>\n\t\t\t\t\t\t<div class=\'M_SimpleListContentReal\'></div>\n\t\t\t\t\t\t<div class=\'M_SimpleListContentFake2\'></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
				this.jEl = $(html);
				this.container.append(this.jEl);
				if (!this.dynamic) this.jEl.find('.M_SimpleListContent').css('background-image', 'none');
	
				if (this.dynamic) {
					this.jEl.scroll(function (evt) {
						M_.Utils.delay(function () {
							var diff = _this16.jEl.offset().top - _this16.jEl.find('.M_SimpleListContent').offset().top;
							var _skipPosition = Math.ceil(diff / _this16.lineHeight) - Math.ceil(_this16.loadLimit / 4);
							if (_skipPosition < 0) _skipPosition = 0;
							_this16.store.reload(false, { skip: _skipPosition, limit: _this16.loadLimit });
						}, 100, 'm_simplelist_scroll');
					});
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'render',
			value: function render() {
				var _this17 = this;
	
				// log("render")
				var html = "",
				    mid = this.store.primaryKey;
				this.store.each(function (model, indexTemp) {
					// log("cg_created",model.get('cg_name'))
					var val = "";
					if ($.isFunction(_this17.itemValue)) val = _this17.itemValue(model);else val = model.get(_this17.itemValue);
					var clsTr = _this17.classItems;
					if (_this17.oddEven) {
						if (indexTemp % 2 === 0) clsTr += " M_TableListOdd";else clsTr += " M_TableListEven";
					}
					html += "<div class='" + clsTr + " M_Noselectable' data-m_id='" + model.get(mid) + "'>" + val + "</div>";
				});
				this.jEl.find('.M_SimpleListContentReal').html(html);
	
				// this.jEl.find('.'+this.classItems).m_draggable() ;
	
				// $("."+this.classItems).draggable({
				// 	cursor: "move",
				// 	cursorAt: { top: -12, left: -20 },
				// 	helper: function( event ) {
				// 		return $( "<div class='ui-widget-header' style='z-index:100000;'>I'm a custom helper</div>" );
				// 	}
				// });
	
				if (this.dynamic) {
					var totalHeight = this.lineHeight * this.store.countTotal();
					this.jEl.find('.M_SimpleListContent').height(totalHeight);
					this.jEl.find('.M_SimpleListContentFake1').height(this.store.skip * this.lineHeight);
				}
				// this.jEl.find('.M_SimpleListContentFake2').height(totalHeight - ((this._skipPosition+100)*this.lineHeight)) ;
	
				this.jEl.find("." + this.classItems).on('mousedown', function (evt) {
					// log("this.currentSelection",this.currentSelection)
					var item = $(evt.target).closest('.' + _this17.classItems);
					var m_id = item.attr('data-m_id');
					var model = _this17.store.getRow(m_id);
	
					if (_this17.trigger('beforeClickItem', _this17, m_id, model, evt) === false) return;
	
					var ok = true,
					    dontremoveselection = false;
					if (_this17.multipleSelection) {
						if (M_.Utils.isMacos && evt.metaKey || evt.ctrlKey) {
							// evt.preventDefault() ;
							// evt.stopPropagation() ;
							if (item.hasClass('selected')) ok = false;
						} else if (evt.shiftKey) {
							dontremoveselection = true;
							var lastIndex = _this17.store.getIndexById(_this17._lastSelection);
							var currentIndex = _this17.store.getIndexById(m_id);
							var min = Math.min(lastIndex, currentIndex);
							var max = Math.max(lastIndex, currentIndex);
							// var r =
							_this17.store.each(function (row, i) {
								if (i >= min && i <= max) {
									var m_idTemp = row.getId();
									_this17.jEl.find('.' + _this17.classItems + '[data-m_id="' + m_idTemp + '"]').addClass('selected');
									if (_this17.currentSelection.indexOf(m_idTemp) == -1) _this17.currentSelection.push(m_idTemp);
								}
							});
						} else {
							if (!item.hasClass('selected')) {
								_this17.jEl.find('.' + _this17.classItems).removeClass('selected');
								_this17.currentSelection = [];
							} else {
								dontremoveselection = true;
								ok = false;
							}
						}
					} else {
						_this17.jEl.find('.' + _this17.classItems).removeClass('selected');
						_this17.currentSelection = [];
					}
					if (ok) {
						item.addClass('selected');
						_this17.trigger('clickItem', _this17, m_id, model, evt);
						_this17._lastSelection = m_id;
						if (_this17.currentSelection.indexOf(m_id) == -1) _this17.currentSelection.push(m_id);
					} else {
						if (!dontremoveselection) {
							item.removeClass('selected');
							_this17.currentSelection.m_remove(m_id);
						}
					}
					// log("this.currentSelection",this.currentSelection)
	
	
					if (_this17.itemsDraggableTo) {
						// this.jEl.on('mousedown', (evt)=> {
						// 	// evt.preventDefault() ;
						// 	// evt.stopPropagation() ;
						$(document).on('mousemove', $.proxy(_this17.moveViewable, _this17));
						// }) ;
						$(document).on('mouseup', function (evt) {
							// log("this.viewable",this.viewable)
							if (_this17.viewable) _this17.viewable.remove();
							$(document).off('mousemove', $.proxy(_this17.moveViewable, _this17));
							$(document).off('mouseenter', _this17.itemsDraggableTo, $.proxy(_this17.enterViewable, _this17));
							$(document).off('mouseleave', _this17.itemsDraggableTo, $.proxy(_this17.leaveViewable, _this17));
							var elTemp = $(_this17.itemsDraggableTo + ".over");
							if (elTemp.length) {
								_this17.trigger('droped', elTemp, elTemp.attr('data-m_id'), _this17.getSelection());
								$(_this17.itemsDraggableTo).removeClass('over');
							}
							_this17._dragStarted = false;
						});
						$(document).on('mouseenter', _this17.itemsDraggableTo, $.proxy(_this17.enterViewable, _this17));
						$(document).on('mouseleave', _this17.itemsDraggableTo, $.proxy(_this17.leaveViewable, _this17));
						//  (evt)=> {
						// 	log("evt.target", $(evt.target))
						// }) ;
					}
				});
	
				// $( "#contacts_list_contacts .M_SimpleListContentReal" ).selectable();
				// this.jEl.find('.M_SimpleListContentReal').selectable();
				// this.jEl.find('.M_SimpleListContentReal').draggable();
				this.setSelection(this.currentSelection);
				this.trigger('render', this);
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'leaveViewable',
			value: function leaveViewable(evt) {
				$(evt.target).removeClass('over');
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'enterViewable',
			value: function enterViewable(evt) {
				// log("evt.target", $(evt.target))
				// $(this.itemsDraggableTo).removeClass('over') ;
				$(evt.target).addClass('over');
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'moveViewable',
			value: function moveViewable(evt) {
				evt.preventDefault();
				// log("this._dragStarted",this._dragStarted)
				if (!this._dragStarted) {
					var sel = this.getSelection();
					this.viewable = $("<div style='width:20px; height:20px; position:relative; z-index:100000;'><div class='M_Badge' style='right:-30px;'>" + sel.length + "</div><span class='fa fa-group' style='font-size:30px;'></span></div>");
					$("body").append(this.viewable);
				}
				this.viewable.offset({ top: evt.pageY, left: evt.pageX + 30 });
				this._dragStarted = true;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setSelection',
			value: function setSelection(m_id) {
				// log("setSelection",m_id)
				// if (!m_id) return ;
				if (!$.isArray(m_id)) m_id = [m_id];
				if (!this.multipleSelection) this.jEl.find('.' + this.classItems).removeClass('selected');
				var goodItem = [];
				for (var i = 0; i < m_id.length; i++) {
					// log("m_id[i]",m_id[i])
					goodItem = this.jEl.find('.' + this.classItems + '[data-m_id="' + m_id[i] + '"]');
					goodItem.addClass('selected');
				}
				// this.currentSelection = m_id ;
				if (this.selectionVisible && goodItem.length) {
					var posYRow = goodItem.position().top;
					var posYParent = goodItem.parent().position().top;
					// log(posYRow, posYParent)
					var goodContainer = goodItem.closest('.M_SimpleList');
					// log('goodContainer.scrollTop()',goodContainer.scrollTop())
					if (1 * (posYRow - posYParent) < goodContainer.scrollTop() || 1 * (posYRow - posYParent) > goodContainer.scrollTop() + goodContainer.height() - goodItem.height() - 30) {
						goodItem.closest('.M_SimpleList').animate({
							scrollTop: 1 * (posYRow - posYParent) - goodContainer.height() / 3
						}, 'slow');
					}
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getSelection',
			value: function getSelection() {
				var tabSelection = [];
				// log("this.currentSelection",this.currentSelection)
				for (var i = 0; i < this.currentSelection.length; i++) {
					var model = this.store.getRow(this.currentSelection[i]);
					tabSelection.push(model);
				}
				return tabSelection;
			}
		}]);
	
		return _class12;
	}(M_.List);
	
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
	M_.TableList = function (_M_$SimpleList) {
		_inherits(_class13, _M_$SimpleList);
	
		function _class13(opts) {
			_classCallCheck(this, _class13);
	
			var defaults = {
				colsDef: null,
				classHeader: 'M_TableListHeader',
				classItems: 'M_TableListItem',
				styleTable: '',
				fullHeight: true,
				limitRows: 0,
				moreText: "%n lignes de plus",
				lessText: "Masquer les lignes supplémentaires",
				withMouseOverRaw: true,
				headerHeight: 30,
				_colsToHide: []
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class13.__proto__ || Object.getPrototypeOf(_class13)).call(this, optsTemp));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class13, [{
			key: 'create',
			value: function create() {
				var _this19 = this;
	
				var html = "",
				    cls = "";
				if (this.fullHeight) cls += "M_FullHeight";
				if (this.withMouseOverRaw) cls += " M_TableListOverRaw";
				this._idMore = M_.Utils.id();
	
				html += '<div class=\'M_TableList ' + cls + '\' style=\'' + this.styleTable + '\'>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<table cellpadding="0" cellspacing="0">\n\t\t\t\t\t\t\t<thead></thead>\n\t\t\t\t\t\t\t<tbody></tbody>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="M_AlignRight"><a id="' + this._idMore + '" href=\'javascript:void(0);\'>' + this.getMoreText() + '</a></div>\n\t\t\t\t</div>';
				this.jEl = $(html);
				this.container.append(this.jEl);
				this.jEl.css('padding-top', this.headerHeight);
	
				this._limitRows = true;
				if (this.limitRows) {
					$("#" + this._idMore).parent().show();
					this._limitRows = true;
				} else {
					$("#" + this._idMore).parent().hide();
					this._limitRows = false;
				}
				$("#" + this._idMore).click(function () {
					// console.log("click");
					_this19._limitRows = !_this19._limitRows;
					_this19.render();
				});
			}
		}, {
			key: '_setMoreLessText',
			value: function _setMoreLessText() {
				if (this.limitRows) {
					if (this._limitRows) {
						$("#" + this._idMore).html(this.getMoreText());
					} else {
						$("#" + this._idMore).html(this.getLessText());
					}
					if (this._getNbRowsLimited() > 0) $("#" + this._idMore).show();else $("#" + this._idMore).hide();
				}
			}
		}, {
			key: '_getNbRowsLimited',
			value: function _getNbRowsLimited() {
				return this.store.count() - this.limitRows;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getMoreText',
			value: function getMoreText() {
				var val = this.moreText;
				val = val.replace(/%n/, this._getNbRowsLimited());
				return val;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getLessText',
			value: function getLessText() {
				var val = this.lessText;
				val = val.replace(/%n/, this._getNbRowsLimited());
				return val;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'render',
			value: function render() {
				var _this20 = this;
	
				var html = "",
				    mid = this.store.primaryKey,
				    colsDef = this.colsDef;
				html += "<tr>";
				for (var i = 0; i < colsDef.length; i++) {
					var cls = this.classHeader + " M_Noselectable";
					var style = "";
					if (colsDef[i].align && colsDef[i].align == 'right') cls += " M_AlignRight";
					if (colsDef[i].align && colsDef[i].align == 'center') cls += " M_AlignCenter";
					if (colsDef[i].align && colsDef[i].align == 'left') cls += " M_AlignLeft";
					if (!colsDef[i].align) cls += " M_AlignLeft";
					if (colsDef[i].width) {
						var w = "";
						if ($.type(colsDef[i].width) === "string") w = colsDef[i].width;else w = colsDef[i].width + "px";
						style += "width:" + w + "; ";
					}
					html += "<th data-m-col='" + i + "' class='" + cls + "' style='" + style + "'>" + colsDef[i].label;
					if (this.fullHeight) html += "<div style='" + style + "'>" + colsDef[i].label + "</div>";
					html += "</th>";
				}
				html += "</tr>";
				this.jEl.find('thead').empty().html(html);
	
				html = "";
				this.store.each(function (model, indexTemp) {
					// log("model",model)
					if (_this20.limitRows && indexTemp >= _this20.limitRows && _this20._limitRows) return true;
					var clsTr = "";
					if (_this20.oddEven) {
						if (indexTemp % 2 === 0) clsTr += " M_TableListOdd";else clsTr += " M_TableListEven";
					}
					html += "<tr class='" + clsTr + "'>";
					for (var i = 0; i < colsDef.length; i++) {
						var val = "",
						    _cls = _this20.classItems + " M_Noselectable";
						if ($.isFunction(colsDef[i].val)) {
							// console.log("model", model);
							val = colsDef[i].val(model);
						} else {
							if (model instanceof M_.Model) val = model.get(colsDef[i].val);else val = model[colsDef[i].val];
						}
						if (colsDef[i].align && colsDef[i].align == 'right') _cls += " M_AlignRight";
						if (colsDef[i].align && colsDef[i].align == 'center') _cls += " M_AlignCenter";
						if (colsDef[i].align && colsDef[i].align == 'left') _cls += " M_AlignLeft";
						var datamid = "";
						if (model instanceof M_.Model) datamid = model.get(mid);else datamid = model[mid];
						html += "<td class='" + _cls + "' data-m_id='" + datamid + "'>" + val + "</td>";
					}
					html += "</tr>";
				});
				this.jEl.find('tbody').empty().html(html);
	
				this.jEl.find("." + this.classHeader).on('click', function (evt) {
					// console.log("evt", evt);
					// this.store.sort()
					var item = $(evt.target).closest('.' + _this20.classHeader);
					var numcol = item.attr('data-m-col');
					var colDef = _this20.colsDef[numcol];
					if (colDef) {
	
						var direction = -1;
						if (colDef._sortDirection) direction = colDef._sortDirection;
						direction = direction * -1;
						colDef._sortDirection = direction;
						// console.log("colDef._sortDirection", colDef._sortDirection);
	
						if (colDef.sort) _this20.store.sort(colDef.sort, direction);else _this20.store.sort(colDef.val, direction);
						// this.render() ;
					}
				});
	
				this.jEl.find("." + this.classItems).on('click', function (evt) {
					// log("dddddddddddddd")
					var item = $(evt.target).closest('.' + _this20.classItems);
					var m_id = item.attr('data-m_id');
					var model = _this20.store.getRow(m_id);
	
					// get num col
					var col = item.index();
					var row = item.parent().index();
	
					if (_this20.trigger('beforeClickItem', _this20, m_id, model, evt, col, row) === false) return;
					// item.addClass('selected') ;
					_this20.trigger('clickItem', _this20, m_id, model, evt, col, row);
				});
				// this.jEl.find("tbody tr").on('mouseover', (evt)=> {
				// }) ;
				// this.jEl.find("tbody tr").on('mouseout', (evt)=> {
				// }) ;
	
				this._setMoreLessText();
	
				this.hideColumns(this._colsToHide);
	
				this.trigger('render', this, this.jEl);
			}
		}, {
			key: 'showAllColumns',
			value: function showAllColumns() {
				this._colsToHide = [];
				$("#" + this.id).find('tr td').show();
			}
		}, {
			key: 'showColumns',
			value: function showColumns(cols) {
				if (!$.isArray(cols)) cols = [cols];
				this._colsToHide = _.difference(this._colsToHide, cols);
				$("#" + this.id).find('tr td').show();
				$("#" + this.id).find('tr th').show();
				this.hideColumns(this._colsToHide);
			}
		}, {
			key: 'hideColumns',
			value: function hideColumns(cols) {
				var _this21 = this;
	
				if (!$.isArray(cols)) cols = [cols];
				this._colsToHide = this._colsToHide.concat(cols);
				this._colsToHide = _.uniq(this._colsToHide);
				// console.log("this._colsToHide", this._colsToHide);
				_.each(this._colsToHide, function (col) {
					$("#" + _this21.id).find('tr td:nth-child(' + col + ')').hide();
					$("#" + _this21.id).find('tr th:nth-child(' + col + ')').hide();
				});
			}
		}]);
	
		return _class13;
	}(M_.SimpleList);
	
	/**
	 * Implements this to get CRUD (get/post/put/delete) ajax requests
	 * @interface
	 * @memberof! <global>
	 */
	M_.CRUD = {
		/**
	  * @return {type}
	  */
		initCRUD: function initCRUD() {
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
		load: function load(id) {
			var _this22 = this;
	
			var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
			this._callbackFormLoaded = callback;
			//this.callbackLoadRow = callback ;
			var okArgs = {};
			//var okArgs = {action: 'get'} ;
			//okArgs[this.primaryKey] = id ;
			$.extend(okArgs, this.args, args);
			if (this.onBeforeLoad) this.onBeforeLoad();
			if (this.trigger("beforeLoad", this, { url: this.url, args: okArgs }) === false) return false;
			//this.lastLoadArgs = okArgs ;
			var url = this.url;
			if (id) url += "/" + id;
			// alert("this.useWebsocket",this.useWebsocket)
			if (this.useWebsocket) {
				io.socket.get(url, okArgs, function (data, jwres) {
					_this22._treatDataCrud(data, callback);
				});
			} else {
				if (this.ajaxLoad) {
					this.ajaxLoad.abort();
					// console.log("abord");
				}
				this.ajaxLoad = M_.Utils.getJson(url, okArgs, function (data) {
					_this22._treatDataCrud(data, callback);
				});
				// this.ajaxLoad = $.ajax({
				// 	url: url,
				// 	type: 'GET',
				// 	//contentType: 'application/json',
				// 	data: okArgs,
				// 	dataType: 'json',
				// 	success: (data)=> {
				// 		this._treatDataCrud(data, callback) ;
				// 	}
				// });
			}
		},
		_treatDataCrud: function _treatDataCrud(data, callback) {
			// log("_treatDataCrud",data)
			var row = null;
			if (data && data.data) row = data.data;else row = data;
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
	
		/**
	  * @param  {type}
	  * @param  {Object}
	  * @param  {Function}
	  * @return {type}
	  */
		save: function save() {
			var modelOrData = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
			var _this23 = this;
	
			var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
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
			var okArgs = { action: 'save' };
			$.extend(okArgs, this.args, args, data);
			if (this.trigger("beforeSave", this, { url: this.url, args: okArgs }) === false) return false;
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
			var method = 'POST';
			var moreUrl = '';
			if (this.model) {
				var modelTemp = new this.model({ row: {} });
				if (!_.isEmpty(okArgs[modelTemp.primaryKey])) {
					method = 'PUT';
					moreUrl = '/' + okArgs[modelTemp.primaryKey];
				}
				// log("this.model.primaryKey",modelTemp.primaryKey,okArgs)
			}
			// return ;
			// var formData = new FormData() ;
			// for(key in okArgs) {
			// 	formData.append(key, okArgs[key]) ;
			// }
	
			M_.Utils.ajaxJson(this.url + moreUrl, okArgs, method, function (data) {
				// log("dataaaaa",data)
				if (data.error) {
					var errTxt = "";
					if (data.error == "E_VALIDATION") {
						_.each(data.invalidAttributes, function (attr, key) {
							errTxt += key + " : ";
							_.each(attr, function (msg) {
								errTxt += msg.message;
							});
							errTxt += "\n";
						});
					}
					if (_this23.informValidReturnSails) _this23.informValidReturnSails(data);
					_this23.trigger("error", _this23, data, errTxt);
				} else {
					_this23.trigger("save", _this23, data);
					if (_this23._callbackFormSaved) _this23._callbackFormSaved(data);
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
		delete: function _delete(id) {
			var _this24 = this;
	
			var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
			this._callbackFormDelete = callback;
			var okArgs = {};
			$.extend(okArgs, this.args, args);
			if (this.trigger("beforeDelete", this, { url: this.url, args: okArgs }) === false) return false;
			M_.Utils.deleteJson(this.url + "/" + id, okArgs, function (data) {
				_this24.trigger("delete", _this24, data);
				if (_this24._callbackFormDelete) _this24._callbackFormDelete(data);
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
	M_.Drawer = function () {
		function _class14(opts) {
			var _this25 = this;
	
			_classCallCheck(this, _class14);
	
			var defaults = {
				jEl: null,
				alignTo: null,
				position: 'bottom',
				height: 45,
				width: 45,
				speed: 300,
				visible: false,
				floating: true
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			$(window).resize(function () {
				if (_this25.tsResize) window.clearTimeout(_this25.tsResize);
				_this25.tsResize = window.setTimeout(function () {
					if (_this25.floating) _this25.showOrHide(_this25.visible, false);
				}, 100);
			});
		}
		/**
	  * @return {Boolean}
	  */
	
	
		_createClass(_class14, [{
			key: 'isVisible',
			value: function isVisible() {
				return this.visible;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'show',
			value: function show() {
				if (this.visible) return;
				if (this.trigger('beforeShow', this) === false) return;
				this.showOrHide(true);
				this.trigger('show', this);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				if (!this.visible) return;
				if (this.trigger('beforeHide', this) === false) return;
				this.showOrHide(false);
				this.trigger('hide', this);
			}
			/**
	   * @param  {type}
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'showOrHide',
			value: function showOrHide(ok) {
				var anim = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
				var top, left, topStart, leftStart;
				this.jEl.outerWidth(this.width);
				this.jEl.outerHeight(this.height);
	
				if (!this.floating && !ok) {
					this.alignTo.height("100%");
				}
				this.jEl.css('position', 'absolute');
	
				if (this.position == 'bottom') {
					this.jEl.outerWidth(this.alignTo.outerWidth());
					top = this.alignTo.offset().top + this.alignTo.outerHeight() - this.jEl.outerHeight();
					left = this.alignTo.offset().left;
					topStart = top + this.jEl.outerHeight();
					leftStart = left;
				}
				if (this.position == 'top') {
					this.jEl.outerWidth(this.alignTo.outerWidth());
					top = this.alignTo.offset().top;
					left = this.alignTo.offset().left;
					topStart = top - this.jEl.outerHeight();
					leftStart = left;
				}
				if (this.position == 'left') {
					this.jEl.outerHeight(this.alignTo.outerHeight());
					top = this.alignTo.offset().top;
					left = this.alignTo.offset().left;
					topStart = top;
					leftStart = left - this.jEl.outerWidth();
				}
				if (this.position == 'right') {
					this.jEl.outerHeight(this.alignTo.outerHeight());
					top = this.alignTo.offset().top;
					left = this.alignTo.offset().left + this.alignTo.outerWidth() - this.jEl.outerWidth();
					topStart = top;
					leftStart = left - this.jEl.outerWidth();
				}
				if (anim) {
					if (ok) {
						this.jEl.show().offset({ top: topStart, left: leftStart }).transition({ top: top, left: left }, M_.Utils.getSpeedAnim(), function () {
							// log("finis")
						});
					} else {
						this.jEl.offset({ top: top, left: left }).transition({ top: topStart, left: leftStart }, M_.Utils.getSpeedAnim());
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
					if (ok) this.jEl.offset({ top: top, left: left });else this.jEl.offset({ top: topStart, left: leftStart });
				}
	
				if (!this.floating && ok) {
					this.alignTo.height("calc(100% - " + this.height + "px)");
				}
	
				this.visible = ok;
			}
		}]);
	
		return _class14;
	}();
	
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
	M_.Modal = function () {
		function _class15(opts) {
			var _this26 = this;
	
			_classCallCheck(this, _class15);
	
			var defaults = {
				visible: false,
				focusOn: false,
				clickHide: false,
				alpha: 0.5,
				zindex: 500,
				isLoading: null
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			$(window).resize(function () {
				if (_this26.tsResize) window.clearTimeout(_this26.tsResize);
				_this26.tsResize = window.setTimeout(function () {
					_this26.showOrHide(_this26.visible, false);
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
					this.jEl1.click(function () {
						_this26.hide();
					});
					this.jEl2.click(function () {
						_this26.hide();
					});
					this.jEl3.click(function () {
						_this26.hide();
					});
					this.jEl4.click(function () {
						_this26.hide();
					});
				}
			} else {
				this.jEl = $("<div class='M_Modal'></div>");
				$("body").append(this.jEl);
				if (this.clickHide) {
					this.jEl.click(function () {
						_this26.hide();
					});
				}
				if (this.isLoading) {
					this.jEl.html("<div style='width:300px;margin:200px auto 0 auto; text-align:center;'><i style='font-size:100px;' class='fa fa-clock-o faa-spin animated'></i><br><h1 style='color:white;'>" + this.isLoading + "</h1></div>");
				}
			}
		}
		/**
	  * @return {Boolean}
	  */
	
	
		_createClass(_class15, [{
			key: 'isVisible',
			value: function isVisible() {
				return this.visible;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'show',
			value: function show() {
				if (this.trigger('beforeShow', this) === false) return false;
				this.showOrHide(true);
				this.trigger('show', this);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				if (this.trigger('beforeHide', this) === false) return false;
				this.showOrHide(false);
				this.trigger('hide', this);
			}
			/**
	   * @param  {type}
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'showOrHide',
			value: function showOrHide(ok) {
				var _this27 = this;
	
				var anim = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
				var speed = M_.Utils.getSpeedAnim();
				if (this.focusOn) {
					if (ok) {
						var posTop1 = this.focusOn.offset().top;
						var posTop2 = this.focusOn.offset().top + this.focusOn.outerHeight();
						var posTop3 = $(window).height();
						var posLeft1 = this.focusOn.offset().left;
						var posLeft2 = this.focusOn.offset().left + this.focusOn.outerWidth();
						var posLeft3 = $(window).width();
						this.jEl1.css({ 'z-index': this.zindex, top: 0, left: 0, width: '100%', height: posTop1 }).transition({ opacity: this.alpha }, speed);
						this.jEl2.css({ 'z-index': this.zindex, top: posTop1, left: 0, width: posLeft1, height: posTop2 - posTop1 }).transition({ opacity: this.alpha }, speed);
						this.jEl3.css({ 'z-index': this.zindex, top: posTop1, left: posLeft2, width: posLeft3 - posLeft2, height: posTop2 - posTop1 }).transition({ opacity: this.alpha }, speed);
						this.jEl4.css({ 'z-index': this.zindex, top: posTop2, left: 0, width: '100%', height: posTop3 - posTop2 }).transition({ opacity: this.alpha }, speed);
					} else {
						this.jEl1.css({ 'z-index': this.zindex }).transition({ opacity: 0 }, speed, function () {
							_this27.jEl1.remove();
							_this27.jEl2.remove();
							_this27.jEl3.remove();
							_this27.jEl4.remove();
						});
						this.jEl2.css({ 'z-index': this.zindex }).transition({ opacity: 0 }, speed);
						this.jEl3.css({ 'z-index': this.zindex }).transition({ opacity: 0 }, speed);
						this.jEl4.css({ 'z-index': this.zindex }).transition({ opacity: 0 }, speed);
					}
				} else {
					if (ok) this.jEl.css({ 'z-index': this.zindex }).show().transition({ opacity: this.alpha }, speed);else this.jEl.transition({ opacity: 0 }, speed, function () {
						_this27.jEl.remove();
					});
				}
				this.visible = ok;
			}
		}]);
	
		return _class15;
	}();
	
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
	M_.Window = function () {
		function _class16(opts) {
			var _this28 = this;
	
			_classCallCheck(this, _class16);
	
			var defaults = {
				visible: false,
				clickHide: false,
				alpha: 0.5,
				zindex: M_.Utils.getNextZIndex(),
				width: 400,
				maxWidth: 0,
				height: 'auto',
				minHeight: false,
				html: null,
				tpl: null,
				tplData: {},
				tplPartials: {},
				cls: '',
				modal: true,
				animFrom: null,
				top: 100,
				left: 0,
				position: 'center',
				offsetPositionRight: 20,
				offsetPositionLeft: 20,
				offsetPositionTop: 20,
				offsetPositionBottom: 20
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			$(window).resize(function () {
				if (_this28.tsResize) window.clearTimeout(_this28.tsResize);
				_this28.tsResize = window.setTimeout(function () {
					// this.showOrHide(this.visible, false) ;
				}, 100);
			});
	
			this.create();
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class16, [{
			key: 'create',
			value: function create() {
				this.jEl = $("<div class='M_Window'></div>").hide();
				$("body").append(this.jEl);
	
				// if (this.width=='auto') this.width = '100%' ;
	
				if (this.minHeight) this.jEl.css({
					'min-height': this.minHeight
				});
	
				this.jEl.css({
					'z-index': this.zindex,
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
	
		}, {
			key: 'findEl',
			value: function findEl(selector) {
				return this.jEl.find(selector);
			}
	
			/**
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isVisible',
			value: function isVisible() {
				return this.visible;
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'show',
			value: function show() {
				var anim = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
				if (this.trigger('beforeShow', this) === false) return false;
				this.showOrHide(true, anim);
				this.trigger('show', this);
				M_.Window._lastWindow = this;
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				var anim = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
				if (this.trigger('beforeHide', this) === false) return false;
				this.showOrHide(false, anim);
				this.trigger('hide', this);
				M_.Window._lastWindow = null;
			}
		}, {
			key: 'maximize',
			value: function maximize() {
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
	
		}, {
			key: 'center',
			value: function center() {
				this.jEl.height('auto');
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
	
		}, {
			key: 'showOrHide',
			value: function showOrHide(ok) {
				var _this29 = this;
	
				var anim = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
				// log("showOrHide")
				var speed = M_.Utils.getSpeedAnim();
				if (ok) {
					this.zindex = M_.Utils.getNextZIndex();
					if (this.modal && !this.modalObj) {
						this.modalObj = new M_.Modal({
							clickHide: this.clickHide,
							alpha: this.alpha,
							zindex: this.zindex - 1,
							listeners: [['beforeHide', function () {
								if (_this29.trigger('beforeHide', _this29) === false) return false;
							}]]
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
	
					this.jEl.addClass(this.cls).css({
						scale: 1,
						opacity: 0,
						'z-index': this.zindex,
						left: 0,
						top: 0,
						width: w1,
						height: h1
					}).show();
					// log("this.jEl.height()",this.jEl.height(), $(window).height())
	
					if (this.maxWidth !== 0) {
						// w1 = w2 = this.maxWidth ;
						this.jEl.css({
							'max-width': this.maxWidth
						});
					}
					if (this.jEl.outerHeight() + 100 > $(window).height()) {
						h1 = h2 = $(window).height() - 100;
					}
					if (this.position == 'center' || this.position == 'top') {
						l1 = l2 = ($(window).width() - this.jEl.outerWidth()) / 2;
						if (h2 == 'auto') t1 = t2 = ($(window).height() - this.jEl.height()) / 2;else t1 = t2 = ($(window).height() - h2) / 2;
					}
					if (this.position == 'top') {
						s1 = 1;
						o1 = 1;
						if (h2 == 'auto') {
							t1 = -1 * this.jEl.height() - this.offsetPositionTop;
						} else {
							t1 = h2 - 30;
						}
						t2 = this.offsetPositionTop;
					}
					this.jEl.addClass(this.cls).css({ scale: s1, opacity: o1, left: l1, top: t1, width: w1, height: h1 }).show().transition({ scale: s2, opacity: o2, left: l2, top: t2, width: w2 + 1, height: h2 }, speed, function () {
						// this.jEl.outerWidth(this.width+1);
					});
				} else {
					this.jEl.transition({ scale: 0.5, opacity: 0 }, speed, function () {
						_this29.jEl.hide();
					});
					if (this.modalObj) {
						this.modalObj.hide();
						this.modalObj = null;
					}
				}
				this.visible = ok;
			}
		}], [{
			key: '_escapeButtonListener',
			value: function _escapeButtonListener() {
				M_.Window._lastWindow = null;
				$(document).keydown(function (evt) {
					if (evt.keyCode == 27) {
						if (M_.Window._lastWindow) {
							M_.Window._lastWindow.hide();
						}
					}
				});
			}
		}]);
	
		return _class16;
	}();
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
	M_.Button = function (_M_$Outlet4) {
		_inherits(_class17, _M_$Outlet4);
	
		function _class17(opts) {
			_classCallCheck(this, _class17);
	
			var defaults = {
				text: "Save",
				cls: "primary",
				handler: null
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class17.__proto__ || Object.getPrototypeOf(_class17)).call(this, optsTemp));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class17, [{
			key: 'create',
			value: function create() {
				var html = '<button class="M_Button ' + this.cls + '" id="' + this.id + '">' + this.text + '</button>';
				this.jEl = $(html);
				this.container.append(this.jEl);
				if (this.handler) this.jEl.click(this.handler);
			}
		}]);
	
		return _class17;
	}(M_.Outlet);
	
	/**
	 * Display a alert dialog window or a confirm dialog window
	 * @memberof! <global>
	 * @property {type} textButtonOk
	 * @property {type} textButtonCancel
	 */
	M_.Dialog = new (function () {
		function _class18(opts) {
			_classCallCheck(this, _class18);
	
			this.defaults = {
				textButtonOk: "OK",
				textButtonCancel: "Annuler"
			};
			opts = opts ? opts : {};
			$.extend(this, this.defaults, opts);
		}
	
		_createClass(_class18, [{
			key: '_createTemplate',
			value: function _createTemplate(title, text) {
				var icon = arguments.length <= 2 || arguments[2] === undefined ? 'fa-warning' : arguments[2];
	
				var html = '<div style="overflow:auto; height:90%;">\n\t\t\t\t\t\t<h1 style="line-height:22px;">' + title + '</h1>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<div class=\'M_FloatLeft\' style=\'width:25%\'><span class=\'fa ' + icon + ' M_IconBig\'></span></div>\n\t\t\t\t\t\t\t<div class=\'M_FloatLeft\' style=\'width:75%\'>' + text + '</div>\n\t\t\t\t\t\t\t<div class=\'M_Clear\'></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
				return html;
			}
			/**
	   * @param  {type}
	   * @param  {type}
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'alert',
			value: function alert(title, text, callbackOk) {
				var _this31 = this;
	
				// this.callbackOk = callbackOk ;
				var html = this._createTemplate(title, text);
				html += '<div class="M_margintop">\n\t\t\t\t\t\t<div class=\'M_FloatRight\'>\n\t\t\t\t\t\t\t<button type="button" class=\'M_DialogOK M_Button primary\'>' + this.textButtonOk + '</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\'M_Clear\'></div>\n\t\t\t\t\t</div>';
				this.win = new M_.Window({
					html: html
				});
				this.win.show();
				this.win.jEl.find('.M_DialogOK').click(function () {
					if (callbackOk) callbackOk();
					_this31.win.hide();
				});
			}
			/**
	   * @param  {type}
	   * @param  {type}
	   * @param  {type}
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'confirm',
			value: function confirm(title, text, callbackOk, callbackCancel) {
				var _this32 = this;
	
				// this.callbackOk = callbackOk ;
				// this.callbackCancel = callbackCancel ;
				var html = this._createTemplate(title, text);
				html += '<div class="M_margintop">\n\t\t\t\t\t\t<div class=\'M_FloatRight\'>\n\t\t\t\t\t\t\t<button type="button" class=\'M_DialogOK M_Button primary\'>' + this.textButtonOk + '</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\'M_FloatRight\'>\n\t\t\t\t\t\t\t<button type="button" class=\'M_DialogCancel M_ModalCancel M_Button\'>' + this.textButtonCancel + '</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\'M_Clear\'></div>\n\t\t\t\t\t</div>';
				this.win = new M_.Window({
					html: html
				});
				this.win.show();
				this.win.jEl.find('.M_DialogOK').click(function () {
					if (callbackOk) callbackOk.apply(_this32);
					_this32.win.hide();
				});
				this.win.jEl.find('.M_DialogCancel').click(function () {
					if (callbackCancel) callbackCancel.apply(_this32);
					_this32.win.hide();
				});
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.win.hide();
			}
			/**
	   * alert user
	   * @param  {String} text
	   * @param  {String} position
	   * @param  {Number} time      number of milliseconds
	   * @param  {Function} callbackClose
	   */
	
		}, {
			key: 'notify',
			value: function notify(text) {
				var time = arguments.length <= 1 || arguments[1] === undefined ? 2000 : arguments[1];
	
				var _this33 = this;
	
				var position = arguments.length <= 2 || arguments[2] === undefined ? 'top' : arguments[2];
				var callbackClose = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	
				var html = "";
				html += '<div class="">\n\t\t\t\t\t\t\t' + text + '\n\t\t\t\t\t\t</div>';
				this.win = new M_.Window({
					html: html,
					modal: false,
					position: 'top'
				});
				this.win.jEl.click(function () {
					_this33.win.hide();
				});
				window.setTimeout(function () {
					if (callbackClose) callbackClose();
					_this33.win.hide();
				}, time);
				this.win.show();
			}
		}]);
	
		return _class18;
	}())();
	
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
	M_.Dropdown = function (_M_$Outlet5) {
		_inherits(_class19, _M_$Outlet5);
	
		function _class19(opts) {
			_classCallCheck(this, _class19);
	
			var defaults = {
				destroyOnHide: true,
				_visible: false,
				alignTo: null,
				offsetTop: 0,
				offsetLeft: 0,
				container: 'body',
				alwaysDropdownBelow: false,
				constraints: $(window),
				autoSize: true,
				autoShow: false,
				items: [],
				html: null,
				itemsClass: '',
				drawEachItem: null,
				// id: null,
				_items: [],
				width: 0
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class19.__proto__ || Object.getPrototypeOf(_class19)).call(this, optsTemp));
	
			// this.create() ;
		}
	
		_createClass(_class19, [{
			key: 'drawItem',
			value: function drawItem(item, i, ul, items) {
				var _this35 = this;
	
				if (this.drawEachItem) return this.drawEachItem.call(this, item, i, ul, items);
				if (!item.text || item.text == '_m_separation') {
					ul.append($('<li class="M_DropdownSeparation"></li>'));
					return;
				}
				var more = "";
				if (item.disabled) more += " disabled";
				if (this.itemsClass) more += " " + this.itemsClass;
				if (item.cls) more += " " + item.cls;
				var htmlItem = '<li class="M_DropdownMenu ' + more + '">' + item.text + '</li>';
				var jElItem = $(htmlItem);
				// jElItem.data('indexitem', i) ;
				ul.append(jElItem);
				if (item.click && !item.disabled) {
					jElItem.click({ fn: item }, function (evt) {
						// var el = $(evt.target).closest('.M_DropdownMenu') ;
						evt.data.fn.click(evt, evt.data.fn);
						_this35.hide();
					});
				}
			}
			/**
	   * @function setItems
	   * @memberOf! M_.Dropdown
	   * @instance
	   * @param {type}
	   */
	
		}, {
			key: 'setItems',
			value: function setItems(items) {
				this.jEl.empty();
				this.jEl.height('auto');
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
	
		}, {
			key: 'create',
			value: function create() {
				var _this36 = this;
	
				// console.log("create");
				var html = '<div class="M_Relative"><div id="' + this.id + '" class="M_Dropdown"></div></div>';
				// log("this.container",this.container)
				$(this.container).append(html);
				this.jEl = $(this.container).find(".M_Dropdown");
				this.jEl.css('z-index', M_.Utils.getNextZIndex());
				if (this.width > 0) this.jEl.width(this.width);
	
				if (this.items.length) this.setItems(this.items);else if (this.html) this.jEl.html(this.html);
	
				// if (this.autoShow) this.show() ;
	
				this.jEl.on('M_DropdownHide', function (evt) {
					// log("M_DropdownHide")
					// evt.stopPropagation() ;
					_this36.hide();
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
	
		}, {
			key: 'show',
			value: function show() {
				// log("show",this._visible)
				// var evt = $.Event('click') ;
				// evt.stopPropagation() ;
				// log("show", this._visible, this.jEl)
				// window.event.stopPropagation();
				// M_.Dropdown.closeAllDropdown() ;
				if (this._visible) return;
				if (this.trigger('beforeShow', this) === false) return false;
				this.showOrHide(true);
				this.trigger('show', this);
			}
			/**
	   * @function hide
	   * @memberOf! M_.Dropdown
	   * @instance
	   * @return {type}
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				// log("hide", this.destroyOnHide, this.jEl.get(0).id)
				// log("hide ",this._visible, this.jEl)
				if (!this._visible) return;
				if (this.trigger('beforeHide', this) === false) return false;
				this.showOrHide(false);
				this.trigger('hide', this);
			}
			/**
	   * @function isVisible
	   * @memberOf! M_.Dropdown
	   * @instance
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isVisible',
			value: function isVisible() {
				return this._visible;
			}
		}, {
			key: '_waitEndClose',
			value: function _waitEndClose() {
				var _this37 = this;
	
				window.setTimeout(function () {
					_this37._waitEndClose();
				}, 10);
			}
			/**
	   * @function realign
	   * @memberOf! M_.Dropdown
	   * @instance
	   * @return {type}
	   */
	
		}, {
			key: 'realign',
			value: function realign() {
				this._setPosition();
			}
		}, {
			key: '_setPosition',
			value: function _setPosition() {
	
				// search parent overflow with auto or hidden
				var rettemp = this.jEl.parents().filter(function () {
					if ($(this).css('overflow') === 'auto' || $(this).css('overflow') === 'hidden') return true;
					return false;
				}).first();
				// var compareTo = {top: $(window).scrollTop(), height: $(window).height()} ;
				// if (rettemp.length) compareTo = {top: }
				var compareTo = $("body"); // work because body height == window height !!!!
				if (rettemp.length) compareTo = rettemp;
	
				this.jEl.height('auto');
	
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
						var maxh = top - topCompareTo - 35;
						var moreH = 0;
						if (h > maxh && this.autoSize) {
							h = maxh;
							this.jEl.height(h - 50);
						} else moreH = 30;
						t = top - h - moreH;
						this.jEl.offset({ top: t, left: l });
					} else {
						// more big bottom
						var _maxh = topCompareTo + hCompareTo - top - 25;
						if (h > _maxh && this.autoSize) {
							h = _maxh;
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
	
		}, {
			key: 'showOrHide',
			value: function showOrHide(ok) {
				// log("showOrHide",ok,this.jEl)
				var speed = M_.Utils.getSpeedAnim();
				if (ok) {
					// this.jEl.show().css({opacity:0}).offset({top, left}).transition({opacity:1}) ;
					M_.Dropdown.closeAllDropdown();
					// log("this.jEl",this.jEl)
					this.jEl.show().css({ opacity: 0.5 }).transition({ opacity: 1 }, speed);
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
	
		}, {
			key: 'destroy',
			value: function destroy() {
				// log("destroy");
				// $(document).off('click', $.proxy(this.onDocumentClick, this)) ;
				this.jEl.parent().remove();
				this.trigger('destroy', this);
			}
			/**
	   * @return {type}
	   */
	
		}], [{
			key: 'closeAllDropdown',
			value: function closeAllDropdown() {
				// log("closeAllDropdown")
				$('.M_Dropdown').trigger('M_DropdownHide');
				// if (this.tabDropdowns) {
				// 	for(var i=0 ; i<this.tabDropdowns.length ; i++) {
				// 		if (this.tabDropdowns[i]) this.tabDropdowns[i].hide() ;
				// 	}
				// }
			}
		}, {
			key: '_goGlobalListeners',
			value: function _goGlobalListeners() {
				var _this38 = this;
	
				$(document).on('click', '.M_Dropdown', function (evt) {
					M_.Help.hideMHelp();
					evt.stopPropagation();
				}).on('click', function (evt) {
					M_.Help.hideMHelp();
					// log("clickDocument")
					// if ($(evt.target).closest('.M_Dropdown').length===0) {
					_this38.closeAllDropdown();
					// $('.M_Dropdown').trigger('M_DropdownHide') ;
					// }
				});
			}
		}]);
	
		return _class19;
	}(M_.Outlet);
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
	M_.CalendarMonth = function () {
		function _class20(opts) {
			_classCallCheck(this, _class20);
	
			var defaults = {
				container: null,
				dateViewed: moment(),
				dateSelected: moment(),
				renderCellDay: null,
				// disabledDatesTo: null,
				// disabledDatesFrom: null,
				disabledDates: null,
				dateFormat: 'DD/MM/YYYY',
				dateFormatFrom: 'YYYY-MM-DD',
				firstDay: 1, //0=sunday, 1=monday
				noDays: false,
				noMonths: false,
				_thefirstDay: null,
				_thelastDay: null,
				allways6lines: false,
				cls: '',
				_cls: '',
				displayHeader: true,
				selectable: true,
				showDateSelected: true,
				showDateViewed: true,
				showWeekNumber: false,
				selectWeek: false
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
	
			this.create();
		}
		// tpl: 'tpl_M_CalendarMonth',
	
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class20, [{
			key: 'create',
			value: function create() {
				var html = '<div class="M_CalendarMonth ' + this._cls + ' ' + this.cls + '">\n\t\t\t<div class="M_CalendarMonth_days">\n\t\t\t\t<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_date">Date</div>\n\t\t\t\t<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_content"></div>\n\t\t\t</div>\n\t\t\t<div class="M_CalendarMonth_months">\n\t\t\t\t<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_date">Date</div>\n\t\t\t\t<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_content"></div>\n\t\t\t</div>\n\t\t\t<div class="M_CalendarMonth_years">\n\t\t\t\t<div class="M_CalendarMonth_previous"><span class="fa fa-arrow-circle-left"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_date">Date</div>\n\t\t\t\t<div class="M_CalendarMonth_next"><span class="fa fa-arrow-circle-right"></span></div>\n\t\t\t\t<div class="M_CalendarMonth_content"></div>\n\t\t\t</div>\n\t\t</div>';
	
				this.jEl = $(html);
				this.container.append(this.jEl);
				this.redraw();
	
				if (!this.displayHeader) this.container.find('.M_CalendarMonth_date, .M_CalendarMonth_previous, .M_CalendarMonth_next').hide();else this.container.find('.M_CalendarMonth_date, .M_CalendarMonth_previous, .M_CalendarMonth_next').show();
			}
			/**
	   * @param {type}
	   * @param {type}
	   */
	
		}, {
			key: 'setDateViewed',
			value: function setDateViewed(dateViewed, dateSelected) {
				this.dateViewed = dateViewed;
				// log("this.dateViewed",this.dateViewed)
				if (dateSelected) this.dateSelected = dateSelected;
				this.redraw();
			}
			/**
	   * @param {type}
	   * @param {type}
	   */
	
		}, {
			key: 'setDateSelected',
			value: function setDateSelected(dateSelected, dateViewed) {
				this.dateSelected = dateSelected;
				if (dateViewed) this.dateViewed = dateViewed;
				this.redraw();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getDateSelected',
			value: function getDateSelected() {
				return moment(this.dateSelected);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'redraw',
			value: function redraw() {
				this.showDays();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'showYears',
			value: function showYears() {
				var _this39 = this;
	
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
					html += "<td " + active + " data-m-date='" + dActu.format('YYYY-MM-DD') + "'>" + dActu.year() + "</td>";
					if (i % 4 === 3) html += "</tr>";
				}
				html += "</table>";
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content").html(html);
	
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_date").html(yearStart + 1 + " - " + (yearStart + 11));
	
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content td").off('click');
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_content td").on('click', function (evt) {
					var d = $(evt.target).attr("data-m-date");
					_this39.selectYear(d);
				});
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_next").off('click');
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_next").on('click', function (evt) {
					_this39.nextYears();
				});
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_previous").off('click');
				this.jEl.find(".M_CalendarMonth_years .M_CalendarMonth_previous").on('click', function (evt) {
					_this39.previousYears();
				});
				this.trigger('viewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'previousYears',
			value: function previousYears() {
				this.dateViewed.add(-10, 'years'); //  = new Date(this.dateViewed.getFullYear()*1-10, this.dateViewed.getMonth(), 1) ;
				this.showYears();
				this.trigger('yearViewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'nextYears',
			value: function nextYears() {
				this.dateViewed.add(10, 'years'); //this.dateViewed = new Date(this.dateViewed.getFullYear()*1+10, this.dateViewed.getMonth(), 1) ;
				this.showYears();
				this.trigger('yearViewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'selectYear',
			value: function selectYear(date) {
				// if ($.type(date)=="string") date = moment(date) ; //date = M_.Utils.parseDate(date, 'Y-m-d') ;
				this.dateViewed = moment(date);
				if (this.noMonths) {
					date.month(0).date(1);
					//this.selectDate(date) ;
					this.trigger("selected", this, moment(date));
				} else {
					this.showMonths();
					this.trigger('yearViewedChanged', this, moment(this.dateViewed));
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'showMonths',
			value: function showMonths() {
				var _this40 = this;
	
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
						var dTemp3 = moment(dActu).endOf('month');
						moreD += "<br>(S" + dActu.week() + " - S" + dTemp3.week() + ")";
					}
					html += "<td " + active + " data-m-date='" + dActu.format('YYYY-MM-DD') + "'>" + tabMonths[i] + moreD + "</td>";
					if (i % 3 == 2) html += "</tr>";
				}
				html += "</table>";
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content").html(html);
	
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_date").html(this.dateViewed.year() + " <span class='fa fa-arrow-circle-down'></span>");
	
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content td").off('click');
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_content td").on('click', function (evt) {
					var d = $(evt.target).attr("data-m-date");
					_this40.selectMonth(d);
				});
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_next").off('click');
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_next").on('click', function (evt) {
					_this40.nextYear();
				});
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_date").off('click');
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_date").on('click', function (evt) {
					_this40.showYears();
				});
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_previous").off('click');
				this.jEl.find(".M_CalendarMonth_months .M_CalendarMonth_previous").on('click', function (evt) {
					_this40.previousYear();
				});
				this.trigger('viewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'selectMonth',
			value: function selectMonth(date) {
				// if ($.type(date)=="string") date = moment(date) ;
				this.dateViewed = moment(date);
				if (this.noDays) {
					this.dateViewed.date(1);
					//this.selectDate(date) ;
					this.trigger("selected", this, moment(this.dateViewed));
				} else {
					this.showDays();
					this.trigger('dateViewedChanged', this, moment(this.dateViewed));
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'previousYear',
			value: function previousYear() {
				var d = this.dateViewed.date();
				if (this.dateViewed.date() * 1 > 28) d = 28;
				this.dateViewed.subtract(1, 'years');
				this.showMonths();
				this.trigger('yearViewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'nextYear',
			value: function nextYear() {
				var d = this.dateViewed.date();
				if (this.dateViewed.date() * 1 > 28) d = 28;
				this.dateViewed.add(1, 'years');
				this.showMonths();
				this.trigger('yearViewedChanged', this, moment(this.dateViewed));
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'showDays',
			value: function showDays() {
				var _this41 = this;
	
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
				var firstDate = moment({ year: year, month: month, day: 1 }).startOf('day');
				var decalage = 0;
				// log("firstDate",firstDate,decalage)
				for (i = 1; i <= 7; i++) {
					if (firstDate.day() == 1) break;
					decalage--;
					firstDate.add(-1, 'days');
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
					var dActu = moment().year(year).month(month).date(1 + decalage + i).startOf('day'); //{year:year, month:month, day:1+decalage+i}
					if (i === 0) this._thefirstDay = moment(dActu);
					if (dActu.day() == 1) {
						html += "<tr>";
						if (this.showWeekNumber) {
							var tdClsWeek = '';
							if (this.disabledDates && this.disabledDates(this, dActu)) tdClsWeek = 'notselectable';
							html += "<td class='" + tdClsWeek + "' data-m-date='" + dActu.format('YYYY-MM-DD') + "'><b>" + dActu.week() + "</b>&nbsp;&nbsp;</td>";
						}
						nbLines++;
						if (this.allways6lines && nbLines == 7) {
							this._thelastDay = moment(dActu);
							break;
						}
					}
					var tdCls = "";
					if (this.showDateViewed && dActu.year() == this.dateSelected.year() && dActu.month() == this.dateSelected.month() && dActu.date() == this.dateSelected.date()) tdCls += "active ";
					if (dActu.month() != this.dateViewed.month()) tdCls += "notthegoodmonth ";
					var isDisabled = false;
					if (this.disabledDates) isDisabled = this.disabledDates(this, dActu);
					if (isDisabled) tdCls += "notselectable ";
					if (this.showDateSelected && dActu.year() == today.year() && dActu.month() == today.month() && dActu.date() == today.date()) tdCls += "current ";
					var contentTemp = dActu.date();
					var idCell = M_.Utils.id();
					//if (this.renderCellDay) contentTemp = this.renderCellDay(this, dActu, idCell) ;
					tabCells.push([dActu, idCell]);
					html += "<td class='" + tdCls + "' id='" + idCell + "' data-m-date='" + dActu.format('YYYY-MM-DD') + "'><div class='M_CalendarMonth_txt'>" + contentTemp + "</div></td>";
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
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_date").html(tabMonths[this.dateViewed.month()] + " " + this.dateViewed.year() + " <span class='fa fa-arrow-circle-down'></span>");
	
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content td").off('click');
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content td").on('click', function (evt) {
					var target = $(evt.target).closest("td");
					if (target.hasClass('notselectable')) return;
					var d = target.attr("data-m-date");
					var date = moment(d);
					if (_this41.selectWeek) date.startOf('week');
					//this.selectDate(d) ;
					if (_this41.selectable) _this41.setDateSelected(date);
					_this41.trigger("selected", _this41, date);
				});
				if (this.selectWeek) {
					this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content tr").mouseenter(function (evt) {
						$(evt.target).closest('tr').addClass('alllineover');
					});
					this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_content tr").mouseleave(function (evt) {
						$(evt.target).closest('tr').removeClass('alllineover');
					});
				}
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_next").off('click');
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_next").on('click', function (evt) {
					_this41.nextMonth();
				});
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_date").off('click');
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_date").on('click', function (evt) {
					_this41.showMonths();
				});
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_previous").off('click');
				this.jEl.find(".M_CalendarMonth_days .M_CalendarMonth_previous").on('click', function (evt) {
					_this41.previousMonth();
				});
	
				if (this.renderCellDay) {
					for (i = 0; i < tabCells.length; i++) {
						var el = $("#" + tabCells[i][1]);
						var contentTemp2 = this.renderCellDay(this, tabCells[i][0], el);
						el.html(contentTemp2);
					}
				}
				this.trigger('viewedChanged', this, moment(this.dateViewed));
			}
	
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getFirstDay',
			value: function getFirstDay() {
				return this._thefirstDay;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getLastDay',
			value: function getLastDay() {
				return this._thelastDay;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'previousMonth',
			value: function previousMonth() {
				// console.log("this.dateViewed", this.dateViewed);
				this.dateViewed.subtract(1, 'month').startOf('months');
				this.showDays();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'nextMonth',
			value: function nextMonth() {
				// this.dateViewed = moment({year:this.dateViewed.year(), month:this.dateViewed.month()*1+1, day:1}) ;
				this.dateViewed.add(1, 'month').startOf('months');
				this.showDays();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'destroy',
			value: function destroy() {
				this.jEl.remove();
				this.trigger('destroy', this);
			}
		}]);
	
		return _class20;
	}();
	
	M_.Calendar = {};
	
	M_.Calendar.MonthView = function (_M_$CalendarMonth) {
		_inherits(_class21, _M_$CalendarMonth);
	
		function _class21(opts) {
			_classCallCheck(this, _class21);
	
			var defaults = {
				displayHeader: false,
				_cls: 'M_CalendarMonthView',
				cellMinHeight: 50,
				cellHeadMinHeight: 20,
				showDateViewed: false,
				showDateSelected: true,
				provideEvents: null,
				selectable: false,
				modelDef: {
					key: 'key',
					start: 'start',
					end: 'end',
					text: 'text',
					cls: 'cls'
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
	
			var _this42 = _possibleConstructorReturn(this, (_class21.__proto__ || Object.getPrototypeOf(_class21)).call(this, opts));
	
			Object.mixin(_this42, M_.Stored);
			// log("store", Object.mixin)
			_this42.initStored();
			return _this42;
		}
	
		_createClass(_class21, [{
			key: 'loadEvents',
			value: function loadEvents() {
				if (this.store) this.store.load({
					skip: 0,
					// where: "{'va_start':{'<': '"+moment(this.dateViewed).startOf('month').add(1, 'month').format('YYYY-MM-DD')+"'}, 'va_end':{'>':'"+moment(this.dateViewed).startOf('month').format('YYYY-MM-DD')+"'}}"
					start: moment(this.dateViewed).startOf('month').format('YYYY-MM-DD'),
					end: moment(this.dateViewed).startOf('month').add(1, 'month').format('YYYY-MM-DD')
				});
			}
		}, {
			key: 'selectMonth',
			value: function selectMonth(date) {
				_get(_class21.prototype.__proto__ || Object.getPrototypeOf(_class21.prototype), 'selectMonth', this).call(this, date);
				this.loadEvents();
			}
		}, {
			key: 'updateStore',
			value: function updateStore() {
				// this.showDays() ;
				this.drawEvents();
				// log("this.store",this.store) ;
			}
		}, {
			key: 'showDays',
			value: function showDays() {
				_get(_class21.prototype.__proto__ || Object.getPrototypeOf(_class21.prototype), 'showDays', this).call(this);
				// this._loadEvents() ;
				// if (this.store) this.store.reload() ;
			}
		}, {
			key: '_loadEvents',
			value: function _loadEvents() {
				// if (this.provideEvents) {
				// 	this.provideEvents((events)=> {
				// 		this.events = events ;
				// 		this.drawEvents() ;
				// 	}) ;
				// } else {
				// 	this.drawEvents() ;
				// }
			}
		}, {
			key: 'drawEvents',
			value: function drawEvents() {
				var _this43 = this;
	
				this.jEl.find('.M_CalendarMonthView_bar').remove();
				if (this.cellMinHeight > 0) {
					this.jEl.find('.M_CalendarMonth_days tbody tr').css('min-height', this.cellMinHeight);
					this.jEl.find('.M_CalendarMonth_days tbody tr').css('height', this.cellMinHeight);
				}
				if (this.cellHeadMinHeight > 0) {
					this.jEl.find('.M_CalendarMonth_days thead tr').css('min-height', this.cellHeadMinHeight);
					this.jEl.find('.M_CalendarMonth_days thead tr').css('height', this.cellHeadMinHeight);
				}
				var widthCell = this.jEl.find('td').outerWidth();
				// var tabNbEventsByDate = {} ; // stock le nb d'événements pour une journée
				var tabNbEventsByWeek = {}; // stock le nb d'événements dans la semaine
				var tabBars = [];
				// _.each(this.events, (evt)=> {
				this.store.each(function (model) {
					var start = moment(model.get(_this43.modelDef.start)).startOf('day');
					var end = moment(model.get(_this43.modelDef.end)).startOf('day');
					var start2 = model.get(_this43.modelDef.start2) || false;
					var end2 = model.get(_this43.modelDef.end2) || false;
					var nbDays = end.diff(start, 'days') + 1;
					var dActu = moment(start);
					for (var nj = 0; nj < nbDays; nj++) {
						var isFirst = false;
						var isLast = false;
						var startOfWeek = moment(dActu).startOf('week').format('YYYY-MM-DD');
						if (nj === 0 || dActu.day() === 1) {
							if (!tabNbEventsByWeek[startOfWeek]) tabNbEventsByWeek[startOfWeek] = 0;
							if (nj === 0) isFirst = true;
							var objTemp = {
								id: model.get(_this43.modelDef.key),
								start: moment(dActu),
								start2: start2,
								end2: end2,
								isFirst: isFirst,
								isLast: isLast,
								nbDays: 0,
								startOfWeek: startOfWeek,
								position: tabNbEventsByWeek[startOfWeek]
							};
							if (_.isFunction(_this43.modelDef.text)) objTemp.text = _this43.modelDef.text(model);else objTemp.text = model.get(_this43.modelDef.text);
							if (_.isFunction(_this43.modelDef.cls)) objTemp.cls = _this43.modelDef.cls(model);else objTemp.cls = model.get(_this43.modelDef.cls);
							tabBars.push(objTemp);
							tabNbEventsByWeek[startOfWeek]++;
						}
						tabBars[tabBars.length - 1].nbDays++;
						if (nj === nbDays - 1) tabBars[tabBars.length - 1].isLast = true;
						// if (!tabNbEventsByDate[dActu.format('YYYY-MM-DD')]) tabNbEventsByDate[dActu.format('YYYY-MM-DD')] = 0 ;
						// tabNbEventsByDate[dActu.format('YYYY-MM-DD')]++ ;
	
						dActu.add(1, 'days');
					}
				});
				// _.each(tabBars, (barEvt)=> {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _iterator = tabBars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var barEvt = _step.value;
	
						var bar = $("<div class='M_CalendarMonthView_bar " + barEvt.cls + "' data-m-evt='" + barEvt.id + "'>" + barEvt.text + "</div>");
						var css = {
							top: barEvt.position * 15 + 25
						};
						if (barEvt.bgcolor) css['background-color'] = barEvt.bgcolor;
						if (barEvt.color) css.color = barEvt.color;
						var moreLeft = 0;
						var moreWidth = 0;
						if (barEvt.start2 && barEvt.isFirst) moreLeft = 50; //widthCell/2
						if (barEvt.end2 && barEvt.isLast) moreWidth = 50; //widthCell/2
						css.left = moreLeft + '%';
						bar.width(101 * barEvt.nbDays - moreLeft - moreWidth + '%') //widthCell*barEvt.nbDays
						.css(css).html(barEvt.text);
						var el2 = this.jEl.find("td[data-m-date='" + barEvt.start.format('YYYY-MM-DD') + "']");
						if (el2) el2.append(bar);
						var tr = this.jEl.find("td[data-m-date='" + barEvt.startOfWeek + "']").parent();
						var h = 25 + 15 * tabNbEventsByWeek[barEvt.startOfWeek] + 5;
						tr.css('height', Math.max(h, this.cellMinHeight));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
	
				this.jEl.find('.M_CalendarMonthView_bar').click(function (evt) {
					evt.stopPropagation();
					var bar = $(evt.target);
					var id = bar.closest('.M_CalendarMonthView_bar').attr('data-m-evt');
					var found = _this43.store.getRow(id);
					if (found) _this43.trigger('clickitem', _this43, found, bar);
				}).mouseenter(function (evt) {
					var bar = $(evt.target);
					var id = bar.closest('.M_CalendarMonthView_bar').attr('data-m-evt');
					var found = _this43.store.getRow(id);
					_this43.trigger('enteritem', _this43, found, bar);
				});
			}
		}, {
			key: 'setEvents',
			value: function setEvents(events) {
				this.events = events;
				this.redraw();
			}
		}]);
	
		return _class21;
	}(M_.CalendarMonth);
	
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
	M_.Form.Form = function () {
		function _class22(opts) {
			_classCallCheck(this, _class22);
	
			var defaults = {
				useWebsocket: M_.App.useWebsocket,
				items: [],
				_items: [],
				itemsDefaults: {},
				_currentModel: null,
				model: null,
				url: '',
				validBeforeSave: true
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			Object.mixin(this, M_.Observable);
			this.initObservable();
			Object.mixin(this, M_.CRUD);
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
	
	
		_createClass(_class22, [{
			key: 'reset',
			value: function reset() {
				var _items = this._items;
				for (var i = 0; i < _items.length; i++) {
					_items[i].reset();
				}
				this.trigger("reset", this);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'valid',
			value: function valid() {
				var err = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
				var ok = true;
				var _items = this._items;
				for (var i = 0; i < _items.length; i++) {
					if (!_items[i].valid()) {
						ok = false;
						var label = _items[i].name;
						if (_items[i].label !== '') label = _items[i].label;
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
	
		}, {
			key: 'informValidReturnSails',
			value: function informValidReturnSails(data) {
				var _this44 = this;
	
				// log("informValidReturnSails",data)
				var errTxt = "";
				_.each(data.invalidAttributes, function (attr, key) {
					// log("attr, key",attr, key)
					if (_this44.find(key)) {
						_this44.find(key).informValid(false);
						var key2 = _this44.find(key).label;
						if (key2 === '') key2 = key;
						key = key2;
					}
					errTxt += "<b>" + key + "</b> : ";
					_.each(attr, function (msg) {
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
	
		}, {
			key: 'onLoad',
			value: function onLoad(model) {
				if (this.model) this.setValues(model); //.getData()
				else this.setValues(model);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'onBeforeLoad',
			value: function onBeforeLoad() {
				this.resetValid();
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValues',
			value: function setValues(dataOrModel) {
				// console.log("this._items", this._items);
				this.reset();
				if (!(dataOrModel instanceof M_.Model) && this.model) dataOrModel = new this.model({ row: dataOrModel });
				this._currentModel = dataOrModel;
				var _items = this._items;
				// log("_items",_items)
				for (var i = 0; i < _items.length; i++) {
					var v = void 0;
					if (this.model) v = this._currentModel.get(_items[i].name);else v = this._currentModel[_items[i].name];
					// log("_items[i].name",i, _items[i].name, v)
					if (v !== undefined) {
						if (_items[i] instanceof M_.Form.Combobox) {
							var v2 = void 0;
							if (this.model) v2 = this._currentModel.get(_items[i].name + '_val');else v2 = this._currentModel[_items[i].name + '_val'];
							// log("v2",v2,name+'_val')
							if (v2) _items[i].setValueAndRawValue(v, v2);else {
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
	
		}, {
			key: 'getValues',
			value: function getValues() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
				var returnModel = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
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
	
		}, {
			key: 'find',
			value: function find(fieldName) {
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
	
		}, {
			key: 'resetValid',
			value: function resetValid() {
				for (var i = 0; i < this._items.length; i++) {
					this._items[i].informValid(true);
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'validAndAlert',
			value: function validAndAlert() {
				var err = [];
				var ok = this.valid(err);
				if (!ok) this._alert(err);
				return ok;
			}
		}, {
			key: '_alert',
			value: function _alert(err) {
				var errTxt = "";
				_.each(err, function (er) {
					errTxt += "• " + er.label + "<br>";
				});
				M_.Dialog.alert("Erreur", "Merci de corriger les champs en rouge :<br>" + errTxt);
			}
		}, {
			key: 'validAndSave',
			value: function validAndSave() {
				var modelOrData = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
				var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
				var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
				var err = [];
				var ok = this.valid(err);
				// console.log("ok", ok);
				if (ok) this.save(modelOrData, args, callback);else this._alert(err);
				return ok;
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'populate',
			value: function populate(dataOrModel) {
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
	
		}, {
			key: 'addItem',
			value: function addItem(item) {
				if (!_.isArray(item)) item = [item];
				for (var i = 0; i < item.length; i++) {
					var optsItem = $.extend({}, this.itemsDefaults, item[i]);
					optsItem.form = this;
					if (optsItem.autoContainer) {
						var jElTemp = $("<div></div>");
						optsItem.autoContainer.append(jElTemp);
						optsItem.container = jElTemp;
					}
					if (optsItem.type === M_.Form.Div) new optsItem.type(optsItem);else {
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
	
		}, {
			key: 'deleteItem',
			value: function deleteItem(name) {
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
	
		}, {
			key: 'getItem',
			value: function getItem(name) {
				this.find(name);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getItems',
			value: function getItems() {
				return this._items;
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'getItemsByFakeGroup',
			value: function getItemsByFakeGroup(fakeGroupName) {
				var keepedItems = [];
				for (var i = 0; i < this._items.length; i++) {
					if (this._items[i].fakeGroup.indexOf(fakeGroupName) >= 0) keepedItems.push(this._items[i]);
				}
				return keepedItems;
			}
		}, {
			key: 'getItemsByType',
			value: function getItemsByType(type) {
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
	
		}, {
			key: 'deleteByFakeGroup',
			value: function deleteByFakeGroup(fakeGroupName) {
				var keepedItems = [];
				for (var i = 0; i < this._items.length; i++) {
					// console.log("this._items[i].fakeGroup.indexOf(fakeGroupName)",this._items[i].fakeGroup.indexOf(fakeGroupName),fakeGroupName);
					if (this._items[i].fakeGroup.indexOf(fakeGroupName) < 0) keepedItems.push(this._items[i]);else this._items[i].destroy();
				}
				this._items = keepedItems;
			}
		}, {
			key: 'getCurrentModel',
			value: function getCurrentModel() {
				return this._currentModel;
			}
		}, {
			key: 'disable',
			value: function disable() {
				for (var i = 0; i < this._items.length; i++) {
					if (this._items[i].disable) this._items[i].disable();
				}
			}
		}]);
	
		return _class22;
	}();
	
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
	M_.Form.Input = function (_M_$Outlet6) {
		_inherits(_class23, _M_$Outlet6);
	
		function _class23(opts) {
			_classCallCheck(this, _class23);
	
			var defaults = {
				name: '',
				value: '',
				autoContainer: null,
				// modelValue: '',
				// modelKey: '',
				hideContainerIfEmpty: false,
				placeholder: '',
				form: null,
				inputType: 'hidden',
				tabindex: 0,
				editable: true,
				_inEdit: false,
				_clsMore: '',
				clsInput: '',
				clsGroup: '',
				clsLabel: '',
				styleInput: '',
				styleGroup: '',
				styleLabel: '',
				label: "",
				labelPosition: 'top',
				labelWidth: 0,
				labelFocusInput: true,
				dontSave: false,
				fakeGroup: [],
				allowEmpty: true,
				minLength: null,
				maxLength: null,
				disabled: false,
				previousValue: null
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this45 = _possibleConstructorReturn(this, (_class23.__proto__ || Object.getPrototypeOf(_class23)).call(this, opts));
	
			if (typeof _this45.fakeGroup === 'string') _this45.fakeGroup = [_this45.fakeGroup];
	
			if ((_this45.labelPosition == 'left' || _this45.labelPosition == 'right') && _this45.labelWidth === 0) _this45.labelWidth = 0.3;
	
			_this45.setValue(_this45.value);
			return _this45;
		}
		/**
	  * @param {type}
	  */
	
	
		_createClass(_class23, [{
			key: 'setLabel',
			value: function setLabel(txt) {
				this.container.find('label').html(txt);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'create',
			value: function create() {
				if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
				var v = this.value;
				if ($.type(v) !== "string") v = '';
				if (this.labelPosition == 'left' && this.label !== '') {
					this.clsLabel += " M_LabelLeft";
					this.clsInput += " M_InputLeft";
				}
				if (this.labelPosition == 'right' && this.label !== '') {
					this.clsLabel += " M_LabelRight";
					this.clsInput += " M_InputRight";
				}
				if (this.labelWidth > 0 && this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'right') && this.inputType != 'checkbox') {
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
				if (this.inputType == 'hidden') {
					html += '<input ' + readOnly + ' id="' + this.id + '" type="' + this.inputType + '" class="M_Input" name="' + this.name + '" value="' + v + '">';
				} else {
					html += '<div style="' + this.styleGroup + '" class="M_FormGroup ' + this.clsGroup + '">';
					if (this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'top')) html += '<label style="' + this.styleLabel + '" class="' + this.clsLabel + '" ' + forattr + '>' + this.label + '</label>';
					// if (this._addInputGroup) html += `<div class="M_InputGroup">` ;
					var multiple = "";
					if (this.multiple) multiple = "multiple";
					if (this.inputType == 'file') {
						html += '<input ' + tabindex + ' ' + readOnly + ' id="' + this.id + '" type="' + this.inputType + '" style="' + this.styleInput + '" ' + multiple + ' class="M_Input ' + this.clsInput + '" name="' + this.name + '" value="' + v + '" placeholder="' + this.placeholder + '">';
					} else if (this.inputType == 'textarea') {
						if (!this.height) this.height = 100;
						this.styleInput += ' height:' + this.height + 'px;';
						html += '<textarea ' + tabindex + ' placeholder="' + this.placeholder + '" ' + readOnly + ' id="' + this.id + '" class="M_Input ' + this.clsInput + '" style="' + this.styleInput + '" rows="' + this.rows + '" name="' + this.name + '">' + v + '</textarea>';
					} else if (this.inputType == 'none') {
						html += '<div id="' + this.id + '"></div>';
					} else {
						var incremental = '';
						if (this.incremental) incremental = 'incremental="incremental"';
						html += '<input ' + tabindex + ' ' + readOnly + ' id="' + this.id + '" ' + incremental + ' type="' + this.inputType + '" style="' + this.styleInput + '" class="M_Input ' + this._clsMore + ' ' + this.clsInput + '" name="' + this.name + '" value="' + v + '" placeholder="' + this.placeholder + '">';
					}
					// if (this._addInputGroup) html += `</div>` ;
					if (this.label !== '' && (this.labelPosition == 'bottom' || this.labelPosition == 'right')) html += '<label style="' + this.styleLabel + '" class="' + this.clsLabel + '" ' + forattr + '">' + this.label + '</label>';
					html += '</div>';
				}
				// log("html",html)
				this.container.append(html);
				this.jEl = $("#" + this.id);
				if (this.disabled) this.jEl.prop('disabled', true);
				// this.jEl = this.container.find('.M_Input') ;
				// this.jEl.attr('data-m-after', this.placeholder) ;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'reset',
			value: function reset() {
				this.setValue('');
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'disable',
			value: function disable() {
				this.disabled = true;
				this.jEl.prop('disabled', true);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'enable',
			value: function enable() {
				this.disabled = false;
				this.jEl.prop('disabled', false);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'valid',
			value: function valid() {
				var ok = true,
				    val = this.getValue(),
				    err = "";
				if (!this.allowEmpty && M_.Utils.isEmpty(val)) {
					ok = false;
					err = "Ce champs ne peut pas être vide\n";
				}
				if (this.minLength !== null && val.length < this.minLength) {
					if (val.length === 0 && this.allowEmpty) {} else {
						ok = false;
						err = "La longeur minimum est de " + this.minLength + " pour ce champs\n";
					}
				}
				if (this.maxLength !== null && val.length > this.maxLength) {
					ok = false;
					err = "La longeur maximum est de " + this.maxLength + " pour ce champs\n";
				}
				this.informValid(ok);
				return ok;
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'informValid',
			value: function informValid(ok) {
				if (!ok) this.jEl.addClass('M_Error');else this.jEl.removeClass('M_Error');
			}
			/**
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isEmpty',
			value: function isEmpty() {
				// log("isEmpty","'"+this.value+"'")
				var v = this.getValue();
				if (v === '' || v === null) return true;
				return false;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				// console.log("setValuePrim", val);
				this.previousValue = this.value;
				this.value = val;
				this.jEl.val(val);
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				this.value = this.jEl.val();
				return this.value;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'hide',
			value: function hide() {
				this.container.hide();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'show',
			value: function show() {
				this.container.show();
			}
		}]);
	
		return _class23;
	}(M_.Outlet);
	
	M_.Form.Slider = function (_M_$Form$Input) {
		_inherits(_class24, _M_$Form$Input);
	
		function _class24(opts) {
			_classCallCheck(this, _class24);
	
			var defaults = {
				placeholder: "",
				inputType: 'perso',
				jElCursor: null,
				steps: 2,
				value: 0,
				labelLeft: "Left",
				labelRight: "Right",
				labelWidth: 50
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class24.__proto__ || Object.getPrototypeOf(_class24)).call(this, opts));
		}
	
		_createClass(_class24, [{
			key: 'create',
			value: function create() {
				var _this47 = this;
	
				if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
				var v = this.value;
				var jEl = $("<div class='M_Slider'><label class='M_SliderLabelLeft'>" + this.labelLeft + "</label><div class='M_SliderBar'><div class='M_SliderCursor'></div></div><label class='M_SliderLabelRight'>" + this.labelRight + "</label><div class='M_Clear'></div></div>");
				var wLabels = 0;
				if (this.labelLeft === '') {
					jEl.find('.M_SliderLabelLeft').remove();
				} else {
					wLabels += this.labelWidth;
					jEl.find('.M_SliderLabelLeft').width(this.labelWidth);
				}
				if (this.labelRight === '') {
					jEl.find('.M_SliderLabelRight').remove();
				} else {
					wLabels += this.labelWidth;
					jEl.find('.M_SliderLabelRight').width(this.labelWidth);
				}
				this.container.append(jEl);
				this.jEl = jEl.find('.M_SliderBar');
				this.jElCursor = jEl.find('.M_SliderCursor');
				this._spaceCursor = this.jElCursor.position().left;
	
				this.jEl.css('width', 'calc(100% - ' + wLabels + 'px)');
	
				this.jElCursor.width((this.jEl.width() - this._spaceCursor * 2) / this.steps);
				this.jEl.click(function (evt) {
					var pos = 0;
					if (_this47.steps == 2) {
						if (!_this47.getValue()) pos = 1;
						_this47.setValue(pos);
					} else {
						var parentOffset = $(evt.target).closest('.M_Slider').offset();
						var relX = evt.pageX - parentOffset.left;
						var w = _this47.jEl.width();
						// console.log("w % this.steps", Math.ceil(relX / (w/this.steps)));
						pos = Math.ceil(relX / (w / _this47.steps)) - 1;
						// if (pos<0) pos = 0 ;
						_this47.setValue(pos);
					}
					_this47.trigger('change', _this47, pos);
				});
			}
		}, {
			key: 'setPosition',
			value: function setPosition(pos) {
				var w = this.jEl.width();
				var l = pos * (w / this.steps);
				if (pos === 0) l += this._spaceCursor;
				this.jElCursor.transition({ left: l });
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.previousValue = this.value;
				this.value = val;
				this.setPosition(val);
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				if (this.steps == 2) {
					if (this.value == 1) return true;
					return false;
				}
				return this.value;
			}
		}]);
	
		return _class24;
	}(M_.Form.Input);
	
	/**
	 * Hidden input form
	 * @class
	 * @extends M_.Form.Input
	 * @memberof! <global>
	 */
	M_.Form.Hidden = function (_M_$Form$Input2) {
		_inherits(_class25, _M_$Form$Input2);
	
		function _class25() {
			_classCallCheck(this, _class25);
	
			return _possibleConstructorReturn(this, (_class25.__proto__ || Object.getPrototypeOf(_class25)).apply(this, arguments));
		}
	
		_createClass(_class25, [{
			key: 'setValue',
			value: function setValue(val) {
				if (_.isPlainObject(val)) val = val[this.name];
				_get(_class25.prototype.__proto__ || Object.getPrototypeOf(_class25.prototype), 'setValue', this).call(this, val);
			}
		}]);
	
		return _class25;
	}(M_.Form.Input);
	
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
	M_.Form.Multi = function (_M_$Form$Input3) {
		_inherits(_class26, _M_$Form$Input3);
	
		function _class26(opts) {
			_classCallCheck(this, _class26);
	
			var defaults = {
				inputType: 'none',
				confirmDelete: false,
				confirmDeleteMessage: "Etes-vous certain de vouloir supprimer ce mot clé ?",
				value: [],
				onClickBtAdd: null
			};
			var _idBtAddKeyword = M_.Utils.id();
			if (opts.label) opts.label += " <span id='" + _idBtAddKeyword + "' class='fa fa-plus faa-pulse animated-hover'>";
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			// this._idBtAddKeyword = _idBtAddKeyword ;
			var _this49 = _possibleConstructorReturn(this, (_class26.__proto__ || Object.getPrototypeOf(_class26)).call(this, opts));
	
			_this49.drawContainer();
			$("#" + _idBtAddKeyword).click(function () {
				if (_this49.onClickBtAdd) _this49.onClickBtAdd(_this49, _this49.value);
			});
			return _this49;
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class26, [{
			key: 'drawContainer',
			value: function drawContainer() {
				var _this50 = this;
	
				// log("this.value",this.value)
				this.jEl.empty();
				_.each(this.value, function (val) {
					var html = '<div class="M_ComboboxMultiItem selected" data-kw-id="' + val + '">' + val + ' <span class="fa fa-trash faa-pulse animated-hover"></span></div>';
					var jEl = $(html);
					_this50.jEl.append(jEl);
					jEl.find('.fa-trash').click(function (evt) {
						if (_this50.confirmDelete) {
							M_.Dialog.confirm("Confirmation effacement", _this50.confirmDeleteMessage, function () {});
						} else {
							_this50.removeValue($(evt.target).parent().attr("data-kw-id"));
						}
					});
				});
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'removeValue',
			value: function removeValue(val) {
				_.pull(this.value, val);
				this.drawContainer();
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.previousValue = this.value;
				if (val === "") val = [];
				this.value = val;
				this.drawContainer();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				return this.value;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addValue',
			value: function addValue(val) {
				this.value.push(val);
			}
		}]);
	
		return _class26;
	}(M_.Form.Input);
	
	/**
	 * Display stars to rate
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} inputType
	 * @property {type} value
	 * @property {type} nbStars
	 */
	M_.Form.Rating = function (_M_$Form$Input4) {
		_inherits(_class27, _M_$Form$Input4);
	
		function _class27(opts) {
			_classCallCheck(this, _class27);
	
			var defaults = {
				inputType: 'none',
				value: -1,
				nbStars: 5
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			// this._idBtAddKeyword = _idBtAddKeyword ;
			// $("#"+_idBtAddKeyword).click(()=> {
			// 	if (this.onClickBtAdd) this.onClickBtAdd(this, this.value) ;
			// }) ;
			var _this51 = _possibleConstructorReturn(this, (_class27.__proto__ || Object.getPrototypeOf(_class27)).call(this, opts));
	
			_this51.jEl.addClass('M_FormRate');
			for (var i = 0; i < _this51.nbStars; i++) {
				var el = $("<div class='M_FormRateItem'>" + i + "</div>");
				_this51.jEl.append(el);
				el.mouseenter({ note: i }, function (evt) {
					if (_this51._toExitStar) window.clearTimeout(_this51._toExitStar);
					// log("mouseover", evt.data.note, $(evt.target))
					// $(evt.target).addClass('over') ;
					for (var i = 0; i < _this51.nbStars; i++) {
						if (i <= evt.data.note * 1) _this51.jEl.find('.M_FormRateItem:nth-child(' + (i + 1) + ')').addClass('over');else _this51.jEl.find('.M_FormRateItem:nth-child(' + (i + 1) + ')').removeClass('over');
					}
				});
				el.mouseleave({ note: i }, function (evt) {
					_this51._toExitStar = window.setTimeout(function () {
						_this51._toExitStar = null;
						_this51.setValue(_this51.value);
					}, 300);
				});
				el.click({ note: i }, function (evt) {
					_this51.setValue(evt.data.note * 1);
				});
			}
			_this51.drawContainer();
	
			return _this51;
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class27, [{
			key: 'drawContainer',
			value: function drawContainer() {
				// this.jEl.empty() ;
				// this.jEl.removeClass('M_FormRate') ;
				for (var i = 0; i < this.nbStars; i++) {
					if (i <= this.value * 1) this.jEl.find('.M_FormRateItem:nth-child(' + (i + 1) + ')').addClass('over');else this.jEl.find('.M_FormRateItem:nth-child(' + (i + 1) + ')').removeClass('over');
				}
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'removeValue',
			value: function removeValue(val) {
				_.pull(this.value, val);
				this.drawContainer();
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.previousValue = this.value;
				if (val === "") val = 0;
				this.value = val;
				this.drawContainer();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				return this.value;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'addValue',
			value: function addValue(val) {
				this.value.push(val);
			}
		}]);
	
		return _class27;
	}(M_.Form.Input);
	
	/**
	 * Input file form
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} placeholder
	 * @property {type} inputType
	 * @property {type} regxValidChar
	 */
	M_.Form.File = function (_M_$Form$Input5) {
		_inherits(_class28, _M_$Form$Input5);
	
		function _class28(opts) {
			_classCallCheck(this, _class28);
	
			var defaults = {
				placeholder: "",
				inputType: 'file',
				multiple: false,
				regxValidChar: null
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class28.__proto__ || Object.getPrototypeOf(_class28)).call(this, opts));
		}
		/**
	  * @param  {Boolean}
	  * @return {type}
	  */
	
	
		_createClass(_class28, [{
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				this.value = this.jEl.val();
				// if (this.jEl.get(0).files.length>0) return this.jEl.get(0).files[0] ;
				return this.value;
				// return this.value ;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.previousValue = this.value;
				this.value = val;
			}
		}]);
	
		return _class28;
	}(M_.Form.Input);
	
	/**
	 * Input text form
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} placeholder
	 * @property {type} inputType
	 * @property {type} regxValidChar
	 */
	M_.Form.Text = function (_M_$Form$Input6) {
		_inherits(_class29, _M_$Form$Input6);
	
		function _class29(opts) {
			_classCallCheck(this, _class29);
	
			var defaults = {
				placeholder: "",
				inputType: 'text',
				regxValidChar: null,
				selectOnFocus: false
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
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
			var _this53 = _possibleConstructorReturn(this, (_class29.__proto__ || Object.getPrototypeOf(_class29)).call(this, opts));
	
			_this53.jEl.keyup(function (evt) {
				if (evt.which == 13) {
					if (_this53.onEnterInput(evt) !== false) {
						_this53.onKeyup(evt);
					}
				} else _this53.onKeyup(evt);
			});
			_this53.jEl.keypress(function (evt) {
				_this53.onKeyPress(evt);
			});
			if (_this53.selectOnFocus) {
				_this53.jEl.focus(function (evt) {
					evt.preventDefault();
					_this53.jEl.select();
				});
			}
			return _this53;
		}
	
		_createClass(_class29, [{
			key: 'onEnterInput',
			value: function onEnterInput(evt) {}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'onKeyup',
			value: function onKeyup(evt) {
				// this.value = this.jEl.val() ;
				this.trigger("keyup", this, evt);
				this.trigger("update", this, this.getValue());
				this.valid();
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'onKeyPress',
			value: function onKeyPress(evt) {
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
	
		}, {
			key: 'validChar',
			value: function validChar(txt) {
				if (this.regxValidChar === null) return true;
				var reg = new RegExp(this.regxValidChar);
				var ok = reg.test(txt);
				return ok;
			}
		}]);
	
		return _class29;
	}(M_.Form.Input);
	
	M_.Form.Search = function (_M_$Form$Text) {
		_inherits(_class30, _M_$Form$Text);
	
		function _class30(opts) {
			_classCallCheck(this, _class30);
	
			var defaults = {
				inputType: 'search',
				incremental: true
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this54 = _possibleConstructorReturn(this, (_class30.__proto__ || Object.getPrototypeOf(_class30)).call(this, opts));
	
			if (M_.Utils.isEventSupported('search')) {
				_this54.jEl.on('search', function (evt) {
					_this54.trigger("search", _this54, evt);
				});
			} else {
				_this54.jEl.on('keyup', function (evt) {
					_this54.trigger("search", _this54, evt);
				});
			}
			return _this54;
		}
	
		return _class30;
	}(M_.Form.Text);
	
	/**
	 * Input textarea form
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Text
	 * @property {type} inputType
	 * @property {type} acceptTabulation
	 * @property {type} rows
	 */
	M_.Form.Textarea = function (_M_$Form$Text2) {
		_inherits(_class31, _M_$Form$Text2);
	
		function _class31(opts) {
			_classCallCheck(this, _class31);
	
			var defaults = {
				inputType: 'textarea',
				acceptTabulation: false,
				rows: 4
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this55 = _possibleConstructorReturn(this, (_class31.__proto__ || Object.getPrototypeOf(_class31)).call(this, opts));
	
			if (_this55.acceptTabulation) {
				_this55.jEl.on('keydown', function (e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode == 9) {
						e.preventDefault();
						var start = _this55.jEl.get(0).selectionStart;
						var end = _this55.jEl.get(0).selectionEnd;
						_this55.jEl.val(_this55.jEl.val().substring(0, start) + "\t" + _this55.jEl.val().substring(end));
						_this55.jEl.get(0).selectionStart = _this55.jEl.get(0).selectionEnd = start + 1;
					}
				});
			}
	
			return _this55;
		}
	
		return _class31;
	}(M_.Form.Text);
	
	M_.Form.Password = function (_M_$Form$Text3) {
		_inherits(_class32, _M_$Form$Text3);
	
		function _class32(opts) {
			_classCallCheck(this, _class32);
	
			var defaults = {
				inputType: 'password',
				checkstrength: true
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this56 = _possibleConstructorReturn(this, (_class32.__proto__ || Object.getPrototypeOf(_class32)).call(this, opts));
	
			if (_this56.checkstrength) {
				_this56.jElPass = $("<div class='M_DivPassword'>OK</div>");
				_this56.jElPass.hide();
				_this56.container.append(_this56.jElPass);
				_this56.container.css('position', 'relative');
				_this56.jEl.on('keyup', function (e) {
					var pos = _this56.jEl.offset();
					_this56.jElPass.show();
					var score = _this56.checkPassword();
					_this56.jElPass.removeClass('bg_col3 bg_col5 bg_col2');
					if (score < 2) {
						_this56.jElPass.addClass('bg_col3').html("Mauvais");
					} else if (score < 4) {
						_this56.jElPass.addClass('bg_col5').html("Moyen");
					} else {
						_this56.jElPass.addClass('bg_col2').html("Bon");
					}
					_this56.jElPass.offset({
						top: pos.top,
						left: pos.left + _this56.jEl.outerWidth() - _this56.jElPass.outerWidth()
					}).outerHeight(_this56.jEl.outerHeight());
				});
			}
	
			return _this56;
		}
	
		_createClass(_class32, [{
			key: 'checkPassword',
			value: function checkPassword() {
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
		}]);
	
		return _class32;
	}(M_.Form.Text);
	
	/**
	 * A wysiwyg editor
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Textarea
	 * @property {type} heightEditor
	 */
	M_.Form.TextEditor = function (_M_$Form$Textarea) {
		_inherits(_class33, _M_$Form$Textarea);
	
		function _class33(opts) {
			_classCallCheck(this, _class33);
	
			var defaults = {
				heightEditor: 200
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class33.__proto__ || Object.getPrototypeOf(_class33)).call(this, opts));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class33, [{
			key: 'create',
			value: function create() {
				_get(_class33.prototype.__proto__ || Object.getPrototypeOf(_class33.prototype), 'create', this).call(this);
	
				// var h = this.jEl.height() ;
				this.jEl.hide();
				var idTemp1 = M_.Utils.id();
				var idTemp2 = M_.Utils.id();
				this.jEl.after("<div id='" + idTemp1 + "'></div><div><div class='M_FormEditor-Content' id='" + idTemp2 + "'></div></div>");
				$("#" + idTemp2).height(this.heightEditor);
				this.editor = new M_.Editor({
					buttonsContainer: $("#" + idTemp1),
					container: $("#" + idTemp2)
				});
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.previousValue = this.value;
				this.value = val;
				this.jEl.val(val);
				this.editor.container.html(val);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var val = this.editor.container.html();
				this.jEl.val(val);
				return val;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getEditor',
			value: function getEditor() {
				return this.editor;
			}
		}]);
	
		return _class33;
	}(M_.Form.Textarea);
	
	/**
	 * A radio buttons group
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} inputType
	 * @property {type} radioPosition
	 * @property {type} items
	 */
	M_.Form.RadioGroup = function (_M_$Form$Input7) {
		_inherits(_class34, _M_$Form$Input7);
	
		function _class34(opts) {
			_classCallCheck(this, _class34);
	
			var defaults = {
				inputType: 'radiogroup',
				radioPosition: 'inline', // inline | col
				items: []
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class34.__proto__ || Object.getPrototypeOf(_class34)).call(this, opts));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class34, [{
			key: 'create',
			value: function create() {
				var _this59 = this;
	
				// var id1 = M_.Utils.id(),
				// 	id2 = M_.Utils.id() ;
	
	
				if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
				var v = this.value;
				if ($.type(v) !== "string") v = '';
				if ((this.labelPosition == 'left' || this.labelPosition == 'right') && this.label !== '') {
					this.clsLabel += " M_LabelLeft";
					this.clsInput += " M_InputLeft";
				}
				if (this.labelWidth > 0 && this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'right') && this.inputType != 'checkbox') {
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
				if (this.labelFocusInput) forattr = 'for="' + this.id + '"';
				if (!this.editable) readOnly = "readonly";
	
				// var html = `<div class='M_HorizontalForm'></div></div>` ;
	
	
				html += '<div style="' + this.styleGroup + '" class="M_FormGroup ' + this.clsGroup + '">';
				if (this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'top')) html += '<label style="' + this.styleLabel + '" class="' + this.clsLabel + '" ' + forattr + '>' + this.label + '</label>';
				html += '<div id="' + this.id + '" type="' + this.inputType + '" style="' + this.styleInput + '" class="M_Input ' + this.clsInput + '">';
				var nameTemp = M_.Utils.id();
				_.each(this.items, function (item) {
					var idTemp = M_.Utils.id();
					html += '<div class="M_RadioGroupItem ' + _this59.radioPosition + '"><input type=\'radio\' name="' + nameTemp + '" id="' + idTemp + '" value="' + item.key + '" class="M_InputRight"/><label for="' + idTemp + '" class="M_LabelRight">' + item.val + '</label></div>';
				});
				html += '</div></div>';
	
				this.container.append(html);
				this.jEl = this.container.find('.M_HorizontalForm');
	
				this.container.find('input').click(function (evt) {
					_this59.trigger("change", _this59, _this59.getValue(), evt);
				});
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				var _this60 = this;
	
				this.previousValue = this.value;
				this.value = val;
				this.container.find('input').each(function (ind, el) {
					if (el.value == _this60.value) $(el).prop('checked', true);else $(el).prop('checked', false);
				});
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var v = this.container.find('input:checked').val();
				return v;
			}
		}]);
	
		return _class34;
	}(M_.Form.Input);
	
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
	M_.Form.Checkbox = function (_M_$Form$Input8) {
		_inherits(_class35, _M_$Form$Input8);
	
		function _class35(opts) {
			_classCallCheck(this, _class35);
	
			var defaults = {
				inputType: 'checkbox',
				labelWidth: 100,
				labelFocusInput: true,
				labelPosition: 'right',
				threeStates: false,
				indeterminate: false,
				previousValue: false
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
	
			var _this61 = _possibleConstructorReturn(this, (_class35.__proto__ || Object.getPrototypeOf(_class35)).call(this, opts));
	
			if (_this61.threeStates) {
				var v = 0;
				if (_this61.value) v = 1;
				if (_this61.indeterminate) v = 2;
				_this61.jEl.data('checked', v);
				if (v === 2) _this61.jEl.prop('indeterminate', true);
			}
			_this61.jEl.change(function (evt) {
				if (_this61.indeterminate) {
					switch (_this61.jEl.data('checked')) {
						// unchecked, going indeterminate
						case 0:
							_this61.jEl.data('checked', 1);
							_this61.jEl.prop('indeterminate', true);
							break;
						// indeterminate, going checked
						case 1:
							_this61.jEl.data('checked', 2);
							_this61.jEl.prop('indeterminate', false);
							_this61.jEl.prop('checked', true);
							break;
						// checked, going unchecked
						default:
							_this61.jEl.data('checked', 0);
							_this61.jEl.prop('indeterminate', false);
							_this61.jEl.prop('checked', false);
					}
				}
				_this61.trigger("change", _this61, _this61.getValue(), evt);
			});
			if (_this61.indeterminate) _this61.jEl.prop('indeterminate', true);
			return _this61;
		}
		/**
	  * @param {type}
	  */
	
	
		_createClass(_class35, [{
			key: 'setValue',
			value: function setValue(val) {
				// console.log("val", val);
				if (val === '' || val === 'false' || val === '0' || val === 0) val = false;
				if (val === 'true' || val === '1' || val === 1) val = true;
				this.previousValue = this.value;
				this.value = val;
				if (val) this.jEl.prop('checked', true);else this.jEl.prop('checked', false);
				if (this.threeStates) {
					var v = 0;
					if (val) v = 1;
					if (val == 2) v = 2;
					this.jEl.data('checked', v);
					if (v === 2) this.jEl.prop('indeterminate', true);else this.jEl.prop('indeterminate', false);
				}
			}
		}, {
			key: 'imcheckbox',
			value: function imcheckbox() {
				return "ok";
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				if (this.threeStates) {
					if (this.jEl.prop('indeterminate')) return 2;
				}
				return this.jEl.is(":checked");
			}
		}]);
	
		return _class35;
	}(M_.Form.Input);
	
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
	M_.Form.Number = function (_M_$Form$Text4) {
		_inherits(_class36, _M_$Form$Text4);
	
		function _class36(opts) {
			_classCallCheck(this, _class36);
	
			var defaults = {
				// inputType: 'number',
				decimalLength: 0,
				decimalSeparator: ',',
				decimalForced: false,
				allowNegative: true,
				valueMax: null,
				valueMin: null,
				startEmpty: false,
				allowComparison: false
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class36.__proto__ || Object.getPrototypeOf(_class36)).call(this, opts));
		}
		// onKeyup(evt) {}
		/**
	  * @param  {type}
	  * @return {type}
	  */
	
	
		_createClass(_class36, [{
			key: 'validChar',
			value: function validChar(txt) {
				var re = "\\d";
				if (this.allowNegative) re += "|\\-";
				if (this.decimalLength > 0) re += "|\\" + this.decimalSeparator;
				if (this.allowComparison) re += "|\>|\<|\=";
				this.regxValidChar = re;
				return _get(_class36.prototype.__proto__ || Object.getPrototypeOf(_class36.prototype), 'validChar', this).call(this, txt);
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(v) {
				// log("setValue",v)
				if (v === '' && this.startEmpty) return this.jEl.val('');
				v = v * 1;
				this.value = v;
				var v2 = v;
				v2 = (v2 + "").replace(".", this.decimalSeparator);
				if (this.decimalForced) {
					var dec = v % 1,
					    nbDec = Math.pow(10, this.decimalLength),
					    dec2 = Math.floor(dec * nbDec);
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
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				var v = (this.jEl.val() + "").replace(this.decimalSeparator, ".");
				this.value = v * 1;
				if (this.allowComparison) this.value = v;
				return this.value;
			}
		}]);
	
		return _class36;
	}(M_.Form.Text);
	
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
	M_.Form.Price = function (_M_$Form$Number) {
		_inherits(_class37, _M_$Form$Number);
	
		function _class37(opts) {
			_classCallCheck(this, _class37);
	
			var defaults = {
				decimalLength: 2,
				decimalSeparator: ',',
				decimalForced: true,
				allowNegative: true
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class37.__proto__ || Object.getPrototypeOf(_class37)).call(this, opts));
		}
	
		return _class37;
	}(M_.Form.Number);
	
	/**
	 * Input color form ; TO implement !!!!
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} inputType
	 */
	M_.Form.Color = function (_M_$Form$Input9) {
		_inherits(_class38, _M_$Form$Input9);
	
		function _class38(opts) {
			_classCallCheck(this, _class38);
	
			var defaults = {
				inputType: 'color'
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class38.__proto__ || Object.getPrototypeOf(_class38)).call(this, opts));
		}
	
		return _class38;
	}(M_.Form.Input);
	
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
	M_.Form.Picker = function (_M_$Form$Text5) {
		_inherits(_class39, _M_$Form$Text5);
	
		function _class39(opts) {
			_classCallCheck(this, _class39);
	
			var defaults = {
				alwaysDropdownBelow: false,
				hasDropdown: true,
				hidePicker: false,
				showDropdownOnFocus: true,
				icon: 'fa fa-caret-down',
				containerDropdown: null,
				_clsMore: 'M_Combobox',
				stylePicker: '',
				dropdownOpts: {},
				dropdown: null
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			if (!optsTemp.containerDropdown) optsTemp.containerDropdown = optsTemp.container;
			optsTemp.containerDropdown = 'body';
			// log("optsTemp.containerDropdown",optsTemp.containerDropdown,optsTemp.container)
	
	
			var _this65 = _possibleConstructorReturn(this, (_class39.__proto__ || Object.getPrototypeOf(_class39)).call(this, optsTemp));
	
			if (_this65.showDropdownOnFocus && _this65.hasDropdown) {
				_this65._sameEventEventClick = false;
				_this65.jEl.on('click', function (evt) {
					// focus
					// console.log("this._sameEventEventClick", this._sameEventEventClick);
					if (!_this65._sameEventEventClick) _this65.showDropdown(evt);
					_this65._sameEventEventClick = true;
					M_.Utils.delay(function () {
						_this65._sameEventEventClick = false;
					}, 200, "_sameEventEventClick");
				});
			}
			return _this65;
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class39, [{
			key: 'createDropdown',
			value: function createDropdown() {
				var _this66 = this;
	
				if (this.dropdown) return;
				if (!this.hasDropdown) return;
				// console.log("createDropdown");
				var optsTemp = $.extend({}, {
					alignTo: this.jEl,
					autoShow: false,
					destroyOnHide: true,
					container: this.containerDropdown,
					alwaysDropdownBelow: this.alwaysDropdownBelow,
					listeners: [['hide', function () {
						_this66.dropdown = null;
					}]]
				}, this.dropdownOpts);
				this.dropdown = new M_.Dropdown(optsTemp);
			}
			/**
	   * @return {Boolean}
	   */
	
		}, {
			key: 'isDropdownVisible',
			value: function isDropdownVisible() {
				if (!this.dropdown) return false;
				return this.dropdown.isVisible();
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'showDropdown',
			value: function showDropdown(evt) {
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
	
		}, {
			key: 'clickPicker',
			value: function clickPicker(evt) {
				this.showDropdown(evt);
				this.trigger('clickpicker', this, evt);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'create',
			value: function create() {
				var _this67 = this;
	
				_get(_class39.prototype.__proto__ || Object.getPrototypeOf(_class39.prototype), 'create', this).call(this);
	
				if (!this.hidePicker) {
					var moreCls = '',
					    moreStyle = '';
					if ((this.labelPosition == 'left' || this.labelPosition == 'right') && this.label !== '') {
						moreCls += " M_InputLeft";
						moreStyle += " width:calc(100% - " + this.labelWidth + "px);";
					}
					this.jEl.outerWidth('100%');
					this.jEl.removeClass('M_InputLeft');
					this.jEl.wrap("<div class='M_FormInputGroup " + moreCls + "' style='" + moreStyle + "'>");
					var htmlCaret = '<div class="M_FormCaret ' + this.icon + '" style=\'' + this.stylePicker + '\'></div>';
					this.caret = $(htmlCaret);
					this.container.find('.M_FormInputGroup').append(this.caret);
					this.caret.click(function (evt) {
						_this67.clickPicker(evt);
					});
				}
			}
		}]);
	
		return _class39;
	}(M_.Form.Text);
	
	/**
	 * Input date form ; display a date picker and a month view
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Picker
	 * @property {type} icon
	 * @property {type} dateFormat
	 * @property {type} dateFormatInput
	 */
	M_.Form.Date = function (_M_$Form$Picker) {
		_inherits(_class40, _M_$Form$Picker);
	
		function _class40(opts) {
			_classCallCheck(this, _class40);
	
			var defaults = {
				icon: 'fa fa-calendar',
				dateFormat: 'DD/MM/YYYY',
				dateFormatInput: 'YYYY-MM-DD',
				noDays: false,
				showWeekNumber: false,
				selectWeek: false,
				disabledDates: null
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			// if (!optsTemp.value) optsTemp.value = moment() ;
			return _possibleConstructorReturn(this, (_class40.__proto__ || Object.getPrototypeOf(_class40)).call(this, optsTemp));
	
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
	
	
		_createClass(_class40, [{
			key: 'createDropdown',
			value: function createDropdown() {
				var _this69 = this;
	
				this.dropdown = new M_.Dropdown({
					destroyOnHide: true,
					alignTo: this.jEl,
					container: this.containerDropdown,
					autoSize: false,
					alwaysDropdownBelow: this.alwaysDropdownBelow,
					listeners: [['destroy', function () {
						_this69.dropdown = null;
						_this69.calendar.destroy();
					}]]
				});
				this.calendar = new M_.CalendarMonth({
					controller: this,
					container: this.dropdown.jEl,
					noDays: this.noDays,
					showWeekNumber: this.showWeekNumber,
					selectWeek: this.selectWeek,
					disabledDates: this.disabledDates,
					listeners: [['selected', function (cal, date) {
						// log("date",cal, date)
						// this.container.html(date.format('DD/MM/YYYY')) ;
						_this69.setValue(date);
						_this69.trigger('change', _this69, date);
						_this69.dropdown.hide();
					}], ['viewedChanged', function () {
						_this69.dropdown.realign();
					}]]
				});
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'showDropdown',
			value: function showDropdown(evt) {
				_get(_class40.prototype.__proto__ || Object.getPrototypeOf(_class40.prototype), 'showDropdown', this).call(this, evt);
				if (moment.isMoment(this.value) && this.calendar) {
					this.calendar.setDateViewed(this.value);
					this.calendar.setDateSelected(this.value);
				}
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'onKeyup',
			value: function onKeyup(evt) {
				_get(_class40.prototype.__proto__ || Object.getPrototypeOf(_class40.prototype), 'onKeyup', this).call(this, evt);
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
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				if (val === '' || !val || val == '0000-00-00' || val == '0000-00-00 00:00:00') val = "";else if (moment.isMoment(val)) {
					if (!val.isValid()) val = "";
					// else val = val.format('YYYY-MM-DD') ;
				} else val = moment(val, this.dateFormatInput);
				this.value = val;
				// if (val!=='') log("format",val,val.format(this.dateFormat))
				if (val !== '') {
					this.jEl.val(val.format(this.dateFormat));
				} else this.jEl.val(val);
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				var v = this.jEl.val();
				if (v !== '') {
					v = moment(v, this.dateFormat).startOf('day');
					if (!serialized) return v;
					v = v.format("YYYY-MM-DD");
				}
				return v;
			}
		}]);
	
		return _class40;
	}(M_.Form.Picker);
	
	M_.Form.DateWeek = function (_M_$Form$Date) {
		_inherits(_class41, _M_$Form$Date);
	
		function _class41(opts) {
			_classCallCheck(this, _class41);
	
			var defaults = {
				// icon: 'fa fa-clock-o',
				dateFormat: 'YYYY-\\SWW',
				dateFormatInput: 'YYYY-MM-DD',
				showWeekNumber: true,
				selectWeek: true
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class41.__proto__ || Object.getPrototypeOf(_class41)).call(this, optsTemp));
		}
	
		return _class41;
	}(M_.Form.Date);
	
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
	M_.Form.Hour = function (_M_$Form$Date2) {
		_inherits(_class42, _M_$Form$Date2);
	
		function _class42(opts) {
			_classCallCheck(this, _class42);
	
			var defaults = {
				icon: 'fa fa-clock-o',
				dateFormat: 'HH:mm',
				dateFormatInput: 'HH:mm',
				incrementHour: 1,
				incrementMinute: 10,
				incrementSecond: 5
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class42.__proto__ || Object.getPrototypeOf(_class42)).call(this, optsTemp));
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class42, [{
			key: 'createDropdown',
			value: function createDropdown() {
				var _this72 = this;
	
				// log("createDropdown")
				var html = '\n\t\t<div class="">\n\t\t\t<div class="M_Col6 M_FormHour_hour_up"><span class="fa fa-chevron-up"></span></div>\n\t\t\t<div class="M_Col6 M_FormHour_minute_up"><span class="fa fa-chevron-up"></span></div>\n\t\t\t<div class="M_Col6 M_FormHour_second_up"><span class="fa fa-chevron-up"></span></div>\n\t\t\t<div class="M_Clear"></div>\n\n\t\t\t<div class="M_Col6"><input type="text" class="form-control M_FormHour_hour" placeholder="" maxlength="2"></div>\n\t\t\t<div class="M_Col6"><input type="text" class="form-control M_FormHour_minute" placeholder="" maxlength="2"></div>\n\t\t\t<div class="M_Col6"><input type="text" class="form-control M_FormHour_second" placeholder="" maxlength="2"></div>\n\t\t\t<div class="M_Clear"></div>\n\n\t\t\t<div class="M_Col6 M_FormHour_hour_down"><span class="fa fa-chevron-down"></span></div>\n\t\t\t<div class="M_Col6 M_FormHour_minute_down"><span class="fa fa-chevron-down"></span></div>\n\t\t\t<div class="M_Col6 M_FormHour_second_down"><span class="fa fa-chevron-down"></span></div>\n\t\t\t<div class="M_Clear"></div>\n\t\t\t<div>\n\t\t</div>\n\t\t';
				this.dropdown = new M_.Dropdown({
					destroyOnHide: true,
					alignTo: this.jEl,
					autoSize: false,
					html: html,
					listeners: [['destroy', function () {
						_this72.dropdown = null;
					}]]
				});
				this.jElDropdown = this.dropdown.jEl;
				this.value = moment();
				// log("this.value",this.value)
				if (this.jEl.val().length > 0) this.value = moment(this.jEl.val(), this.dateFormat);
				this.setToCurrent();
				if (this.dateFormat.indexOf("s") < 0) {
					this.jElDropdown.find(".M_FormHour_second_up, .M_FormHour_second_down").hide();
					this.jElDropdown.find(".M_FormHour_second").parent().hide();
					this.jElDropdown.find(".col-lg-4").removeClass('col-lg-4').addClass('col-lg-6');
					this.jElDropdown.find(".dropdown-menu").addClass('short');
				}
				this.jElDropdown.find(".M_FormHour_hour_up").off('click');
				this.jElDropdown.find(".M_FormHour_hour_up").on('click', $.proxy(function (evt) {
					// log("this.value",this.value)
					var m = this.value.hours() + this.incrementHour;
					m = Math.floor(m / this.incrementHour) * this.incrementHour;
					this.value.hours(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".M_FormHour_minute_up").off('click');
				this.jElDropdown.find(".M_FormHour_minute_up").on('click', $.proxy(function (evt) {
					var m = this.value.minutes() + this.incrementMinute;
					m = Math.floor(m / this.incrementMinute) * this.incrementMinute;
					this.value.minutes(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".M_FormHour_second_up").off('click');
				this.jElDropdown.find(".M_FormHour_second_up").on('click', $.proxy(function (evt) {
					var m = this.value.seconds() + this.incrementSecond;
					m = Math.floor(m / this.incrementSecond) * this.incrementSecond;
					this.value.seconds(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".M_FormHour_hour_down").off('click');
				this.jElDropdown.find(".M_FormHour_hour_down").on('click', $.proxy(function (evt) {
					var m = this.value.hours() - this.incrementHour;
					m = Math.floor(m / this.incrementHour) * this.incrementHour;
					this.value.hours(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".M_FormHour_minute_down").off('click');
				this.jElDropdown.find(".M_FormHour_minute_down").on('click', $.proxy(function (evt) {
					var m = this.value.minutes() - this.incrementMinute;
					m = Math.floor(m / this.incrementMinute) * this.incrementMinute;
					this.value.minutes(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".M_FormHour_second_down").off('click');
				this.jElDropdown.find(".M_FormHour_second_down").on('click', $.proxy(function (evt) {
					var m = this.value.seconds() - this.incrementSecond;
					m = Math.floor(m / this.incrementSecond) * this.incrementSecond;
					this.value.seconds(m);
					this.setToCurrent();
					this.setValue(this.value);
				}, this));
				this.jElDropdown.find(".dropdown-menu").show();
			}
			/**
	   * To document
	   */
	
		}, {
			key: 'setToCurrent',
			value: function setToCurrent() {
				this.jElDropdown.find(".M_FormHour_hour").val(this.value.format("HH"));
				this.jElDropdown.find(".M_FormHour_minute").val(this.value.format("mm"));
				this.jElDropdown.find(".M_FormHour_second").val(this.value.format("ss"));
			}
		}, {
			key: 'getValue',
			value: function getValue() {
				var v = this.jEl.val();
				var t = v.split(':');
				var m = moment().hours(t[0]).minutes(t[1]).seconds(0);
				// console.log("v",v,m,t);
				return m;
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				var val2;
				// console.log("val",val,moment().utcOffset());
				if (!val) val = '00:00';
				if (typeof val == 'string') {
					var v = '';
					if (val.length > 11) v = val.substring(11, 16);else v = val;
					var t = v.split(':');
					val2 = moment().hours(t[0]).minutes(t[1]).seconds(0); //.add(moment().utcOffset(),'minutes')
				} else val2 = moment(val); //.add(moment().utcOffset(),'minutes')
				this.jEl.val(val2.format(this.dateFormat));
				this.value = val2;
			}
		}]);
	
		return _class42;
	}(M_.Form.Date);
	
	/**
	 * Input datehour form ; display 2 pickers for date and hour
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} configDateDef
	 * @property {type} configHourDef
	 */
	M_.Form.DateHour = function (_M_$Form$Input10) {
		_inherits(_class43, _M_$Form$Input10);
	
		function _class43(opts) {
			_classCallCheck(this, _class43);
	
			var defaults = {
				configDateDef: {
					label: "",
					// labelPosition: 'left',
					// labelWidth: 3,
					name: '',
					containerWidth: '64%',
					required: true
				},
				configHourDef: {
					label: "",
					name: '',
					containerWidth: '36%',
					incrementMinute: 15,
					required: false
				}
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class43.__proto__ || Object.getPrototypeOf(_class43)).call(this, optsTemp));
	
			// if ((this.labelPosition=='left' || this.labelPosition=='right') && this.labelWidth===0) this.labelWidth = 0.3 ;
	
		}
		/**
	  * @return {type}
	  */
	
	
		_createClass(_class43, [{
			key: 'create',
			value: function create() {
				var id1 = M_.Utils.id(),
				    id2 = M_.Utils.id();
	
				if (M_.Utils.isEmpty(this.id)) this.id = M_.Utils.id();
				var v = this.value;
				if ($.type(v) !== "string") v = '';
				if ((this.labelPosition == 'left' || this.labelPosition == 'right') && this.label !== '') {
					this.clsLabel += " M_LabelLeft";
					this.clsInput += " M_InputLeft";
				}
				if (this.labelWidth > 0 && this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'right') && this.inputType != 'checkbox') {
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
				if (this.labelFocusInput) forattr = 'for="' + this.id + '"';
				if (!this.editable) readOnly = "readonly";
	
				// var html = `<div class='M_HorizontalForm'></div></div>` ;
	
	
				html += '<div style="' + this.styleGroup + '" class="M_FormGroup ' + this.clsGroup + '">';
				if (this.label !== '' && (this.labelPosition == 'left' || this.labelPosition == 'top')) html += '<label style="' + this.styleLabel + '" class="' + this.clsLabel + '" ' + forattr + '>' + this.label + '</label>';
				html += '<div id="' + this.id + '" type="' + this.inputType + '" style="' + this.styleInput + '" class="M_Input ' + this.clsInput + '"><div id=\'' + id1 + '\' class=\'M_FloatLeft\'></div><div id=\'' + id2 + '\' class=\'M_FloatLeft\'></div>';
				html += '</div>';
	
				this.container.append(html);
				this.jEl = this.container.find('.M_HorizontalForm');
	
				var configDate = $.extend({}, this.configDateDef, this.configDate);
				var configHour = $.extend({}, this.configHourDef, this.configHour);
				configDate.container = $('#' + id1);
				configHour.container = $('#' + id2);
				$('#' + id1).width(configDate.containerWidth);
				$('#' + id2).width(configHour.containerWidth);
				this.formDate = new M_.Form.Date(configDate);
				this.formHour = new M_.Form.Hour(configHour);
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.formDate.setValue(val);
				this.formHour.setValue(val);
			}
			/**
	   * @param  {Boolean}
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var serialized = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
				var d1 = this.formDate.getValue();
				if (d1 !== '') {
					var d = moment(d1);
					var d2 = this.formHour.getValue();
					// console.log("d2",d2,d2.hours(),d2.minutes(),d2.seconds(),d2.format('HH:mm'),d2.utcOffset());
					if (d2) {
						// d2.local() ;
						// log(".utcOffset()",d2.utcOffset())
						d.hours(d2.hours());
						d.minutes(d2.minutes()); //+d2.utcOffset()
						d.seconds(d2.seconds());
					}
					return d;
				}
				return d1;
			}
		}]);
	
		return _class43;
	}(M_.Form.Input);
	
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
	M_.Form.Combobox = function (_M_$Form$Picker2) {
		_inherits(_class44, _M_$Form$Picker2);
	
		function _class44(opts) {
			_classCallCheck(this, _class44);
	
			var defaults = {
				store: null,
				modelKey: 'key',
				modelValue: 'val',
				mode: 'local',
				editable: true,
				useRawValue: false,
				useZeroIfEmpty: false
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
	
			var _this74 = _possibleConstructorReturn(this, (_class44.__proto__ || Object.getPrototypeOf(_class44)).call(this, optsTemp));
	
			if (_this74.store.url === '') _this74.mode = 'local';else _this74.mode = 'remote';
	
			if (_this74.mode == 'remote') {
				_this74.store.addListener('load', function (store, models) {
					// log("models", models, this.modelValue)
					_this74.createDropdown();
					_this74._createItemsFromStore();
					_this74.dropdown.show();
				});
			}
	
			// this.jEl.on('M_DropdownShow', (evt)=> {
			// 	if (!this.dropdown) this.createDropdown() ;
			// 	this.showDropdown() ;
			// }) ;
			if (!_this74.editable) {
				_this74.jEl.css('cursor', 'pointer');
				_this74.jEl.on('click', function (evt) {
					_this74.showDropdown(evt);
				});
			}
			return _this74;
		}
	
		_createClass(_class44, [{
			key: '_createItemsFromStore',
			value: function _createItemsFromStore() {
				var _this75 = this;
	
				// log("_createItemsFromStore",this.store)
				var items = [];
				this.store.each(function (model) {
					// var val = "" ;
					// if (typeof this.modelValue === 'function') val = this.modelValue(model) ;
					// else val = model.get(this.modelValue) ;
					items.push({
						text: _this75._getVal(model),
						click: $.proxy(_this75.clickItemDropdown, _this75, model.get(_this75.modelKey))
					});
				});
				// if (!this.dropdown)
				this.createDropdown();
				this.dropdown.setItems(items);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'create',
			value: function create() {
				_get(_class44.prototype.__proto__ || Object.getPrototypeOf(_class44.prototype), 'create', this).call(this);
				// this.caret = $('<span class="fa fa-caret-down M_caret M_showonedit"></span>') ;
				// this.container.find('.M_editable').after(this.caret);
				// this.caret.click($.proxy(this.showDropdown, this)) ;
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'showDropdown',
			value: function showDropdown(evt) {
				M_.Help.hideMHelp();
				if (evt) evt.stopPropagation();
				if (this.disabled) return;
				// if (!this.dropdown)
	
				if (this.mode == 'local') {
					this.createDropdown();
					this._createItemsFromStore();
					this.dropdown.show();
				} else if (this.store.load()) {
					// this.createDropdown() ;
				};
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'clickItemDropdown',
			value: function clickItemDropdown(val) {
				this.setValue(val);
				var model = this.store.getRow(val);
				if (model) {
					this.trigger('itemclick', this, model);
				} else {
					this.trigger('itemclick', this, val);
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getRawValue',
			value: function getRawValue() {
				// return this.container.find('M_editable').text() ;
				return this.jEl.val();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				if (this.useRawValue) return this.getRawValue();
				if (this.getRawValue() === '') this.value = '';
				if (this.value === "" && this.useZeroIfEmpty) return 0;
				return this.value;
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValueAndRaw',
			value: function getValueAndRaw() {
				return { key: this.value, val: this.getRawValue() };
			}
		}, {
			key: '_getVal',
			value: function _getVal(model) {
				var val = "";
				if (typeof this.modelValue === 'function') val = this.modelValue(model);else val = model.get(this.modelValue);
				return val;
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setValue',
			value: function setValue(val) {
				// log("setValue",this.name, val)
				if (val === null) val = "";
				if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
					var model = new this.store.model({ row: val });
					// log("setValue créé",model)
					this.setValueAndRawValue(val[this.modelKey], this._getVal(model));
					this.trigger('update', this, model);
				} else {
					this.value = val;
					var _model = this.store.getRow(val);
					if (_model) {
						this.setValueAndRawValue(val, this._getVal(_model));
						this.trigger('update', this, _model);
					} else {
						this.setRawValue(val);
						this.trigger('update', this, val);
					}
				}
			}
			/**
	   * @param {type}
	   * @param {type}
	   */
	
		}, {
			key: 'setValueAndRawValue',
			value: function setValueAndRawValue(val, rawVal) {
				this.value = val;
				this.setRawValue(rawVal);
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setRawValue',
			value: function setRawValue(val) {
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
	
		}, {
			key: 'onKeyup',
			value: function onKeyup(evt) {
				var _this76 = this;
	
				// log("this.keyField",this.keyField)
				var v = this.getRawValue();
				if (this.mode == 'local') {
					this.showDropdown();
					var items = [];
					this.store.each(function (model) {
						// log("model",model)
						var val = _this76._getVal(model).toLowerCase();
						if (val.indexOf(v.toLowerCase()) >= 0) {
							items.push({
								text: _this76._getVal(model),
								click: $.proxy(_this76.clickItemDropdown, _this76, model.get(_this76.modelKey))
							});
						}
					});
					this.dropdown.setItems(items);
				} else {
					this.store.load({ query: v.toLowerCase() });
				}
				this.trigger('keyup', this, evt);
			}
		}]);
	
		return _class44;
	}(M_.Form.Picker);
	
	/**
	 * Input combobox form ; display a comobobox + a list of values
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Combobox
	 */
	M_.Form.ComboboxMulti = function (_M_$Form$Combobox) {
		_inherits(_class45, _M_$Form$Combobox);
	
		function _class45(opts) {
			_classCallCheck(this, _class45);
	
			var defaults = {
				allowCreate: true
			};
			opts = opts ? opts : {};
			var optsTemp = $.extend({}, defaults, opts);
	
			var _this77 = _possibleConstructorReturn(this, (_class45.__proto__ || Object.getPrototypeOf(_class45)).call(this, optsTemp));
	
			_this77.jElForMulti = $("<div></div>");
			_this77.container.append(_this77.jElForMulti);
			_this77.container.append("<div class='M_Clear'></div>");
			return _this77;
		}
	
		_createClass(_class45, [{
			key: 'onEnterInput',
			value: function onEnterInput() {
				if (this.allowCreate) {
					this.addItemMulti('', this.getRawValue());
					this.setValueAndRawValue('', '');
				}
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'clickItemDropdown',
			value: function clickItemDropdown(val) {
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
				this.setRawValue('');
				this.addItemMulti(val, realval);
			}
			/**
	   * @param {type}
	   * @param {type}
	   */
	
		}, {
			key: 'addItemMulti',
			value: function addItemMulti(val, realval, deletable) {
				var _this78 = this;
	
				var idTemp = M_.Utils.id();
				var html = "<div class='M_ComboboxMultiItem selected' data-comboboxmultiitem=\"" + val + "\" data-comboboxmultiitemval=\"" + realval + "\">" + realval;
				if (deletable !== false) html += "&nbsp;<span class='fa fa-trash faa-pulse animated-hover' id='" + idTemp + "'></span>";
				html += " </div>";
				this.jElForMulti.append(html);
				if (deletable !== false) {
					$("#" + idTemp).click(function (evt) {
						$(evt.target).closest('.M_ComboboxMultiItem').remove();
						_this78.trigger('update', _this78, val);
					});
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				var res = [];
				var me = this;
				this.jElForMulti.find('.M_ComboboxMultiItem').each(function () {
					var obj = {};
					obj[me.modelKey] = $(this).attr('data-comboboxmultiitem');
					obj[me.modelValue] = $(this).attr('data-comboboxmultiitemval');
					res.push(obj);
				});
				return res;
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				var _this79 = this;
	
				this.reset();
				_.each(val, function (v) {
					_this79.addItemMulti(v[_this79.modelKey], v[_this79.modelValue], v.deletable);
				});
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'reset',
			value: function reset() {
				if (this.jElForMulti) this.jElForMulti.empty();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValueAndRaw',
			value: function getValueAndRaw() {
				var res = [];
				this.jElForMulti.find('.M_ComboboxMultiItem').each(function () {
					res.push({
						val: $(this).attr('data-comboboxmultiitemval'),
						key: $(this).attr('data-comboboxmultiitem')
					});
				});
				return res;
			}
		}]);
	
		return _class45;
	}(M_.Form.Combobox);
	
	/**
	 * A simple div to use in forms (no label)
	 * @class
	 * @memberof! <global>
	 * @property {type} html
	 */
	M_.Form.Div = function () {
		function _class46(opts) {
			_classCallCheck(this, _class46);
	
			var defaults = {
				html: ''
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
			this.container.append(this.html);
		}
	
		return _class46;
	}();
	
	/**
	 * A simple div with label
	 * @class
	 * @memberof! <global>
	 * @extends M_.Form.Input
	 * @property {type} inputType
	 */
	M_.Form.Display = function (_M_$Form$Input11) {
		_inherits(_class47, _M_$Form$Input11);
	
		function _class47(opts) {
			_classCallCheck(this, _class47);
	
			var defaults = {
				inputType: 'none'
			};
			opts = opts ? opts : {};
			opts = $.extend({}, defaults, opts);
			return _possibleConstructorReturn(this, (_class47.__proto__ || Object.getPrototypeOf(_class47)).call(this, opts));
		}
		/**
	  * @param {type}
	  */
	
	
		_createClass(_class47, [{
			key: 'setValue',
			value: function setValue(val) {
				// if (val=="") val=[] ;
				this.value = val;
				this.jEl.html(val);
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'getValue',
			value: function getValue() {
				return this.value;
			}
		}]);
	
		return _class47;
	}(M_.Form.Input);
	
	/**
	 * A wysiwyg editor to use directly or in a textarea
	 * @class
	 * @memberof! <global>
	 * @property {type} buttonsContainer
	 * @property {type} buttons
	 */
	M_.Editor = function () {
		function _class48(opts) {
			_classCallCheck(this, _class48);
	
			var defaults = {
				buttonsContainer: null,
				buttonsToDisplay: ['formatBlock', 'bold', 'italic', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'list', 'removeFormat', '|', 'createLink', 'table', 'image', 'templates', '|', 'source'],
				buttons: [['formatBlock', "Fomater paragraphe", 'fa-font', '', '', [['formatH1', "H1", '', 'execFormatBlock', 'H1'], ['formatH2', "H2", '', 'execFormatBlock', 'H2'], ['formatH3', "H3", '', 'execFormatBlock', 'H3'], ['formatH4', "H4", '', 'execFormatBlock', 'H4'], ['formatH5', "H5", '', 'execFormatBlock', 'H5'], ['formatP', "P", '', 'execFormatBlock', 'P'], ['formatDIV', "DIV", '', 'execFormatBlock', 'DIV']]], ['bold', "Gras", 'fa-bold', 'execCommand', 'bold'], ['italic', "Italique", 'fa-italic', 'execCommand', 'italic'], ['justifyLeft', "Justifier à gauche", 'fa-align-left', 'execJustify', 'Left'], ['justifyCenter', "Justifier au centre", 'fa-align-center', 'execJustify', 'Center'], ['justifyRight', "Justifier à droite", 'fa-align-right', 'execJustify', 'Right'], ['justifyFull', "Justifier à gauche et à droite", 'fa-align-justify', 'execJustify', 'Full'], ['list', "Liste numéroté ou avec puces", 'fa-list-ol', 'execCommand', '', [['insertorderedlist', "Liste numéroté", 'fa-list-ol', 'execCommand', 'insertorderedlist'], ['insertunorderedlist', "Liste avec puces", 'fa-list-ul', 'execCommand', 'insertunorderedlist'], ['outdent', "Outdent", 'fa-outdent', 'execCommand', 'outdent'], ['indent', "Indent", 'fa-indent', 'execCommand', 'indent']]], ['removeFormat', "Effacer", 'fa-eraser', 'execCommand', 'removeFormat'], '|', ['createLink', "Lien", 'fa-link', '', '', [['insertorderedlist', "Créer un lien", 'fa-link', 'execLink', ''], ['insertunorderedlist', "Enlever le lien", 'fa-unlink', 'execCommand', 'unlink']]], ['table', "Outils tableau", 'fa-table', '', '', [['insertTable', "Insérer un tableau", '', 'execInsertTable'], ['insertTableColumn', "Nouvelle colonne", '', 'execInsertTableColumn'], ['insertTableRow', "Nouvelle rangée", '', 'execInsertTableRow'], ['editTable', "Edition tableau", '', 'execEditTable'], ['editCell', "Edition céllule", '', 'execEditCell']]], ['image', "Images", 'fa-picture-o', '', '', [['newImage', "Nouvelle image", 'fa-picture-o', 'execNewImage', ''], ['infoImage', "Information sur l'image", 'fa-edit', 'execImageInfo', ''], ['imagesLibrary', "Bibliothèque d'images", 'fa-windows', 'execImageLibrary', ''], ['imagesReplace', "Remplacer image", 'fa-magic', 'execImageReplace', '']]], ['templates', "Templates", 'fa-file', '', ''], '|', ['source', "Code source", 'fa-terminal', 'execSource']]
			};
			opts = opts ? opts : {};
			$.extend(this, defaults, opts);
	
			this.init();
		}
		/**
	  */
	
	
		_createClass(_class48, [{
			key: 'init',
			value: function init() {
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
	
		}, {
			key: 'execJustify',
			value: function execJustify(what) {
				document.execCommand("justify" + what, false, null);
				this.caretMove();
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'execCommand',
			value: function execCommand(comm) {
				document.execCommand(comm, false, null);
				this.caretMove();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execInsertTable',
			value: function execInsertTable() {
				document.execCommand("insertHTML", false, "<table><tr><td>Cell 1.1</td><td>Cell 1.2</td></tr><tr><td>Cell 2.1</td><td>Cell 2.2</td></tr></table>");
				this.caretMove();
			}
			/**
	   * @param  {type}
	   * @return {type}
	   */
	
		}, {
			key: 'execFormatBlock',
			value: function execFormatBlock(block) {
				document.execCommand("formatBlock", false, block.toLowerCase());
				this.caretMove();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execInsertTableColumn',
			value: function execInsertTableColumn() {
				var td = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("td");
				if (td.length && td.closest("#" + this.container.get(0).id).length) {
					var n = td.closest("tr").find("td").index(td);
					td.closest("table").find('tr').each(function () {
						$(this).find('td').eq(n).after('<td>Nouvelle cellule</td>');
					});
				}
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execInsertTableRow',
			value: function execInsertTableRow() {
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
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execLink',
			value: function execLink() {
				if (!this.winLink) {
					this.winLink = new (function (_M_$Window) {
						_inherits(_class49, _M_$Window);
	
						function _class49() {
							_classCallCheck(this, _class49);
	
							return _possibleConstructorReturn(this, (_class49.__proto__ || Object.getPrototypeOf(_class49)).call(this, {
								modal: true,
								width: 400
							}));
						}
	
						_createClass(_class49, [{
							key: 'create',
							value: function create() {
								var _this82 = this;
	
								var idBtSave = M_.Utils.id(),
								    idBtCancel = M_.Utils.id(),
								    idLink = M_.Utils.id(),
								    idTarget = M_.Utils.id();
								this.html = '<div class="M_WindowContent">\n\t\t\t\t\t\t<div class="M_WindowHeader">\n\t\t\t\t\t\t\t<h1>Edition <b>d\'un lien</b></h1>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowBody">\n\t\t\t\t\t\t\t<div id="' + idLink + '"></div>\n\t\t\t\t\t\t\t<div id="' + idTarget + '"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowFooter">\n\t\t\t\t\t\t\t<div class="M_FloatRight">\n\t\t\t\t\t\t\t\t<button id="' + idBtSave + '" type="button" class="M_Button primary">Enregistrer</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="M_FloatLeft">\n\t\t\t\t\t\t\t\t<button id="' + idBtCancel + '" type="button" class="M_Button">Annuler</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
								_get(_class49.prototype.__proto__ || Object.getPrototypeOf(_class49.prototype), 'create', this).call(this);
	
								this.form = new M_.Form.Form({
									items: [{
										type: M_.Form.Text,
										name: 'link',
										placeholder: "Lien",
										label: "Lien",
										labelPosition: 'top',
										container: $("#" + idLink)
									}, {
										type: M_.Form.Combobox,
										name: 'target',
										allowEmpty: true,
										placeholder: "",
										label: "Cible",
										labelPosition: 'top',
										container: $("#" + idTarget),
										store: new M_.Store({
											controller: this,
											model: M_.ModelKeyVal,
											rows: [{ key: "", val: "Aucun" }, { key: "_blank", val: "_blank" }, { key: "_self", val: "_self" }]
										})
									}]
								});
								$("#" + idBtSave).click(function () {
									M_.Utils.restoreSelection();
									document.execCommand('createLink', false, _this82.form.find('link').getValue());
									if (_this82.form.find('target').getValue() !== '') $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("a").attr("target", _this82.form.find('target').getValue());
									_this82.hide();
								});
								$("#" + idBtCancel).click(function () {
									M_.Utils.restoreSelection();
									_this82.hide();
								});
							}
						}]);
	
						return _class49;
					}(M_.Window))();
				}
				this.winLink.show();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execSource',
			value: function execSource() {
				if (!this.winSource) {
					this.winSource = new (function (_M_$Window2) {
						_inherits(_class50, _M_$Window2);
	
						function _class50(containerEditor) {
							_classCallCheck(this, _class50);
	
							var _this83 = _possibleConstructorReturn(this, (_class50.__proto__ || Object.getPrototypeOf(_class50)).call(this, {
								modal: true,
								width: 800
							}));
	
							_this83.containerEditor = containerEditor;
							return _this83;
						}
	
						_createClass(_class50, [{
							key: 'create',
							value: function create() {
								var _this84 = this;
	
								var idBtSave = M_.Utils.id(),
								    idBtCancel = M_.Utils.id(),
								    idCode = M_.Utils.id();
								this.html = '<div class="M_WindowContent">\n\t\t\t\t\t\t<div class="M_WindowHeader">\n\t\t\t\t\t\t\t<h1>Edition <b>du code source</b></h1>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowBody">\n\t\t\t\t\t\t\t<div id="' + idCode + '"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowFooter">\n\t\t\t\t\t\t\t<div class="M_FloatRight">\n\t\t\t\t\t\t\t\t<button id="' + idBtSave + '" type="button" class="M_Button primary">Enregistrer</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="M_FloatLeft">\n\t\t\t\t\t\t\t\t<button id="' + idBtCancel + '" type="button" class="M_Button">Annuler</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
								_get(_class50.prototype.__proto__ || Object.getPrototypeOf(_class50.prototype), 'create', this).call(this);
	
								this.form = new M_.Form.Form({
									items: [{
										type: M_.Form.Textarea,
										name: 'htmlcode',
										acceptTabulation: true,
										rows: 30,
										container: $("#" + idCode)
									}]
								});
								$("#" + idBtSave).click(function () {
									var html = _this84.form.find('htmlcode').getValue();
									_this84.containerEditor.html(html);
									_this84.hide();
								});
								$("#" + idBtCancel).click(function () {
									M_.Utils.restoreSelection();
									_this84.hide();
								});
							}
						}]);
	
						return _class50;
					}(M_.Window))(this.container);
				}
				var html = this.container.html();
				this.winSource.form.find('htmlcode').setValue(html);
				this.winSource.show();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execEditTable',
			value: function execEditTable() {
				var table = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("table");
				if (!table.length || !table.closest("#" + this.container.get(0).id).length) return;
				if (!this.winEditTable) {
					this.winEditTable = new (function (_M_$Window3) {
						_inherits(_class51, _M_$Window3);
	
						function _class51(containerEditor) {
							_classCallCheck(this, _class51);
	
							return _possibleConstructorReturn(this, (_class51.__proto__ || Object.getPrototypeOf(_class51)).call(this, {
								modal: true,
								width: 800,
								containerEditor: containerEditor
							}));
						}
	
						_createClass(_class51, [{
							key: 'create',
							value: function create() {
								var _this86 = this;
	
								var idBtSave = M_.Utils.id(),
								    idBtCancel = M_.Utils.id(),
								    idwidth = M_.Utils.id(),
								    idcellspacing = M_.Utils.id(),
								    idcellpadding = M_.Utils.id(),
								    idborder = M_.Utils.id(),
								    idstyle = M_.Utils.id(),
								    idid = M_.Utils.id(),
								    idalign = M_.Utils.id();
								this.html = '<div class="M_WindowContent">\n\t\t\t\t\t\t<div class="M_WindowHeader">\n\t\t\t\t\t\t\t<h1>Edition <b>d\'un tableau</b></h1>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowBody">\n\t\t\t\t\t\t\t<div id="' + idwidth + '"></div>\n\t\t\t\t\t\t\t<div id="' + idcellspacing + '"></div>\n\t\t\t\t\t\t\t<div id="' + idcellpadding + '"></div>\n\t\t\t\t\t\t\t<div id="' + idborder + '"></div>\n\t\t\t\t\t\t\t<div id="' + idstyle + '"></div>\n\t\t\t\t\t\t\t<div id="' + idid + '"></div>\n\t\t\t\t\t\t\t<div id="' + idalign + '"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowFooter">\n\t\t\t\t\t\t\t<div class="M_FloatRight">\n\t\t\t\t\t\t\t\t<button id="' + idBtSave + '" type="button" class="M_Button primary">Enregistrer</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="M_FloatLeft">\n\t\t\t\t\t\t\t\t<button id="' + idBtCancel + '" type="button" class="M_Button">Annuler</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
								_get(_class51.prototype.__proto__ || Object.getPrototypeOf(_class51.prototype), 'create', this).call(this);
	
								this.form = new M_.Form.Form({
									itemsDefaults: {
										labelPosition: 'left',
										labelWidth: 250
									},
									items: [{
										type: M_.Form.Text,
										label: "Largeur (px ou %)",
										name: 'width',
										container: $("#" + idwidth)
									}, {
										type: M_.Form.Number,
										label: "Espacement des cellules",
										name: 'cellpadding',
										container: $("#" + idcellpadding)
									}, {
										type: M_.Form.Number,
										label: "Marge des cellules",
										name: 'cellspacing',
										container: $("#" + idcellspacing)
									}, {
										type: M_.Form.Number,
										label: "Taille de la bordure",
										name: 'border',
										container: $("#" + idborder)
									}, {
										type: M_.Form.Text,
										label: "Style CSS",
										name: 'style',
										container: $("#" + idstyle)
									}, {
										type: M_.Form.Text,
										label: "ID",
										name: 'id',
										container: $("#" + idid)
									}, {
										type: M_.Form.Combobox,
										name: 'align',
										allowEmpty: true,
										placeholder: "",
										label: "Alignement",
										container: $("#" + idalign),
										store: new M_.Store({
											controller: this,
											model: M_.ModelKeyVal,
											rows: [{ key: "", val: "Aucun" }, { key: "left", val: "Gauche" }, { key: "center", val: "Centré" }, { key: "right", val: "Droite" }]
										})
	
									}]
								});
								$("#" + idBtSave).click(function () {
									_this86.currentTable.css({ width: _this86.form.find("width").getValue() });
									_this86.currentTable.attr("cellpadding", _this86.form.find("cellpadding").getValue());
									_this86.currentTable.attr("cellspacing", _this86.form.find("cellspacing").getValue());
									_this86.currentTable.attr("border", _this86.form.find("border").getValue());
									_this86.currentTable.attr("align", _this86.form.find("align").getValue());
									_this86.hide();
								});
								$("#" + idBtCancel).click(function () {
									M_.Utils.restoreSelection();
									_this86.hide();
								});
							}
						}, {
							key: 'setCurrentTable',
							value: function setCurrentTable(currentTable) {
								this.currentTable = currentTable;
								var sEl = this.currentTable.get(0).style;
								if (sEl.width !== '') this.form.find("width").setValue(this.currentTable.get(0).style.width);else this.form.find("width").setValue("");
								if (this.currentTable.attr('cellpadding')) this.form.find("cellpadding").setValue(this.currentTable.attr('cellpadding'));else this.form.find("cellpadding").setValue("");
								if (this.currentTable.attr('cellspacing')) this.form.find("cellspacing").setValue(this.currentTable.attr('cellspacing'));else this.form.find("cellspacing").setValue("");
								if (this.currentTable.attr('border')) this.form.find("border").setValue(this.currentTable.attr('border'));else this.form.find("border").setValue("");
								if (this.currentTable.attr('align')) this.form.find("align").setValue(this.currentTable.attr('align'));else this.form.find("align").setValue("");
							}
						}]);
	
						return _class51;
					}(M_.Window))(this.container);
				}
				this.winEditTable.setCurrentTable(table);
				this.winEditTable.show();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execEditCell',
			value: function execEditCell() {
				var td = $(document.getSelection().getRangeAt(0).commonAncestorContainer).closest("td");
				if (!td.length || !td.closest("#" + this.container.get(0).id).length) return;
				if (!this.winEditCell) {
					this.winEditCell = new (function (_M_$Window4) {
						_inherits(_class52, _M_$Window4);
	
						function _class52(containerEditor) {
							_classCallCheck(this, _class52);
	
							return _possibleConstructorReturn(this, (_class52.__proto__ || Object.getPrototypeOf(_class52)).call(this, {
								modal: true,
								width: 800,
								containerEditor: containerEditor
							}));
						}
	
						_createClass(_class52, [{
							key: 'create',
							value: function create() {
								var _this88 = this;
	
								var idBtSave = M_.Utils.id(),
								    idBtCancel = M_.Utils.id(),
								    idwidth = M_.Utils.id(),
								    idalign = M_.Utils.id(),
								    idvalign = M_.Utils.id(),
								    idcolor = M_.Utils.id();
								this.html = '<div class="M_WindowContent">\n\t\t\t\t\t\t<div class="M_WindowHeader">\n\t\t\t\t\t\t\t<h1>Edition <b>d\'une cellule</b></h1>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowBody">\n\t\t\t\t\t\t\t<div id="' + idwidth + '"></div>\n\t\t\t\t\t\t\t<div id="' + idalign + '"></div>\n\t\t\t\t\t\t\t<div id="' + idvalign + '"></div>\n\t\t\t\t\t\t\t<div id="' + idcolor + '"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowFooter">\n\t\t\t\t\t\t\t<div class="M_FloatRight">\n\t\t\t\t\t\t\t\t<button id="' + idBtSave + '" type="button" class="M_Button primary">Enregistrer</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="M_FloatLeft">\n\t\t\t\t\t\t\t\t<button id="' + idBtCancel + '" type="button" class="M_Button">Annuler</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
								_get(_class52.prototype.__proto__ || Object.getPrototypeOf(_class52.prototype), 'create', this).call(this);
	
								this.form = new M_.Form.Form({
									itemsDefaults: {
										labelPosition: 'left',
										labelWidth: 250
									},
									items: [{
										type: M_.Form.Text,
										label: "Largeur (px ou %)",
										name: 'width',
										container: $("#" + idwidth)
									}, {
										type: M_.Form.Combobox,
										name: 'align',
										allowEmpty: true,
										placeholder: "",
										label: "Alignement",
										container: $("#" + idalign),
										store: new M_.Store({
											controller: this,
											model: M_.ModelKeyVal,
											rows: [{ key: "", val: "Aucun" }, { key: "left", val: "Gauche" }, { key: "center", val: "Centré" }, { key: "right", val: "Droite" }]
										})
	
									}, {
										type: M_.Form.Combobox,
										name: 'valign',
										allowEmpty: true,
										placeholder: "",
										label: "Alignement vertical",
										container: $("#" + idvalign),
										store: new M_.Store({
											controller: this,
											model: M_.ModelKeyVal,
											rows: [{ key: "", val: "Aucun" }, { key: "top", val: "Haut" }, { key: "middle", val: "Milieu" }, { key: "bottom", val: "Bas" }]
										})
									}, {
										type: M_.Form.Text,
										label: "Couleur",
										name: 'color',
										container: $("#" + idwidth)
	
									}]
								});
								$("#" + idBtSave).click(function () {
									_this88.currentCell.css({ width: _this88.form.find("width").getValue() });
									_this88.currentCell.attr("align", _this88.form.find("align").getValue());
									_this88.currentCell.attr("valign", _this88.form.find("valign").getValue());
									_this88.currentCell.css({ backgroundColor: _this88.form.find("color").getValue() });
									_this88.hide();
								});
								$("#" + idBtCancel).click(function () {
									M_.Utils.restoreSelection();
									_this88.hide();
								});
							}
						}, {
							key: 'setCurrentCell',
							value: function setCurrentCell(currentCell) {
								this.currentCell = currentCell;
								var sEl = this.currentCell.get(0).style;
								if (sEl.width !== '') this.form.find("width").setValue(this.currentCell.css('width'));else this.form.find("width").setValue("");
								if (this.currentCell.attr('align')) this.form.find("align").setValue(this.currentCell.attr('cellpadding'));else this.form.find("align").setValue("");
								if (this.currentCell.attr('valign')) this.form.find("valign").setValue(this.currentCell.attr('valign'));else this.form.find("valign").setValue("");
								if (sEl.backgroundColor !== '') this.form.find("color").setValue(this.currentCell.css('backgroundColor'));else this.form.find("color").setValue("");
							}
						}]);
	
						return _class52;
					}(M_.Window))(this.container);
				}
				this.winEditCell.setCurrentCell(td);
				this.winEditCell.show();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'execNewImage',
			value: function execNewImage() {
				if (!this.winNewImage) {
					this.winNewImage = new (function (_M_$Window5) {
						_inherits(_class53, _M_$Window5);
	
						function _class53(containerEditor) {
							_classCallCheck(this, _class53);
	
							var _this89 = _possibleConstructorReturn(this, (_class53.__proto__ || Object.getPrototypeOf(_class53)).call(this, {
								modal: true,
								width: 800,
								tabFilesToSend: []
							}));
	
							_this89.containerEditor = containerEditor;
							return _this89;
						}
	
						_createClass(_class53, [{
							key: 'create',
							value: function create() {
								var _this90 = this;
	
								var idBtSave = M_.Utils.id(),
								    idBtCancel = M_.Utils.id(),
								    idCode = M_.Utils.id();
								this.html = '<div class="M_WindowContent">\n\t\t\t\t\t\t<div class="M_WindowHeader">\n\t\t\t\t\t\t\t<h1>Envoyer <b>des images</b></h1>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowBody">\n\t\t\t\t\t\t\t<div id="' + idCode + '"></div>\n\t\t\t\t\t\t\t<div class="m_dropherenewimage" contenteditable><h2>Déposer ici un (ou des) fichier(s) de votre bureau</h2></div>\n\t\t\t\t\t\t\t<h2 style="margin-top:15px;">Ou choisissez les fichiers à envoyer</h2>\n\t\t\t\t\t\t\t<input type="file" class="m_fileinput" multiple />\n\t\t\t\t\t\t\t<div class="M_Clear"></div>\n\t\t\t\t\t\t\t<output class="m_fileoutput"></output>\n\t\t\t\t\t\t\t<div class="M_Clear"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="M_WindowFooter">\n\t\t\t\t\t\t\t<div class="M_FloatRight">\n\t\t\t\t\t\t\t\t<button id="' + idBtSave + '" type="button" class="M_Button primary">Enregistrer</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="M_FloatLeft">\n\t\t\t\t\t\t\t\t<button id="' + idBtCancel + '" type="button" class="M_Button">Annuler</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
								_get(_class53.prototype.__proto__ || Object.getPrototypeOf(_class53.prototype), 'create', this).call(this);
	
								this.jEl.find('.m_dropherenewimage').on('dragover', $.proxy(function (e) {
									this.jEl.find('.m_dropherenewimage').css('background-color', 'green');
								}, this));
								this.jEl.find('.m_dropherenewimage').on('dragleave', $.proxy(function (e) {
									this.jEl.find('.m_dropherenewimage').css('background-color', 'white');
								}, this));
								this.jEl.find('.m_dropherenewimage').on('drop', $.proxy(function (e) {
									this.jEl.find('.m_dropherenewimage').css('background-color', 'white');
									e.preventDefault();
									var files = e.originalEvent.dataTransfer.files;
									if (files.length === 0) return;
									for (var i = 0; i < files.length; i++) {
										var f = files[i];
										this.createThumbnail(f);
									}
								}, this));
	
								$("#" + idBtSave).click(function () {
	
									var formData = new FormData();
									for (var i = 0; i < _this90.tabFilesToSend.length; i++) {
										formData.append('file' + i, _this90.tabFilesToSend[i]);
									}
									var xhr = new XMLHttpRequest();
									xhr.open('POST', '/upload');
									var me = _this90;
									xhr.onload = function () {
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
									xhr.upload.onprogress = function (e) {
										if (e.lengthComputable) {
											// var complete = (e.loaded / e.total * 100 | 0);
											//Mlog("complete",complete)
											//updates a <progress> tag to show upload progress
											//$('progress').val(complete);
										}
									};
									xhr.send(formData);
								});
								$("#" + idBtCancel).click(function () {
									M_.Utils.restoreSelection();
									_this90.hide();
								});
							}
						}, {
							key: 'resetFileInput',
							value: function resetFileInput() {
								var control = this.jEl.find('.m_fileinput');
								this.jEl.find('.m_fileinput').replaceWith(control = control.clone(true));
								this.jEl.find('.m_fileinput').on('change', $.proxy(function (e) {
									var files = e.target.files;
									if (files.length === 0) return;
									for (var i = 0; i < files.length; i++) {
										var f = files[i];
										this.createThumbnail(f);
									}
								}, this));
							}
						}, {
							key: 'createThumbnail',
							value: function createThumbnail(f) {
								this.tabFilesToSend.push(f);
								var list = this.jEl.find('.m_fileoutput');
								var reader = new FileReader();
								var me = this;
								reader.onload = function (theFile) {
									return function (e) {
										list.append(['<img style="margin:0 15px 15px 0" src="', e.target.result, '" title="', theFile.name, '" width="100" />'].join(''));
										me.center();
									};
								}(f);
								reader.readAsDataURL(f);
							}
						}]);
	
						return _class53;
					}(M_.Window))(this.container);
				}
				this.winNewImage.resetFileInput();
				this.winNewImage.show();
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'caretMove',
			value: function caretMove() {
				if (document.getSelection().rangeCount > 0) {
					var sel = $(document.getSelection().getRangeAt(0).commonAncestorContainer);
					var html = "";
					var jEls = sel.parentsUntil("#" + this.container.get(0).id);
					if (!sel.hasClass('M_FormEditor-Content')) {
						var tabTemp = [];
						jEls.each(function (ind, el) {
							if (el.tagName) tabTemp.push(el.tagName);
						});
						tabTemp.reverse();
						tabTemp.push("text");
						html = tabTemp.join(' &gt; ');
					}
					//html += sel.get(0).tagName ;
					html += "&nbsp;";
					this.path.html(html);
				}
	
				if (document.queryCommandValue('bold') == 'true') this.buttonsContainer.find('button[m_id="bold"]').addClass('active');else this.buttonsContainer.find('button[m_id="bold"]').removeClass('active');
				if (document.queryCommandValue('italic') == 'true') this.buttonsContainer.find('button[m_id="italic"]').addClass('active');else this.buttonsContainer.find('button[m_id="italic"]').removeClass('active');
				if (document.queryCommandValue('justifyLeft') == 'true') this.buttonsContainer.find('button[m_id="justifyLeft"]').addClass('active');else this.buttonsContainer.find('button[m_id="justifyLeft"]').removeClass('active');
				if (document.queryCommandValue('justifyRight') == 'true') this.buttonsContainer.find('button[m_id="justifyRight"]').addClass('active');else this.buttonsContainer.find('button[m_id="justifyRight"]').removeClass('active');
				if (document.queryCommandValue('justifyCenter') == 'true') this.buttonsContainer.find('button[m_id="justifyCenter"]').addClass('active');else this.buttonsContainer.find('button[m_id="justifyCenter"]').removeClass('active');
				if (document.queryCommandValue('justifyFull') == 'true') this.buttonsContainer.find('button[m_id="justifyFull"]').addClass('active');else this.buttonsContainer.find('button[m_id="justifyFull"]').removeClass('active');
			}
			/**
	   * @return {type}
	   */
	
		}, {
			key: 'createButtons',
			value: function createButtons() {
				var _this91 = this;
	
				var toolbar = $("<div>", { 'class': 'M_Editor', 'role': 'toolbar' });
				this.buttonsContainer.append(toolbar);
				// var currentGroup = $("<div>", {'class':'btn-group'}) ;
				// toolbar.append(currentGroup) ;
	
				var _loop = function _loop() {
					var bt = _this91.buttons[i];
					if (_.indexOf(_this91.buttonsToDisplay, bt[0]) < 0) return 'continue';
					if (bt[0] === "|") {
						// currentGroup = $("<div>", {'class':'btn-group'}) ;
						// toolbar.append(currentGroup) ;
					} else {
						var caret = "";
						if (bt[5]) caret = "<span class='fa fa-caret-down'></span>";
						var button = $("<button m_id='" + bt[0] + "'><i class='fa " + bt[2] + "'></i> " + caret + "</button>");
						toolbar.append(button);
						if (bt[5]) {
							button.click({ items: bt[5] }, function (evt) {
								evt.stopPropagation();
								M_.Utils.saveSelection();
								var items = [];
								_.each(evt.data.items, function (item) {
									var nameTemp = item[1];
									if (item[2] && item[2] !== '') nameTemp = "<i class='fa " + item[2] + "'></i>&nbsp;" + nameTemp;
									items.push({
										text: nameTemp,
										click: function click(evt) {
											// evt.stopPropagation() ;
											// evt.preventDefault()
											M_.Utils.restoreSelection();
											_this91[item[3]](item[4]);
										}
									});
								});
								var dropdown = new M_.Dropdown({
									destroyOnHide: true,
									alignTo: $(evt.target).closest('button'),
									items: items
								});
								dropdown.show();
							});
						} else {
							button.click({ items: bt[5] }, function (evt) {
								_this91[bt[3]](bt[4]);
							});
						}
					}
				};
	
				for (var i = 0; i < this.buttons.length; i++) {
					var _ret = _loop();
	
					if (_ret === 'continue') continue;
				}
			}
			/**
	   * @param {type}
	   */
	
		}, {
			key: 'setContainer',
			value: function setContainer(container) {
				this.container = container;
				this.container.on('click', $.proxy(function (e) {
					this.container.prop("contenteditable", true);
					this.container.addClass('isEditing');
					if (!this.isStartedDrag) {
						$("#" + this.container.get(0).id + " .M_todelete").remove();
						this.imgDraggable = null;
					}
					this.caretMove();
				}, this));
				this.container.on('keyup', $.proxy(function (e) {
					this.caretMove();
				}, this));
				this.container.on('keydown', $.proxy(function (e) {
					this.caretMove();
				}, this));
				this.container.on('dragstart', $.proxy(function (e) {
					$("#" + this.container.get(0).id + " .M_todelete").remove();
				}, this));
				$(document).on('dblclick', '#' + this.container.get(0).id + " img", $.proxy(function (e) {
					this.execImageInfo();
				}, this));
				$(document).on('drop', '#' + this.container.get(0).id + " img", $.proxy(function (e) {
					log("drop on image", e);
				}, this));
				$(document).click($.proxy(function (e) {
					if ($(e.target).closest("#" + this.container.get(0).id + ", #" + this.buttonsContainer.get(0).id).length === 0) {
						$("#" + this.container.get(0).id + " .M_todelete").remove();
						//this.container.prop("contenteditable", false) ;
						this.container.removeClass('isEditing');
					}
				}, this));
				this.container.on('drop', $.proxy(function (e) {
					var files = e.originalEvent.dataTransfer.files;
					if (files.length === 0) return;
	
					e.preventDefault();
					if (!this.container.prop("contenteditable")) {
						M_.Dialog.alert("Information", "Merci de cliquer d'abord l'endroit où vous souhaitez insérer l'image");
						return;
					}
					this.container.prop("contenteditable", true);
					var formData = new FormData();
					formData.append('file0', files[0]);
					var xhr = new XMLHttpRequest();
					xhr.open('POST', '/upload');
					var me = this;
					xhr.onload = function () {
						//console.log(xhr.responseText);
						var jsonResponse = JSON.parse(xhr.responseText);
						document.execCommand("insertImage", false, jsonResponse.tabRes[0]);
						me.caretMove();
					};
					xhr.upload.onprogress = function (e) {
						if (e.lengthComputable) {
							// var complete = (e.loaded / e.total * 100 | 0);
							//updates a <progress> tag to show upload progress
							//$('progress').val(complete);
						}
					};
					xhr.send(formData);
				}, this));
			}
		}]);
	
		return _class48;
	}();
	
	var M_ = exports.M_ = M_;
	
	$.postJSON = function (url, data, callback) {
		return $.ajax({
			'type': 'POST',
			'url': url,
			'contentType': 'application/json',
			'data': JSON.stringify(data),
			'dataType': 'json',
			'success': callback
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	       value: true
	});
	exports.Home = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _M_ = __webpack_require__(1);
	
	var _MT_Jobs = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Home = exports.Home = function (_M_$Controller) {
	       _inherits(Home, _M_$Controller);
	
	       function Home(opts) {
	              _classCallCheck(this, Home);
	
	              console.log("MT_Jobs", _MT_Jobs.MT_Jobs);
	              opts.tpl = JST['assets/templates/backend/Home.html'];
	              return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, opts));
	       }
	
	       _createClass(Home, [{
	              key: 'init',
	              value: function init() {
	                     console.log("init");
	                     // console.log("M_.Utils.isEventSupported('click')",M_.Utils.isEventSupported('click'));
	                     // console.log("M_.Utils.isEventSupported('search')",M_.Utils.isEventSupported('search'));
	              }
	       }, {
	              key: 'create',
	              value: function create() {
	                     console.log("create");
	              }
	       }, {
	              key: 'indexAction',
	              value: function indexAction() {
	                     console.log("indexAction");
	              }
	       }]);
	
	       return Home;
	}(_M_.M_.Controller);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MT_Jobs = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _M_ = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MT_Jobs = exports.MT_Jobs = function (_M_$Model) {
		_inherits(MT_Jobs, _M_$Model);
	
		function MT_Jobs() {
			_classCallCheck(this, MT_Jobs);
	
			return _possibleConstructorReturn(this, (MT_Jobs.__proto__ || Object.getPrototypeOf(MT_Jobs)).apply(this, arguments));
		}
	
		_createClass(MT_Jobs, [{
			key: 'getDefinition',
			value: function getDefinition() {
				return {
					"primaryKey": "jo_id",
					"fields": [{
						"primary": true,
						"type": "int",
						"autoincrement": true,
						"name": "jo_id"
					}, {
						"type": "varchar",
						"name": "jo_name"
					}, {
						"model": "JobsTypes",
						"name": "jt_id"
					}, {
						"type": "datetime",
						"index": true,
						"name": "createdAt"
					}, {
						"type": "datetime",
						"index": true,
						"name": "updatedAt"
					}]
				};
			}
		}]);
	
		return MT_Jobs;
	}(_M_.M_.Model);

/***/ }
/******/ ]);
//# sourceMappingURL=packageBackend-es6.js.map