'use strict';

const webdriver = require('selenium-webdriver');
const Driver = require('./lib/webdriver');
const updateDriver = require('./lib/browser');
const Browser = require('hermes-browser');

class ChromeBrowser extends Browser {
  constructor(config) {
    super();
    this.config = config || {};
    this._driver = new Driver(config.proxy);
    this._done = false;
  }

  ready() {
    const self = this;
    return new Promise((resolve) => {
      self._driver.getTitle().then(() => {
        resolve();
      })
    })
  }

  setupEnv(environment) {
    environment.global.browser = updateDriver(this._driver);
  }

  complete() {
    const self = this;
    return new Promise((resolve) => {
      if (!self._done) {
        self._driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
          .then((entries) => {
            self.exit().then(() => {
              const traces = entries.map((entry) => {
                return JSON.parse(entry.message);
              });

              resolve(traces);
            });
          });
      } else {
        resolve();
      }
    });
  }

  exit() {
    this._done = true;
    return this._driver.quit();
  }
}

module.exports = {
  browsers: [ChromeBrowser]
};
