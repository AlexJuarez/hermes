'use strict';

const log4js = require('log4js');
const constant = require('hermes-constants');
const helper = require('hermes-util');

function setup(level, colors, appenders) {
  // Turn color on or off in the console appender
  const pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN;

  // If there are no appenders use the default one
  appenders = helper.isDefined(appenders) ?
    appenders : [constant.CONSOLE_APPENDER];

  appenders = appenders.map((appender) => {
    if (appender.type === 'console') {
      if (helper.isDefined(appender.layout) && appender.layout.type === 'pattern') {
        appender.layout.pattern = pattern;
      }
    }
    return appender;
  });

  log4js.setGlobalLogLevel(level);
  log4js.configure({
    appenders: appenders
  });
}

function create(name, level) {
  const logger = log4js.getLogger(name || 'hermes');
  if (helper.isDefined(level)) {
    logger.setLevel(level);
  }
  return logger;
}

exports.create = create;
exports.setup = setup;
