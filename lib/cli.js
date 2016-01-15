#!/usr/bin/env bash
'use strict';

const glob = require('glob');
const Manager = require('./manager');
const Server = require('./server');
const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');

function Run() {
  const config = {
    domain: 'localhost',
    httpPort: process.env.HTTP_PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 3001,
    tests: './tests/**/*.spec.js',
    maxWorkers: 5,
    iterations: 20
  };

  const server = new Server(config);
  const emitter = new EventEmitter();
  const manager = new Manager(emitter, config);

  server.on('ready', () => {
    console.log('server ready');
    glob(config.tests, (err, files) => {
      files.forEach((testPath) => {
        manager.run({
          domain: config.domain,
          httpPort: config.httpPort,
          httpsPort: config.httpsPort,
          testPath: testPath});
        emitter.once('done', () => {
          for (let i = 0; i < config.iterations; i++) {
            manager.run({
              domain: config.domain,
              httpPort: config.httpPort,
              httpsPort: config.httpsPort,
              testPath: testPath
            });
          }

          emitter.once('done', () => {
            fs.writeFileSync(path.resolve(__dirname, './../results.json'),
              JSON.stringify(manager.getResults(), null, ' '));
          });
        });
      });
    });
  });

  server.startup();
}

module.exports.Run = Run;
