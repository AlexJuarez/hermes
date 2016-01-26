'use strict';

const logger = require('hermes-logger');
const log = logger.create('resolver');

function resolve(plugin) {
  let name = plugin.toLowerCase();

  name.replace('hermes-', '');

  name = 'hermes-' + name;

  try {
    return require(name);
  } catch (e) {
    log.error(`could not locate plugin: ${name}, check the config or npm install`);
    process.exit(1);
  }
}

exports.resolve = resolve;
