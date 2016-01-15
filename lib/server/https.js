'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

const sslkey = fs.readFileSync(path.resolve(__dirname, './../../key.pem'),
  'utf8');
const sslcert = fs.readFileSync(path.resolve(__dirname, './../../cert.pem'),
  'utf8');

function createServer(app, port) {
  return https.createServer({
    key: sslkey,
    cert: sslcert
  }, app).listen(port);
}

module.exports = createServer;
