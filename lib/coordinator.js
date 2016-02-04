'use strict';

const EventEmitter = require('events');
const Server = require('./server');
const Manager = require('./manager');
const Reporter = require('./reporter');
const Tracker = require('./tracker');
const ProxyClient = require('hermes-proxy');
const Promise = require('bluebird');
const logger = require('hermes-logger');
const log = logger.create();
const _ = require('hermes-util')._;

class Coordinator extends EventEmitter {
  constructor(config) {
    super();

    const conf = this._config = config || {};
    const self = this;
    this._ready = [];
    this._exit = [];
    let resolve;
    this._isReady = new Promise((r) => {
      resolve = r;
    });

    conf.adapter = (msg) => {
      log.info(msg);
    };

    this._server = this._prepare(Server, conf);
    this._manager = new Manager(conf);
    this._reporter = new Reporter(conf);
    this._tracker = new Tracker(conf);
    this._exit.push(this._tracker);

    // Once all of the core components are loaded
    // do any post core setup
    Promise.all(this._ready).then(() => {
      if (conf.proxy && conf.proxy.start) {
        this._exit.push(new ProxyClient(conf));
        self._server.once('proxy_ready', () => {
          self.emit('ready');
          resolve();
        });
      } else {
        self.emit('ready');
        resolve();
      }
    });

    this._tracker.on('changed', (files) => {
      self._isReady.then(() => {
        files.forEach((file) => {
          self._runTest(file.path, conf);
        });
      });
    });

    this._manager.on('result', (results) => {
      self._reporter.write(results);
    });

    this._manager.on('complete', () => {
      self._cleanup();
    });

    this._server.startup();
    this._tracker.refresh();
  }

  _cleanup() {
    if (!this._config.autoWatch) {
      this._exit.forEach((emitter) => {
        emitter.emit('exit');
      });
      process.exit(0);
    }
  }

  _runTest(testPath, conf) {
    let config = _.defaults({testPath: testPath}, conf);

    this._manager.run(config);
  }

  _prepare(Class, conf, opts) {
    let resolve;
    let p = new Promise((r) => {
      resolve = r;
    });
    this._ready.push(p);
    const out = new Class(conf, opts);
    this._exit.push(out);
    out.once('ready', () => {
      resolve();
    });
    return out;
  }
}

module.exports = Coordinator;
