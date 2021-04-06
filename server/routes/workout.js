const express = require('express');
const login = require('./login');
const { workout_trackerdb } = require("../db");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", (req ,res) => {

    console.log(req.session.userID);
    if (!req.session.userID) {
        console.log('user doesnt have access');
        return res.status(403).json({
            status: 403,
            msg: 'Forbidden.'
        });
    }
    else {
        console.log('user has access');
        return res.status(200).json({
            status: 200,
            msg: 'User allowed'
        });
    }

});


// If a user attempts to post to this endpoint
router.post("/", async (req ,res) => {

    const body = req.body; // username and password sent by React
    const letCollectedUserID = req.session.userID;

    console.log('Req.session is ... ', req.session);

    // Save the userID
    const userID = letCollectedUserID.userID

    // Save the time
    let currentDate = new Date().toLocaleString();
    console.log(currentDate);

    try {

        // Save the routine_name
        const routine_name = body.routine_name;

        // Grab the routineID attached to the routine_name
        const findRoutineIdByName_result = await workout_trackerdb.findRoutineIdByName(routine_name);
        const routineID = findRoutineIdByName_result.results[0].id;

        // Working. So far so good. We have the routineID and the userID.

        // Insert the workout_date, the routine_id and the user_id as a new row in the Workout table.



    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
        }); 
}

});
 
module.exports = router;