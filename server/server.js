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
const routineExercise = require("./routes/routineExercise");
const logout = require("./routes/logout");
const validate = require("./routes/validate");
const router = require("./routes/login");


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


// Handle routes
app.use("/login", login);
app.use("/validate", validate);
app.use("/register", register);
app.use("/log", log);
app.use("/logout", logout);
app.use("/exercises", exercises);
app.use("/routines", routines);
app.use("/routineExercise", routineExercise);


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});