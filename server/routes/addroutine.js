const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");
const { body, validationResult } = require('express-validator');

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", (req ,res) => {

    console.log(req.session.userID);
    if (!req.session.userID) {
        console.log('user doesnt have access');
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

// If a user accesses this route, send their routine to the database.
router.post("/", async (req ,res) => {

    const body = req.body; // username and password sent by React
    console.log('We received the body!', body);

    const userID = req.session.userID;
    console.log('The current userID is... ', userID);

    // Try to send the data to the database!
    try {

        console.log('Made it inside the try catch block')

        // Wait here while we check to see if the data has been inserted into the database.
        await workout_trackerdb.insertRoutineAndExercises(body, userID);

        // If the data was inserted correctly, return a 201 to the frontend.
        return res.status(201).json({
            ok: true,
            msg: 'Login successful!'
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
          }); 
    }
});
 
module.exports = router;