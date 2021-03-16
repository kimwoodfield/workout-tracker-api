const express = require('express');
const db = require('../db');
const {workout_trackerdb, getConnection} = require("../db");
const { body, validationResult } = require('express-validator');

const router = express.Router();


// Handles GET requests made to /login
router.get("/", (req, res) => {
    res.send(`Check if users login info exists`); 
});


// Handles POST requests made to /login
router.post("/", body('username').not().isEmpty(), body('password').not().isEmpty(), async (req, res) => {
    const body = req.body; // username and password sent by React

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    } 

    // Username check
    if (body.username === '') {
        return res.status(401).json({
            status: 401,
            ok: false,
            issue: 'Username',
            msg: 'You must enter a username.'
        });
    } else if (body.username.length < 5) {
        return res.status(401).json({
            status: 401,
            ok: false,
            issue: 'Username',
            msg: 'Username needs to be 5 or more characters.'
        });
    }

    // Password check
    if (body.password === '') {
        return res.status(401).json({
            status: 401,
            ok: false,
            issue: 'Password',
            msg: 'You must enter a password.'
        });
    } else if (body.password.length < 4) {
        return res.status(401).json({
            status: 401,
            ok: false,
            issue: 'Password',
            msg: 'Password needs to be 4 or more characters.'
        });
    }

    // Make sure inputs are not empty when they are sent

    try {

        const userFound = await workout_trackerdb.findUserInBody(body);

        if (!userFound.total) {
            // Will run if users.total is less than 0, which means nothing was found in the DB
            return res.status(401).json({
                status: 401,
                ok: false,
                issue: 'doesnt exist',
                msg: `Sorry - this user doesn't exist!`
            });
        } 

        const passFound = await workout_trackerdb.findPassInBody(body);

        if (!passFound.total) {
            // Will run if users.total is less than 0, which means nothing was found in the DB
            return res.status(401).json({
                status: 401,
                ok: false,
                issue: 'Password',
                msg: `Sorry - incorrect password.`
            });
        } 

        await workout_trackerdb.loginDetailsMatch(body);

        return res.status(201).json({
            ok: true,
            msg: 'Login successful!'
          });

    } catch (err) {
        // do this
        // console.log('Error', err);
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
        });
    }
});



// router.post("/", async (req, res) => {
//     const body = req.body; // username and password sent by React
//     console.log(body);
//     console.log(body.username);

//     // Username check
//     if (body.username === '') {
//         return res.status(401).json({
//             status: 401,
//             ok: false,
//             issue: 'Username',
//             msg: 'You must enter a username.'
//         });
//     } else if (body.username.length < 5) {
//         return res.status(401).json({
//             status: 401,
//             ok: false,
//             issue: 'Username',
//             msg: 'Username needs to be 5 or more characters.'
//         });
//     }

//     // Password check
//     if (body.password === '') {
//         return res.status(401).json({
//             status: 401,
//             ok: false,
//             issue: 'Password',
//             msg: 'You must enter a password.'
//         });
//     } else if (body.password.length < 4) {
//         return res.status(401).json({
//             status: 401,
//             ok: false,
//             issue: 'Password',
//             msg: 'Password needs to be 4 or more characters.'
//         });
//     }

//     // Make sure inputs are not empty when they are sent

//     try {

//         const userFound = await workout_trackerdb.findUserInBody(body);

//         if (!userFound.total) {
//             // Will run if users.total is less than 0, which means nothing was found in the DB
//             return res.status(401).json({
//                 status: 401,
//                 ok: false,
//                 issue: 'doesnt exist',
//                 msg: `Sorry - this user doesn't exist!`
//             });
//         } 

//         const passFound = await workout_trackerdb.findPassInBody(body);

//         if (!passFound.total) {
//             // Will run if users.total is less than 0, which means nothing was found in the DB
//             return res.status(401).json({
//                 status: 401,
//                 ok: false,
//                 issue: 'Password',
//                 msg: `Sorry - incorrect password.`
//             });
//         } 

//         await workout_trackerdb.loginDetailsMatch(body);

//         return res.status(201).json({
//             ok: true,
//             msg: 'Login successful!'
//           });

//     } catch (err) {
//         // do this
//         console.log('Error', err);
//         return res.status(500).json({
//             ok: false,
//             msg: 'DB Error!'
//         });
//     }
// });



router.get('/', async (req, res, next) => {
    try {
        let results = await db.all();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


module.exports = router;