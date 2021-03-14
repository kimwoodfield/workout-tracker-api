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

// Function that checks if a user exists
workout_trackerdb.findEmailInBody = ({email}) => {
    return new Promise((resolve, reject) => {
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

module.exports = {
    getConnection: (callback) => {
        return db.getConnection(callback);
    },
    workout_trackerdb
}


