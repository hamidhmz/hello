const express = require("express");
const mongoose = require("mongoose");
const { logger } = require("./startup/logging");
const startupRoutes = require("./startup/routes");
const startupDb = require("./startup/db");
const startupConfig = require("./startup/config");
const startupValidation = require("./startup/validation");
const startupProd = require("./startup/prod");
const startupSocket = require("./startup/socket");
const cookieParser = require("cookie-parser");

const app = express();
app.set("trust proxy", true);
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

module.exports = server1;
