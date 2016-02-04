'use strict';

const log4js = require('log4js');

function create(name, level) {
  const logger = log4js.getLogger(name || 'hermes');
  if (helper.isDefined(level)) {
    logger.setLevel(level);
  }
  return logger;
}

module.exports = create;
