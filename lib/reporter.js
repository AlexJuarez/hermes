'use strict';

const ProgressReporter = require('./reporter/progress');
const fs = require('graceful-fs');
const path = require('path');

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
    const p = path.resolve(__dirname, './../results.json');
    console.log(p);
    fs.writeFileSync(p,
      JSON.stringify(results, null, ' '));

    this._reporters.forEach((reporter) => {
      reporter.writeReport(results);
    });
  }
}

module.exports = Reporter;
