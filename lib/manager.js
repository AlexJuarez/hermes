'use strict';

const fork = require('child_process').fork;
const path = require('path');
const ResultStore = require('./store/result');
const EventEmitter = require('events');
const helper = require('hermes-util');
const logger = require('hermes-logger');
const log = logger.create('manager');

let UID = 0;
function nextID() {
  return UID++;
}

class Manager extends EventEmitter {
  constructor(conf) {
    super(conf);
    this.config = helper.copy(conf);
    this._workers = [];
    this._jobQueue = [];
    this._jobTracker = {};
    this._results = new ResultStore();
  }

  resetResults(path) {
    this._results.reset(path);
  }

  run(conf) {
    const id = nextID();
    const iterations = conf.iterations || 1;

    conf._id = id;
    conf._retry = 0;

    this._createJob(conf);

    this._jobTracker[id] = {
      completed: 0,
      iterations: iterations
    };

    return this;
  }

  _createJob(conf) {
    let config = helper.copy(conf);
    if (this._workers.length >= this.config.maxWorkers) {
      this._jobQueue.push(config);
    } else {
      this._execute(config);
    }
  }

  _removeWorker(worker) {
    worker.send({action: 'exit'});
    this._workers.splice(this._workers.indexOf(worker), 1);
  }

  _nextJob(worker) {
    if (this._jobQueue.length) {
      let conf = this._jobQueue.shift();
      worker.send({action: 'task', config: conf});
    } else {
      this._removeWorker(worker);
    }
  }

  _jobComplete(id) {
    const jobStats = this._jobTracker[id];
    return jobStats.completed > jobStats.iterations;
  }

  _createWorker(conf) {
    const self = this;
    const worker = fork(path.resolve(__dirname, './worker'));
    const testPath = conf.testPath;
    worker.on('message', (m) => {
      switch (m.action) {
        case 'complete':
          const stats = self._jobTracker[conf._id];

          if (conf._retry) {
            log.info(`Retried ${conf.testPath} success, continuing.`);
          }

          if (!stats.completed && stats.iterations > 1) {
            for (let i = 0; i < stats.iterations; i++) {
              self._createJob(conf);
            }
          } else {
            self._results.set(testPath, m.data);
          }

          stats.completed++;
          self._nextJob(worker);

          if (self._jobComplete(conf._id)) {
            self.emit('result', self._results.get(testPath));
          }
          // If no more workers we are done
          if (!self._workers.length) {
            self.emit('complete');
          }
          break;
        case 'error':
          // If an error occurs retry
          self._removeWorker(worker);
          conf._retry++;
          if (conf._retry < this.config.maxRetries) {
            log.info(`Retrying ${conf.testPath}: Attempt ${conf._retry}.`);
            self._execute(conf);
          } else {
            self._jobTracker[conf._id].completed++;
            if (self._jobComplete(conf._id)) {
              self.emit('result', self._results.get(testPath));
            }

            if (this._jobQueue.length) {
              let conf = this._jobQueue.shift();
              self._execute(conf);
            }

            if (!self._workers.length) {
              self.emit('complete');
            }
          }
          break;
      }
    });
    return worker;
  }

  _execute(conf) {
    const worker = this._createWorker(conf);
    worker.send({action: 'task', config: conf});
    this._workers.push(worker);
  }

  workerCount() {
    return this._workers.length;
  }
}

module.exports = Manager;
