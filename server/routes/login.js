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
  body("username").not().isEmpty().trim().escape().isLength({ min: 5 }),
  body("password").not().isEmpty().trim().escape().isLength({ min: 5 }),
  async (req, res) => {

    console.log('body is ', body);
    console.log('req body is ', req.body);
    // Username & password sent by React
    let formData = req.body;

    // Store IP on Req obj for logging
    let ip = req.ip;

    console.log('our formData is ', formData);

    const errors = validationResult(req);

    console.log('errors thing is ', errors);

    if (!errors.isEmpty()) {
      console.log()
      console.log('the first if statement in login route');
      console.log(errors);
      return res.status(401).json({ errors: errors.array() });
    }

    console.log('Made it past the first check');

    // Username check
    if (formData.username === "") {
      console.log('the second if statement in login route');
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Username",
        msg: "You must enter a username.",
      });
    } else if (formData.username.length < 5) {
      console.log('the third if statement in login route');
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Username",
        msg: "Username needs to be 5 or more characters.",
      });
    }

    // Password check
    if (formData.password === "") {
      console.log('the fourth if statement in login route');
      logger.info(`The user failed to login from IP address: ${ip}.`);
      return res.status(401).json({
        status: 401,
        ok: false,
        issue: "Password",
        msg: "You must enter a password.",
      });
    } else if (formData.password.length < 4) {
      console.log('the fifth if statement in login route');
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
      
      console.log('made it inside the try block in login route');

      const userFound = await workout_trackerdb.findUserInBody(formData);
      if (!userFound.total) {
        console.log('the first if statement in try block');
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
      const passFound = await workout_trackerdb.findPassInBody(formData, retrievedPass);

      // If no users were found with this password, return a 401.
      if (!passFound.total) {
        console.log('second if statement in try block');
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
      await workout_trackerdb.loginDetailsMatch(formData);

      // The session variable on the request object
      let session = req.session;

      // The user id pulled from the db and stored in userID
      let foundUserID = await workout_trackerdb.findUserID(formData);
      let userID = foundUserID.userID;
      console.log('the userID is ', userID);
      
      // The user role pulled from the db and stored in userType
      let foundUserType = await workout_trackerdb.findUserRole(formData);
      let userType = foundUserType.userRole;
      console.log('userType is ', userType);
      

      // Set the userID on session object to the id of the user that logged in.
      // Session object was instantiated here because it made the most sense for a user to receive an ID once they begin using the app.
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
