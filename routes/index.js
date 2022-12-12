const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// Get Homepage
router.get('/', ensureAuthenticated,(req, res) =>{

    res.render('index');
})

module.exports = router;