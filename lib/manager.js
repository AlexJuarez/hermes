'use strict';

const fork = require('child_process').fork;
const path = require('path');
const ResultStore = require('./store/result');
const EventEmitter = require('events');
const helper = require('./util');

let UID = 0;
function nextID() {
  return UID++;
}

const defaultConfig = {
  maxWorkers: 1
};

class Manager extends EventEmitter {
  constructor(conf) {
    super(conf);
    this.config = helper.defaults(helper.copy(conf), defaultConfig);
    this._workers = [];
    this._jobQueue = [];
    this._results = new ResultStore();
  }

  run(conf, iterations) {
    iterations = iterations || 1;
    conf._id = nextID();

    for (let i = 0; i < iterations; i++) {
      let config = helper.copy(conf);
      config._last = (i === iterations - 1);
      if (this._workers.length >= this.config.maxWorkers) {
        this._jobQueue.push(config);
      } else {
        this._execute(config);
      }
    }

    return this;
  }

  _createWorker(conf) {
    const self = this;
    const worker = fork(path.resolve(__dirname, './worker'));
    const testPath = conf.testPath;
    worker.on('message', (m) => {
      switch (m.action) {
        case 'complete':
          self._results.set(testPath, m.data);

          if (self._jobQueue.length) {
            let conf = self._jobQueue.shift();
            worker.send({config: conf});
          } else {
            worker.kill();
            self._workers.splice(self._workers.indexOf(worker), 1);
          }

          if (conf._last) {
            self.emit('result', self._results.get(testPath));
          }

          if (!self._workers.length) {
            self.emit('complete');
          }
          break;
      }
    });
    return worker;
  }

  _execute(conf) {
    const worker = this._createWorker(conf);
    worker.send({config: conf});
    this._workers.push(worker);
  }

  workerCount() {
    return this._workers.length;
  }
}

module.exports = Manager;
