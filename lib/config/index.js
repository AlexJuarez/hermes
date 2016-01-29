'use strict';

const constant = require('hermes-constants');

const CONFIG_SYNTAX_HELP = `
module.exports = function(config) {
  config.set({
    // your config
  });
};
`;

class Config {
  constructor() {
    // set up log levels
    this.LOG_DISABLE = constant.LOG_DISABLE;
    this.LOG_ERROR = constant.LOG_ERROR;
    this.LOG_WARN = constant.LOG_WARN;
    this.LOG_INFO = constant.LOG_INFO;
    this.LOG_DEBUG = constant.LOG_DEBUG;
    this.loggers = [constant.CONSOLE_APPENDER];
    this.logLevel = constant.LOG_INFO;

    // general settings
    this.frameworks = [];
    this.files = [];
    this.exclude = [];
    this.reporters = [];
    this.colors = true;
    this.failOnEmptyTestSuite = true;
    this.maxWorkers = 5;
    this.maxRetries = 5;
    this.iterations = 1;
    this.usePolling = false;
    this.refreshInterval = 250;
    this.preprocess = (file) => {
      return new Promise((resolve) => {
        resolve();
      });
    };

    // autoWatch settings
    this.autoWatch = false;
    this.autoWatchDelay = 250;

    // proxy settings
    this.proxy = {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost'
    };
    this.proxyValidateSSL = false;
  }

  set(newConfig) {
    const self = this;
    Object.keys(newConfig).forEach((key) => {
      self[key] = newConfig[key];
    });
  }
}

module.exports = Config;
