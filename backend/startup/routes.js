import express from "express";

import users from "../routes/users";
import main from "../routes/main";
import error from "../middleware/error";
/**
 *
 *
 * @export
 * @param {*} app
 */
export default function(app){
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/', main);
    app.use(error);
}