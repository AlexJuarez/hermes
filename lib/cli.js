#!/usr/bin/env bash
'use strict';

const Manager = require('./manager');
const ProxyClient = require('hermes-proxy');
const Server = require('./server');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const parseConfig = require('./config/parse');
const glob = require('glob');
const ProgressReporter = require('./reporter/progress');
const chalk = require('chalk');
const logger = require('hermes-logger');
const log = logger.create();
const Watcher = require('./watcher');
const FileList = require('./file-list');

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

  const iterations = 1;

  const server = new Server(conf);
  const manager = new Manager(conf);
  conf.adapter = (msg) => {
    log.info(msg);
  };
  const reporter = new ProgressReporter(conf);
  const fileList = new FileList(conf);
  const watcher = new Watcher(conf, fileList);
  fileList.refresh();

  server.on('ready', () => {
    log.info('server ready');
    const client = new ProxyClient(conf);
  });

  server.on('proxy_ready', (proxy) => {
    fileList.files().forEach((file) => {
      const testPath = file.path;
      let config = _.defaults({testPath: testPath}, conf);
      manager.run(config).once('result', (results) => {
        proxy.emit('disable');
        manager.resetResults();
        manager.run(config, iterations).on('result', (results) => {
          reporter.writeReport(results);
          fs.writeFileSync(path.resolve(__dirname, './../results.log'),
            JSON.stringify(results, null, ' '));
        });
        manager.on('complete', () => {
          proxy.emit('exit');
          watcher.emit('exit');
          process.exit(0);
        });
      });
    });
  });

  server.startup();
}

module.exports.Run = Run;
