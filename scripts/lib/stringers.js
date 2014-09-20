
var STRINGERS_DIRECTORY = process.env.DS_STRINGERS_DIRECTORY;

function loadOne(stringerName, callback) {
  var err = null;
  var stringer = null;

  try {
    stringer = require(STRINGERS_DIRECTORY + '/' + stringerName);
  } catch(e) {
    err = e;
  }
  callback(err, stringer);
}

module.exports = {
  loadOne: loadOne
};
