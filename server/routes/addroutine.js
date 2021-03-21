const express = require('express');
const db = require('../db');
const login = require('./login');

// Creates new instance of router
const router = express.Router();

// If a user accesses this route, send their routine to the database.
router.post("/", (req ,res) => {

    console.log(req);

});
 
module.exports = router;