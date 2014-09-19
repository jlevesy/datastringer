var should = require('should'),
    sinon = require('sinon');

var alerting = require('./scripts/lib/alerting');
var UseCase = require('./scripts/lib/useCase');

describe('#execute', function() {

  it('shouldExecuteTheStringerWithGivenParameters', function() {
    // given
    var spy = sinon.spy();
    var parameters = ['ALLO', 'UI'];

    var useCase = new UseCase(parameters, spy);
    // when
    useCase.execute();

    // then
   spy.calledOnce.should.be.ok;
   spy.calledWith(parameters[0], parameters[1]).should.be.ok;
  });

  it('shouldAppendAlertingCallbackOnParametersArray', function() {
    // given
    var parameters = ["ALLO", "UI"];
    var stringer = sinon.stub();

    // when
    new UseCase(parameters, stringer);

    // then
    var last = parameters.pop();
    last.should.be.eql(alerting.alert);
  });

});
