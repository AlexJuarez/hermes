'use strict';

const JasmineReporter = require('./JasmineReporter');
const NodeEnvironment = require('./../environments/NodeEnvironment');
const path = require('path');
const fs = require('fs');
const constants = require('./../constants');
const updateDriver = require('./browser');
const EventEmitter = require('events');

class Executor extends EventEmitter {
  constructor(driver) {
    super();

    const self = this;

    this.driver = driver;
    this.ready = new Promise((resolve) => {
      self.driver.getTitle().then(() => {
        resolve();
      });
    });
    this.reporter = new JasmineReporter();

    this.reporter.on('result', (result) => {
      self.emit('result', result);
    });

    this.reporter.on('complete', (results) => {
      self.emit('complete', results);
    });

    this.reporter.on('info', (data) => {
      self.emit('info', data);
    });

    this.reporter.on('error', (err) => {
      self.emit('error', err);
    });

    process.on('uncaughtException', (err) => {
      self.emit('error', err);
    });
  }

  execute(testPath) {
    const self = this;
    this.ready.then(() => {
      const enviroment = new NodeEnvironment();
      enviroment.global.browser = updateDriver(self.driver);
      self.start(enviroment, testPath);
    });
  }

  start(enviroment, testPath) {
    const self = this;
    enviroment.runSourceText(constants.JASMINE_2, constants.JASMINE_PATH);

    const requireJasmine = enviroment.global.jasmineRequire;
    const jasmine = requireJasmine.core(requireJasmine);
    const jasmineEnv = jasmine.getEnv();
    const jasmineInterface = requireJasmine.interface(jasmine, jasmineEnv);
    Object.assign(enviroment.global, jasmineInterface);
    enviroment.global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;

    jasmineEnv.addReporter(self.reporter);

    executeTest(enviroment, testPath);

    jasmineEnv.execute();
  }
}

function constructBoundRequire(modulePath) {
  const currDir = path.dirname(modulePath);
  return (p) => {
    return require(path.resolve(currDir, p));
  };
}

function template(evalResultVariable, source) {
  return `({"${evalResultVariable}": function(module, exports, require,` +
    ` __dirname, _filename, global){${source}
}});`;
}

function executeTest(enviroment, testFilePath) {
  const testSource = fs.readFileSync(testFilePath);

  const filename = path.basename(testFilePath);
  const evalResultVariable = 'Object.<anonymous>';
  const wrapper = template(evalResultVariable, testSource);
  const wrapperFn = enviroment.runSourceText(wrapper,
    filename)[evalResultVariable];

  const module = {
    __filename: filename,
    exports: {},
    require: constructBoundRequire(testFilePath)
  };

  wrapperFn.call(
    module.exports,
    module,
    module.exports,
    module.require,
    path.dirname(testFilePath),
    filename,
    enviroment.global
  );
}

module.exports = Executor;
