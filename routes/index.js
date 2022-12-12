const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwordAuthenticated } = require('../config/auth');

// Get Homepage
router.get('/', ensureAuthenticated,(req, res) =>{

    res.render('index');
})

module.exports = router;