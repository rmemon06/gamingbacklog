const topGames = document.getElementById('topGames')
const allGames = document.getElementById('allGames')
const wishlist = document.getElementById('wishlist')
const gamesPlaying = document.getElementById('gamesPlaying')
const gamesToPlay = document.getElementById('gamesToPlay')
const popUp = document.getElementById('popUp')
const popUpTitle = document.getElementById('popUpTitle')
const popUpDescription = document.getElementById('popUpDescription')
const popUpImage = document.getElementById('popUpImage')
const closePopUp = document.getElementById('popUpClose')
const forward = document.getElementById('popUpForward')
const backward = document.getElementById('popUpBackward')
const linkedIn = document.getElementById('linkedin')
const page = document.body.id
function getListOfGames(){
    fetch('/api/games')
    .then(res => res.json())
    .then(data => {
        data.forEach(game => {
            const container = document.createElement('div')
            container.className = 'gameContainer'
            const img = document.createElement('img')
            img.src = game.image
            const h2 = document.createElement('h2')
            h2.textContent = game.name
            img.addEventListener('click', () => {
                if(page==='allGamesPage'){
                    allGames.style.filter = 'blur(5px)'
                }
                if(page==='topGamesPage'){
                    topGames.style.filter = 'blur(5px)'
                }
                if(page==='wishlistPage'){
                    wishlist.style.filter = 'blur(5px)'
                }
                if(page==='gamesPlayingPage'){
                    gamesPlaying.style.filter = 'blur(5px)'
                }
                if(page==='gamesToPlayPage'){
                    gamesToPlay.style.filter = 'blur(5px)'
                }
                popUpImage.src = game.image
                popUp.classList.remove('close')
                popUp.classList.add('open')
                popUpTitle.textContent = game.name
                popUpDescription.textContent = game.description
               
            });
            
            container.appendChild(img)
            container.appendChild(h2)
            if(page === 'allGamesPage' && game.list.includes(1)){
                allGames.appendChild(container)
            }
            if(page === 'topGamesPage' && game.list.includes(4)){
                topGames.appendChild(container)
            }
            if(page === 'gamesToPlayPage' && game.list.includes(2)){
                gamesToPlay.appendChild(container)
            }
            if(page === 'gamesPlayingPage' && game.list.includes(3)){
                gamesPlaying.appendChild(container)
            }
            if(page === 'wishlistPage' && game.list.includes(5)){
                wishlist.appendChild(container)
            }
           
        })
    })

}

closePopUp.addEventListener('click',    () => {
    if(page==='allGamesPage'){
        allGames.style.filter = 'blur(0px)'
    }
    if(page==='topGamesPage'){
        topGames.style.filter = 'blur(0px))'
    }
    if(page==='gamesToPlayPage'){
        gamesToPlay.style.filter = 'blur(0px)'
    }
    if(page==='gamesPlayingPage'){
        gamesPlaying.style.filter = 'blur(0px))'
    }
    if(page==='wishlistPage'){
        wishlist.style.filter = 'blur(0px))'
    }

    popUp.classList.add('close')
    popUp.classList.remove('open')
  
});

forward.addEventListener('click', () => {
    const gameName = popUpTitle.textContent
    fetch('/api/games')
    .then(res => res.json())
    .then(data => {
        data.forEach((game) => {
           if(game.name == gameName){
               const index = data.indexOf(game)
               const nextGame = data[index + 1]
               popUpTitle.textContent = nextGame.name
               popUpDescription.textContent = nextGame.description
               popUpImage.src = nextGame.image
           }
        }  )
        })
    }
    )
    console.log("hiiiii")
    backward.addEventListener('click', () => {
        const gameName = popUpTitle.textContent
        fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            data.forEach((game) => {
               if(game.name == gameName){
                   const index = data.indexOf(game)
                   const nextGame = data[index -1]
                   popUpTitle.textContent = nextGame.name
                   popUpDescription.textContent = nextGame.description
                   popUpImage.src = nextGame.image
               }
            }  )
            })
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