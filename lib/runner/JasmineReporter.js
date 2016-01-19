'use strict';

const EventEmitter = require('events');

/**
 * A reporter emits
 * result
 * complete
 * error
 * info
 */

class JasmineReporter extends EventEmitter {
  constructor(config) {
    super();

    this._config = config || {};
    this._testResults = [];
    this._currentSuites = [];
  }

  specStarted(specResult) {
    specResult.startTime = new Date().getTime();
  }

  specDone(result) {
    var results = this._extractSpecResults(result,
      this._currentSuites.slice(0));

    this.emit('result', results);

    this._testResults.push(
      results
    );
  }

  suiteStarted(suite) {
    this._currentSuites.push(suite.description);
  }

  suiteDone() {
    this._currentSuites.pop();
  }

  jasmineDone() {
    this.emit('complete', this._testResults);
  }

  _extractSpecResults(specResult, currentSuites) {
    const skipped = specResult.status === 'disabled' ||
        specResult.status === 'pending';

    const result = {
      description: specResult.description,
      id: specResult.id,
      log: [],
      suite: currentSuites,
      skipped: skipped,
      success: specResult.failedExpectations.length === 0,
      time: skipped ? 0 : new Date().getTime() - specResult.startTime
    };

    if (!result.success) {
      specResult.failedExpectations.forEach((step) => {
        result.log.push(step.stack);
      });
    }

    return result;
  }
}

module.exports = JasmineReporter;
