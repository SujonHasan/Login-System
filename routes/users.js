const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {forwordAuthenticated } = require('../config/auth');

// Register
router.get('/register',forwordAuthenticated, (req, res) => {
    res.render('register');
})

// Login
router.get('/login',forwordAuthenticated ,(req, res) => {
    res.render('login');
})

// // Register 
router.post('/register', async (req, res) => {
    const { name, username, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    const duplicateUsername = await User.findOne({username: username}).exec();
    if(duplicateUsername) errors.push({msg: 'This Username is currently in use'});

    const duplicateEmail = await User.findOne({email: email}).exec();
    if(duplicateEmail) errors.push({msg: 'This Email is currently in use'});

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
 
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            username,
            email,
            password,
            password2
        });
    }
    else {

        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // create and store the new user two way
        const result = await User.create({
            name: name,
            username: username,
            password: hashedPwd,
            email: email
        });

        console.log(result);

        await req.flash('success_msg', 'You are registered and can now login');

        res.redirect('login')

    }
});

passport.use(new LocalStrategy(
    async(username, password, done) => {
        
        const foundUser = await User.findOne({username: username}).exec();
        if(!foundUser) return done(null, false, {message: "Unknown user"});

        // cvaluate password
        const match = await bcrypt.compare(password, foundUser.password);
        if(match) return done(null, foundUser);
        else return done(null, false, {message: 'Invalid password'});
    }
))

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

// passport.deserializeUser(async(id, done)=>{
//     const user = await User.findOne({_id: id}).exec();
//     done(null,user);
// })

passport.deserializeUser(function(id, done){
    User.findById(id,function(err, user){
        done(err, user); 
    })
})

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), (req, res) => {

    res.redirect('/');
})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('login');
    });
  });

module.exports = router; 