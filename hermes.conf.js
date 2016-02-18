// hermes.conf.js
'use strict';

const path = require('path');
const fs = require('graceful-fs');

module.exports = function(config) {
  config.set({
    autoWatch: false,
    plugins: ['jasmine'],
    reporters: [
      'progress',
      (results) => {
        const p = path.resolve(__dirname, './results.json');
        fs.writeFileSync(p,
          JSON.stringify(results, null, ' '));
      }
    ],
    files: [
      'tests/e2e/**/*.spec.js'
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
    iterations: 1,
    browsers: ['chrome'],
    logLevel: config.LOG_DEBUG
  });
};
