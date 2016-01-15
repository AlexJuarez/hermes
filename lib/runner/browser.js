'use strict';

const webdriver = require('selenium-webdriver');

function updateDriver(driver) {
  driver.select = webdriver.By.css;

  return driver;
}

module.exports = updateDriver;
