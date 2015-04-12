/* jslint node: true */
'use strict';

var express = require('express'),
  router = express.Router(),
  projects = require('../lib/project');

/* Add a project. */
router.post('/', function (req, res, next) {
  // 'git://github.com/asinghal/codecritic'
  projects.update('asinghal', req.body.projectName, req.body.gitUrl, function (err, data) {
    req.session.report = data;
    res.render("project", {
      data: data,
      title: 'Project Report - ' + req.body.projectName
    });
  });
});

/* Get a project. */
router.get('/', function (req, res, next) {
  res.render("project", {
    data: req.session.report,
    title: 'Project Report - ' + req.session.report.projectName
  });
});

module.exports = router;
