'use strict';

const FileList = require('./file-list');
const Watcher = require('./watcher');
const EventEmitter = require('events');
const helper  = require('hermes-util');

class Tracker extends EventEmitter {
  constructor(config) {
    super();
    const self = this;
    const conf = this._config = config || {};
    this._files = [];
    this._fileList = new FileList(conf);

    if (conf.autoWatch) {
      this._watcher = new Watcher(conf, this._fileList);
      this.on('exit', () => {
        self._watcher.emit('exit');
      });
    }

    this._fileList.on('file_list_modified', (files) => {
      self.diff(files);
    });
  }

  diff(files) {
    const self = this;
    const changed = [];

    files.forEach((file) => {
      let index = self._files.indexOf(file);
      if (index > -1) {
        if (self._files[index].mtime < file.mtime) {
          changed.push(file);
        }
      } else {
        changed.push(file);
      }
    });

    this._files = helper.copy(files);
    this.emit('changed', changed);
  }

  refresh() {
    return this._fileList.refresh();
  }
}

module.exports = Tracker;
