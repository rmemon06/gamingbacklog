const express = require('express');
const router = express.Router();
const fs = require('fs');//fs lets us communicate with the file system


const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));

router.get('/', (req, res) => {
    res.json(games); // Send the list of all games as JSON
})


router.get('/:listId', (req, res) => { // send the list of the games in a specific list, useful when displaying them when pressing different lists on drop down
    const listId = parseInt(req.params.listId);
    const listGames = games.filter(g => g.list.includes(listId));
    if (listGames.length > 0) {
        res.json(listGames); //if the list isnt empty send a list of the games if not send an error
    } else {
        res.status(404).json({ error: 'No games found for the given list ID.' });
    }
});


router.post('/', (req, res) => { // post request to add new game to games json file
    console.log('Received new game:', req.body);  //the game is sent in the body of the request
    const newGame = req.body;
    if(newGame.id === undefined || newGame.name === undefined || newGame.genres === undefined || newGame.list === undefined) {
        return res.status(400).json({ error: 'Missing required game fields.' }); //if the fields are missing send an error
    }
    games.push(newGame);
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
    res.status(201).json(newGame); //201 means game created
});

router.put('/:id', (req, res) => { //update the games description and rating endpoint
    const gameId = parseInt(req.params.id); // Get the game ID 
    const { rating, description } = req.body; // both fields in the body of the request

    console.log('Received body:', req.body); //logggin for debuggin

    //find game
    const game = games.find(g => g.id === gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' }); // If the game doesn't exist eror
    }

    // Update the game's fields if they are provided
    if (rating !== undefined) {
        game.rating = rating;
    }
    if (description !== undefined) {
        game.description = description;
    }

    // Write the updated games array back to the JSON file
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');

    // Respond with the updated game
    res.json(game);
});

router.delete('/:id', (req, res) => { // delete a specificccc game from files
    const gameId = parseInt(req.params.id); // Get the game ID from the route
    const gameIndex = games.findIndex(g => g.id === gameId); // Find game by ID

    if (gameIndex === -1) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const deletedGame = games.splice(gameIndex, 1); // Remove game by splicing the games file 
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
    res.json({ message: 'Game deleted successfully', game: deletedGame });
});


module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
