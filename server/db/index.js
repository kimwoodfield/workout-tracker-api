const mysql = require('mysql');

// Create pool - allows us to query pool instead of db directly
const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'password1',
    user: 'Kim',
    database: 'workout_tracker',
    host: 'localhost',
    port: '8889'
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

module.exports = workout_trackerdb;