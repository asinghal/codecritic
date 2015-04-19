/* jslint node: true */
'use strict';

var express = require('express'),
  router = express.Router(),
  projects = require('../lib/models/projects');

/* GET home page. */
router.get('/', function (req, res, next) {
  projects.list('asinghal', function (err, data) {
    res.render('index', {
      title: 'Code Critic',
      data: data
    });
  });
});

module.exports = router;
