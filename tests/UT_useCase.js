var should = require('should'),
    sinon = require('sinon');

var UseCase = require('./scripts/lib/useCase');

describe('#execute', function() {

  it('should execute the stringer with given parameters', function() {
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

});
