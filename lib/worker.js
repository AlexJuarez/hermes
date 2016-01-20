'use strict';

const Runner = require('./runner');

process.on('message', (m) => {
  const config = m.config;
  const runner = new Runner(config);

  runner.run(config.testPath);
  runner.on('result', (result) => {
    process.send({action: 'result', data: result});
  });
  runner.on('complete', (results) => {
    process.send({action: 'complete', data: results});
  });
});
