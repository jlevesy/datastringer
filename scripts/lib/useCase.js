function UseCase(parameters, stringer) {
  this.parameters = parameters;
  this.stringer = stringer;

  this.execute = function() {
    stringer.apply(this, parameters);
  };
}

module.exports = UseCase;
