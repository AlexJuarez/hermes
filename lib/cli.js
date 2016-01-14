#!/usr/bin/env bash
'use strict';

const path = require('path');
const Server = require('./server');
const fs = require('fs');
const runner = require('./runner');

function Run() {

  const server = new Server();

  server.on('ready', () => {
    let testPath = path.resolve(__dirname, './../tests/demo.spec.js');
    runner(testPath).then((results) => {
      console.log(results.testResults);
    });
  });

  server.startup();
}

module.exports.Run = Run;
