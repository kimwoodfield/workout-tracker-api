const express = require("express");


// Creates new instance of router
const router = express.Router();


// Attach handlers to the router

// When a get request hits /register do this -
router.get("/", (req, res) => {
    res.send(`We have checked the registed users`); 
  });

// When a post request hits /register do this -
router.post("/", (req, res) => {
    res.send(`You have been registered`); 
});


module.exports = router;