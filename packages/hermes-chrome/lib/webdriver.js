'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');
const proxy = require('selenium-webdriver/proxy');
const path = require('path');
const constants = require('hermes-constants');

const service = new chrome.ServiceBuilder(chromeDriver.path).build();
chrome.setDefaultService(service);

const chromeOptions = new chrome.Options();

const loggingPerf = new webdriver.logging.Preferences();
loggingPerf.setLevel(webdriver.logging.Type.PERFORMANCE,
  webdriver.logging.Level.ALL);

chromeOptions.setChromeLogFile(constants.CHROME_LOG_PATH);
chromeOptions.setLoggingPrefs(loggingPerf);
chromeOptions.setPerfLoggingPrefs({
  traceCategories: 'v8,blink.console,disabled-by-default-devtools.timeline'
});
chromeOptions.addArguments('--ignore-certificate-errors');
chromeOptions.addArguments('--start-maximized');
chromeOptions.addArguments('--remote-debugging-port=9222');

function driver(config) {
  config = config || {};

  if (config.proxy) {
    const proxyConfig = {
      https: `${config.proxy.domain}:${config.proxy.httpPort}`,
      http: `${config.proxy.domain}:${config.proxy.httpPort}`
    };
    chromeOptions.setProxy(proxy.manual(proxyConfig));
  }

  return new webdriver.Builder()
    .withCapabilities(chromeOptions.toCapabilities())
    .build();
}

module.exports = driver;
