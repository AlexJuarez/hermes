'use strict';

const log = require('./../logger')('proxy-request');
const onFinished = require('on-finished');
const onHeaders = require('on-headers');
const chalk = require('chalk');
const url = require('url');

function getIP(req) {
  return req.ip ||
    req._remoteAddress ||
    (req.connection && req.connection.remoteAddress);
}

function color(status) {
  if (status >= 500) {
    return chalk.red;
  } else if (status >= 400) {
    return chalk.yellow;
  } else if (status >= 300) {
    return chalk.cyan;
  } else if (status >= 200) {
    return chalk.green;
  } else {
    return chalk.underline;
  }
}

function pad(str, width) {
  if (str.length > width) {
    return str.substr(0, width-2) + '..';
  } else {
    for (let i = str.length; i < width; i++) {
      str += ' ';
    }

    return str;
  }
}

function addMiddleware(server) {
  const app = server._app;

  app.use((req, res, next) => {
    // request trackers
    req._startAt = process.hrtime();
    req._startTime = new Date();
    req._remoteAddress = getIP(req);

    function logRequest() {
      if (!res.header) {
        return;
      }

      let diff = (res._startAt[0] - req._startAt[0]) * 1e3 +
        (res._startAt[1] - req._startAt[1]) * 1e-6;

      diff = diff.toFixed(3);


      var pathname = url.parse(req.originalUrl).path;
      let msg = pad(`${req.method} ${pathname}`, 60);

      msg += `${color(res.statusCode)(res.statusCode)} `;
      msg += `${diff} ms - ${res.getHeader('content-length') || 0}`;

      log.debug(msg);
    }

    onHeaders(res, () => {
      res._startAt = process.hrtime();
      res._startTime = new Date();
    });

    onFinished(res, logRequest);

    next();
  });
}

module.exports = addMiddleware;
