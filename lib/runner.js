'use strict';

const JasmineReporter = require('./JasmineReporter');
const driver = require('./webdriver')();
const NodeEnvironment = require('./environments/NodeEnvironment');
const path = require('path');
const fs = require('fs');

const JASMINE_PATH = './../vendor/jasmine-2.4.1.js';
const jasmineFileContent = fs.readFileSync(require.resolve(JASMINE_PATH),
  'utf8');

function start(enviroment, testPath) {
  enviroment.runSourceText(jasmineFileContent, JASMINE_PATH);

  const requireJasmine = enviroment.global.jasmineRequire;
  const jasmine = requireJasmine.core(requireJasmine);
  const jasmineEnv = jasmine.getEnv();
  const jasmineInterface = requireJasmine.interface(jasmine, jasmineEnv);

  Object.assign(enviroment.global, jasmineInterface);
  const reporter = new JasmineReporter({driver: driver});
  jasmineEnv.addReporter(reporter);
  jasmineEnv.defaultTimeoutInterval = 15000;

  executeTest(enviroment, testPath);
  jasmineEnv.execute();
  return reporter.getResults();
}

function runTest(testFilePath) {
  const enviroment = new NodeEnvironment();
  enviroment.testFilePath = testFilePath;
  enviroment.global.browser = driver;
  return start(enviroment, testFilePath);
}

function constructBoundRequire(modulePath) {
  const currDir = path.dirname(modulePath);
  return (p) => {
    return require(path.resolve(currDir, p));
  };
}

function executeTest(enviroment, testFilePath) {
  const testSource = fs.readFileSync(testFilePath);

  const evalResultVariable = 'Object.<anonymous>';
  const wrapper = `({"${evalResultVariable}": function(module, exports, require, __dirname, _filename, global){${testSource}\n}});`;

  const filename = path.basename(testFilePath);
  const wrapperFn = enviroment.runSourceText(wrapper, filename)[evalResultVariable];

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

module.exports = runTest;
