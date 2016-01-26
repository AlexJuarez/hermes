'use strict';

class Store {
  set() {
    throw new Error('set: must be implemented');
  }

  get() {
    throw new Error('get: must be implemented');
  }

  keys() {
    throw new Error('keys: must be implemented');
  }

  hasKey() {
    throw new Error('hasKey: must be implemented');
  }

  dispose() {}

  getObject(key) {
    return JSOON.parse(this.get(key));
  }

  setObject(key, object) {
    return this.set(key, JSON.stringify(object));
  }
}

module.exports = Store;
