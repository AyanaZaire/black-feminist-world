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
    let entriesList = document.getElementById("entries-list")
    //console.log(entriesList);
    entries.forEach(entry => {
      allEntries.push(entry)
      // list entries in unordered list
      let li = document.createElement("li")
      //li.id = entry.id
      li.innerHTML = entry.name
      let button = document.createElement("button")
      button.id = entry.id
      button.className = "add-to-favorites"
      button.innerText = "Add to Favorites"
      li.append(button)
      entriesList.append(li)
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
