'use strict';

module.exports = () => {
  const globals = {};
  return Object.assign(globals, global);
};
