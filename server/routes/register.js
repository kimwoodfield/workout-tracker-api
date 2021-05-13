const express = require("express");
const { workout_trackerdb } = require("../db");
const { body, validationResult } = require("express-validator");
const logger = require("../../logger/logger");


// Creates new instance of router
const router = express.Router();


// Attach handlers to the router
// Handles GET requests made to /register
router.get("/", (req, res) => {
    res.send(`We have checked the registed users`); 
});


// Handles POST requests made to /register
router.post(
  "/",
  body("email").isEmail().normalizeEmail().not().isEmpty().trim().escape().isLength({ min: 5 }),
  body("fullname").not().isEmpty().trim().escape().isLength({ min: 5 }),
  body("username").not().isEmpty().trim().escape().isLength({ min: 5 }),
  body("password").not().isEmpty().trim().escape().isLength({ min: 5 }),
  async (req, res) => {

  // Object provided by express-validator to check errors against
  const errors = validationResult(req);

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;

  const body = req.body; // email and password sent by React

  if (!errors.isEmpty()) {
    console.log('the first if statement in register route');
    console.log(errors);
    return res.status(401).json({ errors: errors.array() });
  }

  console.log('Made it past the validation & sanitization with no errors!');

  try {
    const users = await workout_trackerdb.findEmailInBody(body);

    if (users.total) {
      // Will run if users.total is higher than 0, which means something was found in the DB
      logger.info(`A user attempted to create an account but failed because there was an account already existing with those details. The user was accessing the app from IP address: ${ip}`);
      return res.status(409).json({
        ok: false,
        msg: 'A user already exists with that email'
      });
    }

    await workout_trackerdb.createUserInDB(body);

    logger.info(`A user successfully registered an account on the app from IP address: ${ip}!`);

    return res.status(201).json({
      ok: true,
      msg: 'User created!'
    });
  } catch(err) {
    logger.info(`A user was unsuccessful when attempting to register an account on the app from IP address: ${ip}!`);
    console.log('Error', err);
    return res.status(500).json({
      ok: false,
      msg: 'DB Error!'
    });
  }
});



module.exports = router;