var expect = require('chai').expect;
var stateMappings = require('../../src/utils/state_mappings.js');

describe('StateMappings', function() {
  it('returns the initial value if a state is not recognised', function() {
    var fullName = stateMappings('BATMAN');
    expect(fullName).to.eql('BATMAN');
  });
  it('returns the full name of the state when known', function() {
    var fullName = stateMappings('CA');
    expect(fullName).to.eql('California');
  });
});
