'use strict';

function deepCopy(obj) {
  const newObj = {};
  let value;
  for (const key in obj) {
    value = obj[key];
    if (typeof value === 'object' && value !== null) {
      value = deepCopy(value);
    }
    newObj[key] = value;
  }
  return newObj;
}

module.exports = deepCopy;
