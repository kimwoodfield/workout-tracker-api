const express = require("express");
const db = require("../db");
const {workout_trackerdb, getConnection} = require("../db")

// Creates new instance of router
const router = express.Router();


// Attach handlers to the router
// Handles GET requests made to /register
router.get("/", (req, res) => {
    res.send(`We have checked the registed users`); 
});


// Handles POST requests made to /register
router.post("/", async (req, res) => {
  const body = req.body; // email and password sent by React

  try {
    const users = await workout_trackerdb.findEmailInBody(body.email);

    if (users.total) {
      // Will run if users.total is higher than 0, which means something was found in the DB
      return res.status(409).json({
        ok: false,
        msg: 'A user already exists with that email'
      });
    }

    //await createUserInDB(body.email, body.password);

    return res.status(201).json({
      ok: true,
      msg: 'User created!'
    });
  } catch(err) {
    console.log('Error', err);
    return res.status(500).json({
      ok: false,
      msg: 'DB Error!'
    });
  }
});


// router.post("/", (req, res) => {
//   const email = req.body.email;
//   const fullname = req.body.fullname;
//   const username = req.body.username;
//   const password = req.body.password;
//   const role = 'General';

//   db.query("INSERT INTO User (email, full_name, username, password, role) VALUES (?, ?, ?, ?, ?)", [email, fullname, username, password, role], (err, result) => {
//   if (err) {
//       console.log(err)
//     } else {
//       res.send("values inserted");
//     }
//   }
//   );
// })



module.exports = router;