'use strict';

const constant = require('./../constants');
const logger = require('./../logger');
const log = logger.create('config');

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
    this.colors = true;
    this.failOnEmptyTestSuite = true;
    this.maxWorkers = 5;

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
      let value = newConfig[key];
      self[key] = value;
    });
  }
}

module.exports = Config;
