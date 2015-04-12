/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  config = require('../util/config');

/**
 * Builds the base command for the runner.
 */
function buildBaseCommand() {
  var parts = [
    'flay',
    '--diff'
  ];

  return config.add(parts, '--exclude', '/../../config/flayignore ');
}

var command = buildBaseCommand();

/**
 * Checks if we should start buffering the output
 *
 * @param issue {object}
 * @param line {string}
 */
function startBuffer(issue, line) {
  return (line === '' && issue.title !== '');
}

/**
 * Checks if this line corresponds to the summary line for the file.
 *
 * @param line {string}
 */
function isFileNameReportLine(line) {
  return (/^[A-Z]\:/).test(line) && line.indexOf('.js:') !== -1;
}

/**
 * Parse various details of an issue into a JSON form.
 *
 * @param issue {object}
 * @param line {string}
 * @param buffer {array}
 */
function parseIssue(issue, line, buffer) {
  if (issue) {
    if (buffer) {
      issue.buffer.push(line);
    }
    buffer = buffer || startBuffer(issue, line);
    if (isFileNameReportLine(line)) {
      var parts = line.split(':');
      issue.files[parts[0]] = parts[1];
    }
  }
  return buffer;
}

/**
 * Construct a new issue.
 *
 * @param line {string}
 */
function newIssue(line) {
  return {
    title: line,
    files: {},
    buffer: []
  };
}

/**
 * Flush the given issue into the list of issues.
 *
 * @param issues {array}
 * @param issue {object}
 */
function flush(issues, issue) {
  if (issue) {
    issue.buffer = issue.buffer.join('\n');
    issues.push(issue);
  }
}

/**
 * Parse the std output into a JSON format that can be used to display results.
 *
 * @param output {string}
 */
function parseOutput(output) {
  var lines = output.split('\n'),
    summary = lines.shift(),
    newline = false,
    issue = null,
    issues = [],
    buffer = false;

  lines.forEach(function (line) {
    newline = /^[0-9]*\)/.test(line);
    line = line.trim();
    if (newline) {
      flush(issues, issue);
      issue = newIssue(line);
      buffer = false;
    }

    buffer = parseIssue(issue, line, buffer);
  });

  flush(issues, issue);

  return {
    summary: summary,
    issues: issues
  };
}

/**
 * Runs Flay for the given paths
 *
 * @param paths {array}
 * @param callback {function}
 */
function run(paths, callback) {
  exec(command + paths.join(' '), {
    maxBuffer: 1024 * 5000
  }, function (error, stdout) {
    callback(error, parseOutput(stdout));
  });
}

module.exports = {
  run: run
};
