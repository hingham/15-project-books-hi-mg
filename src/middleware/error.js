'use strict';

/**
 * Error handler middleware
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @module error
 */
module.exports = (err, req, res, next) =>{
  let error = {error: err};
  RegExp.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};