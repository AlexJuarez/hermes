'use strict';

const logger = require('hermes-logger');
const log = logger.create('config');
const helper = require('hermes-util');
const Config = require('./');

function normalizeConfig(config, configFilePath) {
  return config;
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

  if (cliOptions) {
    config.set(cliOptions);
  }

  logger.setup(config.logLevel, config.colors, config.loggers);

  return normalizeConfig(config, configFilePath);
}

module.exports = parseConfig;
