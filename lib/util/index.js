'use strict';

const _ = require('lodash');

function isDefined(o) {
  return !_.isUndefined(o);
}

exports.isDefined = isDefined;
exports.isFunction = _.isFunction;
exports.isString = _.isString;
exports.isObject = _.isObject;
exports.isArray = _.isArray;
exports.copy = _.cloneDeep;
exports.defaults = _.defaults;
