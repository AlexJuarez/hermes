'use strict';

const webdriver = require('selenium-webdriver');
const Driver = require('./webdriver');
const execute = require('./executor');
const EventEmitter = require('events');

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
    var driver = Driver(proxyConfig);
    var reporter = execute(testFilePath, driver);

    reporter.on('info', (info) => {
      self.emit('info', info);
    });

    reporter.on('error', (err) => {
      self.emit('error', err);
    });

    reporter.on('result', (result) => {
      self.emit('result', result);
    });

    reporter.on('complete', (results) => {
      driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
        .then((entries) => {
          driver.close();
          const traces =  entries.map((entry) => {
            return JSON.parse(entry.message);
          });

          self.emit('complete', {
            results: results,
            traces: traces
          });
        });
    });
  }
}

module.exports = Runner;
