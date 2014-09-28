var sinon = require('sinon'),
    should = require('should');

var content = require('./scripts/lib/content');

var FakePromise = function() {
  this.on = function(key, callback) {
    this[key] = callback;
    return this;
  };
};

var mockHttp = null;

describe('getTheJSON', function() {

  beforeEach(function(){
    mockHttp = sinon.mock(require('http'));
  });

  afterEach(function() {
    mockHttp.restore();
  });

  it('shouldBuildaSingleChunkBasedAnswer', function() {
    // given
    var url = 'http://trolololo.com/disclaimer';
    var fakeResponsePromise = new FakePromise();
    var fakeRequestPromise = new FakePromise();

    fakeRequestPromise.end = sinon.stub();

    mockHttp.expects('request')
            .withArgs(url)
            .callsArgWith(1, fakeResponsePromise)
            .returns(fakeRequestPromise);

    // when
    content.getTheJSON(url, function(error, result) {
      // then
      should(result).exist;
      should(error).not.exist;
      should(result).be.eql('IAMGROOT');
      fakeRequestPromise.end.called.should.be.ok;
      mockHttp.verify();
    });

    fakeResponsePromise.data('IAMGROOT');
    fakeResponsePromise.end();
  });

  it('shouldBuildaMultipleChunkBasedAnswer', function() {
    // given
    var url = 'http://api.trolololo.com/troll';
    var fakeResponsePromise = new FakePromise();
    var fakeRequestPromise = new FakePromise();

    fakeRequestPromise.end = sinon.stub();

    mockHttp.expects('request')
            .withArgs(url)
            .callsArgWith(1, fakeResponsePromise)
            .returns(fakeRequestPromise);

    // when
    content.getTheJSON(url, function(error, result) {
      // then
      should(result).exist;
      should(error).not.exist;
      should(result).be.eql('IAMGROOT');
      fakeRequestPromise.end.called.should.be.ok;
      mockHttp.verify();
    });

    fakeResponsePromise.data('I');
    fakeResponsePromise.data('AM');
    fakeResponsePromise.data('GROOT');
    fakeResponsePromise.end();
  });

  it('shouldForbidEmptyUrls', function() {
    // given
    var url = '';
    var exceptionCalled = false;
    // when
    try {
      content.getTheJSON(url, function() {});
    } catch(e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForbidUndefinedCallbacks', function() {
    // given
    var url = 'http://api.trololo.com/troll';
    var exceptionCalled = false;

    // when
    try {
      content.getTheJSON(url);
    } catch (e) {
      exceptionCalled = true;
    }

    // then
    exceptionCalled.should.be.ok;
  });

  it('shouldForwardErrWhenSomethingBadHappensOnHttpSide', function() {
    // given
    var url = 'http://api.trolololo.com/troll';
    var fakeResponsePromise = new FakePromise();
    var fakeRequestPromise = new FakePromise();
    var error = {
      content: 'blah'
    };

    fakeRequestPromise.end = sinon.stub();

    mockHttp.expects('request')
            .withArgs(url)
            .callsArgWith(1, fakeResponsePromise)
            .returns(fakeRequestPromise);

    // when
    content.getTheJSON(url, function(err, result) {
      // then
      should(result).not.exist;
      should(err).exist;
      err.should.be.eql(error)
      fakeRequestPromise.end.called.should.be.ok;
      mockHttp.verify();
    });

    fakeRequestPromise.error(error);
  });

});
