'use strict';
const bookSchema = require('./book-shema');
const DataModel = require('./model.js');

/**
 * Creates Book class
 *
 * @class Book
 * @extends {DataModel}
 */
class Book extends DataModel{}


module.exports = new Book(bookSchema);