'use strict';

const fork = require('child_process').fork;
const path = require('path');
const _ = require('lodash');

const defaultConfig = {
  maxWorkers: 1
};

class Manager {
  constructor(conf) {
    this.config = _.defaults(_.cloneDeep(conf), defaultConfig);
    this._workers = [];
    this._jobQueue = [];
    this._results = [];
  }

  run(conf, iterations) {
    const self = this;
    iterations = iterations || 1;

    for (let i = 0; i < iterations; i++) {
      if (this._workers.length >= this.config.maxWorkers) {
        this._jobQueue.push(conf);
      } else {
        this._execute(conf);
      }
    }

    return new Promise((resolve) => {
      self._resolve = resolve;
    });
  }

  _createWorker() {
    const self = this;
    const worker = fork(path.resolve(__dirname, './worker'));
    worker.on('message', (m) => {
      if (m.action === 'complete') {
        self._results.push(m.results);

        if (self._jobQueue.length) {
          var conf = self._jobQueue.pop();
          worker.send({config: conf});
        } else {
          worker.kill();
          self._workers.splice(self._workers.indexOf(worker), 1);
        }

        if (!self._workers.length) {
          self._resolve(self._results);
        }
      }
    });
    return worker;
  }

  _execute(conf) {
    const worker = this._createWorker();
    worker.send({config: conf});
    this._workers.push(worker);
  }

  workerCount() {
    return this._workers.length;
  }
}

module.exports = Manager;
