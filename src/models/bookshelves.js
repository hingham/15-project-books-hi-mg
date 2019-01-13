'use strict';
const bookshelfSchema = require('./bookshelf-schema.js');
const DataModel = require('./model.js');

class Bookshelf extends DataModel{}


module.exports = new Bookshelf(bookshelfSchema);