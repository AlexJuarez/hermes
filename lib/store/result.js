'use strict';

const Store = require('./');

class ResultStore extends Store {
  constructor(opts) {
    super(opts);
    this._cache = Object.create(null);
  }

  keys() {
    return Object.keys(this._cache);
  }

  hasKey(key) {
    return !!this.get(key);
  }

  set(key, result) {
    if (!this.hasKey(key)) {
      this._cache[key] = [];
    }

    this._cache[key].push(result);
  }

  get(key) {
    return this._cache[key];
  }

  dispose(key) {
    delete this._cache[key];
  }
}

module.exports = ResultStore;
