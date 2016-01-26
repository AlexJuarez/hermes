'use strict';

const webdriver = require('selenium-webdriver');
const Driver = require('./webdriver');
const Executor = require('./executor');
const EventEmitter = require('events');
const logger = require('hermes-logger');
const log = logger.create('runner');

class Runner extends EventEmitter {
  constructor(config) {
    super();
    this._config = config || {};
  }

  run(testFilePath) {
    const self = this;
    const proxyConfig = {
      https: `${this._config.domain}:${this._config.httpPort}`,
      http: `${this._config.domain}:${this._config.httpPort}`
    };
    let driver = Driver(proxyConfig);
    let executor = new Executor(driver);
    let driverError = false;

    executor.execute(testFilePath);

    executor.on('info', (info) => {
      self.emit('info', info);
    });

    executor.on('error', (err) => {
      log.error(err.message);
      driverError = true;
      driver.quit().then(() => {
        self.emit('error');
      });
    });

    executor.on('result', (result) => {
      self.emit('result', result);
    });

    executor.on('complete', (results) => {
      if (!driverError) {
        driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
          .then((entries) => {
            driver.quit();
            const traces = entries.map((entry) => {
              return JSON.parse(entry.message);
            });

            self.emit('complete', {
              results: results,
              traces: traces
            });
          });
      }
    });
  }
}

module.exports = Runner;
