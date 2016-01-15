'use strict';

const webdriver = require('selenium-webdriver');
const Driver = require('./webdriver');
const execute = require('./executor');

class Runner {
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
      console.log(msg + result.suite.join(' ') + ' ' + result.description);
      result.log.forEach((message) => {
        console.error(message);
      });
    });

    reporter.on('complete', () => {
      driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
        .then((entries) => {
          reporter.addTrace(entries.map((entry) => {
            return JSON.parse(entry.message);
          }));
          driver.close();
          reporter.emit('cleanup');
        });
    });

    return reporter;
  }
}

module.exports = Runner;
