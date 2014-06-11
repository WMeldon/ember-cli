'use strict';

var Task         = require('./task');

var signalsTrapped = false;

module.exports = Task.extend({
  init: function() {

    this.tree = this.brocLoader(this.liveOutputDir); // TODO:
    this.builder = new this.brocBuilder(this.tree);

    this.process.addListener('exit', this.onExit.bind(this));

    if (!signalsTrapped) {
      this.process.on('SIGINT',  this.onSIGINT.bind(this));
      this.process.on('SIGTERM', this.onSIGTERM.bind(this));
      signalsTrapped = true;
    }
  },

  build: function() {
    return this.builder.build.apply(this.builder, arguments);
  },

  onExit: function() {
    this.builder.cleanup();
  },

  onSIGINT: function() {
    this.process.exit(1);
  },
  onSIGTERM: function() {
    this.process.exit(1);
  }
});
