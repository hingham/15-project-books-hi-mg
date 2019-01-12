'use strict';
const bookSchema = require('./book-shema');
const DataModel = require('./model.js');

class Book extends DataModel{}


module.exports = new Book(bookSchema);