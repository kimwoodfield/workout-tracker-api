const express = require("express");
const app = express();
const port = 3000;
const routes = require('./routes');

app.use(express.json());

app.use('/api/User', routes);

app.get('/', (req, res) => {
    res.send(`Let's get started!`);
})

app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`);
});