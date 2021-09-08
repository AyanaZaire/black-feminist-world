ENTRIES_URL = "http://localhost:3000/entries"
FAVORITES_URL = "http://localhost:3000/favorites/"
var allEntries = []
var authors = []
var arrayOfSentences = []

document.addEventListener("DOMContentLoaded", () => {
  //console.log("We live");
  loadEntries()
  aboutPanelHandler()
  contributePanelHandler()
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
      let maxLength = 70
      let trimmedBio = entryBioToTrim.substr(0, maxLength)
      let card =
      `<div class="col">
        <div class="card h-100 border-light" style="background-color:black;">
          <img src="${entry.image}" class="card-img-top" alt="${entry.name}">
          <div class="card-body">
            <h5 class="card-title">${entry.name}</h5>
            <p class="card-text"><small>b. ${entry.born}</small></p>
            <p class="card-text">${trimmedBio}...</p>
            <p class="card-text"><small>ID: ${entry.id}</small></p>
          </div>
          <div class="card-footer">

            <div class="row" id="plus-and-zoom">
             <div class="col-md-3">
               <i class="bi bi-plus-circle" data-class="add-to-favorites" id=${entry.id}></i>
             </div>
             <div class="col-md-3 ms-auto">
               <i class="bi bi-arrows-fullscreen" data-class="show-button" id=${entry.id}></i>
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
        favoritesDiv.innerHTML += `<button type="button" class="btn btn-outline-light" data-class="remove-button" id=${favorites[i].id}><i class="bi bi-x-circle"></i> ${entry.name}</button>  `
      })
    }
    removeFavoriteHandler(favorites)
    splitFavoriteBios()
    showEntryHandler()
  })
}

function showEntryHandler() {
  document.addEventListener("click", () => {
    if (event.target.dataset.class == "show-button") {
      showEntry(event.target.id);
    }
  })
}

function showEntry(id) {
  let authorsDiv = document.getElementById("authors")
  authorsDiv.innerHTML = ""
  let showPanel = document.getElementById("show-panel")
  //showPanel.innerHTML = ""
  let entryToShow = allEntries.filter(entry => entry.id == id)
  console.log(entryToShow[0]);
  let singleEntry =
  `<br>
  <div class="clearfix">
    <img src="${entryToShow[0].image}" class="col-md-4 float-md-start" alt="${entryToShow[0].name}" style="margin-right: 20px;">
    <div >
      <h5 class="card-title">${entryToShow[0].name}</h5>
      <p class="card-text"><small>${entryToShow[0].birthplace} — ${entryToShow[0].born}</small></p>
      <p>${entryToShow[0].bio}</p>
      <a href="${entryToShow[0].source}"><small>by ${entryToShow[0].author}</small></a>
    </div>
  </div>
`
  showPanel.innerHTML = singleEntry
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
  //let poemButton = document.getElementById("generate-poem")
  //poemButton.addEventListener("click", () => {
    fetch("http://localhost:3000/favorites")
    .then(response => response.json())
    .then(favorites => {
      // if (favorites.length === 0) {
      //   console.log("No favorites added yet. To add a favorite view entries below.");
      //   //entryIndex()
      // } else {
        var singleArrayOfSentences = []
        for (var i = 0; i < favorites.length; i++) {
          favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
          favoritedEntries.forEach(entry => {
            //console.log(entry.name, entry.id);
            authors.push(entry)
            let splitBio = entry.bio.split(".")
            // push each sentence into a single array
            for (let i = 0, len = splitBio.length; i < len ; i++) {
              singleArrayOfSentences.push(splitBio[i])
            }
          })
        }
        var arrayOfSentences = singleArrayOfSentences
        //fisherYates(singleArrayOfSentences)
        algorithmHandler(arrayOfSentences)
      //}
    })
  //})
}

// Fisher-Yates (aka Knuth) Shuffle.
// https://stackoverflow.com/a/2450976
function fisherYates(array) {
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
  //console.log("fisher array", array);
  renderPoem(array)
}

// Quick Sort: https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-1.php
function quickSort(origArray) {
	if (origArray.length <= 1) {
		return origArray;
	} else {

		var left = [];
		var right = [];
		var newArray = [];
		var pivot = origArray.pop();
		var length = origArray.length;

		for (var i = 0; i < length; i++) {
			if (origArray[i] <= pivot) {
				left.push(origArray[i]);
			} else {
				right.push(origArray[i]);
			}
		}

		return newArray.concat(quickSort(left), pivot, quickSort(right));
	}
}

// Bubble Sort: https://www.geeksforgeeks.org/bubble-sort-algorithms-by-using-javascript/
function naiveShuffle(array) {
  var n = array.length, i = -1, j, k;
  while (++i < n) {
    j = Math.floor(Math.random() * n);
    k = Math.floor(Math.random() * n);
    t = array[j];
    array[j] = array[k];
    array[k] = t;
  }
  renderPoem(array);
}

function renderPoem(array) {
  let poemButton = document.getElementById("generate-poem")
  poemButton.addEventListener("click", () => {
    let authorsDiv = document.getElementById("authors")
    authorsDiv.innerHTML =""
    let showPanel = document.getElementById("show-panel")
    //take print button out of "section to print" div
    let printButton = `<br><br><button onclick="window.print()">Print</button>`
    authors.forEach(entry => {
      authorsDiv.innerHTML += `<h5>${entry.name}<sup>${entry.id}</sup> (b.${entry.born}),</h5>`
    })
    showPanel.innerHTML = array + printButton
  })
}

function algorithmHandler(array) {
  //console.log(array);
  document.addEventListener("change", () => {
    console.log("changing...");
    if (event.target.id == "choose-algorithm") {
      if (event.target.selectedOptions.choose) {
        console.log("choose");
      }else if (event.target.selectedOptions.fisher) {
        console.log("fisher shuffle");
        fisherYates(array)
      }else if (event.target.selectedOptions.naive) {
        console.log("naive shuffle");
        naiveShuffle(array)
      }else {
        console.log("quick");
        var sortedArray = quickSort(array);
        renderPoem(sortedArray);
      }
    }
  })
}

function contributePanelHandler() {
  // event listener for about "link" click
  document.addEventListener("click", () => {
    if (event.target.id == "contribute-link") {
      console.log(event.target);
      contributePanelRender()
    }
  })
}

function contributePanelRender() {
  let showPanel = document.getElementById("show-panel")
  let authorsDiv = document.getElementById("authors")
  authorsDiv.innerHTML = ""
  showPanel.innerHTML = `
  <h2>Contribution Guide</h2>
  `
}

function aboutPanelHandler() {
  // event listener for about "link" click
  document.addEventListener("click", () => {
    if (event.target.id == "about-link") {
      console.log(event.target);
      aboutPanelRender()
    }
  })
}

function aboutPanelRender() {
  let showPanel = document.getElementById("show-panel")
  let authorsDiv = document.getElementById("authors")
  authorsDiv.innerHTML = ""
  showPanel.innerHTML =
  `<h2>Black Feminist World Database</h2>
  <br><br><br>
  <p>The <i>Black Feminist World Database</i> (BFWD) is a collection of found text regarding Black feminist world building visioning, theory, and labor throughout history. The BFWD is a website where you can publicly access the seed data used in <a href="https://www.patreon.com/seedapress"><i>Daily Seed</i></a> and generate your own non-linear narratives using a growing variety of “sorting algorithms”.</p>
  <br>
  <p>Unlike some definitions that deploy binary language to define Black feminism, my current working definition of a Black feminist is anyone who makes the world more livable for humans, non-humans, and everything between/beyond. This definition doesn't aim to erase the work of the Black women who planted the seeds of Black feminism. Instead this definition expands it — this ethos transcends gender, sex, binaries, and species. If you are Black and have made the world more livable, you might find yourself in this database and one of the Daily Seed zines. If you would like to be removed please email <a href="mailto:blackfeministworld@gmail.com">blackfeministworld@gmail.com</a> and you will be removed immediately.</p>
  <br><br><br>
  <h2>Daily Seed by Seeda Press</h2>
  <center>
  <img src="https://d2w9rnfcy7mm78.cloudfront.net/12283086/original_83fd751315cbdf6f17e57c31ea917e7b.png?1623881166?bc=0" width="300" height="300"/>
  </center>
  <p><a href="https://www.patreon.com/seedapress"><i>Daily Seed</i></a> is a monthly zine series featuring algorithmically generated nonlinear narratives using the seed data from the Black Feminist World database. <i>Daily Seed</i> takes it’s name from <a href="https://www.patreon.com/seedapress">Seeda Press</a> and Daily Bread (a monthly devotional zine). Through collaborating with the computer to sculpt nonlinear narrative one can remember the history of this worldbuilding work and use seed data as source material to play with language, inspire alternative forms, and imagine new worlds. Supporting multiple functions this project can be used for learning, meditations, and ceremonies of reverence and remembrance.</p>
  <br>
  Seeda Press, a publishing platform for Black feminists engaged in transdisciplinary practice, takes it's name from the computer science concept, <a href="https://en.wikipedia.org/wiki/Database_seeding">"database seeding"</a>. <a href="https://www.learnentityframeworkcore.com/migrations/seeding">Learn Entity Framework Core</a> defines seed data as, "data that you populate the database with at the time it is created. You use seeding to provide initial values for lookup lists, for demo purposes, proof of concepts etc." This project explores the ways in which Black feminist worldbuilding and care work has provided the initial values for liberation and the new world.
  <br><br><br>
  <h2>Invest</h2>
  <br><br><br>
  <p>What do we owe the archive? Not only does your support power the printing, materials, and labor of this project but it affirms the mission and vision. The mission is to cultivate a daily practice of reverence around Black feminist worldbuilding in order to imagine new worlds by remembering our current one. The vision is to redistribute resources to the living archive.
  <br><br>
  If you've learned or enjoyed anything from this database and/or want to see more algorithms or features implemented, consider investing in this project. Maintaining this database requires time and labor. If you want to sustain this work long term and get a monthly digital and/or print zine consider joining the <a href="https://www.patreon.com/seedapress">Seeda Press</a> patreon. If you'd rather make a one time investment, send contribution via <a href="https://venmo.com/u/Ayana-Zaire">@Ayana-Zaire (Venmo)</a> or <a href="https://cash.app/$AyanaZaire">$AyanaZaire (Cash App)</a>. Thank you.</p>
  <br><br><br>
  <h2>Citations</h2>
  <br><br><br>
  <p>1. Alexis Pauline Gumbs</p>
  <p>2. N.K Jemisin </p>
  <p>3. Cassandra Press</p>
  <p>4. Sojourner Truth</p>
  <p>5. The Quilters of Gee's Bend</p>
  <p>6. United Order of the Tents</p>
  <p>7. Octavia Butler</p>
  <p>8. Hermetic State</p>
  <p>9. Chelsea M. Frazier</p>
  <br><br><br>
  <small>The Black Feminist World Database is stewarded and developed by Ayana Zaire Cotton and was made at the <a href="https://www.recurse.com/">Recurse Center</a>.<br>
  <a href="https://www.instagram.com/seedapress/">@seedapress</a><br>
  <a href="mailto:blackfeministworld@gmail.com">blackfeministworld@gmail.com</a><br>
  </small>
  `
}
