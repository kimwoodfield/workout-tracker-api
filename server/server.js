const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const login = require('./routes/login');
const register = require("./routes/register");

///////////////////////////////////////////////////
// To-do List
///////////////////////////////////////////////////
// Use Crypto.js for hashing passwords
// Use NPM Winston for logging interactions on app


// Set sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(express.json());

// Handles CORS
app.use(cors(
  { origin: 'http://localhost:3005'}
));

// Test route for register
app.use("/login", login);


// Test route for register
app.use("/register", register);


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});