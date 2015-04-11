/* jslint node: true */
'use strict';

var assert = require('assert'),
  duplicates = require('../../lib/js/duplicates');

describe('JS Code Duplication', function () {

  it('should report errors for bad code', function (done) {
    var file = __dirname + '/data/dupes/set1';
    duplicates.run([file], function (err, output) {
      assert.equal(1, output.issues.length);
      assert.equal('Total score (lower is better) = 99', output.summary);
      done();
    });
  });

  it('should not report errors for good code', function (done) {
    var file = __dirname + '/data/dupes/set2';
    duplicates.run([file], function (err, output) {
      assert.equal(0, output.issues.length);
      assert.equal('Total score (lower is better) = 0', output.summary);
      done();
    });
  });

});
