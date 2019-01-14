'use strict';


module.exports = (request, response, next )=>{

//   let modelName = request.params.model;
  console.log(modelName);
  request.books = require(`../models/books.js`);
  request.bookshelf = require('../models/bookshelves.js');
  next();
};

