'use strict';

const rootDir = process.cwd();
const products = require(`../../src/models/books.js`);

const supergoose = require('./supergoose.js');

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Products Model', () => {
  it('can post() a new product', () => {
    let obj = {title:'Title', author: 'Author'};
    return products.post(obj)
      .then(record => {
        Object.keys(obj).forEach(key =>{
          expect(record[key]).toEqual(obj[key]);
        });
      });
  });

  it('can get() a product', () => {
    let obj = {title:'Title', author: 'Author'};
    return products.post(obj)
      .then(record => {
        record._id = 1;
        return products.get(record._id)
          .then(product => {
            Object.keys(obj).forEach(key =>{
              expect(product[0][key]).toEqual(obj[key]);
            });
          });
      });
  });

  it('can put() a product', () => {
    let obj = {title:'Title', author: 'Author'};
    return products.post(obj)
      .then(record => {
        record.id = 1;
        return products.get(record._id)
          .then(product => {
            Object.keys(obj).forEach(key =>{
              expect(product[0][key]).toEqual(obj[key]);
            });
          });
      });
  });

  it('can delete() a product', () => {
    let obj = {title:'Title', author: 'Author'};
    return products.post(obj)
      .then(record => {
        record.id = 1;
        return products.get()
          .then(products => {
            let bool = true;
            for(let i = 0; i< products.length; i++){
              if(products[i]===1){
                bool =false;
              }
              expect(bool).toBe(true);

            }
          });
      });
  });

});