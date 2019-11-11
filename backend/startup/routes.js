const express = require("express");
const users = require("../routes/users");
const main = require("../routes/main");
const error = require("../middleware/error");
/**
 *
 *
 * @export
 * @param {*} app
 */
module.exports = function(app){
    app.use(express.json());
    app.use("/api/users", users);
    app.use("/", main);
    app.use(error);
};