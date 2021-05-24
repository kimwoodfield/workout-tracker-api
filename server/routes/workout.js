const express = require("express");
const login = require("./login");
const { workout_trackerdb } = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", async (req, res) => {
  // Store IP from Req obj and UserType for logging

  let ip = req.ip;
  let userType = req.session.userType.userRole;

  // Store the current user's id
  const user_id = req.session.userID.userID; // current userID

  if (user_id == undefined) {
    logger.info(
      `Validation was unsuccessful. Attempted access from an unauthorized user located at IP address: ${ip}`
    );
    return res.status(401).json({
      ok: false,
      msg: "Forbidden!",
    });
  }

  try {
    let workouts = [];

    // Grab all of the workouts for the user
    const userWorkoutsRaw = await workout_trackerdb.grabUserWorkouts(user_id);
    const userWorkoutsRawArr = userWorkoutsRaw.result;
    for (let items of userWorkoutsRawArr) {
      workouts.push(items);
    }

    // Grab the workout data for each workout
    for (let i = 0; i < workouts.length; i++) {
      let workout_id = workouts[i].workout_id;
      const workoutInfoRaw = await workout_trackerdb.grabUserWorkoutExercises(
        workout_id
      );
      const workoutInfo = workoutInfoRaw.result;
      workouts[i].exercises = workoutInfo;
      console.log(workouts[i]);
    }

    logger.info(
      `Successfully retrieved the workouts for the current user. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );

    return res.status(201).json({
      workouts,
    });
  } catch (err) {
    console.log(err);
    logger.info(
      `Could not retrieve the workouts for the current user. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

// If a user attempts to post to this endpoint
router.post("/", async (req, res) => {
  const body = req.body; // username and password sent by React
  const letCollectedUserID = req.session.userID;

  console.log("Req.session is ... ", req.session);

  // Save the userID
  const userID = letCollectedUserID.userID;

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;

  // Save the time
  let currentDate = new Date().toLocaleString();
  console.log(currentDate);

  try {
    // Save the routine_name
    const routine_name = body.routine_name;

    // Grab the routineID attached to the routine_name
    const findRoutineIdByName_result = await workout_trackerdb.findRoutineIdByName(
      routine_name
    );
    const routineID = findRoutineIdByName_result.results[0].id;

    // Working. So far so good. We have the routineID and the userID.

    // Insert the workout_date, the routine_id and the user_id as a new row in the Workout table.
    const addWorkout_result = await workout_trackerdb.addWorkout(
      routineID,
      userID
    ); // Working.
    const currentWorkoutID = addWorkout_result.lastInsertedId;

    logger.info(
      `The user successfully created a new workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );

    // If all of the data was inserted correctly, return a 201
    return res.status(201).json({
      currentWorkoutID,
    });
  } catch (err) {
    logger.info(
      `The user failed to create a new workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
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

  const workout_idString = req.params.id; // workoutID sent by React
  const workout_id = parseInt(workout_idString);
  const userID = req.session.userID.userID; // current userID

  console.log("our workoutID is ", workout_id, " and our userID is ", userID);

  try {
    let result = await workout_trackerdb.deleteWorkout(workout_id, userID);

    console.log(result);

    logger.info(
      `The user successfully deleted a workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );

    return res.status(201).json({
      msg: "Workout deleted!",
    });
  } catch (err) {
    logger.info(
      `The user failed to delete a workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

module.exports = router;
