// hermes.conf.js
module.exports = function(config) {
  config.set({
    autoWatch: true,
    adapters: ['jasmine'],
    reporters: ['progress'],
    files: [
      'tests/**/*.spec.js'
    ],
    exclude: [
      'tests/e2e/**/*.spec.js'
    ],
    proxy: {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost',
      start: true
    },
    colors: true,
    port: 9887,
    iterations: 1,
    logLevel: config.LOG_DEBUG,
    browsers: []
  });
};
