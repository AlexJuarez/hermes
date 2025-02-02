'use strict';

const helper = require('hermes-util');

class File {
  constructor(path, mtime, doNotCache) {
    this.path = path;
    this.originalPath = path;
    this.contentPath = path;
    this.mtime = mtime;
    this.isUrl = false;
    this.doNotCache = helper.isUndefined(doNotCache) ? false : doNotCache;
  }

  toString() {
    return this.path;
  }
}

module.exports = File;
