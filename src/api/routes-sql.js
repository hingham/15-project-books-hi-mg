'use strict';

// routerlication Dependencies
const pg = require('pg');
const superagent = require('superagent');

const express = require('express');
const router = express.Router();


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// API Routes
router.get('/', getBooks);
router.post('/searches', createSearch);
router.get('/searches/new', newSearch);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);


// HELPER FUNCTIONS
/**
 * Book constructor function for rendering data to the page
 * @param {*} info
 * @module routes-sql
 */
function Book(info) {
  let placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title || 'No title available';
  this.author = info.authors[0] || 'No authors available';
  this.isbn = info.industryIdentifiers ? `ISBN_13 ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail : placeholderImage;
  this.description = info.description || 'No description available';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
}

/**
 * postgres getBooks function, gets books and provides render information for ejs files. This is done every time the homepage is loaded
 * @param {*} request
 * @param {*} response
 * @returns
 */
function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(results => {
      if(results.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', {books: results.rows});
      }
    })
    .catch(err => handleError(err, response));
}

/**
 * createSearch function, makes a post to the google books API to get search results
 * @param {*} request
 * @param {*} response
 */
function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', {results: results}))
    .catch(err => handleError(err, response));
}

/**
 * newSearch function, does a get to return search results and render them to the results page
 * @param {*} request
 * @param {*} response
 */
function newSearch(request, response) {
  response.render('pages/searches/new');
}

/**
 * getBook function, does a get to view the detail of one particular book. Can be done from the search page upon saving a book, or from the homepage upon viewing detail
 * @param {*} request
 * @param {*} response
 */
function getBook(request, response) {
  getBookshelves()
    .then(shelves => {
      // let SQL = 'SELECT * FROM books WHERE id=$1;';
      let SQL = 'SELECT books.*, bookshelves.name FROM books INNER JOIN bookshelves on books.bookshelf_id=bookshelves.id WHERE books.id=$1;';
      let values = [request.params.id];
      client.query(SQL, values)
        .then(result => response.render('pages/books/show', {book: result.rows[0], bookshelves: shelves.rows}))
        .catch(err => handleError(err, response));
    });
}

/**
 * getBookshelves does a get to view all bookshelves
 * @returns
 */
function getBookshelves() {
  // let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  let SQL = 'SELECT * FROM bookshelves ORDER BY name;';

  return client.query(SQL);
}

/**
 * createShelf does a post to create a new bookshelf
 * @param {*} shelf
 * @returns
 */
function createShelf(shelf) {
  let normalizedShelf = shelf.toLowerCase();
  let SQL1 = `SELECT id from bookshelves where name=$1;`;
  let values1 = [normalizedShelf];

  return client.query(SQL1, values1)
    .then(results => {
      if(results.rowCount) {
        return results.rows[0].id;
      } else {
        let INSERT = `INSERT INTO bookshelves(name) VALUES($1) RETURNING id;`;
        let insertValues = [shelf];

        return client.query(INSERT, insertValues)
          .then(results => {
            return results.rows[0].id;
          });
      }
    });
}

/**
 * createBook function, does a post to add a book to the db, then redirects to the detail page
 * @param {*} request
 * @param {*} response
 */
function createBook(request, response) {
  createShelf(request.body.bookshelf)
    .then(id => {
      let {title, author, isbn, image_url, description} = request.body;
      let SQL = 'INSERT INTO books(title, author, isbn, image_url, description, bookshelf_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;';
      let values = [title, author, isbn, image_url, description, id];

      client.query(SQL, values)
        .then(result => response.redirect(`/books/${result.rows[0].id}`))
        .catch(err => handleError(err, response));
    });

}

/**
 * updateBook does a put to update book info
 * @param {*} request
 * @param {*} response
 */
function updateBook(request, response) {
  let {title, author, isbn, image_url, description, bookshelf_id} = request.body;
  // let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;`;
  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf_id=$6 WHERE id=$7;`;
  let values = [title, author, isbn, image_url, description, bookshelf_id, request.params.id];

  client.query(SQL, values)
    .then(response.redirect(`/books/${request.params.id}`))
    .catch(err => handleError(err, response));
}

/**
 * deleteBook function, does a delete on a specific id
 * @param {*} request
 * @param {*} response
 * @returns
 */
function deleteBook(request, response) {
  let SQL = 'DELETE FROM books WHERE id=$1;';
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

/**
 * error handling function
 * @param {*} error
 * @param {*} response
 */
function handleError(error, response) {
  response.render('pages/error', {error: error});
}

module.exports = router;