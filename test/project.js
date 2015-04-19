/* jslint node: true */
'use strict';

var assert = require('assert'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  project = require('../lib/project');

describe('Project', function () {

  it('should evaluate a code base', function (done) {
    var filePath = __dirname + '/../workspace/testUsr/testProj/lib';
    mkdirp.sync(filePath);
    ['file1.js', 'file2.js', 'file3.js', 'badFormatting.js'].forEach(function (name) {
      fs.writeFileSync(filePath + '/' + name, fs.readFileSync(__dirname + '/js/data/critic/set1/lib/' + name, {
        encoding: 'utf8'
      }));
    });

    fs.writeFileSync(filePath + '/../package.json', fs.readFileSync(__dirname + '/js/data/critic/set1/package.json', {
      encoding: 'utf8'
    }));

    project.evaluateJS('testUsr', 'testProj', 'git@github.test:testUsr/testProj', function (err, data) {
      assert.equal(undefined, err);
      assert.equal(4, data.files.length);
      done();
    });
  });

  it('should get the source code', function () {
    var filePath = __dirname + '/../workspace/testUsr/testProj/lib';
    mkdirp.sync(filePath);
    ['file1.js', 'badFormatting.js'].forEach(function (name) {
      fs.writeFileSync(filePath + '/' + name, fs.readFileSync(__dirname + '/js/data/critic/set1/lib/' + name, {
        encoding: 'utf8'
      }));
    });

    var src = project.getSourceCode('testUsr', 'testProj', '/lib/file1.js');
    assert.equal(true, src.indexOf('aFunction') !== -1);
  });
});
