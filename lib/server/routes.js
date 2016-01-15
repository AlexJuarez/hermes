'use strict';

const url = require('url');
const zlib = require('zlib');

let request = require('request');
request = request.defaults({
  encoding: null
});

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
      var r = request[method](u,
        (err, resp, buffer) => {
          if (method === 'post') {
            console.log(resp);
          }
          store.set(req, buffer, resp);
          var encoding = resp.headers['content-encoding'];

          if (!err && resp.statusCode === 200) {
            if (encoding && encoding.indexOf('gzip') > -1) {
              zlib.gunzip(buffer, function(err, body) {
                if (!err) {
                  // todo parse this body
                  // console.log(body.toString('utf8').substr(0, 50));
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
    }
  });
}

module.exports = addRoutes;
