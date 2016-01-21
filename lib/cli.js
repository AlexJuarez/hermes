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
const chalk = require('chalk');
const logger = require('./logger');
const log = logger.create();

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

function applyConfig(config) {
  chalk.enabled = config.colors;
}

function Run() {
  const conf = parseConfig(findConfig());
  applyConfig(conf);

  const iterations = 15;

  const proxy = new Proxy(conf.proxy);
  const manager = new Manager(conf);
  conf.adapter = (msg) => {
    log.info(msg);
  };
  const reporter = new ProgressReporter(conf);

  proxy.on('ready', () => {
    glob(conf.files.join(''), (err, files) => {
      files.forEach((testPath) => {
        let config = _.defaults({testPath: testPath}, conf.proxy);
        manager.run(config).once('result', (results) => {
          proxy._enabled = false;
          manager.run(config, iterations).on('result', (results) => {
            reporter.writeReport(results);
            fs.writeFileSync(path.resolve(__dirname, './../results.log'),
              JSON.stringify(results, null, ' '));
          });
          manager.on('complete', () => {
            proxy.close();
            process.exit(0);
          });
        });
      });
    });
  });

  proxy.startup();
}

module.exports.Run = Run;
