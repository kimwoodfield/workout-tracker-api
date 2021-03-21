const express = require('express');
const db = require('../db');
const login = require('./login');

// Creates new instance of router
const router = express.Router();

// If a user accesses this route, log them out of the application.
router.post("/", (req ,res) => {

    if (!req.session.userID) {
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        res.clearCookie('User cookie');
        return res.status(200).json({
            status: 200,
            msg: 'Session has been destroyed'
        });
    }

});
 
module.exports = router;