/*  A learning library stocked with Black Feminist STEAM in Javascript V8 3.14.5.9
Execute using NodeJS

STEP 1
Install external modules
1. install JSON server: npm install -g json-server (https://www.npmjs.com/package/json-server#getting-started)
2. install prompt: npm install prompt (https://github.com/flatiron/prompt)
3. install node-fetch: npm i node-fetch --save (https://github.com/node-fetch/node-fetch)

STEP 2
Run the Server (Seed data stored using JSON server)
1. See db.json file in this directory
2. Navigate to this project's directory in your console
3. Paste the following in the console to start the JSON server: json-server --watch db.json

STEP 3
1. While the server is running in the console, open another tab in the same project directory
2. Paste the following in the console to launch the library: node index.js
*/

const prompt = require('prompt');
const fetch = require("node-fetch");

let menu = {
    1: "View Library",
    2: "View Favorites",
    3: "Add to Favorites",
    4: "Edit Favorites",
    5: "Generate Poem",
    6: "Leave the Library"
};

function loadEntires() {
  fetch("http://localhost:3000/entries")
  .then(response => response.json())
  .then(entries => {
    // move conditional outside of fetch?
    if (allEntries.length === 0) {
      entries.forEach(entry => {
        allEntries.push(entry)
      })
    } else {
      return allEntries
    }
  })
}

function entryIndex() {
  allEntries.forEach(entry => {
    console.log(entry.id, entry.name);
  })
  console.log("If you wish to view a single entry and/or add it to your favorites, please input the corresponding number below.");
  prompt.start();
  prompt.get(['entry'], function (err, result) {
    console.log('Command-line input received:');
    viewEntry(result.entry)
  });
}

function viewEntry(id) {
  fetch(`http://localhost:3000/entries/${parseInt(id)}`)
  .then(response => response.json())
  .then(entry => {
    console.log('\n' +
      "Name:", entry.name + '\n' +
      "Year Born:", entry.born + '\n' +
      "Birthplace:", entry.birthplace + '\n' +
      "Bio:", entry.bio + '\n');
    console.log("Do you wish to add this entry to your Favorites? Please input yes or no below.");
    prompt.start();
    prompt.get(['input'], function (err, result) {
      console.log('Yes/no input received:');
      if (result.input == "yes") {
        addFavorite(entry)
      }
      if (result.input == "no") {
        launchLibrary()
      }
    });
  })
}

function favoriteIndex() {
  fetch("http://localhost:3000/favorites")
  .then(response => response.json())
  .then(favorites => {
    if (favorites.length === 0) {
      console.log("No favorites added yet. To add a favorite view entries below.");
      entryIndex()
    } else {
      for (var i = 0; i < favorites.length; i++) {
        favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
        favoritedEntries.forEach(entry => {
          console.log('\n' +
            "Entry ID:", entry.id + '\n' +
            "Name:", entry.name + '\n' +
            "Year Born:", entry.born + '\n' +
            "Birthplace:", entry.birthplace + '\n' +
            "Bio:", entry.bio + '\n');
        })
      }
      removeFavorite(favorites)
    }
  })
}

function removeFavorite(favorites) {
  console.log("If you would like to remove an entry from your favorites, please input the corresponding Entry ID below. If you would like to return to main menu type, menu");
  prompt.start();
  prompt.get(['entry'], function (err, result) {
    console.log('Command-line input received:', result.entry);
    if (result.entry == "menu") {
      launchLibrary()
    } else {
      let removedFavorites = favorites.filter(favorite => favorite.entryId == result.entry)
      let removedFavorite = removedFavorites[0]
      fetch(`http://localhost:3000/favorites/${removedFavorite.id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(removedFavorite)
      })
      .then(response => response.json())
      .then(deletedFavorite => {
        console.log("Entry removed from favorites successfully! View current favorites below:");
        favoriteIndex()
      })
    }
  });
}

function addFavorite(entry) {
  let favorite = {
    entryId: entry.id,
    profileId: 1
  }
  fetch("http://localhost:3000/favorites", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(favorite)
  })
  .then(response => response.json())
  .then(favorite => {
    console.log("Favorite added:", entry.name)
    launchLibrary()
  })
}

// IDEA: Generates a poem using the bio's of your favorited entries
function splitFavoriteBios() {
  fetch("http://localhost:3000/favorites")
  .then(response => response.json())
  .then(favorites => {
    if (favorites.length === 0) {
      console.log("No favorites added yet. To add a favorite view entries below.");
      entryIndex()
    } else {
      // BUG: Do I need to make a fetch request for each favorite? Or can I simply filter through entries?
      var singleArrayOfSentences = []
      favorites.forEach(favorite => {
        // creating a class for entries would get rid of this duplicate fetch to entries
        fetch("http://localhost:3000/entries")
        .then(response => response.json())
        .then (entries => {
          // would a forEach + if statement work better than filter?
          let favoritedEntries = entries.filter(entry => entry.id == favorite.entryId)
          // pull out the bio property only
          //let singleArrayOfSentences = []
          favoritedEntries.forEach(favorite => {
            // split at "." for each
            let splitBio = favorite.bio.split(".")
            // push each sentence into a single array
            // splitBio.forEach(sentence => singleArrayOfSentences.push(sentence))
            // https://javascript.plainenglish.io/three-ways-to-merge-arrays-in-javascript-27cef85fe67b
            for (let i = 0, len = splitBio.length; i < len ; i++) {
              singleArrayOfSentences.push(splitBio[i])
            }
          });
          // BUG: How do I access single array of sentences outside of entries and favorites.forEach scope to avoid duplicate logs?
          console.log(singleArrayOfSentences);
          // randomize the sentences
          // display to participant
          generatePoem(singleArrayOfSentences)
        })
      })
      //console.log(singleArrayOfSentences);
    }
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

  //log array
  console.log(array);
}

function launchLibrary() {
  console.log("Welcome to the learning library!");
  console.log("Input a number for one of the following menu options");
  // should I create a printMenu() function instead?
  console.log(menu);
  //start the prompt
  prompt.start()
  // load the allEntries array (global variable)
  loadEntires()
  // display the main menu, asking the participant what they would like to do
  prompt.get(['input'], function (err, result) {
    console.log('Command-line input received.');
    // View Library
    if (result.input === "1") {
      console.log('You chose: ' + menu[1]);
      entryIndex()
    }
    // View Favorites
    if (result.input === "2") {
      console.log('You chose: ' + menu[2]);
      favoriteIndex()
    }
    // Add to Favorites
    if (result.input === "3") {
      console.log('You chose: ' + menu[3]);
      entryIndex()
    }
    // Edit Favorites
    if (result.input === "4") {
      console.log('You chose: ' + menu[4]);
      favoriteIndex()
    }
    // Generate Poem
    if (result.input === "5") {
      console.log('You chose: ' + menu[5]);
      splitFavoriteBios()
    }
    // Leave the Library
    if (result.input === "6") {
      console.log('You chose: ' + menu[6]);
      console.log("Thanks for visiting our divine time machine! Keep wading in the cosmic slop. It won't be long now.")
    }
  })
}

var allEntries = []
launchLibrary()