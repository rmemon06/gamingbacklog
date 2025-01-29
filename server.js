const express = require('express');
const bodyParser = require('body-parser');
//importing the routes from the routes folder
const gamesRoute = require('./routes/games'); 
const listsRoute = require('./routes/lists');
const PORT = 3000;
const app = express();
module.exports = app;
app.use(bodyParser.json()); // Ensure this is before your routes
app.use(express.static('public')); 
//use these /api/games and /api/lists to access the routes in the js fetch calls
//seperating the routes into different files
app.use('/api/games', gamesRoute);
app.use('/api/lists', listsRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // If port is in use, increment port number until available
      let newPort = PORT + 1;
      console.log(`Port ${PORT} is in use, trying ${newPort}`);
      app.listen(newPort, () => {
        console.log(`Server is running on port ${newPort}`);
      });
    }
  });
