'use strict';

const Adapter = require('hermes-adapter');
const JasmineReporter = require('./lib/JasmineReporter');
const constants = require('./lib/constants');

class JasmineAdapter extends Adapter {
  constructor(emitter) {
    super();
    this.reporter = new JasmineReporter();

    this.reporter.on('result', (result) => {
      emitter.emit('result', result);
    });

    this.reporter.on('complete', (results) => {
      emitter.emit('complete', results);
    });

    this.reporter.on('info', (data) => {
      emitter.emit('info', data);
    });

    this.reporter.on('error', (err) => {
      emitter.emit('error', err);
    });
  }

  preExecute(enviroment, testPath) {
    enviroment.runSourceText(constants.JASMINE_2, constants.JASMINE_PATH);

    const requireJasmine = enviroment.global.jasmineRequire;
    const jasmine = requireJasmine.core(requireJasmine);
    this.jasmineEnv = jasmine.getEnv();
    const jasmineInterface = requireJasmine.interface(jasmine, this.jasmineEnv);
    Object.assign(enviroment.global, jasmineInterface);
    enviroment.global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;

    this.jasmineEnv.addReporter(this.reporter);
  }

  postExecute() {
    this.jasmineEnv.execute();
  }
}

module.exports = {
  adapters: [JasmineAdapter]
};
