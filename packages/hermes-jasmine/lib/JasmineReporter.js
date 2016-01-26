'use strict';

const EventEmitter = require('events');

function isExternalStackEntry(entry) {
  return (entry ? true : false) &&
      // entries related to jasmine
    !/\/(jasmine-core)\//.test(entry);
}

function getRelevantStackFrom(stack) {
  stack = stack.split('\n');

  let filteredStack = stack.filter((entry) => {
    return isExternalStackEntry(entry);
  });

  if (filteredStack.length === 0) {
    filteredStack = stack;
  }

  return filteredStack;
}

function formatFailedStep(step) {

  let relevantMessage = [];
  let relevantStack = [];

  let stack = step.stack.replace('Error: ' + step.message, '');
  let dirtyRelevantStack = getRelevantStackFrom(stack);

  dirtyRelevantStack.forEach((message) => {
    if (step.message && step.message.indexOf(message) === -1) {
      relevantStack.push(message);
    } else {
      relevantMessage.push(message);
    }
  });

  if (relevantMessage.length === 0) {
    relevantMessage.push(step.message);

    if (relevantStack.length && relevantStack[0].indexOf(step.message) !== -1) {
      relevantStack.shift();
    }
  }

  return relevantMessage.concat(relevantStack).join('\n');
}

function extractSpecResults(specResult, currentSuites) {
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
      result.log.push(formatFailedStep(step));
    });
  }

  return result;
}

/**
 * A reporter emits
 * result
 * complete
 * error
 * info
 */

class JasmineReporter extends EventEmitter {
  /**
   * Jasmine 2.0 dispatches the following events:
   * - jasmineStarted
   * - jasmineDone
   * - suiteStarted
   * - suiteDone
   * - specStarted
   * - specDone
   */

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
    var results = extractSpecResults(result,
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
}

module.exports = JasmineReporter;
