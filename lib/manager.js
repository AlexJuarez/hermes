'use strict';

const fork = require('child_process').fork;
const path = require('path');
const workers = [];
const jobQueue = [];
const results = [];

let config = {maxWorkers: 1};
let emitter;

function createWorker() {
  const worker = fork(path.resolve(__dirname, './worker'));
  worker.on('message', (m) => {
    if (m.action === 'complete') {
      results.push(m.results);

      if (jobQueue.length) {
        var conf = jobQueue.pop();
        worker.send({config: conf});
      } else {
        worker.kill();
        workers.splice(workers.indexOf(worker), 1);
      }

      if (!workers.length) {
        emitter.emit('done');
      }
    }
  });
  return worker;
}

function execute(conf) {
  const worker = createWorker();
  worker.send({config: conf});
  workers.push(worker);
}

function run(conf) {
  if (workers.length >= config.maxWorkers) {
    jobQueue.push(conf);
  } else {
    execute(conf);
  }
}

function Manager(_emitter, conf) {
  config = conf;
  emitter = _emitter;
}

Manager.prototype.run = run;
Manager.prototype.workerCount = () => workers.length;
Manager.prototype.getResults = () => results;

module.exports = Manager;
