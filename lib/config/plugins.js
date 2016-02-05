'use strict';

const log = require('hermes-logger').create('plugin');
const helper = require('hermes-util');

function pluginNotFound(name) {
  return `Cannot find plugin ${name}.
Did you forget to install it?
npm install ${name} --save-dev
`;
}

function resolve(plugins) {
  const modules = [];

  plugins.forEach((plugin) => {
    if (helper.isString(plugin)) {
      requirePlugin(modules, plugin);
    } else if (helper.isObject(plugin)) {
      log.debug(`Loading plugin inline (defining ${Object.keys(plugin).join(', ')})`);
      modules.push(plugin);
    } else {
      log.warn(`Invalid plugin ${plugin}`);
    }
  });

  return modules;
}

function requirePlugin(modules, plugin) {
  const name = normalize(plugin);

  try {
    modules.push(require(name));
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(name) !== -1) {
      log.warn(pluginNotFound(name));
    } else {
      log.warn(`Error when loading ${name}, plugin: ${plugin}`);
    }
  }
}

function normalize(name) {
  name = name.toLowerCase();
  name.replace('hermes-', '');
  return 'hermes-' + name;
}

exports.resolve = resolve;
