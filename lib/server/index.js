'use strict';

const addSockets = require('./io');
const express = require('express');
const EventEmitter = require('events');
const http = require('./http');
const io = require('socket.io');
const logger = require('hermes-logger');
const log = logger.create('server');

class Server extends EventEmitter {
  constructor(config) {
    super();

    this._app = express();
    this._config = config || {};
  }

  startup() {
    this._server = http(this._app, this._config);
    this._io = io(this._server);

    addSockets(this._io, this);

    log.debug(`server listening at localhost:${this._config.port}`);
    this.emit('ready');
  }
}

module.exports = Server;
