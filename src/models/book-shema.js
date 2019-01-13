'use strict';
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const book =  mongoose.Schema({
  title: {type: String, require:true},
  author: {type: String, require:true},
  isbn: {type: String},
  image_url: {type: String},
  description: {type: String},
  bookshelf_id: {type: String},
  name: {type: String},
});

module.exports = mongoose.model('book', book);

