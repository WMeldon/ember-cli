'use strict';

var chalk         = require('chalk');
var lookupCommand = require('./lookup-command');
var Promise       = require('../ext/promise');

function CLI(options) {
  this.ui   = options.ui;
  this.analytics = options.analytics;
  this.testing = options.testing;
}

module.exports = CLI;

CLI.prototype.run = function(environment) {
  this.ui.write('version: ' + require('../../package.json').version + '\n');

  return Promise.hash(environment).then(function(environment) {
    var args = environment.cliArgs.slice();
    var commandName = args.shift();
    // args should be options
    // {
    //   flag: value,
    //   flag2: value,
    //
    //   args: [ ]
    // }
    var commandArgs = args;
    var CurrentCommand = lookupCommand(environment.commands, commandName);

    var command = new CurrentCommand({
      ui: this.ui,
      analytics: this.analytics,
      commands: environment.commands,
      tasks: environment.tasks,
      isWithinProject: environment.isWithinProject
    });

    return command.validateAndRun(commandArgs);
  }.bind(this)).catch(this.logError.bind(this));
};

CLI.prototype.logError = function(error) {
  if (this.testing && error) {
    console.error(error.message);
    console.error(error.stack);
  }
  if (error) {
    if (error instanceof Error) {
      this.ui.write(chalk.red(error.message));
      this.ui.write(error.stack.toString().replace(/,/g, '\n'));
    } else {
      this.ui.write(chalk.red(error));
    }
  }
};