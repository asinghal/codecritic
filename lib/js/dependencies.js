/* jslint node: true */
'use strict';

var david = require('david'),
  semver = require('semver');

/**
 * Checks if the required version of this package is up to date.
 *
 * @param pkg {object}
 */
function isOutdated(pkg) {
  return !semver.satisfies(pkg.stable, pkg.required) && !semver.satisfies(pkg.latest, pkg.required);
}

/**
 * Checks if this package has a valid version (and not a git repo).
 *
 * @param pkg {object}
 */
function isValidVersion(pkg) {
  return semver.valid(pkg.required) || semver.validRange(pkg.required);
}

/**
 * Filters and organises the list of dependencies. No point reporting ones
 * that are up to date.
 *
 * @param deps {object}
 */
function filter(deps) {
  var outdated = [];
  Object.keys(deps).forEach(function (key) {
    var pkg = deps[key];
    if (isOutdated(pkg) && isValidVersion(pkg)) {
      outdated.push({
        name: key,
        versions: pkg
      });
    }
  });
  return outdated;
}

/**
 * Runs David for the given project
 *
 * @param project {string}
 * @param callback {function}
 */
function run(project, callback) {
  var manifest = require(project + '/package.json');

  var result = {};

  david.getDependencies(manifest, function (err, deps) {
    result.prod = filter(deps);
    david.getDependencies(manifest, {
      dev: true
    }, function (devErr, devDeps) {
      result.dev = filter(devDeps);
      callback(devErr, result);
    });
  });
}

module.exports = {
  run: run
};
