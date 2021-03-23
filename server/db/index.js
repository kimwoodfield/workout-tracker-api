const mysql = require('mysql');
require('dotenv').config();

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
        db.query('SELECT * FROM `User`', (err, results) => {
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
        db.query('SELECT * FROM `User` WHERE email = ?', [email], (err, results) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            // Otherwise return our results
            return resolve({
                total: results.length,
                results
              });
        });
    });
};


// Function that inserts a new user into the database
workout_trackerdb.createUserInDB = (body) => {
    return new Promise((resolve, reject) => {
        const email = body.email;
        const fullname = body.fullname;
        const username = body.username;
        const password = body.password;
        const role = 'General';
        db.query("INSERT INTO User (email, full_name, username, password, role) VALUES (?, ?, ?, ?, ?)", [email, fullname, username, password, role], (err, result) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            // Otherwise return our results
            return resolve({
                total: result.length,
                result
              });
        });
    });
};


// Function that checks if a user exists with the USERNAME used
workout_trackerdb.findUserInBody = (body) => {
    return new Promise((resolve, reject) => {
        const username = body.username;
        db.query('SELECT * FROM `User` WHERE username = ?', [username], (err, results) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            // Otherwise return our results
            return resolve({
                total: results.length,
                results
              });
        });
    });
};


// Function that checks if a user exists with the PASSWORD used
workout_trackerdb.findPassInBody = (body) => {
    return new Promise((resolve, reject) => {
        const password = body.password;
        db.query('SELECT * FROM `User` WHERE password = ?', [password], (err, results) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            // Otherwise return our results
            return resolve({
                total: results.length,
                results
              });
        });
    });
};


// Function that checks whether the USER and PASSWORD entered matches what's in the DB
workout_trackerdb.loginDetailsMatch = (body) => {
    return new Promise((resolve, reject) => {
        const username = body.username;
        const password = body.password;
        db.query("SELECT `username` and `password` FROM `user` WHERE `username` = ? and `password` = ?", [username, password], (err, result) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            console.log(result);
            // Otherwise return our results
            return resolve({
                result
              });
        });
    });
};


// Function that finds the User Id of the person logging in
workout_trackerdb.findUserID = (body) => {
    return new Promise((resolve, reject) => {
        const username = body.username;
        const password = body.password;
        let userID;
        db.query("SELECT `id` FROM `user` WHERE `username` = ? and `password` = ?", [username, password], (err, result) => {
            // If there's an error, reject this promise
            if (err) {
                console.log('failed in check user function')
                return reject(err);
            }
            // Otherwise update the userID variable we created with the id of the user that logged in
            // console.log(result[0].id);
            userID = result[0].id;
            // Then return the userID with the new id
            return resolve({
                userID
              });
        });
    });
};


workout_trackerdb.insertRoutineAndExercises = (body, userID) => {
    return new Promise((resolve, reject) => {

        // Check to see if the posted data made it into the database function
        console.log('The body made it inside the query function...', body);
        console.log('The userID made it inside the query function...', userID);

        // Assign the posted form data to variables
        const routine_name = body.routine_name;
        console.log('routine name is now...', routine_name);

        // Save all of the exercises
        let exercises = [
            [body.firstExerciseName, body.firstExerciseType],
            [body.secondExerciseName, body.secondExerciseType],
            [body.thirdExerciseName, body.thirdExerciseType],
            [body.fourthExerciseName, body.fourthExerciseType],
            [body.fifthExerciseName, body.fifthExerciseType]
        ];
        console.log('exercises are...', exercises);

        // Creates variable to store the RoutineID and ExerciseIDs into
        let routineID;
        let exerciseIDs = [];

        // Connect to the database
        db.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {
                    console.log('Hit first error');
                    throw err;
                } else {
                    // INSERTS THE ROUTINE NAME INTO THE ROUTINE TABLE
                    db.query("INSERT INTO Routine (routine_name) VALUES (?)", [routine_name], (err, rows) => {
                        console.log('Made it into the first query');
                        if (err) {
                            console.log('Hit second error');
                            return connection.rollback(function() {
                                connection.release();
                                throw err;
                            });
                        } else {
                            console.log('Successfully inserted into the Routine table');
                        }
                        routineID = rows.insertId;
                        console.log('routineID before we close the query is... ', routineID);
                    }) // Brackets for first query
                    // END OF FIRST QUERY

                    // START OF SECOND QUERY
                    for (let i = 0; i < exercises.length; i++) {
                        let currentExercise = exercises[i];
                        db.query("INSERT INTO Exercise (exercise_name, exercise_type) VALUES (?)", [currentExercise], (err, rows) => {
                            console.log('Made it into the second query');
                            console.log('We are currently at the ', i, ' iteration');
                            if (err) {
                                console.log('Hit third error');
                                return connection.rollback(function() {
                                    connection.release();
                                    throw err;
                                });
                            } else {
                                console.log('Successfully inserted into the Exercise table on the ', i, ' iteration');
                            }
                            exerciseIDs.push(rows.insertId);
                        })
                    } // End of loop
                    console.log('Our routineID is...', routineID);
                    console.log('Our exerciseIDs are...', exerciseIDs);
                }
            })
        })
    })
}


module.exports = {
    getConnection: (callback) => {
        return db.getConnection(callback);
    },
    workout_trackerdb
}


