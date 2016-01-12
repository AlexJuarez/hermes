'use strict';

const _ = require('lodash');

class File {
  constructor(path, mtime, doNotCache) {
    this.path = path;
    this.originalPath = path;
    this.contentPath = path;
    this.mtime = mtime;
    this.isUrl = false;

    this.doNotCache = _.isUndefined(doNotCache) ? false : doNotCache;
  }

  toString() {
    return this.path;
  }
}

module.exports = File;
