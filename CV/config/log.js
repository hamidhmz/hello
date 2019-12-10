/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */
var winston = require('winston');
var options = {
  debug: {
    level: 'debug',
    colorize: true,
    filename: `./debug.log`
  },
  info: {
    level: 'info',
    colorize: true,
    filename: `./info.log`
  },
  error: {
    level: 'error',
    colorize: true,
    filename: `./error.log`
  }
};
let customLogger = winston.createLogger({
  transports: [
    new (winston.transports.Console)(options.debug),
    new (winston.transports.Console)(options.info),
    new (winston.transports.File)(options.info),
    new (winston.transports.Console)(options.error)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// // A console transport logging debug and above.
// customLogger.add(winston.transports.Console, {
//   level: 'debug',
//   colorize: true
// });
// customLogger.add(winston.transports.Console, {
//   level: 'info',
//   colorize: true
// });
// customLogger.add(winston.transports.Console, {
//   level: 'error',
//   colorize: true
// });

// // A file based transport logging only errors formatted as json.
// customLogger.add(winston.transports.File, {
//   level: 'error',
//   filename: 'filename.log',
//   json: true
// });

module.exports.log = {
  // Pass in our custom logger, and pass all log levels through.
  custom: customLogger,
  level: 'silly',

  // Disable captain's log so it doesn't prefix or stringify our meta data.
  inspect: false
  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

  // level: 'info'

};
