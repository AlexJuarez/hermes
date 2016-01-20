'use strict';

const util = require('util');
const EventEmitter = require('events');

class Reporter extends EventEmitter {
  synopsis() {
    throw new Error('synopsis must be overridden.');
  }

  getDefaultConfig() {
    return null;
  }

  writeReport() {
    throw new Error('writeReport: must be overridden.');
  }
}

module.exports = Reporter;
