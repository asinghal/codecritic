/* jslint node: true */
'use strict';
var exec = require('child_process').exec,
  critic = require('./critic'),
  projects = require('./models/projects'),
  logger = require('./util/logger'),
  path = require('path'),
  fs = require('fs'),
  cloneOptions = {};

/**
 * Gets the workspace path for a given project and user
 *
 * @param user {string}
 * @param projectName {string}
 */
function getWorkspace(user, projectName) {
  var project = path.join(__dirname, '../workspace', user, projectName);
  return path.normalize(project);
}

/**
 * Cleans up the file names to show them as relative paths and not absolute paths.
 *
 * @param report {object}
 * @param project {string}
 */
function cleanUpDuplicateCodeFileNames(report, project) {
  report.duplicates.forEach(function (dupe) {
    Object.keys(dupe.files).forEach(function (key) {
      dupe.files[key].file = dupe.files[key].file.replace(project + '/', '');
    });
  });
}

/**
 * Cleans up the file names to show them as relative paths and not absolute paths.
 *
 * @param data {object}
 * @param project {string}
 */
function cleanUpFileNames(data, project) {
  var i = 1;
  data.files.forEach(function (report) {
    report.file = report.file.replace(project + '/', '');
    report.fileNum = i++;
    cleanUpDuplicateCodeFileNames(report, project);
  });
}

/**
 * Evaluate a javascript code base for quality.
 *
 * @param user {string}
 * @param projectName {string}
 * @param gitPath {string}
 * @param callback {function}
 */
function evaluateJS(user, projectName, gitPath, callback) {
  var project = getWorkspace(user, projectName);
  critic.evaluateJS(project, project, function (err, data) {
    data.projectName = projectName;
    cleanUpFileNames(data, project);
    projects.save(user, projectName, {
      user: user,
      gitUrl: gitPath,
      report: data
    }, function () {
      callback(err, data);
    });
  });
}

/**
 * Get codebase from the git repo (git clone/ pull).
 *
 * @param user {string}
 * @param projectName {string}
 * @param command {string}
 * @param gitPath {string}
 * @param callback {function}
 */
function doGit(user, projectName, command, gitPath, callback) {
  exec(command, {
    maxBuffer: 1024 * 1024 * 5000
  }, function (err, stdOut) {
    logger.info('received code from git repo ', err);
    evaluateJS(user, projectName, gitPath, callback);
  });
}

/**
 * Calls the right method based on whether a project already exists.
 *
 * @param user {string}
 * @param projectName {string}
 * @param gitPath {string}
 * @param callback {function}
 */
function addOrUpdate(user, projectName, gitPath, callback) {
  var workspace = getWorkspace(user, projectName),
    command = 'git clone ' + gitPath + ' ' + workspace;
  if (fs.existsSync(workspace)) {
    command = 'cd ' + workspace + '; git pull;';
  }
  doGit(user, projectName, command, gitPath, callback);
}

/**
 * Reads the source code of a given file.
 *
 * @param user {string}
 * @param projectName {string}
 * @param file {string}
 */
function getSourceCode(user, projectName, file) {
  return fs.readFileSync(getWorkspace(user, projectName) + '/' + file, {
    encoding: 'utf8'
  });
}

module.exports = {
  update: addOrUpdate,
  evaluateJS: evaluateJS,
  getSourceCode: getSourceCode,
  getWorkspace: getWorkspace
};
