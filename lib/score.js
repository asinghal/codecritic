/* jslint node: true */
'use strict';

/**
 * Gets a rating based on the number of issues.
 *
 * @param numberOfIssues {number}
 */
function getRating(numberOfIssues) {
  var rating = 5;

  if (numberOfIssues > 10) {
    rating = 1;
  } else if (numberOfIssues > 5) {
    rating = 2;
  } else if (numberOfIssues > 2) {
    rating = 3;
  } else if (numberOfIssues > 0) {
    rating = 4;
  }

  return rating;
}

/**
 * Evaluates a file report and generates a rating
 *
 * @param report {object}
 */
function evaluate(report) {
  var numberOfIssues = [
    report.complexity.errors.length,
    (report.security || []).length,
    (report.jshint || []).length,
    (report.duplicates || []).length
  ].reduce(function (total, current) {
    return total + current;
  }, 0);

  return getRating(numberOfIssues);
}

/**
 * Generates an overall rating as a mean of ratings of all files.
 *
 * @param files {array}
 */
function overall(files) {
  var total = files.reduce(function (sum, file) {
    return sum + file.rating;
  }, 0);
  var score = total / files.length;
  return Math.round(score * 100) / 100;
}

module.exports = {
  evaluate: evaluate,
  overall: overall
};
