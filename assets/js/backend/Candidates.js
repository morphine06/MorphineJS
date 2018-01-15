"use strict";

import { M_ } from "./../../../libs-client/M_.js";
import { Services } from "./Services.js";
import { Shared } from "./../../compiled/Shared.js";
import { MT_Candidates } from "./../../compiled/models/MT_Candidates.js";
import { CandidatesWinEdit } from "./CandidatesWinEdit.js";
import { CandidatesWinDetails } from "./CandidatesWinDetails.js";

// import { M_ } from "js6/libs/M_.js";
// import { Services } from "js6/libs/Services.js";
// import { Shared } from "js6/libs/Shared.js";
// import { MT_Candidates } from "js6/models/Candidates.js";
// import { CandidatesWinEdit } from "js6/controllers/CandidatesWinEdit.js";
// import { CandidatesWinDetails } from "js6/controllers/CandidatesWinDetails.js";

export class Candidates extends M_.Controller {
	constructor(opts) {
		opts.tpl = JST["assets/templates/backend/Candidates.html"];
		super(opts);
	}
	create() {
		$("#candidates_dd td")
			.on("dragover", evt => {
				evt.preventDefault();
			})
			.on("drop", evt => {
				evt.preventDefault();
				var data = evt.originalEvent.dataTransfer.getData("text");
				// console.log("data", data);
				var jEl = $(document.getElementById(data));
				var jElTd = $(evt.target).closest("td");
				jElTd.append(jEl);
				var ca_status = jElTd.attr("id").substring(13);
				M_.Utils.postJson("/1.0/candidates/changestatus", { ca_id: jEl.data("ca_id"), ca_status: ca_status }, data => {
					// console.log("data", data);
					this.storeCandidates.reload();
				});
			});

		$("#candidates_filterreset").click(() => {
			this.filterArchive.setValue(0);
			this.filterPost.setValue("");
			this.filterCompany.setValue("");
			this.filterName.setValue("");
			this.storeCandidates.reload();
		});
		this.storeCandidates = new M_.Store({
			controller: this,
			model: MT_Candidates,
			url: "/1.0/candidates",
			limit: 1000,
			listeners: [
				[
					"beforeLoad",
					(store, args) => {
						args.args.filterarchives = this.filterArchive.getValue();
						args.args.filterpost = this.filterPost.getValue();
						args.args.filtercompany = this.filterCompany.getValue();
						args.args.filtername = this.filterName.getValue();
						// this.showHideButtonResetForm() ;
						var reset = false;
						if (args.args.filterarchives * 1 === 1) reset = true;
						if (args.args.filterpost * 1 !== 0) reset = true;
						if (args.args.filtercompany !== "") reset = true;
						if (args.args.filtername !== "") reset = true;
						if (reset) $("#candidates_filterreset").css("visibility", "visible");
						else $("#candidates_filterreset").css("visibility", "hidden");
					}
				],
				[
					"update",
					(store, models) => {
						this.candidatesModels = models;
						this.drawCandidates();
						$("#candidates_title").html(M_.Utils.plural(models.length, "candidat"));

						var tabSalary = [];
						var tabSalaryProposed = [];
						var tabSocieties = [];
						store.each((model, indexTemp) => {
							if (model.get("ca_salary") * 1 > 0) tabSalary.push(model.get("ca_salary"));
							if (model.get("ca_salaryproposed") * 1 > 0) tabSalaryProposed.push(model.get("ca_salaryproposed"));
							tabSocieties.push(model.get("ca_company"));
						});
						tabSocieties = _.union(tabSocieties).sort();
						var html = "";
						html += "<h3>Salaires moyens chez " + tabSocieties.join(", ") + "</h3>";
						if (tabSalary.length) {
							html += "Salaire moyen : " + M_.Utils.price(_.sum(tabSalary) / tabSalary.length, 0) + "<br>";
							html += "Salaire minimum : " + M_.Utils.price(_.min(tabSalary), 0) + "<br>";
							html += "Salaire maximum : " + M_.Utils.price(_.max(tabSalary), 0) + "<hr>";
						}
						if (tabSalaryProposed.length) {
							html += "Salaire proposé moyen : " + M_.Utils.price(_.sum(tabSalaryProposed) / tabSalaryProposed.length, 0) + "<br>";
							html += "Salaire proposé minimum : " + M_.Utils.price(_.min(tabSalaryProposed), 0) + "<br>";
							html += "Salaire proposé maximum : " + M_.Utils.price(_.max(tabSalaryProposed), 0) + "<br>";
						}
						$("#candidates_averages").html(html);
					}
				]
			]
		});

		$("#candidates_btnew").click(evt => {
			// this.openWinCandidate('-1') ;
			M_.App.open("Candidates", "edit", "-1");
		});

		this.filterArchive = new M_.Form.Slider({
			container: $("#candidates_filterarchive"),
			labelLeft: "En cours",
			labelRight: "Archivés",
			labelWidth: 80,
			listeners: [
				[
					"change",
					(outler, val) => {
						this.storeCandidates.reload();
					}
				]
			]
		});
		this.filterPost = new M_.Form.Combobox({
			name: "ca_post",
			label: "Filtrer par poste",
			labelPosition: "top",
			editable: false,
			allowEmpty: true,
			useZeroIfEmpty: true,
			container: $("#candidates_filterpost"),
			store: new M_.Store({
				controller: this,
				model: M_.ModelKeyVal,
				rows: Services.getTabPost(),
				unshiftRows: [{ key: "", val: "-" }]
			}),
			listeners: [
				[
					"itemclick",
					(outlet, m_id, model) => {
						this.filterArchive.setValue(1);
						this.storeCandidates.reload();
					}
				]
			]
		});
		this.filterCompany = new M_.Form.Combobox({
			name: "ca_company",
			label: "Filtrer par société",
			labelPosition: "top",
			container: $("#candidates_filtercompany"),
			useRawValue: true,
			store: new M_.Store({
				controller: this,
				model: M_.ModelKeyVal,
				url: "/1.0/combo/candidates/ca_company"
			}),
			listeners: [
				[
					"itemclick",
					(outlet, m_id, model) => {
						this.filterArchive.setValue(1);
						this.storeCandidates.reload();
					}
				],
				[
					"keyup",
					(outlet, evt) => {
						this.filterArchive.setValue(1);
						this.storeCandidates.reload();
					}
				]
			]
		});
		this.filterName = new M_.Form.Text({
			name: "ca_name",
			label: "Filtrer par nom",
			labelPosition: "top",
			container: $("#candidates_filtername"),
			useRawValue: true,
			listeners: [
				[
					"keyup",
					(outlet, evt) => {
						this.filterArchive.setValue(1);
						this.storeCandidates.reload();
					}
				]
			]
		});

		// M_.HeaderSection.addScrollDiv($("#part_Candidates"));

		this.candidates = new M_.TableList({
			// controller: this,
			container: $("#candidates_table"),
			// headerHeight: 60,
			// limitRows: 3,
			store: this.storeCandidates,
			listeners: [
				[
					"clickItem",
					(outlet, m_id, model) => {
						M_.App.open("Candidates", "show", m_id);
					}
				],
				[
					"render",
					(store, models) => {
						window.setTimeout(() => {
							//    M_.HeaderSection.scan() ;
							// M_.HeaderSection.addScrollDiv($("#part_Candidates"));
						}, 1000);
					}
				]
			],
			colsDef: [
				{
					label: "Candidat",
					// width: 200,
					val: model => {
						return model.get("ca_name") + " " + model.get("ca_firstname");
					}
				},
				// {
				// 	label: "Pour l'Agence",
				// 	width: 150,
				// 	val: model => {
				// 		return Services.getAgencyForCandidate(model);
				// 	}
				// },
				{
					label: "Société actuelle",
					width: 150,
					val: model => {
						return model.get("ca_company");
					}
				},
				{
					label: "Poste actuel",
					width: 150,
					val: model => {
						return _.result(_.find(Services.getTabPost(), { key: model.get("ca_post") }), "val");
					}
				},
				{
					label: "Poste à pourvoir",
					width: 150,
					val: model => {
						return _.result(_.find(Services.getTabPost(), { key: model.get("ca_posttotake") }), "val");
					}
				},
				{
					label: "€ Actuel",
					width: 100,
					sort: model => {
						return model.get("ca_salary") * 1;
					},
					val: model => {
						return M_.Utils.price(model.get("ca_salary"), 0);
					}
				},
				{
					label: "€ Proposé",
					width: 100,
					val: model => {
						return M_.Utils.price(model.get("ca_salaryproposed"), 0);
					}
					// }, {
					//     label: "Action",
					//     // width: 100,
					//     val: (model)=> {
					//     }
				}
			]
		});

		$("#candidates_btimport").click(() => {
			$.ajax("/1.0/candidates/import", {
				success: data => {}
			});
		});
	}
	// showHideButtonResetForm() {
	//     var filterarchives = this.filterArchive.getValue() ;
	//     var filterpost = this.filterPost.getValue() ;
	//     var filtercompany = this.filterCompany.getValue() ;
	//
	// }
	// getCompetitorAverages() {
	// 	return;
	// 	M_.Utils.getJson("/1.0/candidates/average", {}, data => {
	// 		var html = "";
	// 		_.each(data.rows_ca, row_ca => {
	// 			html += "<b>" + row_ca.ca_company + " | " + _.result(_.find(Services.getTabPost(), { key: row_ca.ca_post }), "val") + "</b> : ";
	// 			html += "Salaire moyen : " + M_.Utils.price(row_ca.salaverage, 0) + " ";
	// 			html += "(minimum : " + M_.Utils.price(row_ca.salmin, 0) + ", ";
	// 			html += "maximum : " + M_.Utils.price(row_ca.salmax, 0) + ")<br>";
	// 		});
	// 		html += "<hr>";
	// 		html += "<h3>Salaire moyen proposé</h3>";
	// 		html += "Salaire moyen : " + M_.Utils.price(data.myaverage.average, 0) + " ";
	// 		html += "(minimum : " + M_.Utils.price(data.myaverage.min, 0) + ", ";
	// 		html += "maximum : " + M_.Utils.price(data.myaverage.max, 0) + ")<br>";
	// 		$("#candidates_averages").html(html);
	// 	});
	// }
	onSaveCandidatesWinEdit() {
		M_.App.open("Candidates");
	}
	onCancelCandidatesWinEdit() {
		M_.App.open("Candidates");
	}
	onDeleteCandidatesWinEdit() {
		M_.App.open("Candidates");
	}
	onCancelCandidatesWinDetails() {
		M_.App.open("Candidates");
	}
	drawCandidates() {
		$(".candidates_dditem").remove();
		var subtasks = Shared.getCandidateSubTasks();
		this.storeCandidates.each(model => {
			// console.log("model.get('ca_status')", model.get('ca_status'));
			var idTemp = M_.Utils.id();
			var ca_status = model.get("ca_status") * 1;
			if (ca_status === 0) ca_status = 1;

			var txt = "";
			txt += "<b>" + model.get("ca_name") + " " + model.get("ca_firstname") + "</b><br>";
			txt += M_.Utils.valInArray(Services.getTabPost(), model.get("ca_posttotake")) + "<br>";
			// txt += model.get('ca_agency')+"<br>" ;
			// txt += Services.getAgencyForCandidate(model) + "<br>";
			var ca_subtasks = model.get("ca_subtasks");
			var doit = 0;
			if (ca_status == 5 && ca_subtasks) {
				_.each(subtasks, (subtask, ind) => {
					if (ca_subtasks["subtask_do_" + subtask.key]) doit++;
				});
				txt += "Sous-tâches : " + doit + "/" + subtasks.length;
			}

			var bgcol = "bg_col1";
			if (ca_status == 1) bgcol = "bg_col5";
			else if (ca_status == 2) bgcol = "bg_col7 txt_colwhite";
			else if (ca_status == 3) bgcol = "bg_col3 txt_colwhite";
			else if (ca_status == 4) bgcol = "bg_col2 txt_colwhite";
			else if (ca_status == 5) bgcol = "bg_col4 txt_colwhite";

			var jEl = $('<div draggable="true" id="' + idTemp + '" class="candidates_dditem ' + bgcol + '">' + txt + "</div>");
			$("#candidates_dd" + ca_status).append(jEl);
			jEl.data("ca_id", model.get("ca_id"));
			jEl
				.on("dragstart", evt => {
					evt.originalEvent.dataTransfer.setData("text", evt.target.id);
				})
				.on("click", evt => {
					jEl = $(evt.target).closest(".candidates_dditem");
					// console.log("jEl.data('ca_id')", jEl.data('ca_id'));
					// this.openWinCandidate(jEl.data('ca_id')) ;
					M_.App.open("Candidates", "show", jEl.data("ca_id"));
				});
		});
	}

	showAction(ca_id) {
		this.storeCandidates.reload();
		CandidatesWinDetails.getInstance(this).loadCandidate(ca_id);
		// this.getCompetitorAverages();
	}
	editAction(ca_id) {
		this.storeCandidates.reload();
		CandidatesWinEdit.getInstance(this).loadCandidate(ca_id);
		// this.getCompetitorAverages();
	}
	indexAction() {
		this.storeCandidates.reload();
		// this.getCompetitorAverages();
	}
}
