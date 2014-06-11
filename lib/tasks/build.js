'use strict';

var Promise      = require('../ext/promise');
var rimraf       = Promise.denodeify(require('rimraf'));
var mkdir        = Promise.denodeify(require('fs').mkdir);
var ncp          = Promise.denodeify(require('ncp'));
var chalk        = require('chalk');
var Task         = require('../models/task');
var Builder      = require('../models/builder');
var loadBrocfile = require('../utilities/load-brocfile');
var broccoli     = require('broccoli');

module.exports = Task.extend({
  // Options: String outputPath
  run: function(options) {
    var env = options.environment || 'development';
    process.env.EMBER_ENV = process.env.EMBER_ENV || env;

    var ui          = this.ui;
    var analytics   = this.analytics;
    var brocLoader  = loadBrocfile;
    var brocBuilder = broccoli.Builder;

    ui.pleasantProgress.start(chalk.green('Building'), chalk.green('.'));

    var builder = new Builder({
      brocLoader: brocLoader,
      brocBuilder: brocBuilder,
      process: process
    });

    return builder.build()
      .then(function(results) {
        var totalTime = results.totalTime / 1e6;
        analytics.track({
          name:    'ember build',
          message: totalTime + 'ms'
        });

        analytics.trackTiming({
          category: 'rebuild',
          variable: 'build time',
          label:    'broccoli build time',
          value:    parseInt(totalTime, 10)
        });

        return rimraf(options.outputPath)
          .then(function() {
            return mkdir(options.outputPath);
          })
          .then(function() {
            return ncp(results.directory, options.outputPath, {
                clobber: true,
                stopOnErr: true
              });
          });
      })
      .finally(function() {
        ui.pleasantProgress.stop();
      })
      .then(function() {
        ui.write(chalk.green('Built project successfully. Stored in "' +
          options.outputPath + '".\n'));
      })
      .catch(function(err) {
        ui.write(chalk.red('Build failed.\n'));

        if (err.message) {
          ui.write(err.message+'\n');
        }
        if (err.file) {
          var file = err.file;
          if (err.line) {
            file += err.col ? ' ('+err.line+':'+err.col+')' : ' ('+err.line+')';
          }
          ui.write('File: ' + file + '\n');
        }
        ui.write(err.stack);
      });
  }
});
