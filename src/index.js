'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');
const apiRouter = require('./api/v2.js');

//prepare the express app
const app = express();


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