'use strict';

const Store = require('hermes-store');

class SimpleStore extends Store {
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
    this._cache[key] = result;
  }

  get(key) {
    return this._cache[key];
  }

  dispose(key) {
    delete this._cache[key];
  }
}

module.exports = SimpleStore;
