import express from "express";
import {createLogger, format, transports} from "winston";
import mongoose from "mongoose";
// import startupLogging from "./startup/logging";

import startupRoutes from "./startup/routes";
import startupDb from "./startup/db";
import startupConfig from "./startup/config";
import startupValidation from "./startup/validation";
import startupProd from "./startup/prod";

const { combine, timestamp, label, prettyPrint } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logFile.log' })
    ]
});
const app = express();
// startupLogging();
startupRoutes(app);
startupDb(mongoose);
startupConfig();
startupValidation();
startupProd(app);
// for log of beyond from express you we must do this



const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));
// logger.info('hello', { message: 'world' });

export default server;