'use strict';

const _ = require('lodash');

function isDefined(o) {
  return !_.isUndefined(o);
}

/**
 * Formats milliseconds into a greater
 * time signature.
 *
 * @param {number} time - the time in ms
 * @returns {string}
 */

function formatTime(time) {
  if (time < 1000) {
    return round(time, 2) + 'ms';
  }
  time /= 1000;
  if (time < 60) {
    return round(time, 2) + 's';
  }
  time /= 60;
  if (time < 60) {
    return round(time, 2) + 'm';
  }
  time /= 60;
  return round(time, 2) + 'hrs';
}

function round(num, places) {
  return +(Math.round(num + 'e+' + places) + 'e-' + places);
}

exports.isDefined = isDefined;
exports.isFunction = _.isFunction;
exports.isString = _.isString;
exports.isObject = _.isObject;
exports.isArray = _.isArray;
exports.copy = _.cloneDeep;
exports.defaults = _.defaults;
exports.uniqWith = _.uniqWith;
exports.flatten = _.flatten;
exports.isEqual = _.isEqual;
exports.formatTime = formatTime;
