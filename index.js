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

            <div class="row">
             <div class="col-md-3">
               <i class="bi bi-plus-circle" data-class="add-to-favorites" id=${entry.id}></i>
             </div>
             <div class="col-md-3 ms-auto">
               <i class="bi bi-arrows-fullscreen"></i>
             </div>
           </div>
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
    if(event.target.dataset.class == "add-to-favorites") {
      //console.log(event.target.id);
      let entryId = parseInt(event.target.id)
      addToFavorites(entryId)
    }
  })
}

function addToFavorites(entryId) {
  let data = {entryId: entryId, profileId: 1}
  fetch(FAVORITES_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(favorite => {
    var favoritedEntry = allEntries.filter(entry => entry.id == favorite.entryId)
    let favoritesDiv = document.getElementById("favorites")
    favoritesDiv.innerHTML += `<button type="button" class="btn btn-outline-light" data-class="remove-button" id=${favorite.id}><i class="bi bi-x-circle"></i> ${favoritedEntry[0].name}</button>  `
  })
}

function favoriteIndex() {
  fetch(FAVORITES_URL)
  .then(resp => resp.json())
  .then(favorites => {
    for (var i = 0; i < favorites.length; i++) {
      var favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
      let favoritesDiv = document.getElementById("favorites")
      favoritedEntries.forEach(entry => {
        console.log(entry.id, favorites[i].id);
        favoritesDiv.innerHTML += `<button type="button" class="btn btn-outline-light" data-class="remove-button" id=${favorites[i].id}><i class="bi bi-x-circle"></i> ${entry.name}</button>  `
      })
    }
    removeFavoriteHandler(favorites)
    splitFavoriteBios()
    showEntryHandler()
  })
}



function removeFavoriteHandler(favorites) {
  document.addEventListener("click", () => {
    if (event.target.dataset.class == "remove-button") {
      removeFavorite(favorites, event.target, event.target.id);
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
  .then(response => response.json())
  .then(favorite => {
    button.parentNode.removeChild(button)
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
