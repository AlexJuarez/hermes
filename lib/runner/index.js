'use strict';

const Executor = require('./executor');
const EventEmitter = require('events');
const logger = require('hermes-logger');
const log = logger.create('runner');
const resolver = require('./../resolver');
const Promise = require('bluebird');

class Runner extends EventEmitter {
  constructor(config) {
    super();
    this._config = config || {};
  }

  run(testFilePath) {
    const self = this;

    const browsers = this._config.browsers.map((plugin) => {
      return (new (resolver.resolve(plugin))(self._config));
    });

    let executor = new Executor(browsers, this._config.adapters);

    executor.execute(testFilePath);

    executor.on('info', (info) => {
      self.emit('info', info);
    });

    executor.on('error', (err) => {
      log.error(err.message);
      Promise.all(browsers.map((browser) => {
        return browser.exit();
      }))
      .then(() => {
        self.emit('error');
      });
    });

    executor.on('result', (result) => {
      self.emit('result', result);
    });

    executor.on('complete', (results) => {
      Promise.all(browsers.map((browser) => {
        return browser.complete();
      }))
      .then((extra) => {
        const output = {
          results: results
        };
        if (extra.length) {
          output.traces = extra;
        }
        self.emit('complete', output);
      });
    });
  }
}

module.exports = Runner;
