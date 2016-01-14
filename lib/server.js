'use strict';

const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const path = require('path');
let request = require('request');
const EventEmitter = require('events');
const net = require('net');
const url = require('url');
const https = require('https');
const zlib = require('zlib');

const sslkey = fs.readFileSync(path.resolve(__dirname, './../key.pem'),
  'utf8');
const sslcert = fs.readFileSync(path.resolve(__dirname, './../cert.pem'),
  'utf8');

request = request.defaults({
  encoding: null
});

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
      var u = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
      });
      var r = request[method](u,
        (err, resp, buffer) => {
          var encoding = resp.headers['content-encoding'];

          if (!err && resp.statusCode === 200) {
            if (encoding && encoding.indexOf('gzip') > -1) {
              zlib.gunzip(buffer, function(err, body) {
                if (!err) {
                  //todo parse this body
                  //console.log(body.toString('utf8').substr(0, 50));
                }
              });
            }
          }
        })
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

    this._https_server = https.createServer({
      key: sslkey,
      cert: sslcert
    }, this.app).listen(3001);

    this._server.on('connect', (req, cltSocket, head) => {
      var srvSocket = net.connect(3001, 'localhost', () => {
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
    this._https_server.close();
    this._server.close();
  }
}

module.exports = Server;
