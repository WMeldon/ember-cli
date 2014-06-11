'use strict';

var assert = require('assert');

var MockProcess  = require('../../helpers/mock-process');
var MockBrocBuilder = require('../../helpers/mock-builder');
var Builder = require('../../../lib/models/builder');

describe('Builder', function() {
  var process;
  var subject;
  var builder;

  before(function() {
    builder = MockBrocBuilder;
    process = new MockProcess();

    subject = new Builder({
      brocLoader: function(){},
      brocBuilder: builder.Builder,
      process: process,
    });
  });

  describe('builder:init', function() {
    it('binds signals', function() {
      assert.equal(1, subject.process.signals.SIGINT.length);
      assert.equal(1, subject.process.signals.SIGTERM.length);
      assert.equal(1, subject.process.listeners.exit.length);
    });
  });

  describe('builder:end', function() {
    it('handles SIGTERM', function() {
      process.signals.SIGTERM[0]();
      assert.equal(1, process.exits);
    });
    it('handles SIGINT', function() {
      process.signals.SIGINT[0]();
      assert.equal(2, process.exits);
    });
    it('handles exit', function() {
      process.listeners.exit[0]();
      assert.equal(1, subject.builder.cleanups);
    });
  });

  describe('builder:additional', function() {
    var newSubject;

    before(function() {
      builder = MockBrocBuilder;
      process = new MockProcess();

      newSubject = new Builder({
        brocLoader: function(){},
        brocBuilder: builder.Builder,
        process: process,
      });
    });

    it('does not bind additional signal handlers', function() {
      assert.ok(!newSubject.process.signals.SIGINT);
      assert.ok(!newSubject.process.signals.SIGTERM);
    });

  });

});
