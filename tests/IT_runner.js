var sinon = require('sinon'),
    should = require('should'),
    rewire = require('rewire');

var mockUseCases = null;

var runner = require('./scripts/lib/runner');

var descriptors = [
  {
    stringer: 'one',
    parameters: ['LALALAL']
  },
  {
    stringer: 'two',
    prarameters: ['LOLOLO']
  },
  {
    stringer :'three',
    parameters: ['LELELELE']
  }
];

describe('#run', function() {

  beforeEach(function() {
    mockUseCases = sinon.mock(require('./scripts/lib/useCases'));
  });

  afterEach(function() {
    mockUseCases.restore();
  });

  it('shouldRunAllAvailableUseCasesWhenEverythingIsFine', function() {
    // given
    var useCases = [
      {
        execute: sinon.stub()
      },
      {
        execute: sinon.stub()
      },
      {
        execute: sinon.stub()
      }
    ];

    mockUseCases.expects('readDescriptors')
                .once()
                .callsArgWith(0, null, descriptors);

    mockUseCases.expects('load')
                .exactly(3)
                .onFirstCall().callsArgWith(1, null, useCases[0])
                .onSecondCall().callsArgWith(1, null, useCases[1])
                .onThirdCall().callsArgWith(1, null, useCases[2]);

    var onBeginCallbackCalled = false;
    var onEndCallbackCalled = false;
    // when 
    runner.run(function(err) {
      // then
      should(err).not.exist;
      onBeginCallbackCalled = true;
    },
    function(err) {
      should(err).not.exist;
      useCases[0].execute.called.should.be.ok;
      useCases[1].execute.called.should.be.ok;
      useCases[2].execute.called.should.be.ok;
      onEndCallbackCalled = true;
    });

    onBeginCallbackCalled.should.be.ok;
    onEndCallbackCalled.should.be.ok;
    mockUseCases.verify();
  });

  it('shouldReportAnErrorWhenAJobFailToLoadAUseCase', function() {
    // given
    var useCases = [
      {
        execute: sinon.stub()
      },
      {
        execute: sinon.stub()
      },
      {
        execute: sinon.stub()
      }
    ];

    var error = {
      msg: 'error'
    };

    mockUseCases.expects('readDescriptors')
                .once()
                .callsArgWith(0, null, descriptors);

    mockUseCases.expects('load')
                .exactly(3)
                .onFirstCall().callsArgWith(1, null, useCases[0])
                .onSecondCall().callsArgWith(1, null, useCases[1])
                .onThirdCall().callsArgWith(1, error, null);

    var onBeginCallbackCalled = false;
    var onEndCallbackCalled = false;

    // when 
    runner.run(function(err) {
      // then
      should(err).not.exist;
      onBeginCallbackCalled = true;
    },
    function(err) {
      should(err).exist;
      err.should.be.eql(error);
      useCases[0].execute.called.should.be.ok;
      useCases[1].execute.called.should.be.ok;
      useCases[2].execute.called.should.not.be.ok;
      onEndCallbackCalled = true;
    });

    onBeginCallbackCalled.should.be.ok;
    onEndCallbackCalled.should.be.ok;
    mockUseCases.verify();
  });

  it('shouldReportAnErrorWhenItFailsToLoadUseCaseDesriptors', function() {
    // given

    var error = {
      msg: 'error'
    };

    mockUseCases.expects('readDescriptors')
                .once()
                .callsArgWith(0, error, null);

    var onBeginCallbackCalled = false;

    // when 
    runner.run(function(err){
      // then
      should(err).exist;
      err.should.be.eql(error);
      onBeginCallbackCalled = true;
    });

    onBeginCallbackCalled.should.be.ok;
    mockUseCases.verify();
  });
});
