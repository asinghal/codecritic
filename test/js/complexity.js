/* jslint node: true */
'use strict';

var assert = require('assert'),
  complexity = require('../../lib/js/complexity');

describe('JS Complexity', function () {

  it('should report errors for bad code', function (done) {
    var file = __dirname + '/data/complexity/set1';
    complexity.run([file], function(err, output) {
      assert.equal(1, output.length);
      assert.equal(5, output[0].errors.length);
      assert.equal('HIGH_CYCLOMATIC_COMPLEXITY', output[0].errors[0].msg);
      done();
    });
  });

  it('should not report errors for good code', function (done) {
    var file = __dirname + '/data/complexity/set2';
    complexity.run([file], function(err, output) {
      assert.equal(1, output.length);
      assert.equal(0, output[0].errors.length);
      done();
    });
  });

});
