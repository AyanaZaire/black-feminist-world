ENTRIES_URL = "http://localhost:3000/entries"
FAVORITES_URL = "http://localhost:3000/favorites/"
var allEntries = []

document.addEventListener("DOMContentLoaded", () => {
  //console.log("We live");
  loadEntries()
})

function loadEntries() {
  fetch(ENTRIES_URL)
  .then(resp => resp.json())
  .then(entries => {
    //console.log(entries);
    let entriesList = document.getElementById("index-panel")
    //console.log(entriesList);
    entries.forEach(entry => {
      allEntries.push(entry)
      let entryBioToTrim = entry.bio
      let maxLength = 20
      let trimmedBio = entryBioToTrim.substr(0, maxLength)
      let card =
      `<div class="col">
        <div class="card h-100">
          <img src="${entry.image}" class="card-img-top" alt="${entry.name}">
          <div class="card-body">
            <h5 class="card-title">${entry.name}</h5>
            <p class="card-text"><small class="text-muted">${entry.born}</small></p>
            <p class="card-text">${trimmedBio}...</p>
          </div>
          <div class="card-footer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
              </svg>
          </div>
        </div>
      </div>`

      entriesList.innerHTML += card
    })
    favoriteIndex()
    addToFavoritesHandler()
  })
}

function addToFavoritesHandler() {
  document.addEventListener("click", () => {
    //console.log(event.target);
    if(event.target.className == "add-to-favorites") {
      //console.log(event.target.id);
      let entryId = parseInt(event.target.id)
      addToFavorites(entryId)
    }
  })
}

function addToFavorites(entryId) {
  let data = {entryId: entryId, profileId: 1}
  //console.log(entryId);
  fetch(FAVORITES_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(favorite => {
    //console.log(favorite);
    var favoritedEntry = allEntries.filter(entry => entry.id == favorite.entryId)
    let favoritesDiv = document.getElementById("favorites")
    let singleFav = document.createElement("div")
    //console.log(favoritedEntry[0]);
    singleFav.innerHTML = `<p>${favoritedEntry[0].name}</p><button data-id=${favoritedEntry[0].id}>Remove</button>`
    favoritesDiv.append(singleFav)
  })
}

function favoriteIndex() {
  fetch(FAVORITES_URL)
  .then(resp => resp.json())
  .then(favorites => {
    //console.log(favorites);
    //console.log(allEntries);
    for (var i = 0; i < favorites.length; i++) {
      var favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
      let favoritesDiv = document.getElementById("favorites")
      favoritedEntries.forEach(entry => {
        //console.log(favorites[i].id);
        let singleFav = document.createElement("div")
        singleFav.id = favorites[i].id
        singleFav.className ="favorite-div"
        singleFav.innerHTML = `<p>${entry.name}</p><button class="remove-button" data-id=${favorites[i].id}>Remove</button>`
        favoritesDiv.append(singleFav)
      })
    }
    removeFavoriteHandler(favorites)
    splitFavoriteBios()
  })
}

function removeFavoriteHandler(favorites) {
  document.addEventListener("click", () => {
    if (event.target.className == "remove-button") {
      removeFavorite(favorites, event.target, event.target.dataset.id);
    }
  })
}

function removeFavorite(favorites, button, id) {
  let favoriteToRemove = favorites.filter(fav => fav.id == id)
  let data = favoriteToRemove[0]
  fetch(FAVORITES_URL + `${id}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(favorite => {
    let divToRemove = button.parentElement
    divToRemove.innerHTML = ""
  })
}

function splitFavoriteBios() {
  let poemButton = document.getElementById("generate-poem")
  poemButton.addEventListener("click", () => {
    fetch("http://localhost:3000/favorites")
    .then(response => response.json())
    .then(favorites => {
      if (favorites.length === 0) {
        console.log("No favorites added yet. To add a favorite view entries below.");
        entryIndex()
      } else {
        var singleArrayOfSentences = []
        for (var i = 0; i < favorites.length; i++) {
          favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
          favoritedEntries.forEach(entry => {
            console.log(entry.name, entry.id);
            let splitBio = entry.bio.split(".")
            // push each sentence into a single array
            for (let i = 0, len = splitBio.length; i < len ; i++) {
              singleArrayOfSentences.push(splitBio[i])
            }
          })
        }
        generatePoem(singleArrayOfSentences)
      }
    })
  })
}

// Fisher-Yates (aka Knuth) Shuffle.
// https://stackoverflow.com/a/2450976
function generatePoem(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  //log non-linear narrative
  renderPoem(array)
}

function renderPoem(array) {
  let poemDiv = document.getElementById("poem-div")
  poemDiv.innerText = array
}
