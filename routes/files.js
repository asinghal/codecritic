/* jslint node: true */
'use strict';

var express = require('express'),
  router = express.Router(),
  projects = require('../lib/project');

/* Get a file's details. */
router.get('/:fileNum', function (req, res, next) {
  var data = null;
  req.session.report.files.forEach(function (file) {
    if (file.fileNum === parseInt(req.params.fileNum, 10)) {
      data = file;
      data.projectName = req.session.report.projectName;
      data.srcCode = projects.getSourceCode('asinghal', req.session.report.projectName, file.file);
    }
  });
  res.render("file", {
    data: data,
    title: 'Project Report - ' + req.session.report.projectName
  });
});

module.exports = router;
