const request = require('supertest');
const app = require('../server'); //importing my exprss server
//PROBLEM WITH THE TESTING, THE TESTS ALL ONLY WORK IF THE DATA IN THE JSON FILE IS THE SAME AS THE MOCK DATA, SO I HAVE TO CHANGE THE DATA IN THE JSON FILE TO MATCH THE MOCK DATA
//BECAUSE THE JSON FILES DO GET MANIPULATED BY THE TESTS, SO I HAVE TO MAKE SURE THAT THE DATA IN THE JSON FILE MATCHES THE MOCK DATA
// just using the test data from muy current json file
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


  //writing the test for the get request for all games
  describe('GET /api/games', () => {
    test('should return all games', async () => {
      const response = await request(app).get('/api/games'); //getting all games 
  
      // Assert the response status code 
      //200 is the status code for a successful
      expect(response.statusCode).toBe(200);

      //normalise them cuz initally i was getting a fail because of one little space, so this is to make sure that the response is the same as the mock data
      const normalizedResponse = response.body.map(game => ({
        ...game,
        description: game.description.trim(), // Trim extra spaces
      }));
  
      const normalizedMockGames = mockGames.map(game => ({
        ...game,
        description: game.description.trim(), // Trim extra spaces
      }));
      //checking if the response is the same as the mock data
      console.log("test for all games works :)")
      expect(normalizedResponse).toEqual(normalizedMockGames)
    });
  });

  //getting games by the list Id 
  describe('GET /api/games/:listId', () => {
    test('should return games for a valid list ID', async () => {
      const listId = 1; // List ID to test
      
      //getting the game with the id 1 
      const response = await request(app).get(`/api/games/${listId}`);
      //gotta normalise it again
      const normalizedResponse = response.body.map(game => ({
        ...game,
        description: game.description.trim(), 

      }));
   
      expect(response.statusCode).toBe(200);
  
      const expectedGames = mockGames.filter(game => game.list.includes(listId));
      const normalizedMockGames = expectedGames.map(game => ({
        ...game,
        description: game.description.trim(), // Trim extra spaces
      }));
      console.log("test for valid list works :)")
      expect(normalizedResponse).toEqual(normalizedMockGames);

    });
    //do test for wrong list
    test('should return a 404 error for an invalid list ID', async () => {
      const listId = 999; // List ID that doesn't exist
  
      
      const response = await request(app).get(`/api/games/${listId}`);
  
   
      expect(response.statusCode).toBe(404);
      console.log("test for invalid list works :)")
      
      expect(response.body).toEqual({ error: 'No games found for the given list ID.' });
    });
  });
  
    //post request which will try adding a game
  describe('POST /api/games', () => {
    test('should add a new game and return it', async () => {
      //random actual correct game data
      const newGame = {
        id: 12345,
        name: "Ghost of Tsushima",
        genres: [
          { id: 1, name: "Action", slug: "action" },
          { id: 2, name: "Adventure", slug: "adventure" }
        ],
        image: "https://media.rawg.io/media/games/ghost.jpg",
        description: "An amazing open-world samurai experience.",
        list: [1, 3],
        rating: 5
      };
  
      const response = await request(app)
        .post('/api/games')
        .send(newGame) // send the game data in the body of the request
        .set('Content-Type', 'application/json');
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(newGame);
      console.log("test for adding a game works :)");
    });
  
    test('should return 400 if required fields are missing', async () => {
      const incompleteGame = {
        name: "Hollow Knight", // Missing ID, genres, image and stuff so its not fully
        description: "A beautifully crafted metroidvania."
      };
  
      const response = await request(app)
        .post('/api/games')
        .send(incompleteGame)
        .set('Content-Type', 'application/json');
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: "Missing required game fields." });
      console.log("test for missing fields works :)");
    });
  })
//updating game description and rating 
  describe('PUT /api/games/:id', () => {
    test('should update a game\'s description and rating', async () => {
        const gameId = 51325; // Use an existing game ID from your test data
        const updatedData = {
            rating: 4, // different to the usual
            description: "An updated description for testing."
        };

        
        const response = await request(app)
            .put(`/api/games/${gameId}`) //put requqest to specific game
            .send(updatedData);

        
        expect(response.statusCode).toBe(200);

        // Assert the response body contains the updated fields
        expect(response.body).toEqual(expect.objectContaining({
            id: gameId,
            rating: updatedData.rating,
            description: updatedData.description
        }));
    });

    test('should return 404 if the game does not exist', async () => {
        const nonExistentGameId = 999999; //random non existenId
        const updatedData = {
            rating: 3,
            description: "Trying to update a non-existent game."
        };

        // Make a PUT request to update a non-existent game
        const response = await request(app)
            .put(`/api/games/${nonExistentGameId}`)
            .send(updatedData);


        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({ error: 'Game not found' });
    });
});



//finall test to delete a game
describe('DELETE /api/games/:id', () => {
  test('should delete a game by ID and return success message', async () => {
      const gameId = 51325; // Use an existing game ID from test data 

      // Make a DELETE request to remove the game
      const response = await request(app)
          .delete(`/api/games/${gameId}`);

      
      expect(response.statusCode).toBe(200);

     
      expect(response.body).toEqual(expect.objectContaining({
          message: 'Game deleted successfully',
          game: expect.any(Array) // Since splice returns an array with the deleted item in it
      }));

      // Make another DELETE request to ensure the game is actually gone,wont know if the game is gone if i dont check
      const secondResponse = await request(app)
          .delete(`/api/games/${gameId}`);

      expect(secondResponse.statusCode).toBe(404);
      expect(secondResponse.body).toEqual({ error: 'Game not found' });
  });

  test('should return 404 if the game does not exist', async () => {
      const nonExistentGameId = 999999; // Use an ID that doesn't exist

      const response = await request(app)
          .delete(`/api/games/${nonExistentGameId}`);

      expect(response.statusCode).toBe(404);

      
      expect(response.body).toEqual({ error: 'Game not found' });
  });
});
