'use strict';

const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const path = require('path');
const request = require('request');
const EventEmitter = require('events');
const net = require('net');
const url = require('url');

options.agent = new https.Agent(options);

class Server extends EventEmitter {
  constructor() {
    super();
    var app = this.app = express();

    app.use(logger('dev'));
  }

  startup() {
    var self = this;

    this.app.all('*', function(req, res) {
      var method = req.method.toLowerCase();
      var r = request[method](req.url)
        .on('error', function(err) {
          console.log(err);
        });

      req
        .pipe(r)
        .pipe(res);
    });

    this._server = this.app.listen(3000, () => {
      console.log('sever started at localhost:3000');
      self.emit('ready');
    });

    this._server.on('connect', (req, cltSocket, head) => {
      console.log(req.method, req.url);
      var srvUrl = url.parse(`http://${req.url}`);
      var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
          'Proxy-agent: Node.js-Proxy\r\n' +
          '\r\n');
        srvSocket.write(head);
        srvSocket.pipe(cltSocket);
        cltSocket.pipe(srvSocket);
      });
    });
  }

  close() {
    this._server.close();
  }
}

module.exports = Server;
