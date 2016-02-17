'use strict';

const fs = require('fs');
const path = require('path');

const results = fs.readFileSync(path.resolve(__dirname, './results.log'));
const traces = JSON.parse(results)[0].traces;

console.log(traces);
