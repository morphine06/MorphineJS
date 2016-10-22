module.exports = function(next) {
    // Users.knex('users')
    // .update({})
    // Users.find().populate('jo_id').populate('jo_id.jt_id').exec(function(errsql, rows_us) {
    //     if (errsql) console.log("errsql",errsql);
    //     // console.log("rows_us",rows_us);
    //     // _.each(rows_us, (row_us)=> {
    //     //     console.log("row_us.jo_id",row_us.jo_id);
    //     // }) ;
    //     Users.replace({us_id:1, us_name:'Miglior', us_firstname:'David', jo_id:2, us_login:'david@miglior.fr', us_password:'morph123'}).exec(function(errsql, row_jt) {
    //         if (errsql) console.log("errsql",errsql);
    //         // console.log("row_jt",row_jt);
            next() ;
    //     }) ;
    //
    // }) ;

} ;