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
    const contentDiv = document.getElementById("content");
  
    // Function to load page content
    function loadPage(page) {
        currentPage = page;
        fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Page not found");
            return response.text();
        })
        .then(data => {
            contentDiv.innerHTML = data;

            // Wait until the myGames page is loaded and call getListOfGames
            if (page === 'myGames') {
                // Wait for the myGames container to exist
                const myGamesContainer = document.getElementById('myGames');
                if (myGamesContainer) {
                    getListOfGames(myGamesContainer); // Pass the container to the function
                } else {
                    console.error('My Games container not found');
                }
            }
            if (page === 'topGames') {
                // Wait for the topGames container to exist
                const topGamesContainer = document.getElementById('topGames');
                if (topGamesContainer) {
                    getListOfGames(topGamesContainer); // Pass the container to the function
                } else {
                    console.error('top Games container not found');
                }
            }
            if (page === 'completedGames') {
                // Wait for the myGames container to exist
                const completedGamesContainer  = document.getElementById('completedGames');
                if (completedGamesContainer) {
                    getListOfGames(completedGamesContainer); // Pass the container to the function
                } else {
                    console.error('Completed Games container not found');
                }
            }
            if (page === 'gamesToPlay') {
                // Wait for the myGames container to exist
                const gamesToPlayContainer  = document.getElementById('gamesToPlay');
                if (gamesToPlayContainer) {
                    getListOfGames(gamesToPlayContainer); // Pass the container to the function
                } else {
                    console.error('games to play container not found');
                }
            }
            if (page === 'gamesPlaying') {
                // Wait for the myGames container to exist
                const gamesPlayingContainer  = document.getElementById('gamesPlaying');
                if (gamesPlayingContainer) {
                    getListOfGames(gamesPlayingContainer); // Pass the container to the function
                } else {
                    console.error('games playing container not found');
                }
            }
            if (page === 'wishlist') {
                // Wait for the myGames container to exist
                const wishlistContainer  = document.getElementById('wishlist');
                if (wishlistContainer) {
                    getListOfGames(wishlistContainer); // Pass the container to the function
                } else {
                    console.error('games playing container not found');
                }
            }

        })
        .catch(err => {
            contentDiv.innerHTML = `<p>Error loading page: ${err.message}</p>`;
        });
    }

    // Event listener for navigation links
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = event.target.getAttribute("data-page");
            loadPage(page);
        });
    });

    loadPage("home");  // Load the default page
});

// Function to get list of games
function getListOfGames(container) {
    console.log("Fetching games...");
    fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            // Clear the container for each page
            container.innerHTML = ''; 
            
            // Loop through each game
            data.forEach(game => {
                const gameContainer = document.createElement('div');
                gameContainer.className = 'gameContainer';
                const img = document.createElement('img');
                img.src = game.image;
                const h2 = document.createElement('h2');
                h2.textContent = game.name;

                img.addEventListener('click', () => {
                    popUpImage.src = game.image;
                    popUp.classList.remove('close');
                    popUp.classList.add('open');
                    popUpTitle.textContent = game.name;
                    popUpDescription.textContent = game.description;
                    popUpGenres.textContent = game.genres.map(genre => genre.name).join(', ');
                    stats.style.filter = 'blur(5px)'
                    showStars(game.rating, 'popUpStarRating');
                    container.style.filter = 'blur(5px)'                   
                });

                gameContainer.appendChild(img);
                gameContainer.appendChild(h2);

                // Conditionally append to specific containers
                if (container.id === 'myGames' && game.list.includes(1)) {
                    container.appendChild(gameContainer); // For myGames
                }  
                if (container.id === 'topGames' && game.list.includes(4)) {
                    container.appendChild(gameContainer); // For topGames
                } 
                if (container.id === 'completedGames' && game.list.includes(6)) {
                    container.appendChild(gameContainer); // For completedGames
                }
                if (container.id === 'gamesToPlay' && game.list.includes(2)) {
                    container.appendChild(gameContainer); // For completedGames
                }
                if (container.id === 'gamesPlaying' && game.list.includes(3)) {
                    container.appendChild(gameContainer); // For completedGames
                }
                if (container.id === 'wishlist' && game.list.includes(5)) {
                    container.appendChild(gameContainer); // For completedGames
                }
                
                
            });
        })
        .catch(err => {
            console.log("Error fetching games:", err);
        });
}




function showStars(rating, containerId){
    const container = document.getElementById(containerId);
    const stars = container.getElementsByClassName("starPop");

    // Reset all stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].className = "starPop"; // Reset class to default
    }

    // Highlight stars up to the given rating
    for (let i = 0; i < rating; i++) {
        stars[i].className = "starPop selected";
    }
}

function starsInPop(n, containerId) {
    const container = document.getElementById(containerId);
    const stars = container.getElementsByClassName("starPop");
   
    // Reset the class for all stars
    for (let i = 0; i < stars.length; i++) {
        stars[i].className = "starPop"; // Reset class to default
    }

    // Add a 'selected' class for the number of stars clicked
    for (let i = 0; i < n; i++) {
        stars[i].className = "starPop selected"; // Highlight stars up to the given rating
    }
    changeStarRating(popUpTitle.textContent, n)
}

function changeStarRating(gameName, n){
    fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            // Find the game from the fetched data
            const game = data.find(game => game.name === gameName);

            // If the game is found, update its rating
            if (game) {
                game.rating = n;
                console.log(`Updated rating for ${game.name}: ${n} stars`);

                // Optionally, send the updated rating back to the server (for persistence)
                fetch(`/api/games/${game.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rating: n })
                })
                .then(response => response.json())
                .then(updatedGame => console.log('Updated game rating on server:', updatedGame))
                .catch(error => console.error('Error updating game rating:', error));
            } else {
                console.error('Game not found');
            }
        });

}

//adding functionality to add the games 
const addGameButton = document.getElementById('addGame'); // The button to open Add Game popup
const addGamePopUp = document.getElementById('addGamePopUp');
const addGameClose = document.getElementById('addGameClose');

addGameButton.addEventListener('click', () => {
    if(currentPage==='myGames'){
        myGames.style.filter = 'blur(5px)'
    }
    if(currentPage==='topGames'){
        topGames.style.filter = 'blur(5px)'
    }
    if(currentPage==='wishlist'){
        wishlist.style.filter = 'blur(5px)'
    }
    if(currentPage==='gamesPlaying'){
        gamesPlaying.style.filter = 'blur(5px)'
    }
    if(currentPage==='gamesToPlay'){
        gamesToPlay.style.filter = 'blur(5px)'
    }
    if(currentPage==='index'){
        document.getElementById('index').style.filter = 'blur(5px)'
    }
    if(currentPage==='completedGames'){
       completedGames.style.filter = 'blur(5px)'
    }
    stats.style.filter = 'blur(5px)'
    addGamePopUp.classList.remove('close');
    addGamePopUp.classList.add('open');
});
addGameClose.addEventListener('click', () => {
    if(currentPage==='myGames'){
        myGames.style.filter = 'blur(0px)'
    }
    if(currentPage==='topGames'){
        topGames.style.filter = 'blur(0px)'
    }
    if(currentPage==='wishlist'){
        wishlist.style.filter = 'blur(0px)'
    }
    if(currentPage==='gamesPlaying'){
        gamesPlaying.style.filter = 'blur(0px)'
    }
    if(currentPage==='gamesToPlay'){
        gamesToPlay.style.filter = 'blur(0px)'
    }if(currentPage==='index'){
      document.getElementById('index').style.filter = 'blur(0px)'
    } if(currentPage==='completedGames'){
        completedGames.style.filter = 'blur(0px)'
     }
    stats.style.filter = 'blur(0px)'
    addGamePopUp.classList.remove('open');
    addGamePopUp.classList.add('close');
});

let stars = 
    document.getElementsByClassName("star")
let nOfStars = 0
    function gfg(n, containerId) {
        const container = document.getElementById(containerId);
        nOfStars = n
        remove();
        for (let i = 0; i < n; i++) {
            if (n == 1) cls = "one";
            else if (n == 2) cls = "two";
            else if (n == 3) cls = "three";
            else if (n == 4) cls = "four";
            else if (n == 5) cls = "five";
            stars[i].className = "star " + cls;
        }
        
    }

    function remove(containerId) {
        const container = document.getElementById(containerId);
        let i = 0;
        while (i < 5) {
            stars[i].className = "star";
            i++;
        }
    }




const apiKey=  '3d05d3f9fbca425298598d2ba04a4e08';
const formMyGames = document.getElementById('addGameMyGames');
const myGamesSummary =  document.getElementById('userSummary')
//need to have seperate forms for each page for sum reason
formMyGames.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    const gameName = document.getElementById('gameName').value;
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=${apiKey}`);
        const data = await response.json();
        const gamesResponse = await fetch('/api/games');
        const existingGames = await gamesResponse.json();
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

        // Display search result
        const game = data.results[0]; // Take the first result as an example
        const gamePlayingCheckBox = document.getElementById('gamePlaying');
        const gameToPlayCheckBox = document.getElementById('gameToPlay');
        const gameWishlistCheckBox = document.getElementById('gameWishlist');
        const favouriteCheckBox = document.getElementById('favoriteGame');
        const completedGamesCheckBox = document.getElementById('completedGame')
        const listsToBeIn =[]
        listsToBeIn.push(1) // IF THE GAME IS IN TO PLAY OR PLAYING ITS IN MY GAMES BUT IF ITS ON WISHLIST ITS NOT CUZ I HAVENT BOUGHT IT YET
        if(gameToPlayCheckBox.checked){
            listsToBeIn.push(2)
        }
        else if(gamePlayingCheckBox.checked){
            listsToBeIn.push(3)
        }
        if(gameWishlistCheckBox.checked){
            listsToBeIn.pop()
            listsToBeIn.push(5)
        }
        if(favouriteCheckBox.checked){
            listsToBeIn.push(4)
        }
        if(completedGamesCheckBox.checked){
            listsToBeIn.push(6)
        }
        

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
       
        const addingGameResponse = await fetch('/api/games', {
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









closePopUp.addEventListener('click',    () => {
    if(currentPage==='myGames'){
        myGames.style.filter = 'blur(0px)'
    }
    if(currentPage==='topGames'){
        topGames.style.filter = 'blur(0px)'
    }
    if(currentPage==='gamesToPlay'){
        gamesToPlay.style.filter = 'blur(0px)'
    }
    if(currentPage==='gamesPlaying'){
        gamesPlaying.style.filter = 'blur(0px)'
    }
    if(currentPage==='wishlist'){
        wishlist.style.filter = 'blur(0px)'
    }
    if(currentPage==='completedGames'){
        completedGames.style.filter = 'blur(0px)'
    }
    popUp.classList.remove('open')
    popUp.classList.add('close')
  stats.style.filter = 'blur(0px)'
});


//Go through the games and go forward specific to the list
forward.addEventListener('click', () => {
    const gameName = popUpTitle.textContent
    fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            // Filter games based on the current page
            const specificList = data.filter(game => {
                if (currentPage === 'myGames') return game.list.includes(1);
                if (currentPage === 'topGames') return game.list.includes(4);
                if (currentPage === 'gamesToPlay') return game.list.includes(2);
                if (currentPage === 'gamesPlaying') return game.list.includes(3);
                if (currentPage === 'wishlist') return game.list.includes(5);
                if (currentPage === 'completedGames') return game.list.includes(6);
            });

            // Find the current game and get the next game
            const currentIndex = specificList.findIndex(game => game.name === gameName);
    
            const nextGame = specificList[(currentIndex + 1) % specificList.length]; ;

            // Update the popup with the next game's details
            popUpTitle.textContent = nextGame.name;
            popUpDescription.textContent = nextGame.description;
            popUpImage.src = nextGame.image;
            popUpGenres.textContent = nextGame.genres.map(genre => genre.name).join(', ')
            showStars(nextGame.rating, 'popUpStarRating');
        })
        .catch(error => console.error('Error fetching games:', error));
});
    
    
    
    backward.addEventListener('click', () => {
        const gameName = popUpTitle.textContent
        fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            // Filter games based on the current page
            const specificList = data.filter(game => {
                if (currentPage === 'myGames') return game.list.includes(1);
                if (currentPage === 'topGames') return game.list.includes(4);
                if (currentPage === 'gamesToPlay') return game.list.includes(2);
                if (currentPage === 'gamesPlaying') return game.list.includes(3);
                if (currentPage === 'wishlist') return game.list.includes(5);
                if (currentPage === 'completedGames') return game.list.includes(6);
            });

            // Find the current game and get the next game
            const currentIndex = specificList.findIndex(game => game.name === gameName);
    
            const nextGame = specificList[(currentIndex - 1) % specificList.length]; ;

            // Update the popup with the next game's details
            popUpTitle.textContent = nextGame.name;
            popUpDescription.textContent = nextGame.description;
            popUpImage.src = nextGame.image;
            popUpGenres.textContent = nextGame.genres.map(genre => genre.name).join(', ')
            showStars(nextGame.rating, 'popUpStarRating');
        })
        .catch(error => console.error('Error fetching games:', error));
        }
    )

gamesTotal = document.getElementById('totalGames')
gamesCompleted = document.getElementById('gamesCompleted')
gamesCurrent = document.getElementById('gamesInProgress')
gamesInWishlist = document.getElementById('wishlistCount')
let gt = 0
let gc = 0
let gp = 0
let gw = 0
function getGameStats(){
    fetch('/api/games')
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




getListOfGames()
getGameStats()