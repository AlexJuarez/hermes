'use strict';

const webdriver = require('selenium-webdriver');
const Driver = require('./webdriver');
const execute = require('./executor');
const EventEmitter = require('events');

class Runner extends EventEmitter {
  constructor(config) {
    this._config = config || {};
  }

  run(testFilePath) {
    const proxyConfig = {
      https: `${this._config.domain}:${this._config.httpPort}`,
      http: `${this._config.domain}:${this._config.httpPort}`
    };
    var driver = Driver(proxyConfig);
    var reporter = execute(testFilePath, driver);

    reporter.on('result', (result) => {
      var msg = result.success ? 'SUCCESS ' : 'FAILED ';
      console.log(msg + result.suite.join(' ') + ' ' + result.description + ' ' + result.time);
      result.log.forEach((message) => {
        console.error(message);
      });
    });

    let _resolve;
    let p = new Promise((resolve) => _resolve = resolve);

    reporter.on('complete', (results) => {
      driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
        .then((entries) => {
          driver.close();
          _resolve({
            results: results,
            traces: entries.map((entry) => {
              return JSON.parse(entry.message);
            })
          });
        });
    });

    return p;
  }
}

module.exports = Runner;
