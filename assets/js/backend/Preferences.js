"use strict";

import { M_ } from "./../../../libs-client/M_.js";
// import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { ListsWinEdit } from "./ListsWinEdit.js";
import { MT_Lists } from "./../../compiled/models/MT_Lists.js";

export class Preferences extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Preferences.html"];
		super(opts);
	}
	init() {}
	create() {
		this.mainTabs = new M_.Tabs({
			container: $("#preferences_tabs"),
			firstTab: "preferences_home"
		});

		var html = "";
		html += `<table class="offerdetail_table">
				<tr>
					<td>Droits :</td>`;
		_.each(Shared.getRoles(), role => {
			if (role.key === "" || role.key == " ") return;
			html += `<td class='M_AlignCenter'><b>${role.val}</b></td>`;
		});
		html += `</tr>`;
		_.each(Shared.getRights(), right => {
			html += `<tr>
						<td>${right.label}</td>`;
			_.each(Shared.getRoles(), role => {
				if (role.key === "" || role.key == " ") return;
				html += `<td class='M_AlignCenter' id='preferences_rights_${role.key}_${right.key}'></td>`;
			});
			html += `</tr>`;
		});
		html += `</table>`;
		$("#preferences_rightsall").html(html);

		var itemsRights = [];
		_.each(Shared.getRights(), right => {
			_.each(Shared.getRoles(), role => {
				if (role.key === "" || role.key == " ") return;
				itemsRights.push({
					type: M_.Form.Checkbox,
					name: role.key + "_" + right.key,
					value: false,
					container: $("#preferences_rights_" + role.key + "_" + right.key)
				});
			});
		});
		this.formRights = new M_.Form.Form({
			controller: this,
			// model: MT_Events,
			// container: this.jEl.find('.calendarwinedit_form'),
			// containerAlert: this.jEl.find('.calendarwinedit_alertgroup'),
			url: "/1.0/preferences/rights",
			listeners: [
				[
					"save",
					$.proxy(function(store, model) {
						// M_.Dialog.alert("Information", "Les droits ont été sauvegardés.<br/><br/><b>Le programme va redémarrer pour prendre en compte les modifications.</b>", ()=> {
						// window.open('/#/Preferences/rights', '_self') ;
						window.location.reload();
						// }) ;
					}, this)
				],
				[
					"load",
					$.proxy(function(store, model) {
						// console.log("model",model);
					}, this)
				],
				["delete", $.proxy(function(store, model) {}, this)]
			],
			items: itemsRights
		});
		$("#preferences_rights_save").click(() => {
			this.formRights.save();
		});

		this.treeFamilies = new M_.Tree({
			name: "mytree",
			container: $("#preferences_familiestree"),
			listeners: [
				["nodeclick", (store, model) => {}],
				[
					"nodemove",
					(tree, nodeId, nodeIdParent) => {
						M_.Utils.putJson("/1.0/families/" + nodeId, { fa_id_parent: nodeIdParent }, () => {
							this.loadTreeFamilies();
						});
					}
				],
				[
					"nodeadd",
					(tree, node, nodeIdParent) => {
						if (nodeIdParent == "rootnode") nodeIdParent = 0;
						M_.Utils.postJson(
							"/1.0/families",
							{
								fa_name: node.label,
								fa_id_parent: nodeIdParent
							},
							data => {
								this.thenRenameNode = data.data.fa_id;
								this.loadTreeFamilies();
							}
						);
					}
				],
				[
					"noderemove",
					(tree, nodeId) => {
						if (nodeId == "rootnode") return;
						M_.Utils.deleteJson("/1.0/families/" + nodeId, {}, () => {
							this.loadTreeFamilies();
						});
					}
				],
				[
					"noderename",
					(tree, nodeId, label) => {
						// console.log("nodeId, label", nodeId, label);
						if (nodeId == "rootnode") return;
						M_.Utils.putJson("/1.0/families/" + nodeId, { fa_name: label }, () => {
							this.loadTreeFamilies();
						});
					}
				]
			]
		});
		$("#preferences_btaddfamily").click(() => {
			// console.log("this.treeFamilies.getSelected()",this.treeFamilies.getSelected());
			this.treeFamilies.addNode(
				{
					expended: true,
					hidden: false,
					label: "Node X",
					draggable: true,
					droppable: true,
					id: M_.Utils.id()
				},
				this.treeFamilies.getSelected()
			);
		});
		$("#preferences_btrenamefamily").click(() => {
			let sel = this.treeFamilies.getSelected();
			if (sel == "rootnode") return;
			this.treeFamilies.renameNode(sel);
		});
		$("#preferences_btdeletefamily").click(() => {
			let sel = this.treeFamilies.getSelected();
			if (sel == "rootnode") return;
			M_.Dialog.confirm("Information", "Etes-vous certain de vouloir effacer cette famille et toutes les familles enfants ?", () => {
				this.treeFamilies.removeNode(sel);
			});
		});

		this.formImport = new M_.Form.Form({
			controller: this,
			// model: MT_Gammes,
			// container: this.jEl.find('.campaignswineditmail_form'),
			// containerAlert: this.jEl.find('.campaignswineditmail_alertgroup'),
			// url: '/1.0/gammes',
			listeners: [["load", (store, model) => {}], ["save", (store, data) => {}], ["delete", (store, model) => {}]],
			items: []
		});

		$("#preferences_importproducts_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importproduct_send").jEl.get(0)], "/1.0/import/products", {}, data2 => {
				M_.Utils.getJson("/1.0/import/products/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importcommandes_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importcommandes_send").jEl.get(0)], "/1.0/import/commandes", {}, data2 => {
				M_.Utils.getJson("/1.0/import/commandes/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importcommandesencours_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importcommandesencours_send").jEl.get(0)], "/1.0/import/commandesencours", {}, data2 => {
				M_.Utils.getJson("/1.0/import/commandesencours/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importbudgets_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importbudgets_send").jEl.get(0)], "/1.0/import/budgets", {}, data2 => {
				M_.Utils.getJson("/1.0/import/budgets/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importfactures_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importfactures_send").jEl.get(0)], "/1.0/import/factures", {}, data2 => {
				M_.Utils.getJson("/1.0/import/factures/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importcommandesfactures_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importcommandesfactures_send").jEl.get(0)], "/1.0/import/commandesfactures", {}, data2 => {
				M_.Utils.getJson("/1.0/import/commandesfactures/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});
		$("#preferences_importfrais_save").click(() => {
			this.modalForm = new M_.Modal({});
			this.modalForm.show();
			M_.Utils.saveFiles([this.formImport.find("importfrais_send").jEl.get(0)], "/1.0/import/frais", {}, data2 => {
				M_.Utils.getJson("/1.0/import/frais/test", {}, () => {
					this.modalForm.hide();
					M_.Dialog.alert("Information", "Le fichier a été correctement importé.", () => {});
				});
			});
		});

		$("#preferences_btexport").click(() => {
			window.open("/1.0/export/products", "_self");
		});
		$("#preferences_btexportbudget").click(() => {
			window.open("/1.0/budgets/export?year=" + moment().format("YYYY"), "_self");
		});

		this.lists = new M_.TableList({
			// controller: this,
			container: $("#preferences_listsall"),
			store: new M_.Store({
				controller: this,
				model: MT_Lists,
				primaryKey: "op_id",
				url: "/1.0/lists",
				limit: 20000,
				// rootData: 'aides',
				listeners: []
			}),
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model, evt, col, row) => {
						// console.log("col", col);
						// if (col == 4) return;
						M_.App.open("Preferences", "lists", "edit", m_id);
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
							M_.Dialog.confirm("Confirmation effacement", "Etes-vous certain de vouloir supprimer cette liste ?", () => {
								let m_id = $(evt.target).attr("data-opid");
								M_.Utils.deleteJson("/1.0/lists/" + m_id, {}, () => {
									M_.App.open("Preferences", "lists", "list");
								});
							});
						});
						table.container.find(".fa-pencil").click(evt => {
							let m_id = $(evt.target).attr("data-opid");
							M_.App.open("Preferences", "lists", "edit", m_id);
						});
					}
				]
			],
			colsDef: [
				{
					label: "Nom de la liste",
					width: 300,
					val: model => {
						return model.get("li_group");
					}
				},
				{
					label: "Element",
					width: 250,
					val: model => {
						return model.get("li_name");
					}
				},
				{
					label: "Position",
					width: 100,
					val: model => {
						return model.get("li_position");
					}
				},
				{
					label: "Options",
					// width: 100,
					val: model => {
						return M_.Utils.nl2br(model.get("li_options"));
					}
				},
				{
					label: "Actif",
					width: 80,
					val: model => {
						return model.get("li_activate") ? "oui" : "non";
					}
				},
				{
					label: "&nbsp;",
					width: 100,
					val: (model, style) => {
						var html = "";
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-pencil faicon"></i>&nbsp;';
						html += '<i data-opid="' + model.get("op_id") + '" class="fa fa-trash faicon"></i>';
						return html;
					}
				}
			]
		});
		$("#preferences_btnewlistelement").click(evt => {
			ListsWinEdit.getInstance(this).loadList("-1");
		});
	}
	loadTreeFamilies() {
		M_.Utils.getJson("/1.0/families", {}, data => {
			// console.log("data",data);
			this.treeFamilies.setRootNode(data.data);
			if (this.thenRenameNode) {
				this.treeFamilies.setSelected(this.thenRenameNode);
				this.treeFamilies.renameNode(this.thenRenameNode);
				this.thenRenameNode = null;
			}
		});
	}
	initImport() {
		if (this.formImport.find("importproduct_send")) this.formImport.deleteItem("importproduct_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importproduct_send",
			placeholder: "",
			label: "Importer les produits (.xlsx même format que l'export)",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importproduct")
		});
		if (this.formImport.find("importcommandes_send")) this.formImport.deleteItem("importcommandes_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importcommandes_send",
			placeholder: "",
			label: "1/ Importer les commandes",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importcommandes")
		});
		if (this.formImport.find("importcommandesencours_send")) this.formImport.deleteItem("importcommandesencours_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importcommandesencours_send",
			placeholder: "",
			label: "Importer les commandes en cours",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importcommandesencours")
		});
		if (this.formImport.find("importbudgets_send")) this.formImport.deleteItem("importbudgets_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importbudgets_send",
			placeholder: "",
			label: "Importer les budgets",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importbudgets")
		});
		if (this.formImport.find("importfactures_send")) this.formImport.deleteItem("importfactures_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importfactures_send",
			placeholder: "",
			label: "3/ Importer les factures",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importfactures")
		});
		if (this.formImport.find("importcommandesfactures_send")) this.formImport.deleteItem("importcommandesfactures_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importcommandesfactures_send",
			placeholder: "",
			label: "2/ Importer les liaisons commandes/factures",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importcommandesfactures")
		});
		if (this.formImport.find("importfrais_send")) this.formImport.deleteItem("importfrais_send");
		this.formImport.addItem({
			type: M_.Form.File,
			name: "importfrais_send",
			placeholder: "",
			label: "Importer les frais",
			labelPosition: "top",
			// labelWidth: 70,
			container: $("#preferences_importfrais")
		});
	}
	importAction() {
		this.mainTabs.show("preferences_import", next => {
			$("#preferences_title").html("Importer");
			$("#preferences_btreturn").show();
			this.initImport();
			next();
		});
	}
	familiesAction() {
		this.mainTabs.show("preferences_families", next => {
			$("#preferences_title").html("Les familles");
			$("#preferences_btreturn").show();
			this.loadTreeFamilies();
			next();
		});
	}
	rightsAction() {
		this.mainTabs.show("preferences_rights", next => {
			$("#preferences_title").html("Les droits");
			$("#preferences_btreturn").show();
			this.formRights.load(1);
			next();
		});
	}

	onSaveListsWinEdit() {
		M_.App.open("Preferences", "lists", "list");
	}
	onDeleteListsWinEdit() {
		M_.App.open("Preferences", "lists", "list");
	}
	onCancelListsWinEdit() {
		M_.App.open("Preferences", "lists", "list");
	}

	listsAction(action, li_id) {
		this.mainTabs.show("preferences_lists", next => {
			$("#preferences_title").html("Les listes");
			$("#preferences_btreturn").show();
			this.lists.store.load();
			next();
		});
		// console.log("action,li_id", action, li_id);
		if (action == "list") {
			this.lists.store.load();
		}
		if (action == "edit") {
			ListsWinEdit.getInstance(this).loadList(li_id);
		}
	}
	indexAction() {
		this.mainTabs.show("preferences_home", next => {
			$("#preferences_title").html("Toutes les préférences");
			$("#preferences_btreturn").hide();
			next();
		});
	}
}
