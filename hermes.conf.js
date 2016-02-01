// hermes.conf.js
module.exports = function(config) {
  config.set({
    autoWatch: true,
    plugins: ['jasmine'],
    reporters: ['progress'],
    files: [
      'lib/**/*.test.js'
    ],
    exclude: [
    ],
    /*proxy: {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost',
      start: true
    },*/
    colors: true,
    port: 9887,
    iterations: 1,
    logLevel: config.LOG_DEBUG,
    browsers: []
  });
};
