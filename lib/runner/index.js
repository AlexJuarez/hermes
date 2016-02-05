'use strict';

const Executor = require('./executor');
const EventEmitter = require('events');
const logger = require('hermes-logger');
const log = logger.create('runner');
const Promise = require('bluebird');
const plugin = require('./../config/loadPlugins');

class Runner extends EventEmitter {
  constructor(config) {
    super();
    const conf = this._config = config || {};

    /**
     * The config is currently passed to a worker process by
     * the manager as a json blob. Therefore plugins cannot be passed
     * as functions and have to resolved by each worker thread.
     */
    plugin(conf);
  }

  run(testFilePath) {
    const self = this;

    const browsers = this._config._plugins.browsers.map((browser) => {
      return new browser(self._config);
    });

    let executor = new Executor(browsers, this._config);

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
