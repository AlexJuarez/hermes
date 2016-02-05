'use strict';

const log4js = require('log4js');
const _ = require('lodash');

function create(name, level) {
  const logger = log4js.getLogger(name || 'hermes');
  if (!_.isUndefined(level)) {
    logger.setLevel(level);
  }
  return logger;
}

module.exports = create;
