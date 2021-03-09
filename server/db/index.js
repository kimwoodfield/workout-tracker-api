const mysql = require('mysql');

// Create pool - allows us to query pool instead of db directly
mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'workout_tracker',
    host: 'localhost',
    port: '8889'
});

// Create an object for the database
let workout_tracker_db = {};