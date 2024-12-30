const express = require('express');
const router = express.Router();
const fs = require('fs');


const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));
router.get('/', (req, res) => {
    res.json(games); // Send the list of games as JSON
})

module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
