'use strict';

const NodeEnvironment = require('./../environments/NodeEnvironment');
const path = require('path');
const fs = require('fs');
const constants = require('hermes-constants');
const updateDriver = require('./browser');
const EventEmitter = require('events');
const resolver = require('./../resolver');

class Executor extends EventEmitter {
  constructor(driver, adapters) {
    super();

    const self = this;

    this.driver = driver;
    this.ready = new Promise((resolve) => {
      self.driver.getTitle().then(() => {
        resolve();
      });
    });

    this.adapters = adapters.map((plugin) => {
      return (new (resolver.resolve(plugin))(self));
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
    this.adapters.forEach((module) => {
      module.preExecute(enviroment, testPath);
    });
    executeTest(enviroment, testPath);
    this.adapters.forEach((module) => {
      module.postExecute(enviroment, testPath);
    });
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
