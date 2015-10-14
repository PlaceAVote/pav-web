var expect = require('chai').expect;
var fixtures = require('../fixtures/legislator.js');
var Legislator = require('../../src/models/legislator.js');

describe('Legislator', function(){
  it('returns empty object if options arent defined', function(){
    var subject = new Legislator();
    expect(subject).to.eql({});
  });
  it('returns object with options included', function(){
    var subject = new Legislator(fixtures);
    expect(subject).to.eql({properties: fixtures});
  });
});
