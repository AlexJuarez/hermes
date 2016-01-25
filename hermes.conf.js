// hermes.conf.js
module.exports = function(config) {
  config.set({
    autoWatch: false,
    frameworks: ['jasmine'],
    files: [
      'tests/**/*.spec.js'
    ],
    exclude: [
    ],
    proxy: {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost'
    },
    colors: true,
    port: 9887,
    logLevel: config.LOG_DEBUG,
    browsers: ['Chrome']
  });
};
