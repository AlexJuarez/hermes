'use strict';

const global = require('./global');
const Environment = require('./');
const jsdom = require('jsdom');

class JSDOMEnvironment extends Environment {
  constructor(config) {
    super();
    config = config || {};

    this.document = jsdom.jsdom(/* markup */ null, {
      url: config.testUrl
    });

    this.global = this.document.defaultView;

    // Node's error-message stack size is limited at 10, but it's pretty useful
    // to see more than that when a test fails.
    this.global.Error.stackTraceLimit = 100;
    global(this.global, config.globals);
  }

  dispose() {
    this.global.close();
    this.global = null;
    this.document = null;
  }

  runSourceText(sourceText, filename) {
    return this.global.eval(sourceText + '\n//# sourceUrl=' + filename);
  }
}

module.exports = JSDOMEnvironment;
