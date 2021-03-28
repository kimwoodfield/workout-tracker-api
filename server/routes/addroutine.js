const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");
const { body, validationResult } = require('express-validator');

// Creates new instance of router
const router = express.Router();


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
    console.log('We received the userID... ', userID);

    // Try to send the data to the database!
    try {

        console.log('Made it inside the try catch block');
        console.log('first exercise is...', body.first_exercise)

        // Insert the new routine name
        let retrievedRoutineName = await workout_trackerdb.insertRoutineName(body, userID);
        let routineName = retrievedRoutineName.routine;
        console.log('We awaited the insertRoutineName function and got ... ', routineName);
        console.log('routineNames type is ... ', typeof routineName);


        // Grab the Primary Key of the routine_name we just inserted
        let retrievedRoutineId = await workout_trackerdb.retrieveRoutineId(retrievedRoutineName);
        let routineID = retrievedRoutineId.results[0].id;
        console.log('We awaited the retrieveRoutineId function and got ... ', routineID);
        let routineIDarr = [];
        routineIDarr.push(routineID);
        console.log('routineIDarr is ... ', routineIDarr);

        // Collect the Primary Keys of the exercises the user chose for the routine
        let allExercises = [
            body.first_exercise,
            body.second_exercise,
            body.third_exercise,
            body.fourth_exercise,
            body.fifth_exercise
        ];
        let exerciseID = [];

        console.log(allExercises[0]);

        for (let i = 0; i < allExercises.length; i++) {
            let currentExercise = allExercises[i];
            let retrievedExerciseId = await workout_trackerdb.retrieveExerciseId(currentExercise);
            exerciseID.push(retrievedExerciseId.results[0].id);
            console.log('We are at the ', i, 'th position and just selected the Primary key for ', currentExercise);
        }
        console.log('The loop finished and the collected exerciseIDs are ... ', exerciseID);

        // Insert into the RoutineExercise joining table by inserting the Primary Key of the correct routine_name and the Primary Key's for each exercise the user submitted
        console.log('Starting the inserts into the RoutineExercise table...')
        for (let i = 0; i < exerciseID.length; i++) {
            let currentExercise = exerciseID[i];
            await workout_trackerdb.insertIntoRoutineExercise(routineIDarr, currentExercise);
            console.log('We are at the ', i, 'th position and just selected the Primary key for ', currentExercise);
        }
        console.log('RoutineExercise rows added!');


        // If all of the data was inserted correctly, return a 201
        return res.status(201).json({
            ok: true,
            msg: 'Routine added!'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
          }); 
    }
});
 
module.exports = router;