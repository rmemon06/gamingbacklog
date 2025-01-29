const express = require('express');
const router = express.Router();
const fs = require('fs');

const lists = JSON.parse(fs.readFileSync('./data/lists.json', 'utf8'));
const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));

router.get('/', (req, res) => {//get alll the lusts from the lists json fiel
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

//creating and adding new list to the lists json file
router.post('/', (req, res) => {
    const newList = req.body;
    if (!newList.name ) {
        return res.status(400).json({ error: 'Missing required list name' });
    }
    newList.id = lists.length + 1;

    lists.push(newList);
    fs.writeFileSync('./data/lists.json', JSON.stringify(lists, null, 2), 'utf8');
    res.json(newList);
})


//deleting a list from the jsons file
router.delete('/:id', (req, res) => {
  const listId = parseInt(req.params.id);

  // Find the list index in the lists array
  const listIndex = lists.findIndex(l => l.id === listId);
  if (listIndex === -1) {
      return res.status(404).json({ error: 'List not found' });
  }
  if (!games || !Array.isArray(games)) {
    return res.status(500).json({ error: "Games data not available" });
}
  // Remove the list from the lists array
  const deletedList = lists.splice(listIndex, 1);

  // Remove the list from all games' lists arrays, cuz a game cant be in a list that doesnt exist
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


//removing a game froma  spexific list
router.delete('/:id/remove-game', (req, res) => {
  const listId = parseInt(req.params.id);
  const { name } = req.body;
  const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));
  console.log('Removing game from list:', { listId, name });

  const game = games.find(g => g.name === name);
  if (!game) {
    console.error('Game not found:', name);
    return res.status(404).json({ error: 'Game not found' });
  }

  console.log('Found game:', game);

  // Ensure the listId is in the game.list array
  const listIndex = game.list.indexOf(listId);
  if (listIndex === -1) {
    console.error('Game is not in this list:', { game, listId });
    return res.status(404).json({ error: 'Game is not in this list' });
  }

  // Remove the listId from the game.list array
  game.list.splice(listIndex, 1);

  fs.writeFileSync('./data/games.json', JSON.stringify(games, null, 2), 'utf8');
  console.log('Updated game lists:', game.list); // Show updated lists

  res.json(game); // Send back the updated game object
});





module.exports = router; // exporting router from each routers so in the server it has access when i like import them in
