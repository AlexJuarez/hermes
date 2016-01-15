'use strict';

const url = require('url');
const zlib = require('zlib');
const deepCopy = require('./../util/deepCopy');

let request = require('request');
request = request.defaults({
  encoding: null
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function addRoutes(server) {
  const app = server._app;
  const store = server._store;

  app.all('*', function(req, res) {
    if (store.hasKey(req)) {
      const resp = store.get(req);
      Object.keys(resp.resp.headers).forEach((header) => {
        res.setHeader(header, resp.resp.headers[header]);
      });

      res.end(resp.resp.body);
    } else {
      var method = req.method.toLowerCase();
      var u = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
      });

      var r = request[method](decodeURIComponent(u),
        (err, resp, buffer) => {
          if (!err) {
            store.set(req, buffer, resp);
          }
        })
        .on('error', function(err) {
          console.log(err);
        });

      req
        .pipe(r)
        .pipe(res);
    }
  });
}

module.exports = addRoutes;
