/* jslint node: true */
'use strict';

var db = require('../db').db;

/**
 * Removes spaces and simplifies the name so that it can be used as a 
 * key in database.
 *
 * @param name {string}
 */
function simplifyName(name) {
  return name.trim().replace(/ /g, '.').toLowerCase();
}

/**
 * Coverts the project name to a convention for the key name that can 
 * be used to store the project details in database.
 *
 * @param name {string}
 */
function projectKey(name) {
  return 'project_' + simplifyName(name);
}

/**
 * Log an error.
 *
 * @param err {string}
 */
function logError(err) {
  if (err) {
    console.log('[db] error: ', err);
  }
}

/**
 * Gets a list of all projects.
 *
 * @param user {string}
 * @param callback {function}
 */
function listProjects(user, callback) {
  db.get('projects', function (err, projects) {
    logError(err);
    projects = (projects || []).filter(function (project) {
      return project.user === user;
    });
    callback(err, projects);
  });
}

/**
 * Finds projects with the given key.
 *
 * @param projects {array}
 * @param key {string}
 */
function find(projects, key) {
  return projects.filter(function (project) {
    return project.key === key;
  });
}

/**
 * Adds the name of a project to an "index" so it can be easily looked up 
 * later.
 *
 * @param user {string}
 * @param name {string}
 * @param callback {function}
 */
function registerProject(user, name, callback) {
  listProjects(user, function (err, projects) {
    var key = simplifyName(name),
      found = find(projects, key);
    if (!found.length) {
      projects.push({
        user: user,
        key: key
      });
    }
    db.put('projects', projects, function (writeErr, data) {
      logError(writeErr);
      callback(writeErr, data);
    });
  });
}

/**
 * Saves project details into the database.
 *
 * @param user {string}
 * @param name {string}
 * @param project {object}
 * @param callback {function}
 */
function addProject(user, name, project, callback) {
  db.put(projectKey(name), project, function (err, data) {
    logError(err);
    callback(err, data);
  });
}

/**
 * Registers and saves project details into the database.
 *
 * @param user {string}
 * @param name {string}
 * @param project {object}
 * @param callback {function}
 */
function save(user, name, project, callback) {
  registerProject(user, name, function (err, data) {
    addProject(user, name, project, callback);
  });
}

/**
 * Gets the project details for a given name.
 *
 * @param user {string}
 * @param name {string}
 * @param callback {function}
 */
function getProject(user, name, callback) {
  db.get(projectKey(name), function (err, data) {
    logError(err);
    callback(err, data);
  });
}

module.exports = {
  list: listProjects,
  save: save,
  get: getProject
};
