module.exports = function(next) {


    var data = {co_id:1, co_name:'Miglior', co_firstname:'David', co_email:'david@miglior.fr', co_login:'david@miglior.fr', co_password:'xxxxx', co_type:'user', co_active:1, co_geo_lat:'43.709464', co_geo_lng:'7.258434', co_address1:'5 rue Castel', co_address2:'', co_zip:'06000', co_city:'Nice', co_admin:1, co_apikey:'1111', co_apisecret:'1111'} ;//gps nice
    // data.co_apikey = uuid.v4();
    // data.co_apisecret = uuid.v4();

    Contacts.replace("co_id=1", [], data, function(errsql, row_co) {
        next() ;
    }) ;

} ;