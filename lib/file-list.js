'use strict';

const _ = require('lodash');
const mm = require('minimatch');
const Promise = require('bluebird');

class List {
  constructor(patterns, excludes, emitter, preprocess, batchInterval) {
    this._patterns = patterns;
    this._excludes = excludes;
    this._emitter = emitter;
    this._preprocess = Promise.promisify(preprocess);
    this._batchInterval = batchInterval;

    this.buckets = new Map();

    this._refreshing = Promise.resolve();

    const self = this;

    function emit() {
      self._emitter.emit('file_list_modified', self.files);
    }

    const throttleEmit = _.throttle(emit, self._batchInterval, {leading: false});
    self._emitModified = (immediate) => immediate ? emit() : throttleEmit();
  }

  _isExcluded(path) {
    return this._excludes.some((pattern) => {
      return mm(path, pattern);
    });
  }

  _isIncluded(path) {
    return this._patterns.some((pattern) => {
      return mm(path, pattern.pattern);
    });
  }

  _findFile(path, pattern) {
    if (!path || !pattern) return;
    if (!this.buckets.has(pattern.pattern)) return;

    return this.buckets.get(pattern.pattern).filter((file) => {
      return file.originalPath === path;
    });
  }
}
