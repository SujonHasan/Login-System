function ensureAuthenticated(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }else{
        // req.flash('error_msg', 'Your are not logged in');
        res.redirect('./users/login');
    }
}

function forwordAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return next();
    res.redirect('/');

}

module.exports = {
    ensureAuthenticated,
    forwordAuthenticated
}