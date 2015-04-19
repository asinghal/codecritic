/* jslint node: true */
'use strict';

var express = require('express'),
  router = express.Router(),
  projects = require('../lib/project'),
  projectsDb = require('../lib/models/projects');

/**
 * Evaluates a project for code quality
 *
 * @param req {object}
 * @param res {object}
 * @param user {string}
 * @param projectName {string}
 * @param gitUrl {string}
 */
function update(req, res, user, projectName, gitUrl) {
  projects.update(user, projectName, gitUrl, function (err, data) {
    req.session.report = data;
    res.render("project", {
      data: data,
      title: 'Project Report - ' + req.body.projectName
    });
  });
}

/* Add a project. */
router.post('/', function (req, res, next) {
  update(req, res, 'asinghal', req.body.projectName, req.body.gitUrl);
});

/* Get current project from session. */
router.get('/', function (req, res, next) {
  res.render("project", {
    data: req.session.report,
    title: 'Project Report - ' + req.session.report.projectName
  });
});

/* Get a project. */
router.get('/:name', function (req, res, next) {
  projectsDb.get('asinghal', req.params.name, function (err, data) {
    update(req, res, 'asinghal', req.params.name, data.gitUrl);
  });
});

module.exports = router;
