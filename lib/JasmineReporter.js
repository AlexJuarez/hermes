'use strict';

const webdriver = require('selenium-webdriver');

class JasmineReporter {

  constructor(config) {
    this._config = config || {};
    this._testResults = [];
    this._currentSuites = [];
    this._resolve = null;
    this._resultsPromise = new Promise(resolve => this._resolve = resolve);
  }

  specDone(result) {
    var results = this._extractSpecResults(result, this._currentSuites.slice(0));
    var resultsPromise = new Promise(resolve => {
      this._config.driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
        .then((entries) => {
          var traces = entries.map((entry) => {
            return JSON.parse(entry.message);
          });

          results.traces = traces;
          resolve(results);
        });
    });

    this._testResults.push(
      resultsPromise
    );
  }

  suiteStarted(suite) {
    this._currentSuites.push(suite.description);
  }

  suiteDone() {
    this._currentSuites.pop();
  }

  jasmineDone() {
    var self = this;
    let numFailingTests = 0;
    let numPassingTests = 0;
    const testResults = this._testResults;
    Promise.all(testResults).then((testResults) => {
      testResults.forEach((testResult) => {
        if (testResult.failureMessages.length > 0) {
          numFailingTests++;
        } else {
          numPassingTests++;
        }
      });

      self._resolve({
        numFailingTests,
        numPassingTests,
        testResults
      });
    });
  }

  getResults() {
    return this._resultsPromise;
  }

  _extractSpecResults(specResult, currentSuites) {
    const results = {
      title: 'it ' + specResult.description,
      ancestorTitles: currentSuites,
      failureMessages: [],
      numPassingAsserts: 0
    };

    specResult.failedExpectations.forEach(failed => {
      let message;
      if (!failed.matcherName) {
        message = failed.stack;
      } else {
        message = failed;
      }
      results.failureMessages.push(message);
    });

    return results;
  }
}

module.exports = JasmineReporter;
