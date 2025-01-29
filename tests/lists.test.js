const request = require('supertest');
const app = require('../server'); //importing my exprss server
const fs = require('fs');
//PROBLEM WITH THE TESTING, THE TESTS ALL ONLY WORK IF THE DATA IN THE JSON FILE IS THE SAME AS THE MOCK DATA, SO I HAVE TO CHANGE THE DATA IN THE JSON FILE TO MATCH THE MOCK DATA
//BECAUSE THE JSON FILES DO GET MANIPULATED BY THE TESTS, SO I HAVE TO MAKE SURE THAT THE DATA IN THE JSON FILE MATCHES THE MOCK DATA
const mockGames = [
    {
      id: 51325,
      name: "The Last of Us Part II",
      genres: [
        { id: 2, name: "Shooter", slug: "shooter" },
        { id: 3, name: "Adventure", slug: "adventure" },
        { id: 4, name: "Action", slug: "action" },
      ],
      image: "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
      description: "I do not get the hate this was an absolute masterclass In story telling and character writing.",
      list: [1, 4, 6],
      rating: 5,
    },
    {
      id: 799265,
      name: "The Last of Us Part I",
      genres: [
        { id: 2, name: "Shooter", slug: "shooter" },
        { id: 3, name: "Adventure", slug: "adventure" },
        { id: 4, name: "Action", slug: "action" },
      ],
      image: "https://media.rawg.io/media/games/71d/71df9e759b2246f9769126c98ac997fc.jpg",
      description: "The best game of all time, joel and ellie have the best relationship in any sort of game ever.",
      list: [1, 4, 6],
      rating: 5,
    },
  ];

const mockLists =[
    {
        id: 1,
        name: "All"
      },
      {
        id: 2,
        name: "Toplay"
      },
      {
        id: 3,
        name: "Playing"
      },
      {
        id: 4,
        name: "Favourites"
      },
      {
        id: 5,
        name: "Wishlist"
      },
      {
        id: 6,
        name: "Completed"
      },
      {
        id: 7,
        name: "Dropped"
      }
]
describe('GET /api/lists', () => {
    test('should return all lists with a 200 status code and correct content type', async () => {
      // Mock the lists data, you can mock this in your route handling as well if needed
      const response = await request(app).get('/api/lists');
  
      // Assert HTTP status code
      expect(response.statusCode).toBe(200);
        
      // Assert Content-Type header is application/json
      expect(response.headers['content-type']).toMatch(/json/);
  
      // Assert the response body contains the mock lists
      expect(response.body).toEqual(expect.arrayContaining(mockLists));
  
   
     
    });
  });
  
  describe('GET /api/lists/:id', () => {
    test('should return a specific list by id with a 200 status code and correct content type', async () => {
      const listId = 1; // The ID of the list to retrieve
      const expectedList = mockLists.find(list => list.id === listId); // Find the list from mock data
  
      const response = await request(app).get(`/api/lists/${listId}`);
  
      // Assert HTTP status code
      expect(response.statusCode).toBe(200);
  
      // Assert Content-Type header is application/json
      expect(response.headers['content-type']).toMatch(/json/);
  
      // Assert the response body matches the expected list
      expect(response.body).toEqual(expectedList);
    });
  
    test('should return a 404 error if the list is not found', async () => {
      const listId = 999; // A non-existent list ID
  
      const response = await request(app).get(`/api/lists/${listId}`);
  
      // Assert HTTP status code
      expect(response.statusCode).toBe(404);
  
      // Assert the error message
      expect(response.body).toEqual({
        error: 'List not found',
      });
    });
  });

  describe('POST /api/lists', () => {
    test('should create a new list and return it with a 200 status code', async () => {
      const newList =
       { 
        id:"8",
        name: "New List" 
        }; // Data for the new list
  
      const response = await request(app)
        .post('/api/lists')
        .send(newList); // Send the new list data
  
      // Assert HTTP status code
      expect(response.statusCode).toBe(200);
  
      // Assert that the response body contains the new list with an id
      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number), // Ensure that the new list has an id
        name: "New List",     // Ensure the name matches the new list's name
      }));
  
    
    });
  
    test('should return a 400 error if required fields are missing', async () => {
      const incompleteList = {}; // Missing 'name' field
  
      const response = await request(app)
        .post('/api/lists')
        .send(incompleteList); // Send an incomplete list
  
      // Assert HTTP status code
      expect(response.statusCode).toBe(400);
  
      // Assert the response body contains the error message
      expect(response.body).toEqual({
        error: 'Missing required list name',
      });
    });
  });


  describe('DELETE /api/lists/:id', () => {
    test('should delete a list and remove it from all games with a 200 status code', async () => {
      const listIdToDelete = 2; // ID of the list we want to delete
  
      const response = await request(app).delete(`/api/lists/${listIdToDelete}`);
      expect(response.statusCode).toBe(200);
  
      //getting the response from the server AND It should sayy list deleted successfully
      expect(response.body.message).toBe('List deleted successfully');
      //i gotta get the lists from the json file after its delete to check if its deleted
      updatedLists = JSON.parse(fs.readFileSync('./data/lists.json', 'utf8'));
      // Ensure the list has been deleted from mockLists
      expect(updatedLists.find(l => l.id === listIdToDelete)).toBeUndefined();
  
      // Ensure the list is removed from all games that had it
      mockGames.forEach(game => {
        expect(game.list).not.toContain(listIdToDelete);
      });
    });
  
    test('should return a 404 error if the list is not found', async () => {
      const nonExistentListId = 999; // ID that does not exist in mockLists
  
      // Send a DELETE request with a non-existent list ID
      const response = await request(app).delete(`/api/lists/${nonExistentListId}`);
  
      // Assert the status code is 404
      expect(response.statusCode).toBe(404);
  
      // Assert the response body contains the error message
      expect(response.body).toEqual({
        error: 'List not found'
      });
    });
  });
  describe('DELETE /api/lists/:id/remove-game', () => {
    test('should remove a game from a specified list', async () => {
        const listId = 1; // List ID to remove the game from
        const gameName = 'The Last of Us Part I'; // Game to remove from the list
        const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));
        // Send a DELETE request to remove the game from the list
        const response = await request(app)
          .delete(`/api/lists/${listId}/remove-game`)
          .send({ name: gameName });
      
        // Assertions
        expect(response.statusCode).toBe(200); // Expect a successful status code
        expect(response.body.name).toBe(gameName); // Check that the correct game is returned
        expect(response.body.list).not.toContain(listId); // Check the list was removed from the game (matching the key 'list')
        updatedGames = JSON.parse(fs.readFileSync('./data/games.json', 'utf8'));
        // Ensure that the game list is updated correctly
        const updatedGame = updatedGames.find(g => g.name === gameName);
        expect(updatedGame.list).not.toContain(listId); // Ensure list ID is removed (matching the key 'list')
    });
  
    test('should return 404 if game is not found', async () => {
      const listId = 2;
      const gameName = 'Non Existent Game'; // Game that doesn't exist
  
      const response = await request(app)
        .delete(`/api/lists/${listId}/remove-game`)
        .send({ name: gameName });
  
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Game not found');
    });
  
    test('should return 404 if the game is not in the list', async () => {
      const listId = 2;
      const gameName = 'The Last of Us Part I'; // This game is not in the listId 2
  
      const response = await request(app)
        .delete(`/api/lists/${listId}/remove-game`)
        .send({ name: gameName });
  
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Game is not in this list');
    });
  });
  