const express = require("express");
const db = require("../db");
const { workout_trackerdb, getConnection } = require("../db");
const { body, validationResult } = require("express-validator");
const logger = require("../../logger/logger");

const router = express.Router();

let sessionUserID;

// Handles GET requests made to /login
router.get("/", (req, res) => {
  res.send(`Check if users login info exists`);
});

// Handles POST requests made to /login
router.post(
  "/",
  body("username").not().isEmpty(),
  body("password").not().isEmpty(),
  async (req, res) => {

    // Store IP on Req obj for logging
    let ip = req.ip;

    const body = req.body; // username and password sent by React

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // Username check
    if (body.username === "") {
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Username",
        msg: "You must enter a username.",
      });
    } else if (body.username.length < 5) {
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Username",
        msg: "Username needs to be 5 or more characters.",
      });
    }

    // Password check
    if (body.password === "") {
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Password",
        msg: "You must enter a password.",
      });
    } else if (body.password.length < 4) {
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Password",
        msg: "Password needs to be 4 or more characters.",
      });
    }

    // Make sure inputs are not empty when they are sent
    try {
      

      const userFound = await workout_trackerdb.findUserInBody(body);
      if (!userFound.total) {
        logger.info(`The user failed to login from IP address: ${ip}.`);
        return res.status(401).json({
          status: 401,
          ok: false,
          issue: "doesnt exist",
          msg: `Sorry - this user doesn't exist!`,
        });
      }
      console.log('userFound is ', userFound);
      let retrievedPass = userFound.results[0].password;

      // Wait here while we check if there is a user in the database that matches this password
      const passFound = await workout_trackerdb.findPassInBody(body, retrievedPass);

      // If no users were found with this password, return a 401.
      if (!passFound.total) {
        logger.info(`The user failed to login from IP address: ${ip}.`);
        // Will run if users.total is less than 0, which means nothing was found in the DB
        return res.status(401).json({
          status: 401,
          ok: false,
          issue: "Password",
          msg: `Sorry - incorrect password.`,
        });
      }

      // Wait here to see if the login details match what we have stored in the database
      await workout_trackerdb.loginDetailsMatch(body);

      // The session variable on the request object
      let session = req.session;

      // The user id pulled from the db and stored in userID
      let userID = await workout_trackerdb.findUserID(body);
      
      // The user role pulled from the db and stored in userType
      let userType = await workout_trackerdb.findUserRole(body);

      // Set the userID on session object to the id of the user that logged in.
      session.userID = userID;
      session.userType = userType;

      // Log the success to the logger file
      logger.info(`Validation was successful. Logged in as userType: ${userType.userRole} from IP address: ${ip}`);

      return res.status(201).json({
        ok: true,
        msg: "Login successful!",
      });
    } catch (err) {
      console.log(err);
      logger.info(`The user failed to login from IP address: ${ip}.`);
      // do this
      // console.log('Error', err);
      return res.status(500).json({
        ok: false,
        msg: "DB Error!",
      });
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
