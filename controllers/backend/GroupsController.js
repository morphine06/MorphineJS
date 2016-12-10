"use strict";


var BaseController = require('../BaseController') ;

module.exports = class extends BaseController {
    find(req, res) {
        Groups.find('1=1').exec((errsql, rows)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:rows}) ;
        }) ;
    }
    findOne(req, res) {
        Groups.findOne(req.params.id).exec((errsql, row)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:row}) ;
        }) ;
    }
    create(req, res) {
        Groups.create({gr_name:req.body.gr_name}).exec((errsql, row)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:row}) ;
        }) ;
    }
    update(req, res) {
        Groups.update(req.params.gr_id*1, {gr_name:req.body.gr_name}).exec((errsql, row)=> {
            if (errsql) console.log("errsql",errsql);
            this.send(res, {data:row}) ;
        }) ;
    }
    emptygroup(req, res) {
		ContactsGroups.destroy({
			gr_id: req.params.gr_id
		}, (err, rows)=> {
			this.send(res, {success: true});
		});
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
			this.send(res, {success: true});
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
			this.send(res, {success: true});
		});
	}
} ;