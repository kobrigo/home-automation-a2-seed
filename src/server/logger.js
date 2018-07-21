var moment = require('moment');
var _ = require('lodash');
var winston = require('winston');


function logFormatterFunction(options) {
  return options.timestamp().format('L HH:mm:ss:SSSS') + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
}

var consoleTransport, fileTransport;
try {
  consoleTransport = new (winston.transports.Console)({
    level: 'debug',
    timestamp: function () {
      return moment();
    },
    formatter: logFormatterFunction
  });
  fileTransport = new (winston.transports.File)({
    filename: './src/server/logs/server.log',
    json: false,
    level: 'debug',
    maxFiles: 10,
    maxsize: 2 * 1024 * 1024,
    timestamp: function () {
      return moment();
    },

    formatter: logFormatterFunction
  });

} catch (e) {
  console.error(e);
}

var winstonLogger = new (winston.Logger)({
  transports: [
    consoleTransport,
    fileTransport
  ]
});

var logger = {
  _winstonLogger: winstonLogger,
  createPrefixedLogger: function createPrefixedLogger(messagesPrefix) {
    var returnedLogger = {
      disabled: false,
      disable: function (shouldDisable) {
        this.disabled = shouldDisable;
      },
    };
    _.forOwn(logger, function iterator(func, functionName) {
      returnedLogger[functionName] = function (message) {
        var messageWithPerfix = messagesPrefix + ' ' + message;
        func.call(returnedLogger, messageWithPerfix);
      };
    });

    return returnedLogger;
  },

  log: function log(message) {
    if (this.disabled) return;

    winstonLogger.info(message);
  },

  debug: function debug(message) {
    if (this.disabled) return;

    winstonLogger.debug(message);
  },

  error: function error(message) {
    if (this.disabled) return;

    winstonLogger.error(message);
  },

  warn: function warn(message) {
    if (this.disabled) return;

    winstonLogger.warn(message);
  }
};

module.exports = logger;
