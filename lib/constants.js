const fs = require('fs');
const path = require('path');

const pkg = JSON
  .parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

const JASMINE_PATH = path.resolve(__dirname, './../vendor/jasmine-2.4.1.js');

exports.JASMINE_PATH = JASMINE_PATH;
exports.JASMINE_2 = fs.readFileSync(JASMINE_PATH, 'utf8');
exports.CHROME_LOG_PATH = path.resolve(__dirname, './../chrome.log');
