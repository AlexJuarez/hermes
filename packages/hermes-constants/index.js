'use strict';

const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), './package.json'), 'utf8'));

exports.CHROME_LOG_PATH = path.resolve(process.cwd(), './chrome.log');

// log levels
exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR = 'ERROR';
exports.LOG_WARN = 'WARN';
exports.LOG_INFO = 'INFO';
exports.LOG_DEBUG = 'DEBUG';

// Default patterns for the logger
exports.COLOR_PATTERN = '%[%d{DATE}:%p [%c]: %]%m';
exports.NO_COLOR_PATTERN = '%d{DATE}:%p [%c]: %m';

exports.GLOB_OPTS = {
  //cwd: '/',
  follow: true,
  nodir: true,
  sync: true
};

// Default console appender
exports.CONSOLE_APPENDER = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: exports.COLOR_PATTERN
  }
};
