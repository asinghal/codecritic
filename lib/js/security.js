/* jslint node: true */
'use strict';

var exec = require('child_process').exec,
  extend = require('util')._extend,
  fs = require('fs');

/**
 * Runs ScanJS for the given paths
 *
 * @param paths {array}
 * @param project {string}
 * @param callback {function}
 */
function run(paths, project, callback) {
  exec('rm -rf ' + project + '/scanreport*', function (delErr, delOut) {
    var command = 'node ' + __dirname + '/../../node_modules/scanjs/scanner.js -o ' + project + '/scanreport -t ';
    exec(command + paths.join(' '), function (error, stdout) {
      var report = JSON.parse(fs.readFileSync(project + '/scanreport.JSON').toString());
      callback(error, report);
    });
  });
}

module.exports = {
  run: run
};
