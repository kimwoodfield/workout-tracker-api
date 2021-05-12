const express = require("express");
const login = require("./login");
const { workout_trackerdb } = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();


// If a user doesn't have access, return a 403.
router.get("/", async (req, res) => {

  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;
  const user_id = req.session.userID.userID; 

  // console.log(req);


  try {

    // Try to do this
    let users = await workout_trackerdb.allUsers();
    console.log(users);

    return res.status(200).json({
      users,
    });
  } catch (err) {
    logger.info(
      `Could not retrieve the workouts for the ${user_id}. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});


router.patch("/", async (req, res) => {
    // Check the request object
    console.log('this is the request object ',req.body.username);
    let username = req.body.username;

  try {

    // Do this
    // let results = await workout_trackerdb.deleteUser(username);
    let retrievedRole = await workout_trackerdb.checkRole(username);
    console.log(retrievedRole);
    console.log(retrievedRole.results[0].role);
    let currentRole = retrievedRole.results[0].role;
    let newRole;

    console.log(currentRole);

    if (currentRole === "General") {
      newRole = await workout_trackerdb.promoteUser(username);
      console.log('user is ', currentRole);
      return res.status(201).json({
        msg: "User promoted!",
      });
    } else if (currentRole === "Admin") {
      newRole = await workout_trackerdb.demoteUser(username);
      console.log('user is ', currentRole);
      return res.status(201).json({
        msg: "User demoted!",
      });
    }

    // Find role of the user



  } catch (err) {
    logger.info(
      `The user failed to delete a workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});


router.delete("/", async (req, res) => {

    // Check the request object
    console.log('this is the request object ',req.body.username);
    let username = req.body.username;

  try {

    // Do this
    let results = await workout_trackerdb.deleteUser(username);

    return res.status(201).json({
      msg: "User deleted!",
    });
  } catch (err) {
    logger.info(
      `The user failed to delete a workout. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(500).json({
      ok: false,
      msg: "DB Error!",
    });
  }
});

module.exports = router;
