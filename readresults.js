'use strict';

const fs = require('fs');
const path = require('path');

const results = require('./results.json');
const traces = results[0].traces[0];

let names = {};
let v8traces = [];

traces.forEach((trace) => {
  if (trace.message.params.cat) {
    names[trace.message.params.cat] = true;

    if (trace.message.params.cat.indexOf('v8') > -1) {
      v8traces.push(trace);
    }
  }
});

let fns = [];

v8traces.forEach((trace) => {
  if (trace.message.params.name.indexOf('run') > -1) {
    fns.push(trace);
  }
});

console.log(JSON.stringify(fns, null, ' '));
