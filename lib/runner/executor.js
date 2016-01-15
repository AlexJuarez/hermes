'use strict';

const JasmineReporter = require('./JasmineReporter');
const NodeEnvironment = require('./../environments/NodeEnvironment');
const path = require('path');
const fs = require('fs');
const constants = require('./../constants');
const updateDriver = require('./browser');

function execute(testFilePath, driver) {
  const enviroment = new NodeEnvironment();
  enviroment.global.browser = updateDriver(driver);
  return start(enviroment, testFilePath);
}

function start(enviroment, testPath) {
  enviroment.runSourceText(constants.JASMINE_2, constants.JASMINE_PATH);

  const requireJasmine = enviroment.global.jasmineRequire;
  const jasmine = requireJasmine.core(requireJasmine);
  const jasmineEnv = jasmine.getEnv();
  const jasmineInterface = requireJasmine.interface(jasmine, jasmineEnv);
  Object.assign(enviroment.global, jasmineInterface);

  const reporter = new JasmineReporter();
  jasmineEnv.addReporter(reporter);
  jasmineEnv.defaultTimeoutInterval = 15000;

  executeTest(enviroment, testPath);

  jasmineEnv.execute();
  return reporter;
}

function constructBoundRequire(modulePath) {
  const currDir = path.dirname(modulePath);
  return (p) => {
    return require(path.resolve(currDir, p));
  };
}

function template(evalResultVariable, source) {
  return `({"${evalResultVariable}": function(module, exports, require,` +
    ` __dirname, _filename, global){${source}\n}});`;
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

module.exports = execute;
