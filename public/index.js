const index = document.getElementById('content')
const stats = document.getElementById('quickStats')
const popUp = document.getElementById('popUp')
const popUpTitle = document.getElementById('popUpTitle')
const popUpDescription = document.getElementById('popUpDescription')
const popUpImage = document.getElementById('popUpImage')
const closePopUp = document.getElementById('popUpClose')
const forward = document.getElementById('popUpForward')
const backward = document.getElementById('popUpBackward')
const linkedIn = document.getElementById('linkedin')
let currentPage = ""

const popUpGenres = document.getElementById('popUpGenres')


document.addEventListener("DOMContentLoaded", () => {
    const dropdownContainer = document.getElementById("listsDropdown");
    let currentListId = 1;
    // Function to fetch lists and populate the dropdown
    function loadLists() {
        fetch('/api/lists') // Fetch lists from the backend THIS IS USING THE API ROUTE FOR LISTS AND GETTING THEM ALLL 
            .then(res => res.json())
            .then(data => {
                dropdownContainer.innerHTML = ""; // Clear existing links
                
                data.forEach(list => {
                    const link = document.createElement("a");
                    link.href = "#"; // Prevent default navigation for now
                    link.textContent = list.name; // Set the list name as the link text
                    link.dataset.listId = list.id; // Store the list ID to use it later
                    
                    // Add event listener for dynamic page loading
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        loadGamesForList(list.id, list.name); // Custom function to handle list content
                    });
                    const deleteIcon = document.createElement("img");
                    deleteIcon.src = "images/close.png"; //this is to add the ability to use the delete end point for links
                    
    
    
                    deleteIcon.addEventListener("click", (e) => {
                        e.stopPropagation(); // Prevent event bubbling tolink
                        if (confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
                            deleteList(list.id); // Call the function to delete the list from the file
                        }
                    });
    
                    // Append the link and delete button to the container
                    dropdownContainer.appendChild(link);
                    dropdownContainer.appendChild(deleteIcon);
                });
            })
            .catch(err => {
                console.error("Error loading lists:", err);
            });
    }function deleteList(listId) {
    fetch(`/api/lists/${listId}`, { // using the delete end point for the list to be deleted
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadLists(); // Reload the dropdown once its been deleted 
            } else {
                alert('Failed to delete list.');
            }
        })
        .catch(err => {
            console.error('Error deleting list:', err);
        });
}

    // Function to handle loading games for a specific list
    function loadGamesForList(listId, listName) {
        console.log(`Loading games for list: ${listName} (ID: ${listId})`); // debugging statements like usual
        currentListId = listId;
        
        fetch(`/api/games/${listId}`) // fetching games from the games route, getting all from a specific list 
        .then(res => res.json())
        .then(games => {
            console.log(`Games in list ${listName}:`, games); //logging the games from the lsit
            const container = document.getElementById("content");
            container.innerHTML = '';
            
            // Loop through each game and render it into my content div dynamically 
            games.forEach(game => {
                const gameContainer = document.createElement('div');
                gameContainer.className = 'gameContainer';
                
                const img = document.createElement('img');
                img.src = game.image;
                const h2 = document.createElement('h2');
                h2.textContent = game.name;
                //adding the functioanlity to load up the popUp when you press the image
                img.addEventListener('click', () => {
                    popUpImage.src = game.image;
                    popUp.classList.remove('close');
                    popUp.classList.add('open');
                    popUpTitle.textContent = game.name;
                    popUpDescription.textContent = game.description;
                    popUpGenres.textContent = game.genres.map(genre => genre.name).join(', ');
                    stats.style.filter = 'blur(5px)';
                    showStars(game.rating, 'popUpStarRating');
                    container.style.filter = 'blur(5px)';
                    deleteGamebutton.dataset.gameId = game.id;

                });

                gameContainer.appendChild(img);
                gameContainer.appendChild(h2);
                container.appendChild(gameContainer);
               

            });
        })
        .catch(err => console.error("Error loading games:", err));
      
}

closePopUp.addEventListener('click',    () => {
    content.style.filter = 'blur(0px)'
    popUp.classList.remove('open')
    popUp.classList.add('close')
    stats.style.filter = 'blur(0px)'
});

loadLists();

const deleteGamebutton = document.getElementById('deleteGameBtn')

//functionality to delete game
deleteGamebutton.addEventListener('click',async  () => {
    const gameId = deleteGamebutton.dataset.gameId;
    if (!gameId) {
        alert("Please select a game to delete.");
        return;
    }
    try {
        if(currentListId === 1){
            const response = await fetch(`/api/games/${gameId}`, { //using the endpoint to get a game by its id and then deleting it 
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Game deleted successfully.');
                location.reload();
            } else {
                alert('Failed to delete game.');
            }
        }else{
            const response = await fetch(`/api/lists/${currentListId}/remove-game`, { //using the endpoint to get games from a specific list and then deleting it
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: popUpTitle.textContent }),
            });
            if (response.ok) {
                alert('Game removed from list successfully.');
                location.reload();
            } else {
                alert('Failed to remove game from list.');
        }
    
    } 
    }catch (error) {
    }
})

const contentDiv = document.getElementById("content");


//making it dynamic and single page application
  // Function to load page content
  function loadPage(page) {
    // Fetch the corresponding HTML page
    fetch(`${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error("Page not found");
        return response.text();
      })
      .then(data => {
        contentDiv.innerHTML = data; // Insert the page content into the content div
      })
      .catch(err => {
        contentDiv.innerHTML = `<p>Error loading page: ${err.message}</p>`;
      });
  }

  // Event listener for navigation links
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const page = event.target.getAttribute("data-page");
      loadPage(page); // Load the clicked page
    });
  });

  // Load the default page (home) when the site loads
  loadPage("home");


  
  

  window.gfg = function(n, containerId) {  //had to do window. for it to work otherwise got some reference error 
    //this is my function to show the stars in the addGame pop up so the initial rating 
      const container = document.getElementById(containerId);
      const stars = document.getElementsByClassName("star")
      nOfStars = n
      remove(containerId);
      for (let i = 0; i < n; i++) {
          if (n == 1) cls = "one";
          else if (n == 2) cls = "two";
          else if (n == 3) cls = "three";
          else if (n == 4) cls = "four";
          else if (n == 5) cls = "five";
          stars[i].className = "star " + cls;
      }
      
  }
//removing the star rating
  function remove(containerId) {
      const container = document.getElementById(containerId);
      const stars = container.getElementsByClassName("star");
      let i = 0;
      while (i < 5) {
          stars[i].className = "star";
          i++;
      }
  }





window.starsInPop = function (n, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    const stars = container.getElementsByClassName("starPop");

    // Reset the class for all stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].className = "starPop"; // Reset class to default
    }

    // Add a 'selected' class for the number of stars clicked
    for (let i = 0; i < n; i++) {
        stars[i].className = "starPop selected"; // Highlight stars up to the given rating
    }

    // Update the star rating
    changeStarRating(popUpTitle.textContent, n);
};
//function to change the star rating 
window.changeStarRating = function (gameName, n) {
    fetch('/api/games') //getting the games from the games endpoint so we can see its rating 
        .then((res) => res.json())
        .then((data) => {
            // Find the game from the fetched data
            const game = data.find((game) => game.name === gameName);

            if (!game) {
                console.error(`Game "${gameName}" not found.`);
                return;
            }

            // Send the updated rating back to the server using a put request of a specific game
            fetch(`/api/games/${game.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: n }), // Send only the rating
            })
                .then((response) => response.json())
                .then((updatedGame) => {
                    console.log('Updated game rating on server:', updatedGame);

                    // Update stars in the pop-up dynamically
                    showStars(updatedGame.rating, 'popUpStarRating');
                })
                .catch((error) => {
                    console.error('Error updating game rating:', error);
                });
        })
        .catch((error) => {
            console.error('Error fetching games:', error);
        });
};

window.showStars = function (rating, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }
    console.log("container found updating ")
    const stars = container.getElementsByClassName("starPop");

    // Reset all stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].className = "starPop"; // Reset class to default
    }

    // Highlight stars up to the given rating
    for (let i = 0; i < rating; i++) {
        stars[i].className = "starPop selected";
    }
};

//adding functionality to the pop ups SIMPLEEE STUFFF
const addGameButton = document.getElementById('addGame'); //
const addGamePopUp = document.getElementById('addGamePopUp');
const addGameClose = document.getElementById('addGameClose');

addGameButton.addEventListener('click', () => {
    content.style.filter = 'blur(5px)'
    stats.style.filter = 'blur(5px)'
    addGamePopUp.classList.remove('close');
    addGamePopUp.classList.add('open');
});
addGameClose.addEventListener('click', () => {
    content.style.filter = 'blur(0px)'
    stats.style.filter = 'blur(0px)'
    addGamePopUp.classList.remove('open');
    addGamePopUp.classList.add('close');
});

const addListButton = document.getElementById('addList'); // The button to open Add Game popup
const addListPopUp = document.getElementById('addListPopUp');
const addListClose = document.getElementById('addListClose');
const addListForm = document.getElementById('addListForm'); 
addListButton.addEventListener('click', () => {
    content.style.filter = 'blur(5px)'
    stats.style.filter = 'blur(5px)'
    addListPopUp.classList.remove('close');
    addListPopUp.classList.add('open');
});
addListClose.addEventListener('click', () => {
    content.style.filter = 'blur(0px)'
    stats.style.filter = 'blur(0px)'
    addListPopUp.classList.remove('open');
    addListPopUp.classList.add('close');
});

//ADDING A LIST TO THE LISTS JSON 
addListForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const listName = document.getElementById('listName').value.trim(); // Get the list name
    if (!listName) {
      alert('List name cannot be empty.');
      return;
    }
  
    // Send POST request to add the new list
    fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: listName }), // Send the new list name
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add list');
        }
        return response.json();
      })
      .then((newList) => {
        console.log('New list added:', newList);
  
        //  update the UI with the new list
        const listDropdown = document.getElementById('listDropdown');
        if (listDropdown) {
          const newOption = document.createElement('option');
          newOption.value = newList.id;
          newOption.textContent = newList.name;
          listDropdown.appendChild(newOption);
        }
  
        // Reset form and close the pop-up
        document.getElementById('listName').value = '';
        addListPopUp.classList.remove('open');
        addListPopUp.classList.add('close');
        content.style.filter = 'blur(0px)';
        stats.style.filter = 'blur(0px)';
      })
      .catch((error) => console.error('Error adding list:', error));
  });
  


//using rawg api to get the games and add them to the library
const apiKey=  '3d05d3f9fbca425298598d2ba04a4e08';
const formMyGames = document.getElementById('addGameMyGames');
const myGamesSummary =  document.getElementById('userSummary')
//need to have seperate forms for each page for sum reason
formMyGames.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    const gameName = document.getElementById('gameName').value;
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=${apiKey}`); //getting response from the rawg api
        const data = await response.json();
        const gamesResponse = await fetch('/api/games');
        const existingGames = await gamesResponse.json(); // getitng current games by fetching all games from the server
        //check if its already in the library so cant add duplicates, checking :))))
        const dupe = existingGames.some(game => game.name.toLowerCase() === gameName.toLowerCase()); 

        if(dupe){
            alert('Game already exists in your library')
            return;
        }
        if (data.results.length === 0) {
            alert('No games found. Please refine your search.');
            return;
        }

        const game = data.results[0]; // Take the first result as an example
        const listCheckboxesDiv = document.getElementById('listCheckboxes'); // need to get what lists to put the game into by which ones are checked
        const listsToBeIn =[]
        const checkboxes = listCheckboxesDiv.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                listsToBeIn.push(parseInt(checkbox.value));
            }
        });

        const newGame = {
            id: game.id, 
            name: game.name,
            genres: game.genres,
            image: game.background_image,
            description: myGamesSummary.value , //getitng the users inputted summary and description
            list: listsToBeIn ,
            rating: nOfStars
            
        };
        console.log(newGame )
       
        const addingGameResponse = await fetch('/api/games', { //post request to add the game to the library
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGame),
        });

        if (addingGameResponse.ok) {
            alert('Game added successfully!');
            location.reload();
        } else {    
            alert('Failed to add game. Please try again.');
        }
        
    } catch (error) {
        console.error('Error fetching game details:', error);
        alert('Failed to fetch game details. Please try again.');
    }
});


//Go through the games and go forward specific to the list
forward.addEventListener('click', () => {
    const gameName = popUpTitle.textContent; // Get the name of the current game
    fetch('/api/games') // Fetch all games from the server
        .then(res => res.json())
        .then(data => {
            // Find the current game in the fetched data
            const currentIndex = data.findIndex(game => game.name === gameName);
            
            // Get the next game, loop back to the first game if at the end
            const nextGame = data[(currentIndex + 1) % data.length];

            // Update the pop-up with the next game's details
            popUpTitle.textContent = nextGame.name;
            popUpDescription.textContent = nextGame.description;
            popUpImage.src = nextGame.image;
            popUpGenres.textContent = nextGame.genres.map(genre => genre.name).join(', ');
            showStars(nextGame.rating, 'popUpStarRating');
        })
        .catch(error => console.error('Error fetching games:', error));
});
    
    
    
    backward.addEventListener('click', () => {
        const gameName = popUpTitle.textContent; // Get the name of the current game
    fetch('/api/games') // Fetch all games from the server
        .then(res => res.json())
        .then(data => {
            // Find the current game in the fetched data
            const currentIndex = data.findIndex(game => game.name === gameName);
            
            // Get the next game, loop back to the first game if at the end
            const nextGame = data[(currentIndex - 1+ data.length) % data.length];

            // Update the pop-up with the next game's details
            popUpTitle.textContent = nextGame.name;
            popUpDescription.textContent = nextGame.description;
            popUpImage.src = nextGame.image;
            popUpGenres.textContent = nextGame.genres.map(genre => genre.name).join(', ');
            showStars(nextGame.rating, 'popUpStarRating');
        })
        .catch(error => console.error('Error fetching games:', error));
    }
    )

    //stats data 
gamesTotal = document.getElementById('totalGames')
gamesCompleted = document.getElementById('gamesCompleted')
gamesCurrent = document.getElementById('gamesInProgress')
gamesInWishlist = document.getElementById('wishlistCount')
let gt = 0
let gc = 0
let gp = 0
let gw = 0
function getGameStats(){
    fetch('/api/games') //getting all games to iterate through and find how many in each lsit 
        .then(res => res.json())
        .then(data => {
            data.forEach(game => {
                gt++
                if(game.list.includes(6)){
                  
                    gc++
                }
                if(game.list.includes(3)){
                    gp++
                }
                if(game.list.includes(5)){
                    gw++
                }
            })
            gamesTotal.textContent = gt
            gamesCompleted.textContent = gc
            gamesCurrent.textContent = gp
            gamesInWishlist.textContent = gw
})
}

// Event listener for the Save Description button
document.getElementById('saveDescriptionBtn').addEventListener('click', () => {
    const gameName = popUpTitle.textContent; // Get the name of the current game
    const newDescription = document.getElementById('popUpDescriptionEdit').value; // Get the new description from the textarea
    
    if (!newDescription) {
        alert('Description cannot be empty.');
        return;
    }
    
    fetch('/api/games') // Fetch all games from the server
        .then(res => res.json())
        .then(data => {
            // Find the current game in the list
            const game = data.find(game => game.name === gameName);
            
            if (!game) {
                console.error('Game not found.');
                return;
            }
            
            // Update the game's description
            game.description = newDescription;

            // Send the updated game to the server
            fetch(`/api/games/${game.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newDescription }) // Only send the description
            })
            .then(response => response.json())
            .then(updatedGame => {
                console.log('Game updated:', updatedGame);

                // Update the UI with the new description
                popUpDescription.textContent = updatedGame.description;

                //close the pop up and reset the blur
                document.getElementById('popUpDescriptionEdit').value = '';
                popUp.classList.add('close');
                stats.style.filter  = 'blur(0px)';
                contentDiv.style.filter = 'blur(0px)';
            })
            .catch(error => console.error('Error updating game:', error));
        })
        .catch(error => console.error('Error fetching games:', error));
});

function loadCheckBoxes() {
    // Fetch lists from the server
    fetch('/api/lists')
        .then(res => res.json())
        .then(lists => {
            const listCheckboxesDiv = document.getElementById('listCheckboxes');
            listCheckboxesDiv.innerHTML = ''; // Clear any existing checkboxes

            // Loop through the lists and create a checkbox for each one
            lists.forEach(list => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'list';
                checkbox.value = list.id; 
                checkbox.id = `list-${list.id}`; //
                
                label.setAttribute('for', checkbox.id);
                label.textContent = list.name; 

                // Append the checkbox and label to the container
                listCheckboxesDiv.appendChild(checkbox);
                listCheckboxesDiv.appendChild(label);
                listCheckboxesDiv.appendChild(document.createElement('br')); // For line break between checkboxes
            });
        })
        .catch(error => console.error('Error fetching lists:', error));
}

// Call the function to load the lists when the page loads
window.onload = loadCheckBoxes;


getGameStats()
})
