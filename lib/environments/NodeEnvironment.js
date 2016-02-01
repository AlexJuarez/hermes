'use strict';

const vm = require('vm');
const global = require('./global');
const Environment = require('./');

class NodeEnvironment extends Environment {
  constructor(config) {
    super();

    config = config || {};
    this.global = {};
    vm.createContext(this.global);
    this.global.setTimeout = setTimeout;
    this.global.clearTimeout = clearTimeout;
    this.global.setInterval = setInterval;
    this.global.clearInterval = clearInterval;
    this.global.Promise = Promise;
    this.global.JSON = JSON;
    this.global.console = console;
    global(this.global, config.globals);
  }

  dispose() {
    this.global = null;
  }

  runSourceText(sourceText, filename) {
    return vm.runInContext(sourceText, this.global, {
      filename: filename
    });
  }
}

module.exports = NodeEnvironment;
