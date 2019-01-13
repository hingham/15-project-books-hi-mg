///create a router folder to store routes
'use strict';
console.log('in v2');
const express = require('express');
// const modelFinder = require('../models/model-finder.js');
const router = express.Router();
const book = require('../models/books.js');
const bookShelf = require('../models/bookshelves.js');
const bookConstructor = require('../models/book-constructor.js');
const superagent = require('superagent');
// const swaggerUI = require('swagger-ui-express');
// router.param('model', modelFinder);
const app = express();

app.set('view engine', 'ejs');


// API Routesr
router.get('/', getBooks);
router.post('/searches', createSearch);
router.get('/searches/new', newSearch);
router.get('/books/:id', getBook);
router.post('/books', createBook);
// router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('*', (request, response) => response.status(404).send('This route does not exist'));


//not that I have left out bookshelf functions
function getBooks(req, res, next) {
  console.log('in get books');
  book.get()
    .then(results => {
      const output = {
        count: results.length,
        results: results,
      };
      if (!output) {
        res.render('pages/searches/new');
      }
      else {
        res.render('pages/index', { books: output.results });
      }
    })
    .catch(next);
}

function createSearch(req, res, next) {
  //doesn't need to get anything from database
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  // let url = 'https://www.googleapis.com/books/v1/volumes?q=title+intitle:seattle';


  ////for testing

  console.log('in new search', req.body.search);

  if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]}`; }
  if (req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => { 
      let bookArr = apiResponse.body.items.map((apiBooks) => new Book(apiBooks.volumeInfo) );
      return bookArr;
    })
    .then(allBooks => {
      // console.log(allBooks);
      res.render('pages/searches/show', { results: allBooks });
    })
    .catch(next);
}


function newSearch(req, res, next) {
  res.render('pages/searches/new');
}

function getBook(req, res, next) {
  book.get(req.params.id)
    .then(result => {
      const output = {
        count: result.length,
        results: result,
      };
      console.log('get book log', output);
      res.render('pages/books/show', { book: output.results[0] });
      // bookshelves: shelves.rows
      // res.status(200).json(result[0]);
    })
    .catch(next);
  //gets and returns one book from the shelf
}



function createBook(req, res, next) {
  createShelf(req.body.bookshelf);
  // console.log('in post', req.params);
  book.post(req.body)
    .then(result => {
      console.log('in result', result);
      const output = {
        count: result.length,
        results: result,
      };
      res.redirect(`/books/${output.results.id}`);
    })
    // .then(result => res.redirect(`/books/${result.rows[0].id}`))
    .catch(next);
}

function getBookshelves() {
  // let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  let SQL = 'SELECT * FROM bookshelves ORDER BY name;';

  // return client.query(SQL);
}

function createShelf(shelf) {
  let normalizedShelf = shelf.toLowerCase();
  // let SQL1 = `SELECT id from bookshelves where name=$1;`;
  bookShelf.post(shelf);
  // let values1 = [normalizedShelf];

  // return client.query(SQL1, values1)
  //   .then(results => {
  //     if(results.rowCount) {
  //       return results.rows[0].id;
  //     } else {
  //       let INSERT = `INSERT INTO bookshelves(name) VALUES($1) RETURNING id;`;
  //       let insertValues = [shelf];

  //       return client.query(INSERT, insertValues)
  //         .then(results => {
  //           return results.rows[0].id;
  //         })
  //     }
  //   })
}

// function updateBook(req, res, next){

// }

function deleteBook(req, res, next) {
  book.delete(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .then(res.redirect('/'))
    .catch(next);
}


function Book(info) {
  let placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title || 'No title available';
  this.author = info.authors || 'No authors available';
  this.isbn = info.industryIdentifiers ? `ISBN_13 ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail : placeholderImage;
  this.description = info.description || 'No description available';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
}


module.exports = router;

