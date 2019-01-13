'use strict';

/**
 * Book constructor for ejs rendering
 *
 * @param {*} info
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

module.export = Book;