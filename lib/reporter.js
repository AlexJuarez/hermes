'use strict';

const ProgressReporter = require('./reporter/progress');
const helper = require('hermes-util');
const log = require('hermes-logger').create('reporter');

const defaultTypes = {
  'progress': ProgressReporter
};

class Reporter {
  constructor(conf) {
    this._config = conf || {};
    this._reporters = [];

    this._config.reporters.forEach((reporter) => {
      if(helper.isString(reporter)) {
        const R = defaultTypes[reporter];
        if (helper.isDefined(R)) {
          this._reporters.push(new R(conf));
        } else {
          log.warn(`Reporter ${reporter} not found, the currently supported ` +
            `types are ${Object.keys(defaultTypes).join(', ')}`)
        }
      } else if (helper.isFunction(reporter)) {
        this._reporters.push(reporter);
      } else {
        log.warn(`Invalid reporter format please check your config.`);
      }
    });
  }

  write(results) {
    this._reporters.forEach((reporter) => {
      if (helper.isFunction(reporter) && !reporter.writeReport) {
        reporter(results);
      } else {
        reporter.writeReport(results);
      }
    });
  }
}

module.exports = Reporter;
