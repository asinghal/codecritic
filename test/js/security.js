/* jslint node: true */
'use strict';

var assert = require('assert'),
  security = require('../../lib/js/security');

describe('JS Security Scanner', function () {

  it('should report errors for bad code', function (done) {
    var file = __dirname + '/data/security/set1';
    security.run([file], file, function(err, output) {
      assert.equal(1, output[file + '/bad.js'].length);
      assert.equal('setTimeout', output[file + '/bad.js'][0].rule.name);
      done();
    });
  });

  it('should not report errors for good code', function (done) {
    var file = __dirname + '/data/security/set2';
    security.run([file], file, function(err, output) {
      assert.equal(0, output[file + '/good.js'].length);
      done();
    });
  });

});
