var express = require('express'),
  router = express.Router(),
  projects = require('../lib/project');

/* Add a project. */
router.post('/', function (req, res, next) {
  // 'git://github.com/asinghal/codecritic'
  projects.update('asinghal', req.body.projectName, req.body.gitUrl, function (err, data) {
    res.send(data);
  });
});

module.exports = router;
