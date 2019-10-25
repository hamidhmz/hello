import express from "express";
import mongoose from "mongoose";
import { logger } from "./startup/logging";
import startupRoutes from "./startup/routes";
import startupDb from "./startup/db";
import startupConfig from "./startup/config";
import startupValidation from "./startup/validation";
import startupProd from "./startup/prod";
import startupSocket from "./startup/socket";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine", "ejs");
app.set("views", "../frontend");
app.use(express.static(__dirname + "/../frontend/"));
app.use(cookieParser());
// app.use(express.json());

startupRoutes(app);
startupDb(mongoose);
startupConfig();
startupValidation();
startupProd(app);
const server = startupSocket(app);

// for log of beyond from express you we must do this

// app.get("/",async function (req,res) {
//     res.sendFile(path.resolve(__dirname+"/../frontend/index.html"));
// });

const port = process.env.PORT || 3000;
const server1 = server.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);
// logger.info('hello', { message: 'world' });

export default server1;
