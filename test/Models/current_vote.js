var CurrentVote = require('../../src/models/current_vote.js');
var expect = require('chai').expect;


describe('Current Vote', function() {
  it('creates a current vote', function(){
    var subject = new CurrentVote('id', 10, 11);
    expect(subject.id).to.eql('id');
    expect(subject.yes).to.eql(10);
    expect(subject.no).to.eql(11);
  });
  it('creates an empty currentvote', function(){
    var subject = new CurrentVote();
    expect(subject.id).to.eql(undefined);
    expect(subject.yes).to.eql(undefined);
    expect(subject.no).to.eql(undefined);
  });
  it('doesnt assign percentage if yes or no arent defined', function(){
    var subject = new CurrentVote('id', 10);
    expect(subject.yes).to.eql(10);
    expect(subject.no).to.eql(undefined);
    subject.getPercentage();
    expect(subject.noPercentage).to.eql(undefined);
    expect(subject.yesPercentage).to.eql(undefined);
  });
  it('assign percentage if yes or no are defined', function(){
    var subject = new CurrentVote('id', 10, 40);
    expect(subject.yes).to.eql(10);
    expect(subject.no).to.eql(40);
    subject.getPercentage();
    expect(subject.noPercentage).to.eql(80);
    expect(subject.yesPercentage).to.eql(20);
  });

});
