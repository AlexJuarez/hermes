#!/usr/bin/env bash
'use strict';

const Manager = require('./manager');
const Proxy = require('./proxy');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const parseConfig = require('./config/parse');
const glob = require('glob');
const ProgressReporter = require('./reporter/progress');

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

function Run() {
  const conf = parseConfig(findConfig());

  const iterations = 2;

  const proxy = new Proxy(conf.proxy);
  const manager = new Manager(conf);
  const reporter = new ProgressReporter(conf);

  proxy.on('ready', () => {
    glob(conf.files.join(''), (err, files) => {
      files.forEach((testPath) => {
        let config = _.defaults({testPath: testPath}, conf.proxy);
        manager.run(config).once('result', (results) => {
          manager.run(config, iterations).on('result', (results) => {
            reporter.writeReport(results);
            fs.writeFileSync(path.resolve(__dirname, './../results.log'),
              JSON.stringify(results, null, ' '));
          });
          manager.on('complete', () => {
            proxy.close();
          });
        });
      });
    });
  });

  proxy.startup();
}

module.exports.Run = Run;
