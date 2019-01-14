![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Book App v2

### Author: Hannah Ingham and Becca Lee

### Links and Resources
![Build Status](https://travis-ci.com/hingham/15-project-books-hi-mg.svg?branch=master)
* [repo](https://github.com/hingham/15-project-books-hi-mg)
* [travis](https://travis-ci.com/hingham/15-project-books-hi-mg)
* [![Build Status](https://www.travis-ci.com/hingham/15-project-books-hi-mg.svg?branch=master)](https://www.travis-ci.com/hingham/15-project-books-hi-mg)
* [heroku](https://bookapp-hi-bl.herokuapp.com/)

#### Documentation
* [jsdoc](http://localhost:8080/doc/)

### Modules
- `src/models/books.js` contains the books class
- `src/models/bookshelves.js` contains the bookshelves class
- `src/models/model.js` contains the models
- `src/models/book-schema.js` contains the book schema for mongo db
- `src/models/bookshelf-schema.js` contains the bookshelf schema for mongo db
- `src/middleware/404.js` contains the 404 error
- `src/middleware/error.js` contains other errors
- `src/api/routes.js` contains the mongodb routes and corresponding functions
- `src/api/routes-sql.js` contains the sql routes and corresponding functions
- `src/server.js` contains all the app.use info
- `index.js` contains the core server functionality
- `/views/` folder contains all ejs files and partials for rendering content to the front end

### Setup
#### `.env` requirements
* `PORT` - 8080
* Mongo: `MONGODB_URI` - mongodb://localhost:27017/books
* Postgres: `DATABASE_URL` postgres://localhost:5432/books


#### Running the app
* This app can be run locally by running `nodemon` in your terminal and then opening `http://localhost:8080/` in your browser. Running locally will require mongo and postgres.
* The app can also be run by visiting `https://bookapp-hi-bl.herokuapp.com/`. Mongo and postgres have been provisioned in heroku, so you won't need local versions

  
#### Tests
* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?

