"use strict";

var _ = require('lodash');
var async = require('async');

var fs = require('fs') ;
var mysql = require('mysql2') ;

var request = require('request') ;

class M_TableExec {
    constructor(table) {
        this.table = table ;
        this.def = table.def ;
        this.modelname = this.def.modelname ;
        this.select = [] ;
        this.command = 'SELECT' ;
        this.connection = table.connection ;
        this.primary = 'id' ;
        this.primaryType = 'integer' ;
        this.primaryLength = 11 ;
        this.where = '' ;
        this.whereData = [] ;
        this.onlyOne = false ;
        this.order = '' ;
        this.having = '' ;
        this.groupby = '' ;
        this.tabAlreadyIncluded = {} ;
        this.iscount = false ;
        this.joinModels = [{modelname:this.modelname, fieldJoin:null, modelnameto:null, modelalias:'t1'}] ;
        _.each(this.def.attributes, (field, fieldName)=> {
            if (field.primary) {
                this.primary = fieldName ;
                this.primaryType = field.type ;
                this.primaryLength = field.length ;
            }
        }) ;

    }
    select(fields) {
        this.select = fields ;
        return this ;
    }
    find(where, whereData) {
        this.command = 'SELECT' ;
        this.onlyOne = false ;
        this.where = where ;
        if (whereData === undefined) this.whereData = [] ;
        else this.whereData = whereData ;
        return this ;
    }
    count(where, whereData) {
        this.iscount = true ;
        return this.find(where, whereData) ;
    }
    findOne(where, whereData) {
        this.onlyOne = true ;
        this.where = where ;
        if (whereData === undefined) this.whereData = [] ;
        else this.whereData = whereData ;
        return this ;
    }
    create(data) {
        this.onlyOne = false ;
        this.command = 'INSERT' ;
        this.data = data ;
        return this ;
    }
    update(where, whereData, data) {
        if (data === undefined) {
            data = whereData ;
            this.whereData = [] ;
        } else {
            this.whereData = whereData ;
        }
        this.original_where = _.cloneDeep(where) ;
        this.original_whereData = _.cloneDeep(this.whereData) ;

        this.onlyOne = false ;
        this.command = 'UPDATE' ;
        this.where = where ;
        this.data = data ;
        return this ;
    }
    query(query, data) {
        this.command = 'QUERY' ;
        this.whereData = data ;
        this.querySaved = query ;
        return this ;
    }
    destroy(where, whereData) {
        if (whereData === undefined) {
            this.whereData = [] ;
        } else {
            this.whereData = whereData ;
        }
        this.onlyOne = false ;
        this.command = 'DELETE' ;
        this.where = where ;
        return this ;
    }
    _searchModelNameFromFieldName(fieldJoin, fromModelName) {
        var f = null ;
        _.each(M_Db.models[fromModelName].def.attributes, (field, fieldName)=> {
            if (fieldName==fieldJoin && field.model) f = field.model ;
        }) ;
        return f ;
    }
    populate(fieldJoin) {
        let tabFieldsJoins = fieldJoin.split('.') ;
        let previousModelName = this.modelname ;
        let previousModelAlias = 't1' ;
        let tabOrigin = [] ;
        _.each(tabFieldsJoins, (join)=> {
            tabOrigin.push(join) ;
            let modelname = this._searchModelNameFromFieldName(join, previousModelName) ;
            let modelalias = 't1' ;
            if (modelname) {
                if (!this.tabAlreadyIncluded[modelname+'__'+tabOrigin.join('_')]) {
                    modelalias = 't'+(this.joinModels.length+1) ;
                    this.joinModels.push({modelname:modelname, modelalias:modelalias, fieldJoin:join, modelnameto:previousModelName, modelaliasto:previousModelAlias, origin:tabOrigin.join('.')}) ;
                    this.tabAlreadyIncluded[modelname+'__'+tabOrigin.join('_')] = modelalias ;
                } else {
                    modelalias = this.tabAlreadyIncluded[modelname+'__'+tabOrigin.join('_')] ;
                }
            }
            previousModelName = modelname ;
            previousModelAlias = modelalias ;
        }) ;
        return this ;
    }
    orderBy(order) {
        this.order = order ;
        return this ;
    }
    groupBy(groupby) {
        this.groupby = groupby ;
        return this ;
    }
    having(having) {
        this.having = having ;
        return this ;
    }
    _createWhere() {
        let where = '' ;
        if (!this.where) {
            where = '1' ;
        } else if (_.isInteger(this.where)) {
            where += this.primary+'=?' ;
            this.whereData.push(this.where) ;
        } else if (_.isObject(this.where)) {
            where += '1' ;
            _.each(this.where, (val,key)=> {
                where += ' && '+key+'=?' ;
                this.whereData.push(val) ;
            }) ;
        } else {
            var isKey = true ;
            if (this.where.indexOf(' ')!==-1) isKey = false ;
            if (this.where.indexOf('>')!==-1) isKey = false ;
            if (this.where.indexOf('<')!==-1) isKey = false ;
            if (this.where.indexOf('=')!==-1) isKey = false ;
            if (isKey) {
                where += this.primary+'=?' ;
                this.whereData.push(this.where) ;
            } else {
                where = this.where ;
            }
        }
        return where ;
    }
    _createSelect() {
        var tabSelect = [] ;
        _.each(this.joinModels, (model, num)=> {
            _.each(M_Db.models[model.modelname].def.attributes, (field, fieldName)=> {
                let as = '' ;
                if (model.modelnameto) as = ' AS '+model.modelalias+'_'+model.fieldJoin+'_'+fieldName ;
                tabSelect.push(model.modelalias+'.'+fieldName+as) ;
            }) ;
        }) ;
        return tabSelect.join(', ') ;
    }
    _createJoin() {
        let tabJoin = [] ;
        _.each(this.joinModels, (model, num)=> {
            if (!model.modelnameto) tabJoin.push(M_Db.models[model.modelname].def.tableName+' '+model.modelalias) ;
            else tabJoin.push('LEFT JOIN '+M_Db.models[model.modelname].def.tableName+' '+model.modelalias+' ON '+model.modelalias+'.'+M_Db.models[model.modelname].primary+'='+model.modelaliasto+'.'+model.fieldJoin) ;
        }) ;
        return tabJoin.join(' ') ;
    }
    _createOrder() {
        let order = '' ;
        if (this.order) order = ' ORDER BY '+this.order ;
        return order ;
    }
    _createSelectQuery() {

        let query = 'SELECT '+this._createSelect()+' FROM '+this._createJoin()+' WHERE '+this._createWhere()+this._createOrder() ;
        // console.log("query",query);
        return query ;

    }
    _createInsertQuery() {
        let fields = [],
            vals = [] ;
        _.each(this.data, (val, key)=> {
            if (this.def.attributes[key]) {
                fields.push(key) ;
                vals.push('?') ;
                this.whereData.push(val) ;
            }
        }) ;
        let query = 'INSERT INTO '+this.def.tableName+'('+fields.join(', ')+') VALUES ('+vals.join(', ')+')' ;
        return query ;
    }
    _createUpdateQuery() {
        let vals = [] ;
        _.each(this.data, (val, key)=> {
            if (this.def.attributes[key]) {
                vals.push(key+'=?') ;
                this.whereData.push(val) ;
            }
        }) ;
        let query = 'UPDATE '+this.def.tableName+' SET '+vals.join(', ')+' WHERE '+this._createWhere() ;
        return query ;
    }
    _createDestroyQuery() {
        let query = 'DELETE FROM '+this.def.tableName+' WHERE '+this._createWhere() ;
        return query ;
    }
    _preTreatment() {
        // console.log("this.data",this.data);
        _.each(this.def.attributes, (field, fieldName)=> {
            // console.log("fieldName,field.type",fieldName,field.type);
            if (this.data[fieldName]===undefined) return ;
            let key = fieldName ;
            let val = this.data[key] ;
            if (field.type=='json' && _.isObject(val)) {
                try {
                    this.data[key] = JSON.stringify(this.data[key]) ;
                } catch(e) {
                    console.log("json stringify error",e);
                    this.data[key] = '' ;
                }
            }
            if (field.type=='json' && !_.isObject(val)) {
                try {
                    this.data[key] = JSON.parse(this.data[key]) ;
                    this.data[key] = JSON.stringify(this.data[key]) ;
                    // console.log("this.data[key]",this.data[key]);
                } catch(e) {
                    console.log("json stringify error",e);
                    this.data[key] = '' ;
                }
            }
            if (field.type=='boolean') {
                if (this.data[fieldName]===false) this.data[fieldName] = 0 ;
                if (this.data[fieldName]===true) this.data[fieldName] = 1 ;
                if (this.data[fieldName]==='false') this.data[fieldName] = 0 ;
                if (this.data[fieldName]==='true') this.data[fieldName] = 1 ;
            }
            if (field.type=='datetime') {
                if (_.isDate(this.data[fieldName])) this.data[fieldName] = moment(this.data[fieldName]).format('YYYY-MM-DD HH:mm:ss') ;
            }
            if (field.type=='date') {
                if (_.isDate(this.data[fieldName])) this.data[fieldName] = moment(this.data[fieldName]).format('YYYY-MM-DD') ;
            }
        }) ;
    }
    _postTreatment(rows) {
        _.each(rows, (row)=> {
            _.each(this.def.attributes, (field, fieldName)=> {
                if (field.type=='json') {
                    try {
                        if (row[fieldName]) row[fieldName] = JSON.parse(row[fieldName]) ;
                        else row[fieldName] = null ;
                    } catch(e) {
                        console.log("json parse error",e,fieldName, row[fieldName]);
                        row[fieldName] = null ;
                    }
                }
                if (field.type=='boolean') {
                    if (row[fieldName]===true ||
                        row[fieldName]==='true' ||
                        row[fieldName]===1 ||
                        row[fieldName]==='1'
                    ) row[fieldName] = true ;
                    else row[fieldName] = false ;
                }
            }) ;
            let alreadyOrigins = [] ;
            _.each(this.joinModels, (model, num)=> {
                if (model.modelnameto) {
                    // this._setObjectToRow(row, row, model.modelname, model.modelnameto, model.fieldJoin) ;
                    let obj = {} ;
                    _.each(M_Db.models[model.modelname].def.attributes, (field, fieldName)=> {
                        // let f = M_Db.models[model.modelname].def.tableName+'_'+model.fieldJoin+'_'+fieldName ;
                        let f = model.modelalias+'_'+model.fieldJoin+'_'+fieldName ;
                        if (row.hasOwnProperty(f)) {
                            if (field.type=='json') {
                                try {
                                    if (row[f]) row[f] = JSON.parse(row[f]) ;
                                    else row[f] = null ;
                                } catch(e) {
                                    console.log("json parse error",e,f, row[f]);
                                    row[f] = null ;
                                }
                            }
                            obj[fieldName] = row[f] ;
                            delete row[f] ;
                        }
                    }) ;
                    if (!obj[M_Db.models[model.modelname].primary]) {
                        // console.log("M_Db.models[model.modelname].primary",M_Db.models[model.modelname].primary, obj);
                        obj = null ;
                    }
                    let tabFieldsJoins = model.origin.split('.') ;
                    let previousObj = row ;
                    let lastO = null ;
                    _.each(tabFieldsJoins, (o, index)=> {
                        lastO = o ;
                        if (index>=tabFieldsJoins.length-1) return ;
                        previousObj = previousObj[o] ;
                    }) ;
                    if (previousObj) previousObj[lastO] = obj ;
                }
            }) ;
        }) ;
    }
    _beforeQuery(cb) {
        let fn = null, fn2 = null ;
        switch (this.command) {
            case 'UPDATE':
            if (this.def.useUpdatedAt) this.data.updatedAt = new Date() ;
            if (this.def.beforeUpdate) fn = this.def.beforeUpdate ;
            break;
            case 'DELETE':
            if (this.def.beforeDestroy) fn2 = this.def.beforeDestroy ;
            break;
            case 'INSERT':
            if (this.def.useCreatedAt) this.data.createdAt = new Date() ;
            if (this.def.useUpdatedAt) this.data.updatedAt = new Date() ;
            if (this.def.beforeCreate) fn = this.def.beforeCreate ;
            break;
            // case 'REPLACE':
            // if (this.def.beforeCreate) fn = this.def.beforeCreate ;
            // break;
            default:
            if (this.def.beforeSelect) fn = this.def.beforeSelect ;
        }
        if (fn) fn(this.data, cb) ;
        else if (fn2) fn(cb) ;
        else cb() ;
    }
    exec(cb, returnCompleteRow) {
        // console.log("this.command,this.data",this.command,this.data);
        this._beforeQuery(() => {
            // console.log("after");
            let query ;
            switch (this.command) {
                case 'QUERY':
                query = this.querySaved ;
                break;
                case 'INSERT':
                this._preTreatment() ;
                query = this._createInsertQuery() ;
                break;
                case 'UPDATE':
                this._preTreatment() ;
                query = this._createUpdateQuery() ;
                break;
                case 'DELETE':
                query = this._createDestroyQuery() ;
                break;
                default:
                query = this._createSelectQuery() ;
            }
            if (this.def.proxysql) {

                let sql = this.connection.format(query, this.whereData);
                // console.log("sql",sql);
                request.post({url:this.def.proxysql, formData: {
                    query: sql,
                    command: this.command,
                    // data: JSON.stringify(this.whereData)
                }}, (err, httpResponse, body)=> {
                  if (err) {
                    return cb(err);
                  }
                //   console.log("on envoie:", query);
                //   console.log('Server responded with:', body);
                  let d = {} ;
                  try {
                      d = JSON.parse(body) ;
                    //   console.log('Parsed:', d);
                  } catch (e) {
                      return cb(err);
                  }
                  this.postTreatmentMain(null, d, returnCompleteRow, cb) ;
                });


            } else {
                if (this.def.debug) console.log("query",query, this.whereData);
                // {
                //     sql: query,
                //     values: this.whereData,
                //     nestTables: false
                // }
                this.connection.query(query, this.whereData, (err, rows, fields)=> {
                    this.postTreatmentMain(err, rows, returnCompleteRow, cb) ;
                });

            }
        }) ;

    }
    postTreatmentMain(err, rows, returnCompleteRow, cb) {
        let res ;
        if (err) {
            // console.log('query',query);
            // console.log('whereData',this.whereData);
            console.log('err',err);
            return cb(err, res) ;
        }
        switch (this.command) {
            case 'QUERY':
            res = rows ;
            break;
            case 'UPDATE':
            res = rows.affectedRows ;
            // console.log("rows",rows);
            break;
            case 'DELETE':
            res = rows.affectedRows ;
            break;
            case 'INSERT':
            this.data[this.primary] = rows.insertId ;
            // res = this.data ;
            res = rows.insertId ;
            break;
            default:
            this._postTreatment(rows) ;
            if (this.onlyOne) {
                if (rows.length) res = rows[0] ;
                else res = null ;
            } else res = rows ;
        }
        // console.log("res",res);
        if (this.def.debug) console.log("res",res);
        // console.log('The solution is: ', rows);
        if (returnCompleteRow && (this.command=='UPDATE' || this.command=='INSERT')) {
            // console.log("this.command",this.command);
            if (this.command=='UPDATE') {
                this.table.find(this.original_where, this.original_whereData).exec((errsql, rows2)=> {
                    if (errsql) console.log("errsql",errsql);
                    cb(errsql, rows2) ;
                }) ;
            } else {
                this.table.findOne(res).exec((errsql, rows2)=> {
                    if (errsql) console.log("errsql",errsql);
                    cb(errsql, rows2) ;
                }) ;

            }
        } else return cb(err, res) ;
    }
}
class M_Table {
    constructor(def, connection) {
        this.def = def ;
        this.connection = connection ;
        this.modelname = this.def.modelname ;
        this.primary = '' ;
        this.primaryType = 'integer' ;
        this.primaryLength = 11 ;
        _.each(this.def.attributes, (field, fieldName)=> {
            if (field.primary) {
                this.primary = fieldName ;
                this.primaryType = field.type ;
                if (field.length) this.primaryLength = field.length ;
            }
        }) ;
    }
    createEmpty() {
        var row = {} ;
        _.each(this.def.attributes, (field, fieldName)=> {
            if (field.model) return ;
            // console.log("field",field);
            row[fieldName] = '' ;
            let typejs = M_Db._ormTypeToDatabaseType(field.type, '', 'typejs') ;
            if (typejs=='number') row[fieldName] = 0 ;
            if (typejs=='date') row[fieldName] = null ;
            if (typejs=='boolean') row[fieldName] = false ;
            if (field.defaultsTo) row[fieldName] = field.defaultsTo ;
        }) ;
        return row ;
    }
    use(connectionId) {
        var exec = new M_TableExec(this) ;
        return exec ;
    }
    select(fields) {
        var exec = new M_TableExec(this) ;
        return exec.select(fields) ;
    }
    find(where, whereData) {
        var exec = new M_TableExec(this) ;
        return exec.find(where, whereData) ;
    }
    findOne(where, whereData) {
        var exec = new M_TableExec(this) ;
        return exec.findOne(where, whereData) ;
    }
    create(data) {
        var exec = new M_TableExec(this) ;
        return exec.create(data) ;
    }
    update(where, whereData, data) {
        var exec = new M_TableExec(this) ;
        return exec.update(where, whereData, data) ;
    }
    replace(where, whereData, data, cb, returnCompleteRow) {//where, whereData,
        let where2 = _.cloneDeep(where) ;
        let whereData2 = _.cloneDeep(whereData) ;
        // console.log("whereData,whereData2",whereData,whereData2);
        // let data2 = _.cloneDeep(data) ;
        this.findOne(where, whereData).exec((errsql, _rowold)=> {
            // console.log("where, whereData, _row",where, whereData, _row);
            if (errsql) console.log("errsql",errsql);
            if (!_rowold) this.create(data).exec((errsql, idTemp)=> {
                if (returnCompleteRow) {
                    this.findOne(idTemp).exec((errsql, _row)=> {
                        cb(errsql, _row, _rowold) ;
                    }) ;
                } else cb(errsql, idTemp, _rowold) ;
            }) ;
            else this.update(where2, whereData2, data).exec((errsql, rows)=> {
                // console.log("where2, whereData2, data, rows",where2, whereData2, data, rows);
                if (returnCompleteRow && rows.length) return cb(errsql, rows[0], _rowold) ;
                cb(errsql, rows, _rowold) ;
                // if (returnCompleteRow) {
                //     this.findOne(where2, whereData2).exec((errsql, _row)=> {
                //         cb(errsql, _row) ;
                //     }) ;
                // } else cb(errsql, rows) ;
            }, returnCompleteRow) ;
        }) ;
    }
    destroy(where, whereData) {
        var exec = new M_TableExec(this) ;
        return exec.destroy(where, whereData) ;
    }
    query(query, data) {
        var exec = new M_TableExec(this) ;
        return exec.query(query, data) ;
    }
}



var M_Db = new (class {
    init(config, cb) {
        this.config = config.models ;
        // console.log("this.config",this.config);
        // this.config.mysql.connection.debug = true ;

        // this.connection = mysql.createConnection(this.config.mysql.connection);
        // this.connection.connect();
        var pool = mysql.createPool(this.config.mysql.connection) ;
        this.connection = {
            pool: pool,
            // this.connection = mysql.createConnection(this.config.mysql.connection);
            // this.connection.connect();
            query: function() {
                var sql_args = [];
                var args = [];
                for(var i=0; i<arguments.length; i++){
                    args.push(arguments[i]);
                }
                var callback = args[args.length-1]; //last arg is callback
                this.pool.getConnection(function(err, connection) {
                    // console.log("err,connection",err,connection);
                    if(err) {
                        console.log(err);
                        return callback(err);
                    }
                    if(args.length > 2){
                        sql_args = args[1];
                    }
                    // console.log("args[0],sql_args",args[0],sql_args);
                    connection.query(args[0], sql_args, function(err, results) {
                        connection.release(); // always put connection back in pool after last query
                        if(err){
                            console.log("errrrrrr",err);
                            return callback(err);
                        }
                        callback(null, results);
                    });
                });
            }
        } ;


        let files = fs.readdirSync(process.cwd()+'/models') ;
        this.models = {} ;
        _.each(files, (file)=> {
            file = file.substring(0,file.length-3) ;
            var def = require(process.cwd()+'/models/'+file) ;
            if (def.useUpdatedAt===undefined) def.useUpdatedAt = true ;
            if (def.useCreatedAt===undefined) def.useCreatedAt = true ;
            if (def.useCreatedAt) def.attributes['createdAt'] = {type:'datetime',index:true} ;
            if (def.useUpdatedAt) def.attributes['updatedAt'] = {type:'datetime',index:true} ;
            if (!def.tableName) def.tableName = file.toLowerCase() ;
            def.modelname = file ;
            def.debug = this.config.debug ;
            GLOBAL[file] = this.models[file] = new M_Table(def, this.connection) ;
        }) ;
        cb() ;
    }
    _ormTypeToDatabaseType(ormtype, length, info) {
        // console.log("ormtype,length",ormtype,length);
        if (!info) info = 'type' ;
        let typeJS = '' ;
        ormtype = ormtype.toLowerCase() ;
        let res = '' ;
        if (ormtype=='int' || ormtype=='integer') {
            if (!length) length = 11 ;
            res = 'INT('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='tinyint') {
            if (!length) length = 4 ;
            res = 'TINYINT('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='smallint') {
            if (!length) length = 6 ;
            res = 'SMALLINT('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='mediumint') {
            if (!length) length = 9 ;
            res = 'MEDIUMINT('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='year') {
            if (!length) length = 4 ;
            res = 'YEAR('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='float') {
            res = 'FLOAT' ;
            if (length) res+='('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='double') {
            res = 'DOUBLE' ;
            typeJS = 'number' ;


        // } else if (ormtype=='timestamp') {
        //     res = 'TIMESTAMP' ;
        } else if (ormtype=='date') {
            res = 'DATE' ;
            typeJS = 'date' ;
        } else if (ormtype=='datetime') {
            res = 'DATETIME' ;
            typeJS = 'date' ;


        } else if (ormtype=='char') {
            if (!length) length = 1 ;
            res = 'CHAR('+length+')' ;
            typeJS = 'string' ;
        } else if (ormtype=='varchar' || ormtype=='string') {
            if (!length) length = 255 ;
            res = 'VARCHAR('+length+')' ;
            typeJS = 'string' ;
        } else if (ormtype=='tinytext') {
            res = 'TINYTEXT' ;
            typeJS = 'string' ;
        } else if (ormtype=='mediumtext') {
            res = 'MEDIUMTEXT' ;
            typeJS = 'string' ;
        } else if (ormtype=='longtext') {
            res = 'LONGTEXT' ;
            typeJS = 'string' ;
        } else if (ormtype=='text' || ormtype=='json') {
            res = 'TEXT' ;
            typeJS = 'string' ;
        } else if (ormtype=='enum') {
            res = 'ENUM' ;
            typeJS = 'string' ;
        } else if (ormtype=='set') {
            res = 'SET' ;
            typeJS = 'string' ;
        } else if (ormtype=='decimal' || ormtype=='price') {
            if (!length) length = '10,2' ;
            res = 'DECIMAL('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='bigint') {
            if (!length) length = 20 ;
            res = 'BIGINT('+length+')' ;
            typeJS = 'number' ;
        } else if (ormtype=='time') {
            res = 'TIME' ;
            typeJS = 'number' ;


        } else if (ormtype=='tinyblob') {
            res = 'TINYBLOB' ;
            typeJS = 'string' ;
        } else if (ormtype=='mediumblob') {
            res = 'MEDIUMBLOB' ;
            typeJS = 'string' ;
        } else if (ormtype=='longblob') {
            res = 'LONGBLOB' ;
            typeJS = 'string' ;
        } else if (ormtype=='blob') {
            res = 'BLOB' ;
            typeJS = 'string' ;
        } else if (ormtype=='binary') {
            res = 'BINARY' ;
            typeJS = 'binary' ;
        } else if (ormtype=='varbinary') {
            res = 'VARBINARY' ;
            typeJS = 'binary' ;
        } else if (ormtype=='bit') {
            res = 'BIT' ;
            typeJS = 'boolean' ;
        } else if (ormtype=='boolean') {
            res = 'TINYINT(4)' ;
            typeJS = 'boolean' ;
        }



        if (info=='typejs') return typeJS ;
        else return res ;
    }

    createTable(model, cb) {
        var def = model.def ;

        var exists = false ;
        var currentDef ;
        async.series([
            (next)=> {
                this.connection.query("SELECT * FROM "+def.tableName+" LIMIT 0,1", (errsql, rows)=> {
                    // console.log("errsql,rows",errsql,rows);
                    if (!errsql) exists = true ;
                    next() ;
                }) ;
            },
            (next)=> {
                if (this.config.migrate=='recreate') {
                    exists = false ;
                    this.connection.query("DROP TABLE IF EXISTS "+def.tableName+"", (errsql, rows)=> {
                        if(errsql) console.log("errsql2",errsql);
                        next() ;
                    }) ;
                } else next() ;
            },
            (next)=> {
                if (exists && this.config.migrate=='alter') {
                    this.connection.query("DESCRIBE "+def.tableName+"", (err, rows, fields)=> {
                        // console.log("rows,fields",def.tableName,rows);
                        async.eachOfSeries(def.attributes, (field, fieldName, nextField)=> {
                            let type1 = null ;
                            if (field.model) {
                                let f = this._getJoinedModel(field) ;
                                // console.log("f",f);
                                if (f) type1 = this._ormTypeToDatabaseType(f[0], f[1]) ;
                            } else {
                                // console.log("field.type",field.type);
                                type1 = this._ormTypeToDatabaseType(field.type, field.length) ;
                            }
                            let type2 = null ;
                            _.each(rows, (row)=> {
                                if (row.Field==fieldName) type2 = row.Type ;
                            }) ;

                            if (type2 === null) {
                                // console.log("field2",field,fieldName);
                                if (field.model) {
                                    var f = this._getJoinedModel(field) ;
                                    field.type = f[0] ;
                                    field.length = f[1] ;
                                }
                                let q = "ALTER TABLE "+def.tableName+" ADD "+fieldName+" "+this._ormTypeToDatabaseType(field.type, field.length)+this._getNotnull(field)+this._getIndex(field)+this._getDefault(field) ;
                                console.log("q",q);
                                this.connection.query(q, (errsql, rows)=> {
                                    if(errsql) console.log("errsql",errsql);
                                    nextField() ;
                                }) ;
                            } else if (type1 && type2 && type1.toLowerCase()!=type2.toLowerCase()) {
                                // console.log("field3",field,fieldName);
                                let q = "ALTER TABLE "+def.tableName+" CHANGE "+fieldName+" "+fieldName+" "+this._ormTypeToDatabaseType(field.type, field.length)+this._getNotnull(field)+this._getDefault(field) ;
                                console.log("q",q);
                                this.connection.query(q, (errsql, rows)=> {
                                    if(errsql) console.log("errsql",errsql);
                                    nextField() ;
                                }) ;

                            } else nextField() ;
                        }) ;
                        next() ;
                    }) ;

                } else next() ;
            },
            (next)=> {
                if (!exists) {
                    let what = [] ;
                    _.each(def.attributes, (field, fieldName)=> {
                        if (field.model) {
                            var f = this._getJoinedModel(field) ;
                            if (f) what.push(fieldName+' '+this._ormTypeToDatabaseType(f[0], f[1])) ;
                        } else {
                            what.push(fieldName+' '+this._ormTypeToDatabaseType(field.type, field.length)+this._getNotnull(field)+this._getIndex(field)+this._getDefault(field)) ;
                        }
                    }) ;
                    let q = "CREATE TABLE "+def.tableName+" ("+what.join(', ')+")" ;
                    console.log("q",q);
                    this.connection.query(q, (errsql, rows)=> {
                        if(errsql) console.log("errsql",errsql);
                        next() ;
                    }) ;

                } else next() ;
            },
            (next)=> {
                if (this.config.migrate=='alter') {
                    let q = "SHOW INDEX FROM "+def.tableName+"" ;
                    this.connection.query(q, (errsql, rows)=> {
                        // console.log("rows",rows);
                        async.eachOfSeries(def.attributes, (field, fieldName, nextField)=> {
                            let createIndex = false ;
                            if (field.model || field.index) {
                                createIndex = true ;
                                _.each(rows, (row)=> {
                                    if (row.Column_name==fieldName) createIndex = false ;
                                }) ;
                            }
                            if (createIndex) {
                                let q = "ALTER TABLE "+def.tableName+" ADD INDEX ("+fieldName+")" ;
                                console.log("q",q);
                                this.connection.query(q, (errsql, rows)=> {
                                    if(errsql) console.log("errsql",errsql);
                                    nextField() ;
                                }) ;
                            } else nextField() ;
                        }, ()=> {
                            next() ;
                        }) ;
                    }) ;
                }
            }

        ], function() {
            cb() ;
        }) ;

    }
    _getIndex(field) {
        let res = '' ;
        if (field.primary) res += ' PRIMARY KEY' ;
        if (field.autoincrement) res += ' AUTO_INCREMENT' ;
        return res ;
    }
    _getNotnull(field) {
        let res = '' ;
        if (field.notnull || typeof field.notnull == 'undefined') res = ' NOT NULL' ;
        else res = ' NULL' ;
        return res ;
    }
    _getDefault(field) {
        let defaultsTo = '' ;
        if (typeof field.defaultsTo !== 'undefined') defaultsTo = ' DEFAULT "'+field.defaultsTo+'"' ;
        return defaultsTo ;
    }
    _getJoinedModel(field) {
        // console.log("field",field);
        if (this.models[field.model]) {
            return [this.models[field.model].primaryType, this.models[field.model].primaryLength] ;
        } else console.log("Model "+field.model+" not found") ;
        return null ;
    }
})() ;

module.exports = M_Db ;



