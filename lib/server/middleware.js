'use strict';

const logger = require('morgan');

function addMiddleware(server) {
  const app = server._app;

  //app.use(logger('dev'));
}

module.exports = addMiddleware;
