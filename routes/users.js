const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {forwordAuthenticated } = require('../config/auth');

// Register
router.get('/register',forwordAuthenticated, (req, res) => {
    res.render('register');
})

// Login
router.get('/login',forwordAuthenticated ,(req, res) => {
    res.render('login');
})

// Register 
router.post('/register', async (req, res) => {
    const { name, username, email, password, password2 } = req.body;
    let errors = [];
    // check user input
    if (!name || !username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    // Duplicat checking
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

        await req.flash('success_msg', 'You are registered and can now login');

        res.redirect('login')

    }
});

// Login
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), (req, res) => {

    res.redirect('/');
})

// Logout
router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('login');
    });
  });

module.exports = router; 