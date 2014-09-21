var async = require('async'),
    _ = require('underscore');

var useCases = require('./useCases');

var MAX_JOBS = process.env.DS_MAX_JOBS !== undefined ? process.env.DS_MAX_JOBS : 5;

function transformToJobs(descriptors) {
  return _.map(descriptors, function(descriptor) {
    return function(job_callback) {
      useCases.load(descriptor, function(err, useCase) {
        if (err) {
          job_callback(err);
          return;
        }

        useCase.execute();
        job_callback(null);
      });
    };
  });
}

function run(startCallback, endCallback) {
  useCases.readDescriptors(function(err, descriptors) {
    if(err) {
      startCallback(err);
      return;
    }

    var jobs = transformToJobs(descriptors);

    async.parallelLimit(jobs, MAX_JOBS, function(err) {
      endCallback(err);
    });

    startCallback(null,'OK');
  });
}

module.exports = {
  run: run
};
