/* jslint node: true */
'use strict';

var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: true,
  prettyPrint: true,
  level: 'info'
});

module.exports = {
  debug: winston.debug,
  info: winston.info,
  error: winston.error
};

