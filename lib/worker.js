'use strict';

const Runner = require('./runner');

process.on('message', (m) => {
  const config = m.config;
  const runner = new Runner(config);
  runner.run(config.testPath).then((results) => {
    process.send({action: 'complete', results: results});
  });
});
