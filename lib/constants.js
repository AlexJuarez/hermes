'use strict';

const fs = require('fs');
const path = require('path');

const pkg = JSON
  .parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

const JASMINE_PATH = path.resolve(__dirname,
  './../vendor/jasmine-core/jasmine-2.4.1.js');

exports.JASMINE_PATH = JASMINE_PATH;
exports.JASMINE_2 = fs.readFileSync(JASMINE_PATH, 'utf8');
exports.CHROME_LOG_PATH = path.resolve(__dirname, './../chrome.log');

// log levels
exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR = 'ERROR';
exports.LOG_WARN = 'WARN';
exports.LOG_INFO = 'INFO';
exports.LOG_DEBUG = 'DEBUG';

// Default patterns for the logger
exports.COLOR_PATTERN = '%[%d{DATE}:%p [%c]: %]%m';
exports.NO_COLOR_PATTERN = '%d{DATE}:%p [%c]: %m';

// Default console appender
exports.CONSOLE_APPENDER = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: exports.COLOR_PATTERN
  }
};
