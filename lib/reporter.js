'use strict';

const ProgressReporter = require('./reporter/progress');

const defaultTypes = {
  'progress': ProgressReporter
};

class Reporter {
  constructor(conf) {
    this._config = conf || {};
    this._reporters = [];

    this._config.reporters.forEach((reporter) => {
      const R = defaultTypes[reporter];
      this._reporters.push(new R(conf));
    });
  }

  write(results) {
    this._reporters.forEach((reporter) => {
      reporter.writeReport(results);
    });
  }
}

module.exports = Reporter;
