'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParse: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

require('./src/index.js').start(process.env.PORT);
