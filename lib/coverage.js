/* jslint node: true */
'use strict';

var project = require('./project'),
  fs = require('fs'),
  path = require('path'),
  Reporter = require('istanbul').Reporter,
  Collector = require('istanbul').Collector;

/**
 * Checks if a given string ends with the given suffix
 *
 * @param str {string}
 * @param suffix {string}
 */
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Builds a coverage data container.
 */
function initTotal() {
  return {
    total: 0,
    covered: 0,
    skipped: 0,
    pct: 0
  };
}

/**
 * Rounds off a number to 2 decimal places.
 *
 * @param number {number}
 */
function roundOff(number) {
  return Math.round(number * 100) / 100;
}

/**
 * Gets a status indicator for code coverage.
 *
 * @param number {number}
 */
function evaluateStatus(pct) {
  var thresholds = {
    80: 'green',
    50: 'amber',
    0: 'red'
  };
  var keys = Object.keys(thresholds).filter(function (threshold) {
    return pct >= threshold;
  });
  return thresholds[keys[keys.length - 1]];
}

/**
 * Adds file coverage summary data to an aggregated summary.
 *
 * @param aggregate {object}
 * @param file {object}
 */
function add(aggregate, file) {
  aggregate.total += file.total;
  aggregate.covered += file.covered;
  aggregate.skipped += file.skipped;
  aggregate.pct = roundOff((aggregate.covered / aggregate.total) * 100);
  aggregate.status = evaluateStatus(aggregate.pct);
  file.status = evaluateStatus(file.pct);
}

/**
 * Aggregates the project level totals.
 *
 * @param summary {string}
 */
function getProjectTotal(summary) {
  var total = {
    lines: initTotal(),
    statements: initTotal(),
    functions: initTotal(),
    branches: initTotal()
  };
  Object.keys(summary).forEach(function (file) {
    ['lines', 'statements', 'functions', 'branches'].forEach(function (metric) {
      add(total[metric], summary[file][metric]);
    });
  });
  return total;
}

/**
 * Generates a coverage summary report to show percentage of lines covered.
 *
 * @param coverageData {object}
 * @param user {string}
 * @param projectName {string}
 */
function getOverall(coverageData, user, projectName) {
  var workspace = project.getWorkspace(user, projectName),
    coverageDir = workspace + '/coverage',
    jsonFile = path.resolve(coverageDir, 'coverage-summary.json'),
    reporter = new Reporter(null, coverageDir),
    collector = new Collector();

  reporter.add('json-summary');
  collector.add(coverageData);
  reporter.write(collector, true, function () {});
  return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
}

/**
 * Filters out only the code info that is not covered in tests. That's 
 * the only interesting info.
 *
 * @param coverageData {object}
 * @param lookupKey {string}
 * @param mapKey {string}
 */
function getUncovered(coverageData, lookupKey, mapKey) {
  return Object.keys(coverageData[lookupKey]).filter(function (stmt) {
    return coverageData[lookupKey][stmt] === 0;
  }).map(function (stmt) {
    return coverageData[mapKey][stmt];
  });
}

/**
 * Add coverage data to quality report for a given file.
 *
 * @param coverageData {object}
 * @param files {array}
 * @param summary {object}
 */
function addToReport(coverageData, files, summary) {
  if (files.length) {
    files[0].coverage = {
      summary: summary,
      statements: getUncovered(coverageData, 's', 'statementMap'),
      functions: getUncovered(coverageData, 'f', 'fnMap'),
      branches: getUncovered(coverageData, 'b', 'branchMap')
    };
  }
}

/**
 * Find files that match the given name (i.e. the given name ends with 
 * the name in quality report).
 *
 * @param report {object}
 * @param name {string}
 */
function findMatchingFiles(report, name) {
  return report.files.filter(function (reported) {
    return endsWith(name, reported.file.trim());
  });
}

/**
 * Loads coverage info into the code quality report.
 *
 * @param coverageData {object}
 * @param report {object}
 * @param user {string}
 * @param projectName {string}
 */
function load(coverageData, report, user, projectName) {
  var summary = getOverall(coverageData, user, projectName);
  report.coverageSummary = getProjectTotal(summary);

  Object.keys(coverageData).forEach(function (name) {
    var files = findMatchingFiles(report, name);
    addToReport(coverageData[name], files, summary[name]);
  });
}

module.exports = {
  load: load
};
