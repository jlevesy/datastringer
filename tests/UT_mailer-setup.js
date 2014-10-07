var sinon = require('sinon'),
    should = require('should'),
    rewire = require('rewire');

var mockAssets = null;

var FAKE_MAILER_SETUP_ASSET_NAME = 'fake';

var mailerSetup = rewire('./scripts/lib/mailer-setup');
mailerSetup.__set__('MAILER_SETUP_FILE', FAKE_MAILER_SETUP_ASSET_NAME);

describe('load', function() {

  beforeEach(function() {
    mockAssets = sinon.mock(require('./scripts/lib/assets'));
  });

  afterEach(function() {
    mockAssets.restore();
  });

  it('shouldLoadMailerSetupAssets', function (){
    // given

    var readSetup = {
      setup: 'blah'
    };

    var callback = function(err, setup) {
      // then
      should(err).not.exists;
      should(setup).exists;
      setup.should.be.eql(setup);
      mockAssets.verify();
    };

    mockAssets.expects('read')
              .withArgs(FAKE_MAILER_SETUP_ASSET_NAME, callback)
              .once()
              .callsArgWith(1, null, readSetup);

    // when
    mailerSetup.load(callback);
  });
});
