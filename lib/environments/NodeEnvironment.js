'use strict';

const vm = require('vm');
const global = require('./global');

class NodeEnvironment {
  constructor(config) {
    this.global = global();
    vm.createContext(this.global);
    this.global.setTimeout = setTimeout;
    this.global.clearTimeout = clearTimeout;
    this.global.setInterval = setInterval;
    this.global.clearInterval = clearInterval;
    this.global.Promise = Promise;
    this.global.JSON = JSON;
    this.global.console = console;
  }

  runSourceText(sourceText, filename) {
    return vm.runInContext(sourceText, this.global, {
      filename: filename,
      disableErrors: false
    });
  }
}

module.exports = NodeEnvironment;
