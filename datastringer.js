var fs = require('fs');
var runner = require('./scripts/lib/runner');

runner.run(function(err) {
  console.log('started', err);
}, function(err) {
  console.log('ended', err);
});

