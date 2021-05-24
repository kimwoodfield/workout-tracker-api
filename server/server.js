const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const port = 3000;
const login = require("./routes/login");
const register = require("./routes/register");
const log = require("./routes/log");
const exercises = require("./routes/exercises");
const routines = require("./routes/routines");
const routineExercise = require("./routes/routineExercise");
const logout = require("./routes/logout");
const users = require("./routes/users");
const isAdmin = require("./routes/isAdmin");
const workout = require("./routes/workout");
const workoutExercise = require("./routes/workoutExercise");
const currentWorkout = require("./routes/currentWorkout");
const rateLimit = require("express-rate-limit");

// Set sessions
app.use(
  session({
    proxy: true,
    name: "User cookie",
    secret: "its a secret!",
    resave: false,
    saveUninitialized: false,
    store: sessionStorage,
    cookie: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60000 * 60 * 48
    },
  })
);
app.use(express.json());


// Handles CORS
originWhitelist = [
  "http://localhost:3000",
  "http://localhost:3005",
  "https://workout-tracker-red.vercel.app",
];

app.use(cors({ 
  credentials: true, 
  origin: originWhitelist,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Origin", "Content-Type", "Authorization", "x-requested-with"
  ],
 }));


// Limits the requests to API
const dailyLimit = rateLimit({
  windowMs: 1000 * 60 * 60 * 24,
  max: 3000, // Limits each IP to 1000 requests/day
});
const userLimit = rateLimit({
  windowMs: 1000,
  max: 10, // Limits each user to 10 requests/second
});
app.use(dailyLimit, userLimit);


// Handle routes
app.use("/login", login);
app.use("/isAdmin", isAdmin);
app.use("/register", register);
app.use("/log", log);
app.use("/logout", logout);
app.use("/exercises", exercises);
app.use("/routines", routines);
app.use("/routineExercise", routineExercise);
app.use("/workout", workout);
app.use("/currentWorkout", currentWorkout);
app.use("/workoutExercise", workoutExercise);
app.use("/users", users);

app.listen(process.env.PORT || "3000", () => {
  console.log(`Server is running on port: ${process.env.PORT || port}`);
});
