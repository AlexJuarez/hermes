#!/usr/bin/env node

'use strict';

let program = require('commander');
const Client = require('./client');
const pkg = require('./package.json');
const Proxy = require('./server');
const log4js = require('log4js');

const loglevels = ['OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'];

function Run() {
  program
    .version(pkg.version);

  program
    .command('start')
    .option('-p, --http-port <n>',
      'http port for the proxy',
      parseInt)
    .option('-s, --https-port <n>',
      'https port for the proxy',
      parseInt)
    .option('--log-level <level>',
      `change the current log level - ${loglevels.join(', ')}`,
      /^(OFF|ERROR|WARN|INFO|DEBUG)$/i,
      'DEBUG')
    .action((options) => {
      const config = {
        httpPort: options.httpPort,
        httpsPort: options.httpsPort
      };

      log4js.setGlobalLogLevel(options.logLevel);

      const proxy = new Proxy(config);
      proxy.startup();
    });

  program
    .command('managed')
    .description('runs a proxy client with a managing server')
    .option('-P, --protocol <value>',
      'protocol for the proxy manager, defaults to http',
      /^(http|https)$/i)
    .option('-p, --port <n>',
      'port for the proxy manager',
      parseInt)
    .option('-d, --domain <value>',
      'domain for the proxy manager, defaults to localhost')
    .option('--no-retry',
      'do not retry if the connection fails')
    .option('--log-level <level>',
      `change the current log level - ${loglevels.join(', ')}`,
      /^(OFF|ERROR|WARN|INFO|DEBUG)$/i,
      'DEBUG')
    .action((options) => {
      const config = {
        port: options.port,
        protocol: options.protocol,
        domain: options.domain,
        retry: options.retry
      };

      log4js.setGlobalLogLevel(options.logLevel);

      new Client(config);
    });

  program
    .parse(process.argv);

}

module.exports.Run = Run;
