const express = require('express');
const db = require('../db');
const login = require('./login');
const {workout_trackerdb, getConnection} = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();


router.get("/", async (req ,res) => {

    // Store IP from Req obj and UserType for logging
    let ip = req.ip;
    let userType = req.session.userType.userRole;

    let exercises = await workout_trackerdb.showAllExercises();
    console.log(exercises);

    let exercisesResults = exercises.results;
    console.log(exercisesResults);

    console.log(req.session.userID);
    if (!req.session.userID) {
        logger.info(`Validation was unsuccessful. Attempted access from an unauthorized user located at IP address: ${ip}`);
        console.log('user doesnt have access');
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        logger.info(`Successfully retrieved the exercises for the current user. The user is logged in as userType: ${userType} from IP address: ${ip}`);
        console.log('Data was returned');
        return res.status(200).json({
            exercisesResults
        });
    }

});


router.post("/", async (req ,res) => {

    // Store IP from Req obj and UserType for logging
    let ip = req.ip;
    let userType = req.session.userType.userRole;

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
            logger.info(`User was unable to create an exercise because it already exists. The user is logged in as userType: ${userType} from IP address: ${ip}`);
            return res.status(409).json({
              ok: false,
              msg: 'That exercise already exists'
            });
          }

        // Insert the exercise
        await workout_trackerdb.insertExercise(body, userID);

        logger.info(`The user successfully added a new exercise! The user is logged in as userType: ${userType} from IP address: ${ip}`);

        // If all of the data was inserted correctly, return a 201
        return res.status(201).json({
            ok: true,
            msg: 'The exercise added to the database!'
        });

    } catch (err) {
        logger.info(`The user was unsuccessful and unable to add a new exercise to the system. The user is logged in as userType: ${userType} from IP address: ${ip}`);
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
          }); 
    }
});

// If the frontend sends a delete request
router.delete("/:id", async (req, res) => {
    console.log("the user sent a delete request");
  
    // Store IP from Req obj and UserType for logging
    let ip = req.ip;
    let userType = req.session.userType.userRole;

    const exercise_idString = req.params.id; // workoutID sent by React
    console.log('exercise_idString is ... ', req.params.id);

    const exercise_id = parseInt(exercise_idString);
    console.log('exercise_id is ... ', exercise_id);

    const userID = req.session.userID.userID; // current userID
  
    console.log("our exerciseID is ", exercise_id, " and our userID is ", userID);
  
    try {
      let result = await workout_trackerdb.deleteExercise(exercise_id);
  
      console.log(result);
  
      logger.info(
        `The user successfully deleted an exercise. The user is logged in as userType: ${userType} from IP address: ${ip}`
      );
  
      return res.status(201).json({
        msg: "Exercise deleted!",
      });
    } catch (err) {
        console.log('error was ... ', err);
      logger.info(
        `The user failed to delete an exercise. The user is logged in as userType: ${userType} from IP address: ${ip}`
      );
      return res.status(500).json({
        ok: false,
        msg: "DB Error!",
      });
    }
  });

 

module.exports = router;