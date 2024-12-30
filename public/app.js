const topGames = document.getElementById('topGames')
const popUp = document.getElementById('popUp')
const popUpTitle = document.getElementById('popUpTitle')
const popUpDescription = document.getElementById('popUpDescription')
const popUpImage = document.getElementById('popUpImage')
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

getListOfGames()