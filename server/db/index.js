const mysql = require("mysql");
const logger = require("../../logger/logger");
require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// The database was instansiated in its own file called ‘index.js’ inside a folder within the API repository called ‘db’. This seemed like the most appropriate place for me to put it as I had no intention of mixing my database queries in with my top level app file. This was largely due to placing an emphasis on separation of concerns.

// Create connection pool to query db
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let workout_trackerdb = {};

let pass;

// Function that returns all users in the database
workout_trackerdb.all = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM `User`", (err, results) => {
      // If there's an error, reject this promise
      if (err) {
        logger.error(
          `An error occured in the workout_trackerdb.all function. Error was: ${err}`
        );
        return reject(err);
      }
      // Otherwise return our results
      return resolve(results);
    });
  });
};

workout_trackerdb.allUsers = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, full_name, username, role FROM `User`",
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.all function. Error was: ${err}`
          );
          return reject(err);
        }
        // Otherwise return our results
        return resolve(results);
      }
    );
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
          logger.error(
            `An error occured in the workout_trackerdb.findEmailInBody function. Error was: ${err}`
          );
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
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        pass = hash;
        db.query(
          "INSERT INTO User (email, full_name, username, password, role) VALUES (?, ?, ?, ?, ?)",
          [email, fullname, username, pass, role],
          (err, result) => {
            // If there's an error, reject this promise
            if (err) {
              logger.error(
                `An error occured in the workout_trackerdb.createUserInDB function. Error was: ${err}`
              );
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
    });
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
          logger.error(
            `An error occured in the workout_trackerdb.findUserInBody function. Error was: ${err}`
          );
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

// Function that deletes a user via their username
workout_trackerdb.deleteUser = (username) => {
  return new Promise((resolve, reject) => {
    console.log(username);
    db.query(
      "DELETE FROM `User` WHERE username = ?",
      [username],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.findUserInBody function. Error was: ${err}`
          );
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

// Check user role
workout_trackerdb.checkRole = (username) => {
  return new Promise((resolve, reject) => {
    console.log(username);
    db.query(
      "SELECT `role` FROM `User` WHERE username = ?",
      [username],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.checkRole function. Error was: ${err}`
          );
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

// Promote a user
workout_trackerdb.promoteUser = (username) => {
  return new Promise((resolve, reject) => {
    console.log(username);
    db.query(
      "UPDATE `User` SET `role`='Admin' WHERE `username` = ?",
      [username],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.promoteUser function. Error was: ${err}`
          );
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

// Demote a user
workout_trackerdb.demoteUser = (username) => {
  return new Promise((resolve, reject) => {
    console.log(username);
    db.query(
      "UPDATE `User` SET `role`='General' WHERE `username` = ?",
      [username],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.demoteUser function. Error was: ${err}`
          );
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
workout_trackerdb.findPassInBody = (body, retrievedPass) => {
  return new Promise((resolve, reject) => {
    let password = body.password;
    let passwordsMatch = bcrypt.compareSync(password, retrievedPass);
    if (passwordsMatch === false) {
      console.log("Passwords do not match.");
    } else {
      password = retrievedPass;
    }
    db.query(
      "SELECT * FROM `User` WHERE password = ?",
      [password],
      (err, results) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.findPassInBody function. Error was: ${err}`
          );
          console.log("failed in check user function", err);
          return reject(err);
        }
        // Otherwise return our results
        console.log("made it through this function");
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
      "SELECT `username` and `password` FROM `User` WHERE `username` = ? and `password` = ?",
      [username, password],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.loginDetailsMatch function. Error was: ${err}`
          );
          console.log("failed in check user function");
          return reject(err);
        }
        console.log(result);
        console.log("we were successful in matching the loginDetails");
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
    let userID;
    db.query(
      "SELECT `id` FROM `User` WHERE `username` = ?",
      [username],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.findUserID function. Error was: ${err}`
          );
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise update the userID variable we created with the id of the user that logged in
        // console.log(result[0].id);
        console.log("we succeeded in findUserId");
        console.log("the result from this query was ", result[0].id);
        userID = result[0].id;
        // Then return the userID with the new id
        return resolve({
          userID,
        });
      }
    );
  });
};

// Function that finds the User Role of the person logging in
workout_trackerdb.findUserRole = (body) => {
  return new Promise((resolve, reject) => {
    const username = body.username;
    let userRole;
    db.query(
      "SELECT `role` FROM `User` WHERE `username` = ?",
      [username],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.findUserRole function. Error was: ${err}`
          );
          console.log("failed in check user function");
          return reject(err);
        }
        // Otherwise update the userID variable we created with the id of the user that logged in
        userRole = result[0].role;
        // Then return the userID with the new id
        return resolve({
          userRole,
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
      "SELECT `id`, `exercise_name`, `exercise_type` FROM `Exercise`",
      [],
      (err, results) => {
        console.log("Made it inside the showAllExercises query");
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.showAllExercises function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.doesExerciseExist function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.insertExercise function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.retrieveExerciseId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.insertRoutineName function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.retrieveRoutineId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.retrieveRoutineId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findRoutineIdByName function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.insertIntoRoutineExercise function. Error was: ${err}`
          );
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
        logger.error(
          `An error occured in the workout_trackerdb.showAllRoutines function. Error was: ${err}`
        );
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
      "SELECT Routine.routine_name, Exercise.exercise_name FROM Routine JOIN RoutineExercise ON (Routine.id=RoutineExercise.routine_id) JOIN Exercise ON (Exercise.id=RoutineExercise.exercise_id) GROUP BY [Routine.id]",
      [],
      (err, results) => {
        console.log("Made it inside the grabRoutineExerciseName query");
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.grabRoutineExerciseName function. Error was: ${err}`
          );
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
        logger.error(
          `An error occured in the workout_trackerdb.selectAllRoutineId function. Error was: ${err}`
        );
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
          logger.error(
            `An error occured in the workout_trackerdb.findRoutineName function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findExerciseIds function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findExerciseName function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.addWorkout function. Error was: ${error}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findRoutineIdFromWorkouts function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findRoutineNameFromRoutineId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findExerciseIdUsingRoutineId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.findRoutineIdByWorkoutId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.insertWorkoutExercises function. Error was: ${error}`
          );
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
          insertedID,
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
          logger.error(
            `An error occured in the workout_trackerdb.findWorkoutIdsByUserId function. Error was: ${err}`
          );
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
          logger.error(
            `An error occured in the workout_trackerdb.selectRoutineNameById function. Error was: ${err}`
          );
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
      "SELECT Workout.id AS workout_id, Workout.workout_date, Workout.routine_id, Routine.routine_name FROM Workout INNER JOIN Routine ON Workout.routine_id = Routine.id WHERE Workout.user_id = ?",
      [user_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.grabUserWorkouts function. Error was: ${err}`
          );
          console.log("failed in grabUserWorkouts function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

// Select all of the details of each exercise belonging to the users workout
workout_trackerdb.grabUserWorkoutExercises = (workout_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT Workout.id AS workout_id, WorkoutExercise.id AS exercise_id, Exercise.exercise_name, WorkoutExercise.weight, WorkoutExercise.reps, WorkoutExercise.sets FROM ((Workout INNER JOIN WorkoutExercise ON Workout.id = WorkoutExercise.workout_id) INNER JOIN Exercise ON WorkoutExercise.exercise_id = Exercise.id) WHERE Workout.id = ?",
      [workout_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.grabUserWorkoutExercises function. Error was: ${err}`
          );
          console.log("failed in grabUserWorkoutExercises function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

// Delete workout where user_id and workout_id are provided
workout_trackerdb.deleteWorkout = (workout_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM `Workout` WHERE id = ? AND user_id = ?",
      [workout_id, user_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.deleteWorkout function. Error was: ${err}`
          );
          console.log("failed in deleteWorkout function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

// Delete routine where routine_id are provided
workout_trackerdb.deleteRoutine = (routine_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM `Routine` WHERE id = ?",
      [routine_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.deleteWorkout function. Error was: ${err}`
          );
          console.log("failed in deleteWorkout function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result,
        });
      }
    );
  });
};

// Delete exercise where exercise_id are provided
workout_trackerdb.deleteExercise = (exercise_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM `Exercise` WHERE id = ?",
      [exercise_id],
      (err, result) => {
        // If there's an error, reject this promise
        if (err) {
          logger.error(
            `An error occured in the workout_trackerdb.deleteExercise function. Error was: ${err}`
          );
          console.log("failed in deleteExercise function", err);
          return reject(err);
        }
        // Otherwise return our results
        return resolve({
          result,
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
