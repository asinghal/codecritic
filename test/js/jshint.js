/* jslint node: true */
'use strict';

var assert = require('assert'),
  jshint = require('../../lib/js/jshint');

describe('JSHint', function () {

  it('should report errors for bad code', function (done) {
    var file = __dirname + '/data/jshint/bad.js';
    jshint.run([file], function(err, output) {
      assert.equal(2, output[file].length);
      assert.equal(' Missing "use strict" statement.', output[file][0].msg);
      done();
    });
  });

  it('should not report errors for good code', function (done) {
    var file = __dirname + '/data/jshint/good.js';
    jshint.run([file], function(err, output) {
      assert.equal(undefined, output[file]);
      done();
    });
  });

});
