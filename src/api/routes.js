///create a router folder to store routes
'use strict';
console.log('in v2');
const express = require('express');
// const modelFinder = require('../models/model-finder.js');
const router = express.Router();
const book = require('../models/books.js');
const bookshelf = require('../models/bookshelves.js');
const bookConstructor = require('../models/book-constructor.js');
const superagent = require('superagent');
const modelFinder = require('../models/model-finder.js');
const app = express();

app.set('view engine', 'ejs');

router.param('', modelFinder);


// API Routesr
router.get('/', getBooks);
router.post('/searches', createSearch);
router.get('/searches/new', newSearch);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('*', (request, response) => response.status(404).send('This route does not exist'));


/**
 * mongo getBooks function, gets books and provides render information for ejs files. This is done every time the homepage is loaded
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getBooks(req, res, next) {

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

/**
 * createSearch function, makes a post to the google books API to get search results
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function createSearch(req, res, next) {
  //doesn't need to get anything from database
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';


  ////for testing


  if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]}`; }
  if (req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => { 
      let bookArr = apiResponse.body.items.map((apiBooks) => new Book(apiBooks.volumeInfo) );
      return bookArr;
    })
    .then(allBooks => {
      res.render('pages/searches/show', { results: allBooks });
    })
    .catch(next);
}


/**
 * newSearch function, does a get to return search results and render them to the results page
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function newSearch(req, res, next) {
  res.render('pages/searches/new');
}

/**
 * getBook function, does a get to view the detail of one particular book. Can be done from the search page upon saving a book, or from the homepage upon viewing detail
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getBook(req, res, next) {
  book.get(req.params.id)
    .then(result => {
      let bookshelf = [
        {bookid: req.params.id,
          name: 'cities'}];
      
      res.render('pages/books/show', { book: result[0], bookshelves: bookshelf });
    })
    .catch(next);
}



/**
 * createBook function, does a post to add a book to the db, then redirects to the detail page
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function createBook(req, res, next) {
  createShelf(req.body.bookshelf);
  console.log('console logging params', req.params) ;

  book.post(req.body)
    .then(result => {
      console.log('in result', result);
      const output = {
        count: result.length,
        results: result,
      };

      res.redirect(`/books/${output.results.id}`);
    })
    .catch(next);
}

function getBookshelves() {
  bookshelf.get()
    .then(results=>{
      return results;
    });
}

function createShelf(shelf) {
  let normalizedShelf = shelf.toLowerCase();
  bookshelf.get()
    .then(results=>{
      if(results.length ===0){
        bookshelf.post(shelf);
        bookshelf.get()
          .then(results=>{
            console.log('added to shelf', results[0]._id);

            return results[0]._id;
          });
      }
      else{
        console.log('in shelf', results[0]._id);
        return results[0]._id;
      }
    });
}

/**
 * updateBook does a put to update book info
 *
 * @param {*} request
 * @param {*} response
 */
function updateBook(req, res, next) {
  book.put(req.params.id, req.body)
    .then(res.redirect(`/books/${req.params.id}`))
    .catch(next);
}

/**
 * deleteBook function, does a delete on a specific id
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteBook(req, res, next) {
  book.delete(req.params.id)
    .then(result => {
    })
    .then(res.redirect('/'))
    .catch(next);
}


/**
 * Book constructor function for rendering data to the page
 *
 * @param {*} info
 */
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

