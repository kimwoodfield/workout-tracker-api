const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const login = require('./routes/login');
const register = require("./routes/register");
const log = require("./routes/log");
const exercises = require("./routes/exercises");
const routines = require("./routes/routines");
const logout = require("./routes/logout");
const addroutine = require("./routes/addroutine");
const validate = require("./routes/validate");
const addexercise = require("./routes/addexercise");
const router = require("./routes/login");


///////////////////////////////////////////////////
// To-do List
///////////////////////////////////////////////////
// Use Crypto.js for hashing passwords
// Use NPM Winston for logging interactions on app
// Get sessions working
// Finish register and login validation

// Set sessions
// app.set('trust proxy', 1) // trust first proxy

app.use(session({
  name: 'User cookie',
  secret: 'its a secret!',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true,
  },
}));
app.use(express.json());

// Handles CORS
app.use(cors(
  { credentials: true, origin: 'http://localhost:3005'}
));

// Test route for register
app.use("/login", login);

// Test route for workout logout
app.use("/validate", validate);

// Test route for register
app.use("/register", register);

// Test route for workout log
app.use("/log", log);

// Test route for workout logout
app.use("/logout", logout);

// Test route for workout logout
app.use("/exercises", exercises);

// Test route for workout logout
app.use("/routines", routines);

// Test route for addroutine
app.use("/addroutine", addroutine);

// Test route for addexercise
app.use("/addexercise", addexercise);





app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});