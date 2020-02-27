const express = require('express');
const users = require('../routes/users');
const main = require('../routes/main');
const error = require('../middleware/error');
/**
 *
 *
 * @export
 * @param {*} app
 */
module.exports = function(app){
    app.use(express.json());
    app.use('/hello/api/users', users);
    app.use('/hello/', main);
    app.use(error);
};