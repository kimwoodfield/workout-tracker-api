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
            // Otherwise return our results
            return resolve({
                result
              });
        });
    });
};



module.exports = {
    getConnection: (callback) => {
        return db.getConnection(callback);
    },
    workout_trackerdb
}


