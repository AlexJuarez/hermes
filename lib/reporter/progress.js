'use strict';

const Reporter = require('./');
const helper = require('./../util/');
const chalk = require('chalk');

const SPEC_FAILURE = (name) => {
  return chalk.red(`${name} FAILED`);
};

const SPEC_SUCCESS = (name) => {
  return chalk.green(`${name} SUCCESS`);
};

class ProgressReporter extends Reporter {
  constructor(conf) {
    super(conf);
    this.adapters = [conf.adapter || process.stdout.write.bind(process.stdout)];
  }

  synopsis() {
    return 'reports the progress as results return';
  }

  write(msg) {
    this.adapters.forEach((adapter) => {
      adapter(msg);
    });
  }

  failure(result) {
    const specName = result.suite.join(' ') + ' ' + result.description;
    const failed = result.executed - result.success;
    let msg = SPEC_FAILURE(specName);
    msg += chalk.red(`: ${failed}/${result.executed} -` +
      ` ${helper.formatTime(result.time)}\n`);
    msg += chalk.red.apply(null, result.log);

    this.write(msg);
  }

  success(result) {
    const specName = result.suite.join(' ') + ' ' + result.description;
    let msg = SPEC_SUCCESS(specName);
    msg += chalk.green(`: ${result.success}/` +
      `${result.executed} - ${helper.formatTime(result.time)}\n`);

    this.write(msg);
  }

  aggregate(results) {
    const output = {};

    results.forEach((result) => {
      if (!output[result.id]) {
        output[result.id] = {
          success: result.success ? 1 : 0,
          time: result.time,
          skipped: result.skipped,
          suite: result.suite,
          description: result.description,
          id: result.id,
          executed: 1,
          log: result.log
        };
      } else {
        let stats = output[result.id];
        stats.success += result.success ? 1 : 0;

        // compute a moving average of the time
        stats.time = ((stats.time * stats.executed) / (stats.executed + 1) +
          result.time / (stats.executed + 1));
        stats.executed++;

        result.log.forEach((entry) => {
          if (stats.log.indexOf(entry) === -1) {
            stats.log.push(entry);
          }
        });
      }
    });

    return output;
  }

  writeReport(results) {
    results = this.aggregate(
      helper.flatten(results.map((result) => result.results))
    );
    Object.keys(results).forEach((id) => {
      let result = results[id];
      if (result.success === result.executed) {
        this.success(result);
      } else {
        this.failure(result);
      }
    });
  }
}

module.exports = ProgressReporter;
