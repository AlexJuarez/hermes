'use strict';

const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const path = require('path');
const request = require('request');
const EventEmitter = require('events');

const http = require('http');
const https = require('https');

const sslkey = fs.readFileSync(path.resolve(__dirname, './../test-key.pem'));
const sslcert = fs.readFileSync(path.resolve(__dirname, './../test-cert.pem'));

const options = {
  key: sslkey,
  cert: sslcert
};

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

    this._server = http.createServer(this.app).listen(3000);
    this._https_server = https.createServer(options, this.app).listen(3001);
    console.log('sever started at :3000 && :3001');
    this.emit('ready');
  }

  close() {
    this._server.close();
    this._https_server.close();
  }
}

module.exports = Server;
