'use strict';

const express = require('express');
const EventEmitter = require('events');
const RequestStore = require('./../store/request');
const https = require('./https');
const http = require('./http');
const addRoutes = require('./routes');
const addMiddleware = require('./middleware');

class Server extends EventEmitter {
  constructor(config) {
    super();

    this._app = express();
    this._config = config || {};
    this._store = new RequestStore();

    addMiddleware(this);
    addRoutes(this);
  }

  startup() {
    this._server = http(this._app, this._config.httpPort);
    this._https_server = https(this._app, this._config.httpsPort);
    this.emit('ready');
  }

  close() {
    this._https_server.close();
    this._server.close();
    this.emit('exit');
  }
}

module.exports = Server;
