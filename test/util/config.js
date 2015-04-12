/* jslint node: true */
'use strict';

var assert = require('assert'),
  config = require('../../lib/util/config'),
  nodeEnv = process.env.NODE_ENV;

describe('Config', function () {

  it('should not add config flags for non test environments', function () {
    var parts = [];
    var conf = config.add(parts, 'myflag', 'myconfig.json');
    assert.equal(' ', conf);
  });

  it('should add config flags for test environments', function () {
    var parts = [];
    process.env.NODE_ENV = 'development';
    var conf = config.add(parts, 'myflag', 'myconfig.json');
    assert.equal('myflag /Users/asinghal/projects/codecritic/lib/util/myconfig.json ', conf);
  });

  after(function() {
    process.env.NODE_ENV = nodeEnv;
  });

});
