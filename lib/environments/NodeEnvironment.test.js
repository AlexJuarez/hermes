'use strict';

const NodeEnvironment = require('./NodeEnvironment');

describe('NodeEnvironment', () => {
  it('uses a copy of the process object', () => {
    const env1 = new NodeEnvironment();
    const env2 = new NodeEnvironment();

    expect(env1.global.process).not.toEqual(env2.global.process);
  });

  it('exposes process.on', () => {
    const env1 = new NodeEnvironment();

    expect(env1.global.process.on).not.toEqual(null);
  })
});
