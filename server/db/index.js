const mysql = require("mysql");
require("dotenv").config();

// Create connection pool to query db
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let workout_trackerdb = {};

// Function that returns all users in the database
workout_trackerdb.all = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM `User`", (err, results) => {
      // If there's an error, reject this promise
      if (err) {
        return reject(err);
      }
      // Otherwise return our results
      return resolve(results);
    });
  });
};

// Function that checks if a user exists with the email used
workout_trackerdb.findEmailInBody = (body) => {
  return new Promise((resolve, reject) => {
    const email = body.email;
    db.query(
      "SELECT * FROM `User` WHERE email = ?",
      [email],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          total: results.length,
          results,
        });
      }
    );
  });
};

// Function that inserts a new user into the database
workout_trackerdb.createUserInDB = (body) => {
  return new Promise((resolve, reject) => {
    const email = body.email;
    const fullname = body.fullname;
    const username = body.username;
    const password = body.password;
    const role = "General";
    db.query(
      "INSERT INTO User (email, full_name, username, password, role) VALUES (?, ?, ?, ?, ?)",
      [email, fullname, username, password, role],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          total: result.length,
          result,
        });
      }
    );
  });
};

// Function that checks if a user exists with the USERNAME used
workout_trackerdb.findUserInBody = (body) => {
  return new Promise((resolve, reject) => {
    const username = body.username;
    db.query(
      "SELECT * FROM `User` WHERE username = ?",
      [username],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log(err);
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          total: results.length,
          results,
        });
      }
    );
  });
};

// Function that checks if a user exists with the PASSWORD used
workout_trackerdb.findPassInBody = (body) => {
  return new Promise((resolve, reject) => {
    const password = body.password;
    db.query(
      "SELECT * FROM `User` WHERE password = ?",
      [password],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          total: results.length,
          results,
        });
      }
    );
  });
};

// Function that checks whether the USER and PASSWORD entered matches what's in the DB
workout_trackerdb.loginDetailsMatch = (body) => {
  return new Promise((resolve, reject) => {
    const username = body.username;
    const password = body.password;
    db.query(
      "SELECT `username` and `password` FROM `user` WHERE `username` = ? and `password` = ?",
      [username, password],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          return reject(err);
        }
        console.log(result);
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

// Function that finds the User Id of the person logging in
workout_trackerdb.findUserID = (body) => {
  return new Promise((resolve, reject) => {
    const username = body.username;
    const password = body.password;
    let userID;
    db.query(
      "SELECT `id` FROM `user` WHERE `username` = ? and `password` = ?",
      [username, password],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise update the userID variable we created with the id of the user that logged in
        // console.log(result[0].id);
        userID = result[0].id;
        // Then return the userID with the new id
        return resolve({
          userID,
        });
      }
    );
  });
};

// Selects all of the exercises currently in the databases
workout_trackerdb.showAllExercises = (body) => {
  return new Promise((resolve, reject) => {
    console.log("Made it inside the showAllExercises db func");
    db.query(
      "SELECT `exercise_name`, `exercise_type` FROM `Exercise`",
      [],
      (err, results) => {
        console.log("Made it inside the showAllExercises query");
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in check user function");
          console.log(err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Checks to see if an exercise exists
workout_trackerdb.doesExerciseExist = (body) => {
  return new Promise((resolve, reject) => {
    const exercise = body.exercise_name;
    db.query(
      "SELECT * FROM `Exercise` WHERE exercise_name = ?",
      [exercise],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in doesExerciseExist query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          total: results.length,
          results,
        });
      }
    );
  });
};

/*------------------------------------*\
    INSERT EXERCISE
\*------------------------------------*/
workout_trackerdb.insertExercise = (body) => {
  return new Promise((resolve, reject) => {
    console.log(body);

    // Save the exercise name and type into a variable
    const exercise = [[body.exercise_name, body.exercise_type]];

    db.query(
      "INSERT INTO Exercise (exercise_name, exercise_type) VALUES ?",
      [exercise],
      (error, result) => {
        // If there's an error, reject this promise
        if (error) {
          console.log("failed in insert exercise db query");
          return reject(error);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

/*------------------------------------*\
    SELECT EXERCISE ID FROM EXERCISE
\*------------------------------------*/
workout_trackerdb.retrieveExerciseId = (currentExercise) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM `Exercise` WHERE exercise_name = (?)",
      [currentExercise],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*------------------------------------*\
    INSERT ROUTINE NAME
\*------------------------------------*/
workout_trackerdb.insertRoutineName = (body) => {
  return new Promise((resolve, reject) => {
    console.log(body);

    // Save the exercise name and type into a variable
    const routine = body.routine_name;
    console.log("routine name is...", routine);

    db.query(
      "INSERT INTO Routine (routine_name) VALUES (?)",
      [routine],
      (error, result) => {
        // If there's an error, reject this promise
        if (error) {
          console.log("failed in insertRoutineName db query");
          return reject(error);
        }
        // Otherwise return our results
        return resolve({
          routine,
        });
      }
    );
  });
};

/*-------------------------------------------*\
    SELECT SPECIFIC ROUTINE ID FROM ROUTINE
\*-------------------------------------------*/
workout_trackerdb.retrieveRoutineId = (routineName) => {
  return new Promise((resolve, reject) => {
    let routine = routineName.routine;
    db.query(
      "SELECT id FROM `Routine` WHERE routine_name = (?)",
      [routine],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*-------------------------------------------*\
    SELECT SPECIFIC ROUTINE ID FROM ROUTINE
\*-------------------------------------------*/
workout_trackerdb.retrieveRoutineId = (routineName) => {
  return new Promise((resolve, reject) => {
    let routine = routineName.routine;
    db.query(
      "SELECT id FROM `Routine` WHERE routine_name = (?)",
      [routine],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*------------------------------------------*\
    GRAB THE ROUTINE ID OF A ROUTINE NAME
\*------------------------------------------*/
workout_trackerdb.findRoutineIdByName = (routine_name) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM `Routine` WHERE routine_name = (?)",
      [routine_name],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveAllRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*--------------------------------------------------------*\
    INSERT ROUTINE & EXERCISE INTO ROUTINEEXERCISE TABLE
\*--------------------------------------------------------*/
workout_trackerdb.insertIntoRoutineExercise = (
  routineIDarr,
  currentExercise
) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO `RoutineExercise` (routine_id, exercise_id) VALUES (?, ?)",
      [routineIDarr, currentExercise],
      (error, result) => {
        // If there's an error, reject this promise
        if (error) {
          console.log("failed in insertIntoRoutineExercise db query");
          return reject(error);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

/*------------------------------------*\
    DISPLAY ALL ROUTINES IN ROUTINE
\*------------------------------------*/
workout_trackerdb.showAllRoutines = (body) => {
  return new Promise((resolve, reject) => {
    console.log("Made it inside the showAllRoutines db func");
    db.query("SELECT `routine_name` FROM `Routine`", [], (err, results) => {
      console.log("Made it inside the showAllRoutines query");
      // If there's an error, reject this promise
      if (err) {
        console.log("failed in showAllRoutines function");
        return reject(err);
      }
      // Otherwise return our results
      return resolve({
        results,
      });
    });
  });
};

/*---------------------------------------------------------*\
    DISPLAY ALL ROUTINES & EXERCISES FROM ROUTINEEXERCISE
\*---------------------------------------------------------*/
workout_trackerdb.grabRoutineExerciseName = (body) => {
  return new Promise((resolve, reject) => {
    console.log("Made it inside the grabRoutineExerciseName db func");
    db.query(
      "SELECT routine.routine_name, exercise.exercise_name FROM routine JOIN RoutineExercise ON (routine.id=RoutineExercise.routine_id) JOIN exercise ON (exercise.id=RoutineExercise.exercise_id) GROUP BY [routine.id]",
      [],
      (err, results) => {
        console.log("Made it inside the grabRoutineExerciseName query");
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in grabRoutineExerciseName function");
          console.log(err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*-------------------------------------------------------------------------*\
                         Queries for Routines page
\*-------------------------------------------------------------------------*/

/*--------------------------------------*\
    Select all routine_id from routine
\*--------------------------------------*/
workout_trackerdb.selectAllRoutineId = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM Routine", [], (err, results) => {
      // If there's an error, reject this promise
      if (err) {
        console.log("failed in selectAllRoutineId query");
        return reject(err);
      }
      // Otherwise return our results
      return resolve({
        results,
      });
    });
  });
};

/*------------------------------------------------------------------------*\
    Select routine_name from routine where routine_id matches
\*------------------------------------------------------------------------*/
workout_trackerdb.findRoutineName = (currentRoutineId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT routine_name FROM Routine WHERE id = (?)",
      [currentRoutineId],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveAllRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*------------------------------------------------------------------------*\
    Select exerciseIds associated to specific RoutineId
\*------------------------------------------------------------------------*/
workout_trackerdb.findExerciseIds = (currentRoutineId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT exercise_id FROM RoutineExercise WHERE routine_id = (?)",
      [currentRoutineId],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in retrieveAllRoutineId query");
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*------------------------------------------------------------------------*\
    Select exercise_name associated to specific exercise_id
\*------------------------------------------------------------------------*/
workout_trackerdb.findExerciseName = (currentId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT exercise_name FROM `Exercise` WHERE id = (?)",
      [currentId],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findExerciseName query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

/*-------------------------------------------------------------------------*\
                         Queries for AddWorkout page
\*-------------------------------------------------------------------------*/

// Insert new row into Workout table
workout_trackerdb.addWorkout = (routineID, userID) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO `Workout` (workout_date, routine_id, user_id) VALUES (NOW(), ?, ?)",
      [routineID, userID],
      (error, result) => {
        // If there's an error, reject this promise
        if (error) {
          console.log("failed in addWorkout db query because ", error);
          return reject(error);
        }
        const lastInsertedId = result.insertId;
        // Otherwise return our results
        return resolve({
          result,
          lastInsertedId,
        });
      }
    );
  });
};

// Use the workout_id to find the routine_id attached to that workout
workout_trackerdb.findRoutineIdFromWorkouts = (workout_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT routine_id FROM `Workout` WHERE id = (?)",
      [workout_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findRoutineIdFromWorkouts query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Select the routine name that matches with routine_id
workout_trackerdb.findRoutineNameFromRoutineId = (workout_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT routine_id FROM `Workout` WHERE id = (?)",
      [workout_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findRoutineIdFromWorkouts query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Select all exercise_id's that match this routine_id
workout_trackerdb.findExerciseIdUsingRoutineId = (routine_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT exercise_id FROM `RoutineExercise` WHERE routine_id = (?)",
      [routine_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findExerciseIdUsingRoutineId query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Select routine_id attached to workout_id
workout_trackerdb.findRoutineIdByWorkoutId = (workout_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT routine_id FROM `Workout` WHERE id = (?)",
      [workout_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findRoutineIdFromWorkouts query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Insert workoutExercises into WorkoutExercises
// Insert new row into Workout table
workout_trackerdb.insertWorkoutExercises = (currentExercise) => {
  return new Promise((resolve, reject) => {
    let thisWorked = null;
    let insertedID = null;
    db.query(
      "INSERT INTO `WorkoutExercise` (workout_id, exercise_id, sets, weight, reps) VALUES (?)",
      [currentExercise],
      (error, result) => {
        // If there's an error, reject this promise
        if (error) {
          console.log(
            "failed in insertWorkoutExercises db query because ",
            error
          );
          thisWorked = false;
          return reject(error, thisWorked);
        } else {
          thisWorked = true;
          insertedID = result.insertId;
        }
        // Otherwise return our results
        return resolve({
          result,
          thisWorked, 
          insertedID
        });
      }
    );
  });
};


/*-------------------------------------------------------------------------*\
                         Queries for Log page
\*-------------------------------------------------------------------------*/

// Select all workout_ids belonging to the user logged in
workout_trackerdb.findWorkoutIdsByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, workout_date, routine_id FROM `Workout` WHERE user_id = (user_id)",
      [user_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findWorkoutIdsByUserId query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Select routine_name using routine_id
workout_trackerdb.selectRoutineNameById = (routine_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT routine_name FROM `Routine` WHERE id = (?)",
      [routine_id],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in findExerciseIdUsingRoutineId query", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          results,
        });
      }
    );
  });
};

// Select all sets where workout_id = workout.id and exercise_id = currentExerciseID
workout_trackerdb.grabUserWorkouts = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT workout.id AS workout_id, workout.workout_date, workout.routine_id, routine.routine_name FROM workout INNER JOIN routine ON workout.routine_id = routine.id WHERE workout.user_id = ?",
      [user_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in grabUserWorkouts function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result
        });
      }
    );
  });
};

// Select all of the details of each exercise belonging to the users workout
workout_trackerdb.grabUserWorkoutExercises = (workout_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT workout.id AS workout_id, workoutexercise.id AS exercise_id, exercise.exercise_name, workoutexercise.weight, workoutexercise.reps, workoutexercise.sets FROM ((workout INNER JOIN workoutexercise ON workout.id = workoutexercise.workout_id) INNER JOIN exercise ON workoutexercise.exercise_id = exercise.id) WHERE workout.id = ?",
      [workout_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          console.log("failed in grabUserWorkoutExercises function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result
        });
      }
    );
  });
};





module.exports = {
  getConnection: (callback) => {
    return db.getConnection(callback);
  },
  workout_trackerdb,
};
