// Libs
var should = require('should'),
    sinon = require('sinon'),
    rewire = require('rewire');

// Defining mocks
var mockAssets = sinon.mock(require('./scripts/lib/assets')),
    mockStringers = sinon.mock(require('./scripts/lib/stringers'));

// Defining constants

var USE_CASE_DESCRIPTORS_FILE = 'fake';

var descriptors = [
  {
    "stringer": "grootStringer",
    "parameters": ["I", "AM", "GROOT"]
  },
  {
    "stringer": "obiwanStringer",
    "parameters": ["USE", "THE", "FORCE"]
  }
];
// Building Tested object
var useCases = rewire('./scripts/lib/useCases');
useCases.__set__('USE_CASE_DESCRIPTORS_FILE', USE_CASE_DESCRIPTORS_FILE);

describe('#readDescriptors', function() {

  beforeEach(function() {
    mockAssets = sinon.mock(require('./scripts/lib/assets'));
  });

  afterEach(function() {
    mockAssets.restore();
  });

  it('shouldReadDescriptorsFromAssetsWhenAssetIsProvided', function() {

    mockAssets.expects('read')
             .withArgs(USE_CASE_DESCRIPTORS_FILE)
             .once()
             .callsArgWith(1,null, descriptors);

    // when
    useCases.readDescriptors(function(err, result) {
      // then
      should.not.exist(err);
      should.exist(result);
      result.should.be.eql(descriptors);
      mockAssets.verify();
    });
  });

  it('shouldForwardErrorWhenAssetIsUnavailable', function() {
    // given
    var error = {
      code: 'BIM'
    };

    mockAssets.expects('read')
             .withArgs(USE_CASE_DESCRIPTORS_FILE)
             .once()
             .callsArgWith(1,error, null);

    // when
    useCases.readDescriptors(function(err, result) {
      // then
      should.not.exist(result);
      should.exist(err);
      error.should.be.eql(err);
      mockAssets.verify();
    });
  });

  it('shouldAssertLoadedDataIsAnArray', function() {
    // given
    var bad_descriptor = 'ALLO';

    mockAssets.expects('read')
             .callsArgWith(1, null, bad_descriptor);

    //useCases.readDescriptors.should.throw('Use cases descriptors must be presented as an array');
    // TODO investigate why it doesn't work.

    var exceptionCalled = false;

    // when
    try {
      useCases.readDescriptors(null);
    } catch(e) {
      exceptionCalled = true;
      e.message.should.be.eql('Use cases descriptors must be presented as an array');
    }

    exceptionCalled.should.be.ok;
  });
});

describe('#load', function() {

  beforeEach(function() {
    mockStringers = sinon.mock(require('./scripts/lib/stringers'));
  });

  afterEach(function() {
    mockStringers.restore();
  });

  it('shouldLoadRequiredUseCaseWhenExist', function() {
    // given

    var stubStringer = sinon.stub();

    mockStringers.expects('loadOne')
                 .once()
                 .withArgs(descriptors[0].stringer)
                 .callsArgWith(1, null, stubStringer);

    // when
    useCases.load(descriptors[0], function(err, useCase) {
      // then
      should.not.exist(err);
      should.exist(useCase);
      useCase.parameters.should.be.eql(descriptors[0].parameters);
      useCase.stringer.should.be.eql(stubStringer);
      mockStringers.verify();
    });
  });

  it('shouldThrowAnErrorWhenDescriptorHasNotAValidStringerName', function() {
    // given

    var bad_descriptor = {
      stringer: 10,
      parameters: ["BAD"]
    };

    var exceptionCalled = false;

    // when
    try {
      useCases.load(bad_descriptor, null);
    } catch(e) {
      exceptionCalled = true;
      e.message.should.be.eql('descriptor must provide a string stringer name');
    }

    exceptionCalled.should.be.ok;
  });

  it('shouldThrowAnErrorWhenDescriptorHasNotValidParameters', function() {
    // given
    var bad_descriptor = {
      stringer: 'BAD',
      parameters: 10
    };

    var exceptionCalled = false;

    // when
    try {
      useCases.load(bad_descriptor, null);
    } catch(e) {
      exceptionCalled = true;
      e.message.should.be.eql('descriptor must provide an Array of Parameters');
    }

    exceptionCalled.should.be.ok;
  });

  it('shouldForwardAnErrorIfStringerCannotBeLoaded', function() {
    // given
    var error = {
      message: 'cannot'
    };

    mockStringers.expects('loadOne')
                 .once()
                 .withArgs(descriptors[0].stringer)
                 .callsArgWith(1, error, null);


    // when
    useCases.load(descriptors[0], function(error, useCase){
      // then
      should.exist(error);
      should.not.exist(useCase);
      mockStringers.verify();
    });

  });

});
