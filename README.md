# The Seed Data Project: A Meditation on Black Women's Care Work Throughout History 0.1.0

The Seed Data project takes it's name from the computer science concept, ["database seeding"](https://en.wikipedia.org/wiki/Database_seeding).  [Learn Entity Framework Core](https://www.learnentityframeworkcore.com/migrations/seeding) defines seed data as, "data that you populate the database with at the time it is created. You use seeding to provide initial values for lookup lists, for demo purposes, proof of concepts etc." This project explores the ways in which Black women's care work has provided the initial values for liberation. While exploring the history of this work, one can generate a poem from the seed data to play with language, inspire alternative forms, and imagine new worlds. Supporting multiple functions this project can be used for learning, meditations, and ceremonies of reverence and remembrance.

## Quick Notes

- This project was created in ES6 Javascript
- This is the earliest version of this project
- In this development phase participants are automatically signed in as "Library Guest" and all seed data can be found in the `db.json` file.
- This project can be experienced using NodeJS
- This learning library is stocked with Black women's care work seed data populated by [Ayana Zaire Cotton](https://ayzaco.com/), artist, writer, and software engineer from Prince George's County, MD.

## Future Versions

In future versions of this project, participants will be able to create their own profile in order to save their favorite database entries and generated poems. There will also be an API using Ruby on Rails and a contribution guide so contributors can add additional seed data to the library.

## Launch The Library

### STEP 1
Install external modules
1. Install [JSON server](https://www.npmjs.com/package/json-server#getting-started): `npm install -g json-server`
2. Install [prompt](https://github.com/flatiron/prompt): `npm install prompt`
3. Install [node-fetch](https://github.com/node-fetch/node-fetch): `npm i node-fetch --save`

### STEP 2
Run the Server (The seed data is stored using JSON server)
1. See `db.json` file in this directory
2. Navigate to this project's directory in your terminal
3. Paste the following in the terminal to start the JSON server: `json-server --watch db.json`

### STEP 3
Happy Exploring!
1. While the server is running in the console, open another tab in the same project directory
2. Paste the following in the console to launch the library: `node index.js`
