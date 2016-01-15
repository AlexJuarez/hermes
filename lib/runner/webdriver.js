'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');
const proxy = require('selenium-webdriver/proxy');
const path = require('path');
const constants = require('./../constants');

const service = new chrome.ServiceBuilder(chromeDriver.path).build();
chrome.setDefaultService(service);

const chromeOptions = new chrome.Options();

const loggingPerf = new webdriver.logging.Preferences();
loggingPerf.setLevel(webdriver.logging.Type.PERFORMANCE,
  webdriver.logging.Level.ALL);

chromeOptions.setChromeLogFile(constants.CHROME_LOG_PATH);
chromeOptions.setLoggingPrefs(loggingPerf);
chromeOptions.setPerfLoggingPrefs({
  traceCategories: 'blink.console,disabled-by-default-devtools.timeline'
});
chromeOptions.addArguments('--ignore-certificate-errors');
chromeOptions.addArguments('--start-maximized');

function driver(proxyConfig) {
  return new webdriver.Builder()
    .withCapabilities(chromeOptions.toCapabilities())
    .setProxy(proxy.manual(proxyConfig))
    .build();
}

module.exports = driver;
