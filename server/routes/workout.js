const express = require("express");
const login = require("./login");
const { workout_trackerdb } = require("../db");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", async (req, res) => {
  const userID = req.session.userID.userID; // current userID

  // try {
  //   let workouts = [];

  //   // Grab the workoutIDs for the user attempting to access this route
  //   let workoutIdResults = await workout_trackerdb.findWorkoutIdsByUserId(userID);
  //   let collectedWorkouts = workoutIdResults.results;

  //   // Create a conditional here, where if there are no results, return no results to frontend. else do the rest

  //   // Push the collected workouts into the workouts array we built
  //   for (let i = 0; i < collectedWorkouts.length; i++) {
  //     let currentWorkoutStringify = JSON.stringify(collectedWorkouts[i]);
  //     let currentWorkoutParsed = JSON.parse(currentWorkoutStringify);
  //     workouts.push(currentWorkoutParsed);
  //   }

  //   // Grab the routine names for all of the current workouts we have in our workouts array and add them to our workouts array along with empty objects to store our exercises in for that workout
  //   for (let i = 0; i < collectedWorkouts.length; i++) {
  //     let routine_id = collectedWorkouts[i].routine_id;
  //     let collectedRoutine_name = await workout_trackerdb.selectRoutineNameById(routine_id);
  //     let routine_name = collectedRoutine_name.results[0].routine_name;
  //     workouts[i].routine_name = routine_name;
  //     workouts[i].exercises = [];
  //   }

  //   // Loop through our current workouts array and add the exercise_name and exercise_id to the exercises object
  //   for (let i = 0; i < workouts.length; i++) {
  //     let routine_id = workouts[i].routine_id;
  //     let exerciseIDs = await workout_trackerdb.findExerciseIds(routine_id);
  //     let returnedExerciseIds = exerciseIDs.results;
  //     for (let j = 0; j < returnedExerciseIds.length; j++) {
  //       let exercise_id = returnedExerciseIds[j].exercise_id;
  //       let collectedExerciseName = await workout_trackerdb.findExerciseName(exercise_id);
  //       let exercise = collectedExerciseName.results[0].exercise_name;
  //       workouts[i].exercises.push({exercise_id: exercise_id, exercise_name: exercise, sets: null, weight: null, reps: null});
  //     }
  //     // console.log(workouts[i]);
  //   }

  //   for (let i = 0; i < workouts.length; i++) {
  //     let workout_id = workouts[i].id
  //     let exercises = workouts[i].exercises;
  //     for (let j = 0; j < exercises.length; j++) {
  //       let exercise_id = exercises[j].exercise_id;
  //       try {
  //       // Grab sets
  //       let retrievedSets = await workout_trackerdb.selectSets(workout_id, exercise_id);
  //       console.log('our retrievedSets is ', retrievedSets.result[0].sets);
  //       let sets = retrievedSets.result[0].sets;
  //       exercises[j].sets = sets;

  //       } catch(error) {
  //         console.log(error);
  //       }

  //       console.log(exercises[j]);

  //     }
  //     // console.log(workouts[i].exercises);
  //   }

  //   console.log('workouts is ... ', workouts);


  // } catch (err) {
  //   return res.status(500).json({
  //     ok: false,
  //     msg: "DB Error!",
  //   });
  // }
});

// If a user attempts to post to this endpoint
router.post("/", async (req, res) => {
  const body = req.body; // username and password sent by React
  const letCollectedUserID = req.session.userID;

  console.log("Req.session is ... ", req.session);

  // Save the userID
  const userID = letCollectedUserID.userID;

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

    // If all of the data was inserted correctly, return a 201
    return res.status(201).json({
      currentWorkoutID,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

module.exports = router;
