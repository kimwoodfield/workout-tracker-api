const express = require('express');
const db = require('../db');
const {workout_trackerdb, getConnection} = require("../db")

const router = express.Router();


// Handles GET requests made to /login
router.get("/", (req, res) => {
    res.send(`Check if users login info exists`); 
});


// Handles POST requests made to /login
router.post("/", async (req, res) => {
    const body = req.body; // username and password sent by React

    try {
        const userFound = await workout_trackerdb.findUserInBody(body);

        if (!userFound.total) {
            // Will run if users.total is less than 0, which means nothing was found in the DB
            return res.status(401).json({
                ok: false,
                msg: `Sorry - this user doesn't exist!`
            });
        } 

        const passFound = await workout_trackerdb.findPassInBody(body);

        if (!passFound.total) {
            // Will run if users.total is less than 0, which means nothing was found in the DB
            return res.status(401).json({
                ok: false,
                msg: `Sorry - incorrect password. First Check.`
            });
        } 

        await workout_trackerdb.loginDetailsMatch(body);

        return res.status(201).json({
            ok: true,
            msg: 'Login successful!'
          });

    } catch (err) {
        // do this
        console.log('Error', err);
        return res.status(500).json({
            ok: false,
            msg: 'DB Error!'
        });
    }
});



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