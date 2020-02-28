'use strict';
const express = require('express');
const mongoose = require('mongoose');
const { logger } = require('./startup/logging');
const startupRoutes = require('./startup/routes');
const startupDb = require('./startup/db');
const startupConfig = require('./startup/config');
const startupValidation = require('./startup/validation');
const startupProd = require('./startup/prod');
const startupSocket = require('./startup/socket');
const startupCache = require('./startup/cache');
const cookieParser = require('cookie-parser');
const config = require('config');

const app = express();
app.enable('trust proxy');
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', '../frontend');
app.use('/hello', express.static(__dirname + '/../frontend/'));
app.use(cookieParser());
app.set('trust proxy');

startupRoutes(app);
startupDb(mongoose);
startupConfig();
startupValidation();
startupProd(app);
startupCache;
const server = startupSocket(app);

const server1 = server.listen(config.get('PORT'), () =>
    logger.info(`Listening on port ${config.get('PORT')}...`)
);
module.exports = server1;
