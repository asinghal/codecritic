/* jslint node: true */
'use strict';

var assert = require('assert'),
  coverage = require('../lib/coverage');

describe('JS Coverage', function () {

  it('should load coverage', function (done) {
    var coverageData = require('./data/coverage.json');
    var report = require('./data/report.json');
    coverage.load(coverageData, report, 'asinghal', 'codecritic');
    assert.equal(1, report.files[0].coverage.statements.length);
    assert.equal(0, report.files[0].coverage.functions.length);
    assert.equal(0, report.files[0].coverage.branches.length);

    assert.equal(26, report.files[0].coverage.summary.lines.total);
    assert.equal(25, report.files[0].coverage.summary.lines.covered);
    assert.equal(0, report.files[0].coverage.summary.lines.skipped);
    assert.equal(96.15, report.files[0].coverage.summary.lines.pct);
    assert.equal('green', report.files[0].coverage.summary.lines.status);

    assert.equal(52, report.coverageSummary.lines.total);
    assert.equal(50, report.coverageSummary.lines.covered);
    assert.equal(0, report.coverageSummary.lines.skipped);
    assert.equal(96.15, report.coverageSummary.lines.pct);
    assert.equal('green', report.coverageSummary.lines.status);
    done();
  });
});
