const express = require("express");
const db = require("../db");
const login = require("./login");
const { workout_trackerdb, getConnection } = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", async (req, res) => {

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;

  let routines = await workout_trackerdb.showAllRoutines();
  console.log(routines);

  let routinesResults = routines.results;
  console.log(routinesResults);

  console.log(req.session.userID);
  if (!req.session.userID) {
    logger.info(`Validation was unsuccessful. Attempted access from an unauthorized user located at IP address: ${ip}`);
    console.log("user doesnt have access");
    return res.status(403).json({
      status: 403,
      msg: "Forbidden.",
    });
  } else {
    logger.info(`Successfully validated the user and the current routines were retrieved for the current user. The user is logged in as userType: ${userType} from IP address: ${ip}`);
    console.log("Data was returned");
    return res.status(200).json({
      routinesResults,
    });
  }
});

// If a user accesses this route, send their routine to the database.
router.post("/", async (req, res) => {

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;

  const body = req.body; // username and password sent by React
  console.log("We received the body!", body);

  const userID = req.session.userID;
  console.log("We received the userID... ", userID);

  // Try to send the data to the database!
  try {
    console.log("Made it inside the try catch block");
    console.log("first exercise is...", body.first_exercise);

    // Insert the new routine name
    let retrievedRoutineName = await workout_trackerdb.insertRoutineName(
      body,
      userID
    );
    let routineName = retrievedRoutineName.routine;
    console.log(
      "We awaited the insertRoutineName function and got ... ",
      routineName
    );
    console.log("routineNames type is ... ", typeof routineName);

    // Grab the Primary Key of the routine_name we just inserted
    let retrievedRoutineId = await workout_trackerdb.retrieveRoutineId(
      retrievedRoutineName
    );
    let routineID = retrievedRoutineId.results[0].id;
    console.log(
      "We awaited the retrieveRoutineId function and got ... ",
      routineID
    );
    let routineIDarr = [];
    routineIDarr.push(routineID);
    console.log("routineIDarr is ... ", routineIDarr);

    // Collect the Primary Keys of the exercises the user chose for the routine
    let allExercises = [
      body.first_exercise,
      body.second_exercise,
      body.third_exercise,
      body.fourth_exercise,
      body.fifth_exercise,
    ];
    let exerciseID = [];

    console.log(allExercises[0]);

    for (let i = 0; i < allExercises.length; i++) {
      let currentExercise = allExercises[i];
      let retrievedExerciseId = await workout_trackerdb.retrieveExerciseId(
        currentExercise
      );
      exerciseID.push(retrievedExerciseId.results[0].id);
      console.log(
        "We are at the ",
        i,
        "th position and just selected the Primary key for ",
        currentExercise
      );
    }
    console.log(
      "The loop finished and the collected exerciseIDs are ... ",
      exerciseID
    );

    // Insert into the RoutineExercise joining table by inserting the Primary Key of the correct routine_name and the Primary Key's for each exercise the user submitted
    console.log("Starting the inserts into the RoutineExercise table...");
    for (let i = 0; i < exerciseID.length; i++) {
      let currentExercise = exerciseID[i];
      await workout_trackerdb.insertIntoRoutineExercise(
        routineIDarr,
        currentExercise
      );
      console.log(
        "We are at the ",
        i,
        "th position and just selected the Primary key for ",
        currentExercise
      );
    }
    console.log("RoutineExercise rows added!");

    logger.info(`The current user successfully created a routine! The user is logged in as userType: ${userType} from IP address: ${ip}`);

    // If all of the data was inserted correctly, return a 201
    return res.status(201).json({
      ok: true,
      msg: "Routine added!",
    });
  } catch (err) {
    logger.info(`The current user unsuccessful when attempting to create a routine. The user is logged in as userType: ${userType} from IP address: ${ip}`);
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

// If the frontend sends a delete request
router.delete("/:id", async (req, res) => {
  console.log("the user sent a delete request");

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;

  const routine_idString = req.params.id; // workoutID sent by React
  const routine_id = parseInt(routine_idString);
  const userID = req.session.userID.userID; // current userID

  console.log("our routineID is ", routine_id, " and our userID is ", userID);

  try {
    let result = await workout_trackerdb.deleteRoutine(routine_id);

    console.log(result);

    logger.info(
      `The user successfully deleted a routine. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );

    return res.status(201).json({
      msg: "Workout deleted!",
    });
  } catch (err) {
    logger.info(
      `The user failed to delete a routine. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

module.exports = router;
