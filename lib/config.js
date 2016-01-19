'use strict';

const constant = require('./constants');
const helper = require('./util');
const logger = require('./logger');
const log = logger.create('config');

const CONFIG_SYNTAX_HELP = `
module.exports = function(config) {
  config.set({
    // your config
  });
};
`;

class Config {
  constuctor() {

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
      log.debug(`set ${key} = ${value}`);
    });
  }
}

function parseConfig(configFilePath, cliOptions) {
  let configModule;
  if (configFilePath) {
    log.debug(`Loading config ${configFilePath}`);

    try {
      configModule = require(configFilePath);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(configFilePath) !== -1) {
        log.error(`File ${configFilePath} does not exist!`);
      } else {
        log.error(`Invalid config file!\n ${e.stack}`);
      }
      return process.exit(1);
    }
    if (!helper.isFunction(configModule)) {
      log.error(`Config file must export a function!\n ${CONFIG_SYNTAX_HELP}`);
    }
  } else {
    log.debug(`No config file specified.`);
    configModule = () => {};
  }

  const config = new Config();

  try {
    configModule(config);
  } catch (e) {
    log.error(`Error in config file!\n`, e);
    return process.exit(1);
  }

  config.set(cliOptions);

  logger.setup(config.logLevel, config.colors, config.loggers);

  return normalizeConfig(config, configFilePath);
}

exports.parseConfig = parseConfig;
exports.Config = Config;
