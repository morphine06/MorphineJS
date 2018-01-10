"use strict";

var BaseController = require("../BaseController");

function rel_to_abs(url) {
	/* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
	if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url)) return url; //Url is already absolute

	// var base_url = location.href.match(/^(.+)\/?(?:#.+)?$/)[0] + "/";
	var base_url = morphineserver.config.serverurl;
	if (url.substring(0, 2) == "//") return "http:" + url;
	else if (url.charAt(0) == "/") return base_url + url;
	else if (url.substring(0, 2) == "./") url = "." + url;
	else if (/^\s*$/.test(url))
		return ""; //Empty = Return nothing
	else url = "../" + url;

	url = base_url + url;
	// var i = 0;
	while (/\/\.\.\//.test((url = url.replace(/[^\/]+\/+\.\.\//g, ""))));

	/* Escape certain characters to prevent XSS */
	url = url
		.replace(/\.$/, "")
		.replace(/\/\./g, "")
		.replace(/"/g, "%22")
		.replace(/'/g, "%27")
		.replace(/</g, "%3C")
		.replace(/>/g, "%3E");
	return url;
}
function replace_all_rel_by_abs(html) {
	/*HTML/XML Attribute may not be prefixed by these characters (common
       attribute chars.  This list is not complete, but will be sufficient
       for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
	var att = "[^-a-z0-9:._]";

	var entityEnd = "(?:;|(?!\\d))";
	var ents = {
		" ": "(?:\\s|&nbsp;?|&#0*32" + entityEnd + "|&#x0*20" + entityEnd + ")",
		"(": "(?:\\(|&#0*40" + entityEnd + "|&#x0*28" + entityEnd + ")",
		")": "(?:\\)|&#0*41" + entityEnd + "|&#x0*29" + entityEnd + ")",
		".": "(?:\\.|&#0*46" + entityEnd + "|&#x0*2e" + entityEnd + ")"
	};
	/* Placeholders to filter obfuscations */
	var charMap = {};
	var s = ents[" "] + "*"; //Short-hand for common use
	var any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
	/* ^ Important: Must be pre- and postfixed by < and >.
     *   This RE should match anything within a tag!  */

	/*
      @name ae
      @description  Converts a given string in a sequence of the original
                      input and the HTML entity
      @param String string  String to convert
      */
	function ae(string) {
		var all_chars_lowercase = string.toLowerCase();
		if (ents[string]) return ents[string];
		var all_chars_uppercase = string.toUpperCase();
		var RE_res = "";
		for (var i = 0; i < string.length; i++) {
			var char_lowercase = all_chars_lowercase.charAt(i);
			if (charMap[char_lowercase]) {
				RE_res += charMap[char_lowercase];
				continue;
			}
			var char_uppercase = all_chars_uppercase.charAt(i);
			var RE_sub = [char_lowercase];
			RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
			RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
			if (char_lowercase != char_uppercase) {
				/* Note: RE ignorecase flag has already been activated */
				RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);
				RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
			}
			RE_sub = "(?:" + RE_sub.join("|") + ")";
			RE_res += charMap[char_lowercase] = RE_sub;
		}
		return (ents[string] = RE_res);
	}

	/*
      @name by
      @description  2nd argument for replace().
      */
	function by(match, group1, group2, group3) {
		/* Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
		return group1 + rel_to_abs(group2) + group3;
	}
	/*
      @name by2
      @description  2nd argument for replace(). Parses relevant HTML entities
      */
	var slashRE = new RegExp(ae("/"), "g");
	var dotRE = new RegExp(ae("."), "g");
	function by2(match, group1, group2, group3) {
		/*Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
		group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
		return group1 + rel_to_abs(group2) + group3;
	}
	/*
      @name cr
      @description            Selects a HTML element and performs a
                                search-and-replace on attributes
      @param String selector  HTML substring to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String marker    Optional RegExp-escaped; marks the prefix
      @param String delimiter Optional RegExp escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                              before an occurence of <end>
     */
	function cr(selector, attribute, marker, delimiter, end) {
		if (typeof selector == "string") selector = new RegExp(selector, "gi");
		attribute = att + attribute;
		marker = typeof marker == "string" ? marker : "\\s*=\\s*";
		delimiter = typeof delimiter == "string" ? delimiter : "";
		end = typeof end == "string" ? "?)(" + end : ")(";
		var re1 = new RegExp("(" + attribute + marker + '")([^"' + delimiter + "]+" + end + ")", "gi");
		var re2 = new RegExp("(" + attribute + marker + "')([^'" + delimiter + "]+" + end + ")", "gi");
		var re3 = new RegExp("(" + attribute + marker + ")([^\"'][^\\s>" + delimiter + "]*" + end + ")", "gi");
		html = html.replace(selector, function(match) {
			return match
				.replace(re1, by)
				.replace(re2, by)
				.replace(re3, by);
		});
	}
	/*
      @name cri
      @description            Selects an attribute of a HTML element, and
                                performs a search-and-replace on certain values
      @param String selector  HTML element to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String front     RegExp-escaped; attribute value, prefix to match
      @param String flags     Optional RegExp flags, default "gi"
      @param String delimiter Optional RegExp-escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                                before an occurence of <end>
     */
	function cri(selector, attribute, front, flags, delimiter, end) {
		if (typeof selector == "string") selector = new RegExp(selector, "gi");
		attribute = att + attribute;
		flags = typeof flags == "string" ? flags : "gi";
		var re1 = new RegExp("(" + attribute + '\\s*=\\s*")([^"]*)', "gi");
		var re2 = new RegExp("(" + attribute + "\\s*=\\s*')([^']+)", "gi");
		var at1 = new RegExp("(" + front + ')([^"]+)(")', flags);
		var at2 = new RegExp("(" + front + ")([^']+)(')", flags);
		if (typeof delimiter == "string") {
			end = typeof end == "string" ? end : "";
			var at3 = new RegExp("(" + front + ")([^\"'][^" + delimiter + "]*" + (end ? "?)(" + end + ")" : ")()"), flags);
			var handleAttr = function(match, g1, g2) {
				return (
					g1 +
					g2
						.replace(at1, by2)
						.replace(at2, by2)
						.replace(at3, by2)
				);
			};
		} else {
			var handleAttr = function(match, g1, g2) {
				return g1 + g2.replace(at1, by2).replace(at2, by2);
			};
		}
		html = html.replace(selector, function(match) {
			return match.replace(re1, handleAttr).replace(re2, handleAttr);
		});
	}

	/* <meta http-equiv=refresh content="  ; url= " > */
	cri(
		"<meta" +
			any +
			att +
			'http-equiv\\s*=\\s*(?:"' +
			ae("refresh") +
			'"' +
			any +
			">|'" +
			ae("refresh") +
			"'" +
			any +
			">|" +
			ae("refresh") +
			"(?:" +
			ae(" ") +
			any +
			">|>))",
		"content",
		ae("url") + s + ae("=") + s,
		"i"
	);

	cr("<" + any + att + "href\\s*=" + any + ">", "href"); /* Linked elements */
	cr("<" + any + att + "src\\s*=" + any + ">", "src"); /* Embedded elements */

	cr("<object" + any + att + "data\\s*=" + any + ">", "data"); /* <object data= > */
	cr("<applet" + any + att + "codebase\\s*=" + any + ">", "codebase"); /* <applet codebase= > */

	/* <param name=movie value= >*/
	cr(
		"<param" +
			any +
			att +
			'name\\s*=\\s*(?:"' +
			ae("movie") +
			'"' +
			any +
			">|'" +
			ae("movie") +
			"'" +
			any +
			">|" +
			ae("movie") +
			"(?:" +
			ae(" ") +
			any +
			">|>))",
		"value"
	);

	cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)"); /* <style> */
	cri("<" + any + att + "style\\s*=" + any + ">", "style", ae("url") + s + ae("(") + s, 0, s + ae(")"), ae(")")); /*< style=" url(...) " > */
	return html;
}

module.exports = class extends BaseController {
	find_1_0(req, res) {
		let where = "ca_deleted=0",
			whereData = [];
		if (req.query.contains || req.query.query) {
			if (req.query.query) req.query.contains = req.query.query;
			where += " && ca_name like ?";
			whereData.push("%" + req.query.contains + "%");
		}
		Campaigns.find(where + " order by ca_name", whereData).exec((errsql, rows) => {
			if (errsql) console.warn("errsql", errsql);
			Services.sendWebservices(res, { err: null, data: rows, meta: { total: rows.length } });
		});
	}
	loadtemplate_1_0(req, res) {
		let fs = require("fs");
		let data = fs.readFileSync(morphineserver.rootDir + "/views/backend/mailinglist_template1.html");
		res.send(data);
	}
	findone_1_0(req, res) {
		//recherche une fiche, possibilité d'utiliser TABLE.populate('field')
		if (req.params.ca_id == "-1" || req.params.ca_id == "-2") {
			let row = Campaigns.createEmpty();
			row.ca_id = "";
			row.ca_type = "mailinglist";
			if (req.params.ca_id == "-2") row.ca_type = "sms";
			row.ca_date = new Date();
			Services.sendWebservices(res, { err: null, data: row });
		} else {
			Campaigns.findOne({ ca_id: req.params.ca_id }).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				if (!row) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
				Services.sendWebservices(res, { err: null, data: row });
			});
		}
	}
	create_1_0(req, res) {
		async.series([], err => {
			if (err) return Services.sendWebservices(res, { err: err });
			req.body.ca_updatedCo = req.user.co_id;
			req.body.ca_createdCo = req.user.co_id;
			Campaigns.create(req.body).exec((errsql, row) => {
				if (errsql) console.warn("errsql", errsql);
				this._sendMail(res, row, req.body.senddefinitive * 1, () => {
					Services.sendWebservices(res, { err: null, data: row });
				});
			}, true);
		});
	}
	update_1_0(req, res) {
		// let row_ca;

		delete req.body.ga_id;
		async.series(
			[
				nextAllow => {
					Campaigns.findOne({ ca_id: req.params.ca_id }).exec((errsql, _row_ca) => {
						if (!_row_ca) return nextAllow(Services.err(404));
						// row_ca = _row_ca;
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				req.body.ca_updatedCo = req.user.co_id;
				Campaigns.update({ ca_id: req.params.ca_id }, req.body).exec((errsql, rows) => {
					if (rows.length === 0) return Services.sendWebservices(res, { err: { code: 404, message: "Not found" }, data: null });
					this._sendMail(res, rows[0], req.body.senddefinitive * 1, () => {
						Services.sendWebservices(res, { err: null, data: rows[0] });
					});
				}, true);
			}
		);
	}
	destroy_1_0(req, res) {
		// let row_ca;
		let deleted = true;
		if (req.route.path.indexOf("undestroy") >= 0) deleted = false;
		async.series(
			[
				nextAllow => {
					Campaigns.findOne({ ca_id: req.params.ca_id }).exec((errsql, _row_ca) => {
						if (!_row_ca) return nextAllow(Services.err(404));
						// row_ca = _row_ca;
						nextAllow();
					});
				}
			],
			err => {
				if (err) return Services.sendWebservices(res, { err: err });
				Campaigns.update({ ca_id: req.params.ca_id }, { ca_deleted: deleted }).exec((errsql, row) => {
					Services.sendWebservices(res, { err: null, success: true });
				});
			}
		);
	}
	_sendMail(res, row_ca, sendDefinitive, cb) {
		async.series(
			[
				nextAllow => {
					// nextAllow();
					if (sendDefinitive) {
						nextAllow();
					} else nextAllow();
				},
				nextAllow => {
					if (!sendDefinitive) {
						// let txt = replace_all_rel_by_abs(row_ca.ca_mail_text);
						//res, to, subject, template, data, options, cb
						EmailSender.send(res, "david@miglior.fr", "pour voir 1", "mails/mailinglist", {}, {}, () => {
							nextAllow();
						});
					} else nextAllow();
				}
			],
			err => {
				cb(err);
			}
		);
	}
};
