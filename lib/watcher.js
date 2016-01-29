'use strict';

const chokidar = require('chokidar');
const EventEmitter = require('events');
const logger = require('hermes-logger');
const log = logger.create('watcher');
const mm = require('minimatch');
const expandBraces = require('expand-braces');

class Watcher extends EventEmitter {
  constructor(config, fileList) {
    super();
    this._config = config || {};
    const patterns = config.files;
    const excludes = config.exclude;
    const usePolling = config.usePolling;

    function bind(fn) {
      return (path) => {
        return fn.call(fileList, path);
      }
    }

    this._watcher = this.create(patterns, excludes, usePolling);
    this._watcher.on('add', bind(fileList.addFile))
    .on('change', bind(fileList.changeFile))
    .on('unlink', bind(fileList.removeFile))
    .on('error', (err) => log.error(err.message));

    this.on('exit', () => {
      this._watcher.close();
    });

    this.watchPatterns(patterns);
  }

  createIgnore(patterns, excludes) {
    return (path, stat) => {
      if (!stat || stat.isDirectory()) {
        return false;
      }

      if (!patterns.some((pattern) => mm(path, pattern, {dot: true}))){
        return true;
      }

      return excludes.some((pattern) => mm(path, pattern, {dot: true}));
    }
  }

  create(patterns, excludes, usePolling) {
    const options = {
      usePolling: usePolling,
      ignorePermissionErrors: true,
      ignoreInitial: true,
      ignored: this.createIgnore(patterns, excludes)
    };

    return new chokidar.FSWatcher(options);
  }

  watchPatterns(patterns) {
    const self = this;
    patterns = expandBraces(patterns);

    patterns.forEach((path) => {
      self._watcher.add(path);
      log.debug(`Watching ${path}`);
    });
  }
}

module.exports = Watcher;
