const express = require('express');
const db = require('../db');
const login = require('./login');

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", (req ,res) => {
    if (!req.session.userID) {
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        console.log('user has access');
        return res.status(200).json({
            status: 200,
            msg: 'User allowed'
        });
    }

});
 
module.exports = router;