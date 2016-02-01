'use strict';

class Environment {
  runSourceText(/* sourceText, filename */) {
    throw new Error('runSourceText must be implemented.');
  }

  dispose() {
    throw new Error('dispose must be implemented');
  }
}

module.exports = Environment;
