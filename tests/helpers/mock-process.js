'use strict';

module.exports = MockProcess;
function MockProcess() {
  this.signals = {};
  this.listeners = {};
  this.exits = 0;
}

MockProcess.prototype = Object.create({});
MockProcess.prototype.on = function(sig, fn) {
  if (typeof this.signals[sig] === 'undefined') {
    this.signals[sig] = [];
  }
  this.signals[sig].push(fn);
};

MockProcess.prototype.addListener = function(evt, fn) {
  if (typeof this.listeners[evt] === 'undefined') {
    this.listeners[evt] = [];
  }
  this.listeners[evt].push(fn);
};


MockProcess.prototype.exit = function(code) {
  this.exits += code;
};
