'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');

const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');
// const apiRouter = require('./api/routes.js');
// const apiRouter = require('./api/routes-sql.js');
const apiRouter = require(`./api/${process.env.dbVersion}.js`);


//prepare the express app
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));
app.set('view engine', 'ejs');


//App level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));



//Routes
app.use(apiRouter);

//Catchalls
app.use(notFound);
app.use(errorHandler);

let isRunning = false;

module.exports = {
  server: app,
  start: (port)=>{
    if(! isRunning){
      app.listen(port, ()=>{
        isRunning = true;
        console.log(`Server Up on port ${port}`);
      });
    }
    else{
      console.log('Server is already running');
    }
  },
};