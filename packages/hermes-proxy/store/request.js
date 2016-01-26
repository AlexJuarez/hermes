'use strict';

const Store = require('hermes-store');
const requestUtils = require('./../util/requestParser');

class RequestStore extends Store {
  constructor(opts) {
    super(opts);
    this._cache = Object.create(null);
    this._numRequests = 0;
    this._cacheSize = 0;
  }

  keys() {
    return Object.keys(this._cache);
  }

  hasKey(req) {
    return !!this.get(req);
  }

  size() {
    return this._cacheSize;
  }

  length() {
    return this._numRequests;
  }

  set(req, body, resp) {
    const url = requestUtils.url(req);
    const method = requestUtils.method(req);
    const headers = requestUtils.headers(req);
    const key = requestUtils.makeKey(headers);
    if (!this._cache[url]) {
      this._cache[url] = {};
    }

    let bucket = this._cache[url];
    if (!bucket[method]) {
      bucket[method] = {};
    }

    bucket = bucket[method];
    if (!bucket[key]) {
      this._numRequests++;
    } else {
      this._cacheSize -= bucket[key].length;
    }

    this._cacheSize += body.length;
    bucket[key] = {resp: resp, body: body};
  }

  get(req) {
    const url = requestUtils.url(req);
    const method = requestUtils.method(req);
    const headers = requestUtils.headers(req);
    const key = requestUtils.makeKey(headers);

    let bucket = this._cache[url];
    if (!bucket) {
      return;
    }

    bucket = bucket[method];
    if (!bucket) {
      return;
    }

    return bucket[key];
  }
}

module.exports = RequestStore;
