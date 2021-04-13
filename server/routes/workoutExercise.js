const express = require('express');
const { workout_trackerdb } = require("../db");

// Creates new instance of router
const router = express.Router();


// GET /exercises/12345
router.get('/workoutExercise/:id', (req, res) => {
  const id = req.params.id; // 12345

  // do queries for that id
});


// If a user doesn't have access, return a 403.
router.get("/", (req ,res) => {

  console.log('A Request was made here with query params ', req.params);

});

router.post("/", (req ,res) => {

  console.log('A Request was made here with query params ', req.params);

});

router.post('/workoutExercise/:id', (req, res) => {
  const id = req.params.id; // 12345

  // do queries for that id
});



 
module.exports = router;