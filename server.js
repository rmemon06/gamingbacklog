const express = require('express');
const bodyParser = require('body-parser');
const gamesRoute = require('./routes/games'); 
const listsRoute = require('./routes/lists');

const app = express();

app.use(bodyParser.json()); // Ensure this is before your routes
app.use(express.static('public')); 
app.use('/api/games', gamesRoute);
app.use('/api/lists', listsRoute);

app.listen(3000, () => {
    console.log("Server running");
});
