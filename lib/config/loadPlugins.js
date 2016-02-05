'use strict';

const plugin = require('./plugins');

function loadPlugins(conf) {
  if (!conf._plugins) {
    conf._plugins = {
      browsers: [],
      adapters: []
    };
  }

  plugin.resolve(conf.plugins.concat(conf.browsers)).forEach((module) => {
    Object.keys(module).forEach((key) => {
      if (!conf._plugins[key]) {
        conf._plugins[key] = [];
      }

      [].push.apply(conf._plugins[key], module[key]);
    });
  });
}

module.exports = loadPlugins;
