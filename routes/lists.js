const express = require('express');
const router = express.Router();
const fs = require('fs');

const lists = JSON.parse(fs.readFileSync('./data/lists.json', 'utf8'));
const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));
router.get('/', (req, res) => {

  res.json(lists); 
})

//getting a list by specific id 
router.get('/:id', (req, res) => {
    const listId = parseInt(req.params.id);
    const list = lists.find(l => l.id === listId);

    if (!list) {
        return res.status(404).json({ error: 'List not found' });
    }

    res.json(list);
})

router.post('/', (req, res) => {
    const newList = req.body;

    newList.id = lists.length + 1;

    lists.push(newList);
    fs.writeFileSync('./data/lists.json', JSON.stringify(lists, null, 2), 'utf8');
    res.json(newList);
})


router.delete('/:id', (req, res) => {
  const listId = parseInt(req.params.id);

  // Find the list index in the lists array
  const listIndex = lists.findIndex(l => l.id === listId);
  if (listIndex === -1) {
      return res.status(404).json({ error: 'List not found' });
  }

  // Remove the list from the lists array
  const deletedList = lists.splice(listIndex, 1);

  // Remove the list from all games' lists arrays
  games.forEach(game => {
      const gameListIndex = game.list.indexOf(listId);
      if (gameListIndex !== -1) {
          game.list.splice(gameListIndex, 1);
      }
  });

  // Save updated lists and games to JSON files
  fs.writeFileSync('./data/lists.json', JSON.stringify(lists, null, 2), 'utf8');
  fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');

  res.json({ message: 'List deleted successfully', deletedList });
});

router.patch('/:id/add-game', (req, res) => {
    const listId = parseInt(req.params.id); // Get the list ID from the URL
    const { gameName } = req.body; // Get the game name from the request body
  
    // Find the game to update by its name
    const game = games.find(g => g.name === name);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' }); // If the game doesn't exist
    }
  
    // Add the list ID to the game's list of lists (if it's not already there)
    if (!game.lists.includes(listId)) {
      game.lists.push(listId);
    }
  
    // Write the updated games array back to the JSON file
    fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
  
    // Respond with the updated game
    res.json(game);
  
})
router.delete('/:id/remove-game', (req, res) => {
  const listId = parseInt(req.params.id);
  const { name } = req.body;

  console.log('Removing game from list:', { listId, name });

  const game = games.find(g => g.name === name);
  if (!game) {
      console.error('Game not found:', name);
      return res.status(404).json({ error: 'Game not found' });
  }

  console.log('Found game:', game);

  const listIndex = game.list.indexOf(listId);
  if (listIndex === -1) {
      console.error('Game is not in this list:', { game, listId });
      return res.status(404).json({ error: 'Game is not in this list' });
  }

  game.list.splice(listIndex, 1);

  fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
  console.log('Updated game lists:', game.list);

  res.json(game);
});

  



module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
