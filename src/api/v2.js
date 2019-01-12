///create a router folder to store routes
'use strict';
console.log('in v2');
const express = require('express');
// const modelFinder = require('../models/model-finder.js');
const router = express.Router();
const books = require('../models/books.js');
const bookConstructor = require('../models/book-constructor.js');
const superagent = require('superagent');
// const swaggerUI = require('swagger-ui-express');
// router.param('model', modelFinder);

///create get, post, put delete functions for mongo

// Set the view engine for server-side templating
// router.set('view engine', 'ejs');

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
function getBooks(req, res, next){
  console.log('in get books');
  books.get()
    .then (results =>{
      const output = {
        count: results.length,
        results: results,
      };
      res.status(200).json(output);
      // res.render('pages/index', {books: results.documents});
    })
    .catch(next);
}

function createSearch(req, res, next){
  //doesn't need to get anything from database
//   let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  let url = 'https://www.googleapis.com/books/v1/volumes?q=title+intitle:seattle';

  
  ////for testing

  console.log('in new search', req.body);

  //   if (req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]}`; }
  //   if (req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => {
      let bookArr = apiResponse.body.items.map( (books) => {
        let newBook = new Book(books.volumeInfo);
        console.log(newBook);
      });
   
    })
    .catch(console.error('error'));
}

function newSearch(req, res, next){
  //renders the first 10 resonses from the database
    
}

function getBook(req, res, next){
  books.get(req.params.id)
    .then(result=>{
      res.status(200).json(result[0]);
    })
    .then(result => res.render('pages/books/show', {book: result.rows[0], bookshelves: shelves.rows}))
    .catch(next);
  //gets and returns one book from the shelf
}



function createBook(req, res, next){    
  console.log('in post', req.params);
  books.post(req.body)
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    // .then(result => response.redirect(`/books/${result.rows[0].id}`))
    .catch(next);
}



// function updateBook(req, res, next){

// }

function deleteBook(req, res, next){
  books.delete(req.params.id)
    .then( result =>{
      res.status(200).json(result);
    })
    .then(res.redirect('/'))
    .catch(next);
}


function Book(info) {
    let placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
    
    this.title = info.title || 'No title available';
    // this.author = info.authors || 'No authors available';
    this.isbn = info.industryIdentifiers ? `ISBN_13 ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
    this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail : placeholderImage;
    this.description = info.description || 'No description available';
    this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
  }


module.exports = router;

