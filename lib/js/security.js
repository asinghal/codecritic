/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  logger = require('../util/logger'),
  fs = require('fs');

/**
 * Runs ScanJS for the given paths
 *
 * @param paths {array}
 * @param project {string}
 * @param callback {function}
 */
function run(paths, project, callback) {
  logger.info('[security] analysis started');
  exec('rm -rf ' + project + '/scanreport*', {
    maxBuffer: 1024 * 5000
  }, function () {
    var command = 'node ' + __dirname + '/../../node_modules/scanjs/scanner.js -o ' + project + '/scanreport -t ';
    exec(command + paths.join(' '), function (error) {
      logger.info('[security] analysis completed', error);
      var report = JSON.parse(fs.readFileSync(project + '/scanreport.JSON').toString());
      callback(error, report);
    });
  });
}

module.exports = {
  run: run
};
