'use strict';

const path = require('path');
const fs = require('fs');

function findConfig(configFile) {
  if (!configFile) {
    if (fs.existsSync('./hermes.conf.js')) {
      configFile = './hermes.conf.js';
    } else if (fs.existsSync('./.config/hermes.conf.js')) {
      configFile = './.config/hermes.conf.js';
    }
  }

  return configFile ? path.resolve(configFile) : null;
}

module.exports = findConfig;
