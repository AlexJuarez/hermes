'use strict';

function config(app) {
  app.locals.DEV = true;

  // development error handler
  // will print stacktrace

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

module.exports = config;
