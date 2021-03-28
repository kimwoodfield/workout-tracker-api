const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");


// Creates new instance of router
const router = express.Router();


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


router.post("/", async (req ,res) => {

    console.log('We made it into the addexercise route');

    const body = req.body; // username and password sent by React
    console.log('We received the body!', body);

    const userID = req.session.userID;
    console.log('We received the userID... ', userID);

    // Try to send the data to the database!
    try {

        console.log('Made it inside the try catch block');

        // Check if the exercise already exists
        let exercisesFound = await workout_trackerdb.doesExerciseExist(body, userID); 
        
        // If exercisesFound.total is higher than 0, it means the exercise_name already exists in the database.
        if (exercisesFound.total) {
            return res.status(409).json({
              ok: false,
              msg: 'That exercise already exists'
            });
          }

        // Insert the exercise
        await workout_trackerdb.insertExercise(body, userID);

        // If all of the data was inserted correctly, return a 201
        return res.status(201).json({
            ok: true,
            msg: 'The exercise added to the database!'
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
          }); 
    }
});
 

module.exports = router;