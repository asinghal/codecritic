/* jslint node: true */
'use strict';

var assert = require('assert'),
  dependencies = require('../../lib/js/dependencies');

describe('JS Module Dependencies', function () {

  it('should report versions for outdated dependencies', function (done) {
    var file = __dirname + '/data/dependencies/bad';
    dependencies.run(file, function(err, output) {
      assert.equal(1, output.prod.length);
      assert.equal(1, output.dev.length);
      done();
    });
  });

  it('should not report versions for updated dependencies', function (done) {
    var file = __dirname + '/data/dependencies/good';
    dependencies.run(file, function(err, output) {
      assert.equal(0, output.prod.length);
      assert.equal(0, output.dev.length);
      done();
    });
  });

});
