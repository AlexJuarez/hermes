#!/usr/bin/env bash
'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');
const path = require('path');
const proxy = require('selenium-webdriver/proxy');
const Promise = require('bluebird');
const Server = require('./server');
const fs = require('fs');

const service = new chrome.ServiceBuilder(chromeDriver.path).build();
chrome.setDefaultService(service);

const chromeOptions = new chrome.Options();

const loggingPerf = new webdriver.logging.Preferences();
loggingPerf.setLevel(webdriver.logging.Type.PERFORMANCE,
  webdriver.logging.Level.ALL);

chromeOptions.setChromeLogFile(path.resolve(__dirname, './../chrome.log'));
chromeOptions.setLoggingPrefs(loggingPerf);
chromeOptions.setPerfLoggingPrefs({
  traceCategories: 'blink.console,disabled-by-default-devtools.timeline'
});
chromeOptions.addArguments('--ignore-certificate-errors');
chromeOptions.addArguments('--start-maximized');

const driver = new webdriver.Builder()
  .withCapabilities(chromeOptions.toCapabilities())
  .setProxy(proxy.manual({
    https: 'localhost:3000',
    http: 'localhost:3000'
  }))
  .build();

function Run() {
  const server = new Server();

  server.on('ready', () => {
    Promise.all([
      driver.manage().window().maximize(),
      driver.get('https://facebook.com'),
      driver.getTitle().then(function(title) {
        console.log(title);
      }),
      driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE)
        .then((entries) => {
          var traces = entries.map((entry) => {
            return JSON.parse(entry.message);
          });

          fs.writeFileSync(path.resolve(__dirname, './../trace.log'),
            JSON.stringify(traces, null, ' '));
        })
    ])
    .error((err) => {
      console.log(err);
    })
    .finally(() => {
      driver.quit();
      server.close();
      console.log('exiting');
    });
  });

  server.startup();
}

module.exports.Run = Run;
