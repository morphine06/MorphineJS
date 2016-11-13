"use strict";


var BaseController = require('../BaseController') ;

function filterContacts(req, cb) {
	var whereQ1 = "";
	var whereQ2 = [];
	var tabFieldsOr = ['co_name', 'co_firstname', 'co_function',
	'co_society', 'co_siret', 'co_codetiers', 'co_comptecollectif', 'co_comptecomptable',
	'co_matricule', 'co_keywords', 'co_login', 'co_address1',
	'co_address2', 'co_address3', 'co_zip', 'co_city', 'co_country',
	'co_comment', 'co_email1', 'co_email2', 'co_email3', 'co_tel1',
	'co_tel2', 'co_tel3', 'co_fax1', 'co_fax2', 'co_fax3', 'co_mobile1',
	'co_mobile2', 'co_mobile3', 'co_web1', 'co_web2', 'co_web3'];
	if(req.query.query && req.query.query !== '') {
		whereQ1 += " && (";
		_.each(tabFieldsOr, (field)=> {
			whereQ1 += field + " like ? || ";
			whereQ2.push("%" + req.query.query + "%");
		});
		whereQ1 += " 0)";
	}
	_.each(tabFieldsOr, (field)=> {
		if(req.query[field] && req.query[field] !== '') {
			if(field == 'co_address1' || field == 'co_email1' || field == 'co_tel1' || field == 'co_fax1' || field == 'co_mobile1' || field == 'co_web1') {
				if(field == 'co_address1') whereQ1 += " && (co_address1 like ? || co_address2 like ? || co_address3 like ?)";
				if(field == 'co_email1') whereQ1 += " && (co_email1 like ? || co_email2 like ? || co_email3 like ?)";
				if(field == 'co_tel1') whereQ1 += " && (co_tel1 like ? || co_tel2 like ? || co_tel3 like ?)";
				if(field == 'co_fax1') whereQ1 += " && (co_fax1 like ? || co_fax2 like ? || co_fax3 like ?)";
				if(field == 'co_mobile1') whereQ1 += " && (co_mobile1 like ? || co_mobile2 like ? || co_mobile3 like ?)";
				if(field == 'co_web1') whereQ1 += " && (co_web1 like ? || co_web2 like ? || co_web3 like ?)";
				whereQ2.push("%" + req.query[field] + "%", "%" + req.query[field] + "%", "%" + req.query[field] + "%");
			} else {
				whereQ1 += " && " + field + " like ?";
				whereQ2.push("%" + req.query[field] + "%");
			}
		}
	});

	if (req.query.onlyusers && req.query.onlyusers=='true') {
		whereQ1 += " && co_type!='contact' && co_type!='customer'";
	}
	if (req.query.onlycustomers && req.query.onlycustomers=='true') {
		whereQ1 += " && co_type='customer'";
	}
	if (req.query.gr_id=='-2') {
		whereQ1 += " && co_type!='contact' && co_type!='customer'";
	}
	if (req.query.gr_id=='-4') {
		whereQ1 += " && co_type='contact'";
	}
	if (req.query.gr_id=='-5') {
		whereQ1 += " && co_type='customer'";
	}
	if(req.query.co_type && req.query.co_type !== '') {
		whereQ1 += " && co_type=?";
		whereQ2.push(req.query.co_type);
	}
	if (req.query.onlymine && req.query.onlymine=='true') {
		whereQ1 += " && t1.co_id=?";
		whereQ2.push(req.user.co_id);
	}
	if(req.query.gr_id == 'lastimport') {
		whereQ1 += " && co_import=?";
		whereQ2.push(1);
	}
	if (req.query.ag_id) {
		whereQ1 += " && t2.ag_id=?";
		whereQ2.push(req.query.ag_id) ;
	}
	if (req.query.gr_id=='-6') {
		whereQ1 += " && deleted=1";
	} else {
		whereQ1 += " && deleted=0";
	}

	var rows = [] ;
	var whereMore = "" ;
	var whereMore2 = "" ;
	var okDRH = false ;
    if (!req.user.co_rights) req.user.co_rights = {} ;
	async.series([
		(next)=> {
			if (!req.user.co_rights.contacts_seecontacts) {
				whereMore2 += " && co_type!='contact'";
			}
			next() ;
		},
		(next)=> {
			if (!req.user.co_rights.contacts_seeallusers) {
				whereMore += "(co_type!='user' && co_type!='secretary' && co_type!='commercial' && co_type!='accountant' && co_type!='director' && co_type!='customer' && co_type!='admin') && ";
			}
			next() ;
		},
		(next)=> {
			var query = "";
			if(req.query.gr_id &&
				req.query.gr_id != '-1' &&
				req.query.gr_id != '-2' &&
				req.query.gr_id != '-3' &&
				req.query.gr_id != '-4' &&
				req.query.gr_id != '-5' &&
				req.query.gr_id != '-6' &&
				req.query.gr_id != 'lastimport' &&
				req.query.gr_id != 'allagencies') {
				whereQ1 += " && t1.gr_id=?";
				whereQ2.push(req.query.gr_id);
				query = "select * from cogr_contactsgroups t1 left join co_contacts t2 on t1.co_id=t2.co_id left join gr_groups t3 on t1.gr_id=t3.gr_id where 1 " + whereQ1 + " && NULLIF(t2.deleted, 0) IS NULL order by co_name";
			} else if (req.query.doublon && okDRH) {
				query = "SELECT c1.co_id, c1.co_name, c1.co_firstname, CONCAT(c1.co_name,c1.co_firstname) as c1concat FROM co_contacts c1 INNER JOIN (SELECT co_id, co_name, co_firstname, CONCAT(c2.co_name,c2.co_firstname) as c2concat FROM co_contacts c2 GROUP BY c2concat HAVING count(c2.co_id) > 1) dup on c1.co_name = dup.co_name where c1.deleted=0" ;

			} else {
				query = "select t1.* from co_contacts t1 where 1 " + whereQ1 + " group by t1.co_id order by co_name, co_firstname, co_society";
			}
			Contacts.query(query, whereQ2).exec((err, _rows)=> {
				if(err) console.log(err);
				rows = _rows ;
                // console.log("query,whereQ2",query,whereQ2,rows);
				next() ;
			});
		}
	], ()=> {
		cb(rows) ;
	}) ;
}
function analyseImport(filename, tabfields) {
	var fs = require('fs'),
		path = require('path'),
		fn = path.basename(filename),
		root = sails.config.appPath,
		uploadPathDir = root + path.sep + "uploads" + path.sep;
	var XLSX = require('xlsx-style');
	var workbook = XLSX.readFile(uploadPathDir + "import_" + fn);
	var first_sheet_name = workbook.SheetNames[0];
	var worksheet = workbook.Sheets[first_sheet_name];
	var range = XLSX.utils.decode_range(worksheet['!ref']);
	var nbCols = range.e.c;
	var nbRows = range.e.r;
	var all = [];
	if(!tabfields) {
		for(var i = 0; i <= nbCols; i++) {
			var col = XLSX.utils.encode_col(i);
			if(worksheet[col + "1"]) all.push(col + "1" + " : " + worksheet[col + "1"].v);
		}
	} else {
		for(var j = 0; j <= nbRows; j++) {
			var row = XLSX.utils.encode_row(j);
			var data = {};
			for(var i2 = 0; i2 <= nbCols; i2++) {
				var col2 = XLSX.utils.encode_col(i2);
				if(tabfields[i2] && worksheet[col2 + row]) {
					if(tabfields[i2] == 'dontimport') continue;
					else data[tabfields[i2]] = worksheet[col2 + row].v;
				}
			}
			if(!data.co_type) data.co_type = 1;
			data.co_import = 1;
			all.push(data);
		}
	}
	return all;
}
function savePhoto(req, co_id, next) {
	req.file('co_avatar_send').upload({
		maxBytes: 10000000
	}, (err, uploadedFiles)=> {
		if(err || req.file('co_avatar_send').isNoop || uploadedFiles.length === 0) {
			return next(err);
		}
		var fs = require('fs'),
			path = require('path'),
			fn = path.basename(uploadedFiles[0].fd),
			root = sails.config.appPath,
			uploadPathDir = root + path.sep + "uploads" + path.sep,
			gm = require('gm');
		if(!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
		fs.renameSync(uploadedFiles[0].fd, uploadPathDir + "orig_" + fn);
		Contacts
			.update({
				co_id: co_id
			}, {
				co_avatar: fn,
				co_avatarauto: ""
			})
			.exec( (err)=> {
				if(err) return next(err);
				return next();
			});
	});
}

module.exports = class extends BaseController {
    findOne(req, res) {
        if(req.params.co_id == -1 || req.params.co_id == -2) {
			var row_co = Contacts.createEmpty();
			row_co.co_id = '';
			row_co.co_type = 'contact';
			if (req.params.id == -2) row_co.co_type = 'customer';
			row_co.co_rights = {} ;
			row_co.contracts = [] ;
			row_co.co_birthday = '' ;
			res.send({data: row_co});
		} else {
			Contacts
			.findOne({
				co_id: req.params.co_id
			})
			.populate('ag_id')
			.populate('updatedCo')
			.populate('createdCo')
			.exec( (errsql, row_co)=> {
				if(errsql) console.log("errsql",errsql) ;
				if(!row_co) row_co = {
					co_id: ''
				};
				row_co.co_password = "";
				row_co.contracts = [] ;
				async.parallel([
					(next)=> {
                        next() ;
						// row_co.todos = [] ;
						// if (row_co.co_type!='contact' && row_co.co_type!='candidate') {
						// 	Services.getTodos(row_co, (rows_td)=> {
						// 		row_co.todos = rows_td ;
						// 		next() ;
						// 	}) ;
						// } else {
						// 	next() ;
						// }
					},
				], (err, results)=> {
					res.send({
						data: row_co
					});
				});
			});
		}
    }
    find(req, res) {
		filterContacts(req, (rows_co)=> {
			res.send({data:rows_co}) ;
		}) ;
	}
	export(req, res) {
		filterContacts(req, (rows_co)=> {
			var sep = "\n" ;
			var content = "" ;
			_.each(rows_co, (row_co)=> {
				content += Shared.completeName(row_co) ;
				content += sep ;
			}) ;
			var filename = "export-contacts_"+moment().format('YYYY-MM-DD')+".txt" ;
			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.cookie('filedownload', "true", {path: '/'}) ;
			res.setHeader('Content-type', 'text/text');
			res.setHeader('Content-Length', content.length);

			res.send(content) ;
		}) ;
	}
	savestatus(req, res) {
		Contacts.update({
			co_id: req.body.co_id
		}, {
			co_status: req.body.co_status
		}, (err, row_co)=> {
			res.send({
				data: row_co
			});
		});
	}
	_updateOrCreate(req, next) {
		var row_co = null ;
		var row_co_old = null ;
		if (req.body.co_avatarauto) req.body.co_avatar = "" ;
		async.series([

			(nextSerie)=> {
				Contacts.replace({
					co_id: req.body.co_id
				}, [], req.body, (err, _row_co, _row_co_old)=> {
					if(err) return next(err, _row_co);
					row_co = _row_co ;
					row_co_old = _row_co_old ;
					nextSerie() ;
				}, true) ;
			},




			(nextSerie)=> {
				if (req.body.shortSave) return nextSerie() ;

				var rights = [];
				var rights2 = {} ;
				_.each(req.body, (bodyval, bodykey)=> {
					if(bodykey.substr(0, 6) == "right_") {
						var right = bodykey.substr(6);
						rights.push([right, bodyval]);
						rights2[right] = bodyval ;
					}
				});
				if (row_co.co_type=='contact' || row_co.co_type=='customer') rights2 = {} ;
				Contacts.update({co_id: row_co.co_id}, {co_optionsrights:rights2}).exec((errsql)=> {
					if(errsql) console.log("errsql",errsql) ;
					nextSerie();
				}) ;

			},
		], (err)=> {
			// Contacts.
			next(null, row_co);
		}) ;

	}
	create(req, res) {
		req.body.createdCo = req.user.co_id;
		req.body.updatedCo = req.user.co_id;
		this._updateOrCreate(req, (err, row_co)=> {
			if(err) return res.send(err);
			res.send({data:row_co});
		});
	}
	update(req, res) {
		req.body.updatedCo = req.user.co_id;
		this._updateOrCreate(req, (err, row_co)=> {
			if(err) return res.send(err);
			res.send({data:row_co});
		});
	}
	updateavatar(req, res) {
		savePhoto(req, req.body.co_id, ()=> {
			Contacts.findOne(req.body.co_id).exec((errsql, row_co)=> {
				if (errsql) console.log("errsql",errsql);
				res.send({data:row_co});
			}) ;
		});
	}
	undestroy(req, res) {
		Contacts.update({co_id:req.params.co_id}, {deleted:false}).exec((errsql)=> {
			if(errsql) console.log("errsql",errsql) ;
			res.ok({success: true});
		}) ;
	}
	destroy(req, res) {
		Contacts.update({co_id:req.params.id}, {deleted:true}).exec((errsql)=> {
			if(errsql) console.log("errsql",errsql) ;
			res.ok({success: true});
		}) ;
	}
	addcontactstogroup(req, res) {
		async.eachSeries(req.body.contacts, (co_id, next)=> {
			ContactsGroups.replace({
				gr_id: req.body.gr_id,
				co_id: co_id
			}, [], {
				gr_id: req.body.gr_id,
				co_id: co_id
			}, ()=> {
				next();
			});
		}, ()=> {
			res.ok({
				success: true
			});
		});
	}
	removecontactstogroup(req, res) {
		async.eachSeries(req.body.contacts, (co_id, next)=> {
			ContactsGroups.destroy({
				gr_id: req.body.gr_id,
				co_id: co_id
			}, ()=> {
				next();
			});
		}, ()=> {
			res.ok({
				success: true
			});
		});
	}
	emptygroup(req, res) {
		ContactsGroups.destroy({
			gr_id: req.params.gr_id
		}, (err, rows)=> {
			res.ok({
				success: true
			});
		});
	}
	import1(req, res) {
		req.file('fileimport').upload({
			maxBytes: 10000000
		}, (err, uploadedFiles)=> {
			if(err || req.file('fileimport').isNoop || uploadedFiles.length === 0) {
				console.log("errimport", err);
				return res.ok({
					success: false
				});
			}
			var fs = require('fs'),
				path = require('path'),
				fn = path.basename(uploadedFiles[0].fd),
				root = sails.config.appPath,
				uploadPathDir = root + path.sep + "uploads" + path.sep;
			if(!fs.existsSync(uploadPathDir)) fs.mkdirSync(uploadPathDir);
			fs.renameSync(uploadedFiles[0].fd, uploadPathDir + "import_" + fn);
			var all = analyseImport(fn, null);
			res.ok({
				data: all,
				filename: fn
			});
		});
	}
	import2(req, res) {
		var all = analyseImport(req.body.filename, req.body.tabfields);
		res.ok({
			data: all,
			filename: req.body.filename
		});
	}
	import3(req, res) {
		var all = analyseImport(req.body.filename, req.body.tabfields);
		async.eachSeries(all, (data, next)=> {
			Contacts.create(data, (err, row_co)=> {
				if(err) return console.log("errpetite", err);
				next(err);
			});
		}, (err)=> {
			if (err) console.log("errgeneral", err);
			res.ok({
				data: all
			});
		});
	}
    avatar(req, res) {
        // return res.send("OK");

        // res.header('Cache-Control', 'public, max-age='+sails.config.http.cache);

        var fs = require('fs'),
            path = require('path'),
            // root = morphineserver.rootDir,
            // uploadPathDir = root+path.sep+"uploads",
            gm = require('gm') ;



        Contacts.findOne({co_id:req.params.id}).exec(function (err, row_co){
            if (err) row_co.co_avatar = null ;
            if (!row_co) row_co = {co_avatar:null} ;

            req.params.w = req.params.w*1 ;
            req.params.h = req.params.h*1 ;

            var src = morphineserver.rootDir+"/assets/images/ill_monster1.png" ;
            var dest = morphineserver.rootDir+"/uploads/"+req.params.w+"-"+req.params.h+"_default" ;
            var hasAvatarImg = false ;
            if (row_co.co_avatar) {
                src = morphineserver.rootDir+"uploads/orig_"+user.co_id ;
                dest = morphineserver.rootDir+"uploads/"+req.params.w+"-"+req.params.h+"_"+user.co_id ;
                // pictureOk = uploadPathDir+path.sep+req.params.w+"-"+req.params.h+"_"+user.co_avatar ;
                // fn = user.co_avatar ;
                // fnprefix = "orig_" ;
                // hasAvatarImg = true ;
                // if (!fs.existsSync(path.dirname(pictureOk)+path.sep+fnprefix+fn)) hasAvatarImg = false ;
            }
            // if (!hasAvatarImg) {
            //     pictureOk = root+"/assets/images/"+req.params.w+"-"+req.params.h+"_default.png" ;
            //     fn = "ill_monster1.png" ;
            //     fnprefix = "" ;
            // }
            // if (user.co_avatarauto) {
            //     pictureOk = root+"/assets/images/"+req.params.w+"-"+req.params.h+"_"+user.co_avatarauto ;
            //     fn = user.co_avatarauto ;
            //     fnprefix = "" ;
            // }
            async.series([
                function(next) {
                    if (!fs.existsSync(dest)) {
                        gm(src)
                        .gravity('Center')
                        .resize(req.params.w, req.params.h, "^")
                        .crop(req.params.w, req.params.h)
                        .noProfile()
                        .write(dest, function (err) {
                            if (err) console.log("err",err) ;
                            next() ;
                        }) ;

                    } else next() ;
                },
                function(next) {
                    var stat = fs.statSync(dest);
                    // console.log("If-Modified-Since", req.get('If-Modified-Since'));
                    res.writeHead(200, {
                        'Cache-Control': 'max-age='+(3600*24*360),
                        'Last-Modified': new Date(),
                        'Content-Type': 'image/jpeg',
                        'Content-Length': stat.size
                    });
                    var readStream = fs.createReadStream(dest);
                    readStream.pipe(res);

                    // var SkipperDisk = require('skipper-disk');
                    // var fileAdapter = SkipperDisk();
                    // fileAdapter.read(pictureOk)
                    // .on('error', function (err){
                    //     return res.serverError(err);
                    // })
                    // .pipe(res);
                    next() ;
                }
            ]) ;


        });

    }
} ;

