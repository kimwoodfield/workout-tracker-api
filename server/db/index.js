const mysql = require('mysql');
require('dotenv').config();

// Create pool - allows us to query pool instead of db directly
const pool = mysql.createPool({
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
        pool.query('SELECT * FROM `User`', (err, results) => {
            // If there's an error, reject this promise
            if (err) {
                return reject(err);
            }
            // Otherwise return our results
            return resolve(results);
        });
    });
};

// Function that checks whether the user exists




module.exports = workout_trackerdb;