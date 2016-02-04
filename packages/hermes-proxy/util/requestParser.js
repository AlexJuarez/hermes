'use strict';

const _ = require('lodash');
const headerWhiteList = ['host', 'accept', 'connection',
  'content-length', 'cookie'];

function headers(req) {
  return _.cloneDeep(req.headers);
}

function url(req) {
  return req.url;
}

function method(req) {
  return req.method;
}

function makeKey(headers) {
  const output = Object.create(null);
  headerWhiteList.forEach((header) => {
    if (headers[header]) {
      output[header] = headers[header];
    }
  });

  return JSON.stringify(output);
}

module.exports.headers = headers;
module.exports.url = url;
module.exports.method = method;
module.exports.makeKey = makeKey;
