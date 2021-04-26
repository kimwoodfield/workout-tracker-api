const express = require('express');
const db = require('../db');
const login = require('./login');
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// If a user accesses this route, log them out of the application.
router.post("/", (req ,res) => {

    // Store IP from Req obj and UserType for logging
    let ip = req.ip;
    let userType = req.session.userType.userRole;

    if (!req.session.userID) {
        logger.info(`Validation was unsuccessful on attempted logout. Attempted access from an unauthorized user located at IP address: ${ip}`);
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        logger.info(`Successfully logged out the current user. The user was logged in as userType: ${userType} from IP address: ${ip}`);
        res.clearCookie('User cookie');
        return res.status(200).json({
            status: 200,
            msg: 'Session has been destroyed'
        });
    }

});
 
module.exports = router;