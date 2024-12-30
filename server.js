const express = require('express');
const app = express();
const gamesRoute = require('./routes/games');// importing routes so that the server can handle requests to the games and such
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public')); //public is the root file therefore in json dont need to do public/ just use images etc.

//api routes
app.use('/api/games', gamesRoute);

app.listen(3000, () => {
    console.log("Server running")
}); 