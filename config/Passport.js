const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

function initialize(passport){

    passport.use(new LocalStrategy(
        async(username, password, done) => {
            
            const foundUser = await User.findOne({username: username}).exec();
            if(!foundUser) return done(null, false, {message: "Unknown user"});
    
            // evaluate password
            const match = await bcrypt.compare(password, foundUser.password);
            if(match) return done(null, foundUser);
            else return done(null, false, {message: 'Invalid password'});
        }
    ))
    
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    })
    
    passport.deserializeUser(function(id, done){
        User.findById(id,function(err, user){
            done(err, user); 
        })
    })
}

module.exports = initialize;