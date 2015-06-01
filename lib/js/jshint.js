/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  config = require('../util/config'),
  logger = require('../util/logger'),
  extend = require('util')._extend;

/**
 * Builds the base command for the runner.
 */
function buildBaseCommand() {
  var parts = [
    'node',
    __dirname + '/../../node_modules/jshint/bin/jshint',
    '--config',
    __dirname + '/../../config/jshint.json'
  ];

  return config.add(parts, '--exclude-path', '/../../config/jshintignore ');
}

var command = buildBaseCommand();

/**
 * Look up an item in a given array
 *
 * @param array {array}
 * @param name {string}
 */
function find(array, name) {
  var found = null;
  array.forEach(function (item) {
    if (item.indexOf(name) !== -1) {
      found = item;
    }
  });
  return found;
}

/**
 * Filters rows that start with markers for lines and columns.
 *
 * @param array {array}
 */
function filterMarkers(array) {
  return array.filter(function (item) {
    var result = false;
    ['line', 'col'].forEach(function (ignored) {
      result = result || (item.trim().indexOf(ignored) === 0);
    });
    return !result;
  });
}

/**
 * Extracts the value of a given key from the issue data.
 *
 * @param issue {object}
 * @param name {string}
 */
function getValue(issue, name) {
  var value = find(issue, name).replace(name, '');
  return parseInt(value, 10);
}

/**
 * Builds report data for a given issue.
 *
 * @param summary {array}
 * @param issue {object}
 */
function buildLineReport(summary, issue) {
  return {
    fileName: summary[0],
    line: getValue(issue, ' line '),
    col: getValue(issue, ' col '),
    msg: filterMarkers(issue)[0]
  };
}

/**
 * Parses a line of output from JSHint execution and breaks it down
 * to a JSON format of filename, line, column number and message.
 *
 * @param line {string}
 */
function parseLine(line) {

  if (line && line.indexOf(':') !== -1) {
    var summary = line.split(':'),
      issue = summary[1].split(',');
    return buildLineReport(summary, issue);
  }

  return null;
}

/**
 * Clones a line object and removes unnecessary details.
 *
 * @param line {object}
 */
function cloneLine(line) {
  var item = extend({}, line);
  delete item.fileName;
  return item;
}

/**
 * Adds a line to the report object
 *
 * @param report {object}
 * @param line {object}
 */
function addLine(report, line) {
  var item = cloneLine(line);
  report[line.fileName] = report[line.fileName] || [];
  report[line.fileName].push(item);
}

/**
 * Consolidates the JSHint output by file name
 *
 * @param parsed {array}
 */
function consolidate(parsed) {
  var data = {};
  parsed.forEach(function (line) {
    if (line) {
      addLine(data, line);
    }
  });
  return data;
}

/**
 * Runs JSHint for the given paths
 *
 * @param paths {array}
 * @param callback {function}
 */
function run(paths, callback) {
  logger.info('[jshint] analysis started');
  exec(command + paths.join(' '), {
    maxBuffer: 1024 * 5000
  }, function (error, stdout) {
    logger.info('[jshint] analysis completed', error);
    var parsed = stdout.split('\n').map(parseLine);

    callback(error, consolidate(parsed));
  });
}

module.exports = {
  run: run
};
