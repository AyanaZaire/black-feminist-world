/*
POSSIBLE REFACTORS:
- Handle all incorrect responses
- Implement filter on line 47
- Create profile functionality/"Log In Participant"
- "Title" the poem with the names of the archive (Ex: “Aretha Franklin, Frances Thompson, and Saidiya Hartman”
)
- Create entries class
- Create more "sentence analytics" for more dynamic poetry
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
  if (allEntries.length === 0) {
    fetch("http://localhost:3000/entries")
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        allEntries.push(entry)
      })
    })
  } else {
    return allEntries
  }
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
  // could filter through allEntries array to eliminate this call to database?
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
      var singleArrayOfSentences = []
      for (var i = 0; i < favorites.length; i++) {
        favoritedEntries = allEntries.filter(entry => entry.id == favorites[i].entryId)
        favoritedEntries.forEach(entry => {
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
  // create a printMenu() function instead?
  console.log(menu);
  // start the prompt
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
      console.log("You have left the library. Thank you for visiting! What have you learned? Returning to the work of Black Women Care Workers is a practice of reverence and remembrance. An act of ceromony that reminds us any freedom, joy, or love you experience within the American project is a direct result of the care of Black women.")
    }
  })
}

var allEntries = []
launchLibrary()
