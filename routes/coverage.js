/* jslint node: true */
'use strict';

var express = require('express'),
  router = express.Router(),
  coverage = require('../lib/coverage'),
  project = require('../lib/project'),
  fs = require('fs');

/**
 * Deletes a given file.
 *
 * @param path {string}
 */
function deleteFile(path) {
  fs.unlink(path, function (err) {
    console.log('deleted coverage file');
  });
}

/* Upload the coverage file */
router.post('/', function (req, res) {
  fs.readFile(req.files.coverage.path, {
    encoding: 'utf8'
  }, function (err, data) {
    deleteFile(req.files.coverage.path);
    coverage.load(JSON.parse(data), req.session.report, 'asinghal', req.session.report.projectName);
    res.redirect('/projects');
  });
});

module.exports = router;
