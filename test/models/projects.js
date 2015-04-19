/* jslint node: true */
'use strict';

var assert = require('assert'),
  projects = require('../../lib/models/projects');

describe('Project Model', function () {

  it('should add a new project', function (done) {
    projects.save('testUser', 'Test PROJECT', {
      user: 'testUser',
      foo: 'bar'
    }, function (err, data) {
      assert.equal(undefined, err);
      done();
    });
  });

  it('should update an existing project', function (done) {
    projects.save('testUser', 'Test PROJECT', {
      user: 'testUser',
      foo: 'foobar'
    }, function (err, data) {
      assert.equal(undefined, err);
      done();
    });
  });

  it('should list existing projects', function (done) {
    projects.list('testUser', function (err, data) {
      assert.equal(1, data.length);
      done();
    });
  });

  it('should get details of an existing project', function (done) {
    projects.get('testUser', 'Test PROJECT', function (err, data) {
      assert.equal('testUser', data.user);
      assert.equal('foobar', data.foo);
      done();
    });
  });
});
