'use strict';
const bookshelfSchema = require('./bookshelf-schema.js');
const DataModel = require('./model.js');

/**
 * Creates bookshelf class
 * @class Bookshelf
 * @extends {DataModel}
 * @module bookshelves
 */
class Bookshelf extends DataModel{}


module.exports = new Bookshelf(bookshelfSchema);