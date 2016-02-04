'use strict';

const io = require('socket.io-client');
const url = require('url');
const Proxy = require('./server');
const log = require('./logger')('proxy-client');

class ProxyClient {
  constructor(config) {
    this._config = config || {};
    const u = url.format({
      protocol: this._config.protocol || 'http',
      hostname: this._config.domain || 'localhost',
      port: this._config.port
    });
    const self = this;

    log.debug(`attempting to connect to ${u}`);
    this._socket = io.connect(decodeURIComponent(u),
      {
        reconnection: config.retry
      });
    const socket = this._socket;

    socket.on('connect', () => {
      socket.emit('proxy', {action: 'getConfig'});
    });

    socket.on('startup', (config) => {
      self._proxy = new Proxy(config);
      self._proxy.on('ready', () => {
        socket.emit('proxy', {action: 'ready'});
      });
      self._proxy.startup();
    });

    socket.on('enable', () => {
      self._proxy.enable();
    });

    socket.on('disable', () => {
      self._proxy.disable();
    });

    socket.on('flush', () => {
      self._proxy.flush();
    });

    socket.on('exit', () => {
      self._proxy.close();
      socket.disconnect();
    });

    socket.on('connect_error', (err) => {
      log.error(`connection attempt failed: ${err.message}`);
    });

    socket.on('reconnect_error', (err) => {
      log.error(`reconnection attempt failed: ${err.message}`);
    })
  }

  emit() {
    this._socket.emit.apply(this._socket, [].slice.call(arguments));
  }
}

module.exports = ProxyClient;
