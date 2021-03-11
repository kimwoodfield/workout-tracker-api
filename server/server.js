const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const port = 3000;
const routes = require('./routes');
const bodyParser = require('body-parser');


// Set sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Handles CORS
app.use(cors());

app.use('/api/User', routes);

app.get('/', (req, res) => {
    res.send(`Let's get started!`);
})


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});