'use strict';

const EventEmitter = require('events');

/**
 * Adapter can emit
 * result, complete, info, error
 */

class Adapter extends EventEmitter {
  /**
   * returns a Promise
   */
  preExecute(/* enviroment, testPath */) {
    throw new Error('preExecute: must be implemented');
  }

  /**
   * returns a Promise
   */
  postExecute(/* enviroment, testPath */) {
    throw new Error('postExecute: must be implemented');
  }
}

module.exports = Adapter;
