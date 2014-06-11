'use strict';

exports.Builder = Builder;

function Builder(tree) {
  this.tree = tree;
  this.cleanups = 0;
}
Builder.prototype.build = function(){};

Builder.prototype.cleanup = function() {
  this.cleanups += 1;
};

function MockBuilder() {

}

MockBuilder.prototype.Builder = Builder;
