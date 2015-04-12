/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  nodePath = require('path'),
  config = require('../util/config'),
  jsConfig = require('../../config/jscomplexity.json');

/**
 * Builds the base command for the runner.
 */
function buildBaseCommand() {
  var parts = [
    'node',
    nodePath.join(__dirname, '/../../node_modules/complexity-report/src/index.js'),
    '-f json'
  ];

  return config.add(parts, '--config', '/../../config/complexityignore.json ');
}

var command = buildBaseCommand();

/**
 * Validates a metric against an upper cap.
 *
 * @param metric {number} The value to be checked
 * @param ceiling {number} The upper cap value
 * @param error {string} The message to be returned if validation fails
 */
function validate(metric, ceiling, error) {
  if (metric > ceiling) {
    return error;
  }
  return null;
}

/**
 * Validate the number of lines in the file against preconfigured limit.
 *
 * @param loc {number}
 */
function validateLines(loc) {
  return validate(loc, jsConfig.maxLines, 'LONG_FILE');
}

/**
 * Validate the cyclomatic complexity against preconfigured limit.
 *
 * @param cyclomatic {number}
 */
function validateCyclomaticComplexity(cyclomatic) {
  return validate(cyclomatic, jsConfig.maxCyclomatic, 'HIGH_CYCLOMATIC_COMPLEXITY');
}

/**
 * Validate the measured difficulty against preconfigured limit.
 *
 * @param difficulty {number}
 */
function validateDifficulty(difficulty) {
  return validate(difficulty, jsConfig.maxHDifficulty, 'HIGH_DIFFICULTY');
}

/**
 * Validate the measured volume against preconfigured limit.
 *
 * @param volume {number}
 */
function validateVolume(volume) {
  return validate(volume, jsConfig.maxHVolume, 'HIGH_VOLUME');
}

/**
 * Validate the estimated effort required to write code against preconfigured limit.
 *
 * @param effort {number}
 */
function validateEffort(effort) {
  return validate(effort, jsConfig.maxHEffort, 'HIGH_EFFORT');
}

/**
 * Validate the bug density against preconfigured limit.
 *
 * @param bugs {number}
 */
function validateBugs(bugs) {
  return validate(bugs, jsConfig.maxBugDensity, 'HIGH_BUG_DENSITY');
}

/**
 * Validate and set a value in the data object and add an error object with
 * validation message.
 *
 * @param data {object}
 * @param errors {array}
 * @param value {number}
 * @param name {string}
 * @param validator {function}
 */
function setValue(data, errors, value, name, validator) {
  data[name] = value;
  errors.push({
    name: data.name,
    position: data.position,
    msg: validator(value)
  });
}

/**
 * Validate and set the cyclomatic complexity.
 *
 * @param data {object}
 * @param errors {array}
 * @param func {object}
 */
function setCyclomatic(data, errors, func) {
  setValue(data, errors, func.cyclomatic, 'cyclomatic', validateCyclomaticComplexity);
}

/**
 * Validate and set the difficulty.
 *
 * @param data {object}
 * @param errors {array}
 * @param func {object}
 */
function setDifficulty(data, errors, func) {
  setValue(data, errors, func.halstead.difficulty, 'difficulty', validateDifficulty);
}

/**
 * Validate and set the volume.
 *
 * @param data {object}
 * @param errors {array}
 * @param func {object}
 */
function setVolume(data, errors, func) {
  setValue(data, errors, func.halstead.volume, 'volume', validateVolume);
}

/**
 * Validate and set the effort.
 *
 * @param data {object}
 * @param errors {array}
 * @param func {object}
 */
function setEffort(data, errors, func) {
  setValue(data, errors, func.halstead.effort, 'effort', validateEffort);
}

/**
 * Validate and set the bug density.
 *
 * @param data {object}
 * @param errors {array}
 * @param func {object}
 */
function setBugs(data, errors, func) {
  setValue(data, errors, func.halstead.bugs, 'bugs', validateBugs);
}

/**
 * Filter null values and clean up the errors list.
 *
 * @param array {array}
 */
function cleanup(array) {
  return array.filter(function (item) {
    return item;
  }).filter(function (item) {
    return item.msg;
  });
}

/**
 * Parse details of a function.
 *
 * @param func {object}
 * @param errors {array}
 */
function parseFunction(func, errors) {
  var data = {
    position: func.line,
    name: func.name
  };
  [setCyclomatic, setDifficulty, setVolume, setEffort, setBugs].forEach(function (fn) {
    fn(data, errors, func);
  });
  return data;
}

/**
 * Parse the reports generated into a simplified form.
 *
 * @param reports {array}
 */
function parseStdOut(reports) {
  return reports.map(function (report) {
    var errors = [],
      summary = {
        file: report.path
      };
    errors.push({
      msg: validateLines(report.aggregate.sloc.physical)
    });
    summary.functions = report.functions.map(function (func) {
      return parseFunction(func, errors);
    });
    summary.errors = cleanup(errors);
    return summary;
  });
}

/**
 * Runs Complexity report for the given paths
 *
 * @param paths {array}
 * @param callback {function}
 */
function run(paths, callback) {
  exec(command + paths.join(' '), {
    maxBuffer: 1024 * 1024 * 5000
  }, function (error, stdout) {
    var reports = parseStdOut(JSON.parse(stdout).reports);
    callback(error, reports);
  });
}

module.exports = {
  run: run
};
