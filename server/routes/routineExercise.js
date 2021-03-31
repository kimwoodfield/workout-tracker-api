const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", async (req ,res) => {


try {

    // This will be an array of routine objects we send back to the client that will include routine names, the id and the exercises associated to that routine
    let routineList = [];

    // Collect the routine id's we have available.
    const collectedRoutineIds = await workout_trackerdb.selectAllRoutineId(); // This was successful.
    const routineIdResults = collectedRoutineIds.results;

    let routineIds = [];
    for (let i = 0; i < routineIdResults.length; i++) {
        let currentRoutine = routineIdResults[i].id;
        routineIds.push(currentRoutine);
    }

    // Loop through the routineIds (these are the routines we have)
    for (let i = 0; i < routineIds.length; i++) {

        let routine = {
            routine_id: null,
            routine_name: null,
            routine_exercises: [],
        }

        // Attach the current routineId to our routine object.
        routine.routine_id = routineIds[i];

        // Grab the routineName for this routineID
        const currentRoutineId = routineIds[i];
        let collectedRoutineName = await workout_trackerdb.findRoutineName(currentRoutineId);
        let currentRoutineName = collectedRoutineName.results[0].routine_name;
        routine.routine_name = currentRoutineName;

        // Grab the exerciseId's relating to the current routineID
        let exerciseIds = [];
        let collectedExerciseIds = await workout_trackerdb.findExerciseIds(currentRoutineId);
        let collectedExerciseIdResults = collectedExerciseIds.results;
        for (let j = 0; j < collectedExerciseIdResults.length; j++) {
            let currentExerciseId = collectedExerciseIdResults[j];
            exerciseIds.push(currentExerciseId.exercise_id);
        }

        // Grab the exercise_name that the exerciseId is associated with
        let exerciseNames = [];
        for (let k = 0; k < exerciseIds.length; k++) {
            let currentId = exerciseIds[k];
            let collectedExerciseName = await workout_trackerdb.findExerciseName(currentId);
            exerciseNames.push(collectedExerciseName.results[0].exercise_name);
        }
        routine.routine_exercises = exerciseNames;

        routineList.push(routine);
    }

    if (routineList.length > 0) {
        return res.status(201).json({
            routineList
        });
    } else {
        return res.status(201).json({
            ok: true,
            msg: 'There are no routines!'
        });
    }
    
    // If all of the data was inserted correctly, return a 201
    return res.status(201).json({
        ok: true,
        msg: 'Function was successful.'
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