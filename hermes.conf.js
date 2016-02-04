// hermes.conf.js
module.exports = function(config) {
  config.set({
    autoWatch: false,
    plugins: ['jasmine', 'chrome'],
    reporters: ['progress'],
    files: [
      'tests/**/*.spec.js'
    ],
    exclude: [
    ],
    proxy: {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost',
      start: true
    },
    colors: true,
    port: 9887,
    iterations: 2,
    logLevel: config.LOG_DEBUG
  });
};
