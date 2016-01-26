const fs = require('fs');
const path = require('path');

const JASMINE_PATH = path.resolve(__dirname,
  './../vendor/jasmine-core/jasmine-2.4.1.js');

exports.JASMINE_PATH = JASMINE_PATH;
exports.JASMINE_2 = fs.readFileSync(JASMINE_PATH, 'utf8');
