var assert = require('assert');
var assets = require('./assets');
var stringers = require('./stringers');
var UseCase = require('./useCase');

var USE_CASE_DESCRIPTORS_FILE = 'stringers_use_cases.json';

function readDescriptors(callback) {
  assets.read(USE_CASE_DESCRIPTORS_FILE, function(err, data) {
    if(!err) {
      assert(data instanceof Array, 'Use cases descriptors must be presented as an array');
    }
    callback(err, data);
  });
}

function load(descriptor, callback) {
  assert(typeof(descriptor.stringer) === 'string', 'descriptor must provide a string stringer name');
  assert(descriptor.parameters instanceof Array, 'descriptor must provide an Array of Parameters');
  stringers.loadOne(descriptor.stringer, function(err, stringer) {
    callback(err, err === null ? new UseCase(descriptor.parameters, stringer) : null);
  });
}

module.exports = {
  readDescriptors: readDescriptors,
  load: load
};
