'use strict';

var Task    = require('../models/task');
var Testem  = require('testem');
var Promise = require('../ext/promise');

module.exports = Task.extend({
  run: function(environment, options) {
    var testemOptions = { cwd: options.cwd, file: options.configFile };
    var mode = 'startCI';
    var testem  = new Testem();

    testem[mode](testemOptions);

    return Promise.resolve();
  }
});
