'use strict';

var assign           = require('lodash-node/modern/objects/assign');
var liveReloadServer = require('./server/livereload-server');
var expressServer    = require('./server/express-server');
var broccoli         = require('broccoli');
var Promise          = require('../ext/promise');
var Task             = require('../models/task');
var buildWatcher     = require('../utilities/build-watcher');

module.exports = Task.extend({
  run: function(options) {
    process.env.EMBER_ENV = options.environment || 'development';

    var tree      = broccoli.loadBrocfile();
    var ui        = this.ui;
    var analytics = this.analytics;

    var builder = new broccoli.Builder(tree);
    var watcher = buildWatcher({
      ui:      ui,
      builder: builder
    });

    process.addListener('exit', function () {
      builder.cleanup();
    });

    // We register these so the 'exit' handler removing temp dirs is called
    process.on('SIGINT', function () {
      process.exit(1);
    });

    process.on('SIGTERM', function () {
      process.exit(1);
    });

    options = assign({}, options, { watcher: watcher });

    expressServer.ui    = ui;
    liveReloadServer.ui = ui;
    liveReloadServer.analytics = analytics;

    return Promise.all([
        liveReloadServer.start(options),
        expressServer.start(options)
      ]);
  }
});
