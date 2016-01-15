'use strict';

const Runner = require('./runner');

process.on('message', (m) => {
  const config = m.config;
  const runner = new Runner(config);
  const report = runner.run(config.testPath);
  report.on('cleanup', function() {
    const results = report.getResults();
    process.send({action: 'complete', results: results});
  });
});
