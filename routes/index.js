'use strict';
var express = require('express');
var request = require('request');
var url = require('url');
var zlib = require('zlib');

var j = request.jar();
request = request.defaults({
  jar: j,
  encoding: null
});

/* GET home page. */
function routes(app) {
  app.all('*', function(req, res) {
    var method = req.method.toLowerCase();
    var root = 'https://www.facebook.com';

    var r = request[method](
      url.resolve(root, req.url),
      function(err, response, buffer) {
        var encoding = response.headers['content-encoding'];

        if (!err && response.statusCode === 200) {
          if (encoding && encoding.indexOf('gzip') > -1) {
            zlib.gunzip(buffer, function(err, body) {
              if (!err) {
                console.log(body.toString('utf8'));
              }
            });
          }
        }
      })
      .on('response', function(response) {
        delete response.headers['content-security-policy'];
      })
      .on('error', function(err) {
        console.log(err);
      });
    req.pipe(r);
    r.pipe(res);
  });
}

module.exports = routes;
