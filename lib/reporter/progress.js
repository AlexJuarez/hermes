'use strict';

const Reporter = require('./');

class ProgressReporter extends Reporter {
  constructor(conf) {
    super(conf);
    this._config = conf || {};
  }

  synopsis() {
    return 'reports the progress as results return';
  }

  writeReport(results) {
    results = results.map((results) => results.results);
    console.log(results);
  }
}

module.exports = ProgressReporter;
