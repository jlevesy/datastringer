var sinon = require('sinon'),
    should = require('should'),
    rewire = require('rewire');

var TEST_STRINGERS_DIRECTORY =  __dirname + '/tests_stringers';

var stringers = rewire('./scripts/lib/stringers');

stringers.__set__('STRINGERS_DIRECTORY', TEST_STRINGERS_DIRECTORY);

describe('#loadOne', function() {

  it('shouldLoadAStringerByNameIfExists', function() {
    // given
    var stringerName = 'darthvader';

    // when
    stringers.loadOne(stringerName, function(err, res) {
      // then
      should.not.exist(err);
      should.exist(res);
      should.ok(res instanceof Function);
    });
  });

  it('shouldForwardAnErrorIfStringerCannotBeLoaded', function() {
    // given
    var stringerName = 'anakin'; // does not exist anymore

    // when
    stringers.loadOne(stringerName, function(err, res) {
      // then
      should.exist(err);
      should.not.exist(res);
    });
  });

});
