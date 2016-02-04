'use strict';

const express = require('express');
const EventEmitter = require('events');
const RequestStore = require('./../store/request');
const https = require('./https');
const http = require('./http');
const addRoutes = require('./routes');
const addMiddleware = require('./middleware');
const logger = require('hermes-logger');
const log = logger.create('proxy');

class Proxy extends EventEmitter {
  constructor(config) {
    super();

    this._app = express();
    this._config = config || {};
    this._store = new RequestStore();
    this._enabled = true;

    this.on('error', (err) => {
      log.error(`${err.message} - ${err.url}`);
    });

    addMiddleware(this);
    addRoutes(this);
  }

  startup() {
    this._server = http(this._app, this._config);
    this._https_server = https(this._app, this._config);
    log.debug(`proxy server ready at ` +
      `localhost:${this._config.httpPort}.`);

    this.emit('ready');
  }

  flush() {
    this._store = new RequestStore();
  }

  enable() {
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
  }

  close() {
    if (this._https_server && this._server) {
      this._https_server.close();
      this._server.close();
    }
    log.debug(`closing proxy server.`);
    this.emit('exit');
  }
}

module.exports = Proxy;
