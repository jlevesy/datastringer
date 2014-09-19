var alerting = require('./alerting');

function UseCase(parameters, stringer) {
  this.parameters = parameters;
  this.stringer = stringer;

  this.parameters.push(alerting.alert);

  this.execute = function() {
    stringer.apply(this, parameters);
  };
}

module.exports = UseCase;
