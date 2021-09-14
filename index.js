ENTRIES_URL = "https://bfwd-backend.herokuapp.com/api/v1/entries/"
FAVORITES_URL = "https://bfwd-backend.herokuapp.com/api/v1/favorites/"
var allEntries = []
var allFavorites = []
var authors = []
var arrayOfSentences = []
var submitted=false;

document.addEventListener("DOMContentLoaded", () => {
  //console.log("We live");
  emptyFavorites()
  homeButton()
  loadEntries()
  addToFavoritesHandler()
  aboutPanelHandler()
  contributePanelHandler()
  searchHandler()
  removeFavoriteHandler()
  setTimeout(function() {algorithmHandler()}, 2000)
})

function homeButton() {
  let fixedPanel = document.getElementById('section-to-print')
  let homeButton = document.getElementById("home")
  let body = document.getElementById("body")
  homeButton.addEventListener("click", () => {
    fixedPanel.style.display = "none";
    body.classList.remove("stop-scrolling")
  })
}

function loadEntries() {
  fetch(ENTRIES_URL)
  .then(resp => resp.json())
  .then(entries => {
    let entriesList = document.getElementById("index-panel")
    //console.log(entriesList);
    entries.forEach(entry => {
      allEntries.push(entry)
      let entryBioToTrim = entry.bio
      let maxLength = 120
      let trimmedBio = entryBioToTrim.substr(0, maxLength)
      let card =
      `<div class="col">
        <div class="card h-100 border-light" style="background-color:black;">
          <img src="${entry.image}" class="card-img-top" alt="${entry.name}">
          <div class="card-body">
            <h5 class="card-title">${entry.name}<sup>${entry.id}</sup></h5>
            <p class="card-text"><small>b. ${entry.born}</small></p>
            <p class="card-text">${trimmedBio}...</p>
          </div>
          <div class="card-footer">
            <div class="row" id="plus-and-zoom">
             <div class="col-6">
               <i class="bi bi-plus-circle" data-class="add-to-favorites" id=${entry.id}></i>
             </div>
             <div class="col-6 text-end">
               <i class="bi bi-arrows-fullscreen" data-class="show-button" id=${entry.id}></i>
             </div>
           </div>
          </div>
          </div>

      </div>`

      entriesList.innerHTML += card
    })
  })
}

function addToFavoritesHandler() {
  document.addEventListener("click", () => {
    if(event.target.dataset.class == "add-to-favorites") {
      console.log("Add to favorites handler", event.target.id);
      let entryId = parseInt(event.target.id)
      addToFavorites(entryId)
    }
  })
}

function addToFavorites(entryId) {
  let data = {entry_id: entryId}
  fetch(FAVORITES_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(favorite => {
    console.log("favorite added:", favorite);
    allFavorites.push(favorite)
    var favoritedEntry = allEntries.filter(entry => entry.id == favorite.entry_id)
    let favoritesDiv = document.getElementById("favorites")
    favoritesDiv.innerHTML += `<button type="button" class="btn btn-outline-light fav-btn" data-class="remove-button" id=${favorite.id}><i class="bi bi-x-circle"></i> ${favoritedEntry[0].name}</button>  `
    algorithmHandler()
    let select = document.getElementById("choose-algorithm")
    select.selectedIndex = 0
  })
}

function favoriteIndex() {
  fetch(FAVORITES_URL)
  .then(resp => resp.json())
  .then(favorites => {
    favorites.forEach(fav => {allFavorites.push(fav)});
    console.log(allFavorites);
    for (var i = 0; i < favorites.length; i++) {
      var favoritedEntries = allEntries.filter(entry => {
        return entry.id == favorites[i].entry_id
      })
      let favoritesDiv = document.getElementById("favorites")
      favoritedEntries.forEach(entry => {
        favoritesDiv.innerHTML += `<button type="button" class="btn btn-outline-light fav-btn" data-class="remove-button" id=${favorites[i].id}><i class="bi bi-x-circle"></i> ${entry.name}</button>`
      })
    }
    //splitFavoriteBios()
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
  let fixedPanel = document.getElementById('section-to-print')
  fixedPanel.style.display = "block";
  let body = document.getElementById("body")
  body.classList.add("stop-scrolling")
  //showPanel.innerHTML = ""
  let entryToShow = allEntries.filter(entry => entry.id == id)
  console.log(entryToShow[0]);
  let singleEntry =
  `<br>
    <img src="${entryToShow[0].image}" class="col-4 float-start" alt="${entryToShow[0].name}" style="margin-right: 20px;">
      <h5 class="card-title">${entryToShow[0].name}</h5>
      <p class="card-text"><small>${entryToShow[0].birthplace} — ${entryToShow[0].born}</small></p>
      <p>${entryToShow[0].bio}</p>
      <a href="${entryToShow[0].source}"><small>by ${entryToShow[0].author}</small></a>
`
  showPanel.innerHTML = singleEntry
}

function removeFavoriteHandler() {
  document.addEventListener("click", () => {
    if (event.target.dataset.class == "remove-button") {
      console.log("remove favorite", event.target);
      removeFavorite(event.target, event.target.id);
    }
  })
}

function removeFavorite(button, id) {
  let favoriteToRemove = allFavorites.filter(fav => fav.id == id)
  console.log("favorite to remove", id, favoriteToRemove[0], allFavorites.indexOf(favoriteToRemove[0]));
  let indexToRemove = allFavorites.indexOf(favoriteToRemove[0])
  if (indexToRemove > -1) {
    allFavorites.splice(indexToRemove, 1);
  }
  console.log("after splice", allFavorites);
  let data = favoriteToRemove[0]
  fetch(FAVORITES_URL + `${id}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(favorite => {
    button.parentNode.removeChild(button)
    //favoriteIndex()
    algorithmHandler()
    let select = document.getElementById("choose-algorithm")
    select.selectedIndex = 0
  })
}

function emptyFavorites() {
  fetch("https://bfwd-backend.herokuapp.com/api/v1/reload")
  .then(response => response.json())
  .then(deletedFavorites => {
    console.log(deletedFavorites);
    favoriteIndex()
  })
}

function searchHandler() {
  let searchButton = document.getElementById("search-button")
  searchButton.addEventListener("click", () => {
    event.preventDefault()
    let input = document.getElementById("search-input").value.toLowerCase()
    let results = allEntries.filter(entry => {
      let lowerCaseName = entry.name.toLowerCase()
      return lowerCaseName.includes(input)
    })
    let entriesList = document.getElementById("index-panel")
    entriesList.innerHTML = ""
    results.forEach(entry => {
      //allEntries.push(entry)
      let entryBioToTrim = entry.bio
      let maxLength = 120
      let trimmedBio = entryBioToTrim.substr(0, maxLength)
      let card =
      `<div class="col">
        <div class="card h-100 border-light" style="background-color:black;">
          <img src="${entry.image}" class="card-img-top" alt="${entry.name}">
          <div class="card-body">
            <h5 class="card-title">${entry.name}<sup>${entry.id}</sup></h5>
            <p class="card-text"><small>b. ${entry.born}</small></p>
            <p class="card-text">${trimmedBio}...</p>
          </div>
          <div class="card-footer">
            <div class="row" id="plus-and-zoom">
             <div class="col-6">
               <i class="bi bi-plus-circle" data-class="add-to-favorites" id=${entry.id}></i>
             </div>
             <div class="col-6 text-end">
               <i class="bi bi-arrows-fullscreen" data-class="show-button" id=${entry.id}></i>
             </div>
           </div>
          </div>
          </div>

      </div>`

      entriesList.innerHTML += card
    })
  })
}

// Fisher-Yates (aka Knuth) Shuffle.
// https://stackoverflow.com/a/2450976
function fisherYates(array, favoritedEntries) {
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
  console.log("fisher array", array);
  renderPoem(array, favoritedEntries)
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
    let select = document.getElementById("choose-algorithm")
    select.selectedIndex = 0
    //if (array.length == 0) {
      //alert("Add entries to your favorites to generate a narrative <3")
    //} else {
      let authorsDiv = document.getElementById("authors")
      authorsDiv.innerHTML =""
      let showPanel = document.getElementById("show-panel")
      let fixedPanel = document.getElementById('section-to-print')
      fixedPanel.style.display = "block";
      let body = document.getElementById("body")
      body.classList.add("stop-scrolling")
      //take print button out of "section to print" div
      let printButton = `<br><br><button onclick="window.print()">Print</button>`
      // authors.forEach(entry => {
      //   authorsDiv.innerHTML +=
      //   `<h5>${entry.name}<sup>${entry.id}</sup> (b.${entry.born}),</h5>`
      // })

      for (var i = 0; i < allFavorites.length; i++) {
        favoritedEntries = allEntries.filter(entry => entry.id == allFavorites[i].entry_id)
        console.log(favoritedEntries);
        authorsDiv.innerHTML +=
        `<h5>${favoritedEntries[0].name}<sup>${favoritedEntries[0].id}</sup> (b.${favoritedEntries[0].born}),</h5>`
      }

      showPanel.innerHTML = array + printButton
    //}
  })
}

function algorithmHandler() {
  console.log("all favs", allFavorites);
  //console.log("fetched favs", favorites);
  var singleArrayOfSentences = []
  for (var i = 0; i < allFavorites.length; i++) {
    favoritedEntries = allEntries.filter(entry => entry.id == allFavorites[i].entry_id)
    favoritedEntries.forEach(entry => {
      //console.log(entry.name, entry.id);
      //authors.push(entry)
      let splitBio = entry.bio.split(".")
      // push each sentence into a single array
      for (let i = 0, len = splitBio.length; i < len ; i++) {
        singleArrayOfSentences.push(splitBio[i])
      }
    })
  }
  var arrayOfSentences = singleArrayOfSentences

  let select = document.getElementById("choose-algorithm")
  //console.log(select);
  select.addEventListener("change", () => {
    if (event.target.id == "choose-algorithm") {
      console.log("in choose algo");
      if (event.target.selectedOptions.choose) {
        console.log("choose");
      }else if (event.target.selectedOptions.fisher) {
        console.log("fisher shuffle");
        console.log(arrayOfSentences);
        fisherYates(arrayOfSentences)
      }else if (event.target.selectedOptions.naive) {
        console.log("naive shuffle");
        naiveShuffle(arrayOfSentences)
      }else {
        console.log("quick");
        var sortedArray = quickSort(arrayOfSentences);
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
  let fixedPanel = document.getElementById('section-to-print')
  fixedPanel.style.display = "block";
  let body = document.getElementById("body")
  body.classList.add("stop-scrolling")
  authorsDiv.innerHTML = ""
  //https://www.developerdrive.com/add-google-forms-static-site/
  //https://youtu.be/0udw0nol6Po
  showPanel.innerHTML = `
  <h2>Contribute to the Database</h2>
  <br><br><br>
  <p>Unlike many definitions that deploy binary language to define Black feminism, my current working definition of a Black feminist is anyone who makes the world more livable for humans, non-humans, and everything between/beyond. Black feminism can be defined as cultural work, practice, praxis, daily acts, social life, and/or care work that makes life more livable and refuses death doling practices. The definition doesn’t aim to erase the work of the Black women who planted the seeds of Black feminism. Instead this definition expands it — this ethos transcends gender, sex, binaries, and species.</p>
  <p>If this sounds like you or someone you know, please feel free to seed a Black feminist you know and/or admire in the database through completing the form below.</p>
  <script type="text/javascript"></script>
  <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"
  onload="if(submitted) {successfulForm()}"></iframe>

  <form class="row g-3" id="contribute-form" action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSc4ky1dawhwFChf5DHV3VftjwhQAY173KGAyCMZWVrii8p6jQ/formResponse" target="hidden_iframe" onsubmit="submitted=true;">
  <h5>Please input You Info Below</h5>
  <div class="col-md-6">
    <label for="your-name" class="form-label">Your Name</label>
    <input type="text" name="entry.936939529" class="form-control" id="your-name">
  </div>
    <div class="col-md-6">
      <label for="your-email" class="form-label"> Your Email</label>
      <input type="email" name="entry.1141117242" class="form-control" id="your-email">
    </div>
    <br>
    <h5>Please input Black Feminist's Info Below</h5>
    <div class="col-md-6">
      <label for="name" class="form-label">Name</label>
      <input type="text" name="entry.101020486" class="form-control" id="name">
    </div>
    <div class="col-6">
      <label for="birth-place" class="form-label">Birthplace</label>
      <input type="text" name="entry.736292077" class="form-control" id="birth-place" placeholder="Montgomery, AL">
    </div>
    <div class="col-6">
      <label for="birth-year" class="form-label">Birth Year</label>
      <input type="text" name="entry.1108668266" class="form-control" id="birth-year">
    </div>
    <div class="col-md-6">
      <label for="death" class="form-label">Death Year</label>
      <input type="text" name="entry.824143011" class="form-control" id="death" placeholder="Put N/A if still alive">
    </div>
    <div class="col-md-12">
      <label for="image" class="form-label">Image URL</label>
      <input type="text" name="entry.219552856" class="form-control" id="image" placeholder="http://image.jpg">
    </div>
    <div class="col-md-12">
      <label for="entry" class="form-label">Entry Text</label>
      <textarea type="textarea" name="entry.153088299" class="form-control" id="entry"></textarea>
    </div>
    <div class="col-md-6">
      <label for="author" class="form-label">Author of Text</label>
      <input type="text" name="entry.2085592593" class="form-control" id="author" placeholder="Who wrote/spoke it?">
    </div>
    <div class="col-md-6">
      <label for="source" class="form-label">Source URL</label>
      <input type="text" name="entry.213061223" class="form-control" id="source" placeholder="Where did you find this text?">
    </div>
    <div class="col-12">
      <button type="submit" id="form-submit" class="btn btn-outline-light">Submit</button>
    </div>
</form>
<br><br>
<h5>Future Contribution Guidelines</h5>
<br>
<p>In the future, the Black Feminist World Database (BFWD) will be an open source project hosted and maintained via GitHub. Coming soon are contribution guidelines for how to contribute to the current BFWD GitHub repository by creating a pull request. Through creating a pull request to the Black Feminist World repository you will be able to submit an entry to the database, change the text on this page, and/or improve the code of the web app! Once you submit the pull request, we will have a chance to review it, and once/if the request is approved you would get a notification from GitHub!</p>
<p>Look out for future demo videos on submitting an entry by making a pull request to the BFWD repo.</p>
  `
  // contributeFormHandler()
}

function successfulForm() {
  let showPanel = document.getElementById("show-panel")
  let authorsDiv = document.getElementById("authors")
  authorsDiv.innerHTML = ""
  let body = document.getElementById("body")
  body.classList.add("stop-scrolling")
  showPanel.innerHTML =
  `<h3>Thank you for your contribution to the Database!</h3>`
}

// function contributeFormHandler() {
//   let form = document.querySelector("#contribute-form")
//   form.addEventListener("submit", () => {
//     event.preventDefault()
//     const yourName = document.querySelector("#your-name").value
//     const yourEmail = document.querySelector("#your-email").value
//     const name = document.querySelector("#name")
//     const birthPlace = document.querySelector("#birth-place")
//     const birthYear = document.querySelector("#birth-year")
//     const death = document.querySelector("#death")
//     const image = document.querySelector("#image")
//     const entry = document.querySelector("#entry")
//     const author = document.querySelector("#author")
//     const source = document.querySelector("#source")
//
//     const body = JSON.stringify({
//       "entry.936939529": yourName,
//       "entry.1141117242": yourEmail
//     })
//
//     console.log(body);
//
//     const headers = {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//       },
//       body: body
//     }
//
//     const encodedURL = encodeURI("https://docs.google.com/forms/u/0/d/e/1FAIpQLSc4ky1dawhwFChf5DHV3VftjwhQAY173KGAyCMZWVrii8p6jQ/formResponse")
//
//     fetch(encodedURL, headers)
//     .then(res => res.json())
//     .then(entry => {
//       console.log(entry);
//     })
//
//   })
// }

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
  let fixedPanel = document.getElementById('section-to-print')
  fixedPanel.style.display = "block";
  let body = document.getElementById("body")
  body.classList.add("stop-scrolling")
  authorsDiv.innerHTML = ""
  showPanel.innerHTML =
  `<h2>Black Feminist World Database</h2>
  <br><br><br>
  <p>The <i>Black Feminist World Database</i> (BFWD) is a collection of found text regarding Black feminist world building visioning, theory, and labor throughout history. The BFWD is a website where you can publicly access the seed data used in <a href="https://www.patreon.com/seedapress"><i>Daily Seed</i></a> and generate your own non-linear narratives using a growing variety of “sorting algorithms”.</p>
  <br>
  <p>Unlike some definitions that deploy binary language to define Black feminism, my current working definition of a Black feminist is anyone who makes the world more livable for humans, non-humans, and everything between/beyond. This definition doesn't aim to erase the work of the Black women who planted the seeds of Black feminism. Instead this definition expands it — this ethos transcends gender, sex, binaries, and species. If you are Black and have made the world more livable, you might find yourself in this database and one of the Daily Seed zines. If you would like to be removed please email <a href="mailto:blackfeministworld@gmail.com">blackfeministworld@gmail.com</a> and you will be removed immediately.</p>
  <br>
  Want to flag a bug in the website? We appreciate it! Please send us an email <a href="mailto:blackfeministworld@gmail.com">here</a>.
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
