#!/usr/bin/env bash
'use strict';

const glob = require('glob');
const Manager = require('./manager');
const Server = require('./server');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

function Run() {
  const config = {
    domain: 'localhost',
    httpPort: process.env.HTTP_PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 3001,
    tests: './tests/**/*.spec.js',
    maxWorkers: 5
  };

  const runConfig = {
    domain: config.domain,
    httpPort: config.httpPort,
    httpsPort: config.httpsPort
  };

  const iterations = 0;

  const server = new Server(config);
  const manager = new Manager(config);

  server.on('ready', () => {
    console.log('server ready');
    glob(config.tests, (err, files) => {
      files.forEach((testPath) => {
        let config = _.defaults({testPath: testPath}, runConfig);
        manager.run(config).then(() => {
          manager.run(config, iterations).then((results) => {
            fs.writeFileSync(path.resolve(__dirname, './../results.log'),
              JSON.stringify(results, null, ' '));
            server.close();
          });
        });
      });
    });
  });

  server.startup();
}

module.exports.Run = Run;
