'use strict';

const Store = require('hermes-store');
const helper = require('hermes-util');
const _ = helper._;
const mm = require('minimatch');

class FileStore extends Store {
  constructor(opts) {
    super(opts);
    this._cache = Object.create(null);
  }

  keys() {
    return Object.keys(this._cache);
  }

  hasKey(pattern) {
    return helper.isDefined(this._cache[pattern]);
  }

  set(pattern, files) {
    this._cache[pattern] = new Set(files);
  }

  get(pattern) {
    return this._cache[pattern];
  }

  dispose(pattern) {
    delete this._cache[pattern];
  }

  exists(path) {
    const self = this;

    const patterns = this.keys().filter((pattern) => {
      return mm(path, pattern);
    });

    return !!_.find(patterns, (pattern) => {
      return self.findFile(path, pattern);
    });
  }

  findPattern(path) {
    const patterns = this.keys().filter((pattern) => {
      return mm(path, pattern);
    });

    if (patterns.length) {
      return patterns[0];
    }
  }

  addFile(file) {
    const pattern = this.findPattern(file.path);

    this.get(pattern).add(file);
  }

  removeFile(file) {
    const self = this;

    this.keys()
      .filter((pattern) => {
        return mm(file.path, pattern);
      })
      .forEach((pattern) => {
        self.get(pattern).delete(file);
      });
  }

  findFile(path, pattern) {
    if (!path) return;

    if (!pattern) {
      pattern = this.findPattern(path);
    }

    if (!pattern || !this.hasKey(pattern)) return;

    return _.find(Array.from(this.get(pattern)), (file) => {
      return file.originalPath === path;
    });
  }

  files() {
    const self = this;
    const output = this.keys().map((pattern) => {
      let entries = [];
      self.get(pattern).forEach((file) => {
        entries.push(file);
      });

      return entries;
    });

    return helper.uniq(helper.flatten(output), 'path');
  }
}

module.exports = FileStore;
