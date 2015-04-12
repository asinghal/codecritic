/* jslint node: true */
'use strict';

var nodePath = require('path');

/**
 * Builds the base command for the runner.
 */
function addConfig(parts, name, filepath) {
  if (process.env.NODE_ENV !== 'test') {
    parts.push(name);
    parts.push(nodePath.join(__dirname, filepath));
  }
  return parts.join(' ') + ' ';
}

module.exports = {
  add: addConfig
};
