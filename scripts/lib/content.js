var h = require('http');
var assert = require('assert');

function getTheJSON(opt, callback) {
  assert(opt, 'must provide a valid url to fetch');
  assert(callback, 'must provide a callback');

  var json = String();
  var req = h.request(opt, function(response) {
    response.on('data', function(data) {
      json += data;
    });
    response.on('end', function() {
      callback(null, json);
    });
  }).on('error', function(err){
    callback(err, null);
  });

  req.end();
}

module.exports = {
  getTheJSON: getTheJSON
};
