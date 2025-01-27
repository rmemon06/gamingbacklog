const express = require('express');
const router = express.Router();
const fs = require('fs');


const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));

router.get('/', (req, res) => {
    res.json(games); // Send the list of games as JSON
})

router.post('/', (req, res) => {
    console.log('Received new game:', req.body); 
    const newGame = req.body;
    games.push(newGame);
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
    res.status(201).json(newGame);
});


router.put('/:id', (req, res) => {
    const gameId = parseInt(req.params.id); // Get the game ID from the URL
    const updatedRating = req.body.rating; // Get the new rating from the request body

    // Find the game to update by ID
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        return res.status(404).json({ error: 'Game not found' }); // If the game doesn't exist, return 404
    }

    // Update the rating
    game.rating = updatedRating;

    // Write the updated games array back to the JSON file
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');

    // Respond with the updated game
    res.json(game);
});

module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
