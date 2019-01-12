'use strict';
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const book =  mongoose.Schema({
  name: {type: String, require:true},
  author: {type: String, require:true},
  isbn: {type: String},
  image: {type: String},
  description: {type: String},
  bookshelf: {type: String},
});

module.exports = mongoose.model('book', book);

