const express = require('express');
const db = require('../db');
const login = require('./login');
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// If a user accesses this route, log them out of the application.
router.post("/", (req ,res) => {

    console.log('made it to logout route');

    // Store IP from Req obj and UserType for logging
    let ip = req.ip;

    console.log('req.session is ', req.session);
    console.log('req.session.userType is ', req.session.userType);
    console.log('req.session.userType.userRole is ', req.session.userType.userRole);
    let userType = req.session.userType.userRole;

    console.log('req.session.userID is ', req.session.userID);

    if (!req.session.userID) {
        console.log('log at the start of first if statement');
        logger.info(`Validation was unsuccessful on attempted logout. Attempted access from an unauthorized user located at IP address: ${ip}`);
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        console.log('made it past the first if statement');
        logger.info(`Successfully logged out the current user. The user was logged in as userType: ${userType} from IP address: ${ip}`);
        res.clearCookie('User cookie');
        console.log('the usertype is ', userType, ' and the ip is ', ip);
        console.log('made it to the return');
        return res.status(201).json({
            status: 201,
            msg: 'Session has been destroyed'
        });
    }

});
 
module.exports = router;