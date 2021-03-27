const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", async (req ,res) => {

    let exercises = await workout_trackerdb.showAllExercises();
    console.log(exercises);

    let exercisesResults = exercises.results;
    console.log(exercisesResults);

    console.log(req.session.userID);
    if (!req.session.userID) {
        console.log('user doesnt have access');
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        console.log('Data was returned');
        return res.status(200).json({
            exercisesResults
        });
    }

});
 
module.exports = router;