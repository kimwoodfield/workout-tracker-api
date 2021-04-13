const express = require("express");
const { workout_trackerdb } = require("../db");

// Creates new instance of router
const router = express.Router();

// Dynamic POST route
router.post("/:id", async (req, res) => {
  console.log("Made it inside post route");

  const workout_idString = req.params.id; // workoutID sent by React
  const workout_id = parseInt(workout_idString);
  const body = req.body; // username and password sent by React
  const userID = req.session.userID; // current userID

  try {
    // Grab the routine_id attached to this workout_id
    let retrievedRoutineId = await workout_trackerdb.findRoutineIdByWorkoutId(
      workout_id
    );
    const routine_id = retrievedRoutineId.results[0].routine_id;
    console.log("we got the routine id ", routine_id);

    // Grab all of the exercise_id that relate to that routine_id and organize them
    let retrievedExerciseId = await workout_trackerdb.findExerciseIdUsingRoutineId(
      routine_id
    );
    let retrievedExerciseIdResults = retrievedExerciseId.results;
    console.log("we got the exerciseIds ", retrievedExerciseId);

    let exerciseIdArray = [];
    for (let items of retrievedExerciseIdResults) {
      exerciseIdArray.push(items.exercise_id);
    }
    console.log("Our exerciseIdArray is now ... ", exerciseIdArray); // our exerciseID arrayx

    // Organize the workout data send in by body
    const mapped = Object.entries(body).reduce((acc, [k, v]) => {
      const key = k.split("_")[0];

      acc[key] = {
        ...acc[key],
        [k]: v,
      };

      return acc;
    }, {});
    console.log("our body data has been organized ... ", mapped);

    let workout = [
      [
        workout_id,
        exerciseIdArray[0],
        parseInt(mapped[0]["0_sets"]),
        parseInt(mapped[0]["0_weight"]),
        parseInt(mapped[0]["0_reps"]),
      ],
      [
        workout_id,
        exerciseIdArray[1],
        parseInt(mapped[1]["1_sets"]),
        parseInt(mapped[1]["1_weight"]),
        parseInt(mapped[1]["1_reps"]),
      ],
      [
        workout_id,
        exerciseIdArray[2],
        parseInt(mapped[2]["2_sets"]),
        parseInt(mapped[2]["2_weight"]),
        parseInt(mapped[2]["2_reps"]),
      ],
      [
        workout_id,
        exerciseIdArray[3],
        parseInt(mapped[3]["3_sets"]),
        parseInt(mapped[3]["3_weight"]),
        parseInt(mapped[3]["3_reps"]),
      ],
      [
        workout_id,
        exerciseIdArray[4],
        parseInt(mapped[4]["4_sets"]),
        parseInt(mapped[4]["4_weight"]),
        parseInt(mapped[4]["4_reps"]),
      ],
    ];
    console.log("Weve organized our exercises to look like ... ", workout);

    // Loop through the exercises array and insert a row into WorkoutExercises each time
    let lastInsertedId = null;
    for (let i = 0; i < workout.length; i++) {
      console.log("We are inside workout loop at ", i, " index");
      let currentExercise = workout[i];
      console.log("the currentExercise is ... ", currentExercise);
      let result = await workout_trackerdb.insertWorkoutExercises(
        currentExercise
      );
      console.log(result);
      console.log(
        "We inserted ",
        workout[i],
        " into the workoutExercise table"
      );
      lastInsertedId = result.insertedID;
    }
    console.log("the last insertedID was ... ", lastInsertedId);

    if (lastInsertedId > 0) {
      return res.status(201).json({
        ok: true,
        msg: "Login successful!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

// Dynamic GET route
router.get("/:id", async (req, res) => {
  // console.log('the unqiue incoming url hit req params ', req.params);
  const workout_id = req.params.id; // our workout_id

  try {
    let currentWorkout = {
      workoutID: workout_id,
      routineID: null,
      RoutineName: null,
      RoutineExercises: [],
    };

    // Grab the routine_id that matches the workout_id from the workout table
    const routineIdResults = await workout_trackerdb.findRoutineIdFromWorkouts(
      workout_id
    );
    const routine_id = routineIdResults.results[0].routine_id;
    currentWorkout.routineID = routine_id;

    // Grab the routine name that matches with routine_id
    const routineNameResults = await workout_trackerdb.findRoutineName(
      routine_id
    );
    const routine_name = routineNameResults.results[0].routine_name;
    currentWorkout.RoutineName = routine_name;

    // Query the RoutineExercise table - select all exercise_id where the routine_id is equal to the one we just grabbed.
    const exerciseIdResults = await workout_trackerdb.findExerciseIdUsingRoutineId(
      routine_id
    );
    const exerciseIdObjArr = exerciseIdResults.results;
    let exerciseIDs = [];
    for (let id of exerciseIdObjArr) {
      exerciseIDs.push(id.exercise_id);
    }

    // Loop through the exerciseIDs array and query the Exercise table for each value. Grab the exercise_name that corresponds to that exerciseID and store it in the exerciseNameResults array.
    let exerciseNameResults = [];
    for (let id of exerciseIDs) {
      const currentExercise = await workout_trackerdb.findExerciseName(id);
      exerciseNameResults.push(currentExercise);
    }
    let exerciseNames = [];
    for (let items of exerciseNameResults) {
      exerciseNames.push(items.results[0].exercise_name);
    }
    currentWorkout.RoutineExercises = exerciseNames;

    // console.log('We did our exerciseName loop and our collection is ... ', exerciseNameResults);

    return res.status(201).json({
      currentWorkout,
    });
  } catch (err) {
    // do this
    // console.log('Error', err);
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

// Default GET route
router.get("/", (req, res) => {
  console.log("This is the standard GET endpoint");
  console.log("the incoming url has a querystring of ", req.query);
  console.log("the incoming url has a querystring of ", req.params);
});

module.exports = router;
