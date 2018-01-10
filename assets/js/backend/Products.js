"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Shared } from "./../../compiled/Shared.js";
import { MT_Products } from "../../compiled/models/MT_Products.js";
// import { ElementsWinEdit } from "./ElementsWinEdit.js";
// import { StatsWinEdit } from "./StatsWinEdit.js";

export class Products extends M_.Controller {
	constructor(opts) {
		if (!opts) opts = {};
		opts.tpl = JST["assets/templates/backend/Products.html"];
		super(opts);
	}
	init() {}
	create() {
		this.products = new M_.TableList({
			// controller: this,
			container: $("#products_list"),
			store: new M_.Store({
				controller: this,
				model: MT_Products,
				primaryKey: "pr_id",
				url: "/1.0/products",
				limit: 20000,
				// rootData: 'aides',
				listeners: [
					[
						"beforeLoad",
						(store, args) => {
							// args.args.community = this.filterCommunity.getValue() ;
							// args.args.mine = this.filterMine.getValue() ;
							// args.args.deleted = this.filterDeleted.getValue() ;
							// args.args.notvalidated = this.filterNotValidated.getValue() ;
						}
					],
					[
						"update",
						(store, models) => {
							$("#products-h1").html(M_.Utils.plural(store.count(), "produit", "produits"));
						}
					]
				]
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						// console.log("m_id,model", m_id, model);
						if (col == 2) return;
						M_.App.open("Products", "edit", m_id);
					}
				],
				[
					"render",
					(table, models) => {
						table.container.find(".fa-trash").click(evt => {
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer ce produit ?", () => {
								let m_id = $(evt.target).attr("data-prid");
								M_.Utils.deleteJson("/1.0/products/" + m_id, {}, () => {
									M_.App.open("Products", "list");
								});
							});
						});
						table.container.find(".fa-pencil").click(evt => {
							let m_id = $(evt.target).attr("data-prid");
							M_.App.open("Products", "edit", m_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Nom du produit",
					// width: 150,
					val: model => {
						return model.get("pr_name");
					}
				},
				{
					label: "Référence",
					width: 150,
					val: model => {
						return model.get("pr_code");
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					align: "right",
					val: (model, style) => {
						var html = "";
						html += '<i data-prid="' + model.get("pr_id") + '" class="fa fa-pencil faicon"></i>&nbsp;';
						html += '<i data-prid="' + model.get("pr_id") + '" class="fa fa-trash faicon"></i>';
						// if (model.get('ga_deleted')) html += '<i data-gaid="'+model.get('ga_id')+'" class="fa fa-trash-o faicon red"></i>' ;
						return html;
					}
				}
			]
		});

		$("#products_btcreate").click(evt => {
			M_.App.open("Products", "edit", "-1");
		});
	}
	openProductWinEdit(pr_id) {
		if (!this.winProduct) {
			this.winProduct = new class extends M_.Window {
				constructor(controller) {
					super({
						controller: controller,
						tpl: JST["assets/templates/backend/ProductsWinEdit.html"],
						modal: true,
						width: 950,
						numline: 1
					});
				}
				create() {
					super.create();

					this.form = new M_.Form.Form({
						controller: this,
						model: MT_Products,
						// container: this.jEl.find('.campaignswineditmail_form'),
						// containerAlert: this.jEl.find('.campaignswineditmail_alertgroup'),
						url: "/1.0/products",
						listeners: [
							[
								"load",
								(store, model) => {
									this.current = model;
									for (var i = 0; i <= this.numline; i++) {
										this.form.deleteByFakeGroup("oneline_" + i);
									}
									this.numline = 1;
									$("#productswinedit_pr_peoples").empty();

									for (let i = 1; i <= 3; i++) {
										if (this.form.find("pr_media" + i + "_send")) this.form.deleteItem("pr_media" + i + "_send");
										let label = "";
										if (i == 1) label = "Visuel de la manifestation";
										if (i == 2) label = "Logo de la manifestation";
										if (i == 3) label = "PDF CGV";
										this.form.addItem({
											type: M_.Form.File,
											name: "pr_media" + i + "_send",
											label: label,
											labelPosition: "top",
											labelWidth: 70,
											container: $("#productswinedit_pr_media" + i)
										});
										if (this.current.get("pr_media" + i)) {
											if (i == 3) {
												$("#productswinedit_pr_media" + i + "_img")
													.show()
													.css("background-image", "url(/images/iconePdf.png)");
											} else {
												$("#productswinedit_pr_media" + i + "_img")
													.show()
													.css(
														"background-image",
														"url(/1.0/products/" +
															this.current.get("pr_id") +
															"/" +
															i +
															"/file?d=" +
															new Date().getTime() +
															")"
													);
											}
											$("#productswinedit_pr_media" + i + "_del").show();
										} else {
											$("#productswinedit_pr_media" + i + "_img").hide();
											$("#productswinedit_pr_media" + i + "_del").hide();
										}
									}

									this.addNewParticipant();
									this.show();
								}
							],
							[
								"beforeSave",
								(form, args) => {
									this.modalForm = new M_.Modal({
										zindex: M_.Utils.getMaxZIndex() + 10
									});
									this.modalForm.show();
								}
							],
							[
								"save",
								(form, data) => {
									function saveFileTemp(num, cb) {
										if (form.find("pr_media" + num + "_send").jEl.get(0).value) {
											// console.log("form.find('filedata').jEl.get(0).value", form.find("filedata").jEl.get(0).value, form);
											M_.Utils.saveFiles(
												[form.find("pr_media" + num + "_send").jEl.get(0)],
												"/1.0/products/" + data.data.pr_id + "/" + num + "/savefile",
												{},
												data => {
													cb();
												}
											);
										} else cb();
									}
									saveFileTemp(1, () => {
										saveFileTemp(2, () => {
											saveFileTemp(3, () => {
												this.modalForm.hide();
												this.hide();
												M_.App.open("Products", "list");
											});
										});
									});
								}
							],
							[
								"delete",
								(store, model) => {
									this.hide();
									M_.App.open("Products", "list");
								}
							]
						],
						items: [
							{
								type: M_.Form.Hidden,
								controller: this,
								container: $("#productswinedit_pr_name"),
								name: "pr_id"
							},
							{
								type: M_.Form.Text,
								controller: this,
								container: $("#productswinedit_pr_name"),
								allowEmpty: false,
								label: "Nom du produit",
								name: "pr_name",
								maxLength: 34,
								listeners: [["update", (store, args) => {}]]
							},

							// {
							// 	type: M_.Form.Textarea,
							// 	controller: this,
							// 	container: $("#productswinedit_pr_comment"),
							// 	allowEmpty: true,
							// 	label: "Commentaire",
							// 	name: "pr_comment",
							// 	height: 50,
							// 	listeners: [["update", (store, args) => {}]]
							// },

							{
								type: M_.Form.Textarea,
								controller: this,
								container: $("#productswinedit_pr_description"),
								allowEmpty: true,
								label: "Description FR",
								name: "pr_description",
								height: 50,
								listeners: [["update", (store, args) => {}]]
							},

							{
								type: M_.Form.Text,
								controller: this,
								container: $("#productswinedit_pr_code"),
								allowEmpty: true,
								label: "Référence",
								name: "pr_code"
							},
							{
								type: M_.Form.Number,
								controller: this,
								container: $("#productswinedit_pr_quantitybox"),
								allowEmpty: true,
								label: "Quantité par boite",
								name: "pr_quantitybox"
							},
							{
								type: M_.Form.Number,
								controller: this,
								container: $("#productswinedit_pr_refprovider"),
								allowEmpty: true,
								label: "Référence fournisseur",
								name: "pr_refprovider"
							},
							{
								type: M_.Form.Number,
								controller: this,
								container: $("#productswinedit_pr_marge"),
								allowEmpty: true,
								label: "Marge",
								name: "pr_marge"
							},
							{
								type: M_.Form.Number,
								controller: this,
								container: $("#productswinedit_pr_pricebuy"),
								allowEmpty: true,
								label: "Prix d'achat",
								name: "pr_pricebuy"
							},
							{
								type: M_.Form.Number,
								controller: this,
								container: $("#productswinedit_pr_puht"),
								allowEmpty: true,
								label: "Prix HT",
								name: "pr_puht"
							},

							{
								type: M_.Form.Checkbox,
								controller: this,
								container: $("#productswinedit_pr_media1_del"),
								allowEmpty: true,
								label: "Effacer",
								name: "pr_media1_del"
							},
							{
								type: M_.Form.Checkbox,
								controller: this,
								container: $("#productswinedit_pr_media2_del"),
								allowEmpty: true,
								label: "Effacer",
								name: "pr_media2_del"
							},
							{
								type: M_.Form.Checkbox,
								controller: this,
								container: $("#productswinedit_pr_media3_del"),
								allowEmpty: true,
								label: "Effacer",
								name: "pr_media3_del"
							}
						]
					});
					// if (!M_.Shared.canCreateProductCategory(M_.App.Session)) {
					//     $('#aideswinedit_btdelete').prop('disabled',true) ;
					//     $('#aideswinedit_btsave').prop('disabled',true) ;
					// }
					$("#productswinedit_btcancel").click(() => {
						this.hide();
						M_.App.open("Products", "list");
					});
					$("#productswinedit_btdelete").click(() => {
						M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette gamme ?", () => {
							this.form.delete(this.current.get("ga_id"));
						});
					});
					$("#productswinedit_btsave").click(() => {
						this.form.validAndSave();
					});
					$("#productswinedit_newparticipant").click(() => {
						this.addNewParticipant();
					});
				}
				addNewParticipant() {
					this.addParticipant({
						fr: "",
						uk: ""
					});
				}
				addParticipant(participant) {
					let html = `
                    <div class="M_FlexRow" id="participant_line_${this.numline}">
                        <div class="el1"></div>
                        <div class="el2"></div>
                        <div class="el3" style="font-size:18px; max-width:40px; padding-top:0px; cursor:pointer;"><span class="fa fa-trash"></span></div>
                    </div>
                    `;
					$("#productswinedit_pr_peoples").append(html);

					this.form.addItem({
						type: M_.Form.Text,
						name: "fr_" + this.numline,
						fakeGroup: "oneline_" + this.numline,
						value: participant.fr,
						container: $("#participant_line_" + this.numline + " .el1")
					});
					this.form.addItem({
						type: M_.Form.Text,
						name: "uk_" + this.numline,
						fakeGroup: "oneline_" + this.numline,
						value: participant.uk,
						container: $("#participant_line_" + this.numline + " .el2")
					});

					// this.center();
					this.numline++;
				}
			}(this);
		}
		this.winProduct.form.load(pr_id);
		// this.win.show() ;
	}

	listAction() {
		this.products.store.load();
	}
	editAction(pr_id) {
		this.openProductWinEdit(pr_id);
	}
	indexAction() {
		this.listAction();
	}
}
