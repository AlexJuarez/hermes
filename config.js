'use strict';

var path = require('path');
var env = process.env.NODE_ENV || 'dev';

var configs = {
  dev: require(path.join(__dirname, 'env/dev')),
  prod: require(path.join(__dirname, 'env/prod'))
};

function buildConfig(env) {
  return configs[env] || configs.dev;
}

function base(app) {
  app.locals.ENV = env;
  buildConfig(env)(app);
}

module.exports = base;
