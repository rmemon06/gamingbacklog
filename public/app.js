const topGames = document.getElementById('topGames')
const popUp = document.getElementById('popUp')
const popUpTitle = document.getElementById('popUpTitle')
const popUpDescription = document.getElementById('popUpDescription')
const popUpImage = document.getElementById('popUpImage')
const closePopUp = document.getElementById('popUpClose')
const forward = document.getElementById('popUpForward')
const backward = document.getElementById('popUpBackward')
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
                topGames.style.filter = 'blur(5px)'
                popUp.classList.remove('close')
                popUp.classList.add('open')
                popUpTitle.textContent = game.name
                popUpDescription.textContent = game.description
                popUpImage.src = game.image
            });
            container.appendChild(img)
            container.appendChild(h2)
            topGames.appendChild(container)
        })
    })

}

closePopUp.addEventListener('click',    () => {
    topGames.style.filter = 'blur(0px)'
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

getListOfGames()