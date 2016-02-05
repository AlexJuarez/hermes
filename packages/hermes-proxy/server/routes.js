'use strict';

const url = require('url');
const zlib = require('zlib');
const log = require('./../logger')('proxy');

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
      if (!server._enabled) {
        log.debug(`${req.url} not found in cache`);
        res.status(404);
        res.end('page not found in cache');
      } else {
        var method = req.method.toLowerCase();

        const urlBuilder = url.parse(req.originalUrl);
        urlBuilder.host = req.get('host');
        urlBuilder.protocol = req.protocol;

        var u = decodeURIComponent(url.format(urlBuilder));

        var r = request[method](u,
          (err, resp, buffer) => {
            if (!err) {
              store.set(req, buffer, resp);
            }
          })
          .on('error', function(err) {
            server.emit('error', {url: req.url, message: err.message});
          });

        req
          .pipe(r)
          .pipe(res);
      }
    }
  });
}

module.exports = addRoutes;
