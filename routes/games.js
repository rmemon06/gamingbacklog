const express = require('express');
const router = express.Router();
const fs = require('fs');


const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));

router.get('/', (req, res) => {
    res.json(games); // Send the list of games as JSON
})


router.get('/:listId', (req, res) => {
    const listId = parseInt(req.params.listId);
    const listGames = games.filter(g => g.list.includes(listId));
    if (listGames.length > 0) {
        res.json(listGames); // Ensure JSON is returned
    } else {
        res.status(404).json({ error: 'No games found for the given list ID.' });
    }
});


router.post('/', (req, res) => {
    console.log('Received new game:', req.body); 
    const newGame = req.body;
    games.push(newGame);
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
    res.status(201).json(newGame);
});

router.put('/:id', (req, res) => {
    const gameId = parseInt(req.params.id); // Get the game ID from the URL
    const { rating, description } = req.body; // Get the fields from the request body

    console.log('Received body:', req.body); // Log the incoming request body

    // Find the game to update by ID
    const game = games.find(g => g.id === gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' }); // If the game doesn't exist, return 404
    }

    // Update the game's fields if they are provided
    if (rating !== undefined) {
        game.rating = rating; // Update rating
    }
    if (description !== undefined) {
        game.description = description; // Update description
    }

    // Write the updated games array back to the JSON file
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');

    // Respond with the updated game
    res.json(game);
});

router.delete('/:id', (req, res) => {
    const gameId = parseInt(req.params.id); // Get the game ID from the route
    const gameIndex = games.findIndex(g => g.id === gameId); // Find game by ID

    if (gameIndex === -1) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const deletedGame = games.splice(gameIndex, 1); // Remove game
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
    res.json({ message: 'Game deleted successfully', game: deletedGame });
});


module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
