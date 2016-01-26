#!/usr/bin/env node

'use strict';

let program = require('commander');
const Client = require('./client');
const pkg = require('./package.json');


function Run() {
  program
    .version(pkg.version)
    .usage('[options]')
    .option('--protocol [value]',
      'protocol for the proxy manager, defaults to http',
      /^(http|https)$/i)
    .option('-p, --port <n>',
      'port for the proxy manager',
      parseInt)
    .option('-d, --domain [value]',
      'domain for the proxy manager, defaults to localhost')
    .option('--no-retry',
      'do not retry if the connection fails')
    .parse(process.argv);

  const config = {
    protocol: program.protocol,
    hostname: program.domain,
    port: program.port,
    retry: program.retry
  };

  new Client(config);
}

module.exports.Run = Run;
