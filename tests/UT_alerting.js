var sinon = require('sinon'),
    should = require('should');

var mockMailer = null;

var alerting = require('./scripts/lib/alerting');

describe('#alert', function() {

  beforeEach(function() {
    mockMailer = sinon.mock(require('./scripts/lib/mailer'));
  });

  afterEach(function() {
    mockMailer.restore(); 
  });

  it('shouldSendAlertIfArgumentAreCorrectlyProvided', function() {
    // given

    var stringerName = 'radio';
    var content = 'blah';

    mockMailer.expects('sendAlert')
              .once()
              .withArgs(stringerName, content);

    // when
    alerting.alert(stringerName, content);
  });

  it('shouldThrowAnErrorIfNoStringerNameIsProvided', function() {
    // given
    var stringerName = null;
    var content = 'blah';
    var exceptionThrown = false;

    // when
    try {
      alerting.alert(stringerName, content);
    } catch(e) {
      exceptionThrown = true;
    }

    exceptionThrown.should.be.ok;
  });

  it('shouldThrowAnErrorIfNoDataIsProvided', function() {
    // given
    var stringerName = 'bad';
    var content = null;
    var exceptionThrown = false;

    // when
    try {
      alerting.alert(stringerName, content);
    } catch(e) {
      exceptionThrown = true;
    }

    exceptionThrown.should.be.ok;
  });
});
