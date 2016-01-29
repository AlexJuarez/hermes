'use strict';

const File = require('./../file');
const FileStore = require('./file');

const pattern = '*.js';

describe('FileStore', () => {
  let fileStore;

  beforeEach(() => {
    fileStore = new FileStore();
    let file = new File('test.js');
    fileStore.set(pattern, [file]);
  });

  it('exists should return true or false', () => {
    expect(fileStore.exists('test.js')).toBeTruthy();
    expect(fileStore.exists('test2.js')).toBeFalsy();
    expect(fileStore.exists('')).toBeFalsy();
  });

  it('findPattern should return the pattern for a path', () => {
    expect(fileStore.findPattern('test.js')).toEqual('*.js');
    expect(fileStore.findPattern('test.json')).toBeFalsy();
  });

  it('addFile should add a file if a pattern is found', () => {
    let file = new File('test2.js');

    fileStore.addFile(file);
    expect(fileStore.files()).toContain(file);
  });

  it('removeFile should remove a file', () => {
    let file = fileStore.findFile('test.js');
    fileStore.removeFile(file);
    expect(fileStore.files()).toEqual([]);
  });

  it('files should return the files currently in the fileStore', () => {
    let file = fileStore.findFile('test.js');
    expect(fileStore.files()).toEqual([file]);
  });
});
