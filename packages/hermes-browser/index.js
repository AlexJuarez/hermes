'use strict';

const EventEmitter = require('events');

class Browser extends EventEmitter {

  /**
   * ready should return a promise,
   * when the browser is ready resolve
   * the promise.
   */
  ready(){
    throw new Error('ready must be implemented');
  }

  /**
   * A environment configuration hook
   */
  setupEnv(/* environment */) {}

  /**
   * Called on spec completion,
   * must return a promise
   */
  complete() {
    throw new Error('complete must be implemented');
  }

  /**
   * Called when cleaning up
   */
  exit() {}
}

module.exports = Browser;
