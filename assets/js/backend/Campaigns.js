"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Campaigns } from "./../../compiled/models/MT_Campaigns.js";

export class Campaigns extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Campaigns.html"];
		super(opts);
	}
	init() {}
	create() {
		this.campaigns = new M_.TableList({
			// controller: this,
			container: $("#campaigns_list"),
			store: new M_.Store({
				controller: this,
				model: MT_Campaigns,
				primaryKey: "ca_id",
				url: "/1.0/campaigns",
				limit: 20000,
				// rootData: 'aides',
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							// args.args.community = this.filterCommunity.getValue() ;
						}
					],
					[
						"update",
						(store, models) => {
							// $("#gammes-gammes-h1").html("Les " + store.count() + " gammes");
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						if (col == 3) return;
						M_.App.open("Campaigns", "edit", "mailinglist", m_id);
					}
				],
				[
					"render",
					(table, models) => {
						// table.container.find('.fa-exclamation-triangle').each((ind, el)=> {
						//     new M_.Help({
						//         text: "Ne sera pas affiché pour la communauté Link4Life",
						//         attachedObj: $(el)
						//     }) ;
						// }) ;
						table.container.find(".fa-trash").click(evt => {
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette campagne ?", () => {
								let m_id = $(evt.target).attr("data-caid");
								M_.Utils.deleteJson("/1.0/campaigns/" + m_id, {}, () => {
									M_.App.open("Campaigns", "list");
								});
							});
						});
						table.container.find(".fa-pencil").click(evt => {
							let m_id = $(evt.target).attr("data-caid");
							M_.App.open("Campaigns", "edit", "mailinglist", m_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Type",
					width: 100,
					val: model => {
						return Shared.getCampaignType(model.get("ca_type")).val;
					}
				},
				{
					label: "Nom de la campagne",
					// width: 150,
					val: model => {
						return model.get("ca_name");
					}
				},
				{
					label: "Nb envoyés",
					width: 350,
					val: model => {
						return 0;
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					val: (model, style) => {
						var html = "";
						html += '<i data-caid="' + model.get("ca_id") + '" class="fa fa-pencil faicon"></i>&nbsp;';
						html += '<i data-caid="' + model.get("ca_id") + '" class="fa fa-trash faicon"></i>';
						return html;
					}
				}
			]
		});

		$("#campaigns_btcreate").click(evt => {
			// M_.App.open("Campaigns", "edit", "-1");
			evt.stopPropagation();
			var dd = new M_.Dropdown({
				autoShow: true,
				alignTo: $("#campaigns_btcreate"),
				items: [
					{
						text: "Nouvelle campagne Mailinglist",
						click: () => {
							M_.App.open("Campaigns", "edit", "mailinglist", "-1");
						}
					},
					{
						text: "Nouvelle campagne SMS",
						click: () => {
							M_.App.open("Campaigns", "edit", "sms", "-1");
						}
					}
				]
			});
			dd.show();
		});
	}
	openWinMailinglist(ca_id) {
		// console.log("openWinMailinglist");
		if (!this.winMailinglist) {
			this.winMailinglist = new class extends M_.Window {
				constructor(opts) {
					var defaults = {
						tpl: JST["assets/templates/backend/MailinglistWinEdit.html"],
						// tplData: {},
						modal: true,
						// controller: this,
						width: 900
					};
					opts = opts ? opts : {};
					var optsTemp = $.extend({}, defaults, opts);
					super(optsTemp);
					// log("this.jEl",this.jEl)
				}
				create() {
					super.create();

					this.form = new M_.Form.Form({
						url: "/1.0/campaigns",
						// urls: {
						// 	findone: 'GET /1.0/contacts/findone',
						// 	create: 'POST /1.0/contacts/create',
						// 	update: 'PUT /1.0/contacts/update',
						// 	destroy: 'DELETE /1.0/contacts/destroy',
						// },
						model: MT_Campaigns,
						controller: this,
						processData: function(data) {},
						listeners: [
							[
								"load",
								(form, model) => {
									this.currentModel = model;
								}
							],
							[
								"save",
								(form, data) => {
									this.hide();
									this.controller.campaigns.store.load();
								}
							],
							[
								"delete",
								(form, model) => {
									this.hide();
									this.controller.campaigns.store.load();
									// if (this.controller.onDeleteMailinglistWinEdit) this.controller.onDeleteMailinglistWinEdit();
								}
							]
						],

						itemsDefaults: {
							type: M_.Form.Text,
							hideIfEmpty: true,
							labelPosition: "left",
							labelWidth: 100
						},
						items: [
							{
								type: M_.Form.Hidden,
								name: "ca_id",
								container: $("#mailinglistwinedit_ca_name")
							},
							{
								type: M_.Form.Hidden,
								name: "senddefinitive",
								container: $("#mailinglistwinedit_ca_name")
							},
							{
								name: "ca_name",
								placeholder: "",
								label: "Nom de la campagne",
								labelPosition: "top",
								container: $("#mailinglistwinedit_ca_name"),
								allowEmpty: false
							},
							{
								type: M_.Form.TextEditor,
								name: "ca_mail_text",
								placeholder: "",
								label: "Texte du mail",
								labelPosition: "top",
								container: $("#mailinglistwinedit_ca_mail_text"),
								allowEmpty: true,
								optionsEditor: {
									clickTemplate: evt => {
										$.get("/1.0/campaigns/template", data => {
											// console.log("data", data);
											this.form.find("ca_mail_text").setValue(data);
										});
									}
								}
							},
							{
								name: "ca_mail_test",
								placeholder: "",
								label: "Email de test",
								labelPosition: "top",
								container: $("#mailinglistwinedit_ca_mail_test"),
								allowEmpty: true
							}
						]
					});

					$("#mailinglistwinedit_bt_delete").click(() => {});
					$("#mailinglistwinedit_bt_save").click(() => {
						this.form.find("senddefinitive").setValue(0);
						this.form.validAndSave();
					});
					$("#mailinglistwinedit_bt_save2").click(() => {
						this.form.find("senddefinitive").setValue(1);
						this.form.validAndSave();
					});
					$("#mailinglistwinedit_bt_cancel").click(() => {
						this.hide();
					});
				}
				initWin(ca_id) {
					// this.comboGroup.reset() ;
					$("#mailinglistwinedit_ca_mail_text .M_FormEditor-Content").height($(window).height() - 400);
					this.form.load(ca_id);
					this.show();
					this.center();
				}
			}({
				controller: this
			});
		}
		this.winMailinglist.initWin(ca_id);
	}
	listAction(action, ca_id) {
		this.campaigns.store.load();
	}
	editAction(ca_type, ca_id) {
		this.campaigns.store.load();
		if (ca_type == "mailinglist") {
			this.openWinMailinglist(ca_id);
		}
	}
	indexAction() {
		this.campaigns.store.load();
	}
}
