var fs = require('fs');
var assert = require('assert');

var ASSETS_FOLDER_PATH = process.env.HOME + '/.local/share/datatringer/';

function toAssetPath(fileName) {
  // TODO add some assertions on result
  return ASSETS_FOLDER_PATH + fileName;
}

function createDirsIfNeeded(fullPath) {
  var tokenizedPath = fullPath.split('/');
  tokenizedPath.pop(); // last element is the filename.

  var currPath = '';
  while (tokenizedPath.length) {
    currPath += tokenizedPath.shift() + '/';
    if (!fs.existsSync(currPath)) {
      fs.mkdirSync(currPath);
    }
  }
}


// same as read, but returns a value instead of calling a callback.
function readSync(assetFileName) {
  assert(assetFileName, 'please, provide an asset name to read an asset');
  var fullPath = toAssetPath(assetFileName);
  return fs.readFileSync(fullPath, 'utf8');
}

// read the asset named assetFileName and return its content thru the
// callback. Assumes the asset contains text.
// callback signature: (err, assetContent)
function read(assetFileName, callback) {
  assert(assetFileName, 'please, provide an asset name to read an asset');
  assert(callback, 'please, provide a callback to do something with read content');
  var fullPath = toAssetPath(assetFileName);
  fs.readFile(fullPath, 'utf8', callback);
}

// write content to the asset named assetFileName. Will be overwritten if
// already existing. If error occurs, the callback is called with the error.
// Otherwise, when done the callback is called without any parameter.
// callback signature: (err)
function write(assetFileName, assetContent, callback) {
  assert(assetFileName, 'please, provide an asset name to write it');
  assert(assetContent, 'empty assets are not allowed');
  assert(callback, 'please, provide a callback to be noticed when job is done');
  var fullPath = toAssetPath(assetFileName);
  createDirsIfNeeded(fullPath);
  fs.writeFile(fullPath, assetContent, 'utf8', callback);
}

module.exports = {
  read: read,
  readSync: readSync,
  write: write
};
