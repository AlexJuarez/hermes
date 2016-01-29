#!/usr/bin/env bash
'use strict';

const parseConfig = require('./config/parse');
const findConfig = require('./config/find');
const Coordinator = require('./coordinator');

function Run() {
  const conf = parseConfig(findConfig());
  const coordinator = new Coordinator(conf);
}

module.exports.Run = Run;
