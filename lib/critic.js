/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  jshint = require('./js/jshint'),
  duplicates = require('./js/duplicates'),
  security = require('./js/security'),
  dependencies = require('./js/dependencies'),
  complexity = require('./js/complexity'),
  score = require('./score'),
  async = require('async');

/**
 * Checks if this issue belongs to the given file name
 *
 * @param issue {object}
 * @param file {string}
 */
function applicableIssues(issue, file) {
  var found = false;
  Object.keys(issue.files).forEach(function (key) {
    if (issue.files[key].file.trim() === file) {
      found = true;
    }
  });
  return found;
}

/**
 * Organises the generated result by file names.
 *
 * @param result {object}
 */
function organize(result) {
  var output = result.complexity.map(function (report) {
    return {
      file: report.file,
      complexity: {
        functions: report.functions,
        errors: report.errors
      },
      security: result.security[report.file],
      jshint: result.jshint[report.file] || []
    };
  });
  output.forEach(function (report) {
    report.duplicates = result.duplicates.issues.filter(function (issue) {
      return applicableIssues(issue, report.file);
    });
    report.rating = score.evaluate(report);
  });
  return {
    files: output,
    dependencies: result.dependencies,
    score: score.overall(output)
  };
}

/**
 * Runs various checks for javascript code quality and generates a report
 *
 * @param codeBase {string} path to the source files to be tested
 * @param project {string} path to the project root directory
 * @param callback {function}
 */
function evaluateJS(codeBase, project, callback) {
  async.parallel([
    function (cb) {
      jshint.run([codeBase], function (err, data) {
        // kills the process upon error
        cb(null, data);
      });
    },
    function (cb) {
      duplicates.run([codeBase], cb);
    },
    function (cb) {
      dependencies.run(project, cb);
    },
    function (cb) {
      security.run([codeBase], project, cb);
    },
    function (cb) {
      complexity.run([codeBase], cb);
    }
  ], function (err, data) {
    var output = {
      jshint: data[0],
      duplicates: data[1],
      dependencies: data[2],
      security: data[3],
      complexity: data[4]
    };
    callback(err, organize(output));
  });
}

module.exports = {
  evaluateJS: evaluateJS
};
