/* jslint node: true */
'use strict';

var assert = require('assert'),
  score = require('../lib/score');

describe('Score', function () {

  it('should correctly assess a rating of 1', function () {
    var rating = score.evaluate({
      complexity: {
        errors: ['an error', 'another error', 'yet another error']
      },
      security: ['insecure code', 'more insecure code'],
      jshint: ['formatting error', 'indentation error', 'unused code error'],
      duplicates: ['code duplication', 'more code duplication', 'copy paste error']
    });
    assert.equal(1, rating);
  });

  it('should correctly assess a rating of 2', function () {
    var rating = score.evaluate({
      complexity: {
        errors: ['an error', 'another error', 'yet another error']
      },
      security: ['insecure code'],
      jshint: ['formatting error'],
      duplicates: ['code duplication']
    });
    assert.equal(2, rating);
  });

  it('should correctly assess a rating of 3', function () {
    var rating = score.evaluate({
      complexity: {
        errors: ['an error', 'another error', 'yet another error']
      },
      security: [],
      jshint: [],
      duplicates: []
    });
    assert.equal(3, rating);
  });

  it('should correctly assess a rating of 4', function () {
    var rating = score.evaluate({
      complexity: {
        errors: []
      },
      security: ['an error'],
      jshint: [],
      duplicates: []
    });
    assert.equal(4, rating);
  });

  it('should correctly assess a rating of 5', function () {
    var rating = score.evaluate({
      complexity: {
        errors: []
      },
      security: [],
      jshint: [],
      duplicates: []
    });
    assert.equal(5, rating);
  });

  it('should get the overall score', function () {
    var rating = score.overall([{
      rating: 5
    }, {
      rating: 5
    }, {
      rating: 5
    }, {
      rating: 4
    }, {
      rating: 4
    }, {
      rating: 3
    }, {
      rating: 1
    }]);
    assert.equal(3.86, rating);
  });
});
