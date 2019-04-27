import express from "express";

import users from "../routes/users";
import error from "../middleware/error";
export default function(app){
    app.use(express.json());
    app.use('/api/users', users);
    app.use(error);
}