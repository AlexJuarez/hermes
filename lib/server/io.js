'use strict';
const logger = require('hermes-logger');
const log = logger.create('server');

function addSockets(io, server) {
  io.on('connection', (socket) => {
    socket.on('proxy', (m) => {
      switch (m.action) {
        case 'getConfig':
          socket.emit('startup', server._config.proxy);
          break;
        case 'ready':
          server.emit('proxy_ready', socket);
          break;
      }
    });
  });
}

module.exports = addSockets;
