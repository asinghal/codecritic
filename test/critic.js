/* jslint node: true */
'use strict';

var assert = require('assert'),
  critic = require('../lib/critic');

describe('JS Critic', function () {

  it('should report errors for bad code', function (done) {
    var file = __dirname + '/js/data/critic/set1';
    critic.evaluateJS(file, file, function (err, output) {
      assert.equal(5, output.files.length);
      assert.equal(1, output.dependencies.prod.length);
      assert.equal(1, output.files[0].complexity.functions.length);
      assert.equal(0, output.files[0].complexity.errors.length);
      assert.equal(0, output.files[0].security.length);
      assert.equal(2, output.files[0].jshint.length);
      assert.equal(' Missing "use strict" statement.', output.files[0].jshint[0].msg);
      assert.equal(4, output.files[0].rating);
      assert.equal(1, output.files[2].duplicates.length);
      assert.equal('1) Similar code found in :function_decl (mass = 99)', output.files[2].duplicates[0].title);
      assert.equal(4, output.files[2].rating);
      assert.equal(3.6, output.score);
      done();
    });
  });
});
