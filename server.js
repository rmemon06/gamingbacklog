const express = require('express');
const bodyParser = require('body-parser');
const gamesRoute = require('./routes/games'); 

const app = express();

app.use(bodyParser.json()); // Ensure this is before your routes
app.use(express.static('public')); 
app.use('/api/games', gamesRoute);

app.listen(3000, () => {
    console.log("Server running");
});
