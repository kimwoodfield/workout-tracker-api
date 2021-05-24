const express = require("express");
const db = require("../db");
const login = require("./login");
const { workout_trackerdb, getConnection } = require("../db");
const logger = require("../../logger/logger");

// Creates new instance of router
const router = express.Router();

// Here we check what userType is set on the Session. If the userType is undefined, it means that the user attempted to access the route without creating an account first. If a user attempts to access the route with a userType of "General" then they are considered unauthorized to access the admin panel and a 403 response code is returned to the client as a result.
router.get("/", (req, res) => {
  // Store IP from Req obj and UserType for logging
  let whitelistedIP = ["138.44.128.241", "::ffff:127.0.0.1", "::1", "117.20.71.56"];

  let ip = req.ip;

  console.log("this is the whiteListed[1] ", whitelistedIP[1]);
  console.log("This is req.ip ", req.ip);

  let userType = req.session.userType;

  console.log(userType);
  console.log(typeof userType);

  console.log(req.session.userID);
  
  try {
    if (!req.session.userID) {
      logger.info(
        `Validation was unsuccessful. Attempted access from an unauthorized user located at IP address: ${ip}`
      );
      console.log("user doesnt have access");
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized.",
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
      // Compare IP with Whitelisted IP
      if (whitelistedIP.indexOf(ip) === -1) {
        console.log(`The IP's match`);
        res.sendStatus(403);
      } else {
        logger.info(
          `Successfully validated the user. The user is logged in as userType: ${userType} from IP address: ${ip}`
        );
        console.log(`The IP's do match.`);
        res.sendStatus(200);
      }
  
      // return res.status(200).json({
      //   status: 200,
      //   msg: "Access granted",
      // });
    }
  } catch (error) {
    console.log(error);
  }

});

module.exports = router;
