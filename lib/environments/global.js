'use strict';

const helper = require('hermes-util');

module.exports = (global, globals) => {
  global.Buffer = Buffer;
  global.process = Object.assign({}, process);
  global.process.on = process.on.bind(process);
  global.setImmediate = setImmediate;
  global.clearImmediate = clearImmediate;
  return Object.assign(global, helper.copy(globals));
};
