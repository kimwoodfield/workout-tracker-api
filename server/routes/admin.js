const express = require("express");
const db = require("../db");
const login = require("./login");
const { workout_trackerdb, getConnection } = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// If a user doesn't have access, return a 403.
router.get("/", (req, res) => {
  // Store IP from Req obj and UserType for logging
  let ip = req.ip;
  let userType = req.session.userType.userRole;

  console.log(userType);
  console.log(typeof userType);

  console.log(req.session.userID);
  if (!req.session.userID) {
    logger.info(
      `Validation was unsuccessful. Attempted access from an unauthorized user located at IP address: ${ip}`
    );
    console.log("user doesnt have access");
    return res.status(403).json({
      status: 403,
      msg: "Forbidden.",
    });
  } else if (userType === "General") {
    logger.info(
      `Insufficient privelages. Attempted access from an unauthorized user located at IP address: ${ip} with the userType of ${userType}`
    );
    console.log("This user is not an Administrator.");
    return res.status(403).json({
      status: 403,
      msg: "Forbidden.",
    });
  } else {
    logger.info(
      `Successfully validated the user. The user is logged in as userType: ${userType} from IP address: ${ip}`
    );
    return res.status(200).json({
      status: 200,
      msg: "Access granted",
    });
  }
});

module.exports = router;
