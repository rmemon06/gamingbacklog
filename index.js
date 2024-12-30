

const getbutton = document.getElementById('Getting')
const listOfGames = document.getElementById('gamesList')

//function to list all the games within my json file
function getListOfGames(){
    fetch('/api/games')
    .then(res => res.json())
    .then(data => {
        data.forEach(game => {
            const li = document.createElement('li')
            li.textContent = game.name
            li.addEventListener('click', () => {
                li.textContent = game.name +": " +  game.description
            })
            listOfGames.appendChild(li)
        })
    })

}

getListOfGames()


