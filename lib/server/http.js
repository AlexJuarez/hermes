'use strict';

const http = require('http');

function createServer(app, config) {
  const port = config.port;
  return http.createServer(app).listen(port);
}

module.exports = createServer;
