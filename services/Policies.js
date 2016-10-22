module.exports = {
    accessBackend: function(req, res, next) {
        // console.log("test1bis",req.user);
        if (req.user && req.user.us_id) return next(true) ;
        next(true) ;
        // res.send("KO") ;
    },
    accessFrontend: function(req, res, next) {
        console.log("test2bis");
        next(true) ;
    }
} ;