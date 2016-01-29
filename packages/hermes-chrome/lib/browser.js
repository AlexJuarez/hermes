'use strict';

const webdriver = require('selenium-webdriver');

function updateDriver(driver) {
  driver.select = webdriver.By.css;
  driver.keys = webdriver.Key;

  return driver;
}

module.exports = updateDriver;
