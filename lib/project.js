/* jslint node: true */
'use strict';
var nodegit = require('nodegit'),
  git = nodegit.Clone,
  repo = nodegit.Repository,
  critic = require('./critic'),
  path = require('path'),
  fs = require('fs'),
  cloneOptions = {};

/**
 * Security options
 */
cloneOptions.remoteCallbacks = {
  credentials: function (url, userName) {
    return nodegit.Cred.sshKeyFromAgent(userName);
  },
  certificateCheck: function () {
    return 1;
  }
};

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
 * Evaluate a javascript code base for quality.
 *
 * @param user {string}
 * @param projectName {string}
 * @param callback {function}
 */
function evaluateJS(user, projectName, callback) {
  var project = getWorkspace(user, projectName);
  critic.evaluateJS(project + '/lib', project, function (err, data) {
    callback(err, data);
  });
}

/**
 * Clone a git repo and run code quality checks.
 *
 * @param user {string}
 * @param projectName {string}
 * @param gitPath {string}
 * @param callback {function}
 */
function initCodeBase(user, projectName, gitPath, callback) {
  git.clone(gitPath, getWorkspace(user, projectName), cloneOptions)
    .then(function () {
      evaluateJS(user, projectName, callback);
    })
    .catch(function (err) {
      console.log(err);
    })
    .done(function () {
      console.log('cloned git repo');
    });
}

/**
 * Get the latest codebase from the git repo (git pull).
 *
 * @param user {string}
 * @param projectName {string}
 * @param callback {function}
 */
function update(user, projectName, callback) {
  repo.open(getWorkspace(user, projectName))
    .then(function (repository) {
      return repository.fetchAll(cloneOptions);
    })
    .catch(function (err) {
      console.log(err);
    })
    .done(function () {
      evaluateJS(user, projectName, callback);
      console.log('updated code base');
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
  if (fs.existsSync(getWorkspace(user, projectName))) {
    update(user, projectName, callback);
  } else {
    initCodeBase(user, projectName, gitPath, callback);
  }
}

module.exports = {
  update: addOrUpdate
};
